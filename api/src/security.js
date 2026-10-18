import jwt from 'jsonwebtoken';
import {query} from './db.js';
export function issueToken(user){return jwt.sign({sub:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'8h'});}
export async function auth(req,res,next){
  const token=req.cookies?.omi_session;
  if(!token) return res.status(401).json({error:'Sign in required'});
  try{
    const claims=jwt.verify(token,process.env.JWT_SECRET);
    const result=await query('SELECT id,role,active FROM users WHERE id=$1',[claims.sub]);
    if(!result.rowCount||!result.rows[0].active)return res.status(401).json({error:'Account unavailable'});
    req.session={sub:result.rows[0].id,role:result.rows[0].role};
    next();
  }catch(err){if(err.name==='JsonWebTokenError'||err.name==='TokenExpiredError')return res.status(401).json({error:'Session expired. Sign in again.'});next(err);}
}
export const allow=(...roles)=>(req,res,next)=>roles.includes(req.session?.role)?next():res.status(403).json({error:'Insufficient permission'});
export const cookieOptions=()=>({httpOnly:true,sameSite:'strict',secure:process.env.COOKIE_SECURE==='true',path:'/',maxAge:8*60*60*1000});
