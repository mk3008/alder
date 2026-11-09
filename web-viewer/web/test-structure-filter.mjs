import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

// Independent examples of STRUCTURE-003, STRUCTURE-COMPAT-002,
// STRUCTURE-CLASS-ONLY-002 and BETA-004. Expected paths are authored here,
// rather than computed with either the old or the new filter algorithm.
const baseline=process.argv.includes('--baseline');
const source=baseline?execFileSync('git',['show','7ebe732f6ccc1676d591d564d95b711e473c60a3:web-viewer/src/structure-explorer.ts'],{encoding:'utf8'}):readFileSync('src/structure-explorer.ts','utf8');
const code=(await build({stdin:{contents:source,resolveDir:resolve('src'),sourcefile:'structure-explorer.ts',loader:'ts'},bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const node=(id,name=id)=>({id,name,information:[],description:'',reason:'',subsystemId:'',businessObjectIds:[],activityLinks:[],sourceRefs:[]});
const edge=(from,to,kind='down')=>({id:from+'-'+to,fromConceptId:from,toConceptId:to,kind,fromLabel:'1',toLabel:'0..N',condition:'',sourceRefs:[]});
const model={id:'filter-example',revision:'1',subsystems:[],concepts:[node('root'),node('branch'),node('deep','deepword'),node('legacy'),node('legacy-leaf','secretword'),node('review'),node('review-leaf','reviewword')],relations:[edge('root','branch'),edge('branch','deep'),edge('deep','root','reference'),edge('root','legacy'),edge('legacy','legacy-leaf'),edge('root','review'),edge('review','review-leaf')],meta:{compatibilityReview:{concepts:{legacy:{kind:'legacy',reason:'preserved old branch'},review:{kind:'needs-review',reason:'undecided, still visible'}}}}};
const before=JSON.stringify(model);
const w=new JSDOM('<div id="host"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');
 const host=w.document.querySelector('#host');
 w.Explorer.renderStructureExplorer(host,model,{rootId:'root'});
 const search=host.querySelector('input[type=search]'),toggle=host.querySelector('input[type=checkbox]');
 const query=value=>{search.value=value;search.dispatchEvent(new w.Event('input'));};
 const visible=()=>[...new Set([...host.querySelectorAll('[data-concept-id]')].filter(item=>!item.closest('[hidden]')).map(item=>item.dataset.conceptId))].sort();
 const status=()=>host.querySelector('.structure-filter-empty[role=status]');
 const original=host.querySelector('.structure-root'),originalRow=original.querySelector('summary');originalRow.click();
 query('deepword');assert.deepEqual(visible(),['branch','deep','root']);assert(status().hidden);
 query('secretword');assert.deepEqual(visible(),[],'matching grandchild cannot cross its hidden legacy parent');assert(!status().hidden);
 toggle.checked=false;toggle.dispatchEvent(new w.Event('change'));assert.deepEqual(visible(),['legacy','legacy-leaf','root']);assert(status().hidden);
 toggle.checked=true;toggle.dispatchEvent(new w.Event('change'));assert.deepEqual(visible(),[]);assert(!status().hidden);
 query('reviewword');assert.deepEqual(visible(),['review','review-leaf','root'],'needs-review stays searchable');
 query('absentword');assert.deepEqual(visible(),[]);assert(!status().hidden);
 query('');assert.equal(host.querySelector('.structure-root'),original,'search restores original DOM and expansion state');assert(originalRow.classList.contains('structure-selected'));assert(status().hidden);
 query('deepword');assert.deepEqual(visible(),['branch','deep','root'],'new filter invocation has no stale visibility');query('');
 assert.equal(JSON.stringify(model),before);
 console.log(JSON.stringify({test:'structure-filter',baseline,cases:['deep-match','legacy-barrier','legacy-off','legacy-on','needs-review','zero','restore','repeat','model-preserved'],status:'pass'}));
}finally{w.close();}
