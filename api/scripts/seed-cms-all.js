// Seeds every CMS content type + page block the admin can edit.
// Sample / template: api/scripts/seed-cms.sample.json
// Usage: cd api && npm run seed:cms
// Flags: --draft · --force · --file <path>
// Same logic is available in the CMS under Files & Management → Content Seeder.
import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/db.js';
import { applyCmsSeed, loadSampleSeed } from '../src/seed-cms.js';

const draft = process.argv.includes('--draft');
const force = process.argv.includes('--force');
const fileFlag = process.argv.indexOf('--file');
const seedPath =
  fileFlag >= 0 && process.argv[fileFlag + 1]
    ? path.resolve(process.cwd(), process.argv[fileFlag + 1])
    : null;

try {
  const raw = seedPath
    ? JSON.parse(await readFile(seedPath, 'utf8'))
    : await loadSampleSeed();
  const result = await applyCmsSeed(raw, { draft, force });
  const label = seedPath
    ? path.relative(process.cwd(), seedPath)
    : 'scripts/seed-cms.sample.json';
  console.log(`CMS seed from ${label} as ${result.status}${force ? ' (--force)' : ' (safe fill)'}:`);
  const keys = Object.keys(result.counts).sort();
  for (const key of keys) console.log(`  ${key}: ${result.counts[key]}`);
  if (!keys.length) console.log('  (nothing changed)');
  console.log('\nCovered CMS types:', result.types.join(', '));
  console.log('Or use the CMS UI: Files & Management → Content Seeder');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
