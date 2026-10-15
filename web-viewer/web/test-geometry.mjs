import assert from 'node:assert/strict';
import {nodeBoundary} from '../src/geometry.ts';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8, `${a} != ${b}`);
assert.deepEqual(nodeBoundary([0,0],[500,34],true),[260,34]);
assert.deepEqual(nodeBoundary([0,0],[130,-100],true),[130,0]);
assert.deepEqual(nodeBoundary([0,0],[130,34],true),[130,34]);
let cases=0;
for(const capsule of [true,false])for(let degrees=0;degrees<360;degrees++){
 const r=degrees*Math.PI/180,dx=Math.cos(r),dy=Math.sin(r);
 const [x,y]=nodeBoundary([13,29],[143+dx*500,63+dy*500],capsule);
 const cx=x-143,cy=y-63;
 near(cx*dy,cy*dx);
 if(capsule){const cap=Math.max(0,Math.abs(cx)-96);near(cap*cap+cy*cy,34*34);}
 else near(Math.max(Math.abs(cx)/130,Math.abs(cy)/34),1);
 cases++;
}
console.log(JSON.stringify({boundaryAngles:cases,coincidentCenters:'passed'}));
