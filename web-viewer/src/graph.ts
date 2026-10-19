export type GraphNode = { id: string; type: 'business' | 'object'; name: string; scope: boolean; [key: string]: unknown };
export type Relation = { kind: 'input' | 'output' | 'business-exception' | 'object-exception'; from: string; to: string; label: string };
export type Graph = { version: 1; scope?: string; nodes: GraphNode[]; relations: Relation[] };
export type Finding = { id: string; kind: 'question' | 'correction'; status: 'open' | 'resolved'; scope: 'items' | 'document' | 'unassigned'; targets: string[]; summary: string; content: string; unresolvedTargets: string[] };
export type Design = { graph: Graph; sections: Record<string, string>; markdown: string; findings?: Finding[]; objectMedia?: Record<string,string>; objectSRDependencies?: Record<string,string[]>; /** Viewer-only reading hint, never part of Graph JSON. */ activityOrder?: string[] };
const fail = (ok: unknown, message: string): void => { if (!ok) throw new Error(message); };
const text = (v: unknown): v is string => typeof v === 'string' && !!v.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g, '');
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const equalKeys = (v: Record<string, unknown>, keys: string[]) => Object.keys(v).sort().join('|') === [...keys].sort().join('|');
const visible = (v: unknown): v is string => text(v) && v === v.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g, '') && !['\n', '\r', ' — ', ' → ', '<!--'].some(t => v.includes(t));
export function validateGraph(value: unknown): asserts value is Graph {
  fail(record(value), 'Graph must be an object'); const g = value as Record<string, unknown>;
  fail(equalKeys(g, ['version', 'nodes', 'relations']) || equalKeys(g, ['version', 'nodes', 'relations', 'scope']), 'Invalid graph fields');
  fail(g.version === 1, 'Unsupported graph version'); if ('scope' in g) fail(text(g.scope), 'Invalid scope');
  fail(Array.isArray(g.nodes) && g.nodes.length, 'Nodes required'); fail(Array.isArray(g.relations), 'Relations required');
  const nodes = new Map<string, string>();
  for (const v of g.nodes as unknown[]) {
    fail(record(v), 'Node must be an object'); const n = v as Record<string, unknown>;
    fail(n.type === 'business' || n.type === 'object', 'Invalid node type');
    const keys = n.type === 'business' ? ['id','type','name','why','when','who','where','result','scope'] : ['id','type','name','scope','icon','information'];
    const problem = n.type === 'business' && ('problem' in n || 'pain_level' in n);
    if (problem) { keys.push('problem', 'pain_level'); fail(['Low','Medium','High'].includes(String(n.pain_level)), 'Invalid Pain level'); }
    fail(equalKeys(n, keys), 'Invalid node fields');
    fail(Object.entries(n).every(([k,v]) => k === 'scope' || k === 'information' || text(v)), 'Empty node text');
    fail(typeof n.scope === 'boolean', 'Invalid node scope'); fail(visible(n.name) && n.id === n.name, 'Node ID must equal visible name');
    fail(!nodes.has(n.id as string), 'Duplicate node ID');
    if (n.type === 'object') { fail(typeof n.icon === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(n.icon), 'Invalid Lucide icon'); fail(Array.isArray(n.information) && n.information.every(text), 'Invalid information'); }
    nodes.set(n.id as string, n.type as string);
  }
  fail([...nodes.values()].includes('business'), 'Activity required');
  const endpoints: Record<string, string[]> = { input: ['object','business'], output: ['business','object'], 'business-exception': ['business','business'], 'object-exception': ['object','object'] }; const seen = new Set<string>();
  for (const v of g.relations as unknown[]) {
    fail(record(v), 'Relation must be an object'); const r = v as Record<string, unknown>;
    fail(equalKeys(r, ['kind','from','to','label']) && Object.values(r).every(text), 'Invalid relation fields');
    const ends = endpoints[r.kind as string]; fail(Array.isArray(ends) && nodes.has(r.from as string) && nodes.has(r.to as string) && nodes.get(r.from as string) === ends[0] && nodes.get(r.to as string) === ends[1], 'Invalid relation endpoints');
    const key = JSON.stringify([r.kind,r.from,r.to,r.label]); fail(!seen.has(key), 'Duplicate relation'); seen.add(key);
  }
}
function lines(text: string): string[] { return text.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/); }
function headings(body: string): [number,string][] {
  const marks: [number,string][] = []; let fence = '';
  lines(body).forEach((line, i) => { const m = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (m) { if (!fence) fence = m[1]; else if (m[1][0] === fence[0] && m[1].length >= fence.length && !m[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g, '')) fence = ''; return; }
    if (!fence && /^#{1,6} /.test(line)) marks.push([i,line]);
  }); fail(!fence, 'Unclosed code fence'); return marks;
}
function sections(body: string, expected: string[], context: string, empty: string[] = []): Record<string,string> {
  const ls = lines(body), marks = headings(body), values: Record<string,string> = Object.create(null);
  fail(marks.length && !ls.slice(0, marks[0][0]).join('\n').replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g, ''), context + ': fields required');
  marks.forEach(([start, h], i) => { fail(expected.includes(h) && !(h in values), context + ': unsupported/duplicate ' + h); values[h] = ls.slice(start + 1, marks[i+1]?.[0] ?? ls.length).join('\n').replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g, ''); fail(values[h] || empty.includes(h), context + ': empty ' + h); });
  fail(marks.map(m=>m[1]).join('|') === expected.join('|'), context + ': invalid field order'); return values;
}
const codepointCompare = (a: string,b: string): number => { const aa = Array.from(a), bb = Array.from(b); for(let i=0;i<Math.min(aa.length,bb.length);i++) { const d=aa[i].codePointAt(0)!-bb[i].codePointAt(0)!; if(d) return d; } return aa.length-bb.length; };
function parseFindings(body: string): Finding[] {
  const ls = lines(body), marks = headings(body).filter(([,h])=>h.startsWith('## ')), seen = new Set<string>();
  fail(marks.length && !ls.slice(0, marks[0][0]).join('\n').trim(), 'Findings require Finding sections');
  return marks.map(([start,h], index) => {
    const m = /^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(h);
    fail(m, 'Invalid Finding ID'); const id = m![1]; fail(!seen.has(id), 'Duplicate Finding ID'); seen.add(id);
    const v = sections(ls.slice(start+1,marks[index+1]?.[0] ?? ls.length).join('\n'), ['### Kind','### Status','### Scope','### Targets','### Summary','### Content'], 'Finding '+id);
    fail(['question','correction'].includes(v['### Kind']), 'Invalid Finding Kind');
    fail(['open','resolved'].includes(v['### Status']), 'Invalid Finding Status');
    fail(['items','document','unassigned'].includes(v['### Scope']), 'Invalid Finding Scope');
    const targets = v['### Targets']==='(none)' ? [] : lines(v['### Targets']).filter(l=>l.trim()).map(l=>{fail(l.startsWith('- ') && visible(l.slice(2)), 'Invalid Finding target'); return l.slice(2);});
    fail(new Set(targets).size===targets.length, 'Duplicate Finding target');
    fail(v['### Scope']==='items' ? targets.length>0 : v['### Targets']==='(none)', 'Finding Scope and Targets disagree');
    return {id,kind:v['### Kind'] as Finding['kind'],status:v['### Status'] as Finding['status'],scope:v['### Scope'] as Finding['scope'],targets,summary:v['### Summary'],content:v['### Content'],unresolvedTargets:[]};
  });
}
/** Recover only explicit annotations; legacy saved designs without them stay valid. */
export function findingsFromSource(markdown: string, names: Set<string>): Finding[] {
  if(!lines(markdown).some(l=>l==='# Findings'))return [];
  const ls=lines(markdown),roots=headings(markdown).filter(([,h])=>h.startsWith('# '));
  const matches=roots.map(([start,h],i)=>({start,h,end:roots[i+1]?.[0]??ls.length})).filter(r=>r.h==='# Findings');
  fail(matches.length<=1,'Duplicate Findings');
  if(!matches.length)return [];
  const result=parseFindings(ls.slice(matches[0].start+1,matches[0].end).join('\n'));
  for(const finding of result)finding.unresolvedTargets=finding.targets.filter(t=>!names.has(t));
  return result;
}
export function parseDesign(markdown: string): Design {
  fail(!markdown.includes('<!--'), 'HTML comments are unsupported'); const ls = lines(markdown), roots = headings(markdown).filter(m=>m[1].startsWith('# '));
  const entity = /^# (Activity|Object) (\S.*)$/;
  fail(roots.length && !entity.test(roots[0][1]) && !['# Scope','# Graph exceptions','# Findings'].includes(roots[0][1]), 'Document title required');
  let findings: Finding[] = [];
  const objectMedia: Record<string,string> = Object.create(null);
  const objectSRDependencies: Record<string,string[]> = Object.create(null);
  const graph: Graph = {version:1,nodes:[],relations:[]}, sourceSections: Record<string,string> = Object.create(null), special = new Set<string>();
  roots.slice(1).forEach(([start,h], index) => {
    const end = roots[index+2]?.[0] ?? ls.length, body = ls.slice(start+1,end).join('\n').replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g, ''); fail(body, 'Empty section ' + h);
    if (h === '# Findings') { fail(!special.has(h), 'Duplicate Findings'); special.add(h); findings=parseFindings(body); return; }
    if (['# Scope','# Graph exceptions'].includes(h)) { fail(!special.has(h), 'Duplicate ' + h); special.add(h);
      if (h === '# Scope') { fail(!headings(body).length, 'Scope must be prose'); graph.scope = body; }
      else lines(body).filter(l=>l.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g, '')).forEach(l=>{const m=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(l); fail(m, 'Invalid exception'); graph.relations.push({kind:m![1] as Relation['kind'],from:m![2],to:m![3],label:m![4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g, '')});}); return;
    }
    const m = entity.exec(h); fail(m, 'Unsupported heading ' + h); const category = m![1], name = m![2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g, ''); sourceSections[name] = ls.slice(start,end).join('\n');
    const has = (h:string) => headings(body).some(m=>m[1]===h);
    if(category === 'Object') {
      const keys=['## Scope','## Icon']; if(has('## Medium')) keys.push('## Medium'); if(has('## SR Dependencies')) keys.push('## SR Dependencies'); if(has('## Information')) keys.push('## Information'); const v=sections(body,keys,name); fail(['true','false'].includes(v['## Scope']), 'Invalid Scope');
      if('## Medium' in v){fail(lines(v['## Medium']).length===1,'Medium must be one line');objectMedia[name]=v['## Medium'];}
      if('## SR Dependencies' in v){const deps=lines(v['## SR Dependencies']).filter(l=>l.trim()).map(l=>{fail(l.startsWith('- ')&&visible(l.slice(2)),'Invalid SR dependency');return l.slice(2);});fail(deps.length&&new Set(deps).size===deps.length,'Empty/duplicate SR dependencies');objectSRDependencies[name]=deps;}
      const info=lines(v['## Information'] ?? '').filter(l=>l.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g, '')).map(l=>{fail(/^- \S.*$/.test(l),'Invalid Information'); return l.slice(2);});
      graph.nodes.push({id:name,type:'object',name,scope:v['## Scope']==='true',icon:v['## Icon']==='(generic icon)'?'box':v['## Icon'],information:info}); return;
    }
    const keys=['## Scope','## Why','## When']; if(has('## Exception When')) keys.push('## Exception When'); keys.push('## Who','## Where','## How','### Input','### Procedure'); if(has('### Exception')) keys.push('### Exception'); keys.push('### Output','## Result'); if(has('## Problem') || has('## Pain level')) keys.push('## Problem','## Pain level');
    const v=sections(body,keys,name,['## How']); fail(!v['## How'],'How must only contain fields'); fail(['true','false'].includes(v['## Scope']),'Invalid Scope');
    const node: GraphNode={id:name,type:'business',name,scope:v['## Scope']==='true',why:v['## Why'],when:v['## When'],who:v['## Who'],where:v['## Where'],result:v['## Result']}; if('## Problem' in v) {node.problem=v['## Problem'];node.pain_level=v['## Pain level'];} graph.nodes.push(node);
    for(const [field,kind] of [['## Exception When','business-exception'],['### Input','input'],['### Output','output']] as const) {
      if(!(field in v) || (kind!=='business-exception' && v[field]==='(none)')) continue;
      lines(v[field]).filter(l=>l.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g, '')).forEach(l=>{const r=/^- (.+?) — (\S.*)$/.exec(l); fail(r,'Invalid relation in '+name); graph.relations.push({kind,from:kind==='output'?name:r![1],to:kind==='output'?r![1]:name,label:r![2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g, '')});});
    }
  });
  const activityOrder=graph.nodes.filter(node=>node.type==='business').map(node=>node.id);
  validateGraph(graph); graph.nodes.sort((a,b)=>codepointCompare(a.id,b.id)); graph.relations.sort((a,b)=>{for(const k of ['kind','from','to','label'] as const){const d=codepointCompare(a[k],b[k]);if(d)return d;}return 0;});
  const names=new Set(graph.nodes.map(n=>n.id));
  for(const finding of findings) finding.unresolvedTargets=finding.targets.filter(t=>!names.has(t));
  const design: Design={graph,sections:sourceSections,markdown,activityOrder,findings};if(Object.keys(objectMedia).length)design.objectMedia=objectMedia;if(Object.keys(objectSRDependencies).length)design.objectSRDependencies=objectSRDependencies;return design;
}

/** Recover explicit media from source; historical sources without Medium need no reparse. */
export function objectMediaFromSource(markdown: string, names: Set<string>): Record<string,string> | undefined {
  if(!lines(markdown).some(l=>l==='## Medium'))return undefined;
  if(!headings(markdown).some(([,h])=>h==='## Medium'))return undefined;
  const media=parseDesign(markdown).objectMedia;
  if(!media)return undefined;
  const restored: Record<string,string> = Object.create(null);
  for(const [id,value] of Object.entries(media))if(names.has(id))restored[id]=value;
  return restored;
}

/** Explicit dependency declarations only. SR verification is separate and is not persisted here. */
export function objectSRDependenciesFromSource(markdown:string,names:Set<string>):Record<string,string[]>|undefined {
  if(!lines(markdown).some(l=>l==='## SR Dependencies')||!headings(markdown).some(([,h])=>h==='## SR Dependencies'))return undefined;
  const source=parseDesign(markdown).objectSRDependencies;if(!source)return undefined;
  const result:Record<string,string[]>=Object.create(null);for(const [id,value] of Object.entries(source))if(names.has(id))result[id]=value;return result;
}
