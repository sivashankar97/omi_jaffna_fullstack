// Must be imported before the app so these defaults apply when its modules load.
process.env.NODE_ENV??='production';
process.env.MEDIA_STORE??='supabase';
process.env.TRUST_PROXY??='1';
process.env.PG_POOL_MAX??='3';
