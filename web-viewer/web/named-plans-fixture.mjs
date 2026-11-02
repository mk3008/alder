// Synthetic plans deliberately reuse IDs to exercise isolation across plans.
const rich=value=>[{kind:'text',value}];
function sample(label){
 const basedOn={documentId:'bd',revision:'bd-1',verification:'unverified'};
 return {format:'alder-document-package',formatVersion:'0.4',revision:'package-1',documents:[
  {id:'bd',kind:'businessDesign',schemaVersion:'0.3',revision:'bd-1',title:label+'の受付',preface:'架空の業務案。',scope:'受付の例',
   objects:[{id:'object',name:label+'の受付記録',scope:true,icon:'file-text',information:['内容']}],
   activities:[{id:'activity',name:label+'の受付を行う',scope:true,why:'依頼を記録する。',when:'依頼が届いたとき。',who:'受付担当',where:'受付',procedure:'依頼を受け取り記録する。',exception:null,result:'受付記録が作られる。',problem:null,painLevel:null,roleId:'role'}],
   relations:[{id:'relation',kind:'output',fromId:'activity',toId:'object',label:'受付記録'}],
   findings:[{id:'finding',sourceId:'F01',kind:'question',status:'open',scope:'items',targetIds:['activity'],unresolvedTargets:[],summary:label+'の未決',content:'架空の確認事項。'}],
   roles:[{id:'role',name:'受付担当',color:'#2563eb'}],exceptions:[]},
  {id:'state-doc',kind:'stateTransition',schemaVersion:'0.2',revision:'state-1',title:label+'の状態',basedOn,objectId:'object',states:[{id:'state',name:label+'受付済み'}],start:'@new',terminal:'@unknown',completeness:'partial',source:'合成例',transitions:[{id:'transition',sourceId:'T1',fromId:'@new',activityId:'activity',event:'受付',exceptionId:null,condition:'依頼を受け取る',toId:'state',effect:'change',path:'normal',evidence:'合成例',note:'部分定義'}]},
  {id:'check-doc',kind:'checkItems',schemaVersion:'0.1',revision:'check-1',title:label+'の確認',basedOn,intro:[],index:[{activityId:'activity',purpose:'',connections:'',checkIds:['check']}],sections:[{id:'section',activityId:'activity',title:'受付',preamble:[]}],guarantees:[],examples:[],items:[{id:'check',checkId:'CI-01',title:label+'の記録を確認する',detailSummary:'',sectionId:'section',reviewState:'未レビュー',fields:{condition:rich('依頼が届いたとき'),expectedResult:rich(label+'の受付記録が作られる')}}],notes:[]},
  {id:'concept-doc',kind:'conceptModel',schemaVersion:'0.2',revision:'concept-1',basedOn,relatedStates:[{documentId:'state-doc',revision:'state-1',verification:'unverified'}],
   subsystems:[{id:'subsystem',name:label+'の受付',purpose:'',information:[],reason:'',activityIds:['activity'],reviewState:'未レビュー'}],
   concepts:[{id:'concept',name:label+'の受付記録',subsystemId:'subsystem',information:[{id:'info',name:'内容'}],reason:'',description:'',businessObjectIds:['object'],activityLinks:[{activityId:'activity',uses:[]}],sourceRefs:[],reviewState:'未レビュー'}],
   relations:[],handoffs:[],reviewGroups:[],benefits:[],considerations:[],reviewPoints:[],meta:{},presentation:{landscapeRelationships:[],reviewBoundaries:[]}}
 ],sources:[],externalDocuments:[],diagnostics:[]};
}
export const namedPlansFixture={format:'alder-named-plans',formatVersion:'1.0',plans:[
 {id:'current',name:'現行案',package:sample('現行案')},
 {id:'improved',name:'改善案',package:sample('改善案')},
 {id:'alternative',name:'提案A',package:sample('提案A')}
]};
