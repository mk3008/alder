import type {Design} from './graph';
import type {StateModel} from './state-transitions';
export type StateDocument={id:string;kind:'stateTransition';revision:string;basedOn:{documentId:string;revision:string;verification:'unverified'};objectId:string;states:{id:string;name:string}[];start:string;terminal:string;completeness:string;source:string;transitions:{id:string;sourceId:string;fromId:string;toId:string;activityId:string;exception:string|null;event:string|null;condition:string;effect:string;path:string;evidence:string;note:string}[]};
/** Names are private presentation inputs of the pinned renderer; JSON identity stays unchanged. */
export function projectStates(design:Design):Design{
 const bd=design.json!.business,names=new Map([...bd.objects,...bd.activities].map(n=>[n.id,n.name]));
 return {...design,graph:{...design.graph,nodes:design.graph.nodes.map(n=>({...n,id:n.name})),relations:[]},sections:Object.fromEntries(bd.activities.map(a=>[a.name,'### Exception\n'+(a.exception??'')])),
 objectStateTransitions:Object.fromEntries(design.json!.states.filter(s=>s.basedOn.documentId===bd.id).map(d=>{
  const labels=new Map(d.states.map(s=>[s.id,s.name])),model:StateModel={object:names.get(d.objectId)!,states:d.states.map(s=>s.name),start:d.start,terminal:d.terminal,completeness:d.completeness,source:d.source,
   transitions:d.transitions.map(t=>({id:t.sourceId,from:labels.get(t.fromId)??t.fromId,to:labels.get(t.toId)??t.toId,activity:names.get(t.activityId)!,...(t.event?{event:t.event}:{}),...(t.exception?{exception:t.exception}:{}),condition:t.condition,effect:t.effect,path:t.path,evidence:t.evidence,note:t.note}))};return [model.object,{model}];}))};
}
