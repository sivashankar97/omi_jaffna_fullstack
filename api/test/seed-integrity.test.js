import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const seed=JSON.parse(readFileSync(new URL('../scripts/seed-data.json',import.meta.url),'utf8'));
const group=(type)=>seed.items.filter(x=>x.type===type);
test('all 17 documented ministry areas are present',()=>assert.equal(group('ministry').length,17));
test('all 12 documented parishes are present',()=>assert.equal(group('parish').length,12));
test('all source data has unique type+slug',()=>{
 const identifiers=seed.items.map(x=>`${x.type}:${x.slug}`);
 assert.equal(new Set(identifiers).size,identifiers.length);
});
test('private contacts are not imported by default',()=>{
 assert.equal(seed.items.filter(x=>x.type==='contact').length,0);
 assert(!JSON.stringify(seed).includes('notes_private'));
});
test('all seed items have mandatory titles and slugs',()=>{
 for(const i of seed.items){assert(i.type&&i.title_en&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(i.slug),JSON.stringify(i));}
});
