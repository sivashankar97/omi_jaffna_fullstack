import {z} from 'zod';
import {TYPES,SENSITIVE_TYPES} from './constants.js';
export const contentSchema=z.object({
 type:z.enum(Object.keys(TYPES)),
 slug:z.string().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
 title_en:z.string().trim().min(1).max(255),
 title_ta:z.string().max(255).default(''),title_si:z.string().max(255).default(''),
 excerpt_en:z.string().max(4000).default(''),excerpt_ta:z.string().max(4000).default(''),excerpt_si:z.string().max(4000).default(''),
 body_en:z.string().max(150000).default(''),body_ta:z.string().max(150000).default(''),body_si:z.string().max(150000).default(''),
 location_text:z.string().max(1000).default(''),image_url:z.string().max(2000).default(''),media_url:z.string().max(2000).default(''),
 event_date:z.union([z.string().datetime({offset:true}),z.literal(''),z.null()]).default(null),
 status:z.enum(['draft','review','published']).default('draft'),
 verification_status:z.enum(['pending','verified']).default('pending'),
 last_verified_at:z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/),z.literal(''),z.null()]).default(null),
 featured:z.boolean().default(false),sort_order:z.coerce.number().int().min(-9999).max(9999).default(0),
 metadata:z.record(z.unknown()).default({})
}).strict();
export function publishCheck(c){
  if(c.status!=='published')return null;
  if(SENSITIVE_TYPES.has(c.type)&&(c.verification_status!=='verified'||!c.last_verified_at))
    return 'This section requires Verified status and a Last verified date before publication.';
  return null;
}
export const inquirySchema=z.object({name:z.string().trim().min(2).max(140),email:z.string().trim().email().max(180),
 phone:z.string().max(40).default(''),category:z.enum(['general','vocations','parish','media','support','safeguarding']),
 message:z.string().trim().min(10).max(5000),privacy_consent:z.literal(true)}).strict();

const verifiedDate=z.union([z.string().date(),z.literal(''),z.null()]).transform(v=>v||null);
export const contactSchema=z.object({
 name:z.string().trim().min(2).max(150),role_title:z.string().max(255).default(''),
 phone:z.string().max(40).default(''),email:z.union([z.string().email().max(180),z.literal('')]).default(''),
 whatsapp:z.string().max(40).default(''),location_id:z.string().uuid().nullable().default(null),
 approved_for_public:z.boolean().default(false),last_verified_at:verifiedDate.default(null),
 notes_private:z.string().max(10000).default('')
}).strict();
const userFieldsSchema=z.object({
 name:z.string().trim().min(2).max(150),email:z.string().trim().email().max(180).transform(v=>v.toLowerCase()),
 password:z.string().min(12).refine(v=>Buffer.byteLength(v,'utf8')<=72,'Password must be at most 72 UTF-8 bytes'),
 role:z.enum(['admin','editor','publisher','father']).default('editor'),active:z.boolean().default(true),
 father_id:z.string().trim().min(1).max(80).transform(v=>v.toUpperCase()).optional(),
 date_of_birth:z.string().date().optional(),mobile_number:z.string().trim().min(1).max(40).optional()
}).strict();
export const userSchema=userFieldsSchema.superRefine((user,ctx)=>{
 if(user.role==='father'){
  for(const field of ['father_id','date_of_birth','mobile_number']){
   if(!user[field])ctx.addIssue({code:z.ZodIssueCode.custom,path:[field],message:'Required for Father accounts'});
  }
 }
});
export const userUpdateSchema=userFieldsSchema.omit({password:true}).extend({password:userFieldsSchema.shape.password.optional()});
export const passwordResetSchema=z.object({
 token:z.string().min(20).max(200),
 password:z.string().min(12,'Password must be at least 12 characters').refine(v=>Buffer.byteLength(v,'utf8')<=72,'Password must be at most 72 UTF-8 bytes'),
});
export const fatherRegistrationSchema=z.object({
 name:z.string().trim().min(2).max(150),
 role:z.literal('father').default('father'),
 father_id:z.string().trim().min(1).max(80).transform(v=>v.toUpperCase()),
 date_of_birth:z.string().date(),
 email:z.string().trim().email().max(180).transform(v=>v.toLowerCase()),
 password:z.string().min(12).refine(v=>Buffer.byteLength(v,'utf8')<=72,'Password must be at most 72 UTF-8 bytes'),
 mobile_number:z.string().trim().min(1).max(40)
}).strict();
export const fatherProfileSchema=z.object({
 name:z.string().trim().min(2).max(150).optional(),
 email:z.string().trim().email().max(180).transform(v=>v.toLowerCase()).optional(),
 date_of_birth:z.string().date().optional(),
 mobile_number:z.string().trim().min(1).max(40).optional(),
 bio:z.string().max(4000).optional(),
 place:z.string().max(255).optional(),
 photo_url:z.string().max(2000).optional(),
 password:userFieldsSchema.shape.password.optional()
}).strict().refine(data=>Object.keys(data).length>0,'Provide at least one profile field');
export const fatherItemKinds=z.enum(['document','gallery','action','news']);
export const fatherItemSchema=z.object({
 kind:fatherItemKinds,
 title:z.string().trim().min(1).max(255),
 body:z.string().max(20000).default(''),
 file_url:z.string().max(2000).default(''),
 status:z.enum(['open','done','draft','published']).default('open'),
 sort_order:z.coerce.number().int().min(-9999).max(9999).default(0),
 metadata:z.record(z.unknown()).default({})
}).strict();
export const fatherItemUpdateSchema=fatherItemSchema.partial().refine(data=>Object.keys(data).length>0,'Provide at least one field');
export const fatherDispatchSchema=z.object({
 title:z.string().trim().min(1).max(255),
 body:z.string().max(20000).default(''),
 file_url:z.string().trim().min(1).max(2000),
 target_user_id:z.union([z.string().uuid(),z.literal(''),z.null()]).optional().transform(v=>v||null)
}).strict();
const newsSections=z.enum([
 'province-events','parish-events','liturgical','formation','youth','social'
]);
export const fatherNewsSchema=z.object({
 title:z.string().trim().min(2).max(255),
 excerpt:z.string().trim().min(1).max(4000),
 body:z.string().trim().min(1).max(150000),
 location_text:z.string().trim().min(1).max(1000),
 image_url:z.string().trim().min(1).max(2000),
 section:newsSections,
 gallery:z.array(z.object({
  src:z.string().min(1).max(2000),
  alt:z.string().max(500).default(''),
  caption:z.string().max(1000).default('')
 }).strict()).max(24).default([])
}).strict();
export const fatherEventSchema=z.object({
 title:z.string().trim().min(2).max(255),
 excerpt:z.string().trim().min(1).max(4000),
 body:z.string().max(150000).default(''),
 location_text:z.string().trim().min(1).max(1000),
 event_date:z.string().date(),
 end_date:z.union([z.string().date(),z.literal('')]).optional().transform(v=>v||''),
 date_display:z.string().max(255).default('')
}).strict();
export const assetSchema=z.object({status:z.enum(['draft','published']).default('draft'),
 rights_confirmed:z.boolean().default(false),alt_text:z.string().trim().max(2000).default(''),caption:z.string().max(10000).default('')}).strict();
export const adminInquirySchema=inquirySchema.extend({status:z.enum(['new','in_progress','closed']).default('new')});
export const settingKeySchema=z.enum(['site_identity','navigation','social_links','seo_defaults']);
export const settingValueSchema=z.object({value:z.record(z.unknown())}).strict();
