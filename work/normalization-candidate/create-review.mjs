import {readFileSync,writeFileSync} from 'node:fs';
import {normalizePackage} from './normalize.mjs';
import {validate} from '../../tools/document_storage/core.mjs';

const here=new URL('./',import.meta.url),read=path=>JSON.parse(readFileSync(new URL(path,here),'utf8'));
// Relation role names are authored in the review model. Regeneration must not
// infer them from physical fields or silently overwrite the reviewed names.
const savedReview=read('../../business-design/alder/json-normalized-model-review.json');
const savedModel=savedReview.documents.find(d=>d.kind==='conceptModel'&&d.id==='alder-normalized-model-study');
const savedNames=savedModel?.meta?.relationNames;
if(!savedNames||typeof savedNames!=='object'||Array.isArray(savedNames))throw Error('Conceptual relation names are missing from the review model');
const pkg=read('../../tools/document_storage/examples/molkky-decisions-v07.json'),bd=pkg.documents.find(d=>d.kind==='businessDesign');
bd.roles.push({id:'score-reviewer',name:'記録係',color:'#8b5cf6'});
function activity(id,name,who){return {id,name,scope:true,why:'構造確認用の架空業務',when:'確認するとき',where:'規定なし',who,procedure:{steps:[{id:id+'-step',action:'確認する',method:null,whatDataIds:[],obligation:'required',appliesWhen:null,effect:null,exchange:{kind:'internal'},decisionIds:[],whenDecision:null}],orderRules:[]},decisions:[],results:[{id:id+'-result',text:'確認した'}],problem:null,painLevel:null};}
bd.activities.push(activity('score-review-one','点数を確認する',{kind:'role',roleId:'score-reviewer'}),activity('score-review-two','結果を確認する',{kind:'role',roleId:'score-reviewer'}),activity('score-review-undecided','確認方法を整理する',null));
pkg.revision='normalized-example-source-1';bd.revision='bd-review-1';validate(pkg);
const normalized=normalizePackage(pkg,{'bd-score-example/calculate-score':{id:'score-system',evidence:'構造確認用の架空例では一つのシステムと明示'}});

