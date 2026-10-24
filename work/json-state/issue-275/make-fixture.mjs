// Test-only supported projection, not a product conversion of the unsupported SR/Medium source.
import fs from 'node:fs';
import {extractStateDeclarations} from '../../../tools/document_storage/state-declaration.mjs';
import {convertMarkdown} from '../../../tools/document_storage/convert.mjs';
import {stateDocument} from '../../../tools/document_storage/state-storage.mjs';
import {validate,stringify} from '../../../tools/document_storage/core.mjs';
const original=fs.readFileSync(new URL('./original-pr265.md',import.meta.url),'utf8'),extracted=extractStateDeclarations(original);
const omitted=[];
const supported=extracted.markdown.replace(/(^# Object ([^\n]+)\n)([\s\S]*?)(?=^# |$(?![\s\S]))/gm,(whole,heading,name,body)=>heading+body.replace(/^## (Medium|SR Dependencies)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm,(all,key,value)=>{omitted.push({object:name,field:key,body:value.trim()});return '';}));
const sourceBlock=original.slice(original.indexOf('## State Transitions')).split('\n# ')[0];
const notes='試験入力で保持する原典の補助記述（構造化未対応）\n'+omitted.map(x=>`\nObject ${x.object} / ${x.field}\n${x.body}`).join('\n');
const first=supported.indexOf('\n# ');let canonical=supported.slice(0,first)+'\n\n'+notes+'\n'+supported.slice(first);
canonical=canonical.replace(/(# Object 購入申請\n[\s\S]*?)(?=^# |$(?![\s\S]))/m,block=>block+'\n'+sourceBlock+'\n');
const result=convertMarkdown({sources:[{text:canonical,documentId:'purchase-bd',kind:'businessDesign',revision:'bd-1'}],revision:'package-1',stateDocuments:[{documentId:'purchase-states',revision:'states-1',businessDesignId:'purchase-bd',objectName:'購入申請'}]}).package;
validate(result);fs.writeFileSync(new URL('./supported-state.md',import.meta.url),canonical);
fs.writeFileSync(new URL('./purchase.json',import.meta.url),stringify(result));fs.writeFileSync(new URL('./unsupported-fields.json',import.meta.url),JSON.stringify(omitted,null,2)+'\n');
