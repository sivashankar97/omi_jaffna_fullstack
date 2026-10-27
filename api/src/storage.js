import {mkdir,readFile,writeFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createClient} from '@supabase/supabase-js';
import {query} from './db.js';

const mediaStore=()=>(process.env.MEDIA_STORE||'disk').toLowerCase();
const useSupabase=()=>mediaStore()==='supabase';
const usePostgres=()=>mediaStore()==='postgres'||mediaStore()==='db';
const bucketName=()=>process.env.SUPABASE_STORAGE_BUCKET||'media';

let dir;
const uploadDir=()=>dir??=process.env.UPLOAD_DIR||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../uploads');

export const onNetlify=Boolean(process.env.NETLIFY||process.env.AWS_LAMBDA_FUNCTION_NAME);

const missing=()=>Object.assign(new Error('File not found'),{code:'ENOENT'});

/** Resolve https://<ref>.supabase.co from env or DATABASE_URL (pooler user postgres.<ref>). */
export function supabaseUrl(){
 if(process.env.SUPABASE_URL)return process.env.SUPABASE_URL.replace(/\/+$/,'');
 const db=process.env.DATABASE_URL||'';
 try{
  const u=new URL(db);
  const user=decodeURIComponent(u.username||'');
  if(user.startsWith('postgres.')&&user.length>9){
   return `https://${user.slice('postgres.'.length)}.supabase.co`;
  }
  const host=u.hostname||'';
  const m=host.match(/^db\.([a-z0-9]+)\.supabase\.(co|com)$/i);
  if(m)return `https://${m[1]}.supabase.co`;
 }catch{/* ignore */}
 return '';
}

let client;
let bucketReady;

function supabase(){
 if(client)return client;
 const url=supabaseUrl();
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY||'';
 if(!url||!key){
  throw Object.assign(
   new Error('Set SUPABASE_URL (or DATABASE_URL with postgres.<ref>) and SUPABASE_SERVICE_ROLE_KEY for MEDIA_STORE=supabase'),
   {code:'SUPABASE_CONFIG'}
  );
 }
 client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 return client;
}

async function ensureBucket(){
 if(bucketReady)return;
 const sb=supabase();
 const name=bucketName();
 const {data:buckets,error:listErr}=await sb.storage.listBuckets();
 if(listErr)throw Object.assign(new Error(listErr.message),{code:'SUPABASE_STORAGE'});
 if(!buckets?.some((b)=>b.name===name)){
  const {error}=await sb.storage.createBucket(name,{public:false,fileSizeLimit:12*1024*1024});
  if(error&&!/already exists/i.test(error.message)){
   throw Object.assign(new Error(error.message),{code:'SUPABASE_STORAGE'});
  }
 }
 bucketReady=true;
}

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
  return;
 }
 if(useSupabase()){
  try{await ensureBucket();}
  catch(e){
   console.error('Supabase Storage init failed:',e.message||e);
   console.error('Set SUPABASE_SERVICE_ROLE_KEY in api/.env (Dashboard → Settings → API Keys).');
  }
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
 if(useSupabase()){
  await ensureBucket();
  const {error}=await supabase().storage.from(bucketName()).upload(name,body,{upsert:true});
  if(error)throw Object.assign(new Error(error.message),{code:'SUPABASE_STORAGE'});
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
 if(useSupabase()){
  await ensureBucket();
  const {data,error}=await supabase().storage.from(bucketName()).download(name);
  if(error){
   if(/not found|does not exist|404/i.test(error.message))throw missing();
   throw Object.assign(new Error(error.message),{code:'SUPABASE_STORAGE'});
  }
  if(!data)throw missing();
  return Buffer.from(await data.arrayBuffer());
 }
 return readFile(path.join(uploadDir(),name));
}

export async function removeFile(name){
 if(usePostgres()){
  await query('DELETE FROM media_blobs WHERE filename=$1',[name]);
  return;
 }
 if(useSupabase()){
  await ensureBucket();
  const {error}=await supabase().storage.from(bucketName()).remove([name]);
  if(error&&!/not found|does not exist|404/i.test(error.message)){
   throw Object.assign(new Error(error.message),{code:'SUPABASE_STORAGE'});
  }
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
 if(useSupabase()){
  await ensureBucket();
  const dir=path.posix.dirname(name);
  const base=path.posix.basename(name);
  const folder=dir==='.'?'':dir;
  const {data,error}=await supabase().storage.from(bucketName()).list(folder,{search:base,limit:100});
  if(error)return false;
  return Boolean(data?.some((f)=>f.name===base));
 }
 try{await readFile(path.join(uploadDir(),name));return true;}catch{return false;}
}