// The following is a logical view of the study above, not the schema of 0.7.
// Association tables are shown as direct N:N relationships when they have no
// independently modelled business identity; their actual table is named in condition.
const definitions=[
 ['bd','業務設計書（Business Design）','businessDesigns',['id|識別子','title|名前','revision|改訂']],
 ['who','主体（Who）','actors',['id|識別子','kind|主体の種類','name|名前','color|表示色（Roleのみ）']],
 ['activity','業務（Activity）','activities',['id|識別子','name|名前','whoId|実行主体（未決可）','scope|範囲','why|目的','when|開始条件']],
 ['object','対象（Object）','objects',['id|識別子','name|名前','scope|範囲']],
 ['information','情報項目（Information）','information',['id|識別子','name|名前','objectId|所属する対象']],
 ['data','情報のまとまり（Data）','data',['id|識別子','name|名前']],
 ['dataitem','Data項目（DataItem）','dataItems',['dataId|情報のまとまり','informationId|情報項目','condition|条件']],
 ['step','手順行（Step）','steps',['id|識別子','activityId|所属する業務','action|操作','method|方法','exchangeKind|やり取りの種類','whenDecisionRowId|適用する判定行']],
 ['exchange','受渡し（Interaction）','stepInteractions',['stepId|手順行','objectId|対象','direction|入出力の向き','phase|要求／応答','relationId|入出力の関係','pairedStepId|対応する手順']],
 ['party','操作主体・対象（Party）','stepParties',['stepId|手順行','side|主体または対象','kind|主体の種類','objectId|対象']],
 ['dependency','手順の前提（Dependency）','dependencies',['stepId|対象手順','prerequisiteStepId|前提の手順','whenDecisionRowId|条件となる判定行']],
 ['order','旧順序規則（OrderRule）','orderRules',['activityId|対象業務','kind|規則の種類','beforeId|前の手順','afterId|後の手順']],
 ['result','業務結果（Activity Result）','results',['id|識別子','activityId|対象業務','text|成立した結果']],
 ['decision','判定表（Decision）','decisions',['id|識別子','activityId|対象業務','title|表題','kind|種類','appliesWhenRowId|適用する判定行']],
 ['axis','判定軸（Decision Axis）','axes',['id|識別子','decisionId|判定表','name|条件名']],
 ['row','判定行（Decision Row）','rows',['id|識別子','decisionId|判定表','resultKind|結果の種類','resultText|結果']],
 ['condition','条件セル（Condition）','conditions',['rowId|判定行','axisId|判定軸','kind|条件の種類','operator|比較','value|値']],
 ['rowcheck','判定行とCheckの対応','rowChecks',['rowId|判定行','checkId|チェック項目','coverage|対応範囲']],
 ['exception','例外（Exception）','exceptions',['id|識別子','activityId|対象業務','name|名前','description|説明']],
 ['continuity','中断・再開（Continuity）','continuities',['exceptionId|対象例外','trigger|中断条件','outcome|中断後の扱い','resumeCondition|再開条件','resumeAction|再開方法']],
 ['relation','入出力の関係（Relation）','relations',['id|識別子','kind|関係の種類','fromId|出発点','toId|到着点']],
 ['finding','確認事項（Finding）','findings',['id|識別子','status|確認状態','scope|対象範囲','summary|概要']],
 ['external','外部業務設計書目録','source.externalDocuments',['id|識別子','revision|改訂']],
 ['checkdoc','チェック文書（Check Items）','retained Check document',['id|識別子','revision|改訂','basedOn|参照元']],
 ['check','チェック項目（Check）','retained Check.items',['id|識別子','checkId|表示番号','reviewState|確認状態']]
];
const relationships=[
 ['bd-actor','bd','who','1','0..N','down','業務設計書が主体を定義する。'],
 ['bd-activity','bd','activity','1','1..N','down','業務設計書が業務を持つ。'],
 ['who-activity','activity','who','0..N','0..1','reference','Activity.whoId。未決はNULLであり、主体がいないと確定したことを示さない。'],
 ['bd-object','bd','object','1','0..N','down','業務設計書が対象を持つ。'],
 ['object-information','object','information','1','0..N','down','情報項目の所属。'],
 ['bd-data','bd','data','1','0..N','down','業務設計書がDataを持つ。'],
 ['data-dataitem','data','dataitem','1','1..N','down','Dataを構成する項目。'],
 ['dataitem-information','dataitem','information','0..N','1','reference','dataItems.informationId。'],
 ['activity-step','activity','step','1','1..N','down','業務内の順序付き手順。'],
 ['activity-result','activity','result','1','1..N','down','業務の複数結果。'],
 ['activity-decision','activity','decision','1','0..N','down','業務の判定表。'],
 ['activity-exception','activity','exception','1','0..N','down','例外は業務に属する。'],
 ['activity-order','activity','order','1','0..N','down','旧形式の順序規則を保持する。'],
 ['step-exchange','step','exchange','1','0..1','down','やり取りがinteractionの場合だけ受渡し行がある。internalとunresolvedには作らない。'],
 ['step-party','step','party','1','0..2','down','partiesが指定された場合に、主体側・対象側のうち記録された側を保持する。'],
 ['party-object','party','object','0..N','0..1','reference','kind=objectの場合のみobjectIdで参照する。whoの場合はその手順のActivityのWhoを意味する。'],
 ['exchange-object','exchange','object','0..N','1','reference','stepInteractions.objectId。'],
 ['exchange-relation','exchange','relation','0..N','0..1','reference','stepInteractions.relationId。'],
 ['exchange-pair','exchange','step','0..N','0..1','reference','対応手順。片方向・同じ相手への複数参照を保持する。'],
 ['step-data','step','data','0..N','0..N','reference','stepTargetDataで操作対象のDataを参照する。'],
 ['exchange-data','exchange','data','0..N','0..N','reference','interactionDataで受渡しのDataを参照する。'],
 ['step-dependency','step','dependency','1','0..N','down','依存情報の明細。'],
 ['dependency-step','dependency','step','0..N','1','reference','前提手順への参照。'],
 ['step-decision','step','decision','0..N','0..N','reference','stepDecisionsで判定表を参照する。'],
 ['step-when','step','row','0..N','0..1','reference','手順を実行する判定行。'],
 ['dependency-when','dependency','row','0..N','0..1','reference','この前提が必要となる判定行。'],
 ['decision-when','decision','row','0..N','0..1','reference','判定表を適用する判定行。'],
 ['decision-axis','decision','axis','1','1..N','down','判定表の条件軸。'],
 ['axis-data','axis','data','0..N','0..N','reference','axisDataが判定軸と対象Dataを対応付ける。'],
 ['decision-row','decision','row','1','1..N','down','先頭から評価する判定行。'],
 ['row-condition','row','condition','1','1..N','down','判定行の各軸に対応する条件。'],
 ['condition-axis','condition','axis','1..N','1','reference','各判定表には1行以上あり、各行が全ての軸を一度ずつ持つ。'],
 ['row-checklink','row','rowcheck','1','0..N','down','判定行とCheckの対応と範囲。'],
 ['checklink-check','rowcheck','check','0..N','1','reference','rowChecks.checkId。Check本体は元文書に残す。'],
 ['row-data','row','data','0..N','0..N','reference','resultDataで判定結果のDataを参照する。'],
 ['row-exception','row','exception','0..N','0..N','reference','resultExceptionsで判定結果の例外を参照する。'],
 ['exception-continuity','exception','continuity','1','0..1','down','中断・再開が明示された場合に記録する。'],
 ['continuity-interrupted','continuity','step','0..N','0..1','reference','中断時の手順。'],
 ['continuity-resume','continuity','step','0..N','0..1','reference','再開時の手順。'],
 ['continuity-data','continuity','data','0..N','0..N','reference','continuityDataは中断時に保持するDataを参照する。'],
 ['order-before','order','step','0..N','0..1','reference','before規則の前の手順。'],
 ['order-after','order','step','0..N','0..1','reference','before規則の後の手順。'],
 ['order-member','order','step','0..N','0..N','reference','orderRuleStepsはinterchangeable規則の対象手順を保持する。'],
 ['bd-relation','bd','relation','1','0..N','down','入出力等の関係を保持する。'],
 ['relation-from-activity','relation','activity','0..N','0..1','reference','fromIdがActivityを指す関係の場合。'],
 ['relation-to-activity','relation','activity','0..N','0..1','reference','toIdがActivityを指す関係の場合。'],
 ['relation-from-object','relation','object','0..N','0..1','reference','fromIdがObjectを指す関係の場合。'],
 ['relation-to-object','relation','object','0..N','0..1','reference','toIdがObjectを指す関係の場合。'],
 ['bd-finding','bd','finding','1','0..N','down','業務設計の確認事項。'],
 ['finding-activity','finding','activity','0..N','0..N','reference','findingTargetsのうちActivityへの参照。'],
 ['finding-object','finding','object','0..N','0..N','reference','findingTargetsのうちObjectへの参照。'],
 ['bd-checkdoc','checkdoc','bd','0..N','0..1','reference','原典がパッケージ内BDの場合。Checkは他に外部BD目録を参照でき、どちらか一方を参照する。'],
 ['external-checkdoc','checkdoc','external','0..N','0..1','reference','原典が外部BD目録の場合。Checkはパッケージ内BDまたは外部目録の一方を参照する。'],
 ['checkdoc-check','checkdoc','check','1','0..N','down','Check文書のチェック項目。']
];
const base=read('../../business-design/alder/json-structure-review.json'),original=base.documents.find(d=>d.kind==='conceptModel');
const m=structuredClone(original);m.id='alder-normalized-model-study';m.revision=savedModel.revision;m.schemaVersion='0.1';
m.subsystems[0].name='JSON正規化候補（全概念）';m.subsystems[0].purpose='実際の0.7保存構造から作る正規化候補を検討する。';
m.concepts=definitions.map(([id,name,table,fields])=>({id:'n-'+id,name,subsystemId:'format-review',information:fields.map((value,i)=>({id:`n-${id}-field-${i+1}`,name:value.split('|')[1]})),reason:'正規化候補の構造レビュー。',description:`候補の ${table}。現行0.7の物理構造そのものではない。`,businessObjectIds:[],activityLinks:[],sourceRefs:[],reviewState:'未レビュー'}));
m.relations=relationships.map(([id,from,to,fromLabel,toLabel,kind,condition])=>({id:'nr-'+id,fromConceptId:'n-'+from,toConceptId:'n-'+to,fromPerTarget:fromLabel,toPerSource:toLabel,condition,reviewState:'未レビュー',sourceRefs:[],fromLabel,toLabel,kind}));
m.reviewGroups=[];m.handoffs=[];m.benefits=[];m.considerations=[];m.reviewPoints=[];
m.meta={sourceFormatVersion:'0.7',modelStatus:'normalized-study',scope:'Business Designのみ。Check等の別文書は現行のまま保持。',fieldMappings:definitions.flatMap(([id,,table,fields])=>fields.map((value,i)=>{
 const [physicalName]=value.split('|');const fieldKey=id+'.'+physicalName;
 const fieldRelations={'activity.whoId':['nr-who-activity'],'exchange.objectId':['nr-exchange-object'],'exchange.relationId':['nr-exchange-relation'],'exchange.pairedStepId':['nr-exchange-pair'],'step.whenDecisionRowId':['nr-step-when'],'dependency.whenDecisionRowId':['nr-dependency-when'],'dependency.prerequisiteStepId':['nr-dependency-step'],'decision.appliesWhenRowId':['nr-decision-when'],'condition.axisId':['nr-condition-axis'],'rowcheck.checkId':['nr-checklink-check']};
 return {informationId:`n-${id}-field-${i+1}`,physicalName:table+'.'+physicalName,relationIds:fieldRelations[fieldKey]??[]};
})),relationNames:structuredClone(savedNames)};
const relationIds=new Set(m.relations.map(relation=>relation.id));
if(Object.keys(savedNames).length!==relationIds.size||Object.entries(savedNames).some(([id,name])=>!relationIds.has(id)||typeof name!=='string'||!name.trim()))throw Error('Conceptual relation names do not match the review model relations');
// Preserve the earlier authored 13-concept projection. The Viewer adds all
// missing concepts and explicit relations when constructing the overview.
const overviewIds=['bd','who','activity','object','information','data','step','result','decision','row','external','checkdoc','check'];
const overviewRelations=['bd-actor','bd-activity','who-activity','bd-object','object-information','bd-data','activity-step','activity-result','activity-decision','decision-row','bd-checkdoc','external-checkdoc','checkdoc-check'];
const selectedConcepts=m.concepts.filter(x=>overviewIds.includes(x.id.slice(2)));
const nodes=selectedConcepts.map(c=>({id:'overview-'+c.id,conceptId:c.id,subsystemId:c.subsystemId,name:c.name,description:c.description,sources:[],fields:c.information.map(f=>({name:f.name,informationId:f.id}))}));
const byConcept=new Map(nodes.map(n=>[n.conceptId,n.id]));
const edges=m.relations.filter(r=>overviewRelations.includes(r.id.slice(3))).map(r=>({id:'overview-'+r.id,fromViewId:byConcept.get(r.fromConceptId),toViewId:byConcept.get(r.toConceptId),relationIds:[r.id],fromLabel:r.fromLabel,toLabel:r.toLabel,kind:r.kind}));
m.presentation={landscapeRelationships:[],reviewBoundaries:[],subsystemViews:{nodes,edges,handoffIds:[]}};
base.documents=base.documents.filter(d=>d.kind!=='conceptModel');base.documents.push(m);base.revision=savedReview.revision;
validate(base);
writeFileSync(new URL('example-source.json',here),JSON.stringify(pkg,null,2)+'\n');
writeFileSync(new URL('example-normalized.json',here),JSON.stringify(normalized,null,2)+'\n');
writeFileSync(new URL('../../business-design/alder/json-normalized-model-review.json',here),JSON.stringify(base,null,2)+'\n');
const labels=new Map(definitions.map(([id,name])=>[id,name]));
const lines=['# 正規化候補の関係一覧','','全体図は全概念と全関係を対象にする。指定の形で配線できない関係は画面の警告とこの一覧で確認する。多重度は、それぞれ反対側の一件に対する最大・最小件数。','', '| 出発側 | 出発側の件数 | 到着側の件数 | 到着側 | 意味 |','| --- | --- | --- | --- | --- |',...relationships.map(([,from,to,fromLabel,toLabel,,condition])=>`| ${labels.get(from)} | ${fromLabel} | ${toLabel} | ${labels.get(to)} | ${condition} |`)];
writeFileSync(new URL('relationships.ja.md',here),lines.join('\n')+'\n');
console.log('Created normalized sample and review model:',normalized.entities.actors.length,'actors;',m.concepts.length,'concepts;',m.relations.length,'relations');
