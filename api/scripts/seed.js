import 'dotenv/config';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import bcrypt from 'bcryptjs';
import {query,pool} from '../src/db.js';
const data=JSON.parse(await readFile(fileURLToPath(new URL('./seed-data.json',import.meta.url)),'utf8'));
try{
 const email=process.env.ADMIN_EMAIL?.toLowerCase().trim();const password=process.env.ADMIN_PASSWORD;
 if(!email||!password||password.length<12)throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in api/.env');
 const count=await query('SELECT count(*)::int as count FROM users');
 if(count.rows[0].count===0){
  const hash=await bcrypt.hash(password,12);
  await query('INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4)', ['Province Administrator',email,hash,'admin']);
  console.log(`Created administrator ${email}`);
 }else{console.log('Existing users retained; no password changes.');}
 const sql=`INSERT INTO content_items(type,slug,title_en,excerpt_en,body_en,location_text,sort_order,metadata,status,verification_status)
 VALUES($1,$2,$3,$4,$5,$6,$7,$8,'draft','pending') ON CONFLICT(type,slug) DO NOTHING`;
 let countAdded=0;
 for(const c of data.items){const r=await query(sql,[c.type,c.slug,c.title_en,c.excerpt_en||'',c.body_en||'',c.location_text||'',c.sort_order||0,c.metadata||{}]); countAdded+=r.rowCount;}
 await query('INSERT INTO site_settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO NOTHING',['site_identity',data.site_identity]);
 await query('INSERT INTO site_settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO NOTHING',['seo_defaults',{title:'Oblate Province of Jaffna | Missionary Oblates of Mary Immaculate',description:'Discover the mission, ministries, history, parishes and news of the Oblate Province of Jaffna.'}]);
 console.log(`Seeded ${countAdded} new DRAFT records. Nothing has been automatically published.`);
}catch(e){console.error(e);process.exitCode=1;}finally{await pool.end();}
