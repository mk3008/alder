import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
import {schema} from '../../tools/document_storage/schema.mjs';

registerHooks({resolve(s,c,n){if((s.startsWith('./')||s.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(s)){try{return n(s+'.ts',c)}catch{}try{return n(s+'.js',c)}catch{}}return n(s,c)}});
const {parseDocument}=await import('../src/document-input.ts');
const {createConceptViews}=await import('../src/concept-views.ts');
const {conceptDiagram}=await import('../src/concept-layout.js');
const {matrixPlan}=await import('../src/matrix-layout.ts');
const {routeER,sharedRun}=await import('../src/concept-routing.js');
const authority=readFileSync('verification/concept-compact-array.check-items.json','utf8');
assert.equal(createHash('sha256').update(authority).digest('hex'),'ebba79a625e8d258463e856aa104c157c6fb2e4e29cc4fee1a2670a6b0fc6fb7');
assert.deepEqual(JSON.parse(authority).checks.map(x=>x.id),['CONCEPT-COMPACT-001','CONCEPT-COMPACT-002','CONCEPT-ARRAY-001','CONCEPT-ARRAY-002']);
const pkg=JSON.parse(readFileSync('../business-design/alder/json-structure-review.json','utf8'));
const context=parseDocument(JSON.stringify(pkg)).model,model=context.concepts[0],mapping=new Map(model.meta.fieldMappings.map(x=>[x.informationId,x]));
const bd=schema.$defs.decisionBusinessDesign.properties, activity=bd.activities.items.properties;
const procedure=activity.procedure.properties,step=procedure.steps.items.properties;
const decision=activity.decisions.items.properties,axis=decision.axes.items.properties,row=decision.rows.items.properties;
const result=row.result.properties,exchange=step.exchange.anyOf.find(x=>x.properties?.kind?.enum?.includes('interaction')).properties;
const order=procedure.orderRules.items.anyOf.find(x=>x.properties?.kind?.enum?.includes('interchangeable')).properties;
const checks=schema.$defs.checkItems.properties;
const p07=schema.anyOf.find(x=>x.properties.formatVersion.enum.includes('0.7')).properties;
const arrayProperties={
 'fmt-package-field-4':p07.documents,'fmt-bd-field-3':bd.activities,'fmt-bd-field-4':bd.objects,'fmt-bd-field-5':bd.data,'fmt-bd-field-6':bd.relations,'fmt-bd-field-7':bd.exceptions,
 'fmt-activity-field-4':activity.decisions,'fmt-activity-field-5':activity.results,'fmt-procedure-field-1':procedure.steps,'fmt-procedure-field-2':procedure.orderRules,
 'fmt-step-field-2':step.whatDataIds,'fmt-step-field-5':step.decisionIds,'fmt-step-field-6':step.dependsOn,'fmt-order-field-3':order.stepIds,'fmt-exchange-field-5':exchange.dataIds,
 'fmt-object-field-2':bd.objects.items.properties.information,'fmt-data-field-2':bd.data.items.properties.items,'fmt-decision-field-3':decision.axes,'fmt-decision-field-3-2':decision.rows,
 'fmt-axis-field-2':axis.dataIds,'fmt-row-field-1-2':row.conditions,'fmt-row-field-3':row.checkRefs,'fmt-outcome-field-2':result.dataIds,'fmt-outcome-field-3':result.exceptionIds,
 'fmt-checkdoc-field-3':checks.items,'fmt-checkdoc-field-3-2':checks.index
};
const isArray=value=>value?.type==='array'||value?.anyOf?.some(isArray);
for(const [id,definition] of Object.entries(arrayProperties)){
 assert(isArray(definition),id+' is an array in the fixed 0.7 schema');assert.equal(mapping.get(id)?.valueType,'array',id+' is explicitly marked');
 assert.equal(mapping.get(id)?.nullable===true,!!definition.anyOf?.some(x=>x.type==='null'),id+' preserves nullability');
}
assert.deepEqual([...mapping.values()].filter(x=>x.valueType==='array').map(x=>x.informationId).sort(),Object.keys(arrayProperties).sort(),'no extra or missing array markers');
assert.equal(mapping.get('fmt-package-field-1').valueType,undefined,'scalar format is not labeled as an array');

const v=createConceptViews({business:context.business,model}),g=v.overviewGraph();
const sizes=new Map(g.ids.map(id=>[id,{w:Math.max(220,g.tables[id].name.length*14+64,...g.tables[id].fields.map(([,name,,type,nullable])=>(name+(type==='array'?(nullable==='nullable'?' ［配列・未決可］':' ［配列］'):'')).length*14+24)),h:44+g.tables[id].fields.length*25}]));
const graph={version:1,nodes:g.ids.map(id=>({id,type:'business',name:id,scope:true})),relations:g.edges.map(([from,to])=>({kind:'input',from,to,label:''}))};
const plan=matrixPlan(graph,g.ids),ordered=g.ids.slice().sort((a,b)=>plan.positions[a][1]-plan.positions[b][1]);
const degree=Math.max(1,...g.ids.map(id=>g.edges.filter(([a,b])=>a===id||b===id).length));
const widest=Math.max(0,...g.edges.flatMap(([, ,from,to])=>[from.length,to.length]).map(n=>n*8+10));
const oldStep=Math.max(96,64+36*Math.max(0,degree-1),22+24+widest/2+8),oldPositions=new Map();let y=40;
for(const id of ordered){oldPositions.set(id,{x:40+oldStep*plan.cells[id][0],y,...sizes.get(id)});y+=sizes.get(id).h+44;}
const before=routeER(oldPositions,g.edges),after=conceptDiagram(g.ids,g.edges,sizes);
// The old placement can no longer route every edge under the one-corner rule;
// include the old cards themselves when measuring its occupied width. This is
// a stricter bound than the former routed width for this fixture.
const oldWidth=Math.max(before.width,...[...oldPositions.values()].map(box=>box.x+box.w));
const newWidth=Math.max(after.routing.width,...[...after.boxes.values()].map(box=>box.x+box.w));
assert(newWidth<oldWidth-500,'the full model is materially narrower than the previous layout');
assert.equal(after.routing.routes.filter(r=>r.unrouted).length,0);assert.equal(after.routing.labels.filter(label=>label.conflict).length,0);
const offset=(routing,label)=>{const port=routing.routes.find(route=>route.id===label.edge).ports.find(item=>item.table===label.table);return Math.abs(label.x-port.label.x)+Math.abs(label.y-port.label.y);};
for(const label of after.routing.labels)assert(offset(after.routing,label)<=32,'counts stay near their own connection');
const aligned=s=>s.a.x===s.b.x||s.a.y===s.b.y;
for(let i=0;i<after.routing.routes.length;i++)for(let j=0;j<i;j++){
 const a=after.routing.routes[i],b=after.routing.routes[j];
 for(const p of a.ports)for(const q of b.ports)assert(!(p.table===q.table&&p.p.x===q.p.x&&p.p.y===q.p.y),'connections do not share a port');
 for(const p of a.segments)for(const q of b.segments)assert(!(aligned(p)&&aligned(q)&&sharedRun(p.a,p.b,q.a,q.b)),'connections do not share a line');
}
const moved=new Map([['overview-bd',{x:842,y:362}]]),custom=conceptDiagram(g.ids,g.edges,sizes,moved);
assert.equal(custom.boxes.get('overview-bd').x,842);assert.equal(custom.boxes.get('overview-bd').y,362);
console.log('CONCEPT-COMPACT-001/002 and CONCEPT-ARRAY-001/002: schema, compact graph and saved-position boundary verified.');
