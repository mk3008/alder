import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseDesign, validateGraph } from '../src/graph.ts';
// Preserve Python's lexical integer distinction for raw JSON contract inputs.
// JavaScript numbers alone cannot distinguish version 1 from version 1.0.
const cases=JSON.parse(readFileSync(new URL('./authorities/contract-cases.json',import.meta.url),'utf8'),(key,value,context)=>key==='version'&&context?.source&&!/^-?\d+$/.test(context.source)?NaN:value);
const failures=[];
for(const c of cases){let result, accepted=false;try{if(c.kind==='markdown')result=parseDesign(c.input).graph;else {validateGraph(c.input);result=c.input;}accepted=true;}catch{}try{assert.equal(accepted,c.accepted);if(accepted&&c.expected)assert.deepEqual(result,c.expected);}catch(e){failures.push(c.name+': '+e.message);}}
const poisoned=structuredClone(cases.find(c=>c.accepted&&c.kind==='graph').input);poisoned.relations=[{kind:'__proto__',from:'missing',to:'missing',label:'unsafe'}];assert.throws(()=>validateGraph(poisoned));
console.log(JSON.stringify({cases:cases.length,extraSafetyChecks:1,failures},null,2));assert.equal(failures.length,0);
