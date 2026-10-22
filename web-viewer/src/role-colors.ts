import type {GraphNode} from './graph';

export const rolePalette=['#8b5cf6','#2563eb','#c2410c','#008576','#be185d'] as const;
/** Use the full document, before filtering or Activity projection, in every view.
 * Resolve hash collisions in name order so source order cannot change colors.
 * More roles than palette colors necessarily reuse colors; Who text stays visible. */
export function roleColors(nodes:readonly GraphNode[]):ReadonlyMap<string,string>{
 const roles=[...new Set(nodes.filter(n=>n.type==='business').map(n=>String(n.who)))].sort();
 const colors=new Map<string,string>(),used=new Set<string>();
 for(const who of roles){
  let hash=0;for(const c of who)hash=(hash*31+c.codePointAt(0)!)>>>0;
  const preferred=rolePalette[hash%rolePalette.length];
  const color=used.has(preferred)?rolePalette.find(c=>!used.has(c))??preferred:preferred;
  colors.set(who,color);used.add(color);
 }
 return colors;
}
