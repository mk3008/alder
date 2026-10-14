import type {Design, Finding, GraphNode} from './graph';
import {formattedMarkdown} from './markdown';

export const findingLabel = (kind: Finding['kind']) => kind==='question'?'要確認':'要修正';
export function nodeFindingLabels(design: Design, node: GraphNode): string[] {
  const labels: string[]=[];
  if(typeof node.problem==='string')labels.push('困りごと');
  for(const kind of ['question','correction'] as const){
    const count=(design.findings??[]).filter(f=>f.status==='open'&&f.kind===kind&&f.targets.includes(node.id)).length;
    if(count)labels.push(`${findingLabel(kind)} ${count}`);
  }
  return labels;
}
export function findingCard(finding: Finding): HTMLElement {
  const card=document.createElement('section');card.className='finding-card';card.dataset.findingId=finding.id;
  const title=document.createElement('h3');title.textContent=`${findingLabel(finding.kind)} · ${finding.id}${finding.status==='resolved'?' · 解消済み':''}`;
  const summary=document.createElement('p');summary.className='finding-summary';summary.textContent=finding.summary;
  const target=document.createElement('p');target.className='finding-target';
  target.textContent=finding.scope==='document'?'対象：文書全体':finding.scope==='unassigned'?'関連先：未設定':`対象：${finding.targets.join('、')}`;
  card.append(title,summary,target);
  if(finding.unresolvedTargets.length){const warning=document.createElement('p');warning.className='finding-reference-warning';warning.textContent=`参照先が見つかりません：${finding.unresolvedTargets.join('、')}`;card.append(warning);}
  card.append(formattedMarkdown(finding.content));return card;
}
export function findingsPanel(design: Design, nodeId?: string): HTMLElement {
  const root=document.createElement('section');root.className='findings-panel';
  const title=document.createElement('h2');title.textContent=nodeId?'この項目の指摘':'指摘一覧';root.append(title);
  const toggle=document.createElement('input');toggle.type='checkbox';
  const label=document.createElement('label');label.className='finding-filter';label.append(toggle,document.createTextNode('解消済みも表示'));root.append(label);
  const list=document.createElement('div');list.className='findings-list';root.append(list);
  const relevant=(design.findings??[]).filter(f=>!nodeId||f.targets.includes(nodeId));
  const render=()=>{
    list.replaceChildren();
    const problems=design.graph.nodes.filter(n=>(!nodeId||n.id===nodeId)&&typeof n.problem==='string');
    for(const n of problems){const card=document.createElement('section');card.className='finding-card business-problem';const h=document.createElement('h3');h.textContent=`困りごと · ${n.name}（${String(n.pain_level)}）`;card.append(h,formattedMarkdown(String(n.problem)));list.append(card);}
    const groups=nodeId?[['items','関連する指摘']]:[['items','項目への指摘'],['document','文書全体'],['unassigned','関連先未設定'],['broken','参照先不一致']];
    for(const [scope,caption] of groups){const found=relevant.filter(f=>(toggle.checked||f.status==='open')&&(nodeId?true:scope==='broken'?f.unresolvedTargets.length>0:f.scope===scope&&!f.unresolvedTargets.length));if(!found.length)continue;const h=document.createElement('h3');h.textContent=`${caption}（${found.length}件）`;list.append(h,...found.map(findingCard));}
    if(!list.childElementCount){const empty=document.createElement('p');empty.textContent='表示する未解決の指摘はありません。';list.append(empty);}
  };
  toggle.onchange=render;render();return root;
}
