import {Router} from 'express';
import bcrypt from 'bcryptjs';
import {query,pool} from './db.js';
import {removeFile} from './storage.js';
import {auth,allow} from './security.js';
import {contentSchema,publishCheck,contactSchema,userSchema,userUpdateSchema,assetSchema,adminInquirySchema,settingKeySchema,settingValueSchema} from './validation.js';

const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res)).catch(next);
const fail=(status,message)=>{const e=new Error(message);e.status=status;throw e;};
const parse=(schema,value)=>{const r=schema.safeParse(value);if(!r.success){const e=new Error('Invalid request');e.status=400;e.details=r.error.flatten();throw e;}return r.data;};
const uuid=value=>{if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value||''))fail(400,'Invalid ID');return value;};
const fields=(schema,row)=>Object.fromEntries(Object.keys(schema.shape).filter(k=>row[k]!==undefined).map(k=>[k,row[k]]));
const cleanContact=body=>{const data={...body};for(const k of ['id','created_at','updated_at'])delete data[k];return data;};
const safeUser=row=>{const {password_hash,...user}=row;return user;};
const row=async(db,table,id,lock=false)=>{const r=await db.query(`SELECT * FROM ${table} WHERE id=$1${lock?' FOR UPDATE':''}`,[uuid(id)]);if(!r.rowCount)fail(404,'Not found');return r.rows[0];};
const audit=(db,actor,action,type,id)=>db.query('INSERT INTO audit_log(actor_id,action,target_type,target_id) VALUES($1,$2,$3,$4)',[actor,action,type,id]);
async function transaction(fn){const db=await pool.connect();try{await db.query('BEGIN');const result=await fn(db);await db.query('COMMIT');return result;}catch(e){await db.query('ROLLBACK');throw e;}finally{db.release();}}
async function insert(db,table,data){const keys=Object.keys(data);return (await db.query(`INSERT INTO ${table}(${keys.join(',')}) VALUES(${keys.map((_,i)=>`$${i+1}`).join(',')}) RETURNING *`,Object.values(data))).rows[0];}
async function update(db,table,id,data,extra=''){const keys=Object.keys(data);return (await db.query(`UPDATE ${table} SET ${keys.map((k,i)=>`${k}=$${i+1}`).join(',')}${extra} WHERE id=$${keys.length+1} RETURNING *`,[...Object.values(data),id])).rows[0];}

