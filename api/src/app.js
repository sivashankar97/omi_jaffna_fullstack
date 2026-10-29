import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import {createHash,randomBytes,randomUUID} from 'node:crypto';
import multer from 'multer';
import {query} from './db.js';
import {auth,optionalAuth,allow,setSessionCookie,clearSessionCookie,verifyPassword} from './security.js';
import {crudRouter} from './crud.js';
import {TYPES} from './constants.js';
import {saveFile,readStoredFile,removeFile} from './storage.js';
import {contentSchema,inquirySchema,publishCheck,fatherRegistrationSchema,fatherProfileSchema,fatherItemSchema,fatherItemUpdateSchema,fatherItemKinds,fatherDispatchSchema,fatherNewsSchema,fatherEventSchema,fatherAiWriteSchema,fatherLibrarySchema,passwordResetSchema} from './validation.js';
import {writeWithAi} from './ai-writer.js';
import {publishFatherMedia} from './father-media.js';
import {findPersonnel,matchPersonnel} from './personnel.js';
import {sendMail} from './mailer.js';
import {applyCmsSeed,buildSeedCatalog,loadSampleSeed} from './seed-cms.js';

export const app=express();
if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32)throw new Error('Set JWT_SECRET to a random string of at least 32 characters');
app.disable('x-powered-by');
if(process.env.TRUST_PROXY)app.set('trust proxy',Number(process.env.TRUST_PROXY)||process.env.TRUST_PROXY);
// Netlify may hand the function its own path instead of the original /api/... URL.
app.use((req,_res,next)=>{if(req.url.startsWith('/.netlify/functions/api'))req.url='/api'+req.url.slice('/.netlify/functions/api'.length);next();});
// cross-origin so /api/files images can render on localhost (and other frontends).
app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}));
const configuredOrigins = process.env.FRONTEND_ORIGIN?.split(',').map(s => s.trim()) || ['http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    // Same-origin / server-to-server (no Origin header) and allowlisted FRONTEND_ORIGIN only.
    if (!origin || configuredOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
}));
app.use(express.json({limit:'600kb'}));
app.use(cookieParser());
const limitOptions={windowMs:15*60*1000,standardHeaders:'draft-7',legacyHeaders:false,keyGenerator:req=>req.headers['x-nf-client-connection-ip']||req.ip||'unknown',validate:{ip:false}};
app.use('/api',rateLimit({...limitOptions,limit:400,skip:req=>req.method==='GET'&&req.path.startsWith('/public/')}));
const slowLimit=rateLimit({...limitOptions,limit:12});
const asyncRoute=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
const idValid=id=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id||'');
const audit=async(actor,action,type,id,details={})=>query('INSERT INTO audit_log(actor_id,action,target_type,target_id,details) VALUES($1,$2,$3,$4,$5)',[actor,action,type,String(id||''),details]);
const bad=(res,error,status=400)=>res.status(status).json({error});
const escapeHtml=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const cmsOnly=allow('admin','editor','publisher');

app.use('/api',crudRouter());

