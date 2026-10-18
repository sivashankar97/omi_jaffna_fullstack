import test from 'node:test';
import assert from 'node:assert/strict';
import {fatherProfileSchema,fatherRegistrationSchema,userSchema} from '../src/validation.js';

const father={
 name:'Test Father',
 role:'father',
 father_id:' omi-123 ',
 date_of_birth:'1975-06-12',
 email:'FATHER@example.test',
 password:'A sufficiently long password',
 mobile_number:'+94112223344'
};

test('Father registration normalizes login identifiers and email',()=>{
 const parsed=fatherRegistrationSchema.parse(father);
 assert.equal(parsed.role,'father');
 assert.equal(parsed.father_id,'OMI-123');
 assert.equal(parsed.email,'father@example.test');
});

test('public registration cannot create administrator accounts',()=>{
 assert.equal(fatherRegistrationSchema.safeParse({...father,role:'admin'}).success,false);
});

test('admin-created Father accounts require profile details',()=>{
 assert.equal(userSchema.safeParse({name:father.name,email:father.email,password:father.password,role:'father'}).success,false);
 assert.equal(userSchema.safeParse({...father,active:true}).success,true);
});

test('Father profile updates reject changing the Father ID',()=>{
 assert.equal(fatherProfileSchema.safeParse({name:'Updated Father',mobile_number:'12345'}).success,true);
 assert.equal(fatherProfileSchema.safeParse({father_id:'OMI-999'}).success,false);
});
