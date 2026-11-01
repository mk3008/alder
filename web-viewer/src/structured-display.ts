import type {ActivityEntry,BD,RelationEntry,StructuredActivity} from './json-document';
import type {Finding} from './graph';

/** Names come only from explicit references in the validated source. */
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

/** Viewer-only findings. They are never written to the source document's findings. */
export function structureFindings(bd:BD):Finding[]{
 const findings:Finding[]=[];
 for(const activity of bd.activities){
  if(!('performers' in activity))continue;
  const add=(suffix:string,kind:'question'|'correction',summary:string,content:string)=>findings.push({
   id:`viewer:${suffix}:${activity.id}`,displayId:'構造の要確認（表示のみ）',kind,status:'open',scope:'items',
   targets:[activity.id],targetNames:[activity.name],summary,content,unresolvedTargets:[]
  });
  if(activity.performers===null)add('who','question','実行主体が未決です。','実行主体を確認してください。入力や出力の相手からは決められません。');
  else if(activity.performers.length>1)add('who','correction','実行主体が複数あります。',`主体：${performerNames(bd,activity)}。1つのActivityの実行主体は1つです。各手順の担当と業務の区切りを確認してください。`);
  const pending=activity.procedure.steps.filter(step=>step.performerObjectIds===null&&activity.performers?.length!==1);
  if(pending.length)add('steps','question','担当が未決の手順があります。',`担当未決：${pending.map((step)=>step.text).join('、')}。Activityの主体から一意に継承できません。`);
 }
 return findings;
}
