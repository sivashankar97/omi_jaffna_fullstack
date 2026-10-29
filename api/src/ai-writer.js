import {query} from './db.js';

const GEMINI_URL='https://generativelanguage.googleapis.com/v1beta/models';
const WIKI_URL='https://en.wikipedia.org/w/api.php';
const USER_AGENT='OMIJaffnaCMS/1.0 (https://omijaffna.com; omijaffnadatabase@gmail.com)';

export const aiConfigured=()=>Boolean(process.env.GEMINI_API_KEY);

const STYLE=`You write for the website of the Oblates of Mary Immaculate (OMI), Province of Jaffna, Sri Lanka.
Write in clear, warm British English suitable for a Catholic religious congregation's news page.
Facts about THIS event (names, numbers, times, who did what, quotes) must come ONLY from the event details. Never invent them.
You may use the background notes to enrich the text with general context: the history and meaning of the place, parish, shrine or feast, and the mission of the Oblates in Jaffna. Use only background that clearly relates to this event; ignore the rest.
Never mention war, conflict, violence, politics or controversy. No headings, no markdown, no emojis, no bullet points.
Separate paragraphs with a blank line. Each paragraph 3 to 5 sentences. Write dates as "12 October 2026" and times as "8.00 am".`;

const shorten=(text,max)=>{const t=String(text||'').replace(/\s+/g,' ').trim();return t.length>max?`${t.slice(0,max).replace(/\s\S*$/,'')}…`:t;};

