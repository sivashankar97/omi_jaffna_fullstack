// Seeds dummy library PDFs for every magazine/library category + books + articles.
// Usage: cd api && npm run seed:library
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { pool } from '../src/db.js';
import { initStorage, saveFile } from '../src/storage.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const samplePdfPath = path.join(root, 'docs/OMI-Jaffna-CMS-Guide.pdf');

const MAGAZINES = [
  ['year-thoni', 'Year Thoni'],
  ['naan', 'Naan'],
  ['zeal', 'Zeal'],
  ['koinonia', 'Koinonia'],
  ['vaanavil', 'Vaanavil'],
  ['malai-loran-versus-katru', 'Malai Loran Versus Katru'],
];

const LIBRARIES = [
  ['gaanapairkasiyar', 'Gaanapairkasiyar Library'],
  ['anna-illam', 'Anna Illam Library'],
  ['de-mazoned-scholasticate', 'De Mazoned Scholasticate Library'],
  ['malarum-mullai', 'Malarum Mullai Library'],
];

const BOOKS = [
  'Oblate Mission in Jaffna — Companion Volume',
  'Walking with the Poor — New Essays',
  'Formation Notes for Scholastics',
];

const ARTICLES = [
  'Charism and the Digital Mission',
  'Parish Life after Conflict',
  'Youth Animation in the Northern Province',
];

const COVER = '/Herosection/Ministry_1.jpg';

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f'']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 180);

async function ensureSamplePdf() {
  await initStorage();
  const buffer = await readFile(samplePdfPath);
  const filename = `${randomUUID()}.pdf`;
  await saveFile(filename, buffer);
  const { rows } = await pool.query(
    `INSERT INTO media_assets(filename,original_name,mime_type,size_bytes,uploaded_by,status,rights_confirmed,alt_text,caption)
     VALUES($1,$2,'application/pdf',$3,NULL,'published',true,$4,$5) RETURNING id`,
    [filename, 'sample-library.pdf', buffer.length, 'Sample library PDF', 'Dummy sample for Library pages']
  );
  return `/api/files/${rows[0].id}`;
}

async function upsertLibrary({ slug, title, excerpt, section, category, dateDisplay, sort, pdfUrl }) {
  const metadata = {
    library_section: section,
    category: category || '',
    date_display: dateDisplay || '',
  };
  const existing = await pool.query(`SELECT id FROM content_items WHERE type='library' AND slug=$1 LIMIT 1`, [slug]);
  if (existing.rowCount) {
    await pool.query(
      `UPDATE content_items SET
         title_en=$2, excerpt_en=$3, image_url=$4, media_url=$5, metadata=$6::jsonb, sort_order=$7,
         status='published', verification_status='verified',
         last_verified_at=COALESCE(last_verified_at, CURRENT_DATE),
         published_at=COALESCE(published_at, now()), updated_at=now()
       WHERE id=$1`,
      [existing.rows[0].id, title, excerpt, COVER, pdfUrl, JSON.stringify(metadata), sort]
    );
    console.log('updated', section, title);
    return;
  }
  await pool.query(
    `INSERT INTO content_items(
       type,slug,title_en,excerpt_en,body_en,location_text,image_url,media_url,metadata,sort_order,
       status,verification_status,last_verified_at,published_at
     ) VALUES (
       'library',$1,$2,$3,'',$4,$5,$6,$7::jsonb,$8,
       'published','verified',CURRENT_DATE,now()
     )`,
    [slug, title, excerpt, '', COVER, pdfUrl, JSON.stringify(metadata), sort]
  );
  console.log('created', section, title);
}

const pdfUrl = await ensureSamplePdf();
let sort = 1;

for (const [id, label] of MAGAZINES) {
  await upsertLibrary({
    slug: `magazine-${id}-2026`,
    title: `${label} — 2026 sample issue`,
    excerpt: `Sample ${label} magazine issue for the Library page. Replace with a real PDF in the CMS.`,
    section: 'magazine',
    category: id,
    dateDisplay: '2026',
    sort: sort++,
    pdfUrl,
  });
  await upsertLibrary({
    slug: `magazine-${id}-2025`,
    title: `${label} — 2025 sample issue`,
    excerpt: `Earlier sample issue of ${label}.`,
    section: 'magazine',
    category: id,
    dateDisplay: '2025',
    sort: sort++,
    pdfUrl,
  });
}

for (const [id, label] of LIBRARIES) {
  await upsertLibrary({
    slug: `lib-${id}-book-1`,
    title: `Selected readings — ${label}`,
    excerpt: `Sample book PDF from ${label}.`,
    section: 'libraries',
    category: id,
    dateDisplay: '2026',
    sort: sort++,
    pdfUrl,
  });
  await upsertLibrary({
    slug: `lib-${id}-book-2`,
    title: `Mission companion — ${label}`,
    excerpt: `Second sample title held in ${label}.`,
    section: 'libraries',
    category: id,
    dateDisplay: '2025',
    sort: sort++,
    pdfUrl,
  });
}

for (const title of BOOKS) {
  await upsertLibrary({
    slug: `book-${slugify(title)}`,
    title,
    excerpt: 'Sample new book release. Download the PDF and replace this entry in the CMS.',
    section: 'books',
    category: '',
    dateDisplay: '2026',
    sort: sort++,
    pdfUrl,
  });
}

for (const title of ARTICLES) {
  await upsertLibrary({
    slug: `article-${slugify(title)}`,
    title,
    excerpt: 'Sample article PDF for the Articles section.',
    section: 'articles',
    category: '',
    dateDisplay: '2026',
    sort: sort++,
    pdfUrl,
  });
}

console.log('Done. Sample PDF:', pdfUrl);
await pool.end();
