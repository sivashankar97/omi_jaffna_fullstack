// Removes GPS position, camera and date data from photos already in media storage
// (new uploads are cleaned on upload by api/src/clean-image.js).
// Usage: node scripts/strip-photo-metadata.js          → report only
//        node scripts/strip-photo-metadata.js --apply  → rewrite the affected photos
import { pool, query } from '../src/db.js';
import { initStorage, readStoredFile, saveFile } from '../src/storage.js';
import { hasImageMetadata, stripImageMetadata } from '../src/clean-image.js';

const apply = process.argv.includes('--apply');

await initStorage();
const { rows } = await query(
  `SELECT id, filename, mime_type, original_name, status FROM media_assets
   WHERE mime_type IN ('image/jpeg','image/png','image/webp') ORDER BY created_at`
);

let dirty = 0, cleaned = 0, failed = 0, missing = 0;
for (const asset of rows) {
  let buffer;
  try { buffer = await readStoredFile(asset.filename); }
  catch { missing++; continue; }
  let needs;
  try { needs = await hasImageMetadata(buffer); }
  catch { failed++; console.warn(`unreadable: ${asset.original_name} (${asset.id})`); continue; }
  if (!needs) continue;
  dirty++;
  if (!apply) continue;
  try {
    const clean = await stripImageMetadata(buffer, asset.mime_type);
    await saveFile(asset.filename, clean);
    await query('UPDATE media_assets SET size_bytes=$1 WHERE id=$2', [clean.length, asset.id]);
    cleaned++;
  } catch (e) {
    failed++;
    console.warn(`failed: ${asset.original_name} (${asset.id}): ${e.message}`);
  }
}

console.log(`${rows.length} photos checked · ${dirty} with hidden data${apply ? ` · ${cleaned} cleaned` : ' (dry run, use --apply)'} · ${missing} missing · ${failed} unreadable/failed`);
await pool.end();
