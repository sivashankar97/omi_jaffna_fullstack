import '../env.js';
import serverless from 'serverless-http';
import {connectLambda} from '@netlify/blobs';
import {app} from '../../src/app.js';

const run=serverless(app,{binary:['image/*','application/pdf']});
export const handler=async(event,context)=>{
 if(event.blobs)connectLambda(event);
 return run(event,context);
};
