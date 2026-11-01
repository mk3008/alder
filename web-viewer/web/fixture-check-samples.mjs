// Technical fixture only: none of these generated Checks is an approved business document.
export function makeFixture(source){
 const pkg=structuredClone(source),bd=pkg.documents.find(d=>d.kind==='businessDesign'),model=pkg.documents.find(d=>d.kind==='conceptModel');
 model.schemaVersion='0.2';model.revision+='-test-only';pkg.revision+='-test-only';
 const doc={id:'fixture-checks',schemaVersion:'0.1',kind:'checkItems',revision:'test-only',title:'画面検証用',basedOn:{documentId:bd.id,revision:bd.revision,verification:'unverified'},intro:[],index:[],sections:[],guarantees:[],examples:[],items:[],notes:[]};
 const mapping=new Map();for(const view of model.presentation.activityViews??[])for(const ref of view.testSpecificationFunctions??[])mapping.set(JSON.stringify([ref.groupId,ref.capabilityId]),view.activityId);
 for(const group of model.reviewGroups)for(const capability of group.capabilities){
  const activityId=mapping.get(JSON.stringify([group.id,capability.id]));if(!activityId)throw Error('Missing explicit fixture mapping: '+capability.id);
  let row=doc.index.find(item=>item.activityId===activityId);if(!row){row={activityId,purpose:'',connections:'',checkIds:[]};doc.index.push(row);doc.sections.push({id:'fixture-section-'+activityId,activityId,title:bd.activities.find(a=>a.id===activityId).name,preamble:[]});}
  const id='fixture-check-'+capability.id;row.checkIds.push(id);
  doc.items.push({id,checkId:'FIXTURE-'+capability.id,title:capability.title,detailSummary:'',sectionId:'fixture-section-'+activityId,reviewState:capability.meta?.hypothesisId?'要確認':'未レビュー',fields:{guarantee:[{kind:'text',value:capability.description}]}});
  for(const sample of capability.samples)sample.checkIds=[id];
 }
 pkg.documents.push(doc);return pkg;
}
