import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validate} from './core.mjs';

const source=JSON.parse(readFileSync(new URL('./examples/molkky-decisions-v07.json',import.meta.url),'utf8'));
const steps=pkg=>pkg.documents[0].activities[0].procedure.steps;
const byId=(pkg,id)=>steps(pkg).find(step=>step.id===id);
const copy=()=>structuredClone(source);

test('JSON-STRUCT-004: pairedStepId is optional, asymmetric, and validates a declared exchange',()=>{
 const unpaired=copy();byId(unpaired,'receive').exchange.pairedStepId=null;byId(unpaired,'reply').exchange.pairedStepId=null;assert.doesNotThrow(()=>validate(unpaired));
 const oneSided=copy();byId(oneSided,'receive').exchange.pairedStepId=null;assert.doesNotThrow(()=>validate(oneSided));
 const wrongType=copy();byId(wrongType,'receive').exchange.pairedStepId='validate';assert.throws(()=>validate(wrongType),/Request\/Response mismatch/);
 const samePhase=copy();byId(samePhase,'reply').exchange.phase='request';assert.throws(()=>validate(samePhase),/Request\/Response mismatch/);
 const swapped=copy();byId(swapped,'receive').exchange.phase='response';byId(swapped,'reply').exchange.phase='request';assert.doesNotThrow(()=>validate(swapped),'phase is distinct from input/output direction');
});

test('JSON-STRUCT-004: exchange shape alone cannot decide which of two valid pairs reflects the interview',()=>{
 const make=cross=>{const pkg=copy(),list=steps(pkg),first=byId(pkg,'receive'),response=byId(pkg,'reply'),other=structuredClone(first),otherResponse=structuredClone(response);
  other.id='receive-2';otherResponse.id='reply-2';first.exchange.pairedStepId=cross?'reply-2':'reply';other.exchange.pairedStepId=cross?'reply':'reply-2';
  response.exchange.pairedStepId=cross?'receive-2':'receive';otherResponse.exchange.pairedStepId=cross?'receive':'receive-2';list.splice(1,0,other);list.push(otherResponse);return pkg;};
 const first=make(false),second=make(true);assert.doesNotThrow(()=>validate(first));assert.doesNotThrow(()=>validate(second));
 assert.notEqual(byId(first,'receive').exchange.pairedStepId,byId(second,'receive').exchange.pairedStepId);
 const manyToOne=make(false);byId(manyToOne,'receive-2').exchange.pairedStepId='reply';assert.doesNotThrow(()=>validate(manyToOne),'multiple steps may reference the same matching response');
});
