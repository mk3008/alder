import fs from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {createHash} from 'node:crypto';
const upstream=new URL('../../../web-viewer/src/',import.meta.url),out=new URL('./canvas/',import.meta.url),sources={};
for(const name of ['node-drag','touch-gestures']){
 const code=fs.readFileSync(new URL(name+'.ts',upstream),'utf8');
 sources[name]={path:'web-viewer/src/'+name+'.ts',sha256:createHash('sha256').update(code).digest('hex')};
 fs.writeFileSync(new URL(name+'.js',out),stripTypeScriptTypes(code,{mode:'strip'}).split('\n').map(line=>line.trimEnd()).join('\n'));
}
fs.writeFileSync(new URL('./canvas-provenance.json',import.meta.url),JSON.stringify({kind:'temporary exact reuse of business-graph gesture modules; shared canvas extraction deferred',sources},null,2)+'\n');
