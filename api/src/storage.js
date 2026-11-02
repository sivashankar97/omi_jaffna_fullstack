import {mkdir,readFile,writeFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {query} from './db.js';

const mediaStore=()=>(process.env.MEDIA_STORE||'disk').toLowerCase();
const usePostgres=()=>mediaStore()==='postgres'||mediaStore()==='db';

let dir;
const uploadDir=()=>dir??=process.env.UPLOAD_DIR||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../uploads');

export const onNetlify=Boolean(process.env.NETLIFY||process.env.AWS_LAMBDA_FUNCTION_NAME);

const missing=()=>Object.assign(new Error('File not found'),{code:'ENOENT'});

export async function initStorage(){
 await mkdir(uploadDir(),{recursive:true});
 if(usePostgres()){
  await query(`
   CREATE TABLE IF NOT EXISTS media_blobs (
     filename text PRIMARY KEY,
     data bytea NOT NULL,
     byte_size integer NOT NULL DEFAULT 0,
     updated_at timestamptz NOT NULL DEFAULT now()
   )`);
 }
}

export async function saveFile(name,buffer){
 const body=Buffer.isBuffer(buffer)?buffer:Buffer.from(buffer);
 if(usePostgres()){
  await query(
   `INSERT INTO media_blobs(filename,data,byte_size,updated_at)
    VALUES($1,$2,$3,now())
    ON CONFLICT (filename) DO UPDATE
      SET data=EXCLUDED.data, byte_size=EXCLUDED.byte_size, updated_at=now()`,
   [name,body,body.length]
  );
  return;
 }
 await writeFile(path.join(uploadDir(),name),body);
}

export async function readStoredFile(name){
 if(usePostgres()){
  const r=await query('SELECT data FROM media_blobs WHERE filename=$1',[name]);
  if(!r.rowCount)throw missing();
  return Buffer.from(r.rows[0].data);
 }
 return readFile(path.join(uploadDir(),name));
}

export async function removeFile(name){
 if(usePostgres()){
  await query('DELETE FROM media_blobs WHERE filename=$1',[name]);
  return;
 }
 try{await unlink(path.join(uploadDir(),name));}catch(e){if(e.code!=='ENOENT')throw e;}
}

/** True when object exists in the configured store (used by migrate). */
export async function storedFileExists(name){
 if(usePostgres()){
  const r=await query('SELECT 1 FROM media_blobs WHERE filename=$1 LIMIT 1',[name]);
  return r.rowCount>0;
 }
 try{await readFile(path.join(uploadDir(),name));return true;}catch{return false;}
}
