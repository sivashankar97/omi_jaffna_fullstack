// Seeds / updates Oblate bishop profiles in the CMS.
// 1) Ensures base rows from site/src/content/necrology.ts (bishops list).
// 2) Applies biographies from site/src/content/bishop-details.json (from 16_Bisops_Details.docx).
// Safe to re-run: matches details by birth date, then by name tokens; updates body/excerpt/office.
// Usage: node scripts/import-bishops.js [--draft] [--details-only]
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/db.js';
import { bishops } from '../../site/src/content/necrology.ts';

const draft = process.argv.includes('--draft');
const detailsOnly = process.argv.includes('--details-only');
const status = draft ? 'draft' : 'published';
const verifiedOn = '2026-10-23';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const detailsPath = path.join(root, 'site/src/content/bishop-details.json');

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f’']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 160);

const nameTokens = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f’']/g, '')
    .replace(/\b(rt\.?|rev\.?|arch\.?|bp\.?|bishop|archbishop|mgr\.?|cardinal|h\.?\s*e\.?|omi|theophilus|christopher|jules-joseph|pierre-jean|jean-marie)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 2);

const scoreNames = (a, b) => {
  const ta = nameTokens(a);
  const tb = nameTokens(b);
  if (!ta.length || !tb.length) return 0;
  const setB = new Set(tb);
  const shared = ta.filter((t) => setB.has(t));
  if (!shared.length) return 0;
  const lastBonus = ta[ta.length - 1] === tb[tb.length - 1] ? 2 : 0;
  return shared.length / Math.max(ta.length, tb.length) + lastBonus;
};

const details = JSON.parse(await readFile(detailsPath, 'utf8'));

const db = await pool.connect();
let added = 0;
let skipped = 0;
let updated = 0;
let unmatched = 0;

try {
  await db.query('BEGIN');

  if (!detailsOnly) {
    for (const [index, bishop] of bishops.entries()) {
      const slug = `${bishop.no}-${slugify(bishop.name)}`;
      const metadata = {
        import_key: slug,
        register_no: bishop.no,
        born: bishop.born,
        born_at: bishop.bornAt,
        died: bishop.died,
        died_at: bishop.diedAt,
      };
      await db.query(
        "UPDATE content_items SET metadata=metadata||jsonb_build_object('import_key',slug) WHERE type=$1 AND slug=$2 AND NOT metadata ? 'import_key'",
        ['bishop', slug]
      );
      const r = await db.query(
        `INSERT INTO content_items(type,slug,title_en,excerpt_en,body_en,location_text,image_url,metadata,sort_order,status,verification_status,last_verified_at,published_at)
         SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,${draft ? 'NULL' : 'now()'}
         WHERE NOT EXISTS(SELECT 1 FROM content_items WHERE type=$1 AND metadata->>'import_key'=$2)
         ON CONFLICT(type,slug) DO NOTHING RETURNING id`,
        [
          'bishop',
          slug,
          bishop.name,
          `Born ${bishop.born} (${bishop.bornAt}); died ${bishop.died} (${bishop.diedAt}).`,
          '',
          '',
          '',
          metadata,
          index + 1,
          status,
          'verified',
          verifiedOn,
        ]
      );
      if (r.rowCount) added += 1;
      else skipped += 1;
    }
  }

  const { rows: existing } = await db.query(
    `SELECT id, slug, title_en, metadata FROM content_items WHERE type='bishop'`
  );

  const used = new Set();
  for (const detail of details) {
    let best = null;
    let bestScore = 0;
    for (const row of existing) {
      if (used.has(row.id)) continue;
      const born = row.metadata?.born || '';
      let score = scoreNames(detail.name, row.title_en);
      if (born && born === detail.born) score += 3;
      if (score > bestScore) {
        bestScore = score;
        best = row;
      }
    }
    if (!best || bestScore < 1.5) {
      console.log(`SKIP detail unmatched: ${detail.name} (best ${bestScore.toFixed(2)})`);
      unmatched += 1;
      continue;
    }
    used.add(best.id);
    const metadata = {
      ...(best.metadata || {}),
      office: detail.office,
      detail_source: 'bishop-details.json',
      detail_order: detail.order,
    };
    await db.query(
      `UPDATE content_items
       SET excerpt_en=$1, body_en=$2, metadata=$3, updated_at=now()
       WHERE id=$4`,
      [detail.excerpt, detail.body, metadata, best.id]
    );
    console.log(`OK  ${detail.order}. ${detail.name} → ${best.title_en} (${best.slug})`);
    updated += 1;
  }

  await db.query('COMMIT');
  console.log(
    `\nBishops: base added=${added} already=${skipped}; details updated=${updated} unmatched=${unmatched}`
  );
} catch (error) {
  await db.query('ROLLBACK');
  console.error(error);
  process.exitCode = 1;
} finally {
  db.release();
  await pool.end();
}
