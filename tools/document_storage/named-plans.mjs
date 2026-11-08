import {schema} from './schema.mjs';
import {demand,validate,validateShape} from './core.mjs';
import {readLegacyPackage} from './legacy-json.mjs';

// The outer version identifies only this envelope; each inner package keeps its
// own independent format version, revision, IDs and references.
const obj=(properties,required=Object.keys(properties))=>({type:'object',properties,required,additionalProperties:false});
const single={anyOf:schema.anyOf};
const id={type:'string',pattern:'^[A-Za-z0-9_-]+$'};
const name={type:'string',minLength:1,pattern:'\\S'};
export const namedPlansSchema={
 $schema:'https://json-schema.org/draft/2020-12/schema',
 ...obj({format:{enum:['alder-named-plans']},formatVersion:{enum:['1.0']},
  plans:{type:'array',minItems:1,items:obj({id,name,package:single})}}),
 $defs:schema.$defs
};

/** Validate every plan independently, including legacy name-based references. */
export function validateNamedPlans(bundle){
 try{validateShape(bundle,namedPlansSchema);}catch(error){
  // The outer shape can fail before the per-plan loop; retain the plan and
  // declared version in diagnostics for malformed or mixed-version input.
  if(Array.isArray(bundle?.plans))for(const plan of bundle.plans)try{validateShape(plan?.package,schema);}catch(cause){throw Error('Plan '+(plan?.id??'<missing>')+' (formatVersion '+String(plan?.package?.formatVersion)+'): '+cause.message,{cause});}
  throw error;
 }
 demand(bundle.plans.length>0,'At least one named plan is required');
 const ids=new Set();
 for(const plan of bundle.plans){
  demand(!ids.has(plan.id),'Duplicate plan ID: '+plan.id);ids.add(plan.id);
  demand(plan.name===plan.name.trim()&&!/[\r\n]/.test(plan.name),'Invalid plan name: '+plan.id);
  try{
   validate(plan.package);
   if(['0.1','0.2','0.3'].includes(plan.package.formatVersion))readLegacyPackage(plan.package);
  }catch(error){throw Error('Plan '+plan.id+' (formatVersion '+plan.package.formatVersion+'): '+error.message,{cause:error});}
 }
 return {valid:true,plans:bundle.plans.map(({id,name})=>({id,name}))};
}
export function selectNamedPlan(bundle,id){
 validateNamedPlans(bundle);
 const plan=bundle.plans.find(value=>value.id===id);
 demand(plan,'Unknown plan ID: '+id);
 return plan;
}
