import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createApp} from './entry.mjs';
const expanded = true;
const providers = expanded ? ['alpha', 'beta'] : ['alpha'];
async function server(t) {
  const requests = []; let response = {};
  const s = http.createServer(async (req,res) => {
    let body = ''; for await (const chunk of req) body += chunk;
    requests.push({method:req.method,path:req.url,headers:req.headers,body:body ? JSON.parse(body) : null});
    if(response.drop) { req.socket.destroy(); return; }
    res.writeHead(response.status, {'Content-Type':'application/json'});
    res.end(response.raw ?? (response.body === undefined ? '' : JSON.stringify(response.body)));
  });
  await new Promise(resolve => s.listen(0,'127.0.0.1',resolve));
  t.after(() => new Promise(resolve => { s.close(resolve); s.closeAllConnections(); }));
  return {url:`http://127.0.0.1:${s.address().port}`,requests,set:r=>response=r};
}
async function fixture(t) {
  const alpha=await server(t), beta=await server(t);
  return {alpha,beta,app:createApp({alphaUrl:alpha.url,alphaToken:'alpha-secret',betaUrl:beta.url,betaToken:'beta-secret'})};
}
const booking = p => p==='alpha' ? {status:201,body:{shipmentId:'track/1 ?#',accepted:true}} : {status:200,body:{ok:true,job:{code:'track/1 ?#'}}};
const cancellation = p => p==='alpha' ? {status:204} : {status:200,body:{ok:true}};
const input = (p,id='one') => ({id,address:' Tokyo ',grams:1250,...(expanded?{provider:p}:{})});
const expected = (p,id='one',status='booked') => ({id,address:'Tokyo',grams:1250,trackingId:'track/1 ?#',status,...(expanded?{provider:p}:{})});
for(const p of providers) {
 test(`${p}: actual booking and cancellation wire contract, copies, state`, async t => {
  const f=await fixture(t), srv=f[p];srv.set(booking(p));
  const result=await f.app.book(input(p,' one '));assert.deepEqual(result,expected(p));
  const r=srv.requests[0]; assert.equal(r.method,'POST');
  assert.match(r.headers['content-type'],/^application\/json/);
  assert.equal(r.path,p==='alpha'?'/shipments':'/v2/jobs');
  assert.deepEqual(r.body,p==='alpha'?{reference:'one',destination:'Tokyo',weightGrams:1250}:{client_ref:'one',parcel:{destination:'Tokyo',mass_kg:1.25}});
  assert.equal(r.headers[p==='alpha'?'authorization':'x-api-key'],p==='alpha'?'Bearer alpha-secret':'beta-secret');
  assert.equal(r.headers[p==='alpha'?'x-api-key':'authorization'],undefined);
  result.status='bad';f.app.detail('one').address='bad'; assert.deepEqual(f.app.detail('one'),expected(p));
  await assert.rejects(async()=>f.app.book(input(p)),Error); assert.equal(srv.requests.length,1);
  srv.set(cancellation(p));const cancelled=await f.app.cancel('one');assert.deepEqual(cancelled,expected(p,'one','cancelled'));
  const c=srv.requests[1]; assert.equal(c.method,p==='alpha'?'DELETE':'POST');
  assert.equal(c.path,p==='alpha'?'/shipments/track%2F1%20%3F%23':'/v2/void');
  assert.deepEqual(c.body,p==='alpha'?null:{job_code:'track/1 ?#'});
  assert.equal(c.headers[p==='alpha'?'authorization':'x-api-key'],p==='alpha'?'Bearer alpha-secret':'beta-secret');
  assert.equal(c.headers[p==='alpha'?'x-api-key':'authorization'],undefined);
  if(p==='beta') assert.match(c.headers['content-type'],/^application\/json/);
  cancelled.status='bad';assert.equal(f.app.detail('one').status,'cancelled');
  await assert.rejects(async()=>f.app.cancel('one'),Error);assert.equal(srv.requests.length,2);
  assert.equal(f[p==='alpha'?'beta':'alpha'].requests.length,0);
 });
 test(`${p}: invalid local inputs have no side effects`, async t => {
  const f=await fixture(t);
  for(const patch of [{id:''},{id:'  '},{id:2},{address:''},{address:' '},{address:null},{grams:0},{grams:-1},{grams:1.5},{grams:Number.MAX_SAFE_INTEGER+1},{grams:'2'}])
    await assert.rejects(async()=>f.app.book({...input(p),...patch}),Error);
  assert.throws(()=>f.app.detail('missing'),Error);
  await assert.rejects(async()=>f.app.cancel('missing'),Error);
  assert.equal(f.alpha.requests.length+f.beta.requests.length,0);
 });
 test(`${p}: unsuccessful bookings reject without reserving id or retry`, async t => {
  const f=await fixture(t),srv=f[p];
  const good=booking(p);
  const failures=[{status:503,body:{}},{status:202,body:good.body},{status:good.status,raw:'invalid-json'},{status:good.status,body:{}},{status:good.status,body:null},{status:good.status,body:p==='alpha'?{accepted:false,shipmentId:'x'}:{ok:false,error:'capacity'}},{status:good.status,body:p==='alpha'?{accepted:true,shipmentId:''}:{ok:true,job:{code:''}}},{status:good.status,body:p==='alpha'?{accepted:true,shipmentId:1}:{ok:true,job:{code:1}}},{drop:true}];
  for(const failure of failures){srv.set(failure);const n=srv.requests.length;await assert.rejects(async()=>f.app.book(input(p)),Error);assert.equal(srv.requests.length,n+1);assert.throws(()=>f.app.detail('one'),Error);}
  srv.set(good);assert.deepEqual(await f.app.book(input(p)),expected(p));
 });
 test(`${p}: failed cancellations preserve booked record without retry`, async t => {
  const f=await fixture(t),srv=f[p];srv.set(booking(p));await f.app.book(input(p));
  const failures=[{status:503,body:{}},{status:p==='alpha'?200:204,body:{}},{drop:true}];
  if(p==='beta') failures.push({status:200,raw:'invalid-json'},{status:200,body:{ok:false}},{status:200,body:{}},{status:200,body:null});
  for(const failure of failures){srv.set(failure);const n=srv.requests.length;await assert.rejects(async()=>f.app.cancel('one'),Error);assert.equal(srv.requests.length,n+1);assert.deepEqual(f.app.detail('one'),expected(p));}
  srv.set(cancellation(p));assert.deepEqual(await f.app.cancel('one'),expected(p,'one','cancelled'));
 });
}
test('instances have independent records and minimum valid grams is accepted',async t=>{
 const f=await fixture(t);f.alpha.set(booking('alpha'));await f.app.book({...input('alpha'),grams:1});
 const second=createApp({alphaUrl:f.alpha.url,alphaToken:'alpha-secret'});assert.throws(()=>second.detail('one'),Error);
 assert.equal(f.app.detail('one').grams,1);
});
if(expanded) {
 test('default Alpha, mixed-provider history, global uniqueness and stable cancellation routing',async t=>{
  const f=await fixture(t);f.alpha.set(booking('alpha'));f.beta.set(booking('beta'));
  const a=input('alpha','old');delete a.provider;await f.app.book(a);
  await f.app.book(input('beta','new'));
  await assert.rejects(async()=>f.app.book(input('beta','old')),Error);
  f.alpha.set(cancellation('alpha'));f.beta.set(cancellation('beta'));
  await f.app.cancel('old');await f.app.cancel('new');
  assert.equal(f.alpha.requests.length,2);assert.equal(f.beta.requests.length,2);
  assert.deepEqual(f.app.detail('old'),expected('alpha','old','cancelled'));
  assert.deepEqual(f.app.detail('new'),expected('beta','new','cancelled'));
 });
 test('invalid supplied provider fails before network',async t=>{
  const f=await fixture(t);
  for(const provider of ['gamma','',null,undefined,1]) await assert.rejects(async()=>f.app.book({...input('alpha'),provider}),Error);
  assert.equal(f.alpha.requests.length+f.beta.requests.length,0);
 });
}
