import 'dotenv/config';
import pg from 'pg';
// Preserve calendar dates without converting them through the server timezone.
pg.types.setTypeParser(1082,value=>value);
const connectionString=process.env.DATABASE_URL;
// Hosted Postgres (e.g. Supabase) requires TLS; its certificate is not in Node's default trust store.
const ssl=process.env.DATABASE_SSL==='true'||/supabase\.(co|com)/.test(connectionString||'')?{rejectUnauthorized:false}:undefined;
// Prefer Supabase transaction pooler (6543). Session mode on 5432 caps ~15 clients and is easy to exhaust locally + on Netlify.
const normalizeDbUrl=raw=>{
 if(!raw)return raw;
 const u=new URL(raw);
 u.searchParams.delete('sslmode');
 const pooler=/pooler\.supabase\.(co|com)$/i.test(u.hostname);
 if(pooler && process.env.PG_POOL_MODE!=='session' && (u.port===''||u.port==='5432')){
  u.port='6543';
  if(!u.searchParams.has('pgbouncer'))u.searchParams.set('pgbouncer','true');
 }
 return u.toString();
};
export const pool = new pg.Pool({connectionString:normalizeDbUrl(connectionString), ssl, min:Number(process.env.PG_POOL_MIN||0), max:Number(process.env.PG_POOL_MAX||3), idleTimeoutMillis:Number(process.env.PG_IDLE_MS||20000), connectionTimeoutMillis:Number(process.env.PG_CONNECT_MS||15000), keepAlive:true, allowExitOnIdle:true});
// Idle connections to a remote database can drop (sleep, network change); without a listener pg crashes the process.
pool.on('error',err=>console.error('Database connection lost:',err.code||err.message));
export const query = (sql, params=[])=>pool.query(sql,params);
