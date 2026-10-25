import assert from 'node:assert/strict';
import {baselineBytes,assertAuthority,assertCoverage,expectedCases} from './navigation-authority-gate.mjs';
const frozen=baselineBytes(),pass=expectedCases(frozen).map(c=>({...c,status:'pass'}));
assertAuthority(frozen,frozen);assertCoverage(pass,frozen);
for(const mutate of [a=>a.checks.shift(),a=>a.checks[0].domains.pop()]){const changed=JSON.parse(frozen);mutate(changed);assert.throws(()=>assertAuthority(JSON.stringify(changed),frozen),/authority changed/);}
assert.throws(()=>assertAuthority(Buffer.alloc(0),frozen),/authority changed/);
assert.throws(()=>assertCoverage(pass.slice(1),frozen),/coverage mismatch/);
assert.throws(()=>assertCoverage([...pass,pass[0]],frozen),/duplicate/);
console.log('PASS frozen authority: removed ID/domain/file and missing/duplicate result rejected');
