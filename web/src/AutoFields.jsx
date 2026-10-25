import React, {useEffect, useState} from 'react';
import {ArrowDown, ArrowUp, ChevronDown, Plus, Trash2} from 'lucide-react';

let blocksRequest=null;
/** Default website text and shapes, served by the public site at /cms-blocks. */
export function useCmsBlocks(){
 const [state,setState]=useState({data:null,error:''});
 useEffect(()=>{
  let active=true;
  blocksRequest??=fetch('/cms-blocks').then(r=>{if(!r.ok)throw Error('Could not load the website sections. Open the CMS through the website address (/admin).');return r.json();});
  blocksRequest.then(data=>{if(active)setState({data,error:''})}).catch(error=>{blocksRequest=null;if(active)setState({data:null,error:error.message})});
  return ()=>{active=false};
 },[]);
 return state;
}

/** Same rules as the website: lists are replaced whole, empty text keeps the default. */
export function mergeContent(base,edit){
 if(edit==null)return base;
 if(Array.isArray(base))return Array.isArray(edit)?edit:base;
 if(base&&typeof base==='object'){
  if(typeof edit!=='object'||Array.isArray(edit))return base;
  const out={...base};
  for(const [key,value] of Object.entries(edit))out[key]=key in out?mergeContent(out[key],value):value;
  return out;
 }
 if(typeof edit==='string'&&!edit.trim())return base;
 return base===undefined||typeof edit===typeof base?edit:base;
}

const LABELS={phoneHref:'Phone link (tel:+94…)',mapLink:'Google Maps link',href:'Link (e.g. /charism)',src:'Image',alt:'Image description',imageAlt:'Image description',fit:'Image fit',id:'Link name (letters and dashes)',kicker:'Small heading (e.g. Provincial Superior)',whoWeAre:'Who we are',briefHistory:'Brief history',liveImage:'Live tile image',eventsImage:'Events tile image',joinUs:'Join us',logos:'Logos',headerImage:'Header logo (top left)',emblemImage:'Province emblem (header right, footer, sign-in page, news articles)',newsImage:'Default news photo (stories without a cover image)',hero:'Top banner',posterImage:'Banner image (shown while the video loads)',video:'Banner video (link to an MP4 file)',images:'Photos',heroImage:'Top banner photo',familyImage:'"Oblate family" photo',familyImageAlt:'"Oblate family" photo description',historyImage:'History section background photo',identityImage:'"Our identity" photo',identityImageAlt:'"Our identity" photo description',crossImage:'Mission & vision cross image',mission:'Mission (glass card on /charism#mission)',vision:'Vision (glass card on /charism#vision)',motto:'Motto (glass card on /charism#motto)',superior:'Provincial Superior section heading',title:'Main title (e.g. Our Provincial Leader)',summary:'Intro paragraph',ministriesLabel:'Stat label — ministries count',parishesLabel:'Stat label — parishes count',missionValue:'Mission stat number',missionName:'Mission name (third hero stat)',countriesValue:'Countries number',countriesLabel:'Countries label',continentsValue:'Continents number',continentsLabel:'Continents label',studyAbroadValue:'Study abroad number',studyAbroadLabel:'Study abroad label',category1:'Category 1 section',category2:'Category 2 section',countryCardCta:'Country card button text',formation:'Formation abroad section',closing:'Bottom quote & button',quote:'Quote',reference:'Scripture reference',ctaLabel:'Button text',ctaHref:'Button link',magazinesLabel:'Stat — magazines',librariesLabel:'Stat — libraries',booksLabel:'Stat — books',articlesLabel:'Stat — articles',collectionsKicker:'Collections small heading',collectionsTitle:'Collections title',cardTitle:'Card title on Library hub',cardDescription:'Card description on Library hub',cardCta:'Card button text',pageKicker:'Section page small heading',pageTitle:'Section page title',pageSummary:'Section page intro',empty:'Empty-state message',downloadLabel:'Download button text',comingSoonLabel:'No-PDF message',backLabel:'Back link text',magazine:'Magazine section copy',libraries:'Libraries section copy',books:'Books section copy',articles:'Articles section copy',topImage:'Top photo',topImageAlt:'Top photo description',videoImage:'Video tile photo',gallery:'Photo gallery',caption:'Caption',stories:'History & details (replaces the overview on the ministry page)',majorSections:'Major section tabs (places)',listNo:'List number',slug:'URL name',place:'Place',group:'Group (e.g. Schools)',history:'History',photos:'Photos',videos:'Videos',futureEvents:'Events',missions:'Missions',url:'Video link',thumbnail:'Video thumbnail',date:'Date (YYYY-MM-DD)',paragraphs:'Paragraphs',overview:'Overview (shown when there is no history)',focus:'Focus points'};
const labelOf=key=>LABELS[key]||String(key).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_-]/g,' ').replace(/^\w/,c=>c.toUpperCase());
const isImageKey=key=>/^(src|image|photo|thumbnail)$|Image$/.test(String(key));
const blank=t=>Array.isArray(t)?[]:t&&typeof t==='object'?Object.fromEntries(Object.entries(t).map(([k,v])=>[k,blank(v)])):typeof t==='number'?0:typeof t==='boolean'?false:'';
const itemShape=items=>{
 const objects=items.filter(x=>x&&typeof x==='object'&&!Array.isArray(x));
 if(!objects.length)return '';
 return objects.reduce((shape,item)=>{for(const [k,v] of Object.entries(item))if(!(k in shape)||(Array.isArray(v)&&v.length&&!shape[k]?.length))shape[k]=v;return shape},{});
};
const preview=item=>{
 if(typeof item==='string')return item;
 if(!item||typeof item!=='object')return '';
 const text=['title','label','name','year','range','text','q','caption','alt'].map(k=>item[k]).find(v=>typeof v==='string'&&v.trim());
 return text||Object.values(item).find(v=>typeof v==='string'&&v.trim())||'';
};

