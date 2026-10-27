import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {query} from './db.js';

/** 8-hour sessions (cookie maxAge + JWT exp stay aligned). */
export const SESSION_MS=8*60*60*1000;
const SESSION_REFRESH_MS=SESSION_MS/2;

/** Dummy hash so missing users still pay a bcrypt cost (timing safety). */
const DUMMY_HASH=bcrypt.hashSync('omi-jaffna-timing-dummy',12);

export function issueToken(user){
  return jwt.sign({sub:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'8h'});
}

/** Secure cookies on HTTPS / production VPS unless COOKIE_SECURE=false (local http). */
function cookieSecure(){
  if(process.env.COOKIE_SECURE==='true')return true;
  if(process.env.COOKIE_SECURE==='false')return false;
  return process.env.NODE_ENV==='production';
}

export const cookieOptions=()=>({
  httpOnly:true,
  sameSite:'lax',
  secure:cookieSecure(),
  path:'/',
  maxAge:SESSION_MS
});

/** Must match set-cookie flags (except maxAge) or browsers keep the session cookie. */
export const clearCookieOptions=()=>({
  httpOnly:true,
  sameSite:'lax',
  secure:cookieSecure(),
  path:'/'
});

export function setSessionCookie(res,user){
  res.set('Cache-Control','no-store');
  res.cookie('omi_session',issueToken(user),cookieOptions());
}

export function clearSessionCookie(res){
  res.set('Cache-Control','no-store');
  res.clearCookie('omi_session',clearCookieOptions());
}

function refreshIfNeeded(res,user,claims){
  if(!claims?.exp)return;
  const remaining=claims.exp*1000-Date.now();
  if(remaining>0&&remaining<SESSION_REFRESH_MS){
    setSessionCookie(res,{id:user.id,role:user.role});
  }
}

async function loadActiveUser(userId){
  const result=await query('SELECT id,role,active FROM users WHERE id=$1',[userId]);
  if(!result.rowCount||!result.rows[0].active)return null;
  return result.rows[0];
}

export async function auth(req,res,next){
  const token=req.cookies?.omi_session;
  if(!token)return res.status(401).json({error:'Sign in required'});
  try{
    const claims=jwt.verify(token,process.env.JWT_SECRET);
    const user=await loadActiveUser(claims.sub);
    if(!user)return res.status(401).json({error:'Account unavailable'});
    req.session={sub:user.id,role:user.role};
    refreshIfNeeded(res,user,claims);
    next();
  }catch(err){
    if(err.name==='JsonWebTokenError'||err.name==='TokenExpiredError'){
      clearSessionCookie(res);
      return res.status(401).json({error:'Session expired. Sign in again.'});
    }
    next(err);
  }
}

/** For /api/auth/me — returns null session instead of 401 when anonymous. */
export async function optionalAuth(req,res,next){
  const token=req.cookies?.omi_session;
  if(!token){req.session=null;return next();}
  try{
    const claims=jwt.verify(token,process.env.JWT_SECRET);
    const user=await loadActiveUser(claims.sub);
    if(!user){
      clearSessionCookie(res);
      req.session=null;
      return next();
    }
    req.session={sub:user.id,role:user.role};
    refreshIfNeeded(res,user,claims);
    next();
  }catch{
    clearSessionCookie(res);
    req.session=null;
    next();
  }
}

export const allow=(...roles)=>(req,res,next)=>roles.includes(req.session?.role)?next():res.status(403).json({error:'Insufficient permission'});

/** Constant-time-ish password check (always runs bcrypt). */
export async function verifyPassword(password,passwordHash){
  const hash=passwordHash||DUMMY_HASH;
  const ok=await bcrypt.compare(String(password||''),hash);
  return Boolean(passwordHash)&&ok;
}
