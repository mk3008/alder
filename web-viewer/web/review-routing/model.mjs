// Public-fixture, review-only geometry. Nothing here is imported by the product.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {parseDesign} from '../../src/graph.ts';
import {hiddenReadIndexes} from '../../src/edge-visibility.ts';
import {routeEdge as baselineRoute} from './baseline-routing.ts';
import {routeEdge as candidateRoute} from './candidate-routing.ts';

export const sha256=value=>createHash('sha256').update(value).digest('hex');
export const EXPECTED_VISIBLE=[0,1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,18,19,24,26,27,28,30,31,33,34,35,36,37,38,39,40,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62];
export const EXPECTED_HIDDEN=[7,17,20,21,22,23,25,29,32,41];
export const SOURCE_HASHES={
  sample:'64701618618bd565fb540647cf15c06e20d3f3f6fc45dc8b64244c01e3910aa5',
  baseline:'338f8765aa8e05ec0ff66d59800aef16ed5069674c1ed627342a33eee9676e81',
  candidate:'b15627ccadfe9a8c78873722b45f25fc5c575785bc42e8906dfe662dc996a1b1',
  currentPositions:'4fbf3a95abb67f667161f30621716438944827d57cf1ea6b390b907a99827229',
  staircasePositions:'d0dbaf1fcc3afc3030cb746815a1442dd05970ab78bb124e488e5f011f40aa6d'
};
export const REVIEW_LIMITS=Object.freeze({pngBytes:384*1024,base64Characters:512*1024,chunkCharacters:6000,imageCount:2,maxPixelsPerImage:1_500_000});
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
export function overlap(a,b){return a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;}
export function union(boxes,padding=0){
  assert.ok(boxes.length);
  const left=Math.floor(Math.min(...boxes.map(b=>b.x))-padding),top=Math.floor(Math.min(...boxes.map(b=>b.y))-padding);
  const right=Math.ceil(Math.max(...boxes.map(b=>b.x+b.width))+padding),bottom=Math.ceil(Math.max(...boxes.map(b=>b.y+b.height))+padding);
  return {x:left,y:top,width:right-left,height:bottom-top};
}
export const contains=(outer,inner,epsilon=0.001)=>inner.x>=outer.x-epsilon&&inner.y>=outer.y-epsilon&&inner.x+inner.width<=outer.x+outer.width+epsilon&&inner.y+inner.height<=outer.y+outer.height+epsilon;

export function loadReviewModel(){
  const raw={sample:read('../../../business-design/alder/README.md'),baseline:read('./baseline-routing.ts'),candidate:read('./candidate-routing.ts'),currentPositions:read('./positions-current.json'),staircasePositions:read('./positions-staircase.json')};
  for(const [key,value] of Object.entries(raw))assert.equal(sha256(value),SOURCE_HASHES[key],`Public review fixture changed: ${key}`);
  assert.equal(sha256(read('../../src/routing.ts')),SOURCE_HASHES.baseline,'Review must not replace the product router');
  const design=parseDesign(raw.sample),graph=design.graph,hidden=hiddenReadIndexes(graph.relations,true);
  assert.equal(graph.nodes.length,25);assert.equal(graph.relations.length,63);
  assert.deepEqual([...hidden].sort((a,b)=>a-b),EXPECTED_HIDDEN);
  const visible=graph.relations.map((relation,index)=>({...relation,index})).filter(r=>!hidden.has(r.index));
  assert.deepEqual(visible.map(r=>r.index),EXPECTED_VISIBLE);
  const kinds=Object.fromEntries(['input','output','business-exception'].map(kind=>[kind,visible.filter(r=>r.kind===kind).length]));
  assert.deepEqual(kinds,{input:34,output:17,'business-exception':2});
  const current=JSON.parse(raw.currentPositions),staircase=JSON.parse(raw.staircasePositions);
  for(const positions of [current,staircase]){
    assert.deepEqual(Object.keys(positions).sort(),graph.nodes.map(n=>n.id).sort());
    assert.ok(Object.values(positions).every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)));
  }
  const scene=(id,positions,route,router)=>{
    const nodes=graph.nodes.map(n=>({...n,x:positions[n.id][0],y:positions[n.id][1],width:260,height:68}));
    const obstacles=nodes.map(({id,x,y,width,height})=>({id,x,y,width,height}));
    const edges=visible.map(r=>{
      const labelWidth=Math.max(30,r.label.length*12),result=route({from:r.from,to:r.to,index:r.index,nodes:obstacles,labelWidth,labelHeight:18});
      assert.match(result.path,/^M/);assert.doesNotMatch(result.path,/NaN|Infinity/);
      assert.ok(result.points.flat().every(Number.isFinite));assert.ok(result.label.every(Number.isFinite));
      return {...r,route:result,labelBounds:{x:result.label[0]-labelWidth/2,y:result.label[1]-9,width:labelWidth,height:18}};
    });
    const extent=union([...nodes,...edges.map(e=>e.labelBounds),...edges.flatMap(e=>e.route.points.map(([x,y])=>({x,y,width:0,height:0})))]);
    return {id,router,nodes,edges,extent};
  };
  const scenes={currentOld:scene('current-old',current,baselineRoute,'baseline'),staircaseOld:scene('staircase-old',staircase,baselineRoute,'baseline'),staircaseNew:scene('staircase-new',staircase,candidateRoute,'candidate')};
  assert.deepEqual(scenes.staircaseOld.nodes,scenes.staircaseNew.nodes);
  const known=scenes.staircaseNew.edges.find(e=>e.index===59),target=scenes.staircaseNew.nodes.find(n=>n.id==='業務設計書');
  assert.equal(known.to,target.id);assert.equal(known.route.fallback,true);assert.ok(overlap(known.labelBounds,target));
  // Estimated routing boxes are deliberately not substituted for browser glyphs.
  const estimatedOverlap={relation:59,target:target.id,width:Math.min(known.labelBounds.x+known.labelBounds.width,target.x+260)-Math.max(known.labelBounds.x,target.x),height:Math.min(known.labelBounds.y+18,target.y+68)-Math.max(known.labelBounds.y,target.y)};
  const productCSS=read('../../src/style.css');
  assert.doesNotMatch(productCSS,/@import|url\(/i,'Review stylesheet must be self-contained');
  return {graph,scenes,kinds,visibleIndexes:EXPECTED_VISIBLE,hiddenIndexes:EXPECTED_HIDDEN,sourceHashes:{...SOURCE_HASHES,productCSS:sha256(productCSS)},productCSS,estimatedOverlap};
}

