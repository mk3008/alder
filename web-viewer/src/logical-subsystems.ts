import type {ConceptContext} from './concept-model';

export type LogicalSelection={kind:'group'|'connection';id:string};
function text(root:HTMLElement,tag:string,value:string){const element=root.ownerDocument.createElement(tag);element.textContent=value;root.append(element);return element;}

/** Details come from the current model, never from a purchase-specific fixture. */
export function createLogicalDetails({model,business}:ConceptContext){
 const find=(selection:LogicalSelection)=>selection.kind==='group'
  ?model.subsystems.find(item=>item.id===selection.id)
  :model.handoffs.find(item=>item.id===selection.id);
 const sections=[['メリット',model.benefits],['デメリット・必要な管理',model.considerations],['レビューポイント',model.reviewPoints]] as const;
 function activities(selection:LogicalSelection){const item=find(selection);return item?item.activityIds.map(id=>business.activities.find(activity=>activity.id===id)!).filter(Boolean):[];}
 function describe(target:HTMLElement,selection:LogicalSelection){
  target.replaceChildren();
  if(selection.kind==='group'){
   const group=model.subsystems.find(item=>item.id===selection.id);if(!group)return '';
   text(target,'p',group.purpose);text(target,'h3','扱う情報');const list=target.ownerDocument.createElement('ul');
   for(const value of group.information)text(list,'li',value);target.append(list);text(target,'h3','まとまりの理由');text(target,'p',group.reason);return group.name;
  }
  const handoff=model.handoffs.find(item=>item.id===selection.id);if(!handoff)return '';
  text(target,'p',handoff.description);text(target,'h3','出元と受取先');
  const from=model.subsystems.find(item=>item.id===handoff.fromSubsystemId)!,to=model.subsystems.find(item=>item.id===handoff.toSubsystemId)!;
  text(target,'p',`${from.name} → ${to.name}`);return handoff.information;
 }
 return {sections,activities,describe};
}
