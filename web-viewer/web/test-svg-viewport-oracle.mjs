import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

export const svgMatrixTolerance=1e-6;
export const svgScreenTolerance=.08;

// Independent implementation of SVG 2 section 8.2. Inputs are the measured
// CSS viewport and declared viewBox, never getScreenCTM or product functions.
// https://www.w3.org/TR/SVG2/coords.html#ComputingAViewportsTransform
export function svgViewportTransform({rect,viewBox,preserveAspectRatio=null}){
 for(const [name,box] of [['viewport',rect],['viewBox',viewBox]]){
  assert.ok(Array.isArray(box)&&box.length===4&&box.every(Number.isFinite),name+' must contain four finite values');
  assert.ok(box[2]>0&&box[3]>0,name+' must have positive dimensions');
 }
 const [align='xMidYMid',meetOrSlice='meet',extra]=(preserveAspectRatio??'').trim().split(/\s+/).filter(Boolean);
 assert.ok(/^(none|x(Min|Mid|Max)Y(Min|Mid|Max))$/.test(align),'valid preserveAspectRatio alignment');
 assert.ok(['meet','slice'].includes(meetOrSlice)&&extra===undefined,'valid preserveAspectRatio meet/slice');
 const [x,y,width,height]=rect,[vx,vy,vwidth,vheight]=viewBox;
 let sx=width/vwidth,sy=height/vheight;
 if(align!=='none')sx=sy=meetOrSlice==='meet'?Math.min(sx,sy):Math.max(sx,sy);
 const offset=(value,remainder)=>value==='Mid'?remainder/2:value==='Max'?remainder:0;
 return [sx,0,0,sy,x-vx*sx+offset(align.slice(1,4),width-vwidth*sx),y-vy*sy+offset(align.slice(5,8),height-vheight*sy)];
}

export function assertSvgMatrix(actual,expected,message='SVG matrix'){
 assert.ok(Array.isArray(actual)&&actual.length===6&&actual.every(Number.isFinite),message+' must contain all six finite CTM values');
 for(const [index,key] of ['a','b','c','d','e','f'].entries())assert.ok(Math.abs(actual[index]-expected[index])<svgMatrixTolerance,`${message}.${key}: ${actual[index]} ≈ ${expected[index]} (strict ${svgMatrixTolerance})`);
}

// Checking all four corners bounds affine error everywhere in this rectangle,
// including far-offscreen world geometry, rather than only near the origin.
export function assertSvgLogicalExtent(actual,intended,bounds,message='SVG logical extent'){
 assert.ok(bounds.length===4&&bounds.every(Number.isFinite)&&bounds[2]>=bounds[0]&&bounds[3]>=bounds[1],'finite ordered world bounds');
 for(const x of [bounds[0],bounds[2]])for(const y of [bounds[1],bounds[3]])for(const axis of [0,1]){
  const project=m=>m[axis]*x+m[axis+2]*y+m[axis+4],value=project(actual),expected=project(intended);
  assert.ok(Number.isFinite(value)&&Math.abs(value-expected)<svgScreenTolerance,`${message} (${x}, ${y}) ${axis?'y':'x'}: ${value} ≈ ${expected} (< ${svgScreenTolerance}px)`);
 }
}

export function preflightSvgViewportOracle(){
 // Expected matrices are hand-calculated fixtures, not oracle round trips.
 const fixtures=[
  [{rect:[10,20,200,100],viewBox:[0,0,100,100]},[1,0,0,1,60,20]],
  [{rect:[10,20,200,100],viewBox:[5,10,100,100],preserveAspectRatio:'xMidYMid meet'},[1,0,0,1,55,10]],
  [{rect:[10,20,200,100],viewBox:[5,10,100,100],preserveAspectRatio:'none'},[2,0,0,1,0,10]],
  [{rect:[10,20,200,100],viewBox:[5,10,100,100],preserveAspectRatio:'xMaxYMax slice'},[2,0,0,2,0,-100]],
  [{rect:[10,20,100,200],viewBox:[0,0,100,100],preserveAspectRatio:'xMinYMax'},[1,0,0,1,10,120]],
  [{rect:[10,20,100,200],viewBox:[0,0,100,100],preserveAspectRatio:'xMaxYMin slice'},[2,0,0,2,-90,20]],
  [{rect:[10,20,100,100],viewBox:[-5,-10,100,100]},[1,0,0,1,15,30]]
 ];
 for(const [input,expected] of fixtures)assert.deepEqual(svgViewportTransform(input),expected);
 const expected=[.36,0,0,.36,14.4,108],bounds=[0,0,1916,2564];
 assertSvgMatrix(expected,expected);assertSvgLogicalExtent(expected,expected,bounds);
 const mutations=[['wrong x scale',0,.001],['wrong y scale',3,.001],['x skew',2,.001],['y skew',1,.001],['wrong x translation',4,.1],['wrong y translation',5,.1]];
 for(const [name,index,delta] of mutations){const actual=[...expected];actual[index]+=delta;assert.throws(()=>assertSvgMatrix(actual,expected,name),{name:'AssertionError'});assert.throws(()=>assertSvgLogicalExtent(actual,expected,bounds,name),{name:'AssertionError'});}
 for(let index=0;index<6;index++){const actual=[...expected];actual[index]+=2e-6;assertSvgLogicalExtent(actual,expected,bounds);assert.throws(()=>assertSvgMatrix(actual,expected,'small but incorrect coefficient '+index),{name:'AssertionError'});}
 assert.throws(()=>assertSvgMatrix(expected.slice(0,4),expected),/all six/);
 assert.throws(()=>assertSvgMatrix([NaN,...expected.slice(1)],expected),/all six/);
 assert.throws(()=>svgViewportTransform({rect:[0,0,1,1],viewBox:[0,0,0,1]}),/positive dimensions/);
 // Synthetic subpixel layout quantization is allowed only if both independent
 // gates pass. This is not a claim about the unresolved CI 40 native values.
 const rounded=svgViewportTransform({rect:[14.390625,108,689.75,923.03125],viewBox:[0,0,1916,2564]});
 assert.ok(Math.abs(rounded[0]-.36)>svgMatrixTolerance,'fixture reproduces why logical zoom is not a strict CTM oracle');
 assertSvgMatrix(rounded,rounded);assertSvgLogicalExtent(rounded,expected,bounds);
 const wrongViewport=svgViewportTransform({rect:[14.4,108,691.676,924.964],viewBox:[0,0,1916,2564]});
 assertSvgMatrix(wrongViewport,wrongViewport);assert.throws(()=>assertSvgLogicalExtent(wrongViewport,expected,bounds),{name:'AssertionError'});
 const tinyScale=[...expected];tinyScale[0]+=5e-7;assertSvgMatrix(tinyScale,expected);assert.throws(()=>assertSvgLogicalExtent(tinyScale,expected,[0,0,1e6,2564]),{name:'AssertionError'});
 for(const boundary of [.08,-.08])assert.throws(()=>assertSvgLogicalExtent([1,0,0,1,boundary,0],[1,0,0,1,0,0],[0,0,1,1]),{name:'AssertionError'});
 return {positiveTransforms:fixtures.length,negativeMatrices:mutations.length+8,negativeExtents:mutations.length+4,invalidViewport:1,syntheticRoundedViewport:'passed both gates',nativeBrowserExecuted:false};
}

if(process.argv[1]===fileURLToPath(import.meta.url))console.log(JSON.stringify({svgViewportOraclePreflight:preflightSvgViewportOracle()}));
