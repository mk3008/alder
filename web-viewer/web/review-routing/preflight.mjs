// Safe local check: parses the real fixtures and HTML, never launches Chrome,
// calls screenshot, writes image bytes, or claims browser layout measurement.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {loadReviewModel,buildReviewPlans,checkPayloadBudget,inlineReviewStyles,REVIEW_LIMITS,EXPECTED_VISIBLE} from './model.mjs';
import {renderReviewHTML} from './render.mjs';
const model=loadReviewModel(),plans=buildReviewPlans(model),reports=[];
const graphCSS=readFileSync(new URL('../../src/graph-presentation.css',import.meta.url),'utf8'),productCSS=readFileSync(new URL('../../src/style.css',import.meta.url),'utf8');assert.ok(model.productCSS.includes(graphCSS),'actual shared graph rules are inlined');
for(const [product,shared] of [[productCSS+'\n@import "external.css";',graphCSS],[productCSS+'\n.x{background:url(https://invalid.test/a)}',graphCSS],[productCSS,graphCSS+'\n@import "other.css";'],[productCSS.replace('./graph-presentation.css','./other.css'),graphCSS]])assert.throws(()=>inlineReviewStyles(product,shared),'external, duplicate and unexpected imports are rejected');
for(const plan of plans){
  const html=renderReviewHTML(model,plan),dom=new JSDOM(html),doc=dom.window.document;
  assert.equal(doc.querySelector('.review-sheet').dataset.reviewOnly,'true');
  assert.equal(doc.querySelector('.review-sheet').dataset.image,plan.id);
  assert.equal(doc.querySelectorAll('script,img,iframe,link').length,0);
  assert.equal(doc.querySelectorAll('.review-panel').length,2);
  assert.equal(doc.querySelectorAll('svg').length,52);
  assert.equal(doc.querySelectorAll('.node').length,50);
  assert.equal(doc.querySelectorAll('.edge').length,106);
  assert.equal(doc.querySelectorAll('.edge-label').length,106);
  const panels=Array.from(doc.querySelectorAll('.review-panel'));
  for(let i=0;i<panels.length;i++){
    const panel=panels[i],scene=plan.panels[i].scene,crop=panel.querySelector('.review-crop');
    assert.equal(panel.dataset.scene,scene.id);assert.equal(panel.querySelectorAll('svg.review-edges').length,1);
    assert.equal(panel.querySelectorAll('marker').length,1);assert.equal(panel.querySelectorAll('.edge.exception').length,2);
    assert.equal(panel.querySelectorAll('.who-badge').length,10);
    assert.equal(crop.style.width,plan.panelWidth+'px');assert.equal(crop.style.height,plan.panelHeight+'px');
    assert.deepEqual(JSON.parse(crop.dataset.crop),plan.crop);assert.equal(Number(crop.dataset.scale),plan.scale);
    for(const selector of ['.edge','.edge-label'])assert.deepEqual(Array.from(panel.querySelectorAll(selector),n=>Number(n.dataset.relation)),EXPECTED_VISIBLE);
    const labels=Array.from(panel.querySelectorAll('.edge-label'));
    scene.edges.forEach((e,j)=>{assert.equal(labels[j].textContent,e.label);assert.equal(Number(labels[j].getAttribute('x')),e.route.label[0]);assert.equal(Number(labels[j].getAttribute('y')),e.route.label[1]);});
    const nodes=Array.from(panel.querySelectorAll('.node'));
    scene.nodes.forEach((n,j)=>{assert.equal(nodes[j].dataset.node,n.id);assert.equal(nodes[j].style.left,n.x+'px');assert.equal(nodes[j].style.top,n.y+'px');});
  }
  assert.equal(panels[0].querySelector('.review-world').style.transform,panels[1].querySelector('.review-world').style.transform);
  const ids=Array.from(doc.querySelectorAll('[id]'),n=>n.id);assert.equal(new Set(ids).size,ids.length);
  assert.match(html,/Noto Sans CJK JP/);assert.match(html,/default-src 'none'/);
  reports.push({id:plan.id,width:plan.width,height:plan.height,pixels:plan.width*plan.height,scale:plan.scale,crop:plan.crop,panels:panels.length,nodesPerPanel:25,visibleRelationsPerPanel:53,svgElements:52});
  dom.window.close();
}
// Size-accounting boundary tests use anonymous bytes, not encoded image files.
assert.deepEqual(checkPayloadBudget([Buffer.alloc(3),Buffer.alloc(3)]),{pngBytes:6,base64Characters:8});
assert.throws(()=>checkPayloadBudget([Buffer.alloc(REVIEW_LIMITS.pngBytes),Buffer.alloc(1)]),/PNG budget exceeded/);
// Equal binary cap with two padding tails can still exceed the base64 cap.
assert.throws(()=>checkPayloadBudget([Buffer.alloc(1),Buffer.alloc(REVIEW_LIMITS.pngBytes-1)]),/base64 budget exceeded/);
assert.throws(()=>checkPayloadBudget([Buffer.alloc(1)]));
const generator=readFileSync(new URL('../test-routing-review-images.mjs',import.meta.url),'utf8');
assert.equal((generator.match(/\.screenshot\(/g)??[]).length,1,'One capture call site, one pass over the two plans');
assert.match(generator,/assert\.equal\(invoked,false/);assert.match(generator,/checkPayloadBudget\(captures\)/);
assert.ok(generator.indexOf('checkPayloadBudget(captures)')<generator.indexOf("console.log('ROUTING_REVIEW_METADATA "));
assert.doesNotMatch(generator,/(?:writeFile(?:Sync)?|mkdir(?:Sync)?|createWriteStream)\s*\(/);
console.log(JSON.stringify({routingReviewLocalPreflight:{ok:true,sourceHashes:model.sourceHashes,visibleIndexes:model.visibleIndexes,kinds:model.kinds,estimatedConflict:model.estimatedOverlap,plans:reports,validated:'Public fixture hashes and parser; original relation indexes and full node set; finite route geometry; estimated world/crop bounds; real HTML DOM, selectors, SVG counts and label values; one capture call site and one-shot guard; aggregate PNG/base64 boundary checks',notPerformed:'No Chrome, screenshot, rendered font measurement, raster byte-size prediction or image generation'}}));
