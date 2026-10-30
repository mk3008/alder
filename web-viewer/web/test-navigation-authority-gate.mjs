import assert from 'node:assert/strict';
import {baselineBytes,assertAuthority,assertCoverage,expectedCases,frozenAuthorities,assertAuthorities} from './navigation-authority-gate.mjs';
const frozen=baselineBytes(),pass=expectedCases(frozen).map(c=>({...c,status:'pass'}));
assertAuthority(frozen,frozen);assertCoverage(pass,frozen);
for(const mutate of [a=>a.checks.shift(),a=>a.checks[0].domains.pop()]){const changed=JSON.parse(frozen);mutate(changed);assert.throws(()=>assertAuthority(JSON.stringify(changed),frozen),/authority changed/);}
assert.throws(()=>assertAuthority(Buffer.alloc(0),frozen),/authority changed/);
assert.throws(()=>assertCoverage(pass.slice(1),frozen),/coverage mismatch/);
assert.throws(()=>assertCoverage([...pass,pass[0]],frozen),/duplicate/);
const files=frozenAuthorities(),read=path=>files.get(path);assertAuthorities(files,read);
const upstream=[...files.keys()].find(path=>path!=='verification/check-items.json');assert(upstream);
// Check Items stay byte-identical while only the upstream requirement is inverted.
const changed=read(upstream).toString().replace('表示しない','表示する');assert.notEqual(changed,read(upstream).toString(),'negative must alter the actual upstream requirement');
assert.throws(()=>assertAuthorities(files,path=>path===upstream?changed:read(path)),/authority changed/);
assert.throws(()=>assertAuthorities(files,path=>{if(path===upstream)throw Error('missing');return read(path);}),/authority deleted/);
console.log('PASS upstream authority: upstream-only reversal and deletion rejected');
console.log('PASS frozen authority: removed ID/domain/file and missing/duplicate result rejected');
