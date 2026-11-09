import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {reviewSamples} from '../../work/361-beta-fixes/prepare-review-samples.mjs';
import {reviewDisplayCopy,copy} from '../../work/361-copy-separation/prepare-display-copy.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const frozenBytes=readFileSync('../work/361-copy-separation/frozen-sha256.json');
assert.equal(hash(frozenBytes),'021821847a3be9d24779eab2428ab39a57a2b9f685c5b57aff9841d0a06c648d','fe262cf3 frozen manifest is immutable');
const frozen=JSON.parse(frozenBytes);
for(const [file,digest]of Object.entries(frozen))assert.equal(hash(readFileSync('../'+file)),digest,file);
const original=reviewSamples(),revised=reviewDisplayCopy(),model=revised.documents.find(d=>d.kind==='conceptModel');
const restored=structuredClone(revised),restore=restored.documents.find(d=>d.kind==='conceptModel');
for(const target of [restore.concepts.find(c=>c.id===copy.conceptId),restore.presentation.subsystemViews.nodes.find(n=>n.id===copy.nodeId)]){
 assert.equal(target.description,copy.description);target.description=copy.original;
}
assert.deepEqual(restored,original,'only the two exact descriptions differ from the beta copy');
const compiled=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="detail"></div>',{runScripts:'outside-only'}).window;
try{
 w.eval(compiled+';globalThis.Explorer=Explorer;');const panel=w.document.querySelector('#detail');
 const render=m=>w.Explorer.renderStructureDetails(panel,m,{kind:'structure',conceptId:copy.conceptId,hideLegacy:false});
 render(model);assert(panel.textContent.includes(copy.description));assert(!panel.textContent.includes('倒れたものを立て直す'));
 render(original.documents.find(d=>d.kind==='conceptModel'));assert(panel.textContent.includes(copy.original),'generic Viewer does not suppress original input');
 const generic=structuredClone(model);generic.concepts.find(c=>c.id===copy.conceptId).description='開発指示・会話・レビューという語を含む通常の説明。';render(generic);assert(panel.textContent.includes('開発指示・会話・レビューという語を含む通常の説明。'));
}finally{w.close();}
console.log(JSON.stringify({checks:['COPY-001','COPY-002','COPY-003'],frozenFiles:Object.keys(frozen).length,exactDescriptionChanges:2,otherDataUnchanged:true,genericTextPreserved:true}));
