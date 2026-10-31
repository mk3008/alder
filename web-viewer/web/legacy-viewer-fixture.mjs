// Keep geometry/filter/drag regression inputs ungrouped. This changes only the
// bundled sample data, not production modules or any test assertion. The live
// Group sample and canonical storage have separate application regressions.
import {build as esbuild} from 'esbuild';
import {readFileSync} from 'node:fs';
export function build(options){return esbuild({...options,plugins:[...(options.plugins??[]),{name:'legacy-document-fixture',setup(b){b.onLoad({filter:/business-design\/alder\/(README\.md|business-design\.json)$/},()=>({contents:readFileSync(new URL('./authorities/ungrouped-alder.md',import.meta.url),'utf8'),loader:'text'}));}}]});}
