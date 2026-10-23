import type {Design,Graph,Finding} from './graph';
import type {JSONView} from './json-document';

/** Transient, typed JSON for viewing. This is not the versioned storage package.
 * Source bytes and Markdown presentation fragments live outside this value. */
export type ViewerDocumentJSON={version:1;graph:Graph;activityOrder?:string[];findings?:Finding[];states?:Design['objectStateTransitions'];storage?:JSONView};
export type OriginalDocument={format:'markdown'|'json';text:string;sections:Record<string,string>};
export type NormalizedDocument={data:ViewerDocumentJSON;original:OriginalDocument};

/** Single display-model boundary for both input formats and all entry points. */
export function readViewerDocument({data,original}:NormalizedDocument):Design{
 if(data.version!==1)throw Error('Unsupported Viewer document version');
 const ids=new Set(data.graph.nodes.map(n=>n.id));
 if(ids.size!==data.graph.nodes.length)throw Error('Duplicate Viewer node ID');
 if(data.graph.relations.some(r=>!ids.has(r.from)||!ids.has(r.to)))throw Error('Unknown Viewer relation endpoint');
 const activities=new Set(data.graph.nodes.filter(n=>n.type==='business').map(n=>n.id));
 if(data.activityOrder?.some(id=>!activities.has(id)))throw Error('Unknown Viewer Activity');
 return {graph:data.graph,sections:original.sections,markdown:original.text,
  ...(data.activityOrder===undefined?{}:{activityOrder:data.activityOrder}),
  ...(data.findings===undefined?{}:{findings:data.findings}),
  ...(data.states===undefined?{}:{objectStateTransitions:data.states}),
  ...(data.storage===undefined?{}:{sourceFormat:'json' as const,json:data.storage})};
}
