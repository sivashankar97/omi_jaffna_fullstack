// Sets majorSections from the Province places list. Does not change other detail fields.
// Usage: cd api && npm run seed:ministry-sections
import 'dotenv/config';
import { pool } from '../src/db.js';
import { majorSectionsForMinistry } from '../../site/src/content/ministry-details.ts';

const { rows } = await pool.query(
  `SELECT id, title_en, metadata FROM content_items WHERE type = 'ministry' ORDER BY sort_order, title_en`
);

let updated = 0;
let skipped = 0;
for (const row of rows) {
  const sections = majorSectionsForMinistry(row.title_en || '');
  if (!sections.length) {
    skipped += 1;
    console.log('no places for', row.title_en);
    continue;
  }
  const meta = row.metadata && typeof row.metadata === 'object' ? { ...row.metadata } : {};
  const detail = meta.detail && typeof meta.detail === 'object' ? { ...meta.detail } : {};
  detail.majorSections = sections;
  meta.detail = detail;
  await pool.query(`UPDATE content_items SET metadata = $2::jsonb, updated_at = now() WHERE id = $1`, [
    row.id,
    JSON.stringify(meta),
  ]);
  updated += 1;
  console.log(`${sections.length} tabs ←`, row.title_en);
}
console.log(`Done. Updated ${updated}, skipped ${skipped}.`);
await pool.end();
