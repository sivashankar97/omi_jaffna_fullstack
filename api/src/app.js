import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import {randomUUID} from 'node:crypto';
import multer from 'multer';
import {query} from './db.js';
import {auth,allow,issueToken,cookieOptions} from './security.js';
import {crudRouter} from './crud.js';
import {TYPES} from './constants.js';
import {saveFile,readStoredFile,removeFile} from './storage.js';
import {contentSchema,inquirySchema,publishCheck,fatherRegistrationSchema,fatherProfileSchema} from './validation.js';

export const app=express();
if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32)throw new Error('Set JWT_SECRET to a random string of at least 32 characters');
app.disable('x-powered-by');
if(process.env.TRUST_PROXY)app.set('trust proxy',Number(process.env.TRUST_PROXY)||process.env.TRUST_PROXY);
// Netlify may hand the function its own path instead of the original /api/... URL.
app.use((req,_res,next)=>{if(req.url.startsWith('/.netlify/functions/api'))req.url='/api'+req.url.slice('/.netlify/functions/api'.length);next();});
app.use(helmet({crossOriginResourcePolicy:{policy:'same-origin'}}));
app.use(cors({origin:process.env.FRONTEND_ORIGIN?.split(',').map(s=>s.trim())||'http://localhost:5173',credentials:true}));
app.use(express.json({limit:'600kb'}));
app.use(cookieParser());
const limitOptions={windowMs:15*60*1000,standardHeaders:'draft-7',legacyHeaders:false,keyGenerator:req=>req.headers['x-nf-client-connection-ip']||req.ip||'unknown',validate:{ip:false}};
app.use('/api',rateLimit({...limitOptions,limit:400,skip:req=>req.method==='GET'&&req.path.startsWith('/public/')}));
const slowLimit=rateLimit({...limitOptions,limit:12});
const asyncRoute=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
const idValid=id=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id||'');
const audit=async(actor,action,type,id,details={})=>query('INSERT INTO audit_log(actor_id,action,target_type,target_id,details) VALUES($1,$2,$3,$4,$5)',[actor,action,type,String(id||''),details]);
const bad=(res,error,status=400)=>res.status(status).json({error});
const cmsOnly=allow('admin','editor','publisher');

app.use('/api',crudRouter());

app.get('/api/health',asyncRoute(async(_req,res)=>{await query('SELECT 1');res.json({ok:true});}));
app.post('/api/auth/login',slowLimit,asyncRoute(async(req,res)=>{
 const identifier=String(req.body?.identifier||req.body?.email||'').trim();
 const password=String(req.body?.password||'');
 const isEmail=identifier.includes('@');
 const r=await query(`SELECT id,name,email,password_hash,role,active,father_id,date_of_birth,mobile_number FROM users WHERE ${isEmail?"email=$1 AND role IN ('admin','editor','publisher')":"lower(father_id)=lower($1) AND role='father'"} LIMIT 1`,[isEmail?identifier.toLowerCase():identifier]);
 if(!r.rowCount||!r.rows[0].active||!(await bcrypt.compare(password,r.rows[0].password_hash)))return bad(res,'Invalid email, Father ID or password',401);
 const {password_hash,...user}=r.rows[0];res.cookie('omi_session',issueToken(user),cookieOptions()).json({user});
}));
app.post('/api/auth/register',slowLimit,asyncRoute(async(req,res)=>{
 const parsed=fatherRegistrationSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const {name,email,password,father_id,date_of_birth,mobile_number}=parsed.data;
 const password_hash=await bcrypt.hash(password,12);
 const result=await query(
  "INSERT INTO users(name,email,password_hash,role,father_id,date_of_birth,mobile_number) VALUES($1,$2,$3,'father',$4,$5,$6) RETURNING id,name,email,role,active,father_id,date_of_birth,mobile_number",
  [name,email,password_hash,father_id,date_of_birth,mobile_number]
 );
 const user=result.rows[0];await audit(user.id,'register','user',user.id);res.cookie('omi_session',issueToken(user),cookieOptions()).status(201).json({user});
}));
app.post('/api/auth/logout',(_req,res)=>res.clearCookie('omi_session',{...cookieOptions(),maxAge:undefined}).json({ok:true}));
app.get('/api/auth/me',auth,asyncRoute(async(req,res)=>{
 const r=await query('SELECT id,name,email,role,active,father_id,date_of_birth,mobile_number FROM users WHERE id=$1',[req.session.sub]);
 if(!r.rowCount||!r.rows[0].active)return bad(res,'Account unavailable',401);
 res.json({user:r.rows[0]});
}));
app.patch('/api/auth/profile',auth,allow('father'),asyncRoute(async(req,res)=>{
 const parsed=fatherProfileSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const data={...parsed.data};
 if(data.password){data.password_hash=await bcrypt.hash(data.password,12);delete data.password;}
 const columns=Object.keys(data);
 const values=columns.map(key=>data[key]);
 const updates=columns.map((key,index)=>`${key}=$${index+1}`);
 const result=await query(`UPDATE users SET ${updates.join(',')} WHERE id=$${columns.length+1} RETURNING id,name,email,role,active,father_id,date_of_birth,mobile_number`,[...values,req.session.sub]);
 if(!result.rowCount)return bad(res,'Account unavailable',401);
 await audit(req.session.sub,'update','profile',req.session.sub);
 res.json({user:result.rows[0]});
}));

