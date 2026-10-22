/** Typed adapter for the explicit partial declaration. It never interprets business prose. */
import {createHash} from 'node:crypto';
import {demand} from './core.mjs';
export function stateDocument(model,bd,{documentId,revision}){
 const identity=key=>'st-'+createHash('sha256').update(documentId+':'+key).digest('hex').slice(0,32);
 const object=bd.objects.find(o=>o.name===model.object);demand(object,'State Object missing');
 const states=model.states.map(name=>({id:identity('state:'+name),name})),ids=new Map(states.map(s=>[s.name,s.id]));
 return {id:documentId,schemaVersion:'0.1',kind:'stateTransition',revision,title:model.object+'の状態遷移',basedOn:{documentId:bd.id,revision:bd.revision,verification:'unverified'},objectId:object.id,
 states,start:model.start,terminal:model.terminal,completeness:model.completeness,source:model.source,
 transitions:model.transitions.map(t=>{const activity=bd.activities.find(a=>a.name===t.activity);demand(activity,'State Activity missing: '+t.activity);return {id:identity('transition:'+t.id),sourceId:t.id,fromId:ids.get(t.from)??t.from,activityId:activity.id,event:t.event??null,exception:t.exception==='-'?null:t.exception??null,condition:t.condition,toId:ids.get(t.to)??t.to,effect:t.effect,path:t.path,evidence:t.evidence,note:t.note};})};
}