app.get('/api/health',asyncRoute(async(_req,res)=>{await query('SELECT 1');res.json({ok:true});}));
app.post('/api/auth/login',slowLimit,asyncRoute(async(req,res)=>{
 const identifier=String(req.body?.identifier||req.body?.email||'').trim();
 const password=String(req.body?.password||'');
 if(!identifier||!password)return bad(res,'Invalid email, OMI ID or password',401);
 const isEmail=identifier.includes('@');
 const r=await query(`SELECT id,name,email,password_hash,role,active,father_id,date_of_birth,mobile_number,bio,place,photo_url FROM users WHERE ${isEmail?"email=$1 AND role IN ('admin','editor','publisher')":"lower(father_id)=lower($1) AND role='father'"} LIMIT 1`,[isEmail?identifier.toLowerCase():identifier]);
 const row=r.rows[0];
 const passwordOk=await verifyPassword(password,row?.password_hash);
 if(!row||!row.active||!passwordOk)return bad(res,'Invalid email, OMI ID or password',401);
 const {password_hash,...user}=row;
 setSessionCookie(res,user);
 res.json({user});
}));
app.get('/api/auth/omi-lookup',slowLimit,asyncRoute(async(req,res)=>{
 const omiId=String(req.query.omi_id||req.query.father_id||'').trim();
 if(!omiId)return bad(res,{fieldErrors:{father_id:['Enter your OMI ID.']}});
 const record=findPersonnel(omiId);
 if(!record)return bad(res,{fieldErrors:{father_id:['That OMI ID is not on the Jaffna Province personnel list.']}},404);
 // Do not return the roster name — prevents ID enumeration + account squatting.
 res.json({valid:true,omi_id:record.omi_id});
}));
app.post('/api/auth/register',slowLimit,asyncRoute(async(req,res)=>{
 if(process.env.FATHER_SELF_REGISTER==='false'){
  return bad(res,'Self-registration is closed. Ask the Province office to create your Father account.',403);
 }
 const parsed=fatherRegistrationSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const {name,email,password,father_id,date_of_birth,mobile_number}=parsed.data;
 const match=matchPersonnel(father_id,name,{threshold:0.85});
 if(!match.ok){
  const field=match.code==='omi_id'?'father_id':'name';
  const message=match.code==='name'
   ?'Full name does not match Province records for this OMI ID. Use the name exactly as on the personnel list.'
   :match.message;
  return bad(res,{fieldErrors:{[field]:[message]}});
 }
 const officialName=match.record.name;
 const taken=await query(
  `SELECT
    EXISTS(SELECT 1 FROM users WHERE lower(email)=lower($1)) AS email_taken,
    EXISTS(SELECT 1 FROM users WHERE father_id IS NOT NULL AND lower(father_id)=lower($2)) AS father_id_taken`,
  [email,match.record.omi_id]
 );
 if(taken.rows[0].email_taken)return bad(res,{fieldErrors:{email:['That email is already registered. Sign in with your OMI ID, or use a different email.']}},409);
 if(taken.rows[0].father_id_taken)return bad(res,{fieldErrors:{father_id:['That OMI ID is already registered. Sign in instead, or contact the Province if this is a mistake.']}},409);
 const password_hash=await bcrypt.hash(password,12);
 // Inactive until a CMS admin activates the account (Father Profile Management).
 const result=await query(
  "INSERT INTO users(name,email,password_hash,role,active,father_id,date_of_birth,mobile_number) VALUES($1,$2,$3,'father',false,$4,$5,$6) RETURNING id,name,email,role,active,father_id,date_of_birth,mobile_number,bio,place,photo_url",
  [officialName,email,password_hash,match.record.omi_id,date_of_birth,mobile_number]
 );
 const user=result.rows[0];await audit(user.id,'register','user',user.id,{omi_id:match.record.omi_id,name_score:match.score,pending_approval:true});
 res.status(201).json({
  ok:true,
  pending_approval:true,
  message:'Registration received. A Province administrator must activate your account before you can sign in.',
  user:{id:user.id,name:user.name,email:user.email,role:user.role,active:false,father_id:user.father_id}
 });
}));
const RESET_MINUTES=60;
const RESET_REPLY='If an active account matches, a reset link has been sent to its email address. The link works for 60 minutes.';
const hashToken=token=>createHash('sha256').update(String(token)).digest('hex');
const siteUrl=()=>(process.env.PUBLIC_SITE_URL||configuredOrigins[0]||'http://localhost:5173').replace(/\/$/,'');
app.post('/api/auth/forgot-password',slowLimit,asyncRoute(async(req,res)=>{
 const identifier=String(req.body?.identifier||'').trim().slice(0,255);
 if(!identifier)return bad(res,{fieldErrors:{identifier:['Enter your email or OMI ID.']}});
 const isEmail=identifier.includes('@');
 const r=await query(`SELECT id,name,email,role FROM users WHERE ${isEmail?'lower(email)=lower($1)':"lower(father_id)=lower($1) AND role='father'"} AND active AND email<>'' LIMIT 1`,[identifier]);
 const user=r.rows[0];
 if(user){
  const recent=await query("SELECT 1 FROM password_resets WHERE user_id=$1 AND created_at>now()-interval '2 minutes' LIMIT 1",[user.id]);
  if(!recent.rowCount){
   const token=randomBytes(32).toString('base64url');
   await query(`INSERT INTO password_resets(user_id,token_hash,expires_at,requested_ip) VALUES($1,$2,now()+interval '${RESET_MINUTES} minutes',$3)`,[user.id,hashToken(token),String(req.ip||'').slice(0,64)]);
   const link=`${siteUrl()}/reset-password?token=${token}`;
   const text=`Dear ${user.name},\n\nWe received a request to reset the password for your Oblate Province of Jaffna account.\n\nChoose a new password here (the link works for ${RESET_MINUTES} minutes and can be used once):\n${link}\n\nIf you did not ask for this, you can ignore this email — your password will not change.\n\nOblate Province of Jaffna`;
   const html=`<p>Dear ${escapeHtml(user.name)},</p><p>We received a request to reset the password for your Oblate Province of Jaffna account.</p><p><a href="${link}" style="display:inline-block;background:#0f8fa3;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600">Choose a new password</a></p><p style="color:#5a7380;font-size:13px">The link works for ${RESET_MINUTES} minutes and can be used once. If the button does not work, copy this address into your browser:<br>${link}</p><p style="color:#5a7380;font-size:13px">If you did not ask for this, ignore this email — your password will not change.</p>`;
   try{await sendMail({to:user.email,subject:'Reset your password — OMI Jaffna',text,html});}
   catch(err){console.error('[mail] password reset email failed',err.message);}
   await audit(user.id,'password_reset_request','user',user.id);
  }
 }
 res.json({ok:true,message:RESET_REPLY});
}));
app.get('/api/auth/reset-password',slowLimit,asyncRoute(async(req,res)=>{
 const token=String(req.query.token||'');
 if(token.length<20)return res.json({valid:false});
 const r=await query('SELECT 1 FROM password_resets p JOIN users u ON u.id=p.user_id WHERE p.token_hash=$1 AND p.used_at IS NULL AND p.expires_at>now() AND u.active',[hashToken(token)]);
 res.json({valid:Boolean(r.rowCount)});
}));
app.post('/api/auth/reset-password',slowLimit,asyncRoute(async(req,res)=>{
 const parsed=passwordResetSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const {token,password}=parsed.data;
 const password_hash=await bcrypt.hash(password,12);
 const r=await query(
  `WITH t AS (UPDATE password_resets SET used_at=now() WHERE token_hash=$1 AND used_at IS NULL AND expires_at>now() RETURNING user_id)
   UPDATE users u SET password_hash=$2,password_changed_at=now() FROM t WHERE u.id=t.user_id AND u.active RETURNING u.id,u.role`,
  [hashToken(token),password_hash]
 );
 const user=r.rows[0];
 if(!user)return bad(res,'This reset link is invalid or has expired. Request a new one.',400);
 await query('UPDATE password_resets SET used_at=now() WHERE user_id=$1 AND used_at IS NULL',[user.id]);
 await audit(user.id,'password_reset','user',user.id);
 clearSessionCookie(res);
 res.json({ok:true,role:user.role,message:'Your password has been changed. Sign in with your new password.'});
}));
app.post('/api/auth/logout',(_req,res)=>{
 clearSessionCookie(res);
 res.json({ok:true});
});
app.get('/api/auth/me',optionalAuth,asyncRoute(async(req,res)=>{
 res.set('Cache-Control','no-store');
 if(!req.session)return res.json({user:null});
 const r=await query('SELECT id,name,email,role,active,father_id,date_of_birth,mobile_number,bio,place,photo_url FROM users WHERE id=$1',[req.session.sub]);
 if(!r.rowCount||!r.rows[0].active){
  clearSessionCookie(res);
  return res.json({user:null});
 }
 res.json({user:r.rows[0]});
}));
app.patch('/api/auth/profile',auth,allow('father'),asyncRoute(async(req,res)=>{
 const parsed=fatherProfileSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const data={...parsed.data};
 if(data.password){data.password_hash=await bcrypt.hash(data.password,12);delete data.password;}
 const columns=Object.keys(data);
 const values=columns.map(key=>data[key]);
 const updates=columns.map((key,index)=>`${key}=$${index+1}`);
 const result=await query(`UPDATE users SET ${updates.join(',')} WHERE id=$${columns.length+1} RETURNING id,name,email,role,active,father_id,date_of_birth,mobile_number,bio,place,photo_url`,[...values,req.session.sub]);
 if(!result.rowCount)return bad(res,'Account unavailable',401);
 await audit(req.session.sub,'update','profile',req.session.sub);
 res.json({user:result.rows[0]});
}));

