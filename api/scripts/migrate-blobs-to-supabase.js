// Copy existing media_assets files into Supabase Storage (same filename keys).
// Source: live site /api/files/{id} (still on Netlify Blobs until cutover), or --from-dir of raw files.
// Usage:
//   node scripts/migrate-blobs-to-supabase.js [--dry-run] [--limit N]
//   MEDIA_ORIGIN=https://omi-jaffna-province.netlify.app node scripts/migrate-blobs-to-supabase.js
import 'dotenv/config';
import { pool } from '../src/db.js';
import { initStorage, saveFile, storedFileExists, supabaseUrl } from '../src/storage.js';

const dryRun = process.argv.includes('--dry-run');
const limitFlag = process.argv.indexOf('--limit');
const limit = limitFlag >= 0 ? Number(process.argv[limitFlag + 1]) || 0 : 0;
const origin = (process.env.MEDIA_ORIGIN || 'https://omi-jaffna-province.netlify.app').replace(/\/+$/, '');

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in api/.env (Supabase → Settings → API → service_role).');
  process.exit(1);
}
if (!supabaseUrl()) {
  console.error('Missing SUPABASE_URL (or DATABASE_URL with postgres.<ref>).');
  process.exit(1);
}

process.env.MEDIA_STORE = 'supabase';
await initStorage();

const { rows } = await pool.query(
  `SELECT id, filename, mime_type, size_bytes, status FROM media_assets ORDER BY created_at`
);
const list = limit > 0 ? rows.slice(0, limit) : rows;
console.log(`Migrating ${list.length}/${rows.length} assets → ${supabaseUrl()} bucket media (dry=${dryRun})`);

let ok = 0;
let skip = 0;
let fail = 0;

const concurrency = 4;
for (let i = 0; i < list.length; i += concurrency) {
  const batch = list.slice(i, i + concurrency);
  await Promise.all(
    batch.map(async (a) => {
      try {
        if (await storedFileExists(a.filename)) {
          console.log(`SKIP exists ${a.id} ${a.filename}`);
          skip++;
          return;
        }
        if (dryRun) {
          console.log(`DRY would fetch ${origin}/api/files/${a.id} → ${a.filename}`);
          ok++;
          return;
        }
        const res = await fetch(`${origin}/api/files/${a.id}`, { signal: AbortSignal.timeout(60000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        await saveFile(a.filename, buf);
        console.log(`OK  ${a.id} ${a.filename} (${buf.length} bytes)`);
        ok++;
      } catch (e) {
        console.error(`FAIL ${a.id} ${a.filename}: ${e.message}`);
        fail++;
      }
    })
  );
}

console.log(`\nDone. ok=${ok} skipped=${skip} failed=${fail}`);
if(fail)console.log('Note: HTTP 404 usually means the file is missing on the live Blobs store (orphan DB row).');
await pool.end();
process.exit(ok===0&&fail>0?1:0);
