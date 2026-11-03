import type {ActivityEntry,BD,RelationEntry,StructuredActivity} from './json-document';
import type {Finding} from './graph';

/** Historical assignments are source information, not the Activity's Who. */
export function legacyPerformerNames(bd:BD,activity:StructuredActivity,ids?:string[]|null):string{
 if(activity.performers===null)return '未決';
 const performers=ids===undefined?activity.performers:ids===null?(activity.performers.length===1?activity.performers:[]):activity.performers.filter(p=>ids.includes(p.objectId));
 if(!performers.length)return '未決';
 return performers.map(p=>{
  const name=bd.objects.find(o=>o.id===p.objectId)!.name;
  const roles=p.roleIds.map(id=>bd.roles!.find(r=>r.id===id)!.name);
  return roles.length?`${name}（旧Role：${roles.join('・')}）`:name;
 }).join('、');
}
export function activityWho(bd:BD,activity:ActivityEntry):string{
 if('performers' in activity)return '未決';
 if(typeof activity.who==='string')return bd.roles?.find(r=>'roleId' in activity&&r.id===activity.roleId)?.name??activity.who;
 const who=activity.who;if(!who)return '未決';
 return who.kind==='role'?(bd.roles?.find(r=>r.id===who.roleId)?.name??'未決'):who.name;
}
export function relationLabel(bd:BD,relation:RelationEntry):string{
 return relation.dataId!==undefined?(bd.data?.find(d=>d.id===relation.dataId)?.name??'未決'):(relation.label??'');
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
  const objects=activity.performers??[],roles=new Set(objects.flatMap(performer=>performer.roleIds));
  const problems=[...(objects.length>1?['複数の担当Object']:[]),...(roles.size>1?['複数Role']:[])];
  add('who',problems.length?'correction':'question',problems.length?`旧形式に${problems.join('と')}があります。`:'Whoは未決です。',
   `旧形式の担当情報：${legacyPerformerNames(bd,activity)}。旧0.5にはActivityからWhoへの直接参照がありません。このActivityの単一のWhoを、Role・システム・スケジューラーを含めて確認してください。入力や出力の相手からは決められません。`);
  const pending=activity.procedure.steps.filter(step=>step.performerObjectIds===null&&activity.performers?.length!==1);
  const different=activity.procedure.steps.filter(step=>step.performerObjectIds!==null&&(step.performerObjectIds.length!==objects.length||step.performerObjectIds.some(id=>!objects.some(p=>p.objectId===id))));
  if(pending.length||different.length)add('steps',different.length?'correction':'question',different.length?'旧形式の手順の担当情報が異なります。':'旧形式の担当情報が未決の手順があります。',
   [pending.length?`旧形式の担当情報が未決：${pending.map(step=>step.text).join('、')}。`:'' ,different.length?`Activityと異なる旧形式の担当情報：${different.map(step=>step.text).join('、')}。責任境界が変わる場合はActivityの分割を検討してください。`:''].join(''));
 }
 return findings;
}