const fatherOnly=allow('father');
const FATHER_NEWS_COLS=`id,slug,title_en AS title,excerpt_en AS excerpt,body_en AS body,image_url,location_text,status,published_at,created_at,updated_at,
    metadata->>'section' AS section,metadata->'gallery' AS gallery,metadata->>'from_event' AS from_event`;
const FATHER_EVENT_COLS=`id,slug,title_en AS title,excerpt_en AS excerpt,body_en AS body,image_url,location_text,event_date,status,published_at,created_at,updated_at,
    metadata->>'date_display' AS date_display,metadata->>'end_date' AS end_date,metadata->'gallery' AS gallery`;
const aiLimit=rateLimit({...limitOptions,limit:30,keyGenerator:req=>req.session?.sub||req.ip||'unknown'});
const fatherUserCols='id,name,email,role,active,father_id,date_of_birth,mobile_number,bio,place,photo_url';
app.get('/api/father/dashboard',auth,fatherOnly,asyncRoute(async(req,res)=>{
 const user=await query(`SELECT ${fatherUserCols} FROM users WHERE id=$1`,[req.session.sub]);
 if(!user.rowCount||!user.rows[0].active)return bad(res,'Account unavailable',401);
 const items=await query('SELECT id,kind,title,body,file_url,status,sort_order,metadata,created_at,updated_at FROM father_items WHERE user_id=$1 ORDER BY sort_order ASC,created_at DESC',[req.session.sub]);
 const reports=await query(
  `SELECT d.id,d.title,d.body,d.file_url,d.created_at,u.name AS sent_by
   FROM father_dispatches d
   LEFT JOIN users u ON u.id=d.created_by
   WHERE d.target_user_id IS NULL OR d.target_user_id=$1
   ORDER BY d.created_at DESC LIMIT 100`,
  [req.session.sub]
 );
 const myNews=await query(
  `SELECT id,slug,title_en AS title,excerpt_en AS excerpt,body_en AS body,image_url,location_text,status,published_at,created_at,updated_at,
    metadata->>'section' AS section,metadata->'gallery' AS gallery,metadata->>'from_event' AS from_event
   FROM content_items WHERE type='news' AND metadata->>'submitted_by'=$1
   ORDER BY updated_at DESC LIMIT 50`,
  [req.session.sub]
 );
 const myEvents=await query(
  `SELECT ${FATHER_EVENT_COLS}
   FROM content_items WHERE type='event' AND metadata->>'submitted_by'=$1
   ORDER BY updated_at DESC LIMIT 50`,
  [req.session.sub]
 );
 const myBooks=await query(
  `SELECT ${FATHER_BOOK_COLS}
   FROM content_items WHERE type='library' AND metadata->>'submitted_by'=$1
   ORDER BY updated_at DESC LIMIT 50`,
  [req.session.sub]
 );
 const news=await query(`SELECT slug,title_en AS title,excerpt_en AS excerpt,image_url,published_at,metadata->>'date_display' AS date_display
  FROM content_items WHERE type='news' AND status='published' ORDER BY COALESCE(event_date,published_at,created_at) DESC LIMIT 12`);
 const byKind={document:[],gallery:[],action:[],news:[]};
 for(const item of items.rows)(byKind[item.kind]||(byKind[item.kind]=[])).push(item);
 const omiId=user.rows[0].father_id;
 const profile=omiId?await query(
  `SELECT slug FROM content_items WHERE type='priest' AND status='published' AND lower(metadata->>'omi_id')=lower($1) LIMIT 1`,
  [omiId]
 ):{rows:[]};
 res.json({user:user.rows[0],profileSlug:profile.rows[0]?.slug||null,items:byKind,adminReports:reports.rows,myNews:myNews.rows,myEvents:myEvents.rows,myBooks:myBooks.rows,provinceNews:news.rows});
}));
app.post('/api/father/news',auth,fatherOnly,asyncRoute(async(req,res)=>{
 const parsed=fatherNewsSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const {title,excerpt,body,location_text,image_url,section,gallery,from_event}=parsed.data;
 const profile=await query('SELECT name,father_id FROM users WHERE id=$1',[req.session.sub]);
 if(!profile.rowCount)return bad(res,'Account unavailable',401);
 if(from_event){
  const source=await query(`SELECT 1 FROM content_items WHERE id=$1 AND type='event' AND status='published' AND metadata->>'submitted_by'=$2`,[from_event,req.session.sub]);
  if(!source.rowCount)return bad(res,'Only your own approved events can be turned into an article.',409);
 }
 const base=title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,140)||'news';
 const slug=`${base}-${Date.now().toString(36)}`;
 const metadata={
  section:section||'province-events',
  gallery,
  ...(from_event?{from_event}:{}),
  submitted_by:req.session.sub,
  author_name:profile.rows[0].name,
  father_id:profile.rows[0].father_id||'',
  date_display:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Colombo'})
 };
 const r=await query(
  `INSERT INTO content_items(type,slug,title_en,excerpt_en,body_en,location_text,image_url,status,verification_status,metadata,created_by,updated_by)
   VALUES('news',$1,$2,$3,$4,$5,$6,'review','pending',$7,$8,$8)
   RETURNING ${FATHER_NEWS_COLS}`,
  [slug,title,excerpt||'',body,location_text||'',image_url||'',metadata,req.session.sub]
 );
 await audit(req.session.sub,'create','news',r.rows[0].id,{source:'father'});
 res.status(201).json({item:r.rows[0]});
}));
app.patch('/api/father/news/:id',auth,fatherOnly,asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const parsed=fatherNewsSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const existing=await query(
  `SELECT id,status,metadata FROM content_items WHERE id=$1 AND type='news' AND metadata->>'submitted_by'=$2`,
  [req.params.id,req.session.sub]
 );
 if(!existing.rowCount)return bad(res,'Not found',404);
 if(existing.rows[0].status==='published')return bad(res,'Published stories can only be changed by Province staff.',409);
 const {title,excerpt,body,location_text,image_url,section,gallery}=parsed.data;
 const meta={...(existing.rows[0].metadata||{}),section:section||'province-events',gallery};
 const r=await query(
  `UPDATE content_items SET title_en=$1,excerpt_en=$2,body_en=$3,location_text=$4,image_url=$5,metadata=$6,updated_by=$7,updated_at=now()
   WHERE id=$8
   RETURNING ${FATHER_NEWS_COLS}`,
  [title,excerpt,body,location_text,image_url,meta,req.session.sub,req.params.id]
 );
 await audit(req.session.sub,'update','news',req.params.id,{source:'father'});
 res.json({item:r.rows[0]});
}));
app.delete('/api/father/news/:id',auth,fatherOnly,asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const existing=await query(
  `SELECT id,status FROM content_items WHERE id=$1 AND type='news' AND metadata->>'submitted_by'=$2`,
  [req.params.id,req.session.sub]
 );
 if(!existing.rowCount)return bad(res,'Not found',404);
 if(existing.rows[0].status==='published')return bad(res,'Published stories can only be removed by Province staff.',409);
 await query('DELETE FROM content_items WHERE id=$1',[req.params.id]);
 await audit(req.session.sub,'delete','news',req.params.id,{source:'father'});
 res.json({ok:true});
}));
app.post('/api/father/events',auth,fatherOnly,asyncRoute(async(req,res)=>{
 const parsed=fatherEventSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const {title,excerpt,body,location_text,event_date,end_date,date_display,gallery}=parsed.data;
 const profile=await query('SELECT name,father_id FROM users WHERE id=$1',[req.session.sub]);
 if(!profile.rowCount)return bad(res,'Account unavailable',401);
 const base=title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,140)||'event';
 const slug=`${base}-${Date.now().toString(36)}`;
 const startIso=`${event_date}T12:00:00+05:30`;
 const metadata={
  end_date:end_date||'',
  date_display:date_display||'',
  gallery,
  submitted_by:req.session.sub,
  author_name:profile.rows[0].name,
  father_id:profile.rows[0].father_id||''
 };
 const r=await query(
  `INSERT INTO content_items(type,slug,title_en,excerpt_en,body_en,location_text,event_date,image_url,status,verification_status,metadata,created_by,updated_by)
   VALUES('event',$1,$2,$3,$4,$5,$6::timestamptz,$7,'review','pending',$8,$9,$9)
   RETURNING ${FATHER_EVENT_COLS}`,
  [slug,title,excerpt,body||'',location_text,startIso,gallery[0]?.src||'',metadata,req.session.sub]
 );
 await audit(req.session.sub,'create','event',r.rows[0].id,{source:'father'});
 res.status(201).json({item:r.rows[0]});
}));
app.patch('/api/father/events/:id',auth,fatherOnly,asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const parsed=fatherEventSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const existing=await query(
  `SELECT id,status,metadata FROM content_items WHERE id=$1 AND type='event' AND metadata->>'submitted_by'=$2`,
  [req.params.id,req.session.sub]
 );
 if(!existing.rowCount)return bad(res,'Not found',404);
 if(existing.rows[0].status==='published')return bad(res,'Published events can only be changed by Province staff.',409);
 const {title,excerpt,body,location_text,event_date,end_date,date_display,gallery}=parsed.data;
 const startIso=`${event_date}T12:00:00+05:30`;
 const meta={...(existing.rows[0].metadata||{}),end_date:end_date||'',date_display:date_display||'',gallery};
 const r=await query(
  `UPDATE content_items SET title_en=$1,excerpt_en=$2,body_en=$3,location_text=$4,event_date=$5::timestamptz,image_url=$6,metadata=$7,updated_by=$8,updated_at=now()
   WHERE id=$9
   RETURNING ${FATHER_EVENT_COLS}`,
  [title,excerpt,body||'',location_text,startIso,gallery[0]?.src||'',meta,req.session.sub,req.params.id]
 );
 await audit(req.session.sub,'update','event',req.params.id,{source:'father'});
 res.json({item:r.rows[0]});
}));
app.delete('/api/father/events/:id',auth,fatherOnly,asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const existing=await query(
  `SELECT id,status FROM content_items WHERE id=$1 AND type='event' AND metadata->>'submitted_by'=$2`,
  [req.params.id,req.session.sub]
 );
 if(!existing.rowCount)return bad(res,'Not found',404);
 if(existing.rows[0].status==='published')return bad(res,'Published events can only be removed by Province staff.',409);
 await query('DELETE FROM content_items WHERE id=$1',[req.params.id]);
 await audit(req.session.sub,'delete','event',req.params.id,{source:'father'});
 res.json({ok:true});
}));
const FATHER_BOOK_COLS=`id,slug,title_en AS title,excerpt_en AS excerpt,body_en AS body,image_url,media_url,status,published_at,created_at,updated_at,
    metadata->>'library_section' AS section,metadata->>'category' AS category,metadata->>'date_display' AS date_display,metadata->>'author_name' AS author`;
