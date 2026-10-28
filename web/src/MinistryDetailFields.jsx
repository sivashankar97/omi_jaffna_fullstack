import React, {useState} from 'react';
import {ArrowDown, ArrowUp, Plus, Trash2} from 'lucide-react';

export const emptyHistory={heading:'',paragraphs:['']};
const emptyArticle={title:'',summary:'',date:'',href:'',image:''};
const emptyPhoto={src:'',alt:'',caption:''};
const emptyVideo={title:'',url:'',thumbnail:'',caption:''};
const emptyEvent={title:'',date:'',place:'',summary:''};
export const emptySection={
 listNo:'',slug:'',title:'',place:'',summary:'',image:'',group:'',
 about:[],focus:[],mapUrl:'',contact:{name:'',role:'',phone:'',email:''},
 history:[emptyHistory],articles:[emptyArticle],photos:[emptyPhoto],videos:[emptyVideo],futureEvents:[emptyEvent],
};
export const emptyMinistryDetail={
 tagline:'',overview:[''],focus:[''],highlights:[{value:'',label:''}],
 scripture:{text:'',reference:''},stories:[{heading:'',paragraphs:['']}],
 majorSections:[emptySection],
};

const CONTENT_TABS=[
 {id:'history',label:'History'},
 {id:'articles',label:'Articles'},
 {id:'photos',label:'Photos'},
 {id:'videos',label:'Videos'},
 {id:'events',label:'Events'},
];

function tools({index,total,onMove,onRemove,label}){
 return <span className="flex shrink-0 items-center gap-0.5">
  <button type="button" title="Move up" disabled={index===0} onClick={e=>{e.preventDefault();onMove(-1)}} className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30"><ArrowUp size={14}/></button>
  <button type="button" title="Move down" disabled={index===total-1} onClick={e=>{e.preventDefault();onMove(1)}} className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30"><ArrowDown size={14}/></button>
  <button type="button" title="Remove" onClick={e=>{e.preventDefault();if(window.confirm(`Remove this ${label}?`))onRemove()}} className="rounded p-1 text-rose-400 hover:bg-rose-50"><Trash2 size={14}/></button>
 </span>;
}

export function ImageUpload({label,value,onChange,upload,hint}){
 const [busy,setBusy]=useState(false);
 async function pick(e){
  const file=e.target.files?.[0];e.target.value='';
  if(!file||!upload)return;
  setBusy(true);
  try{const url=await upload(file,{kind:'image'});if(url)onChange(url)}finally{setBusy(false)}
 }
 return <div>
  <label className="form-label">{label}</label>
  <div className="mt-2 flex items-start gap-3">
   {value?<img src={value} alt="" className="h-16 w-24 shrink-0 rounded-lg bg-slate-100 object-cover"/>:<div className="h-16 w-24 shrink-0 rounded-lg bg-slate-100"/>}
   <div className="min-w-0 flex-1 space-y-2">
    <input className="field" value={value||''} onChange={e=>onChange(e.target.value)} placeholder="/path or uploaded image"/>
    {upload&&<label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-gold-600">
     <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={pick}/>
     {busy?'Uploading…':'Upload image'}
    </label>}
    {hint?<p className="text-[11px] text-slate-400">{hint}</p>:null}
   </div>
  </div>
 </div>;
}

function VideoFileUpload({label,value,onChange,upload}){
 const [busy,setBusy]=useState(false);
 async function pick(e){
  const file=e.target.files?.[0];e.target.value='';
  if(!file||!upload)return;
  setBusy(true);
  try{const url=await upload(file,{kind:'video'});if(url)onChange(url)}finally{setBusy(false)}
 }
 const isFile=/\/api\/files\//.test(value||'')||/\.mp4($|\?)/i.test(value||'');
 return <div>
  <label className="form-label">{label}</label>
  <div className="mt-2 space-y-2">
   <input className="field" value={value||''} onChange={e=>onChange(e.target.value)} placeholder="YouTube / Vimeo link, or upload an MP4"/>
   <div className="flex flex-wrap items-center gap-3">
    {upload&&<label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-gold-600">
     <input type="file" accept="video/mp4" className="sr-only" disabled={busy} onChange={pick}/>
     {busy?'Uploading…':'Upload MP4 file'}
    </label>}
    {isFile?<span className="text-[11px] font-semibold text-emerald-700">Uploaded video file</span>:null}
   </div>
   <p className="text-[11px] text-slate-400">MP4 up to 40 MB, or paste a YouTube / Vimeo link. Approve uploads in File Uploads before publishing.</p>
  </div>
 </div>;
}

