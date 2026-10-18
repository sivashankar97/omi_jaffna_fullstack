// Copies the public site's built-in content (site/src/content) into the CMS.
// Safe to re-run: existing items and fields that editors have changed are left alone.
// Usage: node scripts/import-site-content.js [--draft]
import {pool} from '../src/db.js';

const content=name=>import(new URL(`../../site/src/content/${name}.ts`,import.meta.url));
const [{priests},{formerProvincials,formationAbroad,recentGatherings},{mapLocations},{homeContent},{newsArticles}]=await Promise.all(
 ['priests','province','map-locations','home','news'].map(content)
);

const draft=process.argv.includes('--draft');
const status=draft?'draft':'published';
const verifiedOn='2026-10-13';
const slugify=value=>value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f’']/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,180);
const normalize=value=>value.toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim();
const compact=object=>Object.fromEntries(Object.entries(object).filter(([,v])=>v!==undefined&&v!==''));

const db=await pool.connect();
const counts={};
const count=key=>{counts[key]=(counts[key]||0)+1;};

const months=['january','february','march','april','may','june','july','august','september','october','november','december'];
// "24 October – 2 November 2024" → the first day and month with the final year, at 09:00 in Sri Lanka.
function startDate(label){
 const day=label.match(/\d{1,2}/)?.[0];const month=months.indexOf(label.toLowerCase().match(/[a-z]+/)?.[0]);const year=label.match(/\d{4}(?!.*\d{4})/)?.[0];
 if(!day||month<0||!year)return null;
 return `${year}-${String(month+1).padStart(2,'0')}-${day.padStart(2,'0')}T09:00:00+05:30`;
}
const isoDate=(year,month,day)=>`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

// Editors can rename an item (which changes its slug), so imported items are matched by metadata.import_key.
async function insertItem({type,slug,title,excerpt='',body='',location='',image='',eventDate=null,metadata={},sort=0,verified=false}){
 await db.query("UPDATE content_items SET metadata=metadata||jsonb_build_object('import_key',slug) WHERE type=$1 AND slug=$2 AND NOT metadata ? 'import_key'",[type,slug]);
 const r=await db.query(
  `INSERT INTO content_items(type,slug,title_en,excerpt_en,body_en,location_text,image_url,event_date,metadata,sort_order,status,verification_status,last_verified_at,published_at)
   SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,${draft?'NULL':'now()'}
   WHERE NOT EXISTS(SELECT 1 FROM content_items WHERE type=$1 AND metadata->>'import_key'=$2)
   ON CONFLICT(type,slug) DO NOTHING RETURNING id`,
  [type,slug,title,excerpt,body,location,image,eventDate,{...metadata,import_key:slug},sort,status,verified?'verified':'pending',verified?verifiedOn:null]
 );
 count(r.rowCount?`${type} added`:`${type} already present`);
}

try{
 await db.query('BEGIN');

 for(const [index,priest] of priests.entries())
  await insertItem({type:'priest',slug:slugify(priest.name),title:priest.name,metadata:{place:priest.place},sort:index+1});

 for(const [index,person] of formerProvincials.entries())
  await insertItem({type:'leadership',slug:`former-provincial-${slugify(person.name)}`,title:person.name,
   metadata:{role:'Former Provincial',term:person.dates},sort:100+index,verified:true});

 for(const [index,country] of formationAbroad.entries())
  await insertItem({type:'international',slug:`formation-abroad-${slugify(country)}`,title:country,
   metadata:{kind:'formation'},sort:100+index,verified:true});

 for(const [index,article] of newsArticles.entries())
  await insertItem({type:'news',slug:article.slug,title:article.title,excerpt:article.description,body:article.paragraphs.join('\n\n'),
   location:article.place,image:article.cover.src,eventDate:startDate(article.dateLabel),sort:index+1,
   metadata:compact({section:article.section,date_display:article.dateLabel,gallery:article.gallery,sample:article.sample})});

 for(const [index,event] of recentGatherings.entries())
  await insertItem({type:'event',slug:event.id,title:event.title,excerpt:event.summary,location:event.place,
   eventDate:`${isoDate(event.year,event.month,event.day)}T09:00:00+05:30`,sort:index+1,
   metadata:compact({end_date:isoDate(event.endYear,event.endMonth,event.endDay),date_display:event.dateLabel,sample:event.id.startsWith('example-')||undefined})});

 const existing=(await db.query("SELECT id,title_en FROM content_items WHERE type='location'")).rows;
 for(const [index,place] of mapLocations.entries()){
  const metadata=compact({lat:place.lat,lng:place.lng,kind:place.kind,district:place.district,purpose:place.purpose,
   contact:place.contact,phone:place.phone,email:place.email});
  const match=existing.find(row=>normalize(row.title_en).startsWith(normalize(place.name)));
  if(!match){
   await insertItem({type:'location',slug:slugify(`${place.name}-${place.district}`),title:`${place.name} — ${place.district}`,
    excerpt:place.purpose,location:place.address,metadata,sort:index+1,verified:true});
   continue;
  }
  // Existing metadata keys win so that editors' changes survive a re-run.
  await db.query(
   `UPDATE content_items SET metadata=$1::jsonb||metadata,updated_at=now()
    ${draft?'':",status='published',verification_status='verified',last_verified_at=COALESCE(last_verified_at,$3::date),published_at=COALESCE(published_at,now())"}
    WHERE id=$2`,
   draft?[metadata,match.id]:[metadata,match.id,verifiedOn]
  );
  count('location coordinates added');
 }

 const pageMeta={
  home:{headline:homeContent.hero.title,eyebrow:homeContent.hero.eyebrow,years:homeContent.hero.years,
   lede:homeContent.hero.lede,quote:homeContent.hero.quote},
  charism:{headline:'The Gospel must go out and reach people where they are',ways:[
   'Go where people need the Gospel.','Listen before speaking and accompany before judging.',
   'Serve people whose dignity is threatened.','Build communities of faith and hope.',
   'Promote justice, peace and reconciliation.','Care for creation and future generations.',
   'Form young people and future missionaries.','Treat digital platforms as new missionary spaces.']},
  'who-we-are':{headline:'A missionary family in Sri Lanka since 1847'},
  history:{arrival:'The first Oblates landed at Galle on 28 November 1847. On 10 March 1848 they reached Jaffna.'}
 };
 for(const [slug,metadata] of Object.entries(pageMeta)){
  const r=await db.query("UPDATE content_items SET metadata=$1::jsonb||metadata,updated_at=now() WHERE type='page' AND slug=$2",[metadata,slug]);
  if(r.rowCount)count('page fields added');
 }
 const tagline=await db.query("UPDATE content_items SET excerpt_en=$1,updated_at=now() WHERE type='page' AND slug='home' AND excerpt_en LIKE $2",
  [homeContent.hero.tagline,`${homeContent.hero.tagline}_%`]);
 if(tagline.rowCount)count('home tagline cleaned');

 await db.query('COMMIT');
 console.log(`Imported site content as ${status}:`);
 for(const [key,value] of Object.entries(counts))console.log(`  ${key}: ${value}`);
}catch(error){
 await db.query('ROLLBACK');
 console.error(error);
 process.exitCode=1;
}finally{
 db.release();
 await pool.end();
}
