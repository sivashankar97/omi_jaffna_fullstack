import {mkdir,readFile,writeFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Serverless hosts have no persistent disk, so uploads go to Netlify Blobs there.
const useBlobs=process.env.MEDIA_STORE==='blobs';
// Resolved lazily: import.meta is empty when the function bundler emits CommonJS.
let dir;
const uploadDir=()=>dir??=process.env.UPLOAD_DIR||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../uploads');
const blobs=async()=>(await import('@netlify/blobs')).getStore('media');
const missing=()=>Object.assign(new Error('File not found'),{code:'ENOENT'});

export async function initStorage(){if(!useBlobs)await mkdir(uploadDir(),{recursive:true});}
export async function saveFile(name,buffer){
 if(useBlobs)return (await blobs()).set(name,buffer);
 await writeFile(path.join(uploadDir(),name),buffer);
}
export async function readStoredFile(name){
 if(useBlobs){const data=await (await blobs()).get(name,{type:'arrayBuffer'});if(!data)throw missing();return Buffer.from(data);}
 return readFile(path.join(uploadDir(),name));
}
export async function removeFile(name){
 if(useBlobs)return (await blobs()).delete(name);
 try{await unlink(path.join(uploadDir(),name));}catch(e){if(e.code!=='ENOENT')throw e;}
}
