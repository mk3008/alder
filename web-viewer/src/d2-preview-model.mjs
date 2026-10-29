// Experimental read-only D2 boundary only; never imported by the production loader.
import {validateShape,parseStrict,validate as validatePackage} from '../../tools/document_storage/core.mjs';
import shape from './d2-preview-shape.json' with {type:'json'};
const demand=(ok,message)=>{if(!ok)throw Error(message);},unique=(xs,message)=>demand(new Set(xs).size===xs.length,message);
function checkOrders(stepIds,edges,swaps){
 const links=new Map(stepIds.map(x=>[x,[]]));for(const [a,b]of edges){demand(a!==b,'self order');links.get(a).push(b);}
 const colors=new Map();function visit(a){demand(colors.get(a)!==1,'order cycle');if(colors.get(a)===2)return;colors.set(a,1);for(const b of links.get(a))visit(b);colors.set(a,2);}for(const id of stepIds)visit(id);
 const reachable=(a,b)=>{const pending=[a],seen=new Set();while(pending.length){const n=pending.pop();if(seen.has(n))continue;seen.add(n);for(const x of links.get(n)){if(x===b)return true;pending.push(x);}}return false;};
 for(const xs of swaps)for(const a of xs)for(const b of xs)if(a!==b)demand(!reachable(a,b),'interchange conflicts with before');
}
export function actorsForStep(a,s){if(a.performers===null)return null;if(s.performerObjectIds!==null)return s.performerObjectIds;return a.performers.length===1?[a.performers[0].objectId]:null;}
export function validateD2(p){
 validateShape(p,shape);const b=p.business,map=new Map(),owner=new Map();
 const add=(x,type,parent)=>{demand(!map.has(x.id),'duplicate id');map.set(x.id,{x,type});owner.set(x.id,parent);};
 add(b,'bd',null);for(const r of b.roles)add(r,'role',b.id);for(const o of b.objects){add(o,'object',b.id);for(const i of o.information)add(i,'information',o.id);}
 for(const a of b.activities){add(a,'activity',b.id);for(const s of a.procedure.steps)add(s,'step',a.id);for(const r of a.results)add(r,'result',a.id);}
 for(const [xs,type]of [[b.relations,'relation'],[b.findings,'finding'],[b.exceptions,'exception'],[b.crossActivityOrderRules,'cross-order']])for(const x of xs)add(x,type,b.id);
 const ref=(v,type,parent)=>{demand(map.get(v)?.type===type,'bad '+type+' ref');if(parent)demand(owner.get(v)===parent,'wrong owner');};
 demand(b.activities.length>0,'activity min 1');const unresolved=[],localEdges=[],localSwaps=[],allSteps=[];
 for(const a of b.activities){
  if(a.performers!==null){demand(a.performers.length>0,'actor min 1');unique(a.performers.map(x=>x.objectId),'duplicate actor');for(const x of a.performers){ref(x.objectId,'object',b.id);unique(x.roleIds,'duplicate role');for(const r of x.roleIds)ref(r,'role',b.id);}}
  demand(a.procedure.steps.length>0,'step min 1');demand(a.results.length>0,'result min 1');const ids=a.procedure.steps.map(s=>s.id);allSteps.push(...ids);
  for(const s of a.procedure.steps){if(s.performerObjectIds!==null){demand(s.performerObjectIds.length>0,'step actor min 1');unique(s.performerObjectIds,'duplicate step actor');for(const o of s.performerObjectIds)demand(a.performers?.some(x=>x.objectId===o),'step actor outside Activity assignment');}
   if(actorsForStep(a,s)===null)unresolved.push({activityId:a.id,stepId:s.id,scope:a.scope});
  }
  if(a.performers===null||unresolved.some(x=>x.activityId===a.id))demand(b.findings.some(f=>f.status==='open'&&f.targetIds.includes(a.id)),'unresolved actor needs Finding');
  const edges=[],swaps=[];for(const r of a.procedure.orderRules){if(r.kind==='before'){ref(r.beforeId,'step',a.id);ref(r.afterId,'step',a.id);edges.push([r.beforeId,r.afterId]);demand(ids.indexOf(r.beforeId)<ids.indexOf(r.afterId),'local standard order conflict');}else{demand(r.stepIds.length>=2,'swap min 2');unique(r.stepIds,'duplicate swap');r.stepIds.forEach(s=>ref(s,'step',a.id));swaps.push(r.stepIds);}}
  unique(edges.map(x=>JSON.stringify(x)),'duplicate before');checkOrders(ids,edges,swaps);localEdges.push(...edges);localSwaps.push(...swaps);
 }
 const contexts=new Map(),endpointRef=e=>{ref(e.activityId,'activity',b.id);ref(e.stepId,'step',e.activityId);return e.stepId;};
 for(const r of b.crossActivityOrderRules){const refs=r.kind==='before'?[r.before,r.after]:r.standardSteps;demand(refs.length>=2,'cross min 2');const ids=refs.map(endpointRef);unique(ids,'duplicate cross step');demand(new Set(refs.map(x=>x.activityId)).size>=2,'cross rule needs two Activities');
  if(!contexts.has(r.context))contexts.set(r.context,{edges:[...localEdges],swaps:[...localSwaps]});const ctx=contexts.get(r.context);
  if(r.kind==='before')ctx.edges.push(ids);else ctx.swaps.push(ids);
 }
 for(const {edges,swaps}of contexts.values())checkOrders(allSteps,edges,swaps);
 const ends={input:['object','activity'],output:['activity','object'],'business-exception':['activity','activity'],'object-exception':['object','object']};
 for(const r of b.relations){ref(r.fromId,ends[r.kind][0],b.id);ref(r.toId,ends[r.kind][1],b.id);if(['input','output'].includes(r.kind)){demand(r.items.length>0,'io min 1');unique(r.items.map(x=>x.informationId),'duplicate io');for(const x of r.items)ref(x.informationId,'information',r.kind==='input'?r.fromId:r.toId);}}
 for(const e of b.exceptions)ref(e.activityId,'activity',b.id);for(const f of b.findings)for(const t of f.targetIds)demand(['activity','object'].includes(map.get(t)?.type),'bad Finding target');
 return {validDraft:true,unresolvedActors:unresolved,approval:'not-evaluated'};
}
export function readPreview(text){
 if(new TextEncoder().encode(text).length>1024*1024)throw Error('比較JSONは1MiB以内です。');
 const p=parseStrict(text);
 demand(p?.format==='alder-structure-preview'&&p.version===1,'比較用JSONではありません。');
 demand(Array.isArray(p.cases)&&p.cases.length>0&&p.cases.length<=6,'比較例は1〜6件です。');
 unique(p.cases.map(c=>c.id),'duplicate case');
 for(const c of p.cases){
  demand(typeof c.id==='string'&&/^[A-Za-z0-9_-]+$/.test(c.id)&&typeof c.title==='string','比較例の名前が不正です。');
  const b=c.candidate?.business;demand(b?.activities?.length<=6&&b?.relations?.length<=20,'比較例が大きすぎます。');
  demand(b.activities.every(a=>a.procedure?.steps?.length<=30)&&b.crossActivityOrderRules?.length<=10,'比較手順が多すぎます。');
  validateD2(c.candidate);validatePackage(c.before);
  const old=c.before.documents.find(d=>d.kind==='businessDesign');demand(old,'0.4 BD required');
  const equal=(a,b)=>JSON.stringify(a.map(JSON.stringify).sort())===JSON.stringify(b.map(JSON.stringify).sort());
  demand(equal([...old.objects,...old.activities].map(n=>[n.id,n.name,n.scope]),[...b.objects,...b.activities].map(n=>[n.id,n.name,n.scope])),'comparison nodes mismatch');
  demand(equal(old.relations.map(r=>[r.id,r.kind,r.fromId,r.toId]),b.relations.map(r=>[r.id,r.kind,r.fromId,r.toId])),'comparison edges mismatch');
 }
 return p;
}