// Books may only point at files this father uploaded himself: the PDF must be a PDF, the cover an image.
async function ownFileProblem(url,userId,kind){
 if(!url)return null;
 const id=url.split('/').pop();
 const r=await query('SELECT mime_type FROM media_assets WHERE id=$1 AND uploaded_by::text=$2',[id,String(userId)]);
 if(!r.rowCount)return kind==='pdf'?'Upload the book PDF again.':'Upload the cover image again.';
 const mime=r.rows[0].mime_type;
 if(kind==='pdf'&&mime!=='application/pdf')return 'The book file must be a PDF.';
 if(kind==='image'&&!/^image\//.test(mime))return 'The cover must be a JPEG, PNG or WebP image.';
 return null;
}
async function fatherBookInput(req,res){
 const parsed=fatherLibrarySchema.safeParse(req.body);
 if(!parsed.success){bad(res,parsed.error.flatten());return null;}
 const pdf=await ownFileProblem(parsed.data.media_url,req.session.sub,'pdf');
 if(pdf){bad(res,{fieldErrors:{media_url:[pdf]}});return null;}
 const cover=await ownFileProblem(parsed.data.image_url,req.session.sub,'image');
 if(cover){bad(res,{fieldErrors:{image_url:[cover]}});return null;}
 return parsed.data;
}
app.post('/api/father/library',auth,fatherOnly,asyncRoute(async(req,res)=>{
 const data=await fatherBookInput(req,res);if(!data)return;
 const profile=await query('SELECT name,father_id FROM users WHERE id=$1',[req.session.sub]);
 if(!profile.rowCount)return bad(res,'Account unavailable',401);
 const {title,author,date_display,excerpt,body,section,category,media_url,image_url}=data;
 const base=title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,140)||'book';
 const slug=`${base}-${Date.now().toString(36)}`;
 const metadata={
  library_section:section,
  category,
  date_display,
  author_name:author,
  submitted_by:req.session.sub,
  submitted_by_name:profile.rows[0].name,
  father_id:profile.rows[0].father_id||''
 };
 const r=await query(
  `INSERT INTO content_items(type,slug,title_en,excerpt_en,body_en,image_url,media_url,status,verification_status,metadata,created_by,updated_by)
   VALUES('library',$1,$2,$3,$4,$5,$6,'review','pending',$7,$8,$8)
   RETURNING ${FATHER_BOOK_COLS}`,
  [slug,title,excerpt,body,image_url,media_url,metadata,req.session.sub]
 );
 await audit(req.session.sub,'create','library',r.rows[0].id,{source:'father'});
 res.status(201).json({item:r.rows[0]});
}));
app.patch('/api/father/library/:id',auth,fatherOnly,asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const existing=await query(
  `SELECT id,status,metadata FROM content_items WHERE id=$1 AND type='library' AND metadata->>'submitted_by'=$2`,
  [req.params.id,req.session.sub]
 );
 if(!existing.rowCount)return bad(res,'Not found',404);
 if(existing.rows[0].status==='published')return bad(res,'Published books can only be changed by Province staff.',409);
 const data=await fatherBookInput(req,res);if(!data)return;
 const {title,author,date_display,excerpt,body,section,category,media_url,image_url}=data;
 const meta={...(existing.rows[0].metadata||{}),library_section:section,category,date_display,author_name:author};
 const r=await query(
  `UPDATE content_items SET title_en=$1,excerpt_en=$2,body_en=$3,image_url=$4,media_url=$5,metadata=$6,updated_by=$7,updated_at=now()
   WHERE id=$8
   RETURNING ${FATHER_BOOK_COLS}`,
  [title,excerpt,body,image_url,media_url,meta,req.session.sub,req.params.id]
 );
 await audit(req.session.sub,'update','library',req.params.id,{source:'father'});
 res.json({item:r.rows[0]});
}));
app.delete('/api/father/library/:id',auth,fatherOnly,asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const existing=await query(
  `SELECT id,status FROM content_items WHERE id=$1 AND type='library' AND metadata->>'submitted_by'=$2`,
  [req.params.id,req.session.sub]
 );
 if(!existing.rowCount)return bad(res,'Not found',404);
 if(existing.rows[0].status==='published')return bad(res,'Published books can only be removed by Province staff.',409);
 await query('DELETE FROM content_items WHERE id=$1',[req.params.id]);
 await audit(req.session.sub,'delete','library',req.params.id,{source:'father'});
 res.json({ok:true});
}));
app.post('/api/father/ai/write',auth,fatherOnly,aiLimit,asyncRoute(async(req,res)=>{
 const parsed=fatherAiWriteSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const {kind,...input}=parsed.data;
 if(!input.title&&!input.notes&&!input.excerpt)return bad(res,'Add a title and a few points first.');
 const profile=await query('SELECT name FROM users WHERE id=$1',[req.session.sub]);
 const today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Colombo'});
 try{
  const draft=await writeWithAi(kind,{...input,author:profile.rows[0]?.name||'',today});
  await audit(req.session.sub,'ai_write',kind,'',{chars:draft.body.length});
  res.json({draft});
 }catch(err){
  return bad(res,err.message||'AI writing failed.',err.status||502);
 }
}));
app.get('/api/father/galleries',auth,cmsOnly,asyncRoute(async(_req,res)=>{
 const r=await query(
  `SELECT i.id,i.title,i.body,i.file_url,i.status,i.created_at,i.updated_at,
    u.id AS user_id,u.name AS father_name,u.father_id AS omi_id,u.email AS father_email
   FROM father_items i
   JOIN users u ON u.id=i.user_id
   WHERE i.kind='gallery'
   ORDER BY i.created_at DESC
   LIMIT 500`
 );
 res.json({items:r.rows});
}));
app.delete('/api/father/galleries/:id',auth,allow('admin','publisher'),asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const r=await query("DELETE FROM father_items WHERE id=$1 AND kind='gallery' RETURNING id",[req.params.id]);
 if(!r.rowCount)return bad(res,'Not found',404);
 await audit(req.session.sub,'delete','father_gallery',req.params.id);
 res.json({ok:true});
}));
app.post('/api/father/items',auth,fatherOnly,asyncRoute(async(req,res)=>{
 const parsed=fatherItemSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const {kind,title,body,file_url,status,sort_order,metadata}=parsed.data;
 const defaults={document:'open',gallery:'published',action:'open',news:'draft'};
 const r=await query(
  `INSERT INTO father_items(user_id,kind,title,body,file_url,status,sort_order,metadata)
   VALUES($1,$2,$3,$4,$5,$6,$7,$8)
   RETURNING id,kind,title,body,file_url,status,sort_order,metadata,created_at,updated_at`,
  [req.session.sub,kind,title,body||'',file_url||'',status||defaults[kind]||'open',sort_order||0,metadata||{}]
 );
 await audit(req.session.sub,'create','father_item',r.rows[0].id,{kind});
 res.status(201).json({item:r.rows[0]});
}));
app.patch('/api/father/items/:id',auth,fatherOnly,asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const parsed=fatherItemUpdateSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 if(parsed.data.kind&&!fatherItemKinds.safeParse(parsed.data.kind).success)return bad(res,'Invalid kind');
 const data=parsed.data;const columns=Object.keys(data);const values=columns.map(key=>data[key]);
 const updates=columns.map((key,index)=>`${key}=$${index+1}`);
 updates.push('updated_at=now()');
 const r=await query(
  `UPDATE father_items SET ${updates.join(',')} WHERE id=$${columns.length+1} AND user_id=$${columns.length+2}
   RETURNING id,kind,title,body,file_url,status,sort_order,metadata,created_at,updated_at`,
  [...values,req.params.id,req.session.sub]
 );
 if(!r.rowCount)return bad(res,'Not found',404);
 await audit(req.session.sub,'update','father_item',req.params.id);
 res.json({item:r.rows[0]});
}));
app.delete('/api/father/items/:id',auth,fatherOnly,asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const r=await query('DELETE FROM father_items WHERE id=$1 AND user_id=$2 RETURNING id',[req.params.id,req.session.sub]);
 if(!r.rowCount)return bad(res,'Not found',404);
 await audit(req.session.sub,'delete','father_item',req.params.id);
 res.json({ok:true});
}));

