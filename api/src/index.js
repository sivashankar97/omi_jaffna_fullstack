import {app} from './app.js';
import {pool} from './db.js';
import {initStorage} from './storage.js';

await initStorage();
const port=Number(process.env.PORT||4000);
const server=app.listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`OMI API: http://localhost:${server.address().port}`));
process.on('SIGTERM',async()=>{await pool.end();process.exit(0);});
