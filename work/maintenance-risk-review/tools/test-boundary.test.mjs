// Post-hoc evaluator diagnostic. Imports unchanged experiment-2 snapshots.
import test from 'node:test';
import assert from 'node:assert/strict';
const runs = new URL('../../maintenance-boundary/runs/', import.meta.url);
const input = {id:'one',address:' Tokyo ',grams:1250,provider:'beta'};
const config = {alphaUrl:'http://unreachable.invalid',alphaToken:'test-alpha',betaUrl:'http://unreachable.invalid',betaToken:'test-beta'};
const guardError = new Error('Diagnostic fetch guard: no network is permitted');
function guard(t) {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw guardError; };
  t.after(() => { globalThis.fetch = original; });
  return () => calls;
}
for (const arm of ['A','B','C','D']) {
  test(`${arm}: public-entry validation precedes transport; valid book reaches fetch`, async t => {
    const count = guard(t);
    const {createApp} = await import(new URL(`${arm}/S1/source/entry.mjs`,runs));
    const app = createApp(config);
    await assert.rejects(async () => app.book({...input,grams:0}), Error);
    assert.equal(count(),0);
    await assert.rejects(async () => app.book(input), error => error === guardError);
    assert.equal(count(),1);
    assert.throws(() => app.detail('one'), Error);
    t.diagnostic(JSON.stringify({arm,seam:'public createApp',invalid_fetch_calls:0,valid_fetch_calls:count(),valid_booking_completed:false,state_written:false}));
  });
}
test('C: exported booking slice still requires transport, despite direct slice access', async t => {
  const count = guard(t);
  const {bookShipment} = await import(new URL('C/S1/source/features/book.mjs',runs));
  const records = new Map();
  await assert.rejects(async () => bookShipment({records,...config},input), error => error === guardError);
  assert.equal(count(),1); assert.equal(records.size,0);
  t.diagnostic(JSON.stringify({arm:'C',seam:'exported bookShipment',fetch_calls:count(),booking_completed:false}));
});
test('D: existing injected application seam exercises policy without HTTP or loader mocking', async t => {
  const count = guard(t);
  const {createBookingService} = await import(new URL('D/S1/source/booking.mjs',runs));
  const {createMemoryRecords} = await import(new URL('D/S1/source/memory-records.mjs',runs));
  const events = [];
  let failBook = false, failCancel = false;
  const providerError = new Error('simulated provider failure');
  function fake(provider) {
    return {
      async book(shipment) {
        events.push({operation:'book',provider,shipment:{...shipment}});
        if (failBook) throw providerError;
        return `${provider}/${shipment.id}`;
      },
      async cancel(trackingId) {
        events.push({operation:'cancel',provider,trackingId});
        if (failCancel) throw providerError;
      },
    };
  }
  const app = createBookingService({records:createMemoryRecords(),shipments:{alpha:fake('alpha'),beta:fake('beta')}});
  for (const patch of [{grams:0},{id:' '},{provider:'gamma'}])
    await assert.rejects(async () => app.book({...input,...patch}), Error);
  assert.equal(events.length,0);
  const alpha = await app.book({id:' old ',address:' Tokyo ',grams:1});
  const beta = await app.book({...input,id:' new '});
  assert.deepEqual(events.slice(0,2),[
    {operation:'book',provider:'alpha',shipment:{id:'old',address:'Tokyo',grams:1}},
    {operation:'book',provider:'beta',shipment:{id:'new',address:'Tokyo',grams:1250}},
  ]);
  assert.deepEqual(alpha,{id:'old',address:'Tokyo',grams:1,provider:'alpha',trackingId:'alpha/old',status:'booked'});
  assert.deepEqual(beta,{id:'new',address:'Tokyo',grams:1250,provider:'beta',trackingId:'beta/new',status:'booked'});
  alpha.status='bad';beta.address='bad';app.detail('old').status='bad';
  assert.equal(app.detail('old').status,'booked');assert.equal(app.detail('new').address,'Tokyo');
  await assert.rejects(async () => app.book({...input,id:'old'}),Error);
  assert.equal(events.length,2);
  failBook = true;
  await assert.rejects(async () => app.book({...input,id:'failed'}), error => error === providerError);
  assert.throws(() => app.detail('failed'), Error);
  failBook = false;
  await app.book({...input,id:'failed'}); // failed attempt did not reserve the ID
  const before = app.detail('old');
  failCancel = true;
  await assert.rejects(async () => app.cancel('old'), error => error === providerError);
  assert.deepEqual(app.detail('old'),before);
  failCancel = false;
  const cancelled = await app.cancel('old');
  assert.deepEqual(cancelled,{...before,status:'cancelled'});
  await app.cancel('new');
  assert.deepEqual(events.slice(-2),[
    {operation:'cancel',provider:'alpha',trackingId:'alpha/old'},
    {operation:'cancel',provider:'beta',trackingId:'beta/new'},
  ]);
  const n = events.length;
  await assert.rejects(async () => app.cancel('old'),Error);
  await assert.rejects(async () => app.cancel('unknown'),Error);
  assert.equal(events.length,n);
  assert.equal(count(),0);
  t.diagnostic(JSON.stringify({arm:'D',seam:'exported createBookingService with fake shipment operations',fetch_calls:count(),successful_bookings:3,successful_cancellations:2,validation_duplicate_and_repeat_guards:true,failure_atomicity:true,mixed_provider_routing:true,events}));
});
