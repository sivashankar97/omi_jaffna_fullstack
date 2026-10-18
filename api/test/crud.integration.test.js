import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import {mkdtemp,rm,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {TYPES} from '../src/constants.js';

// Opt-in only: this test initializes a dedicated, disposable database.
test('database-backed CRUD and authorization', {skip:!process.env.TEST_DATABASE_URL,timeout:60000},async t=>{
 const url=new URL(process.env.TEST_DATABASE_URL);
 assert.match(url.pathname,/^\/omi_crud_test_[a-z0-9_]+$/,'Use a dedicated omi_crud_test_* database');
 const cwd=fileURLToPath(new URL('..',import.meta.url));
 const uploads=await mkdtemp(path.join(tmpdir(),'omi-crud-'));
 const env={...process.env,DATABASE_URL:url.toString(),PORT:'0',HOST:'127.0.0.1',UPLOAD_DIR:uploads,JWT_SECRET:randomUUID()+randomUUID(),ADMIN_EMAIL:'crud-admin@example.test',ADMIN_PASSWORD:randomUUID()};
 for(const script of ['migrate','seed']){const r=spawnSync(process.execPath,[`scripts/${script}.js`],{cwd,env,encoding:'utf8'});assert.equal(r.status,0,r.stderr);}
 const server=spawn(process.execPath,['src/index.js'],{cwd,env,stdio:['ignore','pipe','pipe']});
 t.after(async()=>{const ended=once(server,'exit');server.kill('SIGTERM');await ended;await rm(uploads,{recursive:true,force:true});});
 // Resolve the actual ephemeral port from the startup log.
 const base=await new Promise((resolve,reject)=>{let output='';const timer=setTimeout(()=>reject(new Error('Server did not start')),10000);server.stdout.on('data',buf=>{output+=buf;const match=output.match(/http:\/\/localhost:(\d+)/);if(match){clearTimeout(timer);resolve(`http://127.0.0.1:${match[1]}`);}});server.once('exit',code=>{clearTimeout(timer);reject(new Error(`Server exited ${code}`));});});
 const request=async(route,method='GET',body,cookie='',expected=200)=>{
  const response=await fetch(base+'/api'+route,{method,headers:{...(cookie?{cookie}:{}),...(body&&!(body instanceof FormData)?{'Content-Type':'application/json'}:{})},body:body===undefined?undefined:body instanceof FormData?body:JSON.stringify(body)});
  const text=await response.text();assert.equal(response.status,expected,`${method} ${route}: ${text}`);return {data:text?JSON.parse(text):null,cookie:response.headers.get('set-cookie')?.split(';')[0]};
 };
 const adminLogin=await request('/auth/login','POST',{email:env.ADMIN_EMAIL,password:env.ADMIN_PASSWORD});
 const admin=adminLogin.cookie,adminId=adminLogin.data.user.id;
 await t.test('Father registration, login, profile and CMS isolation',async()=>{
  const fatherId=`OMI-${randomUUID()}`;
  const password=randomUUID()+'Aa1!';
  const registration={
   name:'Test Father',role:'father',father_id:fatherId,date_of_birth:'1975-06-12',
   email:`father-${randomUUID()}@example.test`,password,mobile_number:'+94112223344'
  };
  const created=await request('/auth/register','POST',registration,'',201);
  assert.equal(created.data.user.role,'father');
  assert.equal(created.data.user.password_hash,undefined);
  const father=created.cookie;
  await request('/dashboard','GET',undefined,father,403);
  await request('/items','GET',undefined,father,403);
  await request('/contacts','GET',undefined,father,403);
  await request('/users','GET',undefined,father,403);
  const updated=(await request('/auth/profile','PATCH',{name:'Updated Father'},father)).data.user;
  assert.equal(updated.name,'Updated Father');
  await request('/auth/profile','PATCH',{father_id:'OTHER-ID'},father,400);
  const login=await request('/auth/login','POST',{identifier:fatherId,password});
  assert.equal(login.data.user.role,'father');
  assert.equal(login.data.user.father_id,fatherId);
  await request('/auth/login','POST',{identifier:registration.email,password},'',401);
  const staffLogin=await request('/auth/login','POST',{identifier:env.ADMIN_EMAIL,password:env.ADMIN_PASSWORD});
  assert.equal(staffLogin.data.user.role,'admin');
  await request('/auth/register','POST',{...registration,email:'admin-attempt@example.test',role:'admin'},'',400);
 });
 const password=randomUUID();let editor,publisher,editorId;
 await t.test('accounts: create, read, update, role enforcement, deactivate and delete',async()=>{
  const created=(await request('/users','POST',{name:'Test Editor',email:'editor@example.test',password},admin,201)).data.user;editorId=created.id;
  assert.equal(created.password_hash,undefined);
  editor=(await request('/auth/login','POST',{email:created.email,password})).cookie;
  assert.equal((await request('/users/'+editorId,'GET',undefined,admin)).data.user.email,created.email);
  await request('/users/'+editorId,'GET',undefined,editor,403);
  await request('/users/'+editorId,'PATCH',{name:'Changed Editor'},editor,403);
  await request('/users/'+editorId,'PATCH',{active:false},admin);
  await request('/items','GET',undefined,editor,401);
  await request('/users/'+editorId,'PUT',{name:'Editor Again',email:created.email,role:'editor',active:true},admin);
  const newPassword=randomUUID();
  await request('/users/'+editorId,'PATCH',{password:newPassword},admin);
  await request('/auth/login','POST',{email:created.email,password},'',401);
  editor=(await request('/auth/login','POST',{email:created.email,password:newPassword})).cookie;
  await request('/users/'+adminId,'PATCH',{active:false},admin,409);
  await request('/users/'+adminId,'DELETE',undefined,admin,409);
  await request('/users/'+adminId,'PATCH',{role:'editor'},admin,409);
  await request('/users','POST',{name:'Duplicate',email:created.email,password},admin,409);
  await request('/users','POST',{name:'Invalid',email:'broken',password},admin,400);
  const pub=(await request('/users','POST',{name:'Test Publisher',email:'publisher@example.test',password,role:'publisher'},admin,201)).data.user;
  publisher=(await request('/auth/login','POST',{email:pub.email,password})).cookie;
  const temporary=(await request('/users','POST',{name:'Temporary',email:'temporary@example.test',password},admin,201)).data.user;
  await request('/users/'+temporary.id,'DELETE',undefined,admin);
  await request('/users/'+temporary.id,'GET',undefined,admin,404);
 });
 await t.test('every content category supports CRUD and partial updates',async()=>{
  for(const type of Object.keys(TYPES)){
   const data={type,slug:'crud-test-'+type,title_en:'CRUD '+type};
   const item=(await request('/items','POST',data,admin,201)).data.item;
   assert.equal((await request('/items/'+item.id,'GET',undefined,admin)).data.item.type,type);
   await request('/items/'+item.id,'PUT',{...data,title_en:'Replaced'},admin);
   const updated=(await request('/items/'+item.id,'PATCH',{excerpt_en:'Partial change'},admin)).data.item;
   assert.equal(updated.title_en,'Replaced');assert.equal(updated.excerpt_en,'Partial change');
   await request('/items/'+item.id,'DELETE',undefined,editor,403);
   await request('/items/'+item.id,'DELETE',undefined,admin);
   await request('/items/'+item.id,'GET',undefined,admin,404);
  }
  const item=(await request('/items','POST',{type:'parish',slug:'publication-test',title_en:'Publication Test'},editor,201)).data.item;
  await request('/items/'+item.id,'PATCH',{status:'published'},editor,403);
  await request('/items/'+item.id,'PATCH',{status:'published'},publisher,400);
  await request('/items/'+item.id,'PATCH',{status:'published',verification_status:'verified',last_verified_at:'2026-10-15'},publisher);
  const changed=(await request('/items/'+item.id,'PATCH',{title_en:'Verified parish'},publisher)).data.item;
  assert.equal(changed.last_verified_at,'2026-10-15');
  await request('/items/'+item.id,'PATCH',{title_en:'Disallowed'},editor,403);
  await request('/items/'+item.id,'DELETE',undefined,admin);
 });
 await t.test('contacts: CRUD, verification and publication permissions',async()=>{
  const id=(await request('/contacts','POST',{name:'Test Contact'},editor,201)).data.item.id;
  await request('/contacts/'+id,'PUT',{name:'Edited Contact',phone:'012345'},editor);
  await request('/contacts/'+id,'PATCH',{approved_for_public:true,last_verified_at:'2026-10-15'},editor,403);
  await request('/contacts/'+id,'PATCH',{approved_for_public:true},publisher,400);
  await request('/contacts/'+id,'PATCH',{approved_for_public:'false'},admin,400);
  await request('/contacts/'+id,'PATCH',{approved_for_public:true,last_verified_at:'2026-10-15'},publisher);
  const old=(await request('/contacts/'+id,'GET',undefined,admin)).data.item;
  await request('/contacts/'+id,'PUT',{...old,name:'UI round trip'},admin);
  await request('/contacts/'+id,'PATCH',{phone:'666'},editor,403);
  await request('/contacts/'+id,'DELETE',undefined,publisher,403);
  await request('/contacts/'+id,'DELETE',undefined,admin);
  await request('/contacts/'+id,'GET',undefined,admin,404);
 });
 await t.test('inquiries: CRUD and consent validation',async()=>{
  const data={name:'Test Person',email:'person@example.test',message:'An integration test enquiry',category:'general',privacy_consent:true};
  await request('/inquiries','POST',data,editor,403);
  await request('/inquiries','POST',{...data,privacy_consent:false},admin,400);
  const id=(await request('/inquiries','POST',data,publisher,201)).data.item.id;
  await request('/inquiries/'+id,'PUT',{...data,message:'Updated inquiry message'},publisher);
  const item=(await request('/inquiries/'+id,'PATCH',{status:'closed'},publisher)).data.item;
  assert.equal(item.message,'Updated inquiry message');assert.equal(item.status,'closed');
  await request('/inquiries/'+id,'GET',undefined,admin);
  await request('/inquiries/'+id,'DELETE',undefined,admin);
  await request('/inquiries/'+id,'GET',undefined,admin,404);
 });
 await t.test('settings: CRUD, duplicate keys, permissions, object validation',async()=>{
  await request('/settings','POST',{key:'navigation',value:{home:'/'}},admin,201);
  await request('/settings','POST',{key:'navigation',value:{}},admin,409);
  await request('/settings/navigation','PUT',{value:{home:'/site'}},admin);
  assert.equal((await request('/settings/navigation','GET',undefined,admin)).data.item.value.home,'/site');
  await request('/settings/navigation','PUT',{value:null},admin,400);
  await request('/settings/navigation','PUT',{value:{}},editor,403);
  await request('/settings/navigation','DELETE',undefined,admin);
  await request('/settings/navigation','GET',undefined,admin,404);
 });
 await t.test('assets: upload, read, update, publication gate, file removal',async()=>{
  const form=new FormData();form.append('file',new Blob(['%PDF-1.4\n%%EOF'],{type:'application/pdf'}),'test.pdf');
  const id=(await request('/assets','POST',form,editor,201)).data.item.id;
  await request('/assets/'+id,'GET',undefined,admin);
  assert.equal((await fetch(base+'/api/files/'+id)).status,404);
  await request('/assets/'+id,'PATCH',{status:'published'},publisher,400);
  await request('/assets/'+id,'PATCH',{rights_confirmed:'false'},publisher,400);
  await request('/assets/'+id,'PUT',{status:'published',rights_confirmed:true,alt_text:'Test PDF',caption:'Original'},publisher);
  const item=(await request('/assets/'+id,'PATCH',{caption:'Changed'},publisher)).data.item;
  assert.equal(item.alt_text,'Test PDF');assert.equal(item.status,'published');
  assert.equal((await fetch(base+'/api/files/'+id)).status,200);
  await request('/assets/'+id,'DELETE',undefined,editor,403);
  await request('/assets/'+id,'DELETE',undefined,admin);
  await request('/assets/'+id,'GET',undefined,admin,404);
  assert.equal((await fetch(base+'/api/files/'+id)).status,404);assert.deepEqual(await readdir(uploads),[]);
 });
 await t.test('invalid IDs, missing records and unauthenticated access',async()=>{
  for(const resource of ['items','contacts','inquiries','assets','users']){
   await request('/'+resource+'/'+randomUUID(),'GET',undefined,'',401);
   await request('/'+resource+'/------------------------------------','GET',undefined,admin,400);
   await request('/'+resource+'/'+randomUUID(),'GET',undefined,admin,404);
  }
  await request('/users/'+editorId,'DELETE',undefined,admin);
  await request('/items','GET',undefined,editor,401);
 });
});
