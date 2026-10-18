import {spawn, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url));
const env={...process.env,PATH:`/opt/homebrew/opt/node@22/bin:/opt/homebrew/opt/postgresql@16/bin:/opt/homebrew/bin:${process.env.PATH}`};
const database=spawnSync('brew',['services','start','postgresql@16'],{env,stdio:'inherit'});
if(database.status!==0)process.exit(database.status||1);
// Hand ownership of the website processes to this terminal to avoid duplicate ports.
for(const name of ['api','web'])spawnSync('launchctl',['bootout',`gui/${process.getuid()}/local.omi-jaffna.${name}`],{stdio:'ignore'});
console.log('\nOMI Jaffna — development terminal\nWebsite: http://localhost:5173\nAdmin CMS: http://localhost:5173/admin\nBackend: http://localhost:4000\nPress Ctrl+C to stop both services.\n');
const children=[
 spawn(process.execPath,['--watch','src/index.js'],{cwd:path.join(root,'api'),env,stdio:'inherit'}),
 spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','localhost','--port','5173','--strictPort'],{cwd:path.join(root,'web'),env,stdio:'inherit'})
];
let stopping=false;
function stop(code=0){if(stopping)return;stopping=true;for(const child of children)child.kill('SIGTERM');setTimeout(()=>{for(const child of children)if(child.exitCode===null)child.kill('SIGKILL');process.exit(code);},1500).unref();process.exitCode=code;}
for(const child of children){child.on('error',error=>{console.error(error.message);stop(1);});child.on('exit',code=>{if(!stopping)stop(code||0);});}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
