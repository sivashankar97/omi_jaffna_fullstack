import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';
import { TYPES, SENSITIVE_TYPES } from './constants.js';

const samplePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../scripts/seed-cms.sample.json');
const knownTypes = new Set(Object.keys(TYPES));

/** Drop keys starting with _ (docs / comments in sample JSON). */
export function stripSeedMeta(value) {
  if (Array.isArray(value)) return value.map(stripSeedMeta);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.startsWith('_'))
        .map(([key, v]) => [key, stripSeedMeta(v)])
    );
  }
  return value;
}

function deepMerge(base, patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return patch ?? base;
  const out = { ...(base && typeof base === 'object' && !Array.isArray(base) ? base : {}) };
  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = deepMerge(out[key], value);
    } else if (value !== undefined) {
      out[key] = value;
    }
  }
  return out;
}

export async function loadSampleSeed() {
  return JSON.parse(await readFile(samplePath, 'utf8'));
}

/**
 * Narrow a seed payload to selected page slugs and/or collection types.
 * @param {object} raw
 * @param {{ pages?: string[], types?: string[] } | null} only
 */
export function filterSeedPayload(raw, only) {
  if (!only) return raw;
  const data = stripSeedMeta(raw);
  const pageFilter = Array.isArray(only.pages) ? only.pages.map(String) : null;
  const typeFilter = Array.isArray(only.types) ? only.types.map(String) : null;
  if (!pageFilter && !typeFilter) return raw;

  const pages = Array.isArray(data.pages) ? data.pages : [];
  const items = Array.isArray(data.items) ? data.items : [];
  return {
    ...data,
    pages: pageFilter ? pages.filter((p) => pageFilter.includes(String(p.slug || ''))) : [],
    items: typeFilter ? items.filter((i) => typeFilter.includes(String(i.type || ''))) : [],
  };
}

/** Catalog of seedable sections from a sample/custom JSON (for the CMS UI). */
export function buildSeedCatalog(raw) {
  const data = stripSeedMeta(raw);
  const pages = Array.isArray(data.pages) ? data.pages : [];
  const items = Array.isArray(data.items) ? data.items : [];
  const byType = {};
  for (const item of items) {
    const type = String(item.type || '').trim();
    if (!type) continue;
    byType[type] = (byType[type] || 0) + 1;
  }
  return {
    pages: pages.map((p) => ({
      id: `page:${p.slug}`,
      kind: 'page',
      slug: p.slug,
      label: p.title_en || p.slug,
      count: 1,
    })),
    types: Object.keys(TYPES).filter((t) => t !== 'page').map((type) => ({
      id: `type:${type}`,
      kind: 'type',
      type,
      label: TYPES[type],
      count: byType[type] || 0,
      inSample: Boolean(byType[type]),
    })),
  };
}

/**
 * Apply a CMS seed payload (pages + items).
 * @param {{ draft?: boolean, force?: boolean, only?: { pages?: string[], types?: string[] } }} options
 * @returns {{ counts: Record<string, number>, status: string, force: boolean, only: object|null }}
 */
