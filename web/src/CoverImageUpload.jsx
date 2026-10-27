import React, {useEffect, useState} from 'react';
import {shrinkImage} from './shrinkImage.js';

export default function CoverImageUpload({value,onChange,api,canPublish,notify,onBusy,demo,label='Cover image'}) {
 const [asset,setAsset]=useState(null),[busy,setBusy]=useState(false),[alt,setAlt]=useState(''),[rights,setRights]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{
  let active=true;setAsset(null);setRights(false);setAlt('');setFailed(false);
  const id=value?.match(/^\/api\/files\/([\da-f-]{36})$/i)?.[1];
  if(id&&!demo)api(`/api/assets/${id}`).then(({item})=>{if(active){setAsset(item);setAlt(item.alt_text||'');setRights(item.rights_confirmed);}}).catch(error=>{if(active)notify(error.message,'error');});
  return ()=>{active=false;};
 },[value,demo]);
 function uploading(value){setBusy(value);onBusy(value);}
 async function upload(event){
  const original=event.target.files?.[0];event.target.value='';if(!original)return;
  if(!['image/jpeg','image/png','image/webp'].includes(original.type)){notify('Choose a JPEG, PNG or WebP image.','error');return;}
  if(original.size>40*1024*1024){notify('Choose an image smaller than 40 MB.','error');return;}
  uploading(true);
  try{
   const file=await shrinkImage(original);
   if(file.size>12*1024*1024)throw Error('This image is still too large after resizing. Choose a smaller image.');
   const data=new FormData();data.append('file',file);
   const {item}=await api('/api/assets',{method:'POST',body:data});
   onChange(item.url);
   setAsset(item);setAlt(item.alt_text||'');setRights(Boolean(item.rights_confirmed));setFailed(false);
   notify(item.status==='published'
    ?'Image uploaded and published. Save the entry to keep it.'
    :'Image uploaded as a draft. A publisher must approve it before the public site can show it.','success');
  }catch(error){notify(error.message,'error');}finally{uploading(false);}
 }
 async function publish(){
  uploading(true);
  try{const {item}=await api(`/api/assets/${asset.id}`,{method:'PATCH',body:JSON.stringify({status:'published',rights_confirmed:rights,alt_text:alt})});setAsset(item);notify('Image approved for the public website.','success');}
  catch(error){notify(error.message,'error');}finally{uploading(false);}
 }
 return <section className="space-y-3 rounded-xl border border-slate-200 p-4" aria-label={label}>
  <label className="form-label" htmlFor="cover-image-file">{label}</label>
  {value&&!failed&&<img src={value} alt={asset?.alt_text||'Cover image preview'} onError={()=>setFailed(true)} className="h-48 w-full rounded-lg bg-slate-100 object-contain"/>}
  {failed&&<p role="alert" className="text-xs text-rose-600">This image could not be loaded. Upload another image or check its URL.</p>}
  <input id="cover-image-file" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy||demo} onChange={upload} className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:p-3"/>
  <p className="text-xs text-slate-500" aria-live="polite">{busy?'Uploading or approving image…':'Choose a JPEG, PNG or WebP image. Large photos are resized automatically. Admin/publisher uploads are published immediately; editor uploads need approval.'}</p>
  {value&&<button type="button" disabled={busy} onClick={()=>onChange('')} className="text-xs font-semibold text-rose-600">Remove cover image from entry</button>}
  {asset?.status==='draft'&&(canPublish?<div className="space-y-3 rounded-lg bg-amber-50 p-3">
   <label className="form-label" htmlFor="cover-image-alt">Image description</label>
   <input id="cover-image-alt" className="field" value={alt} onChange={e=>setAlt(e.target.value)} disabled={busy} placeholder="Describe the image for visitors using screen readers"/>
   <label className="flex gap-2 text-xs text-slate-600"><input type="checkbox" checked={rights} disabled={busy} onChange={e=>setRights(e.target.checked)}/>I confirm permission and rights to publish this image.</label>
   <button type="button" className="btn-outline" disabled={busy||!rights||!alt.trim()} onClick={publish}>Approve image for website</button>
  </div>:<p className="text-xs text-amber-700">A publisher or administrator must approve this image in Media uploads before it can appear publicly.</p>)}
  {asset?.status==='published'&&<p className="text-xs text-emerald-700">Image approved for public display.</p>}
  <details><summary className="cursor-pointer text-xs text-slate-500">Use an image URL instead</summary><label className="sr-only" htmlFor="cover-image-url">Cover image URL</label><input id="cover-image-url" type="text" disabled={busy} value={value} onChange={e=>onChange(e.target.value)} className="field mt-2" placeholder="https://…"/></details>
 </section>;
}
