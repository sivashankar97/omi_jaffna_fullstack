// Match priest portraits → CMS `priest` rows, upload into Netlify Blobs (media store)
// + media_assets, set image_url to /api/files/{id}.
// Source PNGs: site/public/priests/portraits/ (staging only; live site uses Blobs).
// Usage: node scripts/seed-priest-portraits.js [--dry-run] [--public] [--dir path]
// Default mode: upload to Blobs via `netlify blobs:set` (local NETLIFY_BLOBS_TOKEN is often read-only).
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/db.js';

const dryRun = process.argv.includes('--dry-run');
const usePublic = process.argv.includes('--public');
const dirFlag = process.argv.indexOf('--dir');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const siteDir = path.join(root, 'site');
const portraitsDir =
  dirFlag >= 0 && process.argv[dirFlag + 1]
    ? path.resolve(process.argv[dirFlag + 1])
    : path.join(root, 'site/public/priests/portraits');

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f’']/g, '')
    .replace(/\b(rev\.?|fr\.?|bro\.?|omi|efefef)\b/g, ' ')
    .replace(/\bcrynton\b/g, 'cryntan')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const tokens = (value) => normalize(value).split(' ').filter(Boolean);

const scoreMatch = (fileName, title) => {
  const fileBase = path.basename(fileName, path.extname(fileName)).replace(/^\d+\s*/, '');
  const a = tokens(fileBase);
  const b = tokens(title);
  if (!a.length || !b.length) return 0;
  const setB = new Set(b);
  const shared = a.filter((t) => setB.has(t));
  if (!shared.length) return 0;
  const lastA = a[a.length - 1];
  const lastB = b[b.length - 1];
  const lastBonus = lastA === lastB ? 2 : shared.includes(lastB) || shared.includes(lastA) ? 1 : 0;
  return shared.length / Math.max(a.length, b.length) + lastBonus;
};

const run = (cmd, args, cwd) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(out);
      else reject(new Error(err || out || `exit ${code}`));
    });
  });

const uploadBlob = async (key, filePath) => {
  await run(
    'npx',
    ['netlify', 'blobs:set', 'media', key, '--input', filePath, '--force'],
    siteDir
  );
};

const { rows: priests } = await pool.query(
  `SELECT id, slug, title_en, image_url FROM content_items WHERE type='priest' ORDER BY sort_order, title_en`
);

let files;
try {
  files = (await readdir(portraitsDir)).filter((f) => /\.png$/i.test(f));
} catch {
  console.error(`Portrait folder not found: ${portraitsDir}`);
  process.exit(1);
}

if (!files.length) {
  console.error(`No PNG portraits in ${portraitsDir}`);
  process.exit(1);
}

const used = new Set();
const matches = [];
for (const file of files) {
  let best = null;
  let bestScore = 0;
  for (const priest of priests) {
    if (used.has(priest.id)) continue;
    const s = scoreMatch(file, priest.title_en);
    if (s > bestScore) {
      bestScore = s;
      best = priest;
    }
  }
  if (!best || bestScore < 0.35) {
    matches.push({ file, priest: null, score: bestScore, status: 'unmatched' });
    continue;
  }
  used.add(best.id);
  matches.push({ file, priest: best, score: bestScore, status: 'matched' });
}

const concurrency = 3;
let updated = 0;
let skipped = 0;
const queue = matches.filter((m) => m.status === 'matched');

const work = async (m) => {
  const src = path.join(portraitsDir, m.file);
  if (dryRun) {
    console.log(`DRY ${m.file} → ${m.priest.title_en} (${m.priest.slug}) score=${m.score.toFixed(2)}`);
    return;
  }
  let url;
  if (usePublic) {
    url = `/priests/portraits/${m.file.split('/').map(encodeURIComponent).join('/')}`;
  } else {
    const info = await stat(src);
    const filename = `${randomUUID()}.png`;
    await uploadBlob(filename, src);
    const asset = await pool.query(
      `INSERT INTO media_assets(filename,original_name,mime_type,size_bytes,uploaded_by,status,rights_confirmed)
       VALUES($1,$2,'image/png',$3,NULL,'published',true) RETURNING id`,
      [filename, m.file.slice(0, 255), info.size]
    );
    url = `/api/files/${asset.rows[0].id}`;
  }
  await pool.query(`UPDATE content_items SET image_url=$1, updated_at=now() WHERE id=$2`, [url, m.priest.id]);
  console.log(`OK  ${m.file} → ${m.priest.title_en} ${url}`);
  updated++;
};

for (const m of matches) {
  if (m.status !== 'matched') {
    console.log(`SKIP unmatched: ${m.file} (best ${m.score.toFixed(2)})`);
    skipped++;
  }
}

for (let i = 0; i < queue.length; i += concurrency) {
  const batch = queue.slice(i, i + concurrency);
  await Promise.all(batch.map((m) => work(m)));
}

// Crynton typo fallback if still unmatched
const crynton = matches.find((m) => /crynton/i.test(m.file) && m.status === 'unmatched');
if (crynton && !dryRun && !usePublic) {
  const priest = priests.find((p) => /cryntan/i.test(p.title_en));
  if (priest) {
    const src = path.join(portraitsDir, crynton.file);
    const info = await stat(src);
    const filename = `${randomUUID()}.png`;
    await uploadBlob(filename, src);
    const asset = await pool.query(
      `INSERT INTO media_assets(filename,original_name,mime_type,size_bytes,uploaded_by,status,rights_confirmed)
       VALUES($1,$2,'image/png',$3,NULL,'published',true) RETURNING id`,
      [filename, crynton.file.slice(0, 255), info.size]
    );
    const url = `/api/files/${asset.rows[0].id}`;
    await pool.query(`UPDATE content_items SET image_url=$1, updated_at=now() WHERE id=$2`, [url, priest.id]);
    console.log(`OK  ${crynton.file} → ${priest.title_en} ${url} (manual Crynton)`);
    updated++;
    skipped = Math.max(0, skipped - 1);
  }
}

console.log(
  `\nDone. matched=${matches.filter((m) => m.status === 'matched').length} updated=${updated} unmatched=${skipped} dry=${dryRun} mode=${usePublic ? 'public' : 'blobs'}`
);
await pool.end();
