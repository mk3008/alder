import fs from 'node:fs';import {upgradeRoles} from '../../../tools/document_storage/roles.mjs';import {stringify} from '../../../tools/document_storage/core.mjs';
for(const [source,name]of [['../../viewer-json/issue-274/layout-regression/same-business.json','same-business.roles.json'],['../../json-state/issue-275/purchase.json','purchase.roles.json'],['../../plugin-json/issue-273/snapshots/04-final-after-replay.json','gate-b.roles.json']]){
 const pkg=JSON.parse(fs.readFileSync(new URL(source,import.meta.url))),documentRevisions=Object.fromEntries(pkg.documents.map(d=>[d.id,{expected:d.revision,next:d.revision+'-roles-1'}]));
 const next=upgradeRoles(pkg,{expectedRevision:pkg.revision,revision:pkg.revision+'-roles-1',documentRevisions});fs.writeFileSync(new URL(name,import.meta.url),stringify(next));
}
