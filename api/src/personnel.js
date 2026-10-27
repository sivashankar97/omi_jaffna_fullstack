import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';

const dir=dirname(fileURLToPath(import.meta.url));
const data=JSON.parse(readFileSync(join(dir,'data/jaffna-personnel.json'),'utf8'));

const byId=new Map(
  (data.records||[]).map((row)=>([String(row.omi_id).trim(),{omi_id:String(row.omi_id).trim(),name:String(row.name).trim()}]))
);

export function normalizeName(value=''){
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

function bigrams(value){
  const map=new Map();
  if(value.length<2){
    if(value)map.set(value,1);
    return map;
  }
  for(let i=0;i<value.length-1;i++){
    const key=value.slice(i,i+2);
    map.set(key,(map.get(key)||0)+1);
  }
  return map;
}

/** Dice coefficient on character bigrams — 1 = identical, 0 = unrelated. */
export function nameSimilarity(a,b){
  const left=normalizeName(a);
  const right=normalizeName(b);
  if(!left||!right)return 0;
  if(left===right)return 1;
  const A=bigrams(left);
  const B=bigrams(right);
  let overlap=0;
  for(const [key,count] of A){
    if(B.has(key))overlap+=Math.min(count,B.get(key));
  }
  let total=0;
  for(const count of A.values())total+=count;
  for(const count of B.values())total+=count;
  if(!total)return 0;
  return (2*overlap)/total;
}

export function findPersonnel(omiId){
  const id=String(omiId||'').trim();
  if(!id)return null;
  return byId.get(id)||byId.get(id.replace(/^OMI-?/i,''))||null;
}

export function matchPersonnel(omiId,name,{threshold=0.7}={}){
  const record=findPersonnel(omiId);
  if(!record){
    return {ok:false,code:'omi_id',message:'That OMI ID is not on the Jaffna Province personnel list.',record:null,score:0};
  }
  const score=nameSimilarity(name,record.name);
  if(score<threshold){
    return {
      ok:false,
      code:'name',
      message:'Full name does not match Province records for this OMI ID.',
      record,
      score
    };
  }
  return {ok:true,code:null,message:null,record,score};
}

export const PERSONNEL_COUNT=byId.size;