export async function applyCmsSeed(raw, { draft = false, force = false, only = null } = {}) {
  const data = stripSeedMeta(filterSeedPayload(raw, only));
  const pages = Array.isArray(data.pages) ? data.pages : [];
  const items = Array.isArray(data.items) ? data.items : [];
  if (!pages.length && !items.length) {
    const err = new Error(
      only
        ? 'No matching pages/items in the seed for that section'
        : 'Seed JSON needs a "pages" and/or "items" array'
    );
    err.status = 400;
    throw err;
  }

  const status = draft ? 'draft' : (data.options?.status === 'draft' ? 'draft' : 'published');
  const verifiedOn = new Date().toISOString().slice(0, 10);
  const counts = {};
  const bump = (key, n = 1) => {
    counts[key] = (counts[key] || 0) + n;
  };

  async function upsertPage(db, page) {
    const slug = String(page.slug || '').trim();
    if (!slug) throw Object.assign(new Error('pages[] entry missing slug'), { status: 400 });

    const title = page.title_en || slug;
    const excerpt = page.excerpt_en || '';
    const body = page.body_en || '';
    const topMeta = page.metadata && typeof page.metadata === 'object' ? { ...page.metadata } : {};
    const sections = page.sections && typeof page.sections === 'object' ? page.sections : {};
    if (Object.keys(sections).length) topMeta.sections = sections;

    const existing = await db.query(
      `SELECT id, metadata FROM content_items WHERE type='page' AND slug=$1 LIMIT 1`,
      [slug]
    );

    if (!existing.rowCount) {
      await db.query(
        `INSERT INTO content_items(
           type, slug, title_en, excerpt_en, body_en, metadata, sort_order, status,
           verification_status, last_verified_at, published_at
         ) VALUES (
           'page', $1, $2, $3, $4, $5::jsonb, 0, $6,
           'verified', $7::date, ${draft || status === 'draft' ? 'NULL' : 'now()'}
         )`,
        [slug, title, excerpt, body, topMeta, status, verifiedOn]
      );
      bump('page added');
      return;
    }

    const id = existing.rows[0].id;
    const prev = existing.rows[0].metadata || {};
    let nextMeta;
    if (force) {
      nextMeta = deepMerge(prev, topMeta);
      if (topMeta.sections) nextMeta.sections = deepMerge(prev.sections || {}, topMeta.sections);
    } else {
      nextMeta = deepMerge(topMeta, prev);
      if (topMeta.sections || prev.sections) {
        nextMeta.sections = deepMerge(topMeta.sections || {}, prev.sections || {});
      }
    }

    if (force) {
      await db.query(
        `UPDATE content_items SET
           title_en=$2, excerpt_en=$3, body_en=$4, metadata=$5::jsonb, updated_at=now(),
           status=$6, verification_status='verified',
           last_verified_at=COALESCE(last_verified_at, $7::date),
           published_at=COALESCE(published_at, ${draft || status === 'draft' ? 'NULL' : 'now()'})
         WHERE id=$1`,
        [id, title, excerpt, body, nextMeta, status, verifiedOn]
      );
    } else {
      await db.query(
        `UPDATE content_items SET
           title_en=CASE WHEN title_en IS NULL OR title_en='' THEN $2 ELSE title_en END,
           excerpt_en=CASE WHEN excerpt_en IS NULL OR excerpt_en='' THEN $3 ELSE excerpt_en END,
           body_en=CASE WHEN body_en IS NULL OR body_en='' THEN $4 ELSE body_en END,
           metadata=$5::jsonb, updated_at=now()
         WHERE id=$1`,
        [id, title, excerpt, body, nextMeta]
      );
    }
    bump('page updated');
  }

  async function upsertItem(db, rawItem) {
    const item = stripSeedMeta(rawItem);
    const type = String(item.type || '').trim();
    const slug = String(item.slug || '').trim();
    if (!type || !slug) throw Object.assign(new Error('items[] entry needs type and slug'), { status: 400 });
    if (!knownTypes.has(type)) {
      throw Object.assign(new Error(`Unknown CMS type "${type}"`), { status: 400 });
    }
    if (type === 'page') {
      throw Object.assign(new Error('Put page / block rows under "pages", not "items"'), { status: 400 });
    }

    const title = item.title_en || slug;
    const excerpt = item.excerpt_en || '';
    const body = item.body_en || '';
    const location = item.location_text || '';
    const image = item.image_url || '';
    const media = item.media_url || '';
    const eventDate = item.event_date || null;
    const sort = Number.isFinite(item.sort_order) ? item.sort_order : 0;
    const metadata = {
      ...(item.metadata && typeof item.metadata === 'object' ? item.metadata : {}),
      import_key: item.metadata?.import_key || `seed-cms:${type}:${slug}`,
    };
    const itemStatus = item.status || status;
    const sensitive = SENSITIVE_TYPES.has(type);
    const verification =
      itemStatus === 'published' && (sensitive || item.verification_status === 'verified')
        ? 'verified'
        : item.verification_status || 'pending';

    await db.query(
      `UPDATE content_items SET metadata = metadata || jsonb_build_object('import_key', $3::text)
       WHERE type=$1 AND slug=$2 AND NOT (metadata ? 'import_key')`,
      [type, slug, metadata.import_key]
    );

    const existing = await db.query(
      `SELECT id, metadata FROM content_items
       WHERE type=$1 AND (slug=$2 OR metadata->>'import_key'=$3)
       LIMIT 1`,
      [type, slug, metadata.import_key]
    );

    if (!existing.rowCount) {
      const lastVerified = verification === 'verified' ? verifiedOn : null;
      const publishedAt = itemStatus === 'published' && !draft && status !== 'draft';
      await db.query(
        `INSERT INTO content_items(
           type, slug, title_en, excerpt_en, body_en, location_text, image_url, media_url,
           event_date, metadata, sort_order, status, verification_status, last_verified_at, published_at
         ) VALUES (
           $1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12,$13,$14::date,
           ${publishedAt ? 'now()' : 'NULL'}
         )`,
        [
          type, slug, title, excerpt, body, location, image, media, eventDate, metadata, sort,
          itemStatus, verification, lastVerified,
        ]
      );
      bump(`${type} added`);
      return;
    }

    if (!force) {
      bump(`${type} already present`);
      return;
    }

    const id = existing.rows[0].id;
    const nextMeta = deepMerge(existing.rows[0].metadata || {}, metadata);
    await db.query(
      `UPDATE content_items SET
         slug=$2, title_en=$3, excerpt_en=$4, body_en=$5, location_text=$6, image_url=$7, media_url=$8,
         event_date=$9, metadata=$10::jsonb, sort_order=$11, status=$12, verification_status=$13,
         last_verified_at=CASE WHEN $13='verified' THEN COALESCE(last_verified_at, $14::date) ELSE last_verified_at END,
         published_at=CASE WHEN $12='published' THEN COALESCE(published_at, now()) ELSE published_at END,
         updated_at=now()
       WHERE id=$1`,
      [
        id, slug, title, excerpt, body, location, image, media, eventDate, nextMeta, sort,
        itemStatus, verification, verifiedOn,
      ]
    );
    bump(`${type} updated`);
  }

  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    for (const page of pages) await upsertPage(db, stripSeedMeta(page));
    for (const item of items) await upsertItem(db, item);
    await db.query('COMMIT');
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }

  return { counts, status, force, only: only || null, types: Object.keys(TYPES) };
}
