import {mkdir,readFile,writeFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Serverless hosts have no persistent disk, so uploads go to Netlify Blobs there.
const useBlobs=process.env.MEDIA_STORE==='blobs';
// Resolved lazily: import.meta is empty when the function bundler emits CommonJS.
let dir;
const uploadDir=()=>dir??=process.env.UPLOAD_DIR||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../uploads');
const cacheDir=()=>path.join(uploadDir(),'.media-cache');
// On Netlify Functions, use the automatic store (connectLambda in api.mjs). Explicit
// siteID+token is only for local/dev — and a bad token overrides the live store with 401s.
export const onNetlify=Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
const blobOptions=()=>{
 if(!onNetlify && process.env.NETLIFY_BLOBS_TOKEN && process.env.NETLIFY_SITE_ID){
  return {name:'media',siteID:process.env.NETLIFY_SITE_ID,token:process.env.NETLIFY_BLOBS_TOKEN};
 }
 return 'media';
};
const blobs=async()=>(await import('@netlify/blobs')).getStore(blobOptions());
const missing=()=>Object.assign(new Error('File not found'),{code:'ENOENT'});
// Live site origin used when local Blobs credentials cannot read (common with a stale NETLIFY_BLOBS_TOKEN).
// Do NOT fall back to FRONTEND_ORIGIN — that is often http://localhost:5173 and would recurse via the Next proxy.
export const mediaOrigin=()=>(process.env.MEDIA_ORIGIN||'https://omi-jaffna-province.netlify.app').replace(/\/+$/,'');

export async function initStorage(){
 await mkdir(uploadDir(),{recursive:true});
 if(!onNetlify)await mkdir(cacheDir(),{recursive:true});
}
export async function saveFile(name,buffer){
 if(useBlobs)return (await blobs()).set(name,buffer);
 await writeFile(path.join(uploadDir(),name),buffer);
}
async function readCache(name){
 try{return await readFile(path.join(cacheDir(),name));}catch{return null;}
}
async function writeCache(name,buffer){
 try{
  await mkdir(cacheDir(),{recursive:true});
  await writeFile(path.join(cacheDir(),name),buffer);
 }catch{/* ignore cache write failures */}
}
/** Local-only: pull a published file from the live site and cache it on disk. */
export async function fetchMediaFromOrigin(assetId,filename){
 if(onNetlify)return null;
 const cached=filename?await readCache(filename):null;
 if(cached)return cached;
 const origin=mediaOrigin();
 if(/localhost|127\.0\.0\.1/i.test(origin))return null;
 const upstream=await fetch(`${origin}/api/files/${assetId}`,{signal:AbortSignal.timeout(30000)});
 if(!upstream.ok)return null;
 const buffer=Buffer.from(await upstream.arrayBuffer());
 if(filename)await writeCache(filename,buffer);
 return buffer;
}
const withTimeout=(promise,ms,label)=>Promise.race([
 promise,
 new Promise((_,reject)=>setTimeout(()=>reject(Object.assign(new Error(`${label} timed out after ${ms}ms`),{code:'BLOBS_TIMEOUT'})),ms)),
]);

export async function readStoredFile(name){
 if(useBlobs){
  // Local: prefer disk cache. Skip Blobs reads — a stale NETLIFY_BLOBS_TOKEN hangs/401s;
  // /api/files falls back to the live site and fills the cache.
  if(!onNetlify){
   const cached=await readCache(name);
   if(cached)return cached;
   throw Object.assign(new Error('Local Blobs read skipped'),{code:'BLOBS_SKIP',blobsStatus:401});
  }
  try{
   const data=await withTimeout((await blobs()).get(name,{type:'arrayBuffer'}),20000,'Blobs get');
   if(!data)throw missing();
   return Buffer.from(data);
  }catch(e){
   if(e.code==='ENOENT')throw e;
   const err=Object.assign(e instanceof Error?e:new Error(String(e)),{code:e.code||'BLOBS_READ',blobsStatus:e.status});
   throw err;
  }
 }
 return readFile(path.join(uploadDir(),name));
}
export async function removeFile(name){
 if(useBlobs)return (await blobs()).delete(name);
 try{await unlink(path.join(uploadDir(),name));}catch(e){if(e.code!=='ENOENT')throw e;}
}
