import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root='../work/viewer-json/issue-274/layout-regression/';
const hashes=JSON.parse(readFileSync(root+'protected-sources.json','utf8'));
for(const [path,expected] of Object.entries(hashes.sha256))assert.equal(createHash('sha256').update(readFileSync('../'+path)).digest('hex'),expected,'existing rendering source must remain byte-identical: '+path);
