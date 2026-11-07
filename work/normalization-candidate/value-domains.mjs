// Value domains describe the conceptual review model only. The existing
// storage schema and its physical encodings are not changed by this catalogue.
const choice=(source,items,note)=>({kind:'enum',source,values:items.map(([value,label])=>({value,label})),...(note?{note}:{})});
const fixed=(source,value)=>({kind:'fixed',source,values:[{value}]});
const enumDomains={
 'actors.kind':choice('BD.activities[].who.kind', [['role','人が担う役割'],['system','自動実行するシステム'],['scheduler','スケジューラー']], '実行主体が未決の場合は、種類ではなく業務の主体参照を未決にする。'),
 'activities.painLevel':choice('BD.activities[].painLevel', [['Low','低'],['Medium','中'],['High','高']], '課題がない場合と、課題はあるが程度が未評価の場合を区別する。'),
 'steps.exchangeKind':choice('BD.activities[].procedure.steps[].exchange.kind', [['interaction','相手との受渡し'],['internal','内部処理'],['unresolved','未決']]),
 'steps.effect':choice('BD.activities[].procedure.steps[].effect', [['create','作成'],['read','参照'],['update','更新'],['delete','削除'],['not-applicable','該当なし'],['undecided','未決']]),
 'stepInteractions.direction':choice('BD.activities[].procedure.steps[].exchange.direction', [['input','主体への入力'],['output','主体からの出力']]),
 'stepInteractions.phase':choice('BD.activities[].procedure.steps[].exchange.phase', [['request','要求'],['response','応答'],['not-applicable','該当なし']], '要求・応答が未決の場合と、該当しない場合を区別する。'),
 'stepParties.side':choice('手順の当事者のFrom／To', [['from','送る側'],['to','受ける側']]),
 'stepParties.kind':choice('BD.activities[].procedure.steps[].parties.from.kind', [['who','業務の実行主体'],['object','対象']]),
 'steps.obligation':choice('BD.activities[].procedure.steps[].obligation', [['required','必須'],['optional','任意']], '旧形式で記録された選択肢。条件やフローとの対応を保って引き継ぐ。'),
 'orderRules.kind':choice('BD.activities[].procedure.orderRules[].kind', [['before','前後関係'],['interchangeable','順不同']]),
 'decisions.kind':choice('BD.activities[].decisions[].kind', [['authorization','認可'],['validation','入力検査'],['algorithm','正常系アルゴリズム']]),
 'conditions.kind':choice('BD.activities[].decisions[].rows[].conditions[].kind', [['value','具体値による条件'],['else','その他'],['any','不問'],['undecided','未決']]),
 'conditions.operator':choice('BD.activities[].decisions[].rows[].conditions[].operator', [['is','条件に該当'],['eq','等しい'],['gte','以上'],['lte','以下'],['gt','より大きい'],['lt','より小さい']], '具体値による条件のときに使用する。大小比較には数値を用いる。'),
 'rows.resultKind':choice('BD.activities[].decisions[].rows[].result.kind', [['accepted','正常'],['error','エラー'],['value','値'],['undecided','未決']]),
 'rowChecks.coverage':choice('BD.activities[].decisions[].rows[].checkRefs[].coverage', [['full','全体'],['partial','一部']]),
 'continuities.outcome':choice('BD.exceptions[].continuity.outcome', [['resume','中断後に再開'],['continue','中断せず続行'],['end','終了']], '再開しない場合や、別の業務で再開する場合もある。'),
 'relations.kind':choice('BD.relations[].kind', [['input','対象から業務への入力'],['output','業務から対象への出力'],['business-exception','業務同士の例外関係'],['object-exception','対象同士の例外関係']]),
 'findings.kind':choice('BD.findings[].kind', [['question','質問'],['correction','修正依頼']]),
 'findings.status':choice('BD.findings[].status', [['open','未解決'],['resolved','解決済み']]),
 'findings.scope':choice('BD.findings[].scope', [['items','個別項目'],['document','文書全体'],['unassigned','対象未割当']]),
 'Check.intro[].kind':choice('Check.intro[].kind', [['text','文章'],['reference','内部参照'],['link','リンク']]),
 'Check.guarantees[].blocks[].kind':choice('Check.guarantees[].blocks[].kind', [['prose','文章'],['example','サンプルへの参照']]),
 'State.transitions[].effect':choice('State.transitions[].effect', [['change','状態変更'],['unchanged','状態不変'],['no-create','作成なし'],['constraint','制約']]),
 'State.transitions[].path':choice('State.transitions[].path', [['normal','正常'],['exception','例外']]),
 'Concept.relations[].kind':choice('Concept.relations[].kind', [['down','所有'],['reference','参照']]),
 'Concept.handoffs[].flowDirection':choice('Concept.handoffs[].flowDirection', [['forward','出発側から到着側'],['return','返り']]),
 'Concept.reviewGroups[].graph.edges[].kind':choice('Concept.reviewGroups[].graph.edges[].kind', [['down','所有'],['reference','参照']]),
 'Concept.reviewGroups[].graph.subsystemViews.edges[].kind':choice('Concept.reviewGroups[].graph.subsystemViews.edges[].kind', [['down','所有'],['reference','参照']])
};
const fixedDomains={
 'format':fixed('Package.format','alder-document-package'),
 'businessDesigns.kind':fixed('BD.kind','businessDesign'),
 'Package.externalDocuments[].kind':fixed('Package.externalDocuments[].kind','businessDesign'),
 'Check.kind':fixed('Check.kind','checkItems'),
 'State.kind':fixed('State.kind','stateTransition'),
 'Concept.kind':fixed('Concept.kind','conceptModel')
};
// These values are already explicit in the conceptual proposal itself.
const logicalChoices=new Map([
 ['string（未確認／課題なし／課題あり）',['未確認','課題なし','課題あり']],
 ['string（未決／無条件／条件あり）',['未決','無条件','条件あり']],
 ['string（未決／なし／あり）',['未決','なし','あり']],
 ['string（未決／業務全体／手順）',['未決','業務全体','手順']],
 ['string（新規／既存の状態）',['新規','既存の状態']],
 ['string（状態／作成なし／未決）',['状態','作成なし','未決']]
]);
const unresolved=new Set([
 'Check.basedOn.verification','State.basedOn.verification','Concept.basedOn.verification','Concept.relatedStates[].verification',
 'State.start','State.terminal','State.completeness','Concept.concepts[].information[].responsibilityStatus',
 'Concept.reviewGroups[].capabilities[].samples[].blocks[].rows[].cells[].linkId'
]);
const additionalReferences=new Set([
 'Concept.concepts[].sourceRefs[].targetId','Concept.reviewGroups[].graph.nodes[].sourceActivityIds',
 'Concept.presentation.landscapeRelationships[].from','Concept.presentation.landscapeRelationships[].to',
 'Concept.presentation.reviewBoundaries[].from','Concept.presentation.reviewBoundaries[].to'
]);
const names=new Set(['名前','項目名','グループ名','表題','判定軸の名前']);

