// Read-only check; pass a current Viewer graph.ts and two independently exported graphs.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [parser,design,graphFile]=process.argv.slice(2);
const {parseDesign,validateGraph}=await import(pathToFileURL(parser).href);
const d=parseDesign(fs.readFileSync(design,'utf8')); validateGraph(d.graph);
assert.deepEqual(d.graph,JSON.parse(fs.readFileSync(graphFile,'utf8')));
assert.deepEqual(d.activityOrder,['相談を受付する','次の連絡方法を説明する']);
for(const name of d.activityOrder)assert(d.sections[name].includes('### Procedure'));
console.log('parseDesign/exporter equality; 2 Activities, 2 Objects, 4 relations; Activity sections OK');
