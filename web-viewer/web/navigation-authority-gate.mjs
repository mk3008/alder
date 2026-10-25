// Baseline is a pre-loop Git object, not expected values copied into a test.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
export const baselineCommit='55d69577d0cf2faf54f5ab49c1e2495a7d43698e';
export const authorityPath='verification/check-items.json';
export const baselineBytes=()=>execFileSync('git',['show',`${baselineCommit}:web-viewer/${authorityPath}`]);
export const digest=raw=>createHash('sha256').update(raw).digest('hex');
export function assertAuthority(raw,frozen){assert(Buffer.from(raw).equals(Buffer.from(frozen)),'B authority changed or deleted: stop B; resolve requirements outside B');}
export function expectedCases(frozen){return JSON.parse(frozen).checks.flatMap(c=>c.domains.flatMap(domain=>c.selections.map(selection=>({id:c.id,domain,selection}))));}
const key=r=>JSON.stringify([r.id,r.domain,r.selection]);
export function assertCoverage(results,frozen){const expected=expectedCases(frozen).map(key).sort(),actual=results.map(key).sort();assert.equal(new Set(actual).size,actual.length,'duplicate verification result');assert.deepEqual(actual,expected,'frozen guarantee/case coverage mismatch');assert(results.every(r=>r.status==='pass'||r.status==='fail'),'unexecuted case');}
