import {readFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {query,pool} from '../src/db.js';
const dir = fileURLToPath(new URL('../db/',import.meta.url));
try {
  // Files are applied in name order and must stay safe to re-run.
  for (const file of (await readdir(dir)).filter(f=>f.endsWith('.sql')).sort()) await query(await readFile(path.join(dir,file),'utf8'));
  console.log('Database schema is ready.');
}
catch(e) { console.error(e);process.exitCode=1; }
finally {await pool.end();}
