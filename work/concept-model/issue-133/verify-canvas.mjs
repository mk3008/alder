import assert from 'node:assert/strict';
import {createNodeDrag} from './canvas/node-drag.js';
import {installTouchGestures} from './canvas/touch-gestures.js';
let position=[100,100],zoom=.5,scroll=[0,0],selected,finished=0;
const drag=createNodeDrag({read:()=>({key:'overview',zoom,scroll,offset:[0,0]}),position:()=>position,connected:()=>true,bounds:()=>({left:0,top:0,right:1000,bottom:1000}),change:(_,p)=>position=p,pan:d=>{scroll=[scroll[0]+d[0],scroll[1]+d[1]];},requestFrame:()=>0,cancelFrame:()=>{}});
drag.begin('receipt',[300,300]);drag.move([340,320]);assert.deepEqual(position,[180,140]);assert.equal(drag.end().moved,true);
zoom=2;position=[100,100];drag.begin('receipt',[300,300]);drag.move([340,320]);assert.deepEqual(position,[120,110]);drag.end();
const listeners={},viewport={clientLeft:0,clientTop:0,getBoundingClientRect:()=>({left:0,top:0}),addEventListener:(k,fn)=>listeners[k]=fn,setPointerCapture:()=>{},hasPointerCapture:()=>false};
const touch=installTouchGestures(viewport,{nodeDrag:drag,read:()=>({key:'overview',zoom,scroll,locked:false}),position:()=>position,change:v=>{if(v.node)position=v.node.position;if(v.zoom!==undefined)zoom=v.zoom;if(v.scroll)scroll=v.scroll;if(v.selected)selected=v.selected;},finish:()=>finished++});
const target={closest:selector=>selector==='.node'?{dataset:{node:'receipt'}}:null};
function fire(type,id,x,y){listeners[type]({type,pointerType:'touch',pointerId:id,target,clientX:x,clientY:y,preventDefault(){},stopImmediatePropagation(){}});}
zoom=1;scroll=[0,0];position=[100,100];fire('pointerdown',1,300,300);fire('pointermove',1,330,300);assert.deepEqual(position,[130,100]);fire('pointerdown',2,400,300);assert.deepEqual(position,[100,100],'second touch rolls tentative drag back');fire('pointermove',2,500,300);assert(zoom>1,'pinch zoom');fire('pointerup',2,500,300);fire('pointerup',1,330,300);assert.equal(selected,undefined,'pinch must not navigate');
fire('pointerdown',3,300,300);fire('pointerup',3,300,300);assert.equal(selected,'receipt','tap navigates');assert(finished>=3);touch.cancel();
console.log('PASS reused gesture modules: zoom-aware drag, pinch rollback, no navigation after pinch, tap navigation');
