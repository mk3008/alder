import type {Design} from './graph';
export function activityRole(design:Design,id:string){const bd=design.json?.business,a=bd?.activities.find(a=>a.id===id);return a?.roleId?bd?.roles?.find(r=>r.id===a.roleId):undefined;}
export function roleGroupKey(design:Design,id:string,who:string){return activityRole(design,id)?.id??(design.json?.business.roles?'unresolved:'+id:who);}
