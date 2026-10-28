import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const authority=readFileSync('verification/view-camera-restore.check-items.json');assert.equal(createHash('sha256').update(authority).digest('hex'),'0eda233ebe2b1cf808dd6fd6a8546cdb1aa808715389d458b1ac4581cbb845cc','independent camera CheckItem changed');assert.equal(JSON.parse(authority).checks[0].id,'VIEW-CAMERA-RESTORE-001');
const code=(await build({entryPoints:['src/viewer-shell.ts'],bundle:true,write:false,format:'iife',globalName:'Shell',loader:{'.css':'empty'}})).outputFiles[0].text;
function boot(query,current){
 const w=new JSDOM('<div id="app"><header><button id="node-list-toggle">Left</button><button id="drawer">Right</button></header><div class="tab-strip"><nav id="tabs"></nav></div><div class="workspace"><aside id="node-list-drawer" hidden></aside><main></main></div></div>',{url:'https://viewer.test/?view=business'+query,runScripts:'outside-only'}).window;
 const camera={positions:{activity:[42,91]},selected:'activity',scroll:[171,303],zoom:1.2,viewInset:[500,425]},original=structuredClone(camera),calls=[];
 w.eval(code+';globalThis.Shell=Shell;');const context={key:'document',viewKey:'saved',activities:[{id:'activity',name:'Activity'},{id:'other',name:'Other'}],objects:[{id:'object',name:'Object'}],views:[{key:'saved',name:'Saved',...current}]};
 const navigate=(type,id)=>{calls.push([type,id]);camera.scroll=[0,0];camera.viewInset=[0,0];context.views[0]={key:'saved',name:'Saved',...(type==='activity'?{activity:id}:type==='object'?{object:id}:{})};};
 const shell=w.Shell.installViewerShell(w.document.querySelector('#app'),{capture(){},business:()=>context,openActivity:id=>navigate('activity',id),openObject:id=>navigate('object',id),openOverview:()=>navigate('overview',''),activateView(){},statePanel(){},closeLegacyList(){},refresh(){}});shell.syncDocument();return{w,camera,original,calls};
}
for(const [query,view] of [['&activity=activity',{activity:'activity'}],['&object=object',{object:'object'}],['',{}]]){const t=boot(query,view);try{assert.deepEqual(t.calls,[],'restoring the same view must not invoke navigation');assert.deepEqual(t.camera,t.original,'saved camera and positions stay untouched');}finally{t.w.close();}}
for(const [query,view,expected] of [['&activity=other',{activity:'activity'},['activity','other']],['&object=object',{activity:'activity'},['object','object']],['',{activity:'activity'},['overview','']]]){const t=boot(query,view);try{assert.deepEqual(t.calls,[expected],'a different route still navigates exactly once');}finally{t.w.close();}}
console.log('VIEW-CAMERA-RESTORE-001: same Activity/Object/overview preserves saved camera; a different URL still navigates. Native Chromium save/reload remains required.');
