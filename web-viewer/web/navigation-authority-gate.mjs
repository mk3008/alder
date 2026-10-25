// Baseline is a pre-loop Git object, not expected values copied into a test.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {posix} from 'node:path';
export const baselineCommit='55d69577d0cf2faf54f5ab49c1e2495a7d43698e';
export const authorityPath='verification/check-items.json';
export const baselineBytes=(path=authorityPath)=>execFileSync('git',['show',`${baselineCommit}:web-viewer/${path}`]);
// Resolve the upstream authority from the frozen Check Item, never the candidate.
export function frozenAuthorities(){const checks=baselineBytes(),requirement=JSON.parse(checks).requirement.split('#')[0],path=posix.normalize(posix.join(posix.dirname(authorityPath),requirement));assert(path&&!path.startsWith('../')&&!posix.isAbsolute(path),'upstream authority must stay in web-viewer');return new Map([[authorityPath,checks],[path,baselineBytes(path)]]);}
export function assertAuthorities(files,read){for(const [path,frozen] of files){let actual;try{actual=read(path);}catch{assert.fail(`B authority deleted or unavailable: ${path}; stop B`);}assert(Buffer.from(actual).equals(frozen),`B authority changed: ${path}; stop B; resolve requirements outside B`);}}
export const digest=raw=>createHash('sha256').update(raw).digest('hex');
export function assertAuthority(raw,frozen){assert(Buffer.from(raw).equals(Buffer.from(frozen)),'B authority changed or deleted: stop B; resolve requirements outside B');}
export function expectedCases(frozen){return JSON.parse(frozen).checks.flatMap(c=>c.domains.flatMap(domain=>c.selections.map(selection=>({id:c.id,domain,selection}))));}
const key=r=>JSON.stringify([r.id,r.domain,r.selection]);
export function assertCoverage(results,frozen){const expected=expectedCases(frozen).map(key).sort(),actual=results.map(key).sort();assert.equal(new Set(actual).size,actual.length,'duplicate verification result');assert.deepEqual(actual,expected,'frozen guarantee/case coverage mismatch');assert(results.every(r=>r.status==='pass'||r.status==='fail'),'unexecuted case');}
