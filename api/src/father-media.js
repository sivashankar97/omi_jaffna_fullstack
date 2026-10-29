import {query} from './db.js';

const FILE_ID=/\/api\/files\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

// Publishing a father's news/event/book also publishes the photos and PDF he uploaded for it, so the approved post never has broken links.
export async function publishFatherMedia(item,db={query}){
 const owner=item?.metadata?.submitted_by;
 if(item?.status!=='published'||!owner)return;
 const urls=[item.image_url,item.media_url,...(Array.isArray(item.metadata.gallery)?item.metadata.gallery.map(g=>g?.src):[])];
 const ids=[...new Set(urls.map(u=>FILE_ID.exec(String(u||''))?.[1]).filter(Boolean))];
 if(!ids.length)return;
 await db.query(`UPDATE media_assets SET status='published' WHERE id=ANY($1::uuid[]) AND uploaded_by::text=$2 AND status<>'published'`,[ids,String(owner)]);
}
