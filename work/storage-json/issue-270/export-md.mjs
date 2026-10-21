import {inventory,demand} from './core.mjs';
const slug=s=>s.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,'').replace(/ /g,'-');
export function markdown(pkg,documentId,{draftAnnotations=false}={}){
 const d=pkg.documents.find(x=>x.id===documentId);demand(d,'Unknown document');const inv=inventory(pkg);
 const title=id=>{const x=inv.map.get(id),type=inv.types.get(id);return type==='section'?inv.map.get(x.activityId).name:type==='check'?x.id+' — '+x.title:x.title??x.name;};
 const rich=runs=>runs.map(r=>r.kind==='text'?r.value:r.kind==='link'?`[${r.label}](${r.uri})`:`[${r.label}](#${slug(title(r.targetId))})`).join('');
 const section=(name,value,level=2)=>`${'#'.repeat(level)} ${name}\n\n${value}\n\n`;
 let out=`# ${d.title}\n\n`;
 const omitted=[];
 if(d.kind==='businessDesign'){
  if(d.preface)out+=d.preface+'\n\n';if(d.scope)out+=section('Scope',d.scope,1);
  for(const o of d.objects){out+=section('Object '+o.name,'',1).trimEnd()+'\n\n'+section('Scope',String(o.scope))+section('Icon',o.icon);for(const [key,value]of Object.entries(o.draftAnnotations)){if(draftAnnotations)out+=section(key,value);else omitted.push(o.id+':'+key);}if(o.information.length)out+=section('Information',o.information.map(x=>'- '+x).join('\n'));}
  for(const a of d.activities){out+=`# Activity ${a.name}\n\n`+section('Scope',String(a.scope))+section('Why',a.why)+section('When',a.when);
   const exceptions=d.relations.filter(r=>r.kind==='business-exception'&&r.toId===a.id);if(exceptions.length)out+=section('Exception When',exceptions.map(r=>`- ${inv.map.get(r.fromId).name} — ${r.label}`).join('\n'));
   out+=section('Who',a.who)+section('Where',a.where)+'## How\n\n';
   const io=kind=>{const r=d.relations.filter(r=>r.kind===kind&&(kind==='input'?r.toId:r.fromId)===a.id);return r.length?r.map(r=>`- ${inv.map.get(kind==='input'?r.fromId:r.toId).name} — ${r.label}`).join('\n'):'(none)';};
   out+=section('Input',io('input'),3)+section('Procedure',a.procedure,3);if(a.exception)out+=section('Exception',a.exception,3);out+=section('Output',io('output'),3)+section('Result',a.result);if(a.problem!==null)out+=section('Problem',a.problem)+section('Pain level',a.painLevel);
  }
  if(d.findings.length){out+='# Findings\n\n';for(const f of d.findings){out+=`## Finding ${f.sourceId}\n\n`;for(const [key,value]of [['Kind',f.kind],['Status',f.status],['Scope',f.scope],['Targets',f.targetIds.length||f.unresolvedTargets.length?[...f.targetIds.map(id=>inv.map.get(id).name),...f.unresolvedTargets].map(x=>'- '+x).join('\n'):'(none)'],['Summary',f.summary],['Content',f.content]])out+=section(key,value,3);}}
  const oe=d.relations.filter(r=>r.kind==='object-exception');if(oe.length)out+=section('Graph exceptions',oe.map(r=>`- object-exception ${inv.map.get(r.fromId).name} → ${inv.map.get(r.toId).name} — ${r.label}`).join('\n'),1);
 }else{
  out+=rich(d.intro)+'\n\n## 業務一覧\n\n| 業務（Activity） | 目的 | 業務設計に記載された接続 | チェック項目 |\n| --- | --- | --- | --- |\n';
  for(const row of d.index){const name=inv.map.get(row.activityId).name;out+=`| [${name}](#${slug(name)}) | ${row.purpose} | ${row.connections} | ${row.checkIds.map(id=>`[${id}](#${slug(title(id))})`).join('、')} |\n`;}
  for(const s of d.sections){out+='\n## '+inv.map.get(s.activityId).name+'\n\n';if(s.preamble.length)out+=rich(s.preamble)+'\n\n';
   for(const g of d.guarantees.filter(g=>g.sectionId===s.id)){out+='### '+g.title+'\n\n';for(const b of g.blocks){if(b.kind==='prose')out+=rich(b.content)+'\n\n';else{const ex=inv.map.get(b.exampleId);out+='| '+ex.columns.join(' | ')+' |\n| '+ex.columns.map(()=> '---').join(' | ')+' |\n';for(const row of ex.rows)out+='| '+row.map(rich).join(' | ')+' |\n';out+='\n';}}}
   const roles={classification:'種別',condition:'条件',expectedResult:'期待結果',guarantee:'条件・期待結果',evidence:'根拠',derivation:'導出分類',related:'関連業務',testEvidence:'テスト証拠',question:'確認事項',alternatives:'選択肢と影響'};
   for(const item of d.items.filter(i=>i.sectionId===s.id)){out+=`### ${item.id} — ${item.title}\n\n- 人間レビュー状態：${item.reviewState}\n`;for(const [key,runs]of Object.entries(item.fields))out+=`- ${roles[key]}：${rich(runs)}\n`;out+='\n';}
  }
  for(const n of d.notes)out+=section(n.title,rich(n.content),2);
 }
 return {text:out.trimEnd()+'\n',omitted};
}
