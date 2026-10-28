import React, {useEffect,useMemo,useState} from 'react';
import {ArrowDown, ArrowUp, Copy, ExternalLink, Eye, MapPin, Plus, Save, Search, Trash2} from 'lucide-react';
import {
 ArticlesEditor,EventsEditor,HistoryEditor,ImageUpload,PhotosEditor,StringList,VideosEditor,
 emptyHistory,emptySection,
} from './MinistryDetailFields.jsx';

const anchorId=s=>String(s||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const pad=n=>String(n||0).padStart(2,'0');
const ministryPath=m=>`/ministries/${pad(m.sort_order)}-${anchorId(m.title_en)}`;

// Fields accepted by PUT /api/items/:id (api/src/validation.js is strict).
const ITEM_KEYS=['type','slug','title_en','title_ta','title_si','excerpt_en','excerpt_ta','excerpt_si','body_en','body_ta','body_si','location_text','image_url','media_url','status','verification_status','featured'];

const TABS=[
 {id:'details',label:'Details'},
 {id:'about',label:'About & contact'},
 {id:'history',label:'History',key:'history'},
 {id:'articles',label:'Articles',key:'articles'},
 {id:'photos',label:'Photos',key:'photos'},
 {id:'videos',label:'Videos',key:'videos'},
 {id:'events',label:'Events',key:'futureEvents'},
];

const blankPlace=()=>({...emptySection,contact:{...emptySection.contact},history:[{...emptyHistory,paragraphs:['']}],articles:[],photos:[],videos:[],futureEvents:[]});
const normalize=p=>({...blankPlace(),...p,contact:{...emptySection.contact,...(p?.contact||{})}});

function Field({label,value,onChange,placeholder,hint,long=false,type='text'}){
 return <div>
  <label className="form-label">{label}</label>
  {long
   ?<textarea className="field mt-2" rows={3} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
   :<input className="field mt-2" type={type} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>}
  {hint?<p className="mt-1 text-[11px] text-slate-400">{hint}</p>:null}
 </div>;
}

/** Ministries › Places & communities: pick a ministry, then edit each place (its own website page) on its own screen. */
export default function PlacesManager({api,notify,user,upload}){
 const [ministries,setMinistries]=useState([]);
 const [ministryId,setMinistryId]=useState('');
 const [places,setPlaces]=useState([]);
 const [active,setActive]=useState(0);
 const [tab,setTab]=useState('details');
 const [q,setQ]=useState('');
 const [dirty,setDirty]=useState(false);
 const [busy,setBusy]=useState(false);
 const [loading,setLoading]=useState(true);

 const ministry=ministries.find(m=>m.id===ministryId);
 const canEdit=['admin','editor','publisher'].includes(user.role)&&!(ministry?.status==='published'&&user.role==='editor');

 useEffect(()=>{
  api('/api/items?type=ministry').then(d=>{
   const list=[...d.items].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
   setMinistries(list);
   if(list.length)setMinistryId(id=>id||list[0].id);
  }).catch(e=>notify(e.message,'error')).finally(()=>setLoading(false));
 },[]);

 useEffect(()=>{
  if(!ministry)return;
  setPlaces((ministry.metadata?.detail?.majorSections||[]).map(normalize));
  setActive(0);setDirty(false);
 },[ministryId,ministries]);

 useEffect(()=>{
  if(!dirty)return;
  const warn=e=>{e.preventDefault();e.returnValue=''};
  window.addEventListener('beforeunload',warn);
  return ()=>window.removeEventListener('beforeunload',warn);
 },[dirty]);

 const update=next=>{setPlaces(next);setDirty(true)};
 const place=places[active];
 const setPlace=patch=>update(places.map((p,i)=>i===active?{...p,...patch}:p));

 function switchMinistry(id){
  if(dirty&&!window.confirm('You have unsaved changes for this ministry. Discard them?'))return;
  setMinistryId(id);
 }
 function addPlace(){
  const next=[...places,{...blankPlace(),listNo:pad(places.length+1)}];
  update(next);setActive(next.length-1);setTab('details');
 }
 function duplicate(index){
  const copy=JSON.parse(JSON.stringify(places[index]));
  copy.title=`${copy.title||'Place'} (copy)`;copy.slug='';
  const next=[...places];next.splice(index+1,0,copy);update(next);setActive(index+1);
 }
 function remove(index){
  if(!window.confirm(`Remove "${places[index].title||`Place ${index+1}`}" and all its content?`))return;
  update(places.filter((_,i)=>i!==index));setActive(a=>Math.max(0,a>=index?a-1:a));
 }
 function move(index,delta){
  const next=[...places];const [row]=next.splice(index,1);next.splice(index+delta,0,row);
  update(next);setActive(index+delta);
 }

 async function save(){
  if(!ministry)return;
  const slugs=new Set();
  const cleaned=places.map((p,i)=>{
   const slug=anchorId(p.slug||[p.listNo||i+1,p.title,p.place].filter(Boolean).join(' '));
   return {...p,slug};
  });
  for(const [i,p] of cleaned.entries()){
   if(!p.title.trim()){setActive(i);setTab('details');notify(`Place ${i+1} needs a title.`,'error');return;}
   if(slugs.has(p.slug)){setActive(i);setTab('details');notify(`Two places share the web address "${p.slug}". Change one of them.`,'error');return;}
   slugs.add(p.slug);
  }
  setBusy(true);
  try{
   const metadata={...(ministry.metadata||{}),detail:{...(ministry.metadata?.detail||{}),majorSections:cleaned}};
   const body=Object.fromEntries(ITEM_KEYS.filter(k=>ministry[k]!==undefined&&ministry[k]!==null).map(k=>[k,ministry[k]]));
   Object.assign(body,{metadata,event_date:ministry.event_date?new Date(ministry.event_date).toISOString():null,last_verified_at:ministry.last_verified_at?String(ministry.last_verified_at).slice(0,10):null,sort_order:Number(ministry.sort_order)||0});
   const {item}=await api(`/api/items/${ministry.id}`,{method:'PUT',body:JSON.stringify(body)});
   setMinistries(list=>list.map(m=>m.id===item.id?item:m));
   setDirty(false);
   notify('Places saved. The website updates within a minute.','success');
  }catch(e){notify(e.message,'error')}finally{setBusy(false)}
 }

 const filtered=useMemo(()=>places.map((p,i)=>[p,i]).filter(([p])=>!q||`${p.title} ${p.place} ${p.group}`.toLowerCase().includes(q.toLowerCase())),[places,q]);
 const count=key=>(place?.[key]||[]).length;
 const placeLink=ministry&&place?.slug?`${ministryPath(ministry)}/${anchorId(place.slug)}`:ministry?ministryPath(ministry):'';

 if(loading)return <div className="panel p-8 text-sm text-slate-500">Loading ministries…</div>;
 if(!ministries.length)return <div className="panel p-8 text-sm text-slate-500">No ministries yet. Add one under Ministries first.</div>;

 return <div className="space-y-5">
  <div className="flex flex-wrap items-center justify-between gap-4">
   <p className="inline-flex items-center gap-1.5 text-sm text-slate-500"><Eye size={15} className="text-gold-600"/>Shown on: <b className="font-semibold text-navy-900">each ministry page (place cards) and each place’s own page</b></p>
   <div className="flex flex-wrap items-center gap-2">
    {dirty?<span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">Unsaved changes</span>:null}
    {placeLink?<a href={placeLink} target="_blank" rel="noreferrer" className="btn-outline text-xs">View on website <ExternalLink size={14}/></a>:null}
    <button type="button" className="btn-primary" disabled={!dirty||busy||!canEdit} onClick={save}><Save size={16}/> {busy?'Saving…':'Save places'}</button>
   </div>
  </div>
  {!canEdit?<p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800 ring-1 ring-amber-100">This ministry is published — only a publisher or admin can change its places.</p>:null}

  <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
   <aside className="panel flex flex-col gap-3 p-4 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start">
    <div>
     <label className="form-label">Ministry</label>
     <select className="field mt-2" value={ministryId} onChange={e=>switchMinistry(e.target.value)}>
      {ministries.map(m=><option key={m.id} value={m.id}>{pad(m.sort_order)} · {m.title_en}</option>)}
     </select>
    </div>
    <div className="relative">
     <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
     <input className="field pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search ${places.length} places`}/>
    </div>
    <ul className="scroll-slim -mx-1 min-h-0 flex-1 space-y-1 overflow-y-auto px-1">
     {filtered.map(([p,i])=>(
      <li key={i}>
       <div className={`group flex items-center gap-2 rounded-xl px-2 py-2 ${i===active?'bg-navy-900 text-white':'hover:bg-slate-50'}`}>
        <button type="button" onClick={()=>setActive(i)} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
         <span className={`grid size-8 shrink-0 place-items-center rounded-lg text-[11px] font-bold ${i===active?'bg-white/15 text-white':'bg-sky-50 text-sky-800'}`}>{p.listNo||pad(i+1)}</span>
         <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{p.title||`Untitled place ${i+1}`}</span>
          <span className={`block truncate text-[11px] ${i===active?'text-white/70':'text-slate-400'}`}>{[p.place,p.group].filter(Boolean).join(' · ')||'No place set'}</span>
         </span>
        </button>
        <span className={`flex shrink-0 items-center ${i===active?'':'opacity-0 group-hover:opacity-100'}`}>
         <button type="button" title="Move up" disabled={i===0||!!q} onClick={()=>move(i,-1)} className="rounded p-1 hover:bg-white/10 disabled:opacity-30"><ArrowUp size={13}/></button>
         <button type="button" title="Move down" disabled={i===places.length-1||!!q} onClick={()=>move(i,1)} className="rounded p-1 hover:bg-white/10 disabled:opacity-30"><ArrowDown size={13}/></button>
         <button type="button" title="Duplicate" onClick={()=>duplicate(i)} className="rounded p-1 hover:bg-white/10"><Copy size={13}/></button>
         <button type="button" title="Remove" onClick={()=>remove(i)} className="rounded p-1 text-rose-400 hover:bg-rose-50/20"><Trash2 size={13}/></button>
        </span>
       </div>
      </li>
     ))}
     {!places.length?<li className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">No places yet for this ministry.</li>:null}
    </ul>
    <button type="button" onClick={addPlace} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-sky-300 px-3 py-2.5 text-xs font-semibold text-sky-800 hover:border-gold-400 hover:text-gold-600"><Plus size={14}/> Add place / community</button>
   </aside>

   {place?<section className="panel min-w-0 p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
     <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold-600">Place {place.listNo||pad(active+1)} · {ministry?.title_en}</p>
      <h2 className="mt-1 truncate text-xl font-bold text-navy-900">{place.title||'Untitled place'}</h2>
      {place.place?<p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500"><MapPin size={13}/>{place.place}</p>:null}
     </div>
    </div>

    <div role="tablist" aria-label="Place content" className="mt-4 flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
     {TABS.map(t=><button key={t.id} type="button" role="tab" aria-selected={tab===t.id} onClick={()=>setTab(t.id)} className={tab===t.id?'rounded-lg bg-white px-3 py-2 text-xs font-bold text-navy-900 shadow-sm':'rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900'}>
      {t.label}{t.key?<span className="ml-1.5 text-[10px] font-bold text-slate-400">{count(t.key)}</span>:null}
     </button>)}
    </div>

    <div className="mt-5">
     {tab==='details'?<div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
       <Field label="Title *" value={place.title} onChange={title=>setPlace({title})} placeholder="e.g. St. Jude Parish"/>
       <Field label="Place / town" value={place.place} onChange={v=>setPlace({place:v})} placeholder="e.g. Pasara"/>
       <Field label="Group (optional)" value={place.group} onChange={group=>setPlace({group})} placeholder="e.g. Schools, Hostels" hint="Shown as a small tag on the card."/>
       <Field label="Number on the card" value={place.listNo} onChange={listNo=>setPlace({listNo})} placeholder={pad(active+1)}/>
      </div>
      <Field label="Short summary" long value={place.summary} onChange={summary=>setPlace({summary})} placeholder="One or two sentences shown in the banner and at the top of the page"/>
      <Field label="Web address (slug)" value={place.slug} onChange={slug=>setPlace({slug:anchorId(slug)})} placeholder="filled automatically from the title when you save" hint={placeLink?`Page: ${placeLink}`:'Changing this changes the page address; old links stop working.'}/>
      <ImageUpload label="Banner image" value={place.image} upload={upload} onChange={image=>setPlace({image})} hint="Large photo at the top of the place page. Empty uses the ministry photo."/>
     </div>:null}

     {tab==='about'?<div className="space-y-6">
      <StringList label="About this place (paragraphs)" items={place.about?.length?place.about:['']} placeholder="Paragraph about the place, its people and the Oblate presence" onChange={about=>setPlace({about})}/>
      <p className="-mt-3 text-[11px] text-slate-400">Empty shows a short standard sentence.</p>
      <StringList label="How the mission serves here" items={place.focus?.length?place.focus:['']} placeholder="e.g. Sunday Mass and sacraments" onChange={focus=>setPlace({focus})}/>
      <p className="-mt-3 text-[11px] text-slate-400">Empty uses the ministry’s focus points.</p>
      <Field label="Map link" value={place.mapUrl} onChange={mapUrl=>setPlace({mapUrl})} placeholder="https://maps.app.goo.gl/…" hint="Empty searches Google Maps for the title and place."/>
      <div className="rounded-xl border border-slate-200 p-4">
       <p className="text-xs font-bold text-navy-900">Local contact (optional)</p>
       <p className="mt-1 text-[11px] text-slate-400">Shown in the “Visit or support” card. Empty phone / email uses the Province office.</p>
       <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <Field label="Name" value={place.contact?.name} onChange={name=>setPlace({contact:{...place.contact,name}})} placeholder="e.g. Rev. Fr. …"/>
        <Field label="Role" value={place.contact?.role} onChange={role=>setPlace({contact:{...place.contact,role}})} placeholder="e.g. Parish priest"/>
        <Field label="Phone" value={place.contact?.phone} onChange={phone=>setPlace({contact:{...place.contact,phone}})} placeholder="021 …"/>
        <Field label="Email" type="email" value={place.contact?.email} onChange={email=>setPlace({contact:{...place.contact,email}})}/>
       </div>
      </div>
     </div>:null}

     {tab==='history'?<HistoryEditor items={place.history} onChange={history=>setPlace({history})}/>:null}
     {tab==='articles'?<ArticlesEditor items={place.articles} upload={upload} onChange={articles=>setPlace({articles})}/>:null}
     {tab==='photos'?<PhotosEditor items={place.photos} upload={upload} onChange={photos=>setPlace({photos})}/>:null}
     {tab==='videos'?<VideosEditor items={place.videos} upload={upload} onChange={videos=>setPlace({videos})}/>:null}
     {tab==='events'?<EventsEditor items={place.futureEvents} onChange={futureEvents=>setPlace({futureEvents})}/>:null}
    </div>
    <p className="mt-6 border-t border-slate-100 pt-4 text-[11px] leading-5 text-slate-400">Uploaded photos, videos and PDFs must be approved in File Uploads before visitors can see them. Click <b>Save places</b> to publish changes for this ministry.</p>
   </section>:<section className="panel grid place-items-center p-10 text-sm text-slate-500">Add a place to start.</section>}
  </div>
 </div>;
}