app.get('/api/dashboard',auth,cmsOnly,asyncRoute(async(_req,res)=>{
 const stats=await query(`SELECT type,status,count(*)::int AS count FROM content_items GROUP BY type,status`);
 const inquiries=await query(`SELECT status,count(*)::int AS count FROM inquiries GROUP BY status`);
 const recent=await query(`SELECT id,type,title_en,status,verification_status,updated_at FROM content_items ORDER BY updated_at DESC LIMIT 8`);
 const actions=await query(`SELECT action,target_type,created_at FROM audit_log ORDER BY created_at DESC LIMIT 6`);
 res.json({counts:stats.rows,inquiries:inquiries.rows,recent:recent.rows,activity:actions.rows,types:TYPES});
}));
app.get('/api/items',auth,cmsOnly,asyncRoute(async(req,res)=>{
 const type=String(req.query.type||'page');if(!TYPES[type])return bad(res,'Invalid content type');
 const status=String(req.query.status||'');if(status&&!['draft','review','published'].includes(status))return bad(res,'Invalid status');
 const search=String(req.query.q||'').slice(0,120);const page=Math.max(1,Math.min(10000,Number(req.query.page)||1));
 const conditions=['type=$1'];const args=[type];
 if(status){args.push(status);conditions.push(`status=$${args.length}`);}
 if(search){args.push(`%${search}%`);conditions.push(`(title_en ILIKE $${args.length} OR location_text ILIKE $${args.length} OR slug ILIKE $${args.length})`);}
 // CMS screens split one content type by page slug or by a metadata field (e.g. leadership role).
 const csv=name=>String(req.query[name]||'').split(',').map(v=>v.trim()).filter(Boolean).slice(0,10);
 const slugs=csv('slug');if(slugs.length){args.push(slugs);conditions.push(`slug=ANY($${args.length})`);}
 const metaKey=String(req.query.meta_key||'');
 if(metaKey){
  if(!/^[a-z_]{1,40}$/.test(metaKey))return bad(res,'Invalid metadata filter');
  args.push(metaKey);const field=`COALESCE(metadata->>$${args.length},'')`;
  const like=csv('meta_like').map(v=>`%${v}%`),not=csv('meta_not').map(v=>`%${v}%`);
  if(like.length){args.push(like);conditions.push(`${field} ILIKE ANY($${args.length})`);}
  if(not.length){args.push(not);conditions.push(`NOT (${field} ILIKE ANY($${args.length}))`);}
 }
 const where=conditions.join(' AND ');const total=(await query(`SELECT count(*)::int AS total FROM content_items WHERE ${where}`,args)).rows[0].total;
 const list=await query(`SELECT * FROM content_items WHERE ${where} ORDER BY sort_order ASC,COALESCE(event_date,created_at) DESC LIMIT 50 OFFSET $${args.length+1}`,[...args,(page-1)*50]);
 res.json({items:list.rows,total,page,pages:Math.max(1,Math.ceil(total/50))});
}));
app.post('/api/items',auth,allow('admin','editor','publisher'),asyncRoute(async(req,res)=>{
 const parsed=contentSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const data=parsed.data;
 if(data.status==='published'&&!['admin','publisher'].includes(req.session.role))return bad(res,'Only publishers can publish',403);
 const warning=publishCheck(data);if(warning)return bad(res,warning);
 const fields=Object.keys(data).filter(k=>k!=='event_date'&&k!=='last_verified_at');
 const cols=[...fields,'event_date','last_verified_at','created_by','updated_by'];
 const values=[...fields.map(k=>data[k]),data.event_date||null,data.last_verified_at||null,req.session.sub,req.session.sub];
 const placeholders=cols.map((_,i)=>`$${i+1}`);
 const r=await query(`INSERT INTO content_items(${cols.join(',')},published_at) VALUES(${placeholders.join(',')},${data.status==='published'?'now()':'NULL'}) RETURNING *`,values);
 await audit(req.session.sub,'create',data.type,r.rows[0].id);res.status(201).json({item:r.rows[0]});
}));
app.put('/api/items/:id',auth,allow('admin','editor','publisher'),asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const found=await query('SELECT type,status FROM content_items WHERE id=$1',[req.params.id]);if(!found.rowCount)return bad(res,'Item not found',404);
 const parsed=contentSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const data=parsed.data;if(data.type!==found.rows[0].type)return bad(res,'Cannot change content type');
 if(found.rows[0].status==='published'&&req.session.role==='editor')return bad(res,'Published content can only be changed by a publisher or admin',403);
 if(data.status==='published'&&!['admin','publisher'].includes(req.session.role))return bad(res,'Only publishers can publish',403);
 const warning=publishCheck(data);if(warning)return bad(res,warning);
 const cols=Object.keys(data);const updates=cols.map((k,i)=>`${k}=$${i+1}`);
 const vals=cols.map(k=>(k==='event_date'||k==='last_verified_at')?(data[k]||null):data[k]);
 const r=await query(`UPDATE content_items SET ${updates.join(',')},updated_by=$${cols.length+1},updated_at=now(),published_at=CASE WHEN $${cols.length+2}='published' THEN COALESCE(published_at,now()) ELSE NULL END WHERE id=$${cols.length+3} RETURNING *`,[...vals,req.session.sub,data.status,req.params.id]);
 await audit(req.session.sub,'update',data.type,req.params.id,{status:data.status});res.json({item:r.rows[0]});
}));
app.delete('/api/items/:id',auth,allow('admin'),asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const r=await query('DELETE FROM content_items WHERE id=$1 RETURNING type,title_en',[req.params.id]);
 if(!r.rowCount)return bad(res,'Item not found',404);
 await audit(req.session.sub,'delete',r.rows[0].type,req.params.id);res.json({ok:true});
}));

