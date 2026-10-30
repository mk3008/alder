import type {ActivityEntry,BD,RelationEntry,StructuredActivity} from './json-document';

/** Display names are derived from the validated document; IDs stay in the source model. */
export function performerNames(bd:BD,activity:StructuredActivity,ids?:string[]|null):string{
 if(activity.performers===null)return '未決';
 const performers=ids===undefined?activity.performers:ids===null?(activity.performers.length===1?activity.performers:[]):activity.performers.filter(p=>ids.includes(p.objectId));
 if(!performers.length)return '未決';
 return performers.map(p=>{
  const name=bd.objects.find(o=>o.id===p.objectId)!.name;
  const roles=p.roleIds.map(id=>bd.roles!.find(r=>r.id===id)!.name);
  return roles.length?`${name}（${roles.join('・')}）`:name;
 }).join('、');
}
export function activityWho(bd:BD,activity:ActivityEntry):string{
 return 'performers' in activity?performerNames(bd,activity):(bd.roles?.find(r=>r.id===activity.roleId)?.name??activity.who);
}
export function relationLabel(bd:BD,relation:RelationEntry):string{
 return 'dataId' in relation?bd.data!.find(d=>d.id===relation.dataId)!.name:relation.label;
}
