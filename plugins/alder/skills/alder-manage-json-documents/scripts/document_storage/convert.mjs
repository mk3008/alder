/** Node-only Markdown adapter; core.mjs/schema.mjs remain browser-portable. */
import {extractStateDeclarations} from './state-declaration.mjs';
import {withRoles} from './roles.mjs';
import {stateDocument} from './state-storage.mjs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {validate,inventory,demand} from './core.mjs';
const parser=fileURLToPath(new URL('./markdown.py',import.meta.url));
const hash=text=>createHash('sha256').update(text).digest('hex');
export class ConversionError extends Error{
 constructor(code,message,documentId=null){super(message);this.name='ConversionError';this.diagnostics=[{code,documentId,message,severity:'error'}];}
}
function fail(code,message,id){throw new ConversionError(code,message,id);}
function parse(source,bd){
 const r=spawnSync(process.env.ALDER_PYTHON||'python3',[parser],{input:JSON.stringify({...source,source:bd}),encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'},maxBuffer:32*1024*1024,timeout:30000});
 if(r.error)fail('PARSER_RUNTIME',r.error.message,source.documentId);
 if(r.status!==0){let message=r.stderr.trim();try{message=JSON.parse(message).message;}catch{}fail('MARKDOWN_PROFILE',message,source.documentId);}
 try{return JSON.parse(r.stdout);}catch{fail('PARSER_PROTOCOL','Parser returned invalid JSON',source.documentId);}
}
function github(value){
 try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password)return null;
 let p=u.pathname.split('/').filter(Boolean);if(u.hostname==='github.com'&&p[2]==='blob')p.splice(2,1);else if(u.hostname!=='raw.githubusercontent.com')return null;
 const [owner,repo,revision,...path]=p;if(!owner||!repo||!path.length||!/^[a-f0-9]{40}$/i.test(revision))return null;
 return [owner.toLowerCase(),repo.toLowerCase(),revision.toLowerCase(),...path].join('/');}catch{return null;}
}
function checkClaim(source,bdSource){
 const claims=source.text.split('\n').filter(l=>/原典|Business Design|^[-*] Source[：:]/i.test(l)).flatMap(l=>[...l.matchAll(/\[[^\]]*\]\((https:\/\/[^)]+)\)/g)].map(m=>github(m[1])).filter(Boolean));
 if(claims.length){const target=github(bdSource?.uri);if(!target)fail('SOURCE_IDENTITY_REQUIRED','Pinned Check source needs a pinned Business Design uri',source.documentId);
 if(claims.some(c=>c!==target))fail('SOURCE_MISMATCH','Check source URI/revision differs from supplied Business Design',source.documentId);}
}
function remap(value,ids){
 if(Array.isArray(value))return value.map(v=>remap(v,ids));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,(['id','objectId','roleId','activityId','fromId','toId','sectionId','guaranteeId','exampleId','targetId'].includes(k)&&typeof v==='string')?(ids.get(v)??v):(['targetIds','checkIds'].includes(k)?v.map(id=>ids.get(id)??id):remap(v,ids))]));
 return value;
}
/** Re-import never matches by position or similarity. Removed/renamed identities require explicit intent. */
function reconcile(pkg,previous,renames,removedIds){
 const old=inventory(previous),fresh=inventory(pkg),mapping=new Map(),used=new Set();
 for(const [id,name]of Object.entries(renames)){
  demand(old.map.has(id)&&['activity','object'].includes(old.types.get(id)),'Rename binding must target prior Activity/Object');
  const matches=[...fresh.map].filter(([n,e])=>fresh.owner.get(n)===old.owner.get(id)&&fresh.types.get(n)===old.types.get(id)&&e.name===name);
  demand(matches.length===1,'Rename binding is missing or ambiguous');mapping.set(matches[0][0],id);used.add(id);
 }
 const key=(entity,type,ids)=>{
  const id=x=>ids.get(x)??x;
  switch(type){case'document':return entity.id;case'activity':case'object':case'state':return entity.name;case'transition':return entity.sourceId;
   case'role':return entity.name;
   case'finding':return entity.sourceId;case'check':return entity.checkId;
   case'relation':return JSON.stringify([entity.kind,id(entity.fromId),id(entity.toId),entity.label]);
   case'section':return entity.activityId===null?entity.title:id(entity.activityId);case'guarantee':return JSON.stringify([id(entity.sectionId),entity.title]);
   case'example':return JSON.stringify([id(entity.guaranteeId),entity.columns]);case'note':return entity.title;
   default:throw Error('Unknown identity type');}
 };
 for(const type of ['document','object','activity','finding','check','relation','section','guarantee','example','note','state','transition','role']){
  const before=[...old.map].filter(([id])=>old.types.get(id)===type);
  for(const [id,e]of fresh.map){if(fresh.types.get(id)!==type||mapping.has(id))continue;
   const matches=before.filter(([oid,o])=>old.owner.get(oid)===fresh.owner.get(id)&&key(o,type,new Map())===key(e,type,mapping));
   demand(matches.length<=1,'Ambiguous prior identity: '+type);
   if(matches.length){const target=matches[0][0];demand(!used.has(target),'Identity mapping collision');mapping.set(id,target);used.add(target);}
  }
 }
 for(const id of removedIds)demand(old.map.has(id)&&!used.has(id),'Invalid removed identity declaration');
 const missing=[...old.map.keys()].filter(id=>!used.has(id)&&!removedIds.includes(id));
 if(missing.length)fail('IDENTITY_UNRESOLVED','Prior IDs were removed or renamed; explicit rename/removedIds required: '+missing.join(','));
 return remap(pkg,mapping);
}
export function convertMarkdown(request){
 try{
 const allowed=['sources','revision','previousPackage','expectedRevision','renameBindings','removedIds','externalDocuments','externalSources','stateDocuments','roleCatalog'];
 demand(request&&Object.keys(request).every(k=>allowed.includes(k)),'Unknown conversion option');
 const {sources,revision,previousPackage=null,expectedRevision=null,renameBindings={},removedIds=[],externalDocuments=[],externalSources=[],stateDocuments=[],roleCatalog=false}=request;
 demand(typeof roleCatalog==='boolean','roleCatalog must be boolean');
 demand(Array.isArray(sources)&&sources.length>0,'Sources required');demand(typeof revision==='string'&&revision.trim(),'Package revision required');
 const ids=new Set();for(const s of sources){demand(s&&Object.keys(s).every(k=>['text','documentId','kind','revision','uri','basedOn'].includes(k)),'Unknown source option');demand(s&&typeof s.text==='string','Markdown text required');demand(/^[A-Za-z0-9_-]+$/.test(s.documentId),'Stable documentId required');demand(!ids.has(s.documentId),'Duplicate source documentId');ids.add(s.documentId);demand(typeof s.revision==='string'&&s.revision.trim(),'Source revision required');demand(['businessDesign','checkItems'].includes(s.kind),'Unsupported source kind');}
 if(previousPackage){validate(previousPackage);demand(previousPackage.revision===expectedRevision,'Revision conflict');}
 else demand(!Object.keys(renameBindings).length&&!removedIds.length,'Identity changes require previousPackage');
 const documents=[];const stateModels=[];
 for(const s of sources.filter(s=>s.kind==='businessDesign')){
  const extracted=stateDocuments.length?extractStateDeclarations(s.text):{markdown:s.text,declarations:[]};const bd=parse({...s,text:extracted.markdown});documents.push(bd);
  for(const model of extracted.declarations){const descriptors=stateDocuments.filter(d=>d.businessDesignId===bd.id&&d.objectName===model.object);demand(descriptors.length===1,'Explicit state document ID/revision required');const descriptor=descriptors[0];demand(Object.keys(descriptor).sort().join('|')===['documentId','revision','businessDesignId','objectName'].sort().join('|'),'Unknown state descriptor');stateModels.push(stateDocument(model,bd,descriptor));}
 }
 demand(stateModels.length===stateDocuments.length,'Missing/duplicate explicit State declaration');
 for(const s of sources.filter(s=>s.kind==='checkItems')){
  demand(s.basedOn&&s.basedOn.documentId&&s.basedOn.revision,'Check basedOn required');demand(Object.keys(s.basedOn).every(k=>['documentId','revision'].includes(k)),'Unknown basedOn option');
  const bd=[...documents,...externalDocuments].find(d=>d.id===s.basedOn.documentId);
  demand(bd?.kind==='businessDesign','Check source document missing');demand(bd.revision===s.basedOn.revision,'Check source revision mismatch');
  checkClaim(s,[...sources,...externalSources].find(d=>d.documentId===bd.id));documents.push(parse(s,bd));
 }
 documents.push(...stateModels);
 let pkg={format:'alder-document-package',formatVersion:stateModels.length?'0.2':'0.1',revision,documents,sources:[...sources.map(s=>({documentId:s.documentId,revision:s.revision,sha256:hash(s.text),uri:s.uri??''})),...structuredClone(externalSources)],externalDocuments:structuredClone(externalDocuments),diagnostics:[]};
 if(roleCatalog){pkg.formatVersion='0.3';pkg.documents=pkg.documents.map(d=>d.kind==='businessDesign'?withRoles(d,pkg.diagnostics,previousPackage?.documents.find(p=>p.id===d.id),renameBindings):d);}
 if(previousPackage)pkg=reconcile(pkg,previousPackage,renameBindings,removedIds);
 if(roleCatalog){pkg.diagnostics=pkg.diagnostics.filter(s=>!s.startsWith('Role未確定: '));for(const d of pkg.documents.filter(d=>d.kind==='businessDesign'))for(const a of d.activities)if(a.roleId===null)pkg.diagnostics.push('Role未確定: '+a.id+' — '+a.who);}
 if(previousPackage?.formatVersion==='0.3')demand(roleCatalog,'Role catalog must be retained on re-import');
 validate(pkg);
 if(previousPackage){for(const doc of pkg.documents){const prior=previousPackage.documents.find(d=>d.id===doc.id);if(prior&&JSON.stringify(prior)!==JSON.stringify(doc))demand(prior.revision!==doc.revision,'Changed document requires new revision');}
 demand(JSON.stringify(previousPackage)===JSON.stringify(pkg)||previousPackage.revision!==pkg.revision,'Changed package requires new revision');}
 return {package:pkg,diagnostics:validate(pkg).diagnostics.map(message=>({code:'UNVERIFIED_MEANING',severity:'warning',message})),approval:'not-evaluated'};
 }catch(e){if(e instanceof ConversionError)throw e;fail('INVALID_CONVERSION',e.message);}
}
