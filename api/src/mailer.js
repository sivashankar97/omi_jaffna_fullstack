import nodemailer from 'nodemailer';
import {query} from './db.js';

let transport;

export function mailConfigured(){
  return Boolean(process.env.SMTP_HOST&&process.env.MAIL_FROM);
}

function getTransport(){
  if(transport)return transport;
  const port=Number(process.env.SMTP_PORT)||587;
  transport=nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port,
    secure:process.env.SMTP_SECURE?process.env.SMTP_SECURE==='true':port===465,
    auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS||''}:undefined,
  });
  return transport;
}

/** Sends mail via SMTP. Without SMTP settings, development prints the message to the log instead. */
export async function sendMail({to,subject,text,html}){
  if(!mailConfigured()){
    if(process.env.NODE_ENV==='production'){
      console.warn(`[mail] SMTP is not configured; could not send "${subject}".`);
      return false;
    }
    console.info(`[mail:dev] To: ${to}\nSubject: ${subject}\n\n${text}\n`);
    return true;
  }
  await getTransport().sendMail({from:process.env.MAIL_FROM,to,subject,text,html});
  return true;
}

const KEEPALIVE_KEY='mail_keepalive';
const KEEPALIVE_EVERY_MS=14*24*60*60*1000;
const KEEPALIVE_CHECK_MS=12*60*60*1000;

async function sendKeepAliveIfDue(to){
  const r=await query('SELECT value FROM site_settings WHERE key=$1',[KEEPALIVE_KEY]);
  const last=Date.parse(r.rows[0]?.value?.sent_at||'');
  if(last&&Date.now()-last<KEEPALIVE_EVERY_MS)return;
  const sentAt=new Date().toISOString();
  await sendMail({to,subject:'OMI Jaffna mail check',text:`Automatic check that the website can still send email (${sentAt}). No action needed.`});
  await query('INSERT INTO site_settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()',[KEEPALIVE_KEY,{sent_at:sentAt,to}]);
  console.info(`[mail] keep-alive sent to ${to}`);
}

/** Brevo disables an SMTP key after 90 days without sending, so send a check email every 2 weeks. */
export function startMailKeepAlive(){
  const to=process.env.MAIL_KEEPALIVE_TO;
  if(!to||!mailConfigured())return;
  const run=()=>sendKeepAliveIfDue(to).catch(err=>console.error('[mail] keep-alive failed',err.message));
  setTimeout(run,60*1000).unref();
  setInterval(run,KEEPALIVE_CHECK_MS).unref();
}
