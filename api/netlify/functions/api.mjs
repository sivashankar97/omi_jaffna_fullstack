import '../env.js';
import serverless from 'serverless-http';
import {app} from '../../src/app.js';

const run=serverless(app,{binary:['image/*','application/pdf']});
export const handler=async(event,context)=>run(event,context);