export function buildReviewPlans(model){
  // One union and one scale for the overview, never independent fitting.
  const overviewCrop=union([model.scenes.currentOld.extent,model.scenes.staircaseNew.extent,{x:0,y:0,width:0,height:0}],24);
  const contentWidth=984,overviewScale=contentWidth/overviewCrop.width;
  const overview={id:'overview',width:1008,heading:'Review-only routing diagram · public Alder sample',note:'Write-preferred: 53 relations (Read 34 / Write 17 / exceptions 2), all 25 cards. Common world crop and scale.',crop:overviewCrop,scale:overviewScale,panels:[{scene:model.scenes.currentOld,title:'Current coordinates + baseline router 338f8765'},{scene:model.scenes.staircaseNew,title:'Staircase coordinates + candidate router b15627cc'}]};
  // Both copies have all 25 cards and 53 routes; CSS clipping isolates relation 59.
  // This fixed crop includes both endpoint cards and both complete estimated labels.
  const detail={id:'detail-edge-59',width:800,heading:'Review-only detail · relation 59 · identical staircase coordinates',note:'業務設計 → 業務設計書. Same crop, scale and CSS. Label positions and conflicts are unchanged.',crop:{x:-20,y:306,width:776,height:302},scale:1,panels:[{scene:model.scenes.staircaseOld,title:'Baseline router 338f8765 · relation 59'},{scene:model.scenes.staircaseNew,title:'Candidate router b15627cc · relation 59 (routing-estimate conflict)'}]};
  for(const plan of [overview,detail]){
    plan.panelWidth=plan.width-24;plan.panelHeight=Math.ceil(plan.crop.height*plan.scale);
    plan.height=76+2*(28+plan.panelHeight)+12;
    assert.ok(Number.isFinite(plan.scale)&&plan.scale>0&&plan.scale<=1);
    assert.equal(plan.panelWidth,plan.crop.width*plan.scale);
    assert.ok(plan.width*plan.height<=REVIEW_LIMITS.maxPixelsPerImage);
    for(const {scene} of plan.panels){
      assert.equal(scene.nodes.length,25);assert.deepEqual(scene.edges.map(e=>e.index),EXPECTED_VISIBLE);
      if(plan.id==='overview')assert.ok(contains(plan.crop,scene.extent));
      else{
        const edge=scene.edges.find(e=>e.index===59);
        assert.ok(contains(plan.crop,edge.labelBounds));
        for(const node of scene.nodes.filter(n=>[edge.from,edge.to].includes(n.id)))assert.ok(contains(plan.crop,node));
      }
    }
  }
  return [overview,detail];
}

// Check both totals before emitting any payload. There is no compression retry.
export function checkPayloadBudget(buffers){
  assert.equal(buffers.length,REVIEW_LIMITS.imageCount);
  const pngBytes=buffers.reduce((n,b)=>n+b.length,0),base64Characters=buffers.reduce((n,b)=>n+4*Math.ceil(b.length/3),0);
  assert.ok(pngBytes<=REVIEW_LIMITS.pngBytes,`Review PNG budget exceeded: ${pngBytes}/${REVIEW_LIMITS.pngBytes}; do not recapture`);
  assert.ok(base64Characters<=REVIEW_LIMITS.base64Characters,`Review base64 budget exceeded: ${base64Characters}/${REVIEW_LIMITS.base64Characters}; do not recapture`);
  return {pngBytes,base64Characters};
}
