import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {query,pool} from '../src/db.js';
const path = fileURLToPath(new URL('../db/001_init.sql',import.meta.url));
const fatherAccountsPath = fileURLToPath(new URL('../db/002_father_accounts.sql',import.meta.url));
try {
  await query(await readFile(path,'utf8'));
  await query(await readFile(fatherAccountsPath,'utf8'));
  console.log('Database schema is ready.');
}
catch(e) { console.error(e);process.exitCode=1; }
finally {await pool.end();}
