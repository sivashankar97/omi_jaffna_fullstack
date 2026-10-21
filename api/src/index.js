import {app} from './app.js';
import {pool} from './db.js';
import {initStorage} from './storage.js';

await initStorage();
const port=Number(process.env.PORT||4000);
const host=process.env.HOST||'0.0.0.0';
const server=app.listen(port,host,()=>console.log(`OMI API: http://${host==='0.0.0.0'?'127.0.0.1':host}:${server.address().port}`));
process.on('SIGTERM',async()=>{await pool.end();process.exit(0);});
