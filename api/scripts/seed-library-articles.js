// Seed Library › Articles from separate OMI book PDFs.
// Usage:
//   cd api && npm run seed:library-articles
//   node scripts/seed-library-articles.js --dir "/path/to/OMI_separate_articles_book"
// Default dir: api/.staging/library-articles  or  ~/Downloads/OMI_separate_articles_book
import { randomUUID } from 'node:crypto';
import { readdir, readFile, access } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { pool } from '../src/db.js';
import { initStorage, saveFile } from '../src/storage.js';

const dryRun = process.argv.includes('--dry-run');
const dirFlag = process.argv.indexOf('--dir');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const ARTICLES = [
  {
    n: 1,
    title: 'Oblates are Pioneers',
    author: 'S. M. Selvaratnam, OMI',
    pages: '1–16',
  },
  {
    n: 2,
    title:
      'St. Charles Joseph Eugene De Mazenod and the pioneering missionary efforts of the Oblates in Sri Lanka',
    author: 'Velichor A. Jerome, OMI',
    pages: '17–38',
  },
  {
    n: 3,
    title:
      'From Marseille to Sillalai: The Mission of the Oblates of Mary Immaculate in Valikamam and the Enduring Legacy of Sillalai (1853 onwards)',
    author: 'Rev. Prof. J. C. Paul Rohan',
    pages: '39–71',
  },
  {
    n: 4,
    title: 'Ecclesiastical Ministry of the Oblate Bishops in Sri Lanka: A Historical and Pastoral Study (1847-2025)',
    author: 'A. Jeevendra Paul, OMI',
    pages: '72–89',
  },
  {
    n: 5,
    title: 'The Contribution of the Oblates to the Development of the Shrine of Our Lady of Madhu',
    author: 'Rev. Prof. Gnanamuthu Pilendran',
    pages: '90–130',
  },
  {
    n: 6,
    title: 'The Spiritual Conscience of Episcopal Governance in Henri Joulain, OMI',
    author: 'Rev. Fr. Jesuthasan Chandran',
    pages: '131–148',
  },
  {
    n: 7,
    title: 'தொண்டும் பணியும் வரலாற்று நிகழ்வுகளும்: யாழ். தீவகப் பிரதேசத்தில் 1847-1975 வரை பணியாற்றிய சில அமலமரித்தியாகிகள்',
    author: 'திரு. அன்றனி பெர்னாண்டோ ஜெனிபர்',
    pages: '149–163',
  },
  {
    n: 8,
    title:
      'Missionary Education and Social Transformation in Sri Lanka: The Role of the Oblates of Mary Immaculate (1847-2026)',
    author: 'J. Ramesh, OMI',
    pages: '164–202',
  },
  {
    n: 9,
    title:
      'Faith in Action: A narrative analysis of the Missionary Legacy of the Deceased Oblates in Sri Lanka as reflected in Our Tribute',
    author: 'Navaratnaraja Ajanthan, OMI',
    pages: '203–230',
  },
  {
    n: 10,
    title: 'எம் மண்ணில் மறைந்த முதல் இளங்குரு லிஜியே, அமதி',
    author: 'செ. அன்புராசா, அமதி',
    pages: '231–243',
  },
  {
    n: 11,
    title: 'Oblate Mission to the Poor: in the Light of CC&RR in the Jaffna Province',
    author: 'Stany Antony, OMI',
    pages: '244–255',
  },
  {
    n: 12,
    title: 'The Mission beyond Borders: The Missionary Contribution of the Oblate Province of Jaffna',
    author: 'A. Siyanstan Jenis, OMI',
    pages: '256–264',
  },
  {
    n: 13,
    title: 'The contribution of the Oblates to sacred music in the Sri Lankan Catholic Church',
    author: 'P. A. Jesuthasan, OMI',
    pages: '265–279',
  },
  {
    n: 14,
    title:
      'Rooted in the Gospel, Sent to the Most Abandoned: A Reflection on the Bicentenary Commemoration of the OMI Constitutions and Rules',
    author: 'A. Eugene Amalaraj, OMI',
    pages: '280–286',
  },
  {
    n: 15,
    title: 'An Oblate Missionary Experience on the Path to the third Century',
    author: 'S. James Surenthirarajah, OMI',
    pages: '287–316',
  },
  {
    n: 16,
    title: 'Statues that speak',
    author: 'Jesington Logu, OMI',
    pages: '317–329',
  },
  {
    n: 17,
    title: 'ஒரு விடுதலை உணர்வும் அமலமரித்தியாகிகளின் ஒத்துணர்வும்',
    author: 'ஜெ. யா. ஜீவரட்ணம், அமதி',
    pages: '330–351',
  },
  {
    n: 18,
    title: 'பிறப்பிக்கப்பட்டதா? பிரிக்கப்பட்டதா?',
    author: 'கரையூர் செல்வம்',
    pages: '352–374',
  },
  {
    n: 19,
    title: 'Accompanying Immigrants: A Timely Mission of the Oblates from the Province of Jaffna',
    author: 'A. Siyanstan Jenis, OMI',
    pages: '375–383',
  },
  {
    n: 20,
    title: 'கல்விப்பணியில் அமலமரித்தியாகிகள்: யாழ். புனித பத்திரிசியார் கல்லூரியூடாக ஆற்றிய பணிகள்',
    author: 'சகாயர்ஷன் லம்பேட், அமதி',
    pages: '384–390',
  },
  {
    n: 21,
    title: 'நற்செய்தியின் தூதுவர்கள்: யாழ். அமலமரித்தியாகிகளின் மறைப்போதனைப் பணிகள்',
    author: 'ம. போல்நட்சத்திரம், அமதி',
    pages: '391–411',
  },
  {
    n: 22,
    title: 'ஈழத்தின் கலை இலக்கிய வளர்ச்சியில் அமலமரித்தியாகிகள்',
    author: 'திரு. யோ. யோன்சன் ராஜ்குமார்',
    pages: '412–446',
  },
  {
    n: 23,
    title: 'எழுத்தால் நற்செய்தியைப் பகிர்ந்திடுவோர்',
    author: 'சகாயதாசன் விமல்ராஜ், அமதி',
    pages: '447–465',
  },
  {
    n: 24,
    title: 'இரு சபையினருக்கிடையே வளர்ந்து வலுவூட்டிக் கொண்டிருக்கும் உறவு',
    author: 'அருட்சகோதரி நெவிஸ் லடிஸ்லாஸ்',
    pages: '466–470',
  },
  {
    n: 25,
    title: 'Present Ministries of the Oblates of Mary Immaculate in Jaffna Province',
    author: 'P. Sathiyaseelan, OMI',
    pages: '471–490',
  },
];

