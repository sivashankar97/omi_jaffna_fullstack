// Upserts mission countries into Category 1 / Category 2 with sample missions & photos.
// Does not change formation-abroad entries. Usage: cd api && npm run seed:international
import 'dotenv/config';
import { pool } from '../src/db.js';

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f'']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 180);

const CATEGORY_1 = [
  { name: 'Italy', region: 'Europe' },
  { name: 'France', region: 'Europe' },
  { name: 'Norway', region: 'Europe' },
  { name: 'Philippines', region: 'Asia' },
];

const CATEGORY_2 = [
  { name: 'United Kingdom', region: 'Europe' },
  { name: 'Australia', region: 'Oceania' },
  { name: 'Sweden', region: 'Europe' },
  { name: 'Denmark', region: 'Europe' },
  { name: 'USA', region: 'Americas' },
  { name: 'Mexico', region: 'Americas' },
  { name: 'Zambia', region: 'Africa' },
  { name: 'Kenya', region: 'Africa' },
  { name: 'Brazil', region: 'Americas' },
  { name: 'Ireland', region: 'Europe' },
];

const SAMPLE_PHOTOS = [
  { src: '/Herosection/Ministry_1.jpg', alt: 'Mission gathering', caption: 'Mission gathering' },
  { src: '/Herosection/ministry_2.jpg', alt: 'Pastoral visit', caption: 'Pastoral visit' },
  { src: '/Herosection/Welcome.jpeg', alt: 'Community welcome', caption: 'Community welcome' },
];

function sampleMissions(name) {
  return [
    {
      title: `Pastoral presence in ${name}`,
      summary: `Oblates accompany parish communities and diaspora families in ${name}.`,
    },
    {
      title: 'Chaplaincy and outreach',
      summary: 'Visits, liturgy and care for people on the margins of the local Church.',
    },
  ];
}

async function upsertCountry({ name, region, category, sort }) {
  const slug = slugify(name);
  const missions = sampleMissions(name);
  const photos = SAMPLE_PHOTOS.map((photo) => ({
    ...photo,
    caption: `${name} — ${photo.caption}`,
    alt: `${name} — ${photo.alt}`,
  }));
  const metadata = {
    kind: '',
    category: String(category),
    region,
    missions,
    photos,
  };
  const excerpt = `Oblate mission in ${name}.`;
  const body = `Oblates of the Province of Jaffna serve in ${name}, sharing the Oblate charism with the local Church and communities entrusted to their care.\n\nReplace this sample text in the CMS with confirmed mission notes from the Province.`;

  const existing = await pool.query(
    `SELECT id, metadata FROM content_items WHERE type = 'international' AND slug = $1 LIMIT 1`,
    [slug]
  );

  if (existing.rowCount) {
    const row = existing.rows[0];
    const prev = row.metadata && typeof row.metadata === 'object' ? row.metadata : {};
    // Keep editor-written missions/photos if already filled beyond seed defaults.
    const nextMeta = {
      ...prev,
      kind: prev.kind === 'formation' ? '' : prev.kind || '',
      category: String(category),
      region: prev.region || region,
      missions: Array.isArray(prev.missions) && prev.missions.length ? prev.missions : missions,
      photos: Array.isArray(prev.photos) && prev.photos.length ? prev.photos : photos,
    };
    await pool.query(
      `UPDATE content_items
       SET title_en = $2,
           excerpt_en = COALESCE(NULLIF(excerpt_en, ''), $3),
           body_en = COALESCE(NULLIF(body_en, ''), $4),
           metadata = $5::jsonb,
           sort_order = $6,
           status = 'published',
           verification_status = 'verified',
           last_verified_at = COALESCE(last_verified_at, CURRENT_DATE),
           published_at = COALESCE(published_at, now()),
           updated_at = now()
       WHERE id = $1`,
      [row.id, name, excerpt, body, JSON.stringify(nextMeta), sort]
    );
    console.log(`updated ← Category ${category}`, name);
    return;
  }

  await pool.query(
    `INSERT INTO content_items(
       type, slug, title_en, excerpt_en, body_en, location_text, image_url, metadata, sort_order,
       status, verification_status, last_verified_at, published_at
     ) VALUES (
       'international', $1, $2, $3, $4, '', '', $5::jsonb, $6,
       'published', 'verified', CURRENT_DATE, now()
     )`,
    [slug, name, excerpt, body, JSON.stringify(metadata), sort]
  );
  console.log(`created ← Category ${category}`, name);
}

let sort = 1;
for (const country of CATEGORY_1) {
  await upsertCountry({ ...country, category: 1, sort: sort++ });
}
for (const country of CATEGORY_2) {
  await upsertCountry({ ...country, category: 2, sort: sort++ });
}

console.log(`Done. Category 1: ${CATEGORY_1.length}, Category 2: ${CATEGORY_2.length}.`);
await pool.end();