// Existing authored mappings decide identity, ownership and visibility.
// Never turn a sample or an old fixed version into a new closed vocabulary.
export function valueDomain(info,mapping,mark){
 const path=mapping.physicalName,type=mapping.valueType??'未定義';
 const declared=enumDomains[path]??fixedDomains[path];if(declared)return structuredClone(declared);
 const logical=logicalChoices.get(type);if(logical)return {kind:'enum',source:'概念モデルの定義',values:logical.map(value=>({value}))};
 if(mapping.representation==='relationKey'||additionalReferences.has(path))return {kind:'reference'};
 if(mark)return {kind:'historical'};
 if(unresolved.has(path))return {kind:'undecided'};
 if(info.name.endsWith('識別子')||info.name==='表示番号')return {kind:'identifier',note:'空文字や空白のみは使用しない。'};
 if(info.name==='改訂'||info.name.endsWith('の改訂')||info.name==='文書の版'||info.name==='形式の版')return {kind:'version',note:'空文字や空白のみは使用しない。'};
 if(names.has(info.name)&&mapping.nullable===false)return {kind:'text',note:'空文字や空白のみは使用しない。'};
 if(path==='Concept.concepts[].sourceRefs[].targetType')return {kind:'referenceType',note:'参照先の種類と一致する。'};
 if(path==='conditions.value')return {kind:'scalar',note:'大小比較には数値を用いる。'};
 if(path==='Package.sources[].sha256')return {kind:'hash'};
 if(path.endsWith('.uri'))return {kind:'uri',note:'指定する場合はURIを表す。'};
 if(path==='Concept.relations[].fromPerTarget'||path==='Concept.relations[].toPerSource')return {kind:'cardinality',note:'最小件数と最大件数を表す。上限なしも指定できる。'};
 if(path==='actors.color'||path==='objects.icon')return {kind:'presentation'};
 if(type.includes('boolean')||type.includes('number'))return {kind:'scalar'};
 if(type==='未定義'||type.includes('object（任意構造）'))return {kind:'undecided'};
 return {kind:'text'};
}

export const domainReasons={
 enum:'意味のある区分を有限の選択肢で示す。',fixed:'この文書または形式を識別する固定値。',reference:'関連先を参照し、参照先の定義と整合させる。',
 historical:'既存記録を保持し、現在の業務概念への扱いは別に確認する。',undecided:'現在の定義だけでは値域を確定できない。',
 identifier:'対象を識別する値。具体的な採番や文字形式は決めない。',version:'文書や形式の版・改訂を区別する。特定の版番号に固定しない。',
 text:'業務や文書に応じた名前・記述であり、値を列挙しない。',referenceType:'参照する対象の種類と対応する。',
 scalar:'真偽値・数値または条件に応じた値として扱う。',hash:'原典を照合するSHA-256の値。',uri:'参照先のURI。',
 cardinality:'関係の最小・最大件数を表す。例だけを取り得る値にしない。',presentation:'画面表示の情報。業務上の値域として表示用パレットを固定しない。'
};

export function applyValueDomains(model){
 const fields=new Map(model.meta.fieldMappings.map(mapping=>[mapping.informationId,mapping])),inventory=[];
 for(const concept of model.concepts)for(const info of concept.information){
  const mapping=fields.get(info.id);if(!mapping)throw Error('Missing field mapping: '+info.id);
  const mark=model.meta.compatibilityReview?.fields?.[info.id],domain=valueDomain(info,mapping,mark);
  if(!domainReasons[domain.kind])throw Error('Unknown value-domain category: '+domain.kind);
  mapping.valueDomain=domain;
  // The previous explanatory sample is retained as reference metadata; the
  // displayed sample is now one actual member of the outcome domain.
  if(mapping.physicalName==='continuities.outcome')mapping.sampleValue='resume';
  inventory.push({conceptId:concept.id,concept:concept.name,informationId:info.id,item:info.name,physicalName:mapping.physicalName,category:domain.kind,reason:domainReasons[domain.kind],...(mark?{compatibility:mark.kind}:{}),...(domain.source?{basis:domain.source}:{})});
 }
 if(inventory.length!==fields.size)throw Error('Value-domain inventory must cover every mapping exactly once');
 return inventory;
}
