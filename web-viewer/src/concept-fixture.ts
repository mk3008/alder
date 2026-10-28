import {purchaseModel,activityFor,activityKey} from './purchase-review.ts';

// Information and relation labels are authored in the model; rendering adds no business rules.
const tables=Object.fromEntries(purchaseModel.concepts.map(concept=>[concept.id,{
 name:concept.name, note:concept.description, fields:concept.information.map(item=>['',item.name])
}]));
const edges=purchaseModel.relations.map(relation=>[
 relation.fromConceptId,relation.toConceptId,relation.fromLabel,relation.toLabel,relation.kind
]);
const activityDefinitions=purchaseModel.presentation.activityViews.map(view=>{
 const activity=activityFor(view.activityId);
 return {id:view.id,title:activity.name,subtitle:view.subtitle,ids:view.conceptIds,write:view.writeConceptIds,
  rules:[activity.procedure,...(activity.exception?[activity.exception]:[])],change:activity.result};
});
const creatorStages=Object.fromEntries(Object.entries(purchaseModel.presentation.creatorActivityIds)
 .map(([id,activities])=>[id,activities.map(activityKey)]));
export {tables,edges,activityDefinitions,creatorStages};