const DUMMY_ARTICLE_SLUGS = [
  'article-charism-and-the-digital-mission',
  'article-parish-life-after-conflict',
  'article-youth-animation-in-the-northern-province',
];

async function resolveArticlesDir() {
  if (dirFlag >= 0 && process.argv[dirFlag + 1]) {
    return path.resolve(process.argv[dirFlag + 1]);
  }
  const candidates = [
    path.join(root, 'api/.staging/library-articles'),
    path.join(os.homedir(), 'Downloads/OMI_separate_articles_book'),
  ];
  for (const dir of candidates) {
    try {
      await access(dir);
      return dir;
    } catch {
      /* try next */
    }
  }
  throw new Error(
    `Articles folder not found. Pass --dir or place PDFs in ${candidates[0]} or ${candidates[1]}`
  );
}

function articleNumberFromFilename(name) {
  const m = String(name).match(/(?:^|_)(\d+)\.pdf$/i);
  return m ? Number(m[1]) : null;
}

async function mapPdfs(dir) {
  const files = (await readdir(dir)).filter((name) => name.toLowerCase().endsWith('.pdf'));
  const byNumber = new Map();
  for (const name of files) {
    const n = articleNumberFromFilename(name);
    if (!n) continue;
    byNumber.set(n, path.join(dir, name));
  }
  return byNumber;
}

async function uploadPdf(filePath, originalName, alt) {
  const buffer = await readFile(filePath);
  const filename = `${randomUUID()}.pdf`;
  await saveFile(filename, buffer);
  const { rows } = await pool.query(
    `INSERT INTO media_assets(filename,original_name,mime_type,size_bytes,uploaded_by,status,rights_confirmed,alt_text,caption)
     VALUES($1,$2,'application/pdf',$3,NULL,'published',true,$4,$5) RETURNING id`,
    [filename, originalName, buffer.length, alt, alt]
  );
  return `/api/files/${rows[0].id}`;
}

async function upsertArticle({ slug, title, excerpt, dateDisplay, sort, pdfUrl }) {
  const metadata = {
    library_section: 'articles',
    category: '',
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
      [existing.rows[0].id, title, excerpt, '', pdfUrl, JSON.stringify(metadata), sort]
    );
    return 'updated';
  }
  await pool.query(
    `INSERT INTO content_items(
       type,slug,title_en,excerpt_en,body_en,location_text,image_url,media_url,metadata,sort_order,
       status,verification_status,last_verified_at,published_at
     ) VALUES (
       'library',$1,$2,$3,'','',$4,$5,$6::jsonb,$7,
       'published','verified',CURRENT_DATE,now()
     )`,
    [slug, title, excerpt, '', pdfUrl, JSON.stringify(metadata), sort]
  );
  return 'created';
}

const articlesDir = await resolveArticlesDir();
const pdfs = await mapPdfs(articlesDir);
console.log(`Articles dir: ${articlesDir}`);
console.log(`PDF files matched: ${pdfs.size}`);

if (!dryRun) await initStorage();

let ok = 0;
let missing = 0;

for (const article of ARTICLES) {
  const filePath = pdfs.get(article.n);
  if (!filePath) {
    console.warn(`missing PDF for article ${article.n}: ${article.title.slice(0, 60)}`);
    missing += 1;
    continue;
  }
  const slug = `article-${String(article.n).padStart(2, '0')}`;
  const excerpt = `By ${article.author}`;
  const dateDisplay = `pp. ${article.pages}`;
  if (dryRun) {
    console.log(`dry-run ${slug} ← ${path.basename(filePath)}`);
    ok += 1;
    continue;
  }
  const pdfUrl = await uploadPdf(filePath, path.basename(filePath), article.title);
  const action = await upsertArticle({
    slug,
    title: article.title,
    excerpt,
    dateDisplay,
    sort: article.n,
    pdfUrl,
  });
  console.log(`${action} ${slug} ← ${path.basename(filePath)}`);
  ok += 1;
}

if (!dryRun && DUMMY_ARTICLE_SLUGS.length) {
  const removed = await pool.query(
    `DELETE FROM content_items WHERE type='library' AND slug = ANY($1::text[]) RETURNING slug`,
    [DUMMY_ARTICLE_SLUGS]
  );
  if (removed.rowCount) {
    console.log('removed dummy articles:', removed.rows.map((r) => r.slug).join(', '));
  }
}

console.log(`Done. Seeded ${ok}/${ARTICLES.length}${missing ? ` (${missing} missing PDFs)` : ''}.`);
await pool.end();