export function crudRouter(){
 const router=Router();
 // Identifiers and table names below come only from this fixed server-side map.
 const resources={items:'content_items',contacts:'people_contacts',inquiries:'inquiries',assets:'media_assets',users:'users'};
 for(const [resource,table] of Object.entries(resources)){
  router.get(`/${resource}/:id`,auth,...(resource==='users'?[allow('admin')]:[allow('admin','editor','publisher')]),wrap(async(req,res)=>{
   let item=await row({query},table,req.params.id);
   if(resource==='users')return res.json({user:safeUser(item)});
   if(resource==='assets')item={...item,url:`/api/files/${item.id}`};
   res.json({item});
  }));
 }
 router.patch('/items/:id',auth,allow('admin','editor','publisher'),wrap(async(req,res)=>{
  const changes=parse(contentSchema.partial(),req.body);if(!Object.keys(changes).length)fail(400,'Provide at least one field');
  const item=await transaction(async db=>{
   const old=await row(db,'content_items',req.params.id,true);
   if(old.status==='published'&&req.session.role==='editor')fail(403,'Published content requires a publisher or admin');
   const original=fields(contentSchema,old);
   if(original.last_verified_at instanceof Date)original.last_verified_at=original.last_verified_at.toISOString().slice(0,10);
   if(original.event_date instanceof Date)original.event_date=original.event_date.toISOString();
   const data=parse(contentSchema,{...original,...changes});
   if(data.type!==old.type)fail(400,'Cannot change content type');
   if(data.status==='published'&&req.session.role==='editor')fail(403,'Only publishers can publish');
   const warning=publishCheck(data);if(warning)fail(400,warning);
   data.event_date=data.event_date||null;data.last_verified_at=data.last_verified_at||null;
   data.updated_by=req.session.sub;data.published_at=data.status==='published'?(old.published_at||new Date()):null;
   const result=await update(db,'content_items',old.id,data,',updated_at=now()');await audit(db,req.session.sub,'update',old.type,old.id);return result;
  });res.json({item});
 }));

 const contactGate=(data,old,role)=>{
  if(role==='editor'&&old?.approved_for_public)fail(403,'Published contacts require a publisher or admin');
  if(data.approved_for_public){if(role==='editor')fail(403,'Only publishers can approve contacts');if(!data.last_verified_at)fail(400,'Public contacts require a verification date');}
 };
 router.post('/contacts',auth,allow('admin','editor','publisher'),wrap(async(req,res)=>{
  const data=parse(contactSchema,cleanContact(req.body));contactGate(data,null,req.session.role);
  const item=await transaction(async db=>{const item=await insert(db,'people_contacts',data);await audit(db,req.session.sub,'create','contact',item.id);return item;});res.status(201).json({item});
 }));
 for(const method of ['put','patch'])router[method]('/contacts/:id',auth,allow('admin','editor','publisher'),wrap(async(req,res)=>{
  const changes=parse(method==='patch'?contactSchema.partial():contactSchema,cleanContact(req.body));
  if(!Object.keys(changes).length)fail(400,'Provide at least one field');
  const item=await transaction(async db=>{
   const old=await row(db,'people_contacts',req.params.id,true);const original=fields(contactSchema,old);
   if(original.last_verified_at instanceof Date)original.last_verified_at=original.last_verified_at.toISOString().slice(0,10);
   const data=parse(contactSchema,{...original,...changes});contactGate(data,old,req.session.role);
   const item=await update(db,'people_contacts',old.id,data,',updated_at=now()');await audit(db,req.session.sub,'update','contact',old.id);return item;
  });res.json({item});
 }));
 router.post('/inquiries',auth,allow('admin','publisher'),wrap(async(req,res)=>{
  const data=parse(adminInquirySchema,req.body);
  const item=await transaction(async db=>{const item=await insert(db,'inquiries',data);await audit(db,req.session.sub,'create','inquiry',item.id);return item;});res.status(201).json({item});
 }));
 for(const method of ['put','patch'])router[method]('/inquiries/:id',auth,allow('admin','publisher'),wrap(async(req,res)=>{
  const changes=parse(method==='patch'?adminInquirySchema.partial():adminInquirySchema,req.body);if(!Object.keys(changes).length)fail(400,'Provide at least one field');
  const item=await transaction(async db=>{const old=await row(db,'inquiries',req.params.id,true);const data=parse(adminInquirySchema,{...fields(adminInquirySchema,old),...changes});const item=await update(db,'inquiries',old.id,data);await audit(db,req.session.sub,'update','inquiry',old.id);return item;});res.json({item});
 }));
 for(const [resource,table,type] of [['contacts','people_contacts','contact'],['inquiries','inquiries','inquiry']]){
  router.delete(`/${resource}/:id`,auth,allow('admin'),wrap(async(req,res)=>{
   await transaction(async db=>{const old=await row(db,table,req.params.id,true);await db.query(`DELETE FROM ${table} WHERE id=$1`,[old.id]);await audit(db,req.session.sub,'delete',type,old.id);});res.json({ok:true});
  }));
 }

 router.post('/users',auth,allow('admin'),wrap(async(req,res)=>{
  const data=parse(userSchema,req.body);data.password_hash=await bcrypt.hash(data.password,12);delete data.password;
  const user=await transaction(async db=>{const user=await insert(db,'users',data);await audit(db,req.session.sub,'create','user',user.id);return safeUser(user);});res.status(201).json({user});
 }));
 const protectAdmin=async(db,old,data,actor,deleting=false)=>{
  if(old.id===actor&&(deleting||data.active===false||data.role&&data.role!=='admin'))fail(409,'You cannot delete, disable or demote your own account');
  if(old.active&&old.role==='admin'&&(deleting||data.active===false||data.role&&data.role!=='admin')){
   const r=await db.query("SELECT count(*)::int AS count FROM users WHERE active=true AND role='admin'");if(r.rows[0].count<=1)fail(409,'At least one active administrator must remain');
  }
 };
 for(const method of ['put','patch'])router[method]('/users/:id',auth,allow('admin'),wrap(async(req,res)=>{
  const data=parse(method==='patch'?userUpdateSchema.partial():userUpdateSchema,req.body);if(!Object.keys(data).length)fail(400,'Provide at least one field');
  if(data.password){data.password_hash=await bcrypt.hash(data.password,12);delete data.password;}
  const user=await transaction(async db=>{
   // Serialize account changes so concurrent requests cannot remove all admins.
   await db.query('LOCK TABLE users IN SHARE ROW EXCLUSIVE MODE');
   const actor=await row(db,'users',req.session.sub);if(!actor.active||actor.role!=='admin')fail(403,'Administrator access required');
   const old=await row(db,'users',req.params.id,true);await protectAdmin(db,old,data,req.session.sub);
   const fatherProfile=['father_id','date_of_birth','mobile_number'].every(key=>data[key]||old[key]);
   if((data.role||old.role)==='father'&&!fatherProfile)fail(400,'Father ID, date of birth and mobile number are required for Father accounts');
   const result=await update(db,'users',old.id,data);await audit(db,req.session.sub,'update','user',old.id);return safeUser(result);
  });res.json({user});
 }));
 router.delete('/users/:id',auth,allow('admin'),wrap(async(req,res)=>{
  await transaction(async db=>{
   await db.query('LOCK TABLE users IN SHARE ROW EXCLUSIVE MODE');
   const actor=await row(db,'users',req.session.sub);if(!actor.active||actor.role!=='admin')fail(403,'Administrator access required');
   const old=await row(db,'users',req.params.id,true);await protectAdmin(db,old,{},req.session.sub,true);
   await db.query('UPDATE media_assets SET uploaded_by=NULL WHERE uploaded_by=$1',[old.id]);
   await db.query('DELETE FROM users WHERE id=$1',[old.id]);await audit(db,req.session.sub,'delete','user',old.id);
  });res.json({ok:true});
 }));

 router.get('/settings/:key',auth,allow('admin','editor','publisher'),wrap(async(req,res)=>{
  const key=parse(settingKeySchema,req.params.key);const r=await query('SELECT * FROM site_settings WHERE key=$1',[key]);if(!r.rowCount)fail(404,'Not found');res.json({item:r.rows[0]});
 }));
 router.post('/settings',auth,allow('admin'),wrap(async(req,res)=>{
  const key=parse(settingKeySchema,req.body?.key);const {value}=parse(settingValueSchema,{value:req.body?.value});
  const item=await transaction(async db=>{const item=await insert(db,'site_settings',{key,value});await audit(db,req.session.sub,'create','setting',key);return item;});res.status(201).json({item});
 }));
 router.put('/settings/:key',auth,allow('admin'),wrap(async(req,res)=>{
  const key=parse(settingKeySchema,req.params.key);const {value}=parse(settingValueSchema,req.body);
  const item=await transaction(async db=>{const r=await db.query('INSERT INTO site_settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value,updated_at=now() RETURNING *',[key,value]);await audit(db,req.session.sub,'update','setting',key);return r.rows[0];});res.json({ok:true,item});
 }));
 router.delete('/settings/:key',auth,allow('admin'),wrap(async(req,res)=>{
  const key=parse(settingKeySchema,req.params.key);await transaction(async db=>{const r=await db.query('DELETE FROM site_settings WHERE key=$1 RETURNING key',[key]);if(!r.rowCount)fail(404,'Not found');await audit(db,req.session.sub,'delete','setting',key);});res.json({ok:true});
 }));

 for(const method of ['put','patch'])router[method]('/assets/:id',auth,allow('admin','publisher'),wrap(async(req,res)=>{
  const changes=parse(method==='patch'?assetSchema.partial():assetSchema,req.body);if(!Object.keys(changes).length)fail(400,'Provide at least one field');
  const item=await transaction(async db=>{const old=await row(db,'media_assets',req.params.id,true);const data=parse(assetSchema,{...fields(assetSchema,old),...changes});
   if(data.status==='published'&&(!data.rights_confirmed||!data.alt_text))fail(400,'Confirm rights and provide accessible alt text before publishing');
   const item=await update(db,'media_assets',old.id,data);await audit(db,req.session.sub,'update','asset',old.id);return item;
  });res.json({item:{...item,url:`/api/files/${item.id}`}});
 }));
 router.delete('/assets/:id',auth,allow('admin'),wrap(async(req,res)=>{
  const filename=await transaction(async db=>{
   const old=await row(db,'media_assets',req.params.id,true);
   await db.query('DELETE FROM media_assets WHERE id=$1',[old.id]);await audit(db,req.session.sub,'delete','asset',old.id);
   return old.filename;
  });
  // The record is gone once committed; a leftover file is harmless, a dangling record is not.
  await removeFile(filename).catch(e=>console.error('Could not remove file',filename,e.message));
  res.json({ok:true});
 }));
 return router;
}
