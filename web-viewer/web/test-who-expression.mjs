// Source/CSSOM/DOM regression only. No browser rendering or screenshot assertion.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {build} from 'esbuild';

import {roleColors,rolePalette as palette} from '../src/role-colors.ts';
import {parseDesign} from '../src/graph.ts';
const css=readFileSync('src/style.css','utf8');
const styleDom=new JSDOM('<style>'+css+'</style>');
const rules=[...styleDom.window.document.styleSheets[0].cssRules];
const badgeRules=rules.filter(r=>r.selectorText?.includes('.node .who-badge'));
const roleBadgeRule=rules.find(r=>r.selectorText==='.role-heading .who-badge');assert.ok(roleBadgeRule);assert.equal(roleBadgeRule.style.background,'var(--role-color)');assert.ok(['white','rgb(255, 255, 255)'].includes(roleBadgeRule.style.color));
assert.deepEqual(badgeRules.map(r=>r.selectorText),['.node .who-badge,.detail-title .who-badge','.node .who-badge svg,.detail-title .who-badge svg','[data-theme=dark] .node .who-badge,[data-theme=dark] .detail-title .who-badge']);
const [badge,svg]=badgeRules.map(r=>r.style);
assert.equal(badge.background,'var(--role-color)');
assert.equal(badge.color,'rgb(255, 255, 255)');
for(const key of ['width','height','min-width']) assert.equal(badge.getPropertyValue(key),'28px');
assert.equal(badge.getPropertyValue('border-radius'),'50%');
assert.equal(badge.border,'2px solid var(--role-color)');
assert.equal(svg.width,'16px');assert.equal(svg.height,'16px');
assert.equal(svg.color,'inherit');assert.equal(svg.getPropertyPriority('color'),'important');
assert.equal(svg.getPropertyValue('stroke-width'),'2');
assert.ok(css.includes('[data-theme=dark] .node .who-badge,[data-theme=dark] .detail-title .who-badge{border-color:color-mix(in srgb,var(--role-color) 50%,white)}')); // jsdom drops this unsupported color-mix value.
for(const rule of rules) if(rule.cssText.includes('--role-color')) assert.ok(rule.selectorText?.includes('.who-badge'),'Who color must stay inside badge rules');
assert.ok(!css.replace(/[^{}]*\.who-badge[^{}]*\{[^{}]*\}/g,'').includes('--role-color'),'No role-color outside badge declarations');
styleDom.window.close();

const compiled=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
const dom=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);
w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;
w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
w.eval(compiled.outputFiles[0].text);
for(let i=0;i<120&&$('open').disabled;i++)await new Promise(r=>setTimeout(r,25));
assert.equal($('open').disabled,false);
const markdown=readFileSync('web/authorities/business-design.md','utf8');
Object.defineProperty($('fallback'),'files',{configurable:true,value:[{name:'who-regression.md',text:async()=>markdown}]});await $('fallback').onchange();
let cases=0;
const verify=()=>{
 for(const node of d.querySelectorAll('.node')){
  if(node.classList.contains('object')){assert.equal(node.querySelectorAll('.who-badge').length,0);continue;}
  const badges=node.querySelectorAll('.who-badge');assert.equal(badges.length,1);const b=badges[0];
  assert.equal(node.firstElementChild,b);assert.equal(b.getAttribute('aria-hidden'),'true');
  const who=node.querySelector('small').textContent;
  assert.equal(b.style.getPropertyValue('--role-color'),roleColors(parseDesign(markdown).graph.nodes).get(who));
  const person=b.querySelector('svg');assert.equal(person.getAttribute('stroke'),'currentColor');assert.equal(person.getAttribute('fill'),'none');
  assert.equal(node.style.getPropertyValue('--role-color'),'');cases++;
 }
};
verify();const first=d.querySelector('.node.business');assert.ok(first);first.click();verify();$('theme').click();assert.equal(d.documentElement.dataset.theme,'dark');verify();first.click();verify();
// Real purchase design: former hash collision must differ in every view.
const purchase=readFileSync('../business-design/purchase-request/README.md','utf8');
const design=parseDesign(purchase),colors=roleColors(design.graph.nodes);
assert.equal(colors.get('申請者'),'#8b5cf6');assert.equal(colors.get('承認者'),'#c2410c');
assert.notEqual(colors.get('申請者'),colors.get('承認者'));
assert.equal(new Set(colors.values()).size,colors.size);
assert.deepEqual(roleColors([...design.graph.nodes].reverse()),colors,'source order must not affect role colors');
const many=Array.from({length:12},(_,i)=>({type:'business',who:'Role '+i}));
assert.equal(roleColors(many).size,12,'more than five roles remain supported');
assert.equal(new Set(roleColors(many.slice(0,5)).values()).size,5,'five roles never collide');
Object.defineProperty($('fallback'),'files',{configurable:true,value:[{name:'purchase.md',text:async()=>purchase}]});await $('fallback').onchange();
const verifyPurchase=()=>{assert.ok(d.querySelectorAll('.node.business').length>0);for(const n of d.querySelectorAll('.node.business'))assert.equal(n.querySelector('.who-badge').style.getPropertyValue('--role-color'),colors.get(n.querySelector('small').textContent));};
verifyPurchase();
for(const theme of ['light','dark']){
 if(d.documentElement.dataset.theme!==theme)$('theme').click();verifyPurchase();
 const opens=[...d.querySelectorAll('.activity-open')].map(n=>n.closest('.node').dataset.node);
 for(const id of opens){
  d.querySelector(`.node[data-node="${id}"] .activity-open`).click();verifyPurchase();
  $('tabs').querySelector('button').click();verifyPurchase();
 }
}
$('node-list-toggle').click();$('node-category-role').click();
for(const h of d.querySelectorAll('.role-heading'))assert.equal(h.querySelector('.who-badge').style.getPropertyValue('--role-color'),colors.get(h.dataset.role));
$('node-list-search').value='却下';$('node-list-search').dispatchEvent(new w.Event('input'));verifyPurchase();
assert.equal(d.querySelectorAll('.role-heading').length,1);
for(const h of d.querySelectorAll('.role-heading'))assert.equal(h.querySelector('.who-badge').style.getPropertyValue('--role-color'),colors.get(h.dataset.role),'search must not recolor roles');
console.log(JSON.stringify({purchaseRoleColors:Object.fromEntries(colors)}));
dom.window.close();
const luminance=hex=>hex.match(/[a-f0-9]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const contrast=palette.map(color=>({color,whiteContrast:Number((1.05/(luminance(color)+.05)).toFixed(4))}));
assert.ok(contrast.every(v=>v.whiteContrast>4));
console.log(JSON.stringify({model:'source + CSSOM + jsdom; no rendered geometry or pixels',badgeDomCases:cases,contrast,checks:['solid current role color and white inherited SVG lines','same interior/line rule for themes and Scope states','existing light/dark badge borders and 28px/16px sizing retained','Who variable confined to badge','full-document collision resolution; purchase overview/details/themes/list/search retain colors','one left person circle, Who text retained, Object without badge','selection/theme rerenders retain DOM contract']},null,2));
