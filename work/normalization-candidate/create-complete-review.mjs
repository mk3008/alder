import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {schema} from '../../tools/document_storage/schema.mjs';
import {validate} from '../../tools/document_storage/core.mjs';
import {nullabilityProposal} from './nullability-proposal.mjs';
import {attributeMeaning} from './attribute-meanings.mjs';

// This file creates only a review projection. The 0.7 contract, original
// example, normalizer, Check state and the previous review remain untouched.
const here=new URL('./',import.meta.url);
const read=path=>JSON.parse(readFileSync(new URL(path,here),'utf8'));
const pkg=read('../../business-design/alder/json-normalized-model-review.json');
const source=read('./example-source.json'),normalized=read('./example-normalized.json');
const actualPackage=read('../../business-design/alder/business-design.json');
const actualBusiness=actualPackage.documents.find(document=>document.kind==='businessDesign');
const actualActivity=actualBusiness.activities.find(activity=>activity.name==='業務設計');
const actualObject=actualBusiness.objects.find(object=>object.name==='依頼者');
const model=pkg.documents.find(d=>d.kind==='conceptModel');
const referenceModel=structuredClone(model);
const originalByKind=kind=>source.documents.find(document=>document.kind===kind);
const samples={Package:source,Check:originalByKind('checkItems'),State:originalByKind('stateTransition'),Concept:referenceModel};
// These are illustrative values, not State records in the source package.
const references={
 'State.title':'申込状態の遷移',
 'State.states[].name':'受付済',
 'State.transitions[].event':'申込を受け付けた',
 'State.transitions[].condition':'必要事項を確認済み',
 'State.transitions[].effect':'change',
 'State.transitions[].path':'normal'
};
const pkg07=schema.anyOf.find(x=>x.properties?.formatVersion?.enum?.[0]==='0.7');
if(!pkg07)throw Error('0.7 package definition missing');
const roots={Package:pkg07,Check:schema.$defs.checkItems,State:schema.$defs.stateTransitionStructured,Concept:schema.$defs.checkedConceptModel};
model.id='alder-complete-package-study';model.revision='package-study-1';pkg.revision='package-review-1';
model.subsystems[0].name='Alder JSON 概念モデル候補';
model.subsystems[0].purpose='文書パッケージ全体と、業務設計の正規化候補を確認する。';
model.meta.scope='0.7文書パッケージ全体の構造と業務設計の正規化候補。実際の保存形式の変更ではない。';
model.meta.modelStatus='complete-package-study';
model.meta.schemaCoverage=[];model.meta.schemaAliases=[];
model.meta.schemaVariants='概念モデル文書は0.1と0.2の両方を含む。サンプルのCheck参照と機能テスト仕様は0.2で追加された。';
const infoMap=new Map(model.meta.fieldMappings.map(x=>[x.informationId,x]));
const nodes=new Map(model.concepts.map(x=>[x.id,x]));
const paths=new Map();const firstBySchema=new WeakMap();const refQueue=[];
const slug=s=>createHash('sha256').update(s).digest('hex').slice(0,14);
const types={
 'Package':['DocumentPackage','文書パッケージ'],
 'Package.sources[]':['SourceRecord','原典情報'],
 'Package.externalDocuments[]':['外部業務設計書の目録項目','外部業務設計書の目録項目'],
 'Package.externalDocuments[].activities[]':['ExternalActivity','外部業務の目録項目'],
 'Check':['CheckDocument','チェック文書'],
 'Check.intro[]':['RichTextPart','文章・参照・リンクの要素'],
 'Check.index[]':['CheckActivityIndex','業務とチェックの索引'],
 'Check.sections[]':['CheckSection','チェックの節'],
 'Check.guarantees[]':['CheckGuarantee','保証'],
 'Check.guarantees[].blocks[]':['GuaranteeBlock','保証の記述'],
 'Check.examples[]':['CheckExample','チェックのサンプル'],
 'Check.examples[].rows[]':['CheckExampleRow','サンプルの行'],
 'Check.examples[].rows[][]':['CheckExampleCell','サンプルのセル'],
 'Check.items[]':['CheckItem','チェック項目'],
 'Check.items[].fields':['CheckItemDetails','チェック項目の詳細'],
 'Check.notes[]':['CheckNote','注記'],
 'State':['StateTransitionDocument','状態遷移文書'],
 'State.states[]':['State','状態'],
 'State.transitions[]':['StateTransition','状態遷移'],
 'Concept':['ConceptModelDocument','概念モデル文書'],
 'Concept.relatedStates[]':['RelatedStateReference','関連する状態遷移の参照'],
 'Concept.subsystems[]':['Subsystem','サブシステム'],
 'Concept.concepts[]':['Concept','概念'],
 'Concept.concepts[].information[]':['ConceptAttribute','概念の情報項目'],
 'Concept.concepts[].activityLinks[]':['ConceptActivityLink','業務との対応'],
 'Concept.concepts[].sourceRefs[]':['ConceptSourceReference','根拠の参照'],
 'Concept.relations[]':['ConceptRelation','概念間の関係'],
 'Concept.handoffs[]':['SubsystemHandoff','サブシステム間の受渡し'],
 'Concept.reviewGroups[]':['ConceptReviewGroup','概念レビューの単位'],
 'Concept.reviewGroups[].reviewer':['ReviewerReference','レビュー担当の参照'],
 'Concept.reviewGroups[].graph':['ReviewGraph','レビュー対象の図'],
 'Concept.reviewGroups[].graph.nodes[]':['ReviewGraphNode','レビュー図の概念'],
 'Concept.reviewGroups[].graph.edges[]':['ReviewGraphEdge','レビュー図の関係'],
 'Concept.reviewGroups[].graph.subsystemViews':['SubsystemViews','サブシステム別の表示'],
 'Concept.reviewGroups[].graph.subsystemViews.nodes[]':['SubsystemViewNode','表示する概念'],
 'Concept.reviewGroups[].graph.subsystemViews.nodes[].fields[]':['SubsystemViewField','表示する項目'],
 'Concept.reviewGroups[].graph.subsystemViews.edges[]':['SubsystemViewEdge','表示する関係'],
 'Concept.reviewGroups[].structureStatements[]':['StructureStatement','構造についての確認事項'],
 'Concept.reviewGroups[].capabilities[]':['Capability','機能'],
 'Concept.reviewGroups[].capabilities[].samples[]':['CapabilitySample','機能のサンプル'],
 'Concept.reviewGroups[].capabilities[].samples[].blocks[]':['SampleBlock','サンプルの表'],
 'Concept.reviewGroups[].capabilities[].samples[].blocks[].columns[]':['SampleColumn','サンプルの列'],
 'Concept.reviewGroups[].capabilities[].samples[].blocks[].rows[]':['SampleRow','サンプルの行'],
 'Concept.reviewGroups[].capabilities[].samples[].blocks[].rows[].cells[]':['SampleCell','サンプルの値'],
 'Concept.reviewGroups[].capabilities[].testSpecification':['FunctionCheckReferences','機能とチェックの対応'],
 'Concept.reviewGroups[].limitations[]':['Limitation','制約'],
 'Concept.reviewGroups[].meta':['ReviewGroupMetadata','レビューの補足情報'],
 'Concept.presentation':['ConceptPresentation','概念モデルの表示設定'],
 'Concept.presentation.landscapeRelationships[]':['ReviewGroupRelationship','レビュー間の関係'],
 'Concept.presentation.reviewBoundaries[]':['ReviewBoundary','レビュー間の境界']
};
const labels={
 format:'形式',formatVersion:'形式の版',revision:'改訂',documents:'文書',sources:'原典情報',externalDocuments:'外部業務設計書の目録',diagnostics:'診断',
 id:'識別子',schemaVersion:'文書の版',kind:'種類',title:'名前',name:'名前',basedOn:'原典',documentId:'参照する文書',verification:'原典の確認状態',sha256:'原典のハッシュ',uri:'原典の場所',activities:'業務',
 intro:'はじめに',index:'業務とチェックの索引',sections:'節',guarantees:'保証',examples:'サンプル',items:'チェック項目',notes:'注記',
 activityId:'業務',purpose:'目的',connections:'業務間のつながり',checkIds:'チェック項目',preamble:'前置き',sectionId:'所属する節',blocks:'記述',content:'内容',exampleId:'サンプル',
 guaranteeId:'対応する保証',columns:'列',rows:'行',checkId:'チェック項目',detailSummary:'概要',reviewState:'確認状態',fields:'詳細',classification:'分類',condition:'条件',expectedResult:'期待結果',guarantee:'保証',evidence:'根拠',derivation:'導出',related:'関連',testEvidence:'テスト根拠',question:'確認事項',alternatives:'代替案',confidence:'確度',
 objectId:'対象',states:'状態',start:'開始状態',terminal:'終了状態',completeness:'定義の網羅状態',source:'原典',transitions:'状態遷移',sourceId:'原典の識別子',fromId:'変更前',toId:'変更後',event:'発生事象',effect:'状態への影響',path:'経路の種類',note:'注記',exceptionId:'例外',conditionLabel:'条件の表示名',
 relatedStates:'関連する状態遷移',subsystems:'サブシステム',concepts:'概念',relations:'関係',handoffs:'サブシステム間の受渡し',reviewGroups:'レビューの単位',benefits:'効果',considerations:'考慮事項',reviewPoints:'確認観点',meta:'補足情報',presentation:'表示設定',
 information:'情報項目',reason:'理由',description:'説明',activityIds:'関連業務',subsystemId:'サブシステム',responsibilityStatus:'責任の状態',responsibleSubsystemId:'責任を持つサブシステム',businessObjectIds:'対応する対象',activityLinks:'業務との対応',uses:'用途',sourceRefs:'根拠の参照',targetType:'対象の種類',targetId:'参照先',label:'表示名',value:'値',section:'箇所',
 fromConceptId:'出発側の概念',toConceptId:'到着側の概念',fromPerTarget:'出発側の件数',toPerSource:'到着側の件数',fromLabel:'出発側の表示件数',toLabel:'到着側の表示件数',fromSubsystemId:'出発側のサブシステム',toSubsystemId:'到着側のサブシステム',flowDirection:'向き',
 reviewer:'レビュー担当',roleId:'担当ロール',relatedActivityIds:'関連業務',graph:'レビュー対象の図',conceptIds:'対象概念',nodes:'図の概念',edges:'図の関係',subsystemViews:'サブシステム別の表示',structureStatements:'構造についての確認事項',sampleIds:'サンプル',capabilities:'機能',limitations:'制約',questions:'確認事項',hypotheses:'仮説',
 samples:'サンプル',testSpecification:'機能とチェックの対応',decisionExampleIds:'判定表の例',decisionCheckIds:'判定のチェック',resultCheckIds:'結果のチェック',meaning:'意味',when:'条件',card:'対象の概念',informationId:'情報項目',cells:'値',columnId:'対象の列',linkId:'リンク先',empty:'空の場合の表示',
 conceptId:'対象の概念',sourceActivityIds:'根拠となる業務',relationIds:'対象の関係',scope:'対象範囲',fromViewId:'出発側の表示',toViewId:'到着側の表示',handoffIds:'受渡し',activityViews:'業務別の表示',creatorActivityIds:'作成業務',sampleCaption:'サンプルの説明',landscapeRelationships:'レビュー間の関係',reviewBoundaries:'レビュー間の境界',from:'出発側',to:'到着側',promise:'受渡しの約束',
 unit:'単位',trueLabel:'真の場合の表示',falseLabel:'偽の場合の表示',uri:'リンク先',targetId:'参照先',value:'値'
};
const hashPath=path=>'c-'+slug(path);
const infoId=path=>'cf-'+slug(path);
const edgeId=path=>'cr-'+slug(path);
function addNode(id,typeName,logicalName,description){
 if(nodes.has(id))return nodes.get(id);
 const name=typeName===logicalName?logicalName:`${logicalName}（${typeName}）`;
 const c={id,name,subsystemId:'format-review',information:[],reason:'Alder JSON概念モデルのレビュー候補。',description,businessObjectIds:[],activityLinks:[],sourceRefs:[],reviewState:'未レビュー'};
 model.concepts.push(c);nodes.set(id,c);model.meta.conceptNames[id]={typeName,logicalName};return c;
}
function labelFor(path){
 if(path.endsWith('.basedOn.revision'))return '原典の改訂';
 if(path.endsWith('.basedOn.verification'))return '原典の確認状態';
 if(path.includes('.graph.subsystemViews.'))return ({nodes:'レビューのサブシステム別表示に含む概念',edges:'レビューのサブシステム別表示に含む関係',handoffIds:'レビューのサブシステム別表示に含む受渡し'})[path.split('.').at(-1)]??labels[path.split('.').at(-1)]??path.split('.').at(-1);
 if(path.includes('.presentation.subsystemViews.'))return ({nodes:'全体のサブシステム別表示に含む概念',edges:'全体のサブシステム別表示に含む関係',handoffIds:'全体のサブシステム別表示に含む受渡し'})[path.split('.').at(-1)]??labels[path.split('.').at(-1)]??path.split('.').at(-1);
 const key=path.replace(/\[\]/g,'').split('.').at(-1);return labels[key]??key;
}
function addEdge(id,from,to,role,fromCount,toCount,kind,condition,physical){
 if(model.relations.some(r=>r.id===id))throw Error('Duplicate relation '+id);
 const r={id,fromConceptId:from,toConceptId:to,fromPerTarget:fromCount,toPerSource:toCount,condition,reviewState:'未レビュー',sourceRefs:[],fromLabel:fromCount,toLabel:toCount,kind};
 model.relations.push(r);model.meta.relationNames[id]=role;
 if(physical)model.meta.relationPhysicalFields.push({relationId:id,physicalName:physical});
 return id;
}
function sampleValues(path){
 const match=path.match(/^(Package|Check|State|Concept)(.*)$/);if(!match)return [];
 let values=[samples[match[1]]].filter(x=>x!==undefined);
 for(const part of match[2].split('.').filter(Boolean)){
  const key=part.replace(/\[\]/g,''),depth=(part.match(/\[\]/g)||[]).length;
  values=values.flatMap(value=>value!=null&&typeof value==='object'&&Object.hasOwn(value,key)?[value[key]]:[]);
  for(let i=0;i<depth;i++)values=values.flatMap(value=>Array.isArray(value)?value:[]);
 }
 return values;
}
function withSample(mapping,path){
 const values=sampleValues(path),v=values.find(x=>x!==null&&x!==''&&!Array.isArray(x)&&typeof x!=='object')??values.find(x=>x===null||typeof x!=='object')??values.find(x=>Array.isArray(x)&&JSON.stringify(x).length<=200);
 if(v!==undefined){if(path.startsWith('Concept.')){mapping.sampleValue=structuredClone(v);mapping.sampleKind='reference';}else mapping.sampleValue=structuredClone(v);}
 if(Object.hasOwn(references,path))mapping.referenceValue=references[path];
 return mapping;
}
function resolve(s){if(s?.$ref)return schema.$defs[s.$ref.split('/').at(-1)];return s;}
function variants(s){s=resolve(s);return s?.anyOf?s.anyOf.map(resolve):[s];}
function objectUnion(s){
 const vs=variants(s),objects=vs.filter(x=>x?.type==='object'&&x.properties);
 if(!objects.length||objects.length!==vs.filter(x=>x?.type!=='null').length)return null;
 const properties={};for(const o of objects)for(const [key,value] of Object.entries(o.properties)){
  if(!properties[key])properties[key]=value;
  else if(JSON.stringify(properties[key])!==JSON.stringify(value))properties[key]={anyOf:[properties[key],value]};
 }
 const required=Object.keys(properties).filter(key=>objects.every(o=>(o.required??[]).includes(key)));
 return {properties,required,variants:objects.length};
}
function valueType(s){
 s=resolve(s);if(!s)return '未定義';
 if(s.type==='array')return valueType(s.items)+'[]';
 if(s.anyOf){const names=[...new Set(s.anyOf.map(valueType))];return names.join(' | ');}
 if(s.type)return s.type==='object'&&!s.properties?'object（任意構造）':s.type;
 if(s.enum)return [...new Set(s.enum.map(x=>typeof x))].join(' | ');
 return 'object（任意構造）';
}
function addField(conceptId,path,physical,type,optional=false,variant=false){
 const c=nodes.get(conceptId);if(!c)throw Error('Missing concept '+conceptId);
 const existing=c.information.find(i=>{const x=infoMap.get(i.id);return x?.physicalName===physical;});
 if(existing){const m=infoMap.get(existing.id);m.sourceSchemaPath=path;if(!m.valueType)m.valueType=type;model.meta.schemaCoverage.push({path,representation:'attribute',conceptId,informationId:existing.id});return existing.id;}
 const id=infoId(path);if(infoMap.has(id))throw Error('Duplicate field '+path);
 const label=labelFor(path)+(variant?'（種類による）':'');c.information.push({id,name:label});
 const m=withSample({informationId:id,physicalName:physical,relationIds:[],valueType:type,sourceSchemaPath:path,...(optional?{optional:true}:{})},path);
 model.meta.fieldMappings.push(m);infoMap.set(id,m);model.meta.schemaCoverage.push({path,representation:'attribute',conceptId,informationId:id});return id;
}
const refs={
 'State.objectId':['n-object','対象','1','状態遷移の対象。'],
 'State.transitions[].activityId':['n-activity','実行する業務','1','この遷移を起こす業務。'],
 'State.transitions[].exceptionId':['n-exception','関連する例外','0..1','例外が指定された場合。'],
 'State.transitions[].fromId':['State.states[]','変更前の状態','0..1','通常は状態を参照する。新規作成時の @new は状態を参照しない。'],
 'State.transitions[].toId':['State.states[]','変更後の状態','0..1','通常は状態を参照する。未決 @unknown と作成なし @none は状態を参照しない。'],
 'Check.index[].activityId':['n-activity','パッケージ内の対象業務','0..1','原典がパッケージ内の業務設計書の場合。外部目録の場合と合わせて一件。'],
 'Check.index[].checkIds':['n-check','対象チェック項目','0..N','この業務に対応するチェック項目。'],
 'Check.sections[].activityId':['n-activity','パッケージ内の対象業務','0..1','業務に対応する節で、原典がパッケージ内の場合。'],
 'Check.guarantees[].sectionId':['Check.sections[]','所属する節','1','保証が属する節。'],
 'Check.guarantees[].blocks[].exampleId':['Check.examples[]','対象サンプル','0..1','サンプルを参照する記述の場合。'],
 'Check.examples[].guaranteeId':['Check.guarantees[]','対象の保証','1','サンプルが説明する保証。'],
 'Check.items[].sectionId':['Check.sections[]','所属する節','1','チェック項目が属する節。'],
 'Concept.relatedStates[].documentId':['n-state-doc','対象の状態遷移文書','1','同じ業務設計に基づく状態遷移文書。'],
 'Concept.subsystems[].activityIds':['n-activity','関連業務','0..N','サブシステムに関連する業務。'],
 'Concept.concepts[].subsystemId':['Concept.subsystems[]','所属サブシステム','1','概念が属するサブシステム。'],
 'Concept.concepts[].information[].responsibleSubsystemId':['Concept.subsystems[]','責任を持つサブシステム','0..1','指定されている場合。'],
 'Concept.concepts[].businessObjectIds':['n-object','対応する対象','0..N','概念に対応する業務上の対象。'],
 'Concept.concepts[].activityLinks[].activityId':['n-activity','関連業務','1','概念を利用する業務。'],
 'Concept.relations[].fromConceptId':['Concept.concepts[]','出発側の概念','1','関係の出発側。'],
 'Concept.relations[].toConceptId':['Concept.concepts[]','到着側の概念','1','関係の到着側。'],
 'Concept.handoffs[].fromSubsystemId':['Concept.subsystems[]','出発側のサブシステム','1','受渡しの出発側。'],
 'Concept.handoffs[].toSubsystemId':['Concept.subsystems[]','到着側のサブシステム','1','受渡しの到着側。'],
 'Concept.handoffs[].activityIds':['n-activity','関連業務','0..N','受渡しに関連する業務。'],
 'Concept.reviewGroups[].subsystemId':['Concept.subsystems[]','対象サブシステム','1','レビュー対象のサブシステム。'],
 'Concept.reviewGroups[].reviewer.roleId':['n-who','レビュー担当ロール','1','当該業務設計書のRoleを参照する。'],
 'Concept.reviewGroups[].relatedActivityIds':['n-activity','関連業務','0..N','レビューに関連する業務。'],
 'Concept.reviewGroups[].graph.conceptIds':['Concept.concepts[]','対象概念','0..N','レビュー図で扱う概念。'],
 'Concept.reviewGroups[].graph.nodes[].conceptId':['Concept.concepts[]','対応する概念','1','表示の元となる概念。'],
 'Concept.reviewGroups[].graph.edges[].fromConceptId':['Concept.concepts[]','出発側の概念','1','レビュー図に含まれる概念。'],
 'Concept.reviewGroups[].graph.edges[].toConceptId':['Concept.concepts[]','到着側の概念','1','レビュー図に含まれる概念。'],
 'Concept.reviewGroups[].graph.edges[].relationIds':['Concept.relations[]','対応する概念間の関係','0..N','表示の元となる関係。'],
 'Concept.reviewGroups[].graph.subsystemViews.nodes[].conceptId':['Concept.concepts[]','表示の元となる概念','1','表示の元となる概念。'],
 'Concept.reviewGroups[].graph.subsystemViews.nodes[].subsystemId':['Concept.subsystems[]','表示先のサブシステム','1','表示先のサブシステム。'],
 'Concept.reviewGroups[].graph.subsystemViews.nodes[].fields[].informationId':['Concept.concepts[].information[]','表示の元となる情報項目','1','表示する概念の情報項目。'],
 'Concept.reviewGroups[].graph.subsystemViews.edges[].fromViewId':['Concept.reviewGroups[].graph.subsystemViews.nodes[]','出発側の表示','1','同じ表示内の概念。'],
 'Concept.reviewGroups[].graph.subsystemViews.edges[].toViewId':['Concept.reviewGroups[].graph.subsystemViews.nodes[]','到着側の表示','1','同じ表示内の概念。'],
 'Concept.reviewGroups[].graph.subsystemViews.edges[].relationIds':['Concept.relations[]','対応する概念間の関係','1..N','概念間の関係を順につないだ経路。'],
 'Concept.reviewGroups[].graph.subsystemViews.handoffIds':['Concept.handoffs[]','レビューの表示に含む受渡し','0..N','表示されたサブシステム間の受渡し。'],
 'Concept.presentation.subsystemViews.handoffIds':['Concept.handoffs[]','全体の表示に含む受渡し','0..N','表示されたサブシステム間の受渡し。'],
 'Concept.reviewGroups[].capabilities[].samples[].checkIds':['n-check','根拠となるチェック項目','0..N','0.2では1件以上。0.1のサンプルにはこの参照がない。'],
 'Concept.reviewGroups[].capabilities[].samples[].blocks[].card':['Concept.concepts[]','サンプルの対象概念','1','レビュー図に含まれる概念。'],
 'Concept.reviewGroups[].capabilities[].samples[].blocks[].columns[].informationId':['Concept.concepts[].information[]','列の情報項目','1','列が示す概念の情報項目。'],
 'Concept.reviewGroups[].capabilities[].samples[].blocks[].rows[].cells[].columnId':['Concept.reviewGroups[].capabilities[].samples[].blocks[].columns[]','対応する列','1','同じサンプル表の列。'],
 'Concept.reviewGroups[].capabilities[].testSpecification.decisionExampleIds':['Check.examples[]','判定表の例','0..N','対応する判定表の例。'],
 'Concept.reviewGroups[].capabilities[].testSpecification.decisionCheckIds':['n-check','判定のチェック項目','0..N','判定に対応するチェック項目。'],
 'Concept.reviewGroups[].capabilities[].testSpecification.resultCheckIds':['n-check','結果のチェック項目','0..N','結果に対応するチェック項目。'],
 'Concept.reviewGroups[].capabilities[].testSpecification.sampleIds':['Concept.reviewGroups[].capabilities[].samples[]','結果のサンプル','0..N','同じ機能のサンプル。'],
 'Concept.reviewGroups[].structureStatements[].sampleIds':['Concept.reviewGroups[].capabilities[].samples[]','根拠となるサンプル','0..N','構造確認の根拠となるサンプル。']
};
const flatten={
 'Check.items[].fields':'11種類の記述はチェック項目自身の内容。独立した識別やライフサイクルはない。',
 'Concept.reviewGroups[].reviewer':'Roleへの参照をレビュー単位の関係として持つ。',
 'Concept.reviewGroups[].graph':'対象概念・表示・関係はレビュー単位に属する。',
 'Concept.reviewGroups[].graph.subsystemViews':'レビューのサブシステム別表示をレビュー単位にまとめる。',
 'Concept.reviewGroups[].capabilities[].testSpecification':'機能とチェック・サンプルの対応を機能にまとめる。',
 'Concept.reviewGroups[].meta':'レビューの確認事項と仮説はレビュー単位に属する。',
 'Concept.presentation':'表示設定の情報は概念モデル文書に属する。',
 'Concept.presentation.subsystemViews':'全体のサブシステム別表示を概念モデル文書にまとめる。'
};
function addPresence(id,path){
 const key=path.split('.').at(-1),parentPath=path.slice(0,-key.length-1),parents=sampleValues(parentPath);
 const field=infoId('presence:'+path),name=path.endsWith('testSpecification')?'機能とチェックの対応を定義済み':'サブシステム別表示を定義済み';
 nodes.get(id).information.push({id:field,name});
 const mapping={informationId:field,physicalName:path,relationIds:[],valueType:'boolean',logicalMeaning:'省略と明示された空を区別する。'};
 if(parents.length){mapping.sampleValue=Object.hasOwn(parents[0],key);mapping.sampleKind='reference';}
 model.meta.fieldMappings.push(mapping);infoMap.set(field,mapping);
 return field;
}
function identityFor(path,s){
 const existing=path==='Package.externalDocuments[]'?'n-external':path==='Check.items[]'?'n-check':undefined;
 if(existing)return existing;
 if(firstBySchema.has(s))return firstBySchema.get(s).id;
 return hashPath(path);
}
function arrayElementInfo(s){let t=resolve(s),levels=0;while(t?.type==='array'){levels++;t=resolve(t.items);}return {levels,element:t};}
function processFields(path,s,id){
 const u=objectUnion(s);if(!u)throw Error('Expected object: '+path);
 for(const [key,field] of Object.entries(u.properties)){
  const property=path+'.'+key,versionDependent=['Concept.reviewGroups[].capabilities[].testSpecification','Concept.reviewGroups[].capabilities[].samples[].checkIds'].includes(property);
  const optional=!u.required.includes(key)||versionDependent,variant=(u.variants>1&&optional)||versionDependent;
  if(path==='Package'&&key==='documents')continue;
  if(['Check','State','Concept'].includes(path)&&key==='basedOn'){
   for(const [sub,subschema] of Object.entries(field.properties)){
    const subpath=property+'.'+sub;
    if(sub==='documentId'){model.meta.schemaCoverage.push({path:subpath,representation:'relation',conceptId:id});continue;}
    addField(id,subpath,subpath,valueType(subschema),false,false);
   }
   model.meta.schemaCoverage.push({path:property,representation:'flattened',conceptId:id});continue;
  }
  const f=resolve(field),element=arrayElementInfo(f),isArray=element.levels>0;
  const object=objectUnion(element.element);
  if(object&&Object.hasOwn(flatten,property)){
   const coverage={path:property,representation:'flattened',conceptId:id,note:flatten[property]};
   if(optional)coverage.stateInformationId=addPresence(id,property);
   model.meta.schemaCoverage.push(coverage);
   processFields(property,element.element,id);continue;
  }
  if(refs[property]){
   const fieldId=addField(id,property,property,valueType(f),optional,variant);
   refQueue.push({property,id,fieldId,spec:refs[property]});continue;
  }
  if(object){
   let owner=id,basePath=property;
   // A nested array is a row/cell of an ordered table, not a fabricated ID.
   for(let level=1;level<element.levels;level++){
    basePath+='[]';const [typeName,logicalName]=types[basePath]??['ArrayEntry',labelFor(property)+'の要素'];
    const child=hashPath(basePath);addNode(child,typeName,logicalName,'順序を持つ配列の一要素。');paths.set(basePath,child);
    addEdge(edgeId(basePath),owner,child,logicalName,'1','0..N','down','配列に含まれる一要素。',basePath);
    model.meta.schemaCoverage.push({path:basePath,representation:'relation',conceptId:owner,relationId:edgeId(basePath)});owner=child;
   }
   const childPath=property+'[]'.repeat(element.levels),shared=firstBySchema.get(element.element);
   const child=identityFor(childPath,element.element);
   if(shared){model.meta.schemaAliases.push({from:childPath,to:shared.path});}
   else{
    const [typeName,logicalName]=types[childPath]??[childPath.replace(/[^A-Za-z0-9]+/g,' ').trim().split(/\s+/).map(x=>x[0].toUpperCase()+x.slice(1)).join(''),labelFor(property)];
    addNode(child,typeName,logicalName,'0.7候補の構造に基づく概念モデルの検討案。');firstBySchema.set(element.element,{id:child,path:childPath});paths.set(childPath,child);
   }
   paths.set(childPath,child);
   const validatedNonempty=['State.states','Package.externalDocuments[].activities','Check.guarantees[].blocks'].includes(property);
   const min=isArray?(!optional&&(f.minItems||validatedNonempty)?'1..N':'0..N'):(optional||variants(f).some(x=>x?.type==='null')?'0..1':'1');
   const role=(isArray&&element.levels>1)?'セル':labelFor(property);
   const relation=edgeId(property+'#'+owner);addEdge(relation,owner,child,role,'1',min,'down',versionDependent?'0.2で追加され、0.1にはない。':object.variants>1?'種類によって持つ項目が異なる。':'',property);
   model.meta.schemaCoverage.push({path:property,representation:'relation',conceptId:owner,relationId:relation});
   if(!shared)processFields(childPath,element.element,child);
  }else{
   const aliases={
    'Package.format':'format','Package.formatVersion':'formatVersion','Package.revision':'revision',
    'Check.id':'retained Check document.id','Check.revision':'retained Check document.revision',
    'Check.items[].id':'retained Check.items.id','Check.items[].checkId':'retained Check.items.checkId','Check.items[].reviewState':'retained Check.items.reviewState',
    'Package.externalDocuments[].id':'source.externalDocuments.id','Package.externalDocuments[].revision':'source.externalDocuments.revision'
   };
   addField(id,property,aliases[property]??property,valueType(f),optional,variant);
  }
 }
}
// Package documents share one physical documents array, not four arrays.
addNode('n-package','DocumentPackage','文書パッケージ','文書と、その原典・外部目録をまとめる。');paths.set('Package','n-package');
for(const [prop,type] of [['format','string'],['formatVersion','string'],['revision','string']]){
 const field=infoId('Package.'+prop);nodes.get('n-package').information.push({id:field,name:labelFor('Package.'+prop)});
 const mapping=withSample({informationId:field,physicalName:prop,relationIds:[],valueType:type,sourceSchemaPath:'Package.'+prop},'Package.'+prop);model.meta.fieldMappings.push(mapping);infoMap.set(field,mapping);
}
const docs=[['n-bd','業務設計書'],['n-checkdoc','チェック文書'],['n-state-doc','状態遷移文書'],['n-concept-doc','概念モデル文書']];
addNode('n-state-doc','StateTransitionDocument','状態遷移文書','対象の状態と遷移を記述する。');
addNode('n-concept-doc','ConceptModelDocument','概念モデル文書','業務から整理した概念・関係とレビューを記述する。');
const docRelations=docs.map(([target,role])=>addEdge('nr-package-'+target.slice(2),'n-package',target,role,'1','0..N','down',''));
const docsId=infoId('Package.documents');nodes.get('n-package').information.push({id:docsId,name:'文書'});
const docsMap={informationId:docsId,physicalName:'documents[]',relationIds:docRelations,valueType:'array',representation:'relationKey',relationKeyIds:docRelations,sourceSchemaPath:'Package.documents'};
model.meta.fieldMappings.push(docsMap);infoMap.set(docsId,docsMap);model.meta.schemaCoverage.push({path:'Package.documents',representation:'relation',conceptId:'n-package',relationIds:docRelations});
paths.set('Check','n-checkdoc');paths.set('Check.items[]','n-check');paths.set('State','n-state-doc');paths.set('Concept','n-concept-doc');
addEdge('nr-state-basedon','n-state-doc','n-bd','原典の業務設計書','0..N','1','reference','同じパッケージ内の業務設計書と改訂を参照する。','State.basedOn.documentId');
addEdge('nr-concept-basedon','n-concept-doc','n-bd','原典の業務設計書','0..1','1','reference','同じパッケージ内の業務設計書と改訂を参照する。','Concept.basedOn.documentId');
const basedOn=infoMap.get('n-checkdoc-field-3');basedOn.representation='relationKey';basedOn.relationKeyIds=['nr-bd-checkdoc','nr-external-checkdoc'];
for(const [path,root] of Object.entries(roots))processFields(path,root,paths.get(path));
for(const ref of refQueue){
 const [target,role,count,condition]=ref.spec,to=nodes.has(target)?target:paths.get(target);
 if(!to)throw Error('Unknown reference target '+ref.property+' -> '+target);
 const inverse=ref.property==='State.objectId'?'0..1':'0..N';
 const relation=edgeId(ref.property+'#ref');addEdge(relation,ref.id,to,role,inverse,count,'reference',condition,ref.property);
 const mapping=infoMap.get(ref.fieldId);mapping.representation='relationKey';mapping.relationKeyIds=[relation];
 const coverage=model.meta.schemaCoverage.find(x=>x.path===ref.property);coverage.representation='relation';coverage.relationId=relation;
}
// A Check may cite an external Business Design inventory rather than an
// in-package Activity. Preserve both alternatives without treating them as
// the same entity or silently requiring an in-package source.
for(const path of ['Check.index[].activityId','Check.sections[].activityId']){
 const field=model.meta.fieldMappings.find(x=>x.sourceSchemaPath===path),coverage=model.meta.schemaCoverage.find(x=>x.path===path);
 const owner=coverage.conceptId,target=paths.get('Package.externalDocuments[].activities[]');
 const role='外部目録の対象業務',id=edgeId(path+'#external');
 addEdge(id,owner,target,role,'0..N','0..1','reference','原典が外部業務設計書の場合。',path);
 field.relationKeyIds.push(id);coverage.relationIds=[coverage.relationId,id];
}
// A rich-text reference is polymorphic. The target depends on kind and the
// referenced ID; all alternatives below come from the existing validator.
const richPath='Check.intro[].targetId',richField=model.meta.fieldMappings.find(x=>x.sourceSchemaPath===richPath),richOwner=paths.get('Check.intro[]');
const richTargets=[['n-checkdoc','参照先のチェック文書'],['Check.sections[]','参照先の節'],['Check.guarantees[]','参照先の保証'],['Check.examples[]','参照先のサンプル'],['n-check','参照先のチェック項目'],['Check.notes[]','参照先の注記'],['n-row','参照先の判定行'],['n-exception','参照先の例外']];
const richRelations=richTargets.map(([target,role])=>{
 const to=nodes.has(target)?target:paths.get(target);if(!to)throw Error('Missing rich target '+target);
 return addEdge(edgeId(richPath+'#'+target),richOwner,to,role,'0..N','0..1','reference','参照の要素の場合、対象IDに合う種類の一件を参照する。',richPath);
});
richField.representation='relationKey';richField.relationKeyIds=richRelations;
Object.assign(model.meta.schemaCoverage.find(x=>x.path===richPath),{representation:'relation',relationIds:richRelations});
// A Concept source reference can name its in-package BD or a declared State
// document. The type and identifier of the source item stay explicit.
const conceptSourcePath='Concept.concepts[].sourceRefs[].documentId',conceptSourceField=model.meta.fieldMappings.find(x=>x.sourceSchemaPath===conceptSourcePath),conceptSourceOwner=paths.get('Concept.concepts[].sourceRefs[]');
const conceptSourceRelations=[['n-bd','根拠の業務設計書'],['n-state-doc','根拠の状態遷移文書']].map(([target,role])=>addEdge(edgeId(conceptSourcePath+'#'+target),conceptSourceOwner,target,role,'0..N','0..1','reference','原典はこの概念モデルの業務設計書または明示された状態遷移文書。',conceptSourcePath));
conceptSourceField.representation='relationKey';conceptSourceField.relationKeyIds=conceptSourceRelations;
Object.assign(model.meta.schemaCoverage.find(x=>x.path===conceptSourcePath),{representation:'relation',relationIds:conceptSourceRelations});
// SourceRecord.documentId can refer to any supported in-package document or
// an external Business Design entry. Each alternative is conditional; the
// source as a whole refers to exactly one document.
const sourcePath='Package.sources[].documentId';
const sourceField=model.meta.fieldMappings.find(x=>x.sourceSchemaPath===sourcePath);
const sourceOwner=paths.get('Package.sources[]');
const sourceTargets=[['n-bd','原典の業務設計書'],['n-checkdoc','原典のチェック文書'],['n-state-doc','原典の状態遷移文書'],['n-concept-doc','原典の概念モデル文書'],['n-external','原典の外部業務設計書']];
const sourceRelations=sourceTargets.map(([target,role])=>addEdge(edgeId(sourcePath+'#'+target),sourceOwner,target,role,'0..N','0..1','reference','文書の種類に応じたいずれか一件を参照する。',sourcePath));
sourceField.representation='relationKey';sourceField.relationKeyIds=sourceRelations;
Object.assign(model.meta.schemaCoverage.find(x=>x.path===sourcePath),{representation:'relation',relationIds:sourceRelations});
for(const [path,ids] of [
 ['Check.basedOn.documentId',['nr-bd-checkdoc','nr-external-checkdoc']],
 ['State.basedOn.documentId',['nr-state-basedon']],
 ['Concept.basedOn.documentId',['nr-concept-basedon']]
])Object.assign(model.meta.schemaCoverage.find(x=>x.path===path),{relationIds:ids});
// Add business facts present in the source schema but omitted from the earlier
// 25-structure projection. Existing field IDs remain stable in this candidate.
addNode('n-flow-step','FlowStep','フロー内の手順','一つの標準フローか一つの例外フローと手順の対応。順序と実施条件はこの対応に属し、同じ業務の複数の流れから共通の手順を参照できる。');
const extras={
 'n-bd':[['schemaVersion','文書の版','string'],['kind','文書の種類','string'],['preface','前書き','string'],['scope','対象範囲の説明','string']],
 'n-object':[['icon','アイコン','string']],
 'n-information':[['description','説明','string']],
 'n-activity':[['where','場所','string'],['problem','課題','string | null'],['painLevel','課題の程度','string | null']],
 'n-step':[['legacyText','旧手順の記述','string'],['obligation','必須・任意','string'],['appliesWhen','適用条件','string | null'],['effect','操作の効果','string | null']],
 'n-decision':[['note','注記','string | null']],
 'n-axis':[['unit','単位','string'],['trueLabel','真の場合の表示','string'],['falseLabel','偽の場合の表示','string']],
 'n-continuity':[['onInterrupt','中断時の扱い','string | null']],
 'n-relation':[['label','関係の表示名','string']],
 'n-finding':[['sourceId','元の識別子','string'],['kind','確認事項の種類','string'],['content','内容','string'],['unresolvedTargets','未決の対象','string[]']]
};
const tables={ 'n-bd':'businessDesigns','n-object':'objects','n-information':'information','n-activity':'activities','n-step':'steps','n-decision':'decisions','n-axis':'axes','n-continuity':'continuities','n-relation':'relations','n-finding':'findings'};
for(const [id,fields] of Object.entries(extras))for(const [key,label,type] of fields){
 const table=tables[id],path='Normalized.'+table+'.'+key,field=infoId(path),c=nodes.get(id);c.information.push({id:field,name:label});
 const row=(normalized.entities[table]??[]).find(x=>Object.hasOwn(x,key)&&x[key]!==null&&x[key]!=='')??(normalized.entities[table]??[]).find(x=>Object.hasOwn(x,key));
 const mapping={informationId:field,physicalName:table+'.'+key,relationIds:[],valueType:type,...(row?{sampleValue:structuredClone(row[key])}:{})};model.meta.fieldMappings.push(mapping);infoMap.set(field,mapping);
}
// An action may be shared by the standard and exception flows. The condition,
// source ownership key and old obligation apply to its position in a flow.
for(const physical of ['steps.activityId','steps.whenDecisionRowId','steps.obligation','steps.appliesWhen']){
 const mapping=model.meta.fieldMappings.find(item=>item.physicalName===physical),source=nodes.get('n-step'),target=nodes.get('n-flow-step');
 const index=source.information.findIndex(item=>item.id===mapping?.informationId);
 if(index<0)throw Error('Missing flow-specific field '+physical);
 target.information.push(source.information.splice(index,1)[0]);
}
// The logical state distinguishes undecided / known-empty / known-present.
// Source-only flags used for lossless reconstruction are not promoted to
// business entities or shown as if they were the business meaning.
const logicalStates=[
 ['n-step','target','対象項目の確定状態','steps','targetDataState','stepTargetData','stepId'],
 ['n-step','prerequisite','前提手順の確定状態','steps','dependencyState','dependencies','stepId'],
 ['n-exchange','transfer','受渡し項目の確定状態','stepInteractions','dataState','interactionData','stepId'],
 ['n-continuity','retained','保持項目の確定状態','continuities','dataState','continuityData','exceptionId']
];
for(const [id,key,label,table,stateKey,association,ownerKey] of logicalStates){
 const field=infoId('logical.'+key),row=(normalized.entities[table]??[])[0];nodes.get(id).information.push({id:field,name:label});
 const mapping={informationId:field,physicalName:'',relationIds:[],valueType:'string（未決／なし／あり）',logicalSourcePaths:[table+'.'+stateKey,association]};
 if(row){const ownerId=table==='steps'?row.id:row[ownerKey],state=row[stateKey],count=(normalized.entities[association]??[]).filter(x=>x[ownerKey]===ownerId).length;mapping.sampleValue=state==='array'?(count?'あり':'なし'):'未決';}
 model.meta.fieldMappings.push(mapping);infoMap.set(field,mapping);
}
const orderField=infoId('logical.step-order'),firstStep=normalized.entities.steps[0];
nodes.get('n-flow-step').information.push({id:orderField,name:'手順の順序'});
const orderMapping={informationId:orderField,physicalName:'',relationIds:[],valueType:'number',logicalSourcePaths:['steps.ordinal'],logicalMeaning:'標準フローまたは一つの例外フローの中での手順の順序。表示例は1番から数える。',...(firstStep?{sampleValue:firstStep.ordinal+1}:{})};
model.meta.fieldMappings.push(orderMapping);infoMap.set(orderField,orderMapping);
// Conditions are business information even when the specific representation
// is an existing decision row. A source null alone cannot settle the status.
const stepConditionStatus=infoId('logical.step-condition-status');
nodes.get('n-flow-step').information.push({id:stepConditionStatus,name:'実施条件の確定状態'});
const stepConditionMapping={informationId:stepConditionStatus,physicalName:'',relationIds:[],valueType:'string（未決／無条件／条件あり）',logicalMeaning:'この手順を行う条件が未決、無条件、条件ありのどれか。条件ありには判定行による条件も含む。',referenceValue:'条件あり'};
model.meta.fieldMappings.push(stepConditionMapping);infoMap.set(stepConditionStatus,stepConditionMapping);
// An exception belongs to an activity independently of where it can arise.
// Missing source information must not be mistaken for an activity-wide origin.
const exceptionOrigin=infoId('logical.exception-origin');
nodes.get('n-exception').information.push({id:exceptionOrigin,name:'発生箇所'});
const exceptionOriginMapping={informationId:exceptionOrigin,physicalName:'',relationIds:[],valueType:'string（未決／業務全体／手順）',logicalMeaning:'例外の発生箇所が未決か、特定の手順に限らない業務全体か、特定の手順かを区別する。手順が複数ある場合は同じ例外をそれぞれから参照できる。元の記録から分からない場合は未決とする。',referenceValue:'業務全体',referenceSource:'架空の編集業務における中断の例'};
model.meta.fieldMappings.push(exceptionOriginMapping);infoMap.set(exceptionOrigin,exceptionOriginMapping);
// A general exception can occur without an interruption. Its condition and
// outcome are logical facts; source prose is not automatically decomposed.
for(const [key,label,meaning,example] of [
 ['exception-condition','発生条件','業務の目的を達成する前に、例外の扱いが必要になる条件。','編集の途中で下書き保存を選択した場合'],
 ['exception-outcome','例外時の結果','目的が未達のまま中断・終了したときに、後続の業務に影響する結果。','編集内容を確定せず、下書きとして残す']
]){
 const id=infoId('logical.'+key),mapping={informationId:id,physicalName:'',relationIds:[],valueType:'string',logicalMeaning:meaning,referenceValue:example,referenceSource:'架空の編集業務における中断の例'};
 nodes.get('n-exception').information.push({id,name:label});model.meta.fieldMappings.push(mapping);infoMap.set(id,mapping);
}
// A missing referenced State alone cannot distinguish @none from @unknown.
// Preserve that business distinction explicitly while keeping JSON sentinels
// as source mappings rather than declaring physical columns.
const transition=nodes.get(paths.get('State.transitions[]'));
for(const [key,label,type,path,reference] of [
 ['state-from-kind','変更前の状態の種類','string（新規／既存の状態）','State.transitions[].fromId','新規'],
 ['state-to-kind','変更後の状態の種類','string（状態／作成なし／未決）','State.transitions[].toId','状態']
]){
 const field=infoId('logical.'+key);transition.information.push({id:field,name:label});
 const mapping={informationId:field,physicalName:'',relationIds:[],valueType:type,logicalSourcePaths:[path],referenceValue:reference};
 model.meta.fieldMappings.push(mapping);infoMap.set(field,mapping);
 const coverage=model.meta.schemaCoverage.find(x=>x.path===path);coverage.stateInformationId=field;
}
const logicalNotes={
 'nr-step-exchange':'受渡しがある手順だけに付く情報。独立した業務や識別子を意味しない。',
 // The meaning and rationale are authored on the concept itself so the
 // drawer has one complete explanation rather than two duplicate sections.
 'nr-exception-continuity':'',
 'nr-step-party':'手順のFrom／Toに記録された当事者。未記録は当事者が存在しないという確定ではない。',
 'nr-data-dataitem':'同じ情報項目でも、グループごとに含める条件を持てる。構成項目はその関係を表す。'
};
for(const [id,note] of Object.entries(logicalNotes))model.relations.find(x=>x.id===id).condition=note;
// The association is needed because a single Step can be shared by flows but
// have a different order or condition in each. It is not a physical table.
const standardSteps=model.relations.find(x=>x.id==='nr-activity-step');
standardSteps.toConceptId='n-flow-step';
standardSteps.fromPerTarget=standardSteps.fromLabel='0..1';
standardSteps.condition='業務の目的を達成する標準フローの手順。順序と実施条件を持ち、対象の手順を参照する。';
model.meta.relationNames[standardSteps.id]='標準手順';
addEdge('nr-exception-step','n-exception','n-flow-step','例外時の手順','0..1','0..N','down','目的未達で中断・終了するときに行う手順。順序と実施条件を持ち、同じ業務の手順を参照する。');
addEdge('nr-flow-step-definition','n-flow-step','n-step','実行する手順','0..N','1','reference','この流れで実行する手順。同じ業務の標準・例外フローで共通の手順を参照できる。');
addEdge('nr-flow-step-exception','n-flow-step','n-exception','この手順で発生する例外','0..N','0..N','reference','この手順で起きることが分かっている、同じ業務に属する例外。同じ例外を複数の手順から参照できる。判定行で同じ発生条件を表す場合は意味を重複管理しない。判定表への参照だけでは発生手順を確定しない。');
nodes.get('n-activity').description='一つの目的の達成を目指す業務。標準手順で目的を達成し、未達で中断・終了する場合は必要に応じて例外を記録する。';
nodes.get('n-step').description='業務で主体が行う一つの手順の内容。同じ業務の標準フローと例外フローで、共通の手順を参照できる。';
nodes.get('n-exception').description='業務の目的を達成する前に中断・終了する場合の条件、対応と結果。下書きを残す中断のように、エラーではない例外もある。特定の手順で発生する場合と、業務全体で発生する場合を区別し、発生箇所が未決の例外も保持する。';
model.meta.conceptNames['n-continuity'].logicalName='中断・再開の扱い';
nodes.get('n-continuity').name='中断・再開の扱い（InterruptionHandling）';
nodes.get('n-continuity').description='中断する例外で必要な情報をまとめる。中断・再開は別業務として表現することもできるが、配線が複雑になる場合は例外に含める。中断時に保持する情報や必要に応じた再開条件・操作を表し、再開せず終了する場合や別業務で再開する場合もある。';
model.meta.relationNames['nr-exception-continuity']='中断・再開の扱い';
model.meta.relationNames['nr-continuity-interrupted']='中断した位置';
model.meta.relationNames['nr-continuity-resume']='再開する位置';
model.relations.find(x=>x.id==='nr-continuity-interrupted').condition='中断時に作業していた手順。下書きを保存するなどの中断操作そのものではない。特定の位置がない場合や未決の場合は参照しない。';
model.relations.find(x=>x.id==='nr-continuity-resume').condition='再開後に続ける手順。下書きを探して開くなどの再開操作そのものではない。再開しない場合や位置が未決の場合は参照しない。別の業務で再開する場合もある。';
model.meta.relationNames['nr-activity-exception']='定義する例外';
model.relations.find(x=>x.id==='nr-activity-exception').condition='この業務に属する例外の定義。後続の業務に影響するものや扱いを明記する必要があるものを記録する。業務に属すること自体は業務全体で発生することを意味せず、発生箇所を別に区別する。';
// This is the reverse view of the existing ownership, not a second fact or
// a copied information item. The viewer exposes only explicitly named reverse
// navigation, while preserving the original owner-to-item relationship.
model.meta.reverseRelationNames={...(model.meta.reverseRelationNames??{}),'nr-object-information':'所属する対象'};
nodes.get('n-information').description='対象が持つ一つの情報項目。情報項目グループや判定表から参照する場合も、対象に定義した同じ項目を参照する。';
nodes.get('n-axis').description='判定表で条件を整理する観点。情報項目自体とは限らず、同じ項目グループについて値や重複など異なる観点を設けられる。';
model.relations.find(x=>x.id==='nr-dataitem-information').condition='グループに含める情報項目。対象が持つ同じ項目を参照し、グループごとに項目の複製を作らない。';
model.relations.find(x=>x.id==='nr-axis-data').condition='判定軸が参照する情報項目グループ。グループに含まれる項目とその所属先をたどれる。未記録の場合に参照先を推測しない。';
const stepWhen=model.relations.find(x=>x.id==='nr-step-when');stepWhen.fromConceptId='n-flow-step';
stepWhen.condition='この流れで手順を実行する条件を判定表の行として表す場合の参照。別の実施条件があれば併せて保持する。';
// The old ordering construct captures a logical constraint. Its relation to
// conditional prerequisites remains a review question, not a table decision.
model.meta.conceptNames['n-order'].logicalName='順序制約';
nodes.get('n-order').name='順序制約（StepOrderRule）';model.meta.relationNames['nr-activity-order']='順序制約';
model.relations.find(x=>x.id==='nr-activity-order').condition='手順の前後関係や順不同。並列実行を意味するとは限らない。';
// Types below are defined by the candidate's schema or by its normalized
// projection; samples do not create types and an unknown type stays unknown.
const boolKeys=new Set(['activities.scope','objects.scope']);
for(const mapping of model.meta.fieldMappings){if(mapping.valueType||mapping.representation==='relationKey')continue;
 const n=mapping.physicalName;
 if(boolKeys.has(n))mapping.valueType='boolean | null';
 else if(n==='conditions.value')mapping.valueType='string | number | boolean';
 else if(/(?:\.method|\.condition|\.resultText|\.trigger|\.outcome|\.resumeCondition|\.resumeAction)$/.test(n))mapping.valueType='string | null';
 else if(/^(?:businessDesigns|actors|activities|objects|information|data|dataItems|steps|stepInteractions|stepParties|dependencies|orderRules|results|decisions|axes|rows|conditions|rowChecks|exceptions|continuities|relations|findings|source\.externalDocuments|retained Check)/.test(n))mapping.valueType='string';
}
// Crosswalk each property of the 0.7 Business Design to the normalized
// conceptual candidate. Structural wrappers are recorded as flattened and
// repeated decision IDs as derived; neither is silently discarded.
const bdCoverage=[];
function bdField(path,physical,extra={}){
 const mapping=model.meta.fieldMappings.find(x=>x.physicalName===physical);
 if(!mapping)throw Error('Missing BD property mapping: '+path+' -> '+physical);
 const owner=model.concepts.find(c=>c.information.some(x=>x.id===mapping.informationId));
 if(!owner)throw Error('Missing BD field owner: '+path);
 bdCoverage.push({path,representation:mapping.representation==='relationKey'?'relation':'attribute',conceptId:owner.id,informationId:mapping.informationId,...(mapping.relationKeyIds?{relationIds:mapping.relationKeyIds}:{}),...extra});
}
function bdFields(prefix,table,keys){for(const key of keys.split(' '))bdField(prefix+'.'+key,table+'.'+key);}
function bdRelation(path,...ids){for(const id of ids)if(!model.relations.some(x=>x.id===id))throw Error('Missing BD relation '+id);bdCoverage.push({path,representation:'relation',relationIds:ids});}
function bdFlat(path,conceptId,note){if(!nodes.has(conceptId))throw Error('Missing BD flattened concept '+conceptId);bdCoverage.push({path,representation:'flattened',conceptId,note});}
bdFields('BD','businessDesigns','id schemaVersion kind revision title preface scope');
bdRelation('BD.objects','nr-bd-object');bdFields('BD.objects[]','objects','id name scope icon');
bdRelation('BD.objects[].information','nr-object-information');bdFields('BD.objects[].information[]','information','id name description');
bdRelation('BD.activities','nr-bd-activity');bdFields('BD.activities[]','activities','id name scope why when where problem painLevel');
bdRelation('BD.activities[].who','nr-who-activity');
bdField('BD.activities[].who.kind','actors.kind');bdField('BD.activities[].who.roleId','actors.id',{note:'roleの場合に参照するRoleと同一の主体ID。'});bdField('BD.activities[].who.name','actors.name',{note:'system／schedulerの場合の名前。'});
bdFlat('BD.activities[].procedure','n-activity','手順の所有関係に展開。');
bdRelation('BD.activities[].procedure.steps','nr-activity-step');
bdCoverage.find(x=>x.path==='BD.activities[].procedure.steps').orderInformationId=orderField;
bdCoverage.find(x=>x.path==='BD.activities[].procedure.steps').note='旧JSONの手順を標準・例外に自動分類しない。旧手順の順序・条件と元の記録を保持して移行時に対応を確認する。';
const sp='BD.activities[].procedure.steps[]';bdFields(sp,'steps','id action method legacyText obligation appliesWhen effect');
bdCoverage.find(x=>x.path===sp+'.appliesWhen').stateInformationId=stepConditionStatus;
bdCoverage.find(x=>x.path===sp+'.obligation').note='旧optionalを無条件の必須手順に変換しない。実施を選べた意味と元の値を保持し、条件・フローへの対応を確認する。';
bdRelation(sp+'.whatDataIds','nr-step-data');bdRelation(sp+'.exchange','nr-step-exchange');bdField(sp+'.exchange.kind','steps.exchangeKind');
bdFields(sp+'.exchange','stepInteractions','phase direction objectId relationId pairedStepId');bdRelation(sp+'.exchange.dataIds','nr-exchange-data');
bdRelation(sp+'.parties','nr-step-party');
for(const side of ['from','to']){
 const path=sp+'.parties.'+side;bdFlat(path,'n-party','side='+side+'で区別する。');
 bdField(path+'.kind','stepParties.kind',{note:'side='+side});bdField(path+'.objectId','stepParties.objectId',{note:'side='+side});
}
bdRelation(sp+'.decisionIds','nr-step-decision');bdRelation(sp+'.whenDecision','nr-step-when');
bdField(sp+'.whenDecision.rowId','steps.whenDecisionRowId');bdFlat(sp+'.whenDecision.decisionId','n-row','判定行から所属する判定表をたどる。旧JSONの所属は変換前に検証する。');
bdRelation(sp+'.dependsOn','nr-step-dependency');
bdField(sp+'.dependsOn[].stepId','dependencies.prerequisiteStepId');bdRelation(sp+'.dependsOn[].whenDecision','nr-dependency-when');
bdField(sp+'.dependsOn[].whenDecision.rowId','dependencies.whenDecisionRowId');bdFlat(sp+'.dependsOn[].whenDecision.decisionId','n-row','判定行から所属する判定表をたどる。');
const op='BD.activities[].procedure.orderRules';bdRelation(op,'nr-activity-order');bdFields(op+'[]','orderRules','kind beforeId afterId');bdRelation(op+'[].stepIds','nr-order-member');
bdRelation('BD.activities[].results','nr-activity-result');bdFields('BD.activities[].results[]','results','id text');
const dp='BD.activities[].decisions';bdRelation(dp,'nr-activity-decision');bdFields(dp+'[]','decisions','id title kind note');
bdRelation(dp+'[].appliesWhen','nr-decision-when');bdField(dp+'[].appliesWhen.rowId','decisions.appliesWhenRowId');bdFlat(dp+'[].appliesWhen.decisionId','n-row','判定行から所属する判定表をたどる。');
const ap=dp+'[].axes';bdRelation(ap,'nr-decision-axis');bdFields(ap+'[]','axes','id name unit trueLabel falseLabel');bdRelation(ap+'[].dataIds','nr-axis-data');
const rp=dp+'[].rows';bdRelation(rp,'nr-decision-row');bdFields(rp+'[]','rows','id');
bdRelation(rp+'[].conditions','nr-row-condition');bdFields(rp+'[].conditions[]','conditions','axisId kind operator value');
bdFlat(rp+'[].result','n-row','判定行の結果属性と参照に展開。');bdField(rp+'[].result.kind','rows.resultKind');bdField(rp+'[].result.text','rows.resultText');bdRelation(rp+'[].result.dataIds','nr-row-data');bdRelation(rp+'[].result.exceptionIds','nr-row-exception');
bdRelation(rp+'[].checkRefs','nr-row-checklink');bdFields(rp+'[].checkRefs[]','rowChecks','checkId coverage');
bdRelation('BD.relations','nr-bd-relation');bdFields('BD.relations[]','relations','id kind fromId toId label');
bdRelation('BD.findings','nr-bd-finding');bdFields('BD.findings[]','findings','id sourceId kind status scope unresolvedTargets summary content');bdRelation('BD.findings[].targetIds','nr-finding-activity','nr-finding-object');
bdRelation('BD.roles','nr-bd-actor');bdFields('BD.roles[]','actors','id name color');
bdRelation('BD.exceptions','nr-activity-exception');bdFields('BD.exceptions[]','exceptions','id activityId name description');
const ep='BD.exceptions[].continuity';bdRelation(ep,'nr-exception-continuity');bdFields(ep,'continuities','trigger onInterrupt outcome resumeCondition resumeAction');
bdRelation(ep+'.interruptedAtStepId','nr-continuity-interrupted');bdRelation(ep+'.resumeAtStepId','nr-continuity-resume');bdRelation(ep+'.retainedDataIds','nr-continuity-data');
bdRelation('BD.data','nr-bd-data');bdFields('BD.data[]','data','id name');bdRelation('BD.data[].items','nr-data-dataitem');bdFields('BD.data[].items[]','dataItems','informationId condition');
for(const [path,key] of [
 [sp+'.whatDataIds','target'],[sp+'.exchange.dataIds','transfer'],
 [sp+'.dependsOn','prerequisite'],[ep+'.retainedDataIds','retained']
]){
 const coverage=bdCoverage.find(x=>x.path===path),mapping=infoMap.get(infoId('logical.'+key));
 if(!coverage||!mapping)throw Error('Missing nullable/absent state mapping '+path);
 coverage.stateInformationId=mapping.informationId;
}
bdCoverage.find(x=>x.path===sp+'.parties').note='当事者が未記録の場合は未決。元JSONにおける省略と明示nullの保持は移行時の別課題。';
model.meta.schemaCoverage.push(...bdCoverage);
// The old null does not tell us whether a condition/problem was confirmed
// absent. Keep the distinction in the review model without migrating data.
for(const [owner,key,label,type,paths,meaning] of [
 ['n-dataitem','logical.group-condition-status','条件の確定状態','string（未決／無条件／条件あり）',['dataItems.condition'],'無条件と条件未決を区別する。条件ありの場合は条件の内容が必要。'],
 ['n-activity','logical.problem-status','課題の確認状態','string（未確認／課題なし／課題あり）',['activities.problem','activities.painLevel'],'課題の未確認と課題なしを区別する。課題ありの場合は課題の内容が必要。']
]){
 const id=infoId(key),mapping={informationId:id,physicalName:'',relationIds:[],valueType:type,logicalSourcePaths:paths,logicalMeaning:meaning,referenceValue:key.includes('problem')?'未確認':'未決'};
 nodes.get(owner).information.push({id,name:label});model.meta.fieldMappings.push(mapping);infoMap.set(id,mapping);
}
// These are reviewable proposals about Alder's business concepts. They are
// deliberately not inferred from the current JSON type or a sample value.
for(const concept of model.concepts)for(const info of concept.information){
 const mapping=infoMap.get(info.id);if(mapping&&mapping.representation!=='relationKey')Object.assign(mapping,nullabilityProposal(concept,info,mapping));
 if(mapping&&!mapping.logicalMeaning){const meaning=attributeMeaning(mapping);if(meaning)mapping.logicalMeaning=meaning;}
}
model.meta.nullabilityProposal='業務設計に基づく未承認の候補。未決、なし、非該当と移行時の元記録を区別する。';
// Real Alder business records are additional, labelled references. Scope is
// intentionally omitted: the old and proposed scope semantics differ.
const actualReferences={
 'businessDesigns.id':actualBusiness.id,'businessDesigns.title':actualBusiness.title,
 'businessDesigns.revision':actualBusiness.revision,'businessDesigns.scope':actualBusiness.scope,
 'actors.name':actualActivity.who,'activities.id':actualActivity.id,'activities.name':actualActivity.name,
 'activities.why':actualActivity.why,'activities.when':actualActivity.when,'activities.where':actualActivity.where,
 'activities.problem':actualActivity.problem,'activities.painLevel':actualActivity.painLevel,
 'objects.id':actualObject.id,'objects.name':actualObject.name
};
for(const [path,value] of Object.entries(actualReferences)){
 const mapping=model.meta.fieldMappings.find(item=>item.physicalName===path);
 if(mapping&&value!==undefined&&!Object.hasOwn(mapping,'referenceValue')){mapping.referenceValue=structuredClone(value);mapping.referenceSource='Alder自身の業務設計書（旧0.4形式）';}
}
// A single consistent, explicitly illustrative editing example makes the
// exception, interruption and restart reviewable without changing source BD.
for(const [path,value] of Object.entries({
 'steps.action':'下書きを保存する',
 'exceptions.name':'編集の中断（下書き保存）',
 'exceptions.description':'編集内容を確定せず下書きを残し、後で編集を再開できる。',
 'continuities.outcome':'下書きを残して中断し、後で再開できる。',
 'continuities.resumeCondition':'保存した下書きがあるとき',
 'continuities.resumeAction':'保存した下書きを開いて編集を再開する'
})){
 const mapping=model.meta.fieldMappings.find(item=>item.physicalName===path);
 if(mapping&&!Object.hasOwn(mapping,'referenceValue')){mapping.referenceValue=value;mapping.referenceSource='架空の編集業務における中断の例';}
}
// Review annotations are explicit and do not change the original mappings.
// See compatibility-inventory.ja.md for evidence and unresolved distinctions.
const markedFields={
 'steps.legacyText':['legacy','旧形式の手順文章を移行時に保持する。'],
 'State.transitions[].event':['legacy','旧形式の状態遷移の発生事象を保持する。'],
 'steps.obligation':['legacy','既存JSONの必須・任意。概念候補では独立項目とせず、変換時に選択可能だった意味を条件やフローと照合する。'],
 'continuities.trigger':['legacy','既存の中断条件。例外の発生条件と照合し、元の記述を失わずに引き継ぐ。'],
 'continuities.onInterrupt':['legacy','既存の中断時の扱い。例外時の手順と照合し、元の記述を失わずに引き継ぐ。'],
 'Check.items[].detailSummary':['needs-review','旧形式の詳細見出しを保持する。現行のチェックにも独立した概要が必要か確認する。'],
 'retained Check.items.reviewState':['needs-review','旧データの確認状態を保持し、現在の運用で必要な状態を確認する。'],
 'Concept.subsystems[].reviewState':['needs-review','旧データの確認状態を保持し、現在の運用で必要な状態を確認する。'],
 'Concept.concepts[].reviewState':['needs-review','旧データの確認状態を保持し、現在の運用で必要な状態を確認する。'],
 'Concept.relations[].reviewState':['needs-review','旧データの確認状態を保持し、現在の運用で必要な状態を確認する。'],
 'Concept.handoffs[].reviewState':['needs-review','旧データの確認状態を保持し、現在の運用で必要な状態を確認する。']
};
const fieldMarks={};for(const [path,[kind,reason]] of Object.entries(markedFields)){
 const matches=model.meta.fieldMappings.filter(mapping=>mapping.physicalName===path);
 if(matches.length!==1)throw Error('Expected one compatibility field: '+path);
 fieldMarks[matches[0].informationId]={kind,reason};
}
const conceptMarks={
 'n-external':{kind:'legacy',reason:'別保存の旧業務設計書を参照するための目録。'},
 'c-f6845a968ec2f3':{kind:'legacy',reason:'旧業務設計書の外部目録に含む業務。'},
 'n-order':{kind:'needs-review',reason:'旧順序規則を引き継いだ構造。手順の前提との重複や順不同の扱いを確認する。'}
};
for(const id of Object.keys(conceptMarks))if(!nodes.has(id))throw Error('Missing compatibility concept: '+id);
const relationMarks={};for(const relation of model.relations){
 const marks=[conceptMarks[relation.fromConceptId],conceptMarks[relation.toConceptId]].filter(Boolean);
 const mark=marks.find(item=>item.kind==='legacy')??marks.find(item=>item.kind==='needs-review');
 if(mark)relationMarks[relation.id]=mark;
}
model.meta.compatibilityReview={fields:fieldMarks,concepts:conceptMarks,relations:relationMarks};
// The overview's standard-step edge must point to the flow-specific entry;
// keep the Step node and connect it through the new conceptual reference.
const overview=model.presentation.subsystemViews;
const standardView=overview.edges.find(edge=>edge.relationIds.includes('nr-activity-step'));
if(!standardView)throw Error('Missing standard-step overview relation');
standardView.toViewId='overview-n-flow-step';standardView.fromLabel='0..1';
overview.nodes.push({id:'overview-n-flow-step',conceptId:'n-flow-step',subsystemId:'format-review',name:nodes.get('n-flow-step').name,description:nodes.get('n-flow-step').description,sources:[],fields:[]});
overview.edges.push({id:'overview-nr-flow-step-definition',fromViewId:'overview-n-flow-step',toViewId:'overview-n-step',relationIds:['nr-flow-step-definition'],fromLabel:'0..N',toLabel:'1',kind:'reference'});
// Refresh the already-authored overview's labels and fields from the model.
const byId=new Map(model.concepts.map(c=>[c.id,c]));
for(const n of model.presentation.subsystemViews.nodes){const c=byId.get(n.conceptId);n.name=c.name;n.fields=c.information.map(f=>({name:f.name,informationId:f.id}));if(['n-activity','n-step','n-exception','n-continuity','n-flow-step','n-information','n-axis'].includes(n.conceptId))n.description=c.description;}
validate(pkg);
writeFileSync(new URL('../../business-design/alder/json-complete-concept-review.json',here),JSON.stringify(pkg,null,2)+'\n');
console.log(JSON.stringify({concepts:model.concepts.length,relations:model.relations.length,coverage:model.meta.schemaCoverage.length,aliases:model.meta.schemaAliases.length}));
