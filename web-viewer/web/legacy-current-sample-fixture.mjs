import {build as esbuild} from 'esbuild';
import {readFileSync} from 'node:fs';

// Keep old Markdown sample/check interactions covered at the compatibility boundary.
export function build(options){return esbuild({...options,plugins:[...(options.plugins??[]),{name:'legacy-current-sample',setup(b){b.onLoad({filter:/business-design\/alder\/business-design\.json$/},()=>({contents:readFileSync(new URL('../../business-design/alder/README.md',import.meta.url),'utf8'),loader:'text'}));}}]});}
