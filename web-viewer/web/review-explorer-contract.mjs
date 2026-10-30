// Read-only verification against the Check Items committed before implementation.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const path='verification/explorer-object-detail.check-items.json',expectedHash='20834563a1a2285a6e6f78adde9cc5df315de2185664f56c883c20dff20586ff';
const hash=value=>createHash('sha256').update(value).digest('hex'),raw=readFileSync(path);
assert.equal(hash(raw),expectedHash,'independent Check Item authority changed');
const authority=JSON.parse(raw),coverage=new Map([
 ['EXPLORER-TREE-001',['web/test-viewer-shell.mjs']],
 ['EXPLORER-TREE-002',['web/test-viewer-shell.mjs']],
 ['OBJECT-DETAIL-001',['web/test-activities.mjs','web/test-viewer-shell.mjs']],
 ['OBJECT-DETAIL-002',['web/test-viewer-shell.mjs','web/test-graph-png.mjs']],
 ['OBJECT-DETAIL-003',['web/test-activities.mjs','web/test-viewer-shell.mjs','web/test-editor-save-integration.mjs']]
]);
assert.equal(authority.format,'viewer-verification/1');assert.deepEqual(new Set(authority.checks.map(c=>c.id)),new Set(coverage.keys()));assert.equal(authority.checks.length,coverage.size);
for(const check of authority.checks)for(const field of ['condition','guarantee','reason','verification'])assert(check[field]?.trim(),`${check.id} lacks ${field}`);
for(const file of new Set([...coverage.values()].flat())){
 const result=spawnSync(process.execPath,['--experimental-strip-types',file],{encoding:'utf8',timeout:120000});
 assert.equal(result.status,0,`${file} failed: ${result.error??''}\n${result.stdout}\n${result.stderr}`);
}
assert.equal(hash(readFileSync(path)),expectedHash,'authority changed during verification');
console.log(JSON.stringify({authority:path,sha256:expectedHash,results:authority.checks.map(c=>({id:c.id,status:'pass',evidence:coverage.get(c.id)}))},null,2));