// Public routes deliberately exclude unpublished content and private contact records.
const PUBLIC_META_KEYS=[
 'role','term','term_in_source','since','terms','section','end_date','date_display','subtitle','kind','place',
 'district','purpose','contact','phone','email','lat','lng',
 'headline','eyebrow','years','lede','quote','ways','arrival','gallery','sample','sections','detail','about_heading','about','mission'
];
app.get('/api/public/items',asyncRoute(async(req,res)=>{
 const type=String(req.query.type||'page');if(!TYPES[type])return bad(res,'Invalid type');
 const lang=['en','ta','si'].includes(req.query.lang)?req.query.lang:'en';
 const slug=req.query.slug?String(req.query.slug).slice(0,180):null;
 const args=[type];const parts=['type=$1',"status='published'"];
 if(slug){args.push(slug);parts.push('slug=$2');}
 const r=await query(`SELECT id,type,slug,title_en,title_ta,title_si,excerpt_en,excerpt_ta,excerpt_si,body_en,body_ta,body_si,location_text,image_url,media_url,event_date,featured,sort_order,published_at,verification_status,last_verified_at,metadata FROM content_items WHERE ${parts.join(' AND ')} ORDER BY sort_order,COALESCE(event_date,created_at) DESC LIMIT 200`,args);
 // Metadata can hold editorial notes, so only these keys are public.
 const publicMeta=m=>Object.fromEntries(PUBLIC_META_KEYS.filter(k=>m?.[k]!=null).map(k=>[k,m[k]]));
 res.json({items:r.rows.map(({metadata,...item})=>({...item,meta:publicMeta(metadata),title:item[`title_${lang}`]||item.title_en,excerpt:item[`excerpt_${lang}`]||item.excerpt_en,body:item[`body_${lang}`]||item.body_en}))});
}));
app.post('/api/public/inquiries',slowLimit,asyncRoute(async(req,res)=>{
 const parsed=inquirySchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const {name,email,phone,category,message,privacy_consent}=parsed.data;
 await query('INSERT INTO inquiries(name,email,phone,category,message,privacy_consent) VALUES($1,$2,$3,$4,$5,$6)',[name,email,phone,category,message,privacy_consent]);
 res.status(201).json({ok:true,message:'Your enquiry has been received.'});
}));
app.get('/api/inquiries',auth,cmsOnly,asyncRoute(async(_req,res)=>{
 const r=await query('SELECT * FROM inquiries ORDER BY CASE WHEN status=\'new\' THEN 0 ELSE 1 END,created_at DESC LIMIT 200');res.json({items:r.rows});
}));
app.get('/api/contacts',auth,cmsOnly,asyncRoute(async(_req,res)=>{
 const r=await query('SELECT * FROM people_contacts ORDER BY name LIMIT 500');res.json({items:r.rows});
}));
app.get('/api/public/contacts',asyncRoute(async(_req,res)=>{
 const r=await query('SELECT name,role_title,phone,email,whatsapp,last_verified_at FROM people_contacts WHERE approved_for_public=true AND last_verified_at IS NOT NULL ORDER BY name');res.json({items:r.rows});
}));
app.get('/api/settings',auth,cmsOnly,asyncRoute(async(_req,res)=>{const r=await query('SELECT key,value FROM site_settings');res.json({settings:Object.fromEntries(r.rows.map(x=>[x.key,x.value]))});}));
app.get('/api/users',auth,allow('admin'),asyncRoute(async(_req,res)=>{const r=await query('SELECT id,name,email,role,active,father_id,date_of_birth,mobile_number,created_at FROM users ORDER BY created_at');res.json({items:r.rows});}));
const allowedMime={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','application/pdf':'.pdf'};
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:12*1024*1024},fileFilter:(_req,file,cb)=>allowedMime[file.mimetype]?cb(null,true):cb(new Error('Only JPEG, PNG, WebP or PDF allowed'))});
const signatureOK=(buf,mime)=>{
 if(mime==='image/jpeg')return buf[0]===255&&buf[1]===216&&buf[2]===255;
 if(mime==='image/png')return buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 if(mime==='image/webp')return buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,12)==='WEBP';
 if(mime==='application/pdf')return buf.toString('ascii',0,5)==='%PDF-';
 return false;
};
app.post('/api/assets',auth,allow('admin','editor','publisher'),upload.single('file'),asyncRoute(async(req,res)=>{
 if(!req.file)return bad(res,'File required');
 if(!signatureOK(req.file.buffer.subarray(0,16),req.file.mimetype))return bad(res,'File signature does not match its format');
 const filename=randomUUID()+allowedMime[req.file.mimetype];
 await saveFile(filename,req.file.buffer);
 let r;
 try{r=await query('INSERT INTO media_assets(filename,original_name,mime_type,size_bytes,uploaded_by) VALUES($1,$2,$3,$4,$5) RETURNING *',[filename,req.file.originalname.slice(0,255),req.file.mimetype,req.file.size,req.session.sub]);}
 catch(e){await removeFile(filename);throw e;}
 await audit(req.session.sub,'upload','asset',r.rows[0].id);res.status(201).json({item:{...r.rows[0],url:`/api/files/${r.rows[0].id}`}});
}));
app.get('/api/assets',auth,cmsOnly,asyncRoute(async(_req,res)=>{const r=await query('SELECT * FROM media_assets ORDER BY created_at DESC LIMIT 200');res.json({items:r.rows.map(a=>({...a,url:`/api/files/${a.id}`}))});}));
app.get('/api/files/:id',asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const r=await query('SELECT * FROM media_assets WHERE id=$1',[req.params.id]);if(!r.rowCount)return bad(res,'Not found',404);
 const a=r.rows[0];if(a.status!=='published'){
  try{const p=req.cookies?.omi_session;const user=p?((await import('jsonwebtoken')).default.verify(p,process.env.JWT_SECRET)):null;if(!user)return bad(res,'Not available',404);const active=await query("SELECT 1 FROM users WHERE id=$1 AND active=true AND role IN ('admin','editor','publisher')",[user.sub]);if(!active.rowCount)return bad(res,'Not available',404);}
  catch{return bad(res,'Not available',404);}
 }
 let file;
 try{file=await readStoredFile(a.filename);}catch(e){if(e.code==='ENOENT')return bad(res,'Not found',404);throw e;}
 res.set('Content-Type',a.mime_type);
 res.set('Cache-Control',a.status==='published'?'public, max-age=3600':'no-store');
 res.set('X-Content-Type-Options','nosniff');
 if(a.mime_type==='application/pdf')res.set('Content-Disposition',`attachment; filename="publication.pdf"`);
 res.send(file);
}));
app.use((err,_req,res,_next)=>{
 if(err.status>=400&&err.status<500)return bad(res,err.details||err.message,err.status);
 console.error(err);
 if(['22P02','22007','22008'].includes(err?.code))return bad(res,'Invalid identifier or date');
 if(err?.code==='23505')return bad(res,'Duplicate slug, Father ID or email',409);
 if(err?.code==='23503')return bad(res,'Related record prevents this operation',409);
 if(err instanceof multer.MulterError)return bad(res,err.message);
 if(err?.message?.startsWith('Only JPEG'))return bad(res,err.message);
 return bad(res,process.env.NODE_ENV==='production'?'Unexpected server error':(err.message||'Server error'),500);
});
