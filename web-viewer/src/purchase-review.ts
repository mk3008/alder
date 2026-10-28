import purchaseDocument from '../../work/concept-review/issue-133/versions/purchase-v2-beta.json' with {type:'json'};
import purchaseModel from '../../work/concept-review/issue-133/versions/purchase-concepts-v2-beta.json' with {type:'json'};

// This is the explicit purchase review fixture. It never extracts rules from prose.
const document = purchaseDocument.documents.find(item => item.kind === 'businessDesign');
if (!document || !document.roles || !document.activities) throw Error('Purchase Business Design is unavailable');
const business = document as {id:string;revision:string;roles:{id:string;name:string;color:string}[];
 activities:{id:string;name:string;procedure:string;exception:string|null;result:string}[]};
if (purchaseModel.basedOn.documentId !== business.id || purchaseModel.basedOn.revision !== business.revision) {
 throw Error('Purchase model and Business Design revisions differ');
}
export {purchaseDocument, purchaseModel, business};
export const activityFor = (id:string) => {
 const activity=business.activities.find(item=>item.id===id);
 if(!activity)throw Error('Unknown purchase activity: '+id);
 return activity;
};
export const activityKey = (id:string) => {
 const view=purchaseModel.presentation.activityViews.find(item=>item.activityId===id);
 if(!view)throw Error('Unknown purchase activity view: '+id);
 return view.id;
};
export const roleName = (id:string) => {
 const role=business.roles!.find(item=>item.id===id);
 if(!role)throw Error('Unknown purchase role: '+id);
 return role.name;
};