async function fromProvinceSite(terms){
 const words=[...new Set(terms.flatMap(t=>String(t||'').split(/[\s,.;:()/'’-]+/)).filter(w=>w.length>3&&!/\d/.test(w)&&!/^(the|church|parish|cathedral|shrine|chapel|with|from|event|youth|feast|celebration|annual|jaffna|mannar|vavuniya|kilinochchi|mullaitivu|batticaloa|trincomalee|colombo|lanka|mary|mary's|marys|saint|our|lady)$/i.test(w)))].slice(0,6);
 if(!words.length)return [];
 const r=await query(
  `SELECT type,title_en,excerpt_en,body_en,location_text FROM content_items
   WHERE status='published' AND type IN ('parish','ministry','location','formation','school','timeline','international','page')
    AND (${words.map((_,i)=>`title_en ILIKE $${i+1} OR location_text ILIKE $${i+1}`).join(' OR ')})
   LIMIT 3`,
  words.map(w=>`%${w}%`)
 );
 return r.rows.map(x=>({source:'Province website',title:x.title_en,text:shorten([x.excerpt_en,x.body_en,x.location_text].filter(Boolean).join(' '),900)}));
}

async function fromWikipedia(search){
 const url=new URL(WIKI_URL);
 for(const [k,v] of Object.entries({action:'query',generator:'search',gsrsearch:search,gsrlimit:'2',prop:'extracts',exintro:'1',explaintext:'1',exchars:'1200',format:'json'}))url.searchParams.set(k,v);
 const response=await fetch(url,{headers:{'User-Agent':USER_AGENT},signal:AbortSignal.timeout(6000)});
 if(!response.ok)return [];
 const pages=Object.values((await response.json())?.query?.pages||{});
 return pages
  .filter(p=>p.extract&&!SENSITIVE.test(p.title)&&!SENSITIVE.test(p.extract.slice(0,300)))
  .filter(p=>LOCAL.test(`${p.title} ${p.extract}`))
  .map(p=>({source:'Wikipedia',title:p.title,text:shorten(p.extract,1200)}));
}
// Only keep Wikipedia pages that are about Sri Lanka or the Oblates, so "St Mary's Cathedral" never brings in Dublin or Sydney.
const SENSITIVE=/\b(shell(ing|ed)|massacres?|bomb(s|ing|ings|ed)?|attacks?|wars?|civil war|violence|violent|killings?|killed|riots?|conflict|genocide|terror(ism|ist)?|assassinat\w*|abuse|scandal|sexual|insurgen\w*|militant|LTTE|tigers)\b/i;
const LOCAL=/sri lanka|ceylon|jaffna|mannar|vavuniya|kilinochchi|mullaitivu|batticaloa|trincomalee|oblates? of mary immaculate|\bomi\b|eugene de mazenod/i;

/** Background on the place and topic from the Province's own pages and Wikipedia; failures just mean less context. */
async function research(input){
 const place=String(input.place||'').trim();
 const region=LOCAL.test(place)?'':' Sri Lanka';
 const tasks=[
  fromProvinceSite([input.place,input.title]),
  place?fromWikipedia(`${place}${region}`):Promise.resolve([]),
  input.title?fromWikipedia(`${input.title.replace(/\b\d{4}\b/g,'')} Catholic Sri Lanka`):Promise.resolve([])
 ];
 const found=(await Promise.allSettled(tasks)).flatMap(r=>r.status==='fulfilled'?r.value:[]);
 const seen=new Set();
 return found.filter(x=>!seen.has(x.title)&&seen.add(x.title)).slice(0,5);
}

function bookPrompt(input){
 const facts=[
  ['Title',input.title],['Author',input.book_author],['Year / edition',input.year],
  ['Summary',input.excerpt],['Notes from the father',input.notes]
 ].filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join('\n');
 return `You write short book descriptions for the library of the Oblates of Mary Immaculate (OMI), Province of Jaffna, Sri Lanka.
Write in clear, warm British English. Use ONLY the facts below: never invent contents, chapters, quotes, awards, page counts or details about the author.
If the notes are brief, keep the description brief rather than adding anything. No headings, no markdown, no emojis, no bullet points.
Separate paragraphs with a blank line.
Return JSON: {"excerpt": one-sentence summary under 200 characters, "body": 2 to 3 paragraphs describing the book and who it is for}.

BOOK DETAILS:
${facts}`;
}

function prompt(kind,input,background){
 if(kind==='book')return bookPrompt(input);
 const facts=[
  ['Title',input.title],['Place',input.place],['Start date',input.event_date],['End date',input.end_date],
  ['Summary',input.excerpt],['Notes from the writer',input.notes],['Written by',input.author]
 ].filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join('\n');
 const notes=background.length?`\n\nBACKGROUND NOTES (general context only, not facts about this event):\n${background.map(b=>`[${b.source}: ${b.title}] ${b.text}`).join('\n\n')}`:'';
 if(kind==='article')return `${STYLE}

Write a full news article reporting on this event, in past tense if the event date has passed (today is ${input.today}).
Open with what happened, then describe the programme in detail, weave in the background of the place or occasion, and close with its meaning for the faithful and the Oblate mission.
Return JSON: {"title": headline under 90 characters, "excerpt": one-sentence summary under 200 characters, "body": 5 to 7 paragraphs}.

EVENT DETAILS:
${facts}${notes}`;
 return `${STYLE}

Write a full description of this calendar event for its page on the Province website.
Introduce the event and who it is for, describe the programme, add the background of the place or occasion, and close with an invitation.
Return JSON: {"excerpt": one-sentence summary under 200 characters, "body": 4 to 5 paragraphs}.

EVENT DETAILS:
${facts}${notes}`;
}

async function generate(model,key,text){
 try{
  const response=await fetch(`${GEMINI_URL}/${encodeURIComponent(model)}:generateContent`,{
   method:'POST',
   headers:{'Content-Type':'application/json','x-goog-api-key':key},
   signal:AbortSignal.timeout(25000),
   body:JSON.stringify({
    contents:[{role:'user',parts:[{text}]}],
    generationConfig:{temperature:0.6,maxOutputTokens:4096,responseMimeType:'application/json'}
   })
  });
  return {status:response.status,data:await response.json().catch(()=>({}))};
 }catch(err){
  return {status:504,data:{error:{message:err.message}}};
 }
}

export async function writeWithAi(kind,input){
 const key=process.env.GEMINI_API_KEY;
 if(!key)throw Object.assign(new Error('AI writing is not set up yet. Ask the Province office to add a Gemini API key.'),{status:503});
 // Free-tier models are sometimes overloaded; try the next one before giving up.
 const models=[...new Set([process.env.GEMINI_MODEL||'gemini-flash-lite-latest','gemini-flash-latest'])];
 const background=kind==='book'?[]:await research(input).catch(()=>[]);
 const text=prompt(kind,input,background);
 let result;
 for(const model of models){
  result=await generate(model,key,text);
  if(result.status===200)break;
  console.error('Gemini error',model,result.status,result.data?.error?.message);
  if(![429,500,503,504].includes(result.status))break;
 }
 const {status,data}=result;
 if(status!==200){
  const busy=[429,503,504].includes(status);
  throw Object.assign(new Error(busy?'The AI writer is busy right now. Please try again in a minute.':'The AI writer could not respond. Please try again later.'),{status:busy?429:502});
 }
 const answer=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'';
 let out;
 try{out=JSON.parse(answer);}catch{throw Object.assign(new Error('The AI writer returned an unexpected answer. Please try again.'),{status:502});}
 const clean=v=>(Array.isArray(v)?v.join('\n\n'):typeof v==='string'?v:'').replace(/\r/g,'').trim();
 return {
  title:clean(out.title).slice(0,255),
  excerpt:clean(out.excerpt).slice(0,1000),
  body:clean(out.body).slice(0,20000),
  sources:background.map(({source,title})=>`${source}: ${title}`)
 };
}
