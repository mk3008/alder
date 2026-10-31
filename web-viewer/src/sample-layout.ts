import type {Design} from './graph';
import type {SampleLayout} from './session';

/** Reuse legacy sample coordinates only when a name identifies one node. */
export function sampleLayoutForDesign(layout:SampleLayout,design:Design):SampleLayout{
 const ids=new Set(design.graph.nodes.map(node=>node.id));
 const names=new Map<string,string|undefined>();
 for(const node of design.graph.nodes)names.set(node.name,names.has(node.name)?undefined:node.id);
 const resolve=(id:string)=>ids.has(id)?id:names.get(id);
 const positions:SampleLayout['positions']=Object.create(null);
 for(const [id,point] of Object.entries(layout.positions)){const target=resolve(id);if(target)positions[target]=point;}
 const {scroll,zoom,viewInset,canvasOrigin,showExceptions,selectedEdgesOnly}=layout;
 return {positions,scroll,zoom,viewInset,canvasOrigin,showExceptions,selectedEdgesOnly,selected:layout.selected?resolve(layout.selected):undefined,
  ...(layout.hiddenNodes===undefined?{}:{hiddenNodes:[...new Set(layout.hiddenNodes.flatMap(id=>{const target=resolve(id);return target?[target]:[];}))]})};
}
