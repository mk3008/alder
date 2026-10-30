import type {Design} from './graph';
export function activityRole(design:Design,id:string){const bd=design.model?.business,a=bd?.activities.find(a=>a.id===id);if(!a)return;const roleId='performers' in a?(a.performers?.length===1&&a.performers[0].roleIds.length===1?a.performers[0].roleIds[0]:undefined):a.roleId;return roleId?bd?.roles?.find(r=>r.id===roleId):undefined;}
export function roleGroupKey(design:Design,id:string,who:string){return activityRole(design,id)?.id??(design.model?.business.roles?'unresolved:'+id:who);}
