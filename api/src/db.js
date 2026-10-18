import 'dotenv/config';
import pg from 'pg';
// Preserve calendar dates without converting them through the server timezone.
pg.types.setTypeParser(1082,value=>value);
export const pool = new pg.Pool({connectionString:process.env.DATABASE_URL, max:10});
export const query = (sql, params=[])=>pool.query(sql,params);