function PdfLinkField({label,value,onChange,upload}){
 const [busy,setBusy]=useState(false);
 async function pick(e){
  const file=e.target.files?.[0];e.target.value='';
  if(!file||!upload)return;
  setBusy(true);
  try{const url=await upload(file,{kind:'pdf'});if(url)onChange(url)}finally{setBusy(false)}
 }
 const isFile=/\/api\/files\//.test(value||'')||/\.pdf($|\?)/i.test(value||'');
 return <div>
  <label className="form-label">{label}</label>
  <input className="field mt-2" value={value||''} onChange={e=>onChange(e.target.value)} placeholder="/news/story-name, https://… or upload a PDF"/>
  <div className="mt-2 flex flex-wrap items-center gap-3">
   {upload&&<label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-gold-600">
    <input type="file" accept="application/pdf" className="sr-only" disabled={busy} onChange={pick}/>
    {busy?'Uploading…':'Upload PDF article'}
   </label>}
   {isFile?<a href={value} target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-emerald-700 underline">Open PDF</a>:null}
  </div>
 </div>;
}

export function StringList({label,items,onChange,placeholder}){
 const list=Array.isArray(items)?items:[''];
 return <div>
  <p className="form-label">{label} <span className="font-normal text-slate-400">({list.length})</span></p>
  <div className="mt-2 space-y-2">
   {list.map((item,index)=>(
    <div key={index} className="flex items-start gap-2">
     <textarea className="field flex-1" rows={String(item||'').length>90?3:1} value={item??''} onChange={e=>onChange(list.map((v,i)=>i===index?e.target.value:v))} placeholder={placeholder}/>
     {tools({index,total:list.length,label:'line',onMove:delta=>{const next=[...list];const [row]=next.splice(index,1);next.splice(index+delta,0,row);onChange(next)},onRemove:()=>onChange(list.filter((_,i)=>i!==index))})}
    </div>
   ))}
   <button type="button" onClick={()=>onChange([...list,''])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-gold-400 hover:text-gold-600"><Plus size={14}/> Add line</button>
  </div>
 </div>;
}

export function HistoryEditor({items,onChange}){
 const list=Array.isArray(items)&&items.length?items:[{...emptyHistory}];
 return <div className="space-y-3">
  {list.map((item,index)=>(
   <div key={index} className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
    <div className="flex items-center justify-between gap-2">
     <p className="text-xs font-bold text-navy-900">History block {index+1}</p>
     {tools({index,total:list.length,label:'history block',onMove:delta=>{const next=[...list];const [row]=next.splice(index,1);next.splice(index+delta,0,row);onChange(next)},onRemove:()=>onChange(list.filter((_,i)=>i!==index))})}
    </div>
    <div><label className="form-label">Heading</label><input className="field mt-2" value={item.heading||''} onChange={e=>onChange(list.map((row,i)=>i===index?{...row,heading:e.target.value}:row))}/></div>
    <StringList label="Paragraphs" items={item.paragraphs} placeholder="Paragraph text" onChange={paragraphs=>onChange(list.map((row,i)=>i===index?{...row,paragraphs}:row))}/>
   </div>
  ))}
  <button type="button" onClick={()=>onChange([...list,{...emptyHistory,paragraphs:['']}])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-gold-400 hover:text-gold-600"><Plus size={14}/> Add history block</button>
 </div>;
}

export function ArticlesEditor({items,onChange,upload}){
 const list=Array.isArray(items)?items:[];
 return <div className="space-y-3">
  {list.map((item,index)=>(
   <div key={index} className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
    <div className="flex items-center justify-between gap-2">
     <p className="text-xs font-bold text-navy-900">Article {index+1}</p>
     {tools({index,total:list.length,label:'article',onMove:delta=>{const next=[...list];const [row]=next.splice(index,1);next.splice(index+delta,0,row);onChange(next)},onRemove:()=>onChange(list.filter((_,i)=>i!==index))})}
    </div>
    <div><label className="form-label">Title</label><input className="field mt-2" value={item.title||''} onChange={e=>onChange(list.map((row,i)=>i===index?{...row,title:e.target.value}:row))}/></div>
    <div><label className="form-label">Summary</label><textarea className="field mt-2" rows={3} value={item.summary||''} onChange={e=>onChange(list.map((row,i)=>i===index?{...row,summary:e.target.value}:row))}/></div>
    <div className="grid sm:grid-cols-2 gap-3">
     <div><label className="form-label">Date (YYYY-MM-DD)</label><input className="field mt-2" type="date" value={item.date||''} onChange={e=>onChange(list.map((row,i)=>i===index?{...row,date:e.target.value}:row))}/></div>
     <PdfLinkField label="Link or PDF file" value={item.href||''} upload={upload} onChange={href=>onChange(list.map((row,i)=>i===index?{...row,href}:row))}/>
    </div>
    <ImageUpload label="Article image (optional)" value={item.image||''} upload={upload} onChange={image=>onChange(list.map((row,i)=>i===index?{...row,image}:row))}/>
   </div>
  ))}
  <button type="button" onClick={()=>onChange([...list,{...emptyArticle}])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-gold-400 hover:text-gold-600"><Plus size={14}/> Add article</button>
 </div>;
}

export function PhotosEditor({items,onChange,upload}){
 const list=Array.isArray(items)?items:[];
 return <div className="space-y-3">
  {list.map((item,index)=>(
   <div key={index} className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
    <div className="flex items-center justify-between gap-2">
     <p className="text-xs font-bold text-navy-900">Photo {index+1}</p>
     {tools({index,total:list.length,label:'photo',onMove:delta=>{const next=[...list];const [row]=next.splice(index,1);next.splice(index+delta,0,row);onChange(next)},onRemove:()=>onChange(list.filter((_,i)=>i!==index))})}
    </div>
    <ImageUpload label="Photo file" value={item.src||''} upload={upload} onChange={src=>onChange(list.map((row,i)=>i===index?{...row,src}:row))}/>
    <div><label className="form-label">Alt text</label><input className="field mt-2" value={item.alt||''} onChange={e=>onChange(list.map((row,i)=>i===index?{...row,alt:e.target.value}:row))}/></div>
    <div><label className="form-label">Caption</label><input className="field mt-2" value={item.caption||''} onChange={e=>onChange(list.map((row,i)=>i===index?{...row,caption:e.target.value}:row))}/></div>
   </div>
  ))}
  <button type="button" onClick={()=>onChange([...list,{...emptyPhoto}])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-gold-400 hover:text-gold-600"><Plus size={14}/> Add photo</button>
 </div>;
}

export function VideosEditor({items,onChange,upload}){
 const list=Array.isArray(items)?items:[];
 return <div className="space-y-3">
  {list.map((item,index)=>(
   <div key={index} className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
    <div className="flex items-center justify-between gap-2">
     <p className="text-xs font-bold text-navy-900">Video {index+1}</p>
     {tools({index,total:list.length,label:'video',onMove:delta=>{const next=[...list];const [row]=next.splice(index,1);next.splice(index+delta,0,row);onChange(next)},onRemove:()=>onChange(list.filter((_,i)=>i!==index))})}
    </div>
    <div><label className="form-label">Title</label><input className="field mt-2" value={item.title||''} onChange={e=>onChange(list.map((row,i)=>i===index?{...row,title:e.target.value}:row))}/></div>
    <VideoFileUpload label="Video file or link" value={item.url||''} upload={upload} onChange={url=>onChange(list.map((row,i)=>i===index?{...row,url}:row))}/>
    <ImageUpload label="Thumbnail image" value={item.thumbnail||''} upload={upload} onChange={thumbnail=>onChange(list.map((row,i)=>i===index?{...row,thumbnail}:row))} hint="Shown on the video card before play."/>
    <div><label className="form-label">Caption</label><input className="field mt-2" value={item.caption||''} onChange={e=>onChange(list.map((row,i)=>i===index?{...row,caption:e.target.value}:row))}/></div>
   </div>
  ))}
  <button type="button" onClick={()=>onChange([...list,{...emptyVideo}])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-gold-400 hover:text-gold-600"><Plus size={14}/> Add video</button>
 </div>;
}

export function EventsEditor({items,onChange}){
 const list=Array.isArray(items)?items:[];
 return <div className="space-y-3">
  {list.map((item,index)=>(
   <div key={index} className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
    <div className="flex items-center justify-between gap-2">
     <p className="text-xs font-bold text-navy-900">Event {index+1}</p>
     {tools({index,total:list.length,label:'event',onMove:delta=>{const next=[...list];const [row]=next.splice(index,1);next.splice(index+delta,0,row);onChange(next)},onRemove:()=>onChange(list.filter((_,i)=>i!==index))})}
    </div>
    <div><label className="form-label">Title</label><input className="field mt-2" value={item.title||''} onChange={e=>onChange(list.map((row,i)=>i===index?{...row,title:e.target.value}:row))}/></div>
    <div className="grid sm:grid-cols-2 gap-3">
     <div><label className="form-label">Date</label><input className="field mt-2" type="date" value={item.date||''} onChange={e=>onChange(list.map((row,i)=>i===index?{...row,date:e.target.value}:row))}/></div>
     <div><label className="form-label">Place</label><input className="field mt-2" value={item.place||''} onChange={e=>onChange(list.map((row,i)=>i===index?{...row,place:e.target.value}:row))}/></div>
    </div>
    <div><label className="form-label">Summary</label><textarea className="field mt-2" rows={3} value={item.summary||''} onChange={e=>onChange(list.map((row,i)=>i===index?{...row,summary:e.target.value}:row))}/></div>
   </div>
  ))}
  <button type="button" onClick={()=>onChange([...list,{...emptyEvent}])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-gold-400 hover:text-gold-600"><Plus size={14}/> Add event</button>
 </div>;
}

function SectionContentTabs({section,onChange,upload}){
 const [tab,setTab]=useState('history');
 const counts={
  history:(section.history||[]).length,
  articles:(section.articles||[]).length,
  photos:(section.photos||[]).length,
  videos:(section.videos||[]).length,
  events:(section.futureEvents||[]).length,
 };
 return <div className="space-y-4">
  <div role="tablist" aria-label="Section content" className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
   {CONTENT_TABS.map(item=>(
    <button
     key={item.id}
     type="button"
     role="tab"
     aria-selected={tab===item.id}
     onClick={()=>setTab(item.id)}
     className={tab===item.id
      ?'rounded-lg bg-white px-3 py-2 text-xs font-bold text-navy-900 shadow-sm'
      :'rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900'}
    >
     {item.label}
     <span className="ml-1.5 text-[10px] font-bold text-slate-400">{counts[item.id]}</span>
    </button>
   ))}
  </div>
  {tab==='history'?<HistoryEditor items={section.history} onChange={history=>onChange({...section,history})}/>:null}
  {tab==='articles'?<ArticlesEditor items={section.articles} onChange={articles=>onChange({...section,articles})} upload={upload}/>:null}
  {tab==='photos'?<PhotosEditor items={section.photos} onChange={photos=>onChange({...section,photos})} upload={upload}/>:null}
  {tab==='videos'?<VideosEditor items={section.videos} onChange={videos=>onChange({...section,videos})} upload={upload}/>:null}
  {tab==='events'?<EventsEditor items={section.futureEvents} onChange={futureEvents=>onChange({...section,futureEvents})}/>:null}
 </div>;
}

function MajorSectionCard({section,index,total,onChange,onMove,onRemove,upload}){
 const [open,setOpen]=useState(index===0);
 const title=section.title||section.place||`Place ${index+1}`;
 return <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
  <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-3 py-2">
   <button type="button" onClick={()=>setOpen(v=>!v)} className="min-w-0 flex-1 text-left">
    <p className="truncate text-sm font-bold text-navy-900"><span className="mr-2 text-slate-400">{index+1}.</span>{title}</p>
    <p className="truncate text-[11px] text-slate-500">{[section.group,section.place].filter(Boolean).join(' · ')||'Major section / place tab'}</p>
   </button>
   {tools({index,total,label:'major section',onMove,onRemove})}
  </div>
  {open?<div className="space-y-4 p-4">
   <div className="grid sm:grid-cols-2 gap-3">
    <div><label className="form-label">List number</label><input className="field mt-2" value={section.listNo||''} onChange={e=>onChange({...section,listNo:e.target.value})}/></div>
    <div><label className="form-label">URL name (slug)</label><input className="field mt-2" value={section.slug||''} onChange={e=>onChange({...section,slug:e.target.value})}/></div>
    <div><label className="form-label">Title</label><input className="field mt-2" value={section.title||''} onChange={e=>onChange({...section,title:e.target.value})}/></div>
    <div><label className="form-label">Place</label><input className="field mt-2" value={section.place||''} onChange={e=>onChange({...section,place:e.target.value})}/></div>
    <div><label className="form-label">Group</label><input className="field mt-2" value={section.group||''} onChange={e=>onChange({...section,group:e.target.value})} placeholder="e.g. Schools"/></div>
    <div><label className="form-label">Summary</label><input className="field mt-2" value={section.summary||''} onChange={e=>onChange({...section,summary:e.target.value})}/></div>
   </div>
   <ImageUpload label="Section banner image" value={section.image||''} upload={upload} onChange={image=>onChange({...section,image})}/>
   <div>
    <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Content tabs on the website</p>
    <SectionContentTabs section={section} onChange={onChange} upload={upload}/>
   </div>
  </div>:null}
 </div>;
}

/** Editable ministry page detail: tagline/stories + major sections with History / Articles / Photos / Videos / Events. */
export function MinistryDetailFields({value,onChange,upload}){
 const detail={...emptyMinistryDetail,...(value&&typeof value==='object'?value:{}),majorSections:Array.isArray(value?.majorSections)?value.majorSections:[]};
 const set=(patch)=>onChange({...detail,...patch});
 const sections=detail.majorSections;

 return <div className="space-y-5">
  <div><label className="form-label">Tagline</label><input className="field mt-2" value={detail.tagline||''} onChange={e=>set({tagline:e.target.value})}/></div>
  <StringList label="Overview" items={detail.overview} placeholder="Overview paragraph" onChange={overview=>set({overview})}/>
  <StringList label="Focus points" items={detail.focus} placeholder="Focus point" onChange={focus=>set({focus})}/>

  <div>
   <p className="form-label">Highlights <span className="font-normal text-slate-400">({(detail.highlights||[]).length})</span></p>
   <div className="mt-2 space-y-2">
    {(detail.highlights||[]).map((item,index)=>(
     <div key={index} className="flex items-start gap-2 rounded-xl border border-slate-200 p-3">
      <div className="grid flex-1 sm:grid-cols-2 gap-2">
       <input className="field" value={item.value||''} onChange={e=>set({highlights:detail.highlights.map((row,i)=>i===index?{...row,value:e.target.value}:row)})} placeholder="Value"/>
       <input className="field" value={item.label||''} onChange={e=>set({highlights:detail.highlights.map((row,i)=>i===index?{...row,label:e.target.value}:row)})} placeholder="Label"/>
      </div>
      {tools({index,total:detail.highlights.length,label:'highlight',onMove:delta=>{const next=[...detail.highlights];const [row]=next.splice(index,1);next.splice(index+delta,0,row);set({highlights:next})},onRemove:()=>set({highlights:detail.highlights.filter((_,i)=>i!==index)})})}
     </div>
    ))}
    <button type="button" onClick={()=>set({highlights:[...(detail.highlights||[]),{value:'',label:''}]})} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-gold-400 hover:text-gold-600"><Plus size={14}/> Add highlight</button>
   </div>
  </div>

  <div className="grid sm:grid-cols-2 gap-3 rounded-xl border border-slate-200 p-3">
   <div className="sm:col-span-2"><label className="form-label">Scripture text</label><textarea className="field mt-2" rows={2} value={detail.scripture?.text||''} onChange={e=>set({scripture:{...(detail.scripture||{}),text:e.target.value}})}/></div>
   <div><label className="form-label">Scripture reference</label><input className="field mt-2" value={detail.scripture?.reference||''} onChange={e=>set({scripture:{...(detail.scripture||{}),reference:e.target.value}})}/></div>
  </div>

  <div>
   <p className="form-label">Stories <span className="font-normal text-slate-400">({(detail.stories||[]).length})</span></p>
   <div className="mt-2 space-y-3">
    {(detail.stories||[]).map((item,index)=>(
     <div key={index} className="rounded-xl border border-slate-200 p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
       <p className="text-xs font-bold text-navy-900">Story {index+1}</p>
       {tools({index,total:detail.stories.length,label:'story',onMove:delta=>{const next=[...detail.stories];const [row]=next.splice(index,1);next.splice(index+delta,0,row);set({stories:next})},onRemove:()=>set({stories:detail.stories.filter((_,i)=>i!==index)})})}
      </div>
      <div><label className="form-label">Heading</label><input className="field mt-2" value={item.heading||''} onChange={e=>set({stories:detail.stories.map((row,i)=>i===index?{...row,heading:e.target.value}:row)})}/></div>
      <StringList label="Paragraphs" items={item.paragraphs} placeholder="Paragraph" onChange={paragraphs=>set({stories:detail.stories.map((row,i)=>i===index?{...row,paragraphs}:row)})}/>
     </div>
    ))}
    <button type="button" onClick={()=>set({stories:[...(detail.stories||[]),{heading:'',paragraphs:['']}]})} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-gold-400 hover:text-gold-600"><Plus size={14}/> Add story</button>
   </div>
  </div>

  <div className="space-y-3 rounded-xl border border-sky-200 bg-sky-50/30 p-3">
   <div>
    <p className="text-sm font-bold text-navy-900">Major sections (place tabs)</p>
    <p className="mt-1 text-[11px] leading-5 text-slate-500">Each place is a card on the ministry page and has its own page. For the full editor (about text, contact, map, articles, photos, videos, events) use <b>Ministries › Places &amp; communities</b> in the menu.</p>
   </div>
   {sections.map((section,index)=>(
    <MajorSectionCard
     key={index}
     section={{...emptySection,...section}}
     index={index}
     total={sections.length}
     upload={upload}
     onChange={next=>set({majorSections:sections.map((row,i)=>i===index?next:row)})}
     onMove={delta=>{const next=[...sections];const [row]=next.splice(index,1);next.splice(index+delta,0,row);set({majorSections:next})}}
     onRemove={()=>set({majorSections:sections.filter((_,i)=>i!==index)})}
    />
   ))}
   <button type="button" onClick={()=>set({majorSections:[...sections,{...emptySection,history:[{...emptyHistory,paragraphs:['']}],articles:[],photos:[],videos:[],futureEvents:[]}]})} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-sky-300 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 hover:border-gold-400 hover:text-gold-600"><Plus size={14}/> Add major section</button>
  </div>
 </div>;
}
