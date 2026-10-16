// A single original with independently closable graph views for storage races.
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {createWorkspace,openActivity,snapshotWorkspace} from '../src/workspace.ts';
export function groupSession(){
 const source=readFileSync('web/authorities/ungrouped-alder.md','utf8');
 const original=parseDesign(source),activities=original.activityOrder;
 const design=parseDesign(source);
 const state=createWorkspace({tabs:[{key:'original',name:'original.md',design,positions:{},scroll:[0,0],zoom:1,source:{kind:'url',url:'https://fixture.test/design.md'}}],dark:false,drawer:true,width:380});
 openActivity(state,activities[2]);openActivity(state,activities[0]);return snapshotWorkspace(state);
}
