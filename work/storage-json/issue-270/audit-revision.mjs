// Compare the research revision against the previously reviewed immutable commit.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {validate} from './core.mjs';
const dir=fileURLToPath(new URL('./',import.meta.url));
const previous='b9c5d7e4a738bfa4b363fa4246129abef76a99b6';
const result=spawnSync('git',['show',previous+':work/storage-json/issue-270/fixtures/purchase.json'],{encoding:'utf8'});
assert.equal(result.status,0,result.stderr);
const old=JSON.parse(result.stdout),text=fs.readFileSync(dir+'fixtures/purchase.json','utf8'),now=JSON.parse(text);
validate(now);
assert.deepEqual(now.documents,[old.documents[0],old.documents[2]]);
assert.deepEqual(now.externalDocuments,[{id:old.documents[1].id,kind:'businessDesign',revision:old.documents[1].revision,activities:old.documents[1].activities.map(({id,name})=>({id,name}))}]);
assert.deepEqual(now.sources,old.archives.map(({documentId,revision,sha256})=>({documentId,revision,sha256})));
assert.ok(!Object.hasOwn(now,'archives'));
const after=Buffer.byteLength(text),before=Buffer.byteLength(result.stdout);
fs.writeFileSync(dir+'results/archive-removal.json',JSON.stringify({previousCommit:previous,formatVersionBefore:old.formatVersion,formatVersionAfter:now.formatVersion,
 currentBusinessDesignUnchanged:true,checkPayloadAndBasedOnUnchanged:true,externalCatalogOnlyIDsAndActivityLabels:true,provenanceDigestsUnchanged:true,
 fixtureBytes:{before,after,reduction:before-after,percent:100*(before-after)/before},
 historicalCodexTrials:'edits/* unchanged; no new LLM experiment',
 limits:['External catalog checks presence, kind and revision only; does not establish historical business meaning or approval','Source hash verification requires separately retained input bytes']},null,2)+'\n');
console.log({before,after,reduction:before-after});
