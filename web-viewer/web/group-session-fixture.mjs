// A single original with independently closable graph views for storage races.
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {createWorkspace,openGroup,snapshotWorkspace} from '../src/workspace.ts';
import {withTestGroups} from './document-test-view.mjs';
export function groupSession(){
 const source=readFileSync('web/authorities/ungrouped-alder.md','utf8');
 const original=parseDesign(source),activities=original.activityOrder;
 const design=parseDesign(withTestGroups(source,[['First',activities.slice(0,2)],['Second',activities.slice(2,4)]]));
 const state=createWorkspace({tabs:[{key:'original',name:'original.md',design,positions:{},scroll:[0,0],zoom:1,source:{kind:'url',url:'https://fixture.test/design.md'}}],dark:false,drawer:true,width:380});
 openGroup(state,'Second');openGroup(state,'First');return snapshotWorkspace(state);
}
