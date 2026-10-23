// Seeds the full Province necrology register into the CMS from site/src/content/necrology.ts.
// Safe to re-run: existing entries (matched by metadata.import_key) are left alone.
// Usage: node scripts/import-necrology.js [--draft]
import { pool } from '../src/db.js';
import { necrology, roleOf } from '../../site/src/content/necrology.ts';

const draft = process.argv.includes('--draft');
const status = draft ? 'draft' : 'published';
const verifiedOn = '2026-10-23';
const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f’']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 160);

const db = await pool.connect();
let added = 0;
let skipped = 0;

try {
  await db.query('BEGIN');
  for (const person of necrology) {
    const slug = `${person.no}-${slugify(person.name)}`;
    const metadata = {
      import_key: slug,
      register_no: person.no,
      role: roleOf(person.name),
      born: person.born,
      born_at: person.bornAt,
      died: person.died,
      died_at: person.diedAt,
    };
    await db.query(
      "UPDATE content_items SET metadata=metadata||jsonb_build_object('import_key',slug) WHERE type=$1 AND slug=$2 AND NOT metadata ? 'import_key'",
      ['necrology', slug]
    );
    const r = await db.query(
      `INSERT INTO content_items(type,slug,title_en,excerpt_en,body_en,location_text,image_url,metadata,sort_order,status,verification_status,last_verified_at,published_at)
       SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,${draft ? 'NULL' : 'now()'}
       WHERE NOT EXISTS(SELECT 1 FROM content_items WHERE type=$1 AND metadata->>'import_key'=$2)
       ON CONFLICT(type,slug) DO NOTHING RETURNING id`,
      [
        'necrology',
        slug,
        person.name,
        '',
        '',
        '',
        '',
        metadata,
        person.no,
        status,
        'verified',
        verifiedOn,
      ]
    );
    if (r.rowCount) added += 1;
    else skipped += 1;
  }
  await db.query('COMMIT');
  console.log(`Necrology imported as ${status}: ${added} added, ${skipped} already present.`);
} catch (error) {
  await db.query('ROLLBACK');
  console.error(error);
  process.exitCode = 1;
} finally {
  db.release();
  await pool.end();
}