function ImageField({label,value,onChange,upload}){
 const [busy,setBusy]=useState(false);
 async function pick(e){const file=e.target.files?.[0];e.target.value='';if(!file||!upload)return;setBusy(true);try{const url=await upload(file);if(url)onChange(url)}finally{setBusy(false)}}
 return <div><label className="form-label">{label}</label><div className="mt-2 flex items-start gap-3">
  {value?<img src={value} alt="" className="h-16 w-24 shrink-0 rounded-lg bg-slate-100 object-cover"/>:<div className="h-16 w-24 shrink-0 rounded-lg bg-slate-100"/>}
  <div className="min-w-0 flex-1 space-y-2"><input className="field" value={value||''} onChange={e=>onChange(e.target.value)} placeholder="/path/image.jpg or uploaded image"/>
   {upload&&<label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-gold-600"><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={pick}/>{busy?'Uploading…':'Upload a new image'}</label>}
  </div></div></div>;
}

function TextField({name,label,value,template,onChange,upload}){
 if(isImageKey(name))return <ImageField label={label} value={value} onChange={onChange} upload={upload}/>;
 if(name==='fit')return <div><label className="form-label">{label}</label><select className="field mt-2" value={value||'cover'} onChange={e=>onChange(e.target.value)}><option value="cover">Fill the frame</option><option value="contain">Show the whole image</option></select></div>;
 if(typeof template==='number')return <div><label className="form-label">{label}</label><input type="number" className="field mt-2" value={value??''} onChange={e=>onChange(e.target.value===''?'':Number(e.target.value))}/></div>;
 const long=String(template||'').length>80||String(value||'').length>80||String(value||'').includes('\n');
 return <div><label className="form-label">{label}</label>{long
  ?<textarea className="field mt-2" rows={Math.min(8,Math.max(3,Math.ceil(String(value||'').length/90)))} value={value??''} onChange={e=>onChange(e.target.value)}/>
  :<input className="field mt-2" value={value??''} onChange={e=>onChange(e.target.value)}/>}</div>;
}

function ListField({name,label,value,template,onChange,upload,depth}){
 const items=Array.isArray(value)?value:[];
 const shape=itemShape([...template,...items]);
 const objects=shape!=='';
 const set=(index,next)=>onChange(items.map((item,i)=>i===index?next:item));
 const move=(index,delta)=>{const next=[...items];const [item]=next.splice(index,1);next.splice(index+delta,0,item);onChange(next)};
 const singular=labelOf(name).replace(/ies$/,'y').replace(/s$/,'');
 return <div><p className="form-label">{label} <span className="font-normal text-slate-400">({items.length})</span></p><div className="mt-2 space-y-2">
  {items.map((item,index)=>{
   const act=fn=>e=>{e.preventDefault();e.stopPropagation();fn()};
   const tools=<span className="flex shrink-0 items-center gap-0.5"><button type="button" title="Move up" disabled={index===0} onClick={act(()=>move(index,-1))} className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30"><ArrowUp size={14}/></button><button type="button" title="Move down" disabled={index===items.length-1} onClick={act(()=>move(index,1))} className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30"><ArrowDown size={14}/></button><button type="button" title="Remove" onClick={act(()=>{if(window.confirm(`Remove "${preview(item).slice(0,60)||singular}"?`))onChange(items.filter((_,i)=>i!==index))})} className="rounded p-1 text-rose-400 hover:bg-rose-50"><Trash2 size={14}/></button></span>;
   if(!objects)return <div key={index} className="flex items-start gap-2">{isImageKey(name.replace(/s$/,''))||name==='photos'
    ?<div className="flex-1"><ImageField label={`${singular} ${index+1}`} value={item} onChange={v=>set(index,v)} upload={upload}/></div>
    :<textarea className="field flex-1" rows={String(item).length>90?3:1} value={item??''} onChange={e=>set(index,e.target.value)}/>}{tools}</div>;
   return <details key={index} className="rounded-xl border border-slate-200 bg-white"><summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-semibold text-navy-900"><span className="text-slate-400">{index+1}.</span><span className="min-w-0 flex-1 truncate">{preview(item)||`New ${singular.toLowerCase()}`}</span>{tools}</summary>
    <div className="space-y-4 border-t border-slate-100 p-3"><AutoFields value={item} template={shape} onChange={v=>set(index,v)} upload={upload} depth={depth+1} flat/></div></details>;
  })}
  <button type="button" onClick={()=>onChange([...items,objects?blank(shape):''])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-gold-400 hover:text-gold-600"><Plus size={14}/> Add {singular.toLowerCase()}</button>
 </div></div>;
}

/** Form generated from the shape of the default content. */
export function AutoFields({value,template,onChange,upload,name='',depth=0,flat=false}){
 if(Array.isArray(template))return <ListField name={name} label={labelOf(name)} value={value} template={template} onChange={onChange} upload={upload} depth={depth}/>;
 if(template&&typeof template==='object'){
  const current=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
  const fields=Object.keys(template).map(key=><AutoFields key={key} name={key} value={current[key]} template={template[key]} onChange={v=>onChange({...current,[key]:v})} upload={upload} depth={depth+1}/>);
  if(depth===0||flat)return <div className="space-y-4">{fields}</div>;
  return <details className="group rounded-xl border border-slate-200 bg-slate-50/60"><summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-bold text-navy-900">{labelOf(name)}<ChevronDown size={16} className="text-slate-400 group-open:rotate-180"/></summary><div className="space-y-4 border-t border-slate-200 bg-white p-4 rounded-b-xl">{fields}</div></details>;
 }
 return <TextField name={name} label={labelOf(name)} value={value} template={template} onChange={onChange} upload={upload}/>;
}
