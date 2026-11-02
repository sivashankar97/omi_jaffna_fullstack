import React, {useEffect, useState, useSyncExternalStore} from 'react';
import {Loader2, UploadCloud} from 'lucide-react';

let tasks=[];
let nextId=1;
const listeners=new Set();
const emit=()=>{tasks=[...tasks];listeners.forEach(fn=>fn());};
const subscribe=fn=>{listeners.add(fn);return ()=>listeners.delete(fn);};

/** Registers work in progress; kind is 'load', 'save' or 'upload'. Returns {update, done}. */
export function startTask(kind,label=''){
 const task={id:nextId++,kind,label,loaded:0,total:0};
 tasks.push(task);emit();
 return {
  update:(loaded,total)=>{task.loaded=loaded;task.total=total;emit();},
  rename:next=>{task.label=next;emit();},
  done:()=>{tasks=tasks.filter(t=>t!==task);emit();},
 };
}

/** Like fetch for FormData uploads, but reports upload progress. */
export function uploadWithProgress(url,{method='POST',body,headers={}},onProgress){
 return new Promise((resolve,reject)=>{
  const xhr=new XMLHttpRequest();
  xhr.open(method,url);
  xhr.withCredentials=true;
  for(const [k,v] of Object.entries(headers))xhr.setRequestHeader(k,v);
  xhr.upload.onprogress=e=>{if(e.lengthComputable)onProgress(e.loaded,e.total);};
  xhr.onload=()=>{let result={};try{result=JSON.parse(xhr.responseText||'{}');}catch{/* not JSON */}resolve({status:xhr.status,ok:xhr.status>=200&&xhr.status<300,result});};
  xhr.onerror=()=>reject(Error('Network error: the upload did not reach the server. Check your connection and try again.'));
  xhr.ontimeout=()=>reject(Error('The upload took too long. Try a smaller file or a better connection.'));
  xhr.send(body);
 });
}

const useTasks=()=>useSyncExternalStore(subscribe,()=>tasks);

/** Top progress line for any request + a status card for uploads and saves. */
export function ActivityIndicator(){
 const all=useTasks();
 const [visible,setVisible]=useState(false);
 const busy=all.length>0;
 // Short requests finish before the bar would flash.
 useEffect(()=>{if(!busy){setVisible(false);return;}const t=setTimeout(()=>setVisible(true),180);return ()=>clearTimeout(t);},[busy]);
 const writing=all.filter(t=>t.kind!=='load');
 useEffect(()=>{
  if(!writing.length)return;
  const warn=e=>{e.preventDefault();e.returnValue='';};
  window.addEventListener('beforeunload',warn);
  return ()=>window.removeEventListener('beforeunload',warn);
 },[writing.length>0]);
 const uploads=all.filter(t=>t.kind==='upload');
 const current=uploads[0]||writing[0];
 const percent=current?.total?Math.min(100,Math.round(current.loaded/current.total*100)):null;
 return <>
  {visible&&<div className="fixed inset-x-0 top-0 z-[120] h-[3px] overflow-hidden bg-gold-100" role="progressbar" aria-label="Loading"><div className="cms-loading-bar h-full w-1/3 rounded-full bg-gold-500"/></div>}
  {visible&&current&&<div role="status" aria-live="polite" className="fixed left-3 right-3 top-[64px] sm:top-auto sm:right-auto sm:bottom-6 sm:left-6 lg:left-[288px] z-[110] sm:w-[340px] rounded-xl border border-line bg-white p-3.5 shadow-pop">
   <div className="flex items-center gap-3">
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold-100 text-gold-600">{current.kind==='upload'?<UploadCloud size={18}/>:<Loader2 size={18} className="animate-spin"/>}</span>
    <div className="min-w-0 flex-1">
     <p className="text-sm font-semibold text-navy-900">{current.kind==='upload'?(percent===100?'Processing on the server…':'Uploading…'):'Saving…'}{uploads.length>1?` (${uploads.length} files)`:''}</p>
     <p className="truncate text-xs text-slate-500">{current.label||'Please keep this page open.'}</p>
    </div>
    {percent!=null&&<span className="text-sm font-semibold tabular-nums text-navy-900">{percent}%</span>}
   </div>
   {current.kind==='upload'&&<div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">{percent!=null?<div className="h-full rounded-full bg-gold-500 transition-[width] duration-300" style={{width:`${percent}%`}}/>:<div className="cms-loading-bar h-full w-1/3 rounded-full bg-gold-500"/>}</div>}
  </div>}
 </>;
}
