import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createApp} from './entry.mjs';
async function fixture(t) {
 const requests=[];let response={};
 const s=http.createServer(async(req,res)=>{
  let body='';for await(const chunk of req)body+=chunk;
  requests.push({method:req.method,path:req.url,headers:req.headers,body:body?JSON.parse(body):null});
  if(response.drop){req.socket.destroy();return;}
  res.writeHead(response.status,{'Content-Type':'application/json'});
  res.end(response.raw??(response.body===undefined?'':JSON.stringify(response.body)));
 });
 await new Promise(resolve=>s.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>{s.close(resolve);s.closeAllConnections();}));
 const config={alphaUrl:`http://127.0.0.1:${s.address().port}`,alphaToken:'alpha-secret'};
 return {app:createApp(config),config,requests,set:r=>response=r};
}
const input={id:'one',address:' Tokyo ',grams:1250};
const success={status:201,body:{shipmentId:'track/1 ?#',accepted:true}};
const expected={id:'one',address:'Tokyo',grams:1250,trackingId:'track/1 ?#',status:'booked'};
test('actual book/cancel HTTP contract, copies, state and duplicate guards',async t=>{
 const f=await fixture(t);f.set(success);const result=await f.app.book({...input,id:' one '});assert.deepEqual(result,expected);
 const r=f.requests[0];assert.equal(r.method,'POST');assert.equal(r.path,'/shipments');
 assert.equal(r.headers.authorization,'Bearer alpha-secret');assert.match(r.headers['content-type'],/^application\/json/);
 assert.deepEqual(r.body,{reference:'one',destination:'Tokyo',weightGrams:1250});
 result.status='bad';f.app.detail('one').address='bad';assert.deepEqual(f.app.detail('one'),expected);
 await assert.rejects(async()=>f.app.book(input),Error);assert.equal(f.requests.length,1);
 f.set({status:204});const cancelled=await f.app.cancel('one');assert.deepEqual(cancelled,{...expected,status:'cancelled'});
 const c=f.requests[1];assert.equal(c.method,'DELETE');assert.equal(c.path,'/shipments/track%2F1%20%3F%23');assert.equal(c.headers.authorization,'Bearer alpha-secret');assert.equal(c.body,null);
 cancelled.status='bad';assert.equal(f.app.detail('one').status,'cancelled');await assert.rejects(async()=>f.app.cancel('one'),Error);assert.equal(f.requests.length,2);
});
test('invalid inputs and unknown targets have no side effects',async t=>{
 const f=await fixture(t);
 for(const patch of [{id:''},{id:'  '},{id:2},{address:''},{address:' '},{address:null},{grams:0},{grams:-1},{grams:1.5},{grams:Number.MAX_SAFE_INTEGER+1},{grams:'2'}]) await assert.rejects(async()=>f.app.book({...input,...patch}),Error);
 assert.throws(()=>f.app.detail('missing'),Error);await assert.rejects(async()=>f.app.cancel('missing'),Error);assert.equal(f.requests.length,0);
});
test('failed bookings do not reserve id or retry',async t=>{
 const f=await fixture(t);
 for(const response of [{status:503,body:{}},{status:202,body:success.body},{status:201,raw:'invalid-json'},{status:201,body:{}},{status:201,body:null},{status:201,body:{accepted:false,shipmentId:'x'}},{status:201,body:{accepted:true,shipmentId:''}},{status:201,body:{accepted:true,shipmentId:1}},{drop:true}]){
  f.set(response);const n=f.requests.length;await assert.rejects(async()=>f.app.book(input),Error);assert.equal(f.requests.length,n+1);assert.throws(()=>f.app.detail('one'),Error);
 }
 f.set(success);assert.deepEqual(await f.app.book(input),expected);
});
test('failed cancellations preserve booked state without retry',async t=>{
 const f=await fixture(t);f.set(success);await f.app.book(input);
 for(const response of [{status:503,body:{}},{status:200,body:{}},{drop:true}]){f.set(response);const n=f.requests.length;await assert.rejects(async()=>f.app.cancel('one'),Error);assert.equal(f.requests.length,n+1);assert.deepEqual(f.app.detail('one'),expected);}
 f.set({status:204});assert.deepEqual(await f.app.cancel('one'),{...expected,status:'cancelled'});
});
test('independent instances and minimum valid grams',async t=>{
 const f=await fixture(t);f.set(success);await f.app.book({...input,grams:1});assert.equal(f.app.detail('one').grams,1);assert.throws(()=>createApp(f.config).detail('one'),Error);
});
