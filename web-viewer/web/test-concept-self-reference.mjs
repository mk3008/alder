import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';

registerHooks({resolve(s,c,n){if((s.startsWith('./')||s.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(s)){try{return n(s+'.ts',c)}catch{}try{return n(s+'.js',c)}catch{}}return n(s,c)}});
const {routeER}=await import('../src/concept-routing.js');
const {conceptDiagram}=await import('../src/concept-layout.js');
const {conceptNeighborhood}=await import('../src/concept-neighborhood.js');
const {parseDocument}=await import('../src/document-input.ts');
const {createConceptViews}=await import('../src/concept-views.ts');
const authorityBytes=readFileSync('verification/concept-self-reference.check-items.json');
assert.equal(createHash('sha256').update(authorityBytes).digest('hex'),'8c98cf18201acfd718439adba8b9d3ef9b8b31fe6e3323fda3d69817b9ea13d3');
const authority=JSON.parse(authorityBytes);
assert.deepEqual(authority.checks.map(x=>x.id),['CONCEPT-SELF-001','CONCEPT-SELF-002','CONCEPT-SELF-003']);

const box={x:100,y:100,w:240,h:140},boxes=new Map([['a',box]]);
const loops=routeER(boxes,[['a','a','0..N','0..1','reference'],['a','a','1','1','reference']]);
assert.equal(loops.routes.length,2,'both authored self relationships remain');
for(const route of loops.routes){
 assert(!route.unrouted,'self-reference is drawn');assert.equal(route.points.length,5,'the loop has three corners');
 assert.equal((route.d.match(/Q/g)||[]).length,3,'all three corners are rounded');
 assert.equal(route.ports[0].side,'top');assert.equal(route.ports[1].side,'right');
 const [a,p,q,r,z]=route.points;
 assert.equal(a.y,box.y);assert.equal(z.x,box.x+box.w);assert(p.y<box.y&&q.y===p.y&&q.x>box.x+box.w&&r.x===q.x&&r.y===z.y);
 assert.deepEqual([route.from,route.to],['a','a']);
}
assert.equal(loops.labels.length,4,'each loop keeps both endpoint counts');
assert(!loops.labels.some(item=>item.conflict),'loop endpoint counts stay readable');
assert.notDeepEqual(loops.routes[0].ports.map(p=>p.p),loops.routes[1].ports.map(p=>p.p),'multiple loops use distinct ports');

const raw=readFileSync('../business-design/alder/json-structure-review.json','utf8'),pkg=JSON.parse(raw),model=pkg.documents.find(d=>d.kind==='conceptModel');
model.relations.push({id:'sample-self-step',fromConceptId:'fmt-step',toConceptId:'fmt-step',fromPerTarget:'0..N',toPerSource:'0..1',condition:'自己参照の表示確認用',reviewState:'未レビュー',sourceRefs:[],fromLabel:'0..N',toLabel:'0..1',kind:'reference'});
const context=parseDocument(JSON.stringify(pkg)).model,views=createConceptViews({business:context.business,model:context.concepts[0]});
const view=conceptNeighborhood(Object.keys(views.tables),views.edges,'fmt-step'),sizes=new Map(view.ids.map(id=>[id,{w:Math.max(220,views.tables[id].name.length*14+64,...views.tables[id].fields.map(([,name])=>name.length*14+24)),h:44+views.tables[id].fields.length*25}]));
const diagram=conceptDiagram(view.ids,view.edges,sizes),self=diagram.routing.routes.find(r=>r.from==='fmt-step'&&r.to==='fmt-step');
assert(self&&!self.unrouted,'the synthetic self relation survives JSON loading and the actual detail view');
assert.equal(readFileSync('../business-design/alder/json-structure-review.json','utf8'),raw,'the source JSON is not modified');
const sample=parseDocument(readFileSync('public/examples/concept-self-reference.json','utf8')).model,sampleGraph=createConceptViews({business:sample.business,model:sample.concepts[0]}).overviewGraph();
assert.equal(sampleGraph.ids.length,1);assert.match(sampleGraph.tables[sampleGraph.ids[0]].name,/自己参照の表示例/);assert.equal(sampleGraph.edges[0][0],sampleGraph.edges[0][1]);

function hits(a,b,rect,pad=12){
 const x=rect.x-pad,y=rect.y-pad,w=rect.w+pad*2,h=rect.h+pad*2;
 const overlap=(a,b,c,d)=>Math.min(Math.max(a,b),Math.max(c,d))>Math.max(Math.min(a,b),Math.min(c,d));
 return a.x===b.x?a.x>x&&a.x<x+w&&overlap(a.y,b.y,y,y+h):a.y===b.y&&a.y>y&&a.y<y+h&&overlap(a.x,b.x,x,x+w);
}
const baseContext=parseDocument(raw).model,baseViews=createConceptViews({business:baseContext.business,model:baseContext.concepts[0]});
const baseView=conceptNeighborhood(Object.keys(baseViews.tables),baseViews.edges,'fmt-step'),baseSizes=new Map(baseView.ids.map(id=>[id,{w:Math.max(220,baseViews.tables[id].name.length*14+64,...baseViews.tables[id].fields.map(([,name])=>name.length*14+24)),h:44+baseViews.tables[id].fields.length*25}]));
const base=conceptDiagram(baseView.ids,baseView.edges,baseSizes);
for(const route of base.routing.routes)for(const [id,other]of base.boxes)if(id!==route.from&&id!==route.to)for(const {a,b}of route.segments)assert(!hits(a,b,other),`${route.from} -> ${route.to} needs clearance from ${id}`);
function crosses(s,t){const sv=s.a.x===s.b.x,tv=t.a.x===t.b.x;if(sv===tv)return false;const v=sv?s:t,h=sv?t:s,x=v.a.x,y=h.a.y;return x>Math.min(h.a.x,h.b.x)&&x<Math.max(h.a.x,h.b.x)&&y>Math.min(v.a.y,v.b.y)&&y<Math.max(v.a.y,v.b.y);}
const near=base.routing.routes.find(r=>r.from==='fmt-exchange'&&r.to==='fmt-step');
for(const id of ['fmt-order','fmt-dependency']){const far=base.routing.routes.find(r=>r.from===id&&r.to==='fmt-step');assert(near&&far);assert(!near.segments.some(a=>far.segments.some(b=>crosses(a,b))),`${id} must not cross the nearby Exchange reference`);}
const upward=['fmt-data','fmt-decision','fmt-row'].map(id=>base.routing.routes.find(r=>r.from==='fmt-step'&&r.to===id));
assert(upward.every(Boolean),'the three reference relationships in the supplied screenshot are present');
for(let i=0;i<upward.length;i++)for(let j=0;j<i;j++)assert(!upward[i].segments.some(a=>upward[j].segments.some(b=>crosses(a,b))),'reference ports toward Data / Decision / DecisionRow must avoid unnecessary crossings');
const activity=conceptNeighborhood(Object.keys(baseViews.tables),baseViews.edges,'fmt-activity'),activitySizes=new Map(activity.ids.map(id=>[id,{w:Math.max(220,baseViews.tables[id].name.length*14+64,...baseViews.tables[id].fields.map(([,name])=>name.length*14+24)),h:44+baseViews.tables[id].fields.length*25}])),activityDiagram=conceptDiagram(activity.ids,activity.edges,activitySizes);
assert(activityDiagram.routing.routes.every(r=>!r.unrouted&&!r.shapeObstacles.length),'1:1 cards are reordered to avoid lines behind another card when possible');

const code=(await build({entryPoints:['src/concept-canvas.js'],bundle:true,write:false,format:'iife',loader:{'.css':'empty'}})).outputFiles[0].text;
const w=new JSDOM(readFileSync('concept.html','utf8'),{url:'https://viewer.test/concept.html',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.HTMLCanvasElement.prototype.getContext=()=>({font:'',measureText:v=>({width:v.length*14})});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollTo=function(x,y){this.scrollLeft=x;this.scrollTop=y;};w.SVGElement.prototype.focus=()=>{};
try{
 w.localStorage.setItem('alder-concept-canvas-v9:/concept.html:self-example:overview',JSON.stringify({positions:{a:{x:100,y:5}},zoom:1,locked:true}));
 w.eval(code);const graph={ids:['a'],tables:{a:{name:'自己参照の例',fields:[['','項目1'],['','項目2'],['','項目3']]}},edges:Array.from({length:4},()=>['a','a','0..N','0..1','reference']),regions:[],handoffs:[],fieldLinks:[]};
 w.dispatchEvent(new w.MessageEvent('message',{origin:w.location.origin,source:w.parent,data:{type:'alder-concept-data',graph,documentKey:'self-example',viewKey:'overview',focus:'a'}}));
 const wires=[...w.document.querySelectorAll('.wire')];assert.equal(wires.length,4);for(const wire of wires){assert.equal(wire.dataset.unrouted,'false');assert.equal((wire.getAttribute('d').match(/Q/g)||[]).length,3);assert(wire.classList.contains('review-related'),'selection highlights the self relation');}
 assert.equal(w.document.querySelectorAll('.endpoint-count').length,8);
 assert.equal(w.document.querySelector('[data-concept-open="a"]'),null,'the current-detail navigation link remains suppressed');
 const viewBox=w.document.querySelector('svg[aria-label]').getAttribute('viewBox').split(/\s+/).map(Number);
 const minWireY=Math.min(...wires.flatMap(wire=>(wire.getAttribute('d').match(/-?\d+(?:\.\d+)?/g)||[]).map(Number).filter((_,i)=>i%2===1)));
 assert(viewBox[1]<=minWireY,'even an outer loop above a restored card remains inside the canvas');
}finally{w.close();}
console.log('CONCEPT-SELF-001..003: self loops, selection, bounds, line clearance and endpoint crossings verified.');
