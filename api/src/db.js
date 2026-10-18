import 'dotenv/config';
import pg from 'pg';
// Preserve calendar dates without converting them through the server timezone.
pg.types.setTypeParser(1082,value=>value);
const connectionString=process.env.DATABASE_URL;
// Hosted Postgres (e.g. Supabase) requires TLS; its certificate is not in Node's default trust store.
const ssl=process.env.DATABASE_SSL==='true'||/supabase\.(co|com)/.test(connectionString||'')?{rejectUnauthorized:false}:undefined;
// pg treats sslmode in the URL as certificate verification, which would override the ssl option.
const withoutSslMode=url=>{if(!url||!ssl)return url;const u=new URL(url);u.searchParams.delete('sslmode');return u.toString();};
export const pool = new pg.Pool({connectionString:withoutSslMode(connectionString), ssl, max:10});
export const query = (sql, params=[])=>pool.query(sql,params);