app.get('/api/father/dispatches',auth,cmsOnly,asyncRoute(async(_req,res)=>{
 const r=await query(
  `SELECT d.id,d.title,d.body,d.file_url,d.target_user_id,d.created_at,
    t.name AS target_name,t.father_id AS target_father_id,c.name AS created_by_name
   FROM father_dispatches d
   LEFT JOIN users t ON t.id=d.target_user_id
   LEFT JOIN users c ON c.id=d.created_by
   ORDER BY d.created_at DESC LIMIT 200`
 );
 res.json({items:r.rows});
}));
app.get('/api/father/recipients',auth,cmsOnly,asyncRoute(async(_req,res)=>{
 const r=await query("SELECT id,name,father_id,email FROM users WHERE role='father' AND active=true ORDER BY name");
 res.json({items:r.rows});
}));
app.post('/api/father/dispatches',auth,allow('admin','publisher'),asyncRoute(async(req,res)=>{
 const parsed=fatherDispatchSchema.safeParse(req.body);if(!parsed.success)return bad(res,parsed.error.flatten());
 const {title,body,file_url,target_user_id}=parsed.data;
 if(target_user_id){
  const father=await query("SELECT id FROM users WHERE id=$1 AND role='father' AND active=true",[target_user_id]);
  if(!father.rowCount)return bad(res,'Choose an active Father account');
 }
 const r=await query(
  `INSERT INTO father_dispatches(title,body,file_url,target_user_id,created_by)
   VALUES($1,$2,$3,$4,$5)
   RETURNING id,title,body,file_url,target_user_id,created_at`,
  [title,body||'',file_url,target_user_id,req.session.sub]
 );
 await audit(req.session.sub,'create','father_dispatch',r.rows[0].id,{target_user_id});
 res.status(201).json({item:r.rows[0]});
}));
app.delete('/api/father/dispatches/:id',auth,allow('admin','publisher'),asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const r=await query('DELETE FROM father_dispatches WHERE id=$1 RETURNING id',[req.params.id]);
 if(!r.rowCount)return bad(res,'Not found',404);
 await audit(req.session.sub,'delete','father_dispatch',req.params.id);
 res.json({ok:true});
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
 const metaHas=String(req.query.meta_has||'');
 if(metaHas){
  if(!/^[a-z_]{1,40}$/.test(metaHas))return bad(res,'Invalid metadata filter');
  args.push(metaHas);conditions.push(`metadata ? $${args.length}`);
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
 await publishFatherMedia(r.rows[0]);
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
 'headline','eyebrow','years','lede','quote','ways','arrival','gallery','sample','sections','detail','about_heading','about','mission','fit',
 'born','born_at','died','died_at','register_no','office',
 'category','region','missions','photos','library_section','role','author_name'
];
app.get('/api/public/items',asyncRoute(async(req,res)=>{
 const type=String(req.query.type||'page');if(!TYPES[type])return bad(res,'Invalid type');
 const lang=['en','ta','si'].includes(req.query.lang)?req.query.lang:'en';
 const slug=req.query.slug?String(req.query.slug).slice(0,180):null;
 const args=[type];const parts=['type=$1',"status='published'"];
 if(slug){args.push(slug);parts.push('slug=$2');}
 // Necrology alone is 500+ rows; keep a high ceiling for other types too.
 const r=await query(`SELECT id,type,slug,title_en,title_ta,title_si,excerpt_en,excerpt_ta,excerpt_si,body_en,body_ta,body_si,location_text,image_url,media_url,event_date,featured,sort_order,published_at,verification_status,last_verified_at,metadata FROM content_items WHERE ${parts.join(' AND ')} ORDER BY sort_order,COALESCE(event_date,created_at) DESC LIMIT 1000`,args);
 // A profile without a CMS birthday uses the date of birth of the registered father with the same OMI ID.
 if(type==='priest'){
  const dobs=await query(`SELECT lower(father_id) AS omi_id,to_char(date_of_birth,'YYYY-MM-DD') AS born FROM users WHERE role='father' AND active AND father_id IS NOT NULL AND date_of_birth IS NOT NULL`);
  const bornById=new Map(dobs.rows.map(x=>[x.omi_id,x.born]));
  for(const row of r.rows){
   const omiId=String(row.metadata?.omi_id||'').trim().toLowerCase();
   if(omiId&&!row.metadata.born&&bornById.has(omiId))row.metadata={...row.metadata,born:bornById.get(omiId)};
  }
 }
 // Metadata can hold editorial notes, so only these keys are public.
 const publicMeta=m=>Object.fromEntries(PUBLIC_META_KEYS.filter(k=>m?.[k]!=null).map(k=>[k,m[k]]));
 res.json({items:r.rows.map(({metadata,...item})=>({...item,meta:publicMeta(metadata),title:item[`title_${lang}`]||item.title_en,excerpt:item[`excerpt_${lang}`]||item.excerpt_en,body:item[`body_${lang}`]||item.body_en}))});
}));
// A father profile's private OMI ID links it to the registered father with the same ID; only his published posts are returned, never the ID.
app.get('/api/public/father-posts',asyncRoute(async(req,res)=>{
 const slug=String(req.query.slug||'').slice(0,180);
 if(!slug)return bad(res,'Missing slug');
 const priest=await query(`SELECT metadata->>'omi_id' AS omi_id FROM content_items WHERE type='priest' AND status='published' AND slug=$1`,[slug]);
 const omiId=String(priest.rows[0]?.omi_id||'').trim();
 if(!omiId)return res.json({news:[],events:[]});
 const r=await query(
  `SELECT c.type,c.slug,c.title_en AS title,c.excerpt_en AS excerpt,c.image_url,c.location_text,c.event_date,c.published_at,
    c.metadata->>'date_display' AS date_display,c.metadata->>'end_date' AS end_date
   FROM content_items c
   JOIN users u ON u.id::text=c.metadata->>'submitted_by'
   WHERE c.type IN ('news','event') AND c.status='published' AND u.role='father' AND lower(u.father_id)=lower($1)
   ORDER BY COALESCE(c.event_date,c.published_at,c.created_at) DESC LIMIT 60`,
  [omiId]
 );
 res.json({
  news:r.rows.filter(x=>x.type==='news').map(({type,event_date,end_date,...x})=>x),
  events:r.rows.filter(x=>x.type==='event').map(({type,...x})=>x)
 });
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
app.get('/api/seed/sample',auth,allow('admin'),asyncRoute(async(_req,res)=>{
 const sample=await loadSampleSeed();
 res.json({sample,types:TYPES,catalog:buildSeedCatalog(sample)});
}));
app.post('/api/seed',auth,allow('admin'),slowLimit,asyncRoute(async(req,res)=>{
 const draft=Boolean(req.body?.draft);
 const force=Boolean(req.body?.force);
 const useSample=Boolean(req.body?.useSample);
 const only=req.body?.only&&typeof req.body.only==='object'?{
  pages:Array.isArray(req.body.only.pages)?req.body.only.pages.map(String):undefined,
  types:Array.isArray(req.body.only.types)?req.body.only.types.map(String):undefined,
 }:null;
 if(only?.pages?.length===0)only.pages=undefined;
 if(only?.types?.length===0)only.types=undefined;
 if(only&&!only.pages&&!only.types)return bad(res,'only.pages or only.types is required when filtering');
 let raw=req.body?.seed;
 if(useSample)raw=await loadSampleSeed();
 else if(!raw||typeof raw!=='object'||Array.isArray(raw))return bad(res,'Provide seed JSON or set useSample:true');
 const result=await applyCmsSeed(raw,{draft,force,only});
 await audit(req.session.sub,'seed_cms','content_items',null,{draft,force,useSample,only,counts:result.counts});
 res.json({ok:true,...result});
}));
app.get('/api/users',auth,allow('admin'),asyncRoute(async(req,res)=>{
 const role=String(req.query.role||'').trim();
 let r;
 if(role==='father'){
  r=await query("SELECT id,name,email,role,active,father_id,date_of_birth,mobile_number,bio,place,photo_url,created_at FROM users WHERE role='father' ORDER BY name");
 }else if(role==='staff'){
  r=await query("SELECT id,name,email,role,active,created_at FROM users WHERE role IN ('admin','editor','publisher') ORDER BY CASE role WHEN 'admin' THEN 0 WHEN 'publisher' THEN 1 ELSE 2 END, name");
 }else{
  r=await query('SELECT id,name,email,role,active,father_id,date_of_birth,mobile_number,created_at FROM users ORDER BY created_at');
 }
 res.json({items:r.rows});
}));
const allowedMime={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','application/pdf':'.pdf','video/mp4':'.mp4','audio/mpeg':'.mp3','audio/mp4':'.m4a','audio/x-m4a':'.m4a'};
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:40*1024*1024},fileFilter:(_req,file,cb)=>allowedMime[file.mimetype]?cb(null,true):cb(new Error('Only JPEG, PNG, WebP, PDF, MP4, MP3 or M4A allowed'))});
const signatureOK=(buf,mime)=>{
 if(mime==='image/jpeg')return buf[0]===255&&buf[1]===216&&buf[2]===255;
 if(mime==='image/png')return buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 if(mime==='image/webp')return buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,12)==='WEBP';
 if(mime==='application/pdf')return buf.toString('ascii',0,5)==='%PDF-';
 if(mime==='video/mp4'||mime==='audio/mp4'||mime==='audio/x-m4a')return buf.length>=8&&buf.toString('ascii',4,8)==='ftyp';
 if(mime==='audio/mpeg')return buf.toString('ascii',0,3)==='ID3'||(buf[0]===255&&(buf[1]&224)===224);
 return false;
};
const enforceUploadSize=(file)=>{
 if(file.mimetype.startsWith('image/')&&file.size>12*1024*1024){const err=new Error('Images must be 12 MB or smaller');err.status=400;throw err;}
 if(file.size>40*1024*1024){const err=new Error('PDF, video and audio files must be 40 MB or smaller');err.status=400;throw err;}
};
app.post('/api/assets',auth,allow('admin','editor','publisher'),upload.single('file'),asyncRoute(async(req,res)=>{
 if(!req.file)return bad(res,'File required');
 enforceUploadSize(req.file);
 if(!signatureOK(req.file.buffer.subarray(0,16),req.file.mimetype))return bad(res,'File signature does not match its format');
 const filename=randomUUID()+allowedMime[req.file.mimetype];
 await saveFile(filename,req.file.buffer);
 // Admins/publishers: publish immediately so block/logo URLs work on the public site.
 // Editors still upload as draft until a publisher approves.
 const publishNow=['admin','publisher'].includes(req.session.role);
 let r;
 try{
  r=await query(
   `INSERT INTO media_assets(filename,original_name,mime_type,size_bytes,uploaded_by,status,rights_confirmed)
    VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
   [filename,req.file.originalname.slice(0,255),req.file.mimetype,req.file.size,req.session.sub,publishNow?'published':'draft',publishNow]
  );
 }catch(e){await removeFile(filename);throw e;}
 await audit(req.session.sub,'upload','asset',r.rows[0].id);res.status(201).json({item:{...r.rows[0],url:`/api/files/${r.rows[0].id}`}});
}));
app.post('/api/father/upload',auth,fatherOnly,upload.single('file'),asyncRoute(async(req,res)=>{
 if(!req.file)return bad(res,'File required');
 enforceUploadSize(req.file);
 if(!signatureOK(req.file.buffer.subarray(0,16),req.file.mimetype))return bad(res,'File signature does not match its format');
 const filename=randomUUID()+allowedMime[req.file.mimetype];
 await saveFile(filename,req.file.buffer);
 let r;
 try{
  r=await query(
   `INSERT INTO media_assets(filename,original_name,mime_type,size_bytes,uploaded_by,status,rights_confirmed)
    VALUES($1,$2,$3,$4,$5,'draft',false) RETURNING *`,
   [filename,req.file.originalname.slice(0,255),req.file.mimetype,req.file.size,req.session.sub]
  );
 }catch(e){await removeFile(filename);throw e;}
 await audit(req.session.sub,'upload','asset',r.rows[0].id,{portal:'father',status:'draft'});
 // Father can preview via /api/files (uploader allowed); staff must publish in File Uploads for public use.
 res.status(201).json({item:{...r.rows[0],url:`/api/files/${r.rows[0].id}`},pending_approval:true});
}));
app.get('/api/assets',auth,cmsOnly,asyncRoute(async(_req,res)=>{const r=await query('SELECT * FROM media_assets ORDER BY created_at DESC LIMIT 200');res.json({items:r.rows.map(a=>({...a,url:`/api/files/${a.id}`}))});}));
app.get('/api/files/:id',asyncRoute(async(req,res)=>{
 if(!idValid(req.params.id))return bad(res,'Invalid ID');
 const r=await query('SELECT * FROM media_assets WHERE id=$1',[req.params.id]);if(!r.rowCount)return bad(res,'Not found',404);
 const a=r.rows[0];if(a.status!=='published'){
  try{
   const p=req.cookies?.omi_session;
   const claims=p?((await import('jsonwebtoken')).default.verify(p,process.env.JWT_SECRET)):null;
   if(!claims)return bad(res,'Not available',404);
   const active=await query('SELECT role FROM users WHERE id=$1 AND active=true',[claims.sub]);
   if(!active.rowCount)return bad(res,'Not available',404);
   const role=active.rows[0].role;
   const allowed=['admin','editor','publisher'].includes(role)||a.uploaded_by===claims.sub;
   if(!allowed)return bad(res,'Not available',404);
  }catch{return bad(res,'Not available',404);}
 }
 const sendFile=(buf,type)=>{
  res.set('Content-Type',type||a.mime_type);
  res.set('Cache-Control',a.status==='published'?'public, max-age=3600':'no-store');
  res.set('Cross-Origin-Resource-Policy','cross-origin');
  res.set('X-Content-Type-Options','nosniff');
  if((type||a.mime_type)==='application/pdf')res.set('Content-Disposition',`attachment; filename="publication.pdf"`);
  res.set('Accept-Ranges','bytes');
  const range=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range||'');
  if(range&&(range[1]||range[2])){
   const size=buf.length;
   let start=range[1]?Number(range[1]):Math.max(0,size-Number(range[2]));
   let end=range[1]&&range[2]?Math.min(Number(range[2]),size-1):size-1;
   if(start>=size||start>end){res.set('Content-Range',`bytes */${size}`);return res.status(416).end();}
   res.status(206).set('Content-Range',`bytes ${start}-${end}/${size}`);
   return res.send(buf.subarray(start,end+1));
  }
  res.send(buf);
 };
 let file;
 try{file=await readStoredFile(a.filename);}
 catch(e){
  if(e.code==='ENOENT')return bad(res,'Not found',404);
  throw e;
 }
 sendFile(file);
}));
app.use((err,_req,res,_next)=>{
 if(err.status>=400&&err.status<500)return bad(res,err.details||err.message,err.status);
 console.error(err);
 if(['22P02','22007','22008'].includes(err?.code))return bad(res,'Invalid identifier or date');
 if(err?.code==='23505'){
  const constraint=String(err.constraint||'');
  const detail=String(err.detail||'');
  if(constraint.includes('email')||detail.includes('(email)'))return bad(res,'That email is already registered. Sign in instead.',409);
  if(constraint.includes('father_id')||detail.includes('(father_id)')||detail.includes('father_id'))return bad(res,'That OMI ID is already registered. Sign in instead.',409);
  if(constraint.includes('slug')||detail.includes('(type, slug)')||detail.includes('(slug)'))return bad(res,'That URL slug is already in use. Choose a different one.',409);
  return bad(res,'That record already exists.',409);
 }
 if(err?.code==='23503')return bad(res,'Related record prevents this operation',409);
 if(err instanceof multer.MulterError)return bad(res,err.message);
 if(err?.message?.startsWith('Only JPEG')||err?.message?.includes('must be'))return bad(res,err.message);
 return bad(res,process.env.NODE_ENV==='production'?'Unexpected server error':(err.message||'Server error'),500);
});

export default app;
