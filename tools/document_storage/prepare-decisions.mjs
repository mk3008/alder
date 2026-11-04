import {demand,validate} from './core.mjs';

/** Explicit, non-destructive preparation: do not rebase dependent documents or invent decisions. */
export function prepareDecisionUpgrade(previous,request){
 validate(previous);demand(previous.formatVersion==='0.6','Only the 0.6 candidate can be prepared');
 demand(request&&Object.keys(request).every(k=>['expectedRevision','expectedSha256','revision','businessRevisions'].includes(k)),'Unknown migration request field');
 demand(request.expectedRevision===previous.revision,'Source package revision conflict');
 demand(typeof request.expectedSha256==='string'&&/^[0-9a-f]{64}$/.test(request.expectedSha256),'Source SHA-256 required');
 demand(typeof request.revision==='string'&&request.revision.trim()&&request.revision!==previous.revision,'New package revision required');
 const designs=previous.documents.filter(doc=>doc.kind==='businessDesign'),revisions=request.businessRevisions;
 demand(revisions&&typeof revisions==='object'&&!Array.isArray(revisions)&&Object.keys(revisions).length===designs.length&&designs.every(doc=>typeof revisions[doc.id]==='string'&&revisions[doc.id].trim()&&revisions[doc.id]!==doc.revision),'A new revision is required for each Business Design');
 const documents=structuredClone(designs);for(const doc of documents){doc.schemaVersion='0.6';doc.revision=revisions[doc.id];for(const activity of doc.activities){activity.decisions=[];for(const step of activity.procedure.steps){step.decisionIds=[];step.whenDecision=null;}}}
 const ids=new Set(designs.map(doc=>doc.id));const next={...structuredClone(previous),formatVersion:'0.7',revision:request.revision,documents,sources:previous.sources.filter(source=>ids.has(source.documentId)),externalDocuments:[]};
 const result=validate(next);return {next,report:{approval:'not-evaluated',sourceFormat:'0.6',candidateFormat:'0.7',sourceRevision:previous.revision,candidateRevision:next.revision,
  dependenciesRetainedInSource:previous.documents.filter(doc=>doc.kind!=='businessDesign').map(doc=>({id:doc.id,kind:doc.kind,revision:doc.revision})),externalCatalogRetainedInSource:previous.externalDocuments.map(doc=>doc.id),
  review:['既存のCheck・State・概念の原本と人間確認状態は元ファイルに保持','依存文書の移行・原典改版への対応は別途明示的に確認','判定表は空の候補。元の手順・Data・やり取り・IDを引き継ぎ、判定内容は推測しない'],diagnostics:result.diagnostics}};
}
