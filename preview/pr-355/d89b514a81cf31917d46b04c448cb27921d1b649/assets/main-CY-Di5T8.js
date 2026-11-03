import{L as Rr,D as ic,G as oc,W as sc,P as rc,l as Kn,X as Lr,C as ac,n as cc,S as Nr,o as Pr,p as Tr,M as qr,q as $r,s as Wr,t as ls,g as us,r as To,d as zr,b as Ui,u as ps,U as Ur,v as dc,w as Vr,x as Fr,y as qo,z as lc,m as fs,A as uc,B as Br,E as pc,j as fc,F as Xs,H as mc,T as hc,I as bc,J as gc,R as yc,K as vc,N as wc,O as kc,Q as Ic,V as Sc,Y as xc,Z as Zs,k as Ac,i as Ec,h as Oc,f as jc,a as Cc,_ as Dc,$ as Mc,a0 as Gr,a1 as Rc,a2 as Lc,a3 as Nc,a4 as Pc,e as Tc}from"./canvas-toolbar-DsJvCS2d.js";const qc={subsystems:{full:"サブシステム",icon:rc},business:{full:"業務設計",icon:sc},states:{full:"状態遷移",icon:oc},concept:{full:"データ構造",icon:ic},tests:{full:"テスト仕様",icon:Rr}};function $o(e,t,n){const i=qc[t],o=document.createElement("span"),r=document.createElement("span"),s=document.createElement("span");o.className="view-tab-label",r.className="view-tab-kind",r.setAttribute("aria-hidden","true"),r.append(Kn(i.icon,{"aria-hidden":"true","stroke-width":1.8})),s.className="view-tab-name",s.textContent=n,o.append(r,s),e.replaceChildren(o),e.title=i.full+" / "+n,e.setAttribute("aria-label",i.full+"："+n)}function Wo(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Kn(Lr,{"aria-hidden":"true","stroke-width":1.8})),t}function $c(e){const t=Kn(e?ac:cc,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function Wc(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const i=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!i)return;const o=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,r=e.scrollLeft,s=Math.max(0,Math.min(n,r+i*o));s!==r&&(e.scrollLeft=s,t.preventDefault())},{passive:!1})}function zc(e,t){const n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),o=i.left<n.left?i.left-n.left:i.right>n.right?i.right-n.right:0;o&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+o)))}const Uc=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function Ys(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const i=e.createElement("link");i.rel="stylesheet",i.href=Uc,i.dataset.canvasToolbarStyle="",e.head.append(i)}const n=(i,o,r)=>{const s=Kn(o,{"stroke-width":1.8,"aria-hidden":"true"});r&&s.classList.add(r),t.querySelector(i)?.append(s)};for(const i of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(i)?.replaceChildren();n(".graph-settings-toggle",Nr),n(".layout-lock",Pr,"lock-closed"),n(".layout-lock",Tr,"lock-open"),n(".zoom-out",qr),n(".zoom-in",$r)}function Qs(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function Vc({model:e}){const t=Object.fromEntries(e.concepts.map(a=>[a.id,{name:a.name,note:a.description,fields:a.information.map(l=>["",l.name+(l.responsibleSubsystemId&&l.responsibleSubsystemId!==a.subsystemId?"（担当："+e.subsystems.find(u=>u.id===l.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(a=>[a.fromConceptId,a.toConceptId,a.fromLabel,a.toLabel,a.kind]),i=e.reviewGroups.map(a=>({id:a.id,name:a.title,purpose:a.description,activities:a.relatedActivityIds,concepts:Object.fromEntries(a.graph.nodes.map(l=>[l.conceptId,{name:l.name,note:l.description,fields:l.fields.map(u=>["",u]),sources:l.sources,sourceActivities:l.sourceActivityIds}])),relations:a.graph.edges.map(l=>[l.fromConceptId,l.toConceptId,l.fromLabel,l.toLabel,l.kind])})),o=a=>i.find(l=>l.id===a),r=(a,l)=>{const u=Object.fromEntries(a.nodes.map(c=>[c.id,{...l[c.conceptId],name:c.name,note:c.description,sources:c.sources,conceptId:c.conceptId,subsystemId:c.subsystemId,fields:c.fields.map(h=>["",h.name])}])),p=e.subsystems.filter(c=>a.nodes.some(h=>h.subsystemId===c.id)).map(c=>({id:c.id,name:c.name})),g=a.handoffIds.map(c=>e.handoffs.find(h=>h.id===c)).map(c=>({id:c.id,from:c.fromSubsystemId,to:c.toSubsystemId,label:c.information,returning:c.flowDirection==="return"}));return{ids:a.nodes.map(c=>c.id),tables:u,edges:a.edges.map(c=>[c.fromViewId,c.toViewId,c.fromLabel,c.toLabel,c.kind]),regions:p,handoffs:g}};return{tables:t,edges:n,groups:i,findGroup:o,graph:a=>{const l=o(a);if(!l)throw Error("Unknown review group: "+a);const u=e.reviewGroups.find(c=>c.id===a),p=u.graph.subsystemViews;if(p)return r(p,l.concepts);const g=Object.keys(t).filter(c=>Object.hasOwn(l.concepts,c));return{ids:g,tables:l.concepts,edges:l.relations.filter(([c,h])=>g.includes(c)&&g.includes(h)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?r(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function dt(e,t,n){const i=document.createElement(t);return i.textContent=n,e.append(i),i}function Fc(e,t,n){const i=document.createElement("button");return i.type="button",i.className="review-open",dt(i,"span",t),i.onclick=n,e.append(i),i}function Bc(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const i=document.createElement("div");i.className="landscape-overview",i.append(t),e.append(i)}}function Gc(e,t,n,i=()=>{},o=()=>{},r=[]){const s=n.contentFor(t.id);if(e.replaceChildren(),!s)return;dt(e,"p",s.description).className="review-description",dt(e,"h3","Activity");const d=document.createElement("ul");d.className="review-related-activities";for(const a of s.relatedActivities){const l=document.createElement("li"),u=r.find(g=>g.id===a.id&&g.name===a.name),p=Fc(l,a.name,()=>{u&&o(u.id)});p.disabled=!u,p.setAttribute("aria-label",a.name+"を業務タブで開く"),d.append(l)}e.append(d),dt(e,"h3","情報の構造");for(const a of s.structureStatements){const l=document.createElement("section");l.className="review-structure",l.dataset.structure=a.id,dt(l,"h4",a.title),dt(l,"p",a.description),e.append(l)}dt(e,"h3","できること");for(const a of s.capabilities){const l=document.createElement("section");l.className="review-capability",l.dataset.capability=a.id,dt(l,"h4",a.title),dt(l,"p",a.description);for(const u of a.samples){const p=i(a.id,u.id),g=document.createElement("button");g.className="review-sample-link",g.type="button",g.dataset.sample=u.id,g.textContent=(p?.kind==="decision"?"可否判定：":"サンプル：")+u.name,p?g.onclick=p.open:(g.disabled=!0,g.title="対応するテスト仕様へのリンクがありません"),l.append(g)}e.append(l)}dt(e,"h3","できないこと（業務上のルール）");for(const a of s.limitations){const l=document.createElement("section");l.className="review-limitation",dt(l,"h4",a.title),dt(l,"p",a.description),dt(l,"h5","理由"),dt(l,"p",a.reason),e.append(l)}}function un(e,t,n){const i=e.ownerDocument.createElement(t);return i.textContent=n,e.append(i),i}function Hc({model:e,business:t}){const n=s=>s.kind==="group"?e.subsystems.find(d=>d.id===s.id):e.handoffs.find(d=>d.id===s.id),i=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function o(s){const d=n(s);return d?d.activityIds.map(a=>t.activities.find(l=>l.id===a)).filter(Boolean):[]}function r(s,d){if(s.replaceChildren(),d.kind==="group"){const p=e.subsystems.find(c=>c.id===d.id);if(!p)return"";un(s,"p",p.purpose),un(s,"h3","扱う情報");const g=s.ownerDocument.createElement("ul");for(const c of p.information)un(g,"li",c);return s.append(g),un(s,"h3","まとまりの理由"),un(s,"p",p.reason),p.name}const a=e.handoffs.find(p=>p.id===d.id);if(!a)return"";un(s,"p",a.description),un(s,"h3","出元と受取先");const l=e.subsystems.find(p=>p.id===a.fromSubsystemId),u=e.subsystems.find(p=>p.id===a.toSubsystemId);return un(s,"p",`${l.name} → ${u.name}`),a.information}return{sections:i,activities:o,describe:r}}function er(e,t,n){const i=document.createElement("div");i.className="concept-drawer-resize",i.tabIndex=0,i.setAttribute("role","separator"),i.setAttribute("aria-orientation","vertical"),i.setAttribute("aria-label","補足情報の幅"),e.prepend(i);let o=440;try{const d=Number(sessionStorage.getItem(n));Number.isFinite(d)&&d>=280&&(o=d)}catch{}const r=()=>{let d=t.clientWidth||innerWidth;const a=t.querySelector("#design-explorer");return innerWidth>800&&a&&!a.hidden&&(d-=a.offsetWidth),Math.max(280,Math.min(1e3,d-(innerWidth>800?240:16)))},s=(d,a=!1)=>{if(o=Math.max(280,Math.min(r(),d)),e.style.setProperty("--concept-drawer-width",o+"px"),i.setAttribute("aria-valuemin","280"),i.setAttribute("aria-valuemax",String(r())),i.setAttribute("aria-valuenow",String(Math.round(o))),a)try{sessionStorage.setItem(n,String(o))}catch{}};if(i.onkeydown=d=>{["ArrowLeft","ArrowRight","Home","End"].includes(d.key)&&(d.preventDefault(),s(d.key==="Home"?280:d.key==="End"?r():o+(d.key==="ArrowLeft"?40:-40),!0))},i.onpointerdown=d=>{if(d.button!==0)return;d.preventDefault();const a=d.clientX,l=o;i.setPointerCapture(d.pointerId),i.classList.add("resizing"),i.onpointermove=u=>s(l+a-u.clientX),i.onpointerup=()=>{i.onpointermove=null,i.onpointerup=null,i.onpointercancel=null,i.classList.remove("resizing"),s(o,!0)},i.onpointercancel=i.onpointerup},typeof ResizeObserver<"u"){const d=new ResizeObserver(()=>s(o));d.observe(t);const a=t.querySelector("#design-explorer");a&&d.observe(a)}window.addEventListener("resize",()=>s(o)),s(o)}const Jc=260,_c=68,Kc="http://www.w3.org/2000/svg",zt=(e,t,n={})=>{const i=e.createElementNS(Kc,t);for(const[o,r]of Object.entries(n))i.setAttribute(o,String(r));return i};function Xc(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Kn(Ur,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function Zc(e,{model:t,business:n},i,o,r){const s=t.reviewGroups,d=t.subsystems,a=t.presentation.landscapeRelationships.map(S=>{const x=s.find(L=>L.id===S.from),A=s.find(L=>L.id===S.to);if(!x||!A||x.subsystemId!==A.subsystemId||!t.presentation.reviewBoundaries.some(L=>L.from===S.from&&L.to===S.to))throw Error("Unknown overview relationship: "+S.from+" -> "+S.to);return S}),l=t.handoffs.map(S=>{if(!["forward","return"].includes(S.flowDirection))throw Error("Unknown overview handoff direction: "+S.id);return{id:S.id,from:S.fromSubsystemId,to:S.toSubsystemId,label:S.information,returning:S.flowDirection==="return"}});if(new Set(l.map(S=>S.id)).size!==l.length)throw Error("Duplicate overview handoff");for(const S of l)if(!d.some(x=>x.id===S.from)||!d.some(x=>x.id===S.to)||S.from===S.to||!S.label.trim())throw Error("Unknown overview handoff: "+S.id);for(const S of s){if(!d.some(x=>x.id===S.subsystemId))throw Error("Unknown overview subsystem: "+S.id);if(!n.roles?.some(x=>x.id===S.reviewer.roleId))throw Error("Unknown overview reviewer: "+S.id)}const u=d.flatMap(S=>s.filter(x=>x.subsystemId===S.id)),p=new Map;let g=0;for(const[S,x]of d.entries())for(const A of u.filter(L=>L.subsystemId===x.id))p.set(A.id,[80+g*170,100+g*120+S*64]),g++;const c=ls(),h="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(i);let m,f;try{const S=JSON.parse(localStorage.getItem(h)||"null"),x=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),A=!S&&x?.documentKey===i?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,L=S??A;if(L){typeof L.zoom=="number"&&Number.isFinite(L.zoom)&&(c.zoom=Math.max(.25,Math.min(2.5,L.zoom))),Array.isArray(L.scroll)&&L.scroll.length===2&&L.scroll.every(C=>typeof C=="number"&&Number.isFinite(C))&&(c.scroll=L.scroll),typeof L.locked=="boolean"&&(c.locked=L.locked);for(const[C,J]of Object.entries(L.positions??{}))s.some(U=>U.id===C)&&Array.isArray(J)&&J.length===2&&J.every(U=>typeof U=="number"&&Number.isFinite(U))&&c.positions.set(C,[J[0],J[1]])}const $=L?.selection,N=$?.kind==="node"?t.concepts.find(C=>C.id===$.id)?.subsystemId:$?.id,D=$?.kind==="node"?"group":$?.kind;typeof N=="string"&&(D==="model"&&s.some(C=>C.id===N)||D==="group"&&d.some(C=>C.id===N)||D==="connection"&&l.some(C=>C.id===N))&&(f={kind:D,id:N}),f?.kind==="model"&&(c.selected=f.id)}catch{}const b=()=>{try{localStorage.setItem(h,JSON.stringify({zoom:c.zoom,scroll:c.scroll,locked:c.locked,positions:Object.fromEntries(c.positions),selection:f}))}catch{}},w=S=>{if(!S&&!f)return;f=S,c.selected=S?.kind==="model"?S.id:void 0;const x=m?.querySelector(".diagram-world>svg");x&&y(x),b()},y=S=>{const x=Ui(a,c.selected),A=Ui(l,f?.kind==="group"?f.id:void 0);for(const L of s){const $=S.querySelector(`[data-node="${L.id}"]`);$?.setAttribute("class","node graph-shape state-shape"+x.nodeClasses(L.id)),$?.setAttribute("aria-pressed",String(c.selected===L.id))}for(const L of d){const $=S.querySelector(`[data-subsystem="${L.id}"]`);$?.setAttribute("class","subsystem-overview-group"+A.nodeClasses(L.id)),$?.querySelector("button")?.setAttribute("aria-pressed",String(f?.kind==="group"&&f.id===L.id))}for(const L of a){const $=S.querySelector(`[data-overview-from="${L.from}"][data-overview-to="${L.to}"]`);$?.setAttribute("class","edge"+(x.related(L)?" review-related":"")),$?.setAttribute("marker-end",`url(#overview-${x.related(L)?"related-arrow":"arrow"})`)}for(const L of l){const $=A.related(L)||f?.kind==="connection"&&f.id===L.id,N=S.querySelector(`[data-handoff-id="${L.id}"]`);N?.setAttribute("class","edge"+(L.returning?" exception":"")+($?" review-related":"")),N?.setAttribute("marker-end",`url(#overview-${$?"related-arrow":"arrow"})`),S.querySelector(`[data-handoff-label="${L.id}"]`)?.classList.toggle("review-related",!!$)}S.querySelectorAll("[data-exception-paint]").forEach(L=>L.remove());for(const L of Array.from(S.querySelectorAll("[data-handoff-id].exception")))ps(S,L,{path:L.getAttribute("d")},{"data-overview-return-paint":L.getAttribute("data-handoff-id")})};return m=Wr(e,S=>{const x=u.map(D=>{const C=S.positions.get(D.id)??p.get(D.id);return{id:D.id,x:C[0],y:C[1],width:Jc,height:_c}}),A=zt(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});A.append(us("overview-"));let L=0,$=0;const N=[];for(const D of d){const C=x.filter(ye=>s.find(Ie=>Ie.id===ye.id)?.subsystemId===D.id);if(!C.length)continue;const J=Math.min(...C.map(ye=>ye.x))-30,U=Math.min(...C.map(ye=>ye.y))-48,Z=Math.max(...C.map(ye=>ye.x+ye.width))-J+30,te=Math.max(...C.map(ye=>ye.y+ye.height))-U+30;N.push({id:D.id,x:J,y:U,width:Z,height:te});const Y=zt(e,"g",{"data-subsystem":D.id,"aria-label":D.name}),ae=zt(e,"rect",{x:J,y:U,width:Z,height:te,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});ae.addEventListener("click",()=>w({kind:"group",id:D.id})),Y.append(ae);const me=zt(e,"foreignObject",{class:"subsystem-overview-region-heading",x:J+8,y:U+3,width:Z-16,height:36}),he=e.createElement("button");he.type="button",he.className="subsystem-overview-region-title",he.setAttribute("aria-label",D.name+"を選択"),he.textContent=D.name,he.onclick=()=>w({kind:"group",id:D.id}),me.append(he),Y.append(me),A.append(Y),L=Math.max(L,J+Z+40),$=Math.max($,U+te+40)}for(const[D,C]of l.entries()){if(!N.some(Y=>Y.id===C.from)||!N.some(Y=>Y.id===C.to))throw Error("Missing overview handoff region: "+C.id);const J=Math.max(30,C.label.length*12),U=To({from:C.from,to:C.to,nodes:N,index:D,kind:"input",matrix:{returning:C.returning,captionLane:0},labelWidth:J,labelHeight:18}),Z=zt(e,"path",{d:U.path,class:"edge"+(C.returning?" exception":""),"data-handoff-id":C.id,"data-from-subsystem":C.from,"data-to-subsystem":C.to,"data-flow-direction":C.returning?"return":"forward","marker-end":"url(#overview-arrow)"});A.append(Z);const te=zt(e,"text",{x:U.label[0]-J/2,y:U.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":C.id});te.textContent=C.label,te.addEventListener("pointerdown",Y=>Y.stopPropagation()),te.addEventListener("pointerup",Y=>Y.stopPropagation()),te.addEventListener("click",()=>w({kind:"connection",id:C.id})),te.addEventListener("keydown",Y=>{(Y.key==="Enter"||Y.key===" ")&&(Y.preventDefault(),w({kind:"connection",id:C.id}))}),A.append(te),L=Math.max(L,U.bounds.right+40,U.label[0]+J/2+30),$=Math.max($,U.bounds.bottom+40,U.label[1]+30)}for(const[D,C]of a.entries()){const J=To({from:C.from,to:C.to,nodes:x,index:D,kind:"input",labelWidth:0,labelHeight:0}),U=zt(e,"path",{d:J.path,class:"edge","data-overview-from":C.from,"data-overview-to":C.to,"marker-end":"url(#overview-arrow)"});A.append(U),L=Math.max(L,J.bounds.right+40),$=Math.max($,J.bounds.bottom+40)}for(const D of x){const C=s.find(Ie=>Ie.id===D.id),J=n.roles.find(Ie=>Ie.id===C.reviewer.roleId),U=zt(e,"g",{role:"button",tabindex:0,"aria-label":C.title+"を選択","aria-pressed":"false","data-node":D.id,"data-review-group":D.id,"data-subsystem-id":C.subsystemId,class:"node graph-shape state-shape"}),Z=zr(e,D);Z.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),U.append(Z,zt(e,"rect",{x:D.x,y:D.y,width:D.width,height:D.height,rx:8,class:"state-diagram-node"}));const Y=zt(e,"foreignObject",{x:D.x,y:D.y,width:D.width,height:D.height}),ae=e.createElement("div");ae.className="subsystem-overview-card";const me=Xc(e,J.color),he=e.createElement("span");he.className="subsystem-overview-labels",he.title=C.title+" — "+J.name;for(const[Ie,q,B]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",C.title],["small","subsystem-overview-role",J.name]]){const _=e.createElement(Ie);_.className=q,_.textContent=B,he.append(_)}const ye=e.createElement("button");ye.type="button",ye.className="subsystem-overview-open",ye.setAttribute("aria-label",C.title+"の詳細タブを開く"),ye.title="詳細タブを開く",ye.textContent="開く",ye.onpointerdown=Ie=>Ie.stopPropagation(),ye.onpointerup=Ie=>Ie.stopPropagation(),ye.onclick=Ie=>{Ie.stopPropagation(),o(C.id)},ae.append(me,he,ye),Y.append(ae),U.append(Y),U.addEventListener("click",()=>w({kind:"model",id:D.id})),U.addEventListener("keydown",Ie=>{(Ie.key==="Enter"||Ie.key===" ")&&(Ie.preventDefault(),w({kind:"model",id:D.id}))}),A.append(U)}return A.setAttribute("viewBox",`0 0 ${L} ${$}`),y(A),A},c,b,()=>w(void 0)),m.classList.add("subsystem-overview-canvas"),m.addEventListener("click",b),m.addEventListener("pointerup",()=>queueMicrotask(b)),m.querySelector(".diagram-viewport")?.addEventListener("scroll",b),{root:m,selected:()=>c.selected,selection:()=>f,restore:()=>{const S=()=>{const x=m.querySelector(".diagram-viewport");x.scrollLeft=c.scroll[0],x.scrollTop=c.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(S):S()}}}function Yc(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(i=>t.columns.map(o=>{const r=i.cells.find(s=>s.columnId===o.id);if(!r)throw Error("Missing sample cell: "+o.id);return r}));return{card:t.card,columns:t.columns.map(i=>i.name),rows:n.map(i=>i.map(o=>o.value)),keyIds:n.map(i=>i.map(o=>o.linkId)),empty:t.empty}})}}function Qc({model:e,business:t}){const n=h=>{const m=t.activities.find(f=>f.id===h);if(!m)throw Error("Unknown activity: "+h);return m},i=h=>{const m=t.roles?.find(f=>f.id===h);if(!m)throw Error("Unknown role: "+h);return m.name},o=e.reviewGroups.map(h=>({id:h.id,title:h.title,description:h.description,reviewer:{role:i(h.reviewer.roleId)},relatedActivities:h.relatedActivityIds.map(m=>{const f=n(m);return{id:f.id,name:f.name}}),structureStatements:h.structureStatements,capabilities:h.capabilities.map(m=>({...m,samples:m.samples.map(Yc)})),limitations:h.limitations,meta:{questions:h.meta.questions}})),r=h=>o.find(m=>m.id===h),s=(h,m)=>r(h)?.capabilities.find(f=>f.samples.some(b=>b.id===m)),d=o.flatMap(h=>h.capabilities.flatMap(m=>m.samples.map(f=>({...f,group:h.id})))),a=["yellow","cyan","green","blue","purple","orange"];function l(h,m,f){let b=f.get(m);if(b||(b=a[f.size]??`extra-${f.size}`,f.set(m,b)),h.dataset.sampleKey=m,h.dataset.keyTone=b,h.className="data-example-key",b.startsWith("extra-")){const w=(Number(b.slice(6))*137.508%360).toFixed(2);h.style.setProperty("--sample-key-extra-light",`hsl(${w} 26% 78%)`),h.style.setProperty("--sample-key-extra-dark",`hsl(${w} 24% 25%)`)}}const u=h=>d.filter(m=>m.group===h),p=(h,m)=>u(h).find(f=>f.id===m);function g(h,m,f){const b=h.ownerDocument.createElement(m);return b.textContent=f,h.append(b),b}function c(h,m,f,b,w){const y=h.ownerDocument,E=p(m.id,f);if(!E)throw Error("Unknown data example: "+f);h.replaceChildren(),h.dataset.dataExample=f;const S=new Map;e.presentation.sampleCaption&&(g(h,"p",e.presentation.sampleCaption).className="data-example-caption");const x=r(m.id)?.capabilities??[],A=w?.capabilityId?x.filter(C=>C.id===w.capabilityId):x;if(w?.capabilityId&&!A.some(C=>C.samples.some(J=>J.id===f)))throw Error("Sample does not belong to capability: "+f);const L=s(m.id,f);h.dataset.capability=L.id;const $=()=>{g(h,"h2",w?.heading?.trim()||L.title),w?.renderSpecification?w.renderSpecification(h):g(h,"p",L.description).className="data-example-capability"};w?.capabilityId&&!w.hideCapability&&$();const N=y.createElement("label");N.className="data-example-picker",g(N,"span","場面");const D=y.createElement("select");D.setAttribute("aria-label","データ例の場面");for(const C of A){let J=D;if(!w?.capabilityId){const U=y.createElement("optgroup");U.label=C.title,D.append(U),J=U}for(const U of C.samples){if(w?.sampleIds&&!w.sampleIds.includes(U.id))continue;const Z=y.createElement("option");Z.value=U.id,Z.textContent=U.name,J.append(Z)}}if(D.value=f,D.onchange=()=>b(D.value),N.append(D),(!w?.hideSinglePicker||D.options.length>1)&&h.append(N),!w?.capabilityId&&!w?.hideCapability&&$(),g(h,"h3",E.name).className="data-example-scene",w?.collapseScenario&&E.when){const C=y.createElement("details");C.className="data-example-context",g(C,"summary","場面の背景"),g(C,"p",E.when).className="data-example-when",h.append(C)}else g(h,"p",E.when).className="data-example-when";g(h,"p",E.meaning).className="data-example-meaning";for(const C of E.blocks){const J=y.createElement("section");J.className="data-example-block",J.dataset.exampleCard=C.card,g(J,"h3",m.concepts[C.card].name);const U=y.createElement("div");U.className="data-example-table",U.tabIndex=0,U.setAttribute("role","region"),U.setAttribute("aria-label",m.concepts[C.card].name+"のデータ表");const Z=y.createElement("table");Z.setAttribute("aria-label",m.concepts[C.card].name+"のデータ例");const te=y.createElement("caption");te.textContent=m.concepts[C.card].name+"に入る情報",Z.append(te);const Y=y.createElement("thead"),ae=y.createElement("tr");for(const he of C.columns)g(ae,"th",he).setAttribute("scope","col");Y.append(ae),Z.append(Y);const me=y.createElement("tbody");for(const[he,ye]of C.rows.entries()){const Ie=y.createElement("tr");for(const[q,B]of ye.entries()){const _=g(Ie,"td",String(B)),be=C.keyIds[he][q];be&&(l(_,be,S),_.title=C.columns[q]+"："+B)}me.append(Ie)}Z.append(me),U.append(Z),J.append(U),C.rows.length||g(J,"p",C.empty??"データはありません。"),h.append(J)}E.note&&(g(h,"p",E.note).className="data-example-note")}return{reviewContents:o,dataExamples:d,contentFor:r,capabilityFor:s,examplesFor:u,findDataExample:p,renderDataExample:c}}function ms(e,t){const n=e.model?.business,i=n?.activities.find(r=>r.id===t);if(!i||"performers"in i)return;const o=typeof i.who=="object"&&i.who?.kind==="role"?i.who.roleId:"roleId"in i?i.roleId:void 0;return o?n?.roles?.find(r=>r.id===o):void 0}function ed(e,t,n){const i=e.model?.business.activities.find(o=>o.id===t);return i&&"who"in i&&typeof i.who=="object"&&i.who&&(i.who.kind==="system"||i.who.kind==="scheduler")?i.who.kind+":"+i.who.name:ms(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function td(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function et(e,t=!1){const n=document.createElement("article");n.className="markdown";let i="",o,r;const s=(d,a)=>{for(const l of a.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(l.startsWith("**")&&l.endsWith("**")){const u=document.createElement("strong");u.textContent=l.slice(2,-2),d.append(u)}else if(l.startsWith("`")&&l.endsWith("`")){const u=document.createElement("code");u.textContent=l.slice(1,-1),d.append(u)}else d.append(document.createTextNode(l))};for(const d of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const a=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(d);if(a&&!i){i=a[1],r=void 0;const g=document.createElement("pre");o=document.createElement("code"),g.append(o),n.append(g);continue}if(a&&a[1][0]===i[0]&&a[1].length>=i.length&&!a[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){i="",r=void 0;continue}if(i){o.append(document.createTextNode(d+`
`));continue}if(!d.trim()){r=void 0;continue}const l=/^(#{1,6}) (.*)$/.exec(d),u=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(d);if(u){r||(r=document.createElement(/^\s*\d/.test(d)?"ol":"ul"),n.append(r));const g=document.createElement("li");s(g,u[1]),r.append(g);continue}r=void 0;const p=document.createElement(l?"h"+l[1].length:"p");s(p,l?l[2]:d),n.append(p)}return t&&n.querySelector("h1")?.remove(),n}function zo(e,t,n){if(t.performers===null)return"未決";const i=n===void 0?t.performers:n===null?t.performers.length===1?t.performers:[]:t.performers.filter(o=>n.includes(o.objectId));return i.length?i.map(o=>{const r=e.objects.find(d=>d.id===o.objectId).name,s=o.roleIds.map(d=>e.roles.find(a=>a.id===d).name);return s.length?`${r}（旧Role：${s.join("・")}）`:r}).join("、"):"未決"}function En(e,t){if("performers"in t)return"未決";if(typeof t.who=="string")return e.roles?.find(i=>"roleId"in t&&i.id===t.roleId)?.name??t.who;const n=t.who;return n?n.kind==="role"?e.roles?.find(i=>i.id===n.roleId)?.name??"未決":n.name:"未決"}function Hr(e,t){return t.dataId!==void 0?e.data?.find(n=>n.id===t.dataId)?.name??"未決":t.label??""}function nd(e){const t=[];for(const n of e.activities){if(!("performers"in n))continue;const i=(l,u,p,g)=>t.push({id:`viewer:${l}:${n.id}`,displayId:"構造の要確認（表示のみ）",kind:u,status:"open",scope:"items",targets:[n.id],targetNames:[n.name],summary:p,content:g,unresolvedTargets:[]}),o=n.performers??[],r=new Set(o.flatMap(l=>l.roleIds)),s=[...o.length>1?["複数の担当Object"]:[],...r.size>1?["複数Role"]:[]];i("who",s.length?"correction":"question",s.length?`旧形式に${s.join("と")}があります。`:"Whoは未決です。",`旧形式の担当情報：${zo(e,n)}。旧0.5にはActivityからWhoへの直接参照がありません。このActivityの単一のWhoを、Role・システム・スケジューラーを含めて確認してください。入力や出力の相手からは決められません。`);const d=n.procedure.steps.filter(l=>l.performerObjectIds===null&&n.performers?.length!==1),a=n.procedure.steps.filter(l=>l.performerObjectIds!==null&&(l.performerObjectIds.length!==o.length||l.performerObjectIds.some(u=>!o.some(p=>p.objectId===u))));(d.length||a.length)&&i("steps",a.length?"correction":"question",a.length?"旧形式の手順の担当情報が異なります。":"旧形式の担当情報が未決の手順があります。",[d.length?`旧形式の担当情報が未決：${d.map(l=>l.text).join("、")}。`:"",a.length?`Activityと異なる旧形式の担当情報：${a.map(l=>l.text).join("、")}。責任境界が変わる場合はActivityの分割を検討してください。`:""].join(""))}return t}const it=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n},tr=e=>JSON.stringify(e.kind==="value"?[e.axisId,e.kind,e.operator,e.value]:[e.axisId,e.kind]),nr=(e,t,n)=>e.slice(0,n+1).every((i,o)=>tr(i)===tr(t[o]));function id(e,t){return e.kind!=="value"?e.kind==="else"?"それ以外":e.kind==="any"?"不問":"未決":typeof e.value=="boolean"?e.value?t.trueLabel??"true":t.falseLabel??"false":String(e.value)+(typeof e.value=="number"?t.unit??"":"")+{is:"",eq:"",gte:"以上",lte:"以下",gt:"超",lt:"未満"}[e.operator]}function od(e){return e.rows.map((t,n)=>e.axes.map((i,o)=>{if(n>0&&nr(e.rows[n-1].conditions,t.conditions,o))return 0;let r=1;for(;n+r<e.rows.length&&nr(t.conditions,e.rows[n+r].conditions,o);)r++;return r}))}function hs(e,t){const n=it("div");n.dataset.businessDecisionScroll="",n.tabIndex=0,n.setAttribute("role","region"),n.setAttribute("aria-label",e.title);const i=it("table");i.dataset.businessDecisionTable="";const o=it("thead"),r=it("tr"),s=it("th","条件");s.colSpan=e.axes.length,s.scope="colgroup",r.append(s);for(const p of["結果","Check"]){const g=it("th",p);g.rowSpan=2,g.scope="col",p==="結果"&&(g.dataset.decisionResult=""),r.append(g)}o.append(r);const d=it("tr");for(const p of e.axes){const g=it("th",p.name);g.scope="col",d.append(g)}o.append(d),i.append(o);const a=it("tbody"),l=od(e);let u=!1;for(const[p,g]of e.rows.entries()){const c=it("tr");c.dataset.decisionRow=g.id,g.conditions.forEach((f,b)=>{const w=l[p][b];if(!w)return;const y=it("td",id(f,e.axes[b]));w>1&&(y.rowSpan=w),c.append(y)});const h=it("td",g.result.text??"未決");h.dataset.decisionResult="",h.dataset.resultKind=g.result.kind,c.append(h);const m=g.checkRefs.map(f=>{const b=t.flatMap(w=>w.items).find(w=>w.id===f.checkId);return f.coverage==="partial"&&(u=!0),(b?.checkId??f.checkId)+(f.coverage==="partial"?"*":"")});c.append(it("td",m.join("、")||"—")),a.append(c)}if(i.append(a),n.append(i),u){const p=it("p","*：この業務で扱う範囲のみ");p.className="decision-footnote",n.append(p)}return n}function bs(e,t,n){return[...new Set(e.rows.flatMap(o=>o.result.exceptionIds))].flatMap(o=>{const r=t.exceptions?.find(a=>a.id===o);if(!r)return[];const s=n.flatMap(a=>a.items).filter(a=>Object.values(a.fields).some(l=>l.some(u=>u.kind==="reference"&&u.targetId===o))).map(a=>a.checkId),d=it("p",r.description+(s.length?" （"+[...new Set(s)].join("、")+"）":""));return d.className="decision-exception",[d]})}const xe={type:"string"},W={type:"string",minLength:1,pattern:"\\S"},T={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Se=e=>({anyOf:[e,{type:"null"}]}),F=e=>({type:"array",items:e}),z=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),sd=e=>({$ref:"#/$defs/"+e}),Wn=F({anyOf:[z({kind:{enum:["text"]},value:xe}),z({kind:{enum:["reference"]},targetId:T,label:xe}),z({kind:{enum:["link"]},uri:W,label:xe})]}),Vi=z({id:T,name:W,scope:{type:"boolean"}}).properties,gs=z({id:T,kind:{enum:["input","output","business-exception","object-exception"]},fromId:T,toId:T,label:W}),rd=z({id:T,sourceId:T,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:F(T),unresolvedTargets:F(W),summary:W,content:W}),Uo=z({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:W,title:W,preface:xe,scope:xe,objects:F(z({...Vi,icon:W,information:F(W)})),activities:F(z({...Vi,why:W,when:W,who:W,where:W,procedure:W,exception:Se(W),result:W,problem:Se(W),painLevel:Se({enum:["Low","Medium","High"]})})),relations:F(gs),findings:F(rd)}),ad=z({id:T,name:W,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Jr=z({...Uo.properties,schemaVersion:{enum:["0.2"]},roles:F(ad),activities:F(z({...Uo.properties.activities.items.properties,roleId:Se(T)}))}),eo=z({...Jr.properties,schemaVersion:{enum:["0.3"]},exceptions:F(z({id:T,activityId:T,name:W,description:xe}))}),lt=e=>({...F(e),minItems:1}),_r=z({id:T,name:W,description:xe}),ys={anyOf:[z({kind:{enum:["before"]},beforeId:T,afterId:T}),z({kind:{enum:["interchangeable"]},stepIds:{...F(T),minItems:2}})]},Kr=Object.fromEntries(Object.entries(eo.properties.activities.items.properties).filter(([e])=>!["who","roleId","procedure","result","exception"].includes(e))),cd=z({objectId:T,roleIds:F(T)}),dd=z({id:T,text:W,obligation:{enum:["required","optional"]},appliesWhen:Se(W),performerObjectIds:Se(lt(T))}),Xr=z({id:T,name:W,items:lt(z({informationId:T,condition:Se(W)}))}),ld=z({...eo.properties,schemaVersion:{enum:["0.4"]},objects:F(z({...Vi,icon:W,information:F(_r)})),activities:lt(z({...Kr,performers:Se(lt(cd)),procedure:z({steps:lt(dd),orderRules:F(ys)}),results:lt(z({id:T,text:W}))})),data:F(Xr),relations:F({anyOf:[z({id:T,kind:{enum:["input","output"]},fromId:T,toId:T,dataId:T}),z({...gs.properties,kind:{enum:["business-exception","object-exception"]}})]})}),ud={anyOf:[z({kind:{enum:["role"]},roleId:T}),z({kind:{enum:["system","scheduler"]},name:W}),{type:"null"}]},pd={anyOf:[z({kind:{enum:["interaction"]},phase:Se({enum:["request","response","not-applicable"]}),direction:{enum:["input","output"]},objectId:T,dataIds:Se(F(T)),relationId:Se(T),pairedStepId:Se(T)}),z({kind:{enum:["internal"]}}),z({kind:{enum:["unresolved"]}})]},ir={anyOf:[z({kind:{enum:["who"]}}),z({kind:{enum:["object"]},objectId:T})]},fd=z({from:Se(ir),to:Se(ir)}),Vo=z({id:T,action:W,method:Se(W),whatDataIds:Se(F(T)),legacyText:W,obligation:{enum:["required","optional"]},appliesWhen:Se(W),effect:Se({enum:["create","read","update","delete","not-applicable","undecided"]}),exchange:pd,parties:fd},["id","action","method","whatDataIds","obligation","appliesWhen","effect","exchange"]),md=z({trigger:Se(W),onInterrupt:Se(W),outcome:Se({enum:["resume","continue","end"]}),resumeCondition:Se(W),resumeAction:Se(W),interruptedAtStepId:Se(T),resumeAtStepId:Se(T),retainedDataIds:Se(F(T))}),hd=z({id:T,activityId:T,name:W,description:xe,continuity:md},["id","activityId","name","description"]),or={...Vi,scope:Se({type:"boolean"})},Fo=z({...eo.properties,schemaVersion:{enum:["0.5"]},objects:F(z({...or,icon:W,information:F(_r)})),activities:lt(z({...Kr,...or,who:ud,procedure:z({steps:lt(Vo),orderRules:F(ys)}),results:lt(z({id:T,text:W}))})),exceptions:F(hd),data:F(Xr),relations:F({anyOf:[z({id:T,kind:{enum:["input","output"]},fromId:T,toId:T}),z({...gs.properties,kind:{enum:["business-exception","object-exception"]}})]})}),bd={anyOf:[W,{type:"number"},{type:"boolean"}]},gd={anyOf:[z({axisId:T,kind:{enum:["value"]},operator:{enum:["is","eq","gte","lte","gt","lt"]},value:bd}),...["else","any","undecided"].map(e=>z({axisId:T,kind:{enum:[e]}}))]},yd=z({id:T,name:W,dataIds:F(T),unit:xe,trueLabel:W,falseLabel:W},["id","name","dataIds"]),vd=z({kind:{enum:["accepted","error","value","undecided"]},text:Se(W),dataIds:F(T),exceptionIds:F(T)}),wd=z({id:T,conditions:lt(gd),result:vd,checkRefs:F(z({checkId:T,coverage:{enum:["full","partial"]}}))}),Zr=z({decisionId:T,rowId:T}),kd=z({id:T,title:W,kind:{enum:["authorization","validation","algorithm"]},note:Se(W),appliesWhen:Se(Zr),axes:lt(yd),rows:lt(wd)}),Id=z({...Vo.properties,decisionIds:F(T),whenDecision:Se(Zr)},[...Vo.required,"decisionIds","whenDecision"]),Sd=z({...Fo.properties,schemaVersion:{enum:["0.6"]},activities:lt(z({...Fo.properties.activities.items.properties,procedure:z({steps:lt(Id),orderRules:F(ys)}),decisions:F(kd)}))}),xd=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,Wn])),Ad=z({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:W,title:W,basedOn:z({documentId:T,revision:W,verification:{enum:["unverified"]}}),intro:Wn,index:F(z({activityId:T,purpose:xe,connections:xe,checkIds:F(T)})),sections:F(z({id:T,activityId:Se(T),title:W,preamble:Wn})),guarantees:F(z({id:T,sectionId:T,title:W,blocks:F({anyOf:[z({kind:{enum:["prose"]},content:Wn}),z({kind:{enum:["example"]},exampleId:T})]})})),examples:F(z({id:T,guaranteeId:T,columns:F(W),rows:F(F(Wn))})),items:F(z({id:T,checkId:T,title:W,detailSummary:xe,sectionId:T,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:z(xd,[])})),notes:F(z({id:T,title:W,content:Wn}))}),vs=z({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:W,title:W,basedOn:z({documentId:T,revision:W,verification:{enum:["unverified"]}}),objectId:T,states:F(z({id:T,name:W})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:W,transitions:F(z({id:T,sourceId:W,fromId:W,activityId:T,event:Se(W),exception:Se(W),condition:W,toId:W,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:W,note:W}))}),sr=Object.fromEntries(Object.entries({...vs.properties.transitions.items.properties,exceptionId:Se(T)}).filter(([e])=>e!=="exception")),Ed=z({...vs.properties,schemaVersion:{enum:["0.2"]},transitions:F(z({...sr,conditionLabel:W},Object.keys(sr)))}),ws=z({documentId:T,revision:W,targetType:W,targetId:T,section:W}),Od=z({id:T,name:W,responsibilityStatus:W,responsibleSubsystemId:T},["id","name"]),jd=z({id:T,name:W,subsystemId:T,information:F(Od),reason:xe,description:xe,businessObjectIds:F(T),activityLinks:F(z({activityId:T,uses:F(W)})),sourceRefs:F(ws),reviewState:W}),Cd=z({id:T,fromConceptId:T,toConceptId:T,fromPerTarget:W,toPerSource:W,condition:xe,reviewState:W,sourceRefs:F(ws),fromLabel:W,toLabel:W,kind:{enum:["down","reference"]}}),Dd=z({id:T,name:W,purpose:xe,information:F(W),reason:xe,activityIds:F(T),reviewState:W}),Md=z({id:T,fromSubsystemId:T,toSubsystemId:T,information:W,description:xe,activityIds:F(T),flowDirection:{enum:["forward","return"]},reviewState:W}),Rd=z({columnId:T,value:{anyOf:[xe,{type:"number"}]},linkId:W},["columnId","value"]),Ld=z({card:T,columns:F(z({id:T,name:W,informationId:T})),rows:F(z({id:T,cells:F(Rd)})),empty:xe},["card","columns","rows"]),Bo=z({id:T,name:W,when:xe,meaning:xe,blocks:F(Ld),note:xe},["id","name","when","meaning","blocks"]),Go=z({id:T,title:W,description:xe,meta:{},samples:F(Bo)}),Nd=z({...Bo.properties,checkIds:{...F(T),minItems:1,uniqueItems:!0}},[...Bo.required,"checkIds"]),Pd=z({decisionExampleIds:F(T),decisionCheckIds:F(T),resultCheckIds:F(T),sampleIds:F(T)}),Td=z({...Go.properties,samples:F(Nd),testSpecification:Pd},[...Object.keys(Go.properties)]),qd=z({id:T,title:W,description:xe,reason:xe,meta:{}}),$d=z({conceptId:T,name:W,fields:F(W),description:xe,sources:F(W),sourceActivityIds:F(T)}),Wd=z({id:T,fromConceptId:T,toConceptId:T,relationIds:F(T),scope:xe,fromLabel:W,toLabel:W,kind:{enum:["down","reference"]}}),zd=z({id:T,conceptId:T,subsystemId:T,name:W,description:xe,sources:F(W),fields:F(z({name:W,informationId:T}))}),Ud=z({id:T,fromViewId:T,toViewId:T,relationIds:F(T),fromLabel:W,toLabel:W,kind:{enum:["down","reference"]}}),Yr=z({nodes:F(zd),edges:F(Ud),handoffIds:F(T)}),Qr=z({id:T,subsystemId:T,title:W,description:xe,reviewer:z({roleId:T}),relatedActivityIds:F(T),graph:z({conceptIds:F(T),nodes:F($d),edges:F(Wd),subsystemViews:Yr},["conceptIds","nodes","edges"]),structureStatements:F(z({id:T,title:W,description:xe,sampleIds:F(T),sourceRefs:F(ws)})),capabilities:F(Go),limitations:F(qd),meta:z({questions:F(W),hypotheses:{}},["questions"])}),Vd=z({...Qr.properties,capabilities:F(Td)}),ea=z({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:W,basedOn:z({documentId:T,revision:W,verification:{enum:["unverified"]}}),relatedStates:F(z({documentId:T,revision:W,verification:{enum:["unverified"]}})),subsystems:F(Dd),concepts:F(jd),relations:F(Cd),handoffs:F(Md),reviewGroups:F(Qr),benefits:F(W),considerations:F(W),reviewPoints:F(W),meta:{},presentation:z({activityViews:{},creatorActivityIds:{},sampleCaption:xe,subsystemViews:Yr,landscapeRelationships:F(z({from:T,to:T})),reviewBoundaries:F(z({from:T,to:T,label:xe,promise:xe}))},["landscapeRelationships","reviewBoundaries"])}),Fd=z({...ea.properties,schemaVersion:{enum:["0.2"]},reviewGroups:F(Vd)}),An=(e,t)=>z({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:W,documents:F({anyOf:t.map(sd)}),sources:F(z({documentId:T,revision:W,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:xe})),externalDocuments:F(z({id:T,kind:{enum:["businessDesign"]},revision:W,activities:F(z({id:T,name:W}))})),diagnostics:F(W)}),di={anyOf:[An("0.1",["businessDesign","checkItems"]),An("0.2",["businessDesign","checkItems","stateTransition"]),An("0.3",["businessDesignRoles","checkItems","stateTransition"]),An("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"]),An("0.5",["oldStructuredBusinessDesign","checkItems","stateTransitionStructured"]),An("0.6",["procedureBusinessDesign","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"]),An("0.7",["decisionBusinessDesign","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:Uo,businessDesignRoles:Jr,businessDesignStructured:eo,oldStructuredBusinessDesign:ld,procedureBusinessDesign:Fo,decisionBusinessDesign:Sd,checkItems:Ad,stateTransition:vs,stateTransitionStructured:Ed,conceptModel:ea,checkedConceptModel:Fd}},ot=(e,t)=>P(new Set(e).size===e.length,t),Cn=(e,t)=>P(e.length>0,t),rr=e=>JSON.stringify(e.kind==="value"?[e.axisId,e.kind,e.operator,e.value]:[e.axisId,e.kind]);function Bd(e,t){const n=e.procedure.steps,i=n.map(l=>l.id),o=new Map(i.map(l=>[l,[]])),r=new Set,s=new Set,d=[];Cn(n,"Procedure requires a Step: "+e.id);for(const l of e.procedure.orderRules)if(l.kind==="before"){t(l.beforeId,"step",e.id),t(l.afterId,"step",e.id),P(l.beforeId!==l.afterId,"Self Step order");const u=JSON.stringify([l.beforeId,l.afterId]);P(!r.has(u),"Duplicate Step order"),r.add(u),P(i.indexOf(l.beforeId)<i.indexOf(l.afterId),"Standard Step order contradicts before constraint"),o.get(l.beforeId).push(l.afterId)}else{P(l.stepIds.length>=2,"Interchangeable group requires two Steps"),ot(l.stepIds,"Duplicate interchangeable Step");for(const p of l.stepIds)t(p,"step",e.id);const u=JSON.stringify([...l.stepIds].sort());P(!s.has(u),"Duplicate interchangeable group"),s.add(u),d.push(l.stepIds)}const a=(l,u)=>{const p=[l],g=new Set;for(;p.length;){const c=p.pop();if(!g.has(c)){g.add(c);for(const h of o.get(c)){if(h===u)return!0;p.push(h)}}}return!1};for(const l of i)P(!a(l,l),"Step order cycle");for(const l of d)for(const u of l)for(const p of l)u!==p&&P(!a(u,p),"Interchangeable Steps conflict with before constraint")}function ta(e,t,n){const i=(o,r,s)=>{const d=n(o,r,e.id);return s&&P(t.parent.get(o)===s,"Structure owner mismatch: "+o),d};ot(e.roles.map(o=>o.name),"Duplicate Role name"),P(e.roles.every(o=>o.name===o.name.trim()&&!/[\r\n]/.test(o.name)),"Invalid Role name"),ot(e.data.map(o=>o.name),"Duplicate Data name");for(const o of e.data){P(o.name===o.name.trim(),"Data name whitespace"),Cn(o.items,"Data requires Information: "+o.id),ot(o.items.map(r=>r.informationId),"Duplicate Data information");for(const r of o.items)i(r.informationId,"information")}for(const o of e.activities)Cn(o.results,"Activity requires Result: "+o.id),Bd(o,i);return i}function Gd(e,t,n,i,o){for(const r of e.activities){const s=d=>{const a=i(d.decisionId,"decision",r.id);return i(d.rowId,"decision-row",a.id),a};for(const d of r.procedure.steps){ot(d.decisionIds,"Duplicate Step decision");for(const a of d.decisionIds)i(a,"decision",r.id);d.whenDecision&&s(d.whenDecision)}for(const d of r.decisions){Cn(d.axes,"Decision requires a condition axis: "+d.id),Cn(d.rows,"Decision requires a row: "+d.id),d.appliesWhen&&(s(d.appliesWhen),P(d.appliesWhen.decisionId!==d.id,"Decision cannot depend on itself: "+d.id));for(const a of d.axes){ot(a.dataIds,"Duplicate decision axis Data");for(const l of a.dataIds)i(l,"data");P(a.trueLabel===void 0==(a.falseLabel===void 0),"Boolean labels must be paired: "+a.id)}for(const[a,l]of d.rows.entries()){P(l.conditions.length===d.axes.length,"Decision row must cover every axis: "+l.id);for(const[u,p]of l.conditions.entries())if(P(p.axisId===d.axes[u].id,"Decision condition axis/order mismatch: "+l.id),p.kind==="value"&&["gte","lte","gt","lt"].includes(p.operator)&&P(typeof p.value=="number","Ordered comparison requires a number: "+l.id),p.kind==="undecided"&&P(l.result.kind==="undecided","Undecided condition cannot assert an outcome: "+l.id),p.kind==="else"){const g=JSON.stringify(l.conditions.slice(0,u).map(rr));P(d.rows.slice(0,a).some(c=>JSON.stringify(c.conditions.slice(0,u).map(rr))===g&&c.conditions[u]?.kind==="value"),"Else needs an earlier branch in the same context: "+l.id)}P(l.result.kind==="undecided"||l.result.text!==null,"Known decision result needs a description: "+l.id),l.result.kind==="undecided"&&o.push("業務判断未決: "+l.id),ot(l.result.dataIds,"Duplicate decision result Data");for(const u of l.result.dataIds)i(u,"data");ot(l.result.exceptionIds,"Duplicate decision exception");for(const u of l.result.exceptionIds){const p=i(u,"exception");P(p.activityId===r.id,"Decision exception Activity mismatch: "+u)}ot(l.checkRefs.map(u=>u.checkId),"Duplicate decision Check");for(const u of l.checkRefs){n(u.checkId,"check");const p=t.map.get(t.owner.get(u.checkId));P(p?.kind==="checkItems"&&p.basedOn.documentId===e.id&&p.basedOn.revision===e.revision,"Decision Check source mismatch: "+u.checkId),P(p.index.some(g=>g.activityId===r.id&&g.checkIds.includes(u.checkId)),"Decision Check Activity mismatch: "+u.checkId)}}}for(const d of r.decisions){const a=new Set;let l=d;for(;l.appliesWhen;)P(!a.has(l.id),"Decision dependency cycle: "+d.id),a.add(l.id),l=s(l.appliesWhen)}}}function Hd(e,t,n){const i=ta(e,t,n);for(const o of e.activities){if(o.performers!==null){Cn(o.performers,"Empty performers"),ot(o.performers.map(s=>s.objectId),"Duplicate performer");for(const s of o.performers){i(s.objectId,"object"),ot(s.roleIds,"Duplicate performer Role");for(const d of s.roleIds)i(d,"role")}}let r=o.performers===null;for(const s of o.procedure.steps)if(s.performerObjectIds!==null){Cn(s.performerObjectIds,"Empty Step performers"),ot(s.performerObjectIds,"Duplicate Step performer");for(const d of s.performerObjectIds)P(o.performers?.some(a=>a.objectId===d),"Step performer outside Activity assignment: "+d)}else o.performers?.length!==1&&(r=!0);r&&P(e.findings.some(s=>s.status==="open"&&s.scope==="items"&&s.targetIds.includes(o.id)),"Unresolved performer requires an open Activity Finding: "+o.id)}for(const o of e.relations)if(["input","output"].includes(o.kind)){const r=i(o.dataId,"data"),s=o.kind==="input"?o.fromId:o.toId;for(const d of r.items)i(d.informationId,"information",s)}}function Jd(e,t,n,i){const o=ta(e,t,n),r=new Map(e.activities.flatMap(s=>s.procedure.steps.map(d=>[d.id,{activity:s,step:d}])));e.schemaVersion==="0.6"&&Gd(e,t,n,o,i);for(const s of e.exceptions){const d=s.continuity;if(d){for(const a of[d.interruptedAtStepId,d.resumeAtStepId])a!==null&&o(a,"step",s.activityId);if(d.retainedDataIds!==null){ot(d.retainedDataIds,"Duplicate retained Data");for(const a of d.retainedDataIds)o(a,"data")}}}for(const s of e.objects)s.scope===null&&i.push("Scope未確定: "+s.id);for(const s of e.activities){s.scope===null&&i.push("Scope未確定: "+s.id),s.who===null?i.push("Who未確定: "+s.id):s.who.kind==="role"&&o(s.who.roleId,"role");for(const d of s.procedure.steps){if(d.parties)for(const l of[d.parties.from,d.parties.to])l?.kind==="object"&&o(l.objectId,"object");if(d.whatDataIds===null)i.push("対象Data未確定: "+d.id);else{ot(d.whatDataIds,"Duplicate Step target Data");for(const l of d.whatDataIds)o(l,"data")}const a=d.exchange;if(a.kind==="unresolved"){i.push("やり取り未確定: "+d.id);continue}if(a.kind!=="internal"){if(o(a.objectId,"object"),a.phase===null&&i.push("Request/Response未確定: "+d.id),a.dataIds===null)i.push("Data未確定: "+d.id);else{ot(a.dataIds,"Duplicate Step Data");for(const l of a.dataIds)o(l,"data")}if(a.relationId!==null){const l=o(a.relationId,"relation"),u=a.direction==="input";P(l.kind===a.direction&&l.fromId===(u?a.objectId:s.id)&&l.toId===(u?s.id:a.objectId),"Step relation direction/endpoint mismatch: "+d.id)}if(a.pairedStepId!==null){const l=r.get(a.pairedStepId);P(l&&l.activity.id===s.id&&l.step.id!==d.id,"Invalid paired Step: "+d.id);const u=l.step.exchange;P(u.kind==="interaction"&&["request","response"].includes(a.phase)&&["request","response"].includes(u.phase)&&u.phase!==a.phase&&u.direction!==a.direction&&u.objectId===a.objectId,"Request/Response mismatch: "+d.id)}}}}}function _d(e){const t=new Map(e.data.map(o=>[o.id,o])),n=new Map,i=[];for(const o of e.activities)for(const r of o.procedure.steps){const s=r.exchange,d=new Map,a=(h,m)=>{let f=d.get(h);if(!f){const b=t.get(h);P(b,"Unknown Data during projection: "+h),f={id:b.id,name:b.name,uses:[]},d.set(h,f)}f.uses.includes(m)||f.uses.push(m)};for(const h of r.whatDataIds??[])a(h,"target");if(s.kind==="interaction")for(const h of s.dataIds??[])a(h,"transferred");const l={activityId:o.id,stepId:r.id,action:r.action,method:r.method,data:[...d.values()],targetDataUndecided:r.whatDataIds===null,obligation:r.obligation,appliesWhen:r.appliesWhen,effect:r.effect,...r.parties?{parties:r.parties}:{}};if(s.kind!=="interaction"){i.push({...l,kind:s.kind,from:s.kind==="internal"?{kind:"who",activityId:o.id}:null,to:null});continue}const u={kind:"who",activityId:o.id},p={kind:"object",objectId:s.objectId};i.push({...l,kind:s.kind,from:s.direction==="output"?u:p,to:s.direction==="output"?p:u,objectId:s.objectId,direction:s.direction,phase:s.phase,dataIds:s.dataIds,relationId:s.relationId,pairedStepId:s.pairedStepId});const g=JSON.stringify([o.id,s.objectId,s.direction]);n.has(g)||n.set(g,{activityId:o.id,objectId:s.objectId,direction:s.direction,stepIds:[],relationIds:[],data:[]});const c=n.get(g);c.stepIds.push(r.id),s.relationId!==null&&!c.relationIds.includes(s.relationId)&&c.relationIds.push(s.relationId),s.dataIds===null&&(c.transferUndecided=!0);for(const h of s.dataIds??[])if(!c.data.some(m=>m.id===h)){const m=t.get(h);P(m,"Unknown Data during projection: "+h),c.data.push({id:m.id,name:m.name})}}return{rows:i,edges:[...n.values()].map(o=>({...o,label:o.data.map(r=>r.name).join(" / ")}))}}const P=(e,t)=>{if(!e)throw Error(t)};function na(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},i=()=>{const r=t++;for(;t<e.length;){const s=e[t++];if(s==='"')return JSON.parse(e.slice(r,t));s==="\\"&&t++}throw Error("Unclosed JSON string")},o=(r=0)=>{P(r<=64,"JSON depth limit"),n();const s=e[t];if(s==='"'){i();return}if(s==="{"){t++,n();const a=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),P(e[t]==='"',"JSON object key required");const l=i();P(!a.has(l),"Duplicate JSON key: "+l),a.add(l),n(),P(e[t++]===":","JSON colon required"),o(r+1),n();const u=e[t++];if(u==="}")return;P(u===",","JSON comma required")}throw Error("Truncated object")}if(s==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){o(r+1),n();const a=e[t++];if(a==="]")return;P(a===",","JSON array comma required")}throw Error("Truncated array")}const d=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;P(t>d,"JSON value required"),JSON.parse(e.slice(d,t))};return o(),n(),P(t===e.length,"Trailing JSON content"),JSON.parse(e)}function mn(e,t=di,n="$"){if(t.$ref)return mn(e,di.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{mn(e,o,n);return}catch(r){i.push(r.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&P(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;P(i===t.type,"Invalid type at "+n)}if(t.minLength&&P(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&P(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])P(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))P(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),mn(e[i],t.properties[i],n+"."+i)}t.type==="array"&&e.forEach((i,o)=>mn(i,t.items,n+"["+o+"]"))}function Kd(e){const t=new Map,n=new Map,i=new Map,o=new Map,r=(s,d,a,l=d.id)=>{P(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,d.id),i.set(s.id,a),o.set(s.id,l)};for(const s of e.documents){r(s,s,"document",null);for(const[d,a]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const l of s[d]??[])r(l,s,a);if(s.kind==="businessDesign"&&["0.4","0.5","0.6"].includes(s.schemaVersion)){for(const d of s.objects)for(const a of d.information)r(a,s,"information",d.id);for(const d of s.activities){for(const a of d.procedure.steps)r(a,s,"step",d.id);for(const a of d.results)r(a,s,"result",d.id);for(const a of d.decisions??[]){r(a,s,"decision",d.id);for(const l of a.axes)r(l,s,"decision-axis",a.id);for(const l of a.rows)r(l,s,"decision-row",a.id)}}for(const d of s.data)r(d,s,"data")}}for(const s of e.externalDocuments){r(s,s,"document");for(const d of s.activities)r(d,s,"activity")}return{map:t,owner:n,types:i,parent:o}}function Fi(e){return mn(e),ia(e)}function Gn(e,t){const n=new Set(e.items.map(s=>s.id)),i=new Set,o=e.guarantees.find(s=>s.id===t.guaranteeId),r=s=>{if(Array.isArray(s)){for(const d of s)r(d);return}if(s&&typeof s=="object"){s.kind==="reference"&&n.has(s.targetId)&&i.add(s.targetId);for(const d of Object.values(s))d&&typeof d=="object"&&r(d)}};r(t.rows);for(const s of o?.blocks??[])s.kind==="prose"&&r(s.content);for(const s of e.items)(s.fields.guarantee??[]).some(a=>a.kind==="reference"&&(a.targetId===t.id||a.targetId===t.guaranteeId))&&i.add(s.id);return[...i]}function ia(e,{allowUnresolvedFindings:t=!1}={}){P(e.documents.length>0,"Document required");const n=Kd(e),{map:i,owner:o,types:r}=n,s=[...e.diagnostics],d=new Set;for(const c of e.sources)if(c.uri){const h=new URL(c.uri);P(h.protocol==="https:"&&!h.username&&!h.password,"Unsafe source URI")}const a=(c,h,m)=>(P(i.has(c),"Dangling reference: "+c),h&&P(r.get(c)===h,"Reference type mismatch: "+c),m&&P(o.get(c)===m,"Cross-document mismatch: "+c),i.get(c)),l=c=>c?.some(h=>h.kind==="text"?h.value.trim().length>0:!0),u=(c,h)=>{for(const m of c){if(m.kind==="reference"){const f=r.get(m.targetId);if(f==="decision-row"||f==="exception"){P(e.formatVersion==="0.7","Business rich references require formatVersion 0.7");const b=i.get(h),w=a(m.targetId,f),y=f==="exception"?w.activityId:n.parent.get(n.parent.get(m.targetId));P(b?.kind==="checkItems"&&b.basedOn.documentId===o.get(m.targetId),"Business reference must use the Check source Business Design"),P(b.index.some(E=>E.activityId===y),"Business reference Activity is absent from Check index")}else a(m.targetId,null,h),P(["document","section","guarantee","example","check","note"].includes(f),"Invalid rich reference target")}if(m.kind==="link"){const f=new URL(m.uri);P(f.protocol==="https:"&&!f.username&&!f.password,"Unsafe external link")}}};for(const c of e.documents)if(P(e.formatVersion!=="0.1"||c.kind!=="stateTransition","State documents require formatVersion 0.2"),c.kind==="businessDesign"){P(c.activities.length>0,"Activity required");const h=[...c.objects,...c.activities].map(b=>b.name);P(new Set(h).size===h.length,"Duplicate visible name"),P(h.every(b=>b===b.trim()&&!(["0.4","0.5","0.6","0.7"].includes(e.formatVersion)?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(w=>b.includes(w))),"Invalid Graph-visible name");for(const b of c.objects)P(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.icon),"Invalid icon");if(["0.2","0.3"].includes(c.schemaVersion)){P(new Set(c.roles.map(b=>b.name)).size===c.roles.length,"Duplicate Role name"),P(c.roles.every(b=>b.name===b.name.trim()&&!/[\r\n]/.test(b.name)),"Invalid Role name");for(const b of c.activities)b.roleId!==null?a(b.roleId,"role",c.id):d.add("Role未確定: "+b.id+" — "+b.who)}for(const b of c.activities)P(b.problem===null==(b.painLevel===null),"Problem/Pain pair mismatch");for(const b of c.exceptions??[])a(b.activityId,"activity",c.id);const m={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},f=new Set;for(const b of c.relations){a(b.fromId,m[b.kind][0],c.id),a(b.toId,m[b.kind][1],c.id);const w=JSON.stringify([b.kind,b.fromId,b.toId,["0.5","0.6"].includes(c.schemaVersion)?b.id:b.dataId??b.label]);P(!f.has(w),"Duplicate relation"),f.add(w)}c.schemaVersion==="0.4"&&Hd(c,n,a),["0.5","0.6"].includes(c.schemaVersion)&&Jd(c,n,a,s),P(new Set(c.findings.map(b=>b.sourceId)).size===c.findings.length,"Duplicate Finding source ID");for(const b of c.findings){P(b.scope==="items"?b.targetIds.length+b.unresolvedTargets.length>0:!b.targetIds.length&&!b.unresolvedTargets.length,"Finding scope mismatch"),P(new Set(b.targetIds).size===b.targetIds.length,"Duplicate Finding target");for(const w of b.targetIds)a(w,null,c.id),P(["object","activity"].includes(r.get(w)),"Invalid Finding target");b.unresolvedTargets.length&&(P(t,"Unresolved Finding target: "+b.sourceId),s.push("Finding参照未決: "+b.sourceId))}}else if(c.kind==="stateTransition"){const h=a(c.basedOn.documentId,"document");P(h.kind==="businessDesign"&&h.objects,"State source must be an in-package BD"),P(h.revision===c.basedOn.revision,"Stale State source revision"),a(c.objectId,"object",h.id),P(!e.documents.some(f=>f!==c&&f.kind==="stateTransition"&&f.objectId===c.objectId),"Duplicate Object state declaration"),P(c.states.length>0&&new Set(c.states.map(f=>f.name)).size===c.states.length,"Duplicate/empty state names"),P(c.states.every(f=>!f.name.startsWith("@")),"Reserved state name"),P(c.transitions.length<=1e3,"State transition row budget"),P(new Set(c.transitions.map(f=>f.sourceId)).size===c.transitions.length,"Duplicate transition source ID");const m=new Map;for(const f of c.transitions){f.fromId!=="@new"&&a(f.fromId,"state",c.id),["@unknown","@none"].includes(f.toId)||a(f.toId,"state",c.id);const b=a(f.activityId,"activity",h.id),w=JSON.stringify([f.fromId,f.activityId,f.condition.trim().replace(/\s+/gu," ")]);if(P(!m.has(w),"Duplicate state transition condition: "+m.get(w)+" / "+f.sourceId),m.set(w,f.sourceId),["0.4","0.5","0.6","0.7"].includes(e.formatVersion))if(P(f.path!=="normal"||f.exceptionId===null,"Normal transition cannot reference an exception"),f.exceptionId!==null){const y=a(f.exceptionId,"exception",h.id);P(y.activityId===b.id,"Exception Activity mismatch")}else f.path==="exception"&&P(s.includes("例外参照未決: "+f.id),"Unresolved exception requires a diagnostic");else P(f.path!=="normal"||f.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+f.id);P(f.effect!=="unchanged"||f.fromId===f.toId,"Unchanged state mismatch"),P(f.effect!=="change"||!f.toId.startsWith("@")&&f.fromId!==f.toId,"Invalid changed state"),P(f.effect!=="no-create"||f.fromId==="@new"&&f.toId==="@none","Invalid no-create transition"),P(f.effect!=="constraint"||f.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+c.id)}else if(c.kind==="conceptModel"){const h=a(c.basedOn.documentId,"document");P(h.kind==="businessDesign"&&h.revision===c.basedOn.revision,"Concept source must be the matching in-package BD revision"),P(!e.documents.some(N=>N!==c&&N.kind==="conceptModel"&&N.basedOn.documentId===h.id),"Duplicate Concept model for Business Design");const m=(N,D)=>{const C=new Map;for(const J of N)P(!C.has(J.id),"Duplicate "+D+" ID: "+J.id),C.set(J.id,J);return C},f=m(c.subsystems,"subsystem"),b=m(c.concepts,"concept"),w=m(c.relations,"concept relation"),y=m(c.reviewGroups,"review group"),E=m(c.handoffs,"handoff"),S=m(c.concepts.flatMap(N=>N.information),"concept information"),x=(N,D,C)=>(P(N.has(D),"Unknown "+C+": "+D),N.get(D)),A=N=>a(N,"activity",h.id),L=N=>{const D=a(N.documentId,"document");P(D.revision===N.revision,"Stale Concept source revision");const C=D.id===h.id,J=D.kind==="stateTransition"&&D.basedOn.documentId===h.id&&c.relatedStates.some(U=>U.documentId===D.id&&U.revision===D.revision);P(C||J,"Concept source must refer to its Business Design or a declared State"),a(N.targetId,N.targetType,D.id)};for(const N of c.relatedStates){const D=a(N.documentId,"document");P(D.kind==="stateTransition"&&D.revision===N.revision&&D.basedOn.documentId===h.id,"Invalid Concept state reference")}for(const N of c.subsystems)for(const D of N.activityIds)A(D);for(const N of c.concepts){x(f,N.subsystemId,"subsystem");for(const D of N.information)D.responsibleSubsystemId&&x(f,D.responsibleSubsystemId,"responsible subsystem");for(const D of N.businessObjectIds)a(D,"object",h.id);for(const D of N.activityLinks)A(D.activityId);for(const D of N.sourceRefs)L(D)}for(const N of c.relations){x(b,N.fromConceptId,"concept"),x(b,N.toConceptId,"concept");for(const D of N.sourceRefs)L(D)}for(const N of c.handoffs){x(f,N.fromSubsystemId,"subsystem"),x(f,N.toSubsystemId,"subsystem"),P(N.fromSubsystemId!==N.toSubsystemId,"Handoff must cross subsystem boundary");for(const D of N.activityIds)A(D)}const $=(N,D)=>{const C=m(N.nodes,"subsystem view"),J=m(N.edges,"subsystem view edge");for(const Z of C.values()){x(D,Z.conceptId,"view concept"),x(f,Z.subsystemId,"subsystem");const te=x(b,Z.conceptId,"concept");for(const Y of Z.fields)P(te.information.some(ae=>ae.id===Y.informationId),"Unknown information for subsystem view: "+Y.informationId)}for(const Z of J.values()){const te=x(C,Z.fromViewId,"subsystem view"),Y=x(C,Z.toViewId,"subsystem view");P(te.subsystemId===Y.subsystemId,"View relationship crosses subsystem boundary"),P(Z.relationIds.length>0,"Subsystem view relationship needs a concept relation");let ae=te.conceptId;for(const me of Z.relationIds){const he=x(w,me,"concept relation");P(he.fromConceptId===ae,"Subsystem view relation path is disconnected: "+me),ae=he.toConceptId}P(ae===Y.conceptId,"Subsystem view relation target differs")}P(new Set(N.handoffIds).size===N.handoffIds.length,"Duplicate subsystem view handoff");const U=new Set([...C.values()].map(Z=>Z.subsystemId));for(const Z of N.handoffIds){const te=x(E,Z,"handoff");P(U.has(te.fromSubsystemId)&&U.has(te.toSubsystemId),"Missing subsystem view handoff region: "+Z)}};c.presentation.subsystemViews&&$(c.presentation.subsystemViews,b);for(const N of c.reviewGroups){x(f,N.subsystemId,"subsystem"),a(N.reviewer.roleId,"role",h.id);for(const U of N.relatedActivityIds)A(U);const D=m(N.graph.nodes.map(U=>({...U,id:U.conceptId})),"view concept");P(new Set(N.graph.conceptIds).size===N.graph.conceptIds.length&&N.graph.conceptIds.length===D.size&&N.graph.conceptIds.every(U=>D.has(U)),"View concepts and nodes differ");for(const U of N.graph.nodes){x(b,U.conceptId,"concept");for(const Z of U.sourceActivityIds)A(Z)}m(N.graph.edges,"view edge");for(const U of N.graph.edges){x(D,U.fromConceptId,"view concept"),x(D,U.toConceptId,"view concept");for(const Z of U.relationIds)x(w,Z,"concept relation")}N.graph.subsystemViews&&$(N.graph.subsystemViews,D);const C=m(N.capabilities,"capability"),J=m(N.capabilities.flatMap(U=>U.samples),"sample");m(N.limitations,"limitation"),m(N.structureStatements,"structure statement");for(const U of N.structureStatements){for(const Z of U.sampleIds)x(J,Z,"sample");for(const Z of U.sourceRefs)L(Z)}for(const U of C.values())if(U.testSpecification){const Z=U.testSpecification;for(const[Y,ae]of Object.entries(Z))P(new Set(ae).size===ae.length,"Duplicate function specification reference: "+Y);const te=(Y,ae)=>{const me=a(Y,ae),he=a(o.get(Y),"document");return P(he.kind==="checkItems"&&he.basedOn.documentId===h.id&&he.basedOn.revision===h.revision,"Function Check source mismatch: "+Y),{value:me,doc:he}};for(const Y of[...Z.decisionCheckIds,...Z.resultCheckIds])te(Y,"check");for(const Y of Z.decisionExampleIds){const{value:ae,doc:me}=te(Y,"example"),he=Gn(me,ae);P(he.length>0,"Function decision table needs a Check: "+Y),P(he.every(ye=>Z.decisionCheckIds.includes(ye)),"Function decision table Check is not assigned: "+Y)}for(const Y of Z.sampleIds){const ae=U.samples.find(me=>me.id===Y);P(ae,"Function result sample belongs to another capability: "+Y),P(ae.checkIds.some(me=>Z.resultCheckIds.includes(me)),"Function result sample needs a result Check: "+Y),P(ae.checkIds.every(me=>Z.resultCheckIds.includes(me)||Z.decisionCheckIds.includes(me)),"Function result sample Check is not assigned: "+Y)}}for(const U of C.values())for(const Z of U.samples){if(c.schemaVersion==="0.2"){P(Z.checkIds.length>0,"Sample needs a Check: "+Z.id),P(new Set(Z.checkIds).size===Z.checkIds.length,"Duplicate sample Check: "+Z.id);for(const te of Z.checkIds){a(te,"check");const Y=a(o.get(te),"document");P(Y.kind==="checkItems"&&Y.basedOn.documentId===h.id&&Y.basedOn.revision===h.revision,"Sample Check source mismatch: "+te)}}for(const te of Z.blocks){x(D,te.card,"view concept");const Y=m(te.columns,"sample column");for(const ae of te.columns)x(S,ae.informationId,"concept information");m(te.rows,"sample row");for(const ae of te.rows){const me=new Set;for(const he of ae.cells)x(Y,he.columnId,"sample column"),P(!me.has(he.columnId),"Duplicate sample cell: "+he.columnId),me.add(he.columnId);P(me.size===Y.size,"Sample row does not match columns")}}}}for(const N of c.presentation.landscapeRelationships){const D=x(y,N.from,"review group"),C=x(y,N.to,"review group");P(D.subsystemId===C.subsystemId,"Internal relationship crosses subsystem boundary")}for(const N of c.presentation.reviewBoundaries)x(y,N.from,"review group"),x(y,N.to,"review group");s.push("概念モデルの業務意味は未確認: "+c.id)}else{const h=a(c.basedOn.documentId,"document");P(h.kind==="businessDesign","Check source is not BD"),P(h.revision===c.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+c.id),P(new Set(c.items.map(b=>b.checkId)).size===c.items.length,"Duplicate Check ID");const m=new Set;for(const b of c.index){a(b.activityId,"activity",h.id),P(!m.has(b.activityId),"Duplicate Activity index"),m.add(b.activityId),P(new Set(b.checkIds).size===b.checkIds.length,"Duplicate Check binding");for(const w of b.checkIds)a(w,"check",c.id)}P(new Set(c.sections.map(b=>b.activityId??b.title)).size===c.sections.length,"Duplicate Activity section");for(const b of c.sections)b.activityId!==null&&(a(b.activityId,"activity",h.id),P(m.has(b.activityId),"Section missing from index")),u(b.preamble,c.id);const f=new Set(e.documents.filter(b=>b.kind==="conceptModel"&&b.basedOn.documentId===h.id&&b.basedOn.revision===h.revision).flatMap(b=>b.reviewGroups.flatMap(w=>w.capabilities.flatMap(y=>y.testSpecification?.decisionExampleIds??[]))));for(const b of c.guarantees){const w=b.blocks.length>0&&b.blocks.every(y=>y.kind==="example"&&f.has(y.exampleId)&&c.examples.some(E=>E.id===y.exampleId&&E.guaranteeId===b.id&&Gn(c,E).length>0));P(b.blocks.some(y=>y.kind==="prose"&&l(y.content))||w,"General guarantee prose required"),a(b.sectionId,"section",c.id);for(const y of b.blocks)if(y.kind==="prose")u(y.content,c.id);else{const E=a(y.exampleId,"example",c.id);P(E.guaranteeId===b.id,"Example owner mismatch")}}for(const b of c.examples){a(b.guaranteeId,"guarantee",c.id),P(b.columns.length>0,"Example columns required");for(const w of b.rows){P(w.length===b.columns.length,"Example column mismatch");for(const y of w)u(y,c.id)}}for(const b of c.items){const w=a(b.sectionId,"section",c.id);P(w.activityId===null?!c.index.some(y=>y.checkIds.includes(b.id)):c.index.some(y=>y.activityId===w.activityId&&y.checkIds.includes(b.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),P(l(b.fields.guarantee)||l(b.fields.condition)&&l(b.fields.expectedResult),"Check guarantee required");for(const y of Object.values(b.fields)){u(y,c.id);for(const E of y)E.kind==="reference"&&(r.get(E.targetId)==="decision-row"&&P(i.get(E.targetId).checkRefs.some(S=>S.checkId===b.id),"Check and decision row must explicitly correspond: "+b.id),r.get(E.targetId)==="exception"&&P(c.index.some(S=>S.activityId===i.get(E.targetId).activityId&&S.checkIds.includes(b.id)),"Check and exception Activity mismatch: "+b.id))}P(w.activityId===null||c.index.some(y=>y.checkIds.includes(b.id)),"Unbound Check")}for(const b of c.notes)u(b.content,c.id);u(c.intro,c.id)}const p=e.diagnostics.filter(c=>c.startsWith("Role未確定:"));P(new Set(p).size===p.length,"Duplicate unresolved Role diagnostic");for(const c of p)P(d.delete(c),"Unresolved Who requires a diagnostic matching a current unresolved Activity");P(d.size===0,"Unresolved Who requires a diagnostic");const g=new Set;for(const c of e.sources){a(c.documentId,"document");const h=c.documentId+"@"+c.revision;P(!g.has(h),"Duplicate source descriptor"),g.add(h)}for(const c of e.externalDocuments)P(e.sources.some(h=>h.documentId===c.id&&h.revision===c.revision),"External source revision missing"),P(c.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+c.id);return{diagnostics:s,entities:i.size}}const R=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function Qe(e,t,n){if(n==null)return;const i=et(n);return e.append(R("h3",t),i),i}function oa(e,t){const n=R("ul");for(const i of[...new Set(t)]){const o=e.data?.find(r=>r.id===i);if(o)for(const r of o.items){const s=e.objects.flatMap(u=>u.information).find(u=>typeof u!="string"&&u.id===r.informationId);if(!s||typeof s=="string")continue;const d=s.name===o.name?"":s.name,a=r.condition?`条件：${r.condition}`:"";if(!d&&!a&&!s.description)continue;const l=R("li",[d,a].filter(Boolean).join(" — "));s.description&&l.append(et(s.description)),n.append(l)}}return n}function qi(e,t){if(t===null)return R("span","未決");if(!t.length)return R("span","なし");const n=R("ul");n.className="procedure-data-list";for(const i of t){const o=e.data?.find(d=>d.id===i),r=R("li",o?.name??"未決"),s=oa(e,[i]);if(s.children.length){const d=R("details"),a=R("summary","詳細");d.className="procedure-data-details",d.append(a,s),r.append(d)}n.append(r)}return n}function Xd(e,t){if(e===null)return;const n=et(e),i=r=>String(r??"").replace(/\s+/g,""),o=new Set(t.map(r=>i(et(`**${r.name}** — ${r.description}`).textContent)));for(const r of Array.from(n.querySelectorAll("li")))o.has(i(r.textContent))&&r.remove();for(const r of Array.from(n.querySelectorAll("ul,ol")))r.children.length||r.remove();return n.textContent?.trim()?n:void 0}const Zd={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function Yd(e,t,n){const i=new Map,o=new Set,r=new Set(n.map(d=>d.id)),s=e.model.business;for(const d of e.model.concepts??[]){if(d.basedOn.documentId!==s.id||d.basedOn.revision!==s.revision)continue;const a=d.presentation.activityViews;if(Array.isArray(a)){for(const l of a)if(!(!l||typeof l!="object"||Array.isArray(l)||l.activityId!==t||!Array.isArray(l.businessVariations)))for(const u of l.businessVariations){if(!u||typeof u!="object"||Array.isArray(u)||typeof u.exceptionId!="string"||!r.has(u.exceptionId)||u.kind!=="alternative"&&u.kind!=="exception"||o.has(u.exceptionId))continue;const p=i.get(u.exceptionId);p&&p!==u.kind?(i.delete(u.exceptionId),o.add(u.exceptionId)):i.set(u.exceptionId,u.kind)}}}return i}function Qd(e,t,n){const i=t.model.business,o=t.model.checks,r=n.decisions??[],s=new Map,d=w=>r.findIndex(y=>y.id===w)+1,a=w=>{const y=R("button",`（※${d(w)}）`);return y.type="button",y.className="business-decision-link",y.onclick=()=>s.get(w)?.scrollIntoView({behavior:"smooth",block:"start"}),y},l=w=>w?w.kind==="who"?En(i,n):i.objects.find(y=>y.id===w.objectId)?.name??"未決":"未決",u=(w,y)=>w===null||y===null?w===y:w.length===y.length&&w.every((E,S)=>E===y[S]),p=w=>w?.length===1&&!oa(i,w).children.length?R("span",i.data?.find(y=>y.id===w[0])?.name??"未決"):qi(i,w);e.append(R("h3","Procedure"));const g=R("p","表は左右にスクロールできます。");g.className="procedure-scroll-hint",e.append(g);const c=R("div");c.dataset.procedureScroll="",c.tabIndex=0,c.setAttribute("role","region"),c.setAttribute("aria-label","手順表");const h=R("table");h.dataset.procedureTable="",h.dataset.businessDecisions="";const m=R("thead"),f=R("tr");for(const w of["From","To","Data","Action"]){const y=R("th",w);y.scope="col",f.append(y)}m.append(f),h.append(m);const b=R("tbody");for(const[w,y]of n.procedure.steps.entries()){const E=R("tr");E.dataset.stepId=y.id;const S=y.exchange,x=En(i,n),A=S.kind==="interaction"?i.objects.find(J=>J.id===S.objectId)?.name??"未決":null,L=S.kind==="interaction"?S.direction==="input"?A:x:S.kind==="internal"?x:"未決",$=S.kind==="interaction"?S.direction==="input"?x:A:S.kind==="internal"?"—":"未決";E.append(R("td",L),R("td",$));const N=R("td");S.kind!=="interaction"||u(y.whatDataIds,S.dataIds)?N.append(p(y.whatDataIds)):N.append(R("span","対象："),p(y.whatDataIds),R("span","受渡し："),p(S.dataIds)),E.append(N);const D=R("td",y.action);for(const J of y.decisionIds??[])D.append(a(J));const C=[];if(y.obligation==="optional"&&C.push("任意"),y.method&&C.push(`方法：${y.method}`),y.appliesWhen&&C.push(`適用条件：${y.appliesWhen}`),y.effect&&C.push(`操作効果：${y.effect}`),y.whenDecision){const J=r.find(Y=>Y.id===y.whenDecision.decisionId),U=J?.rows.find(Y=>Y.id===y.whenDecision.rowId),Z=n.procedure.steps.slice(0,w).some(Y=>Y.decisionIds?.includes(J?.id??""));J?.kind==="validation"&&U?.result.kind==="accepted"&&J.rows.some(Y=>Y.result.kind==="error")&&Z||C.push(`判定条件：${J?.title??"未決"} / ${U?.result.text??"未決"}`)}if(y.parties){const J=l(y.parties.from),U=l(y.parties.to);(J!==L||U!==$)&&C.push(`操作主体と対象：${J} → ${U}`)}if(S.kind==="interaction"?(S.phase===null?C.push("Request/Response：未決"):S.phase!=="not-applicable"&&C.push(S.phase==="request"?"Request":"Response"),S.pairedStepId&&C.push(`対応：手順${n.procedure.steps.findIndex(J=>J.id===S.pairedStepId)+1}`)):S.kind==="unresolved"&&C.push("やり取り：未決"),C.length){const J=R("details"),U=R("summary","詳細");J.className="procedure-original",J.append(U,R("small",C.join(" · "))),D.append(J)}if(y.legacyText){const J=R("details");J.className="procedure-original",J.append(R("summary","元の手順"),et(y.legacyText)),D.append(J)}E.append(D),b.append(E)}if(h.append(b),c.append(h),e.append(c),n.procedure.orderRules.length){e.append(R("h3","手順の順序制約"));const w=R("ul"),y=E=>String(n.procedure.steps.findIndex(S=>S.id===E)+1);for(const E of n.procedure.orderRules)w.append(R("li",E.kind==="before"?`手順${y(E.beforeId)} → 手順${y(E.afterId)}`:`手順${E.stepIds.map(y).join("・")}は入替可能`));e.append(w)}for(const w of r){const y=R("section");if(y.dataset.businessDecision=w.id,s.set(w.id,y),y.append(R("h3",`${w.title}（※${d(w.id)}）`)),w.note&&y.append(R("p",w.note)),w.appliesWhen){const E=r.find(A=>A.id===w.appliesWhen.decisionId),S=E?.rows.find(A=>A.id===w.appliesWhen.rowId),x=R("p",`適用条件：${E?.title??"未決"} — ${S?.result.text??"未決"}`);x.append(a(w.appliesWhen.decisionId)),y.append(x)}y.append(R("p","上から順に判定し、最初に当てはまる行を見ます。"),hs(w,o),...bs(w,i,o)),e.append(y)}}function el(e,t,n){const i=R("article");i.className="markdown json-detail";const o=e.model,r=o.business,s=r.objects.find(a=>a.id===t),d=r.activities.find(a=>a.id===t);if(s){Qe(i,"Scope",s.scope===null?"未決":String(s.scope)),i.append(R("h3","Information"));const a=R("ul");for(const l of s.information){const u=R("li",typeof l=="string"?l:l.name);typeof l!="string"&&l.description&&u.append(et(l.description)),a.append(u)}i.append(a)}else if(d){const a=r.exceptions?.filter(c=>c.activityId===d.id)??[];if("performers"in d){Qe(i,"Scope",String(d.scope)),Qe(i,"Why",d.why),Qe(i,"When",d.when),Qe(i,"Who",En(r,d)),Qe(i,"旧形式の担当情報",zo(r,d)),d.performers?.length===1&&d.procedure.steps.some(f=>f.performerObjectIds===null)&&i.append(R("p","旧形式では、指定のない手順は旧形式の担当情報を継承します。")),Qe(i,"Where",d.where);const c=(e.findings??[]).filter(f=>f.id.startsWith("viewer:")&&f.targets.includes(d.id));for(const f of c){const b=R("p",f.summary+" ");b.className="finding-reference-warning",b.dataset.structureIssue=f.id;const w=R("button","構造の要確認を開く");w.type="button",w.className="node-navigate",w.onclick=()=>n?.(f.id),b.append(w),i.append(b)}i.append(R("h3","Procedure"));const h=R("ol");for(const f of d.procedure.steps){const b=R("li");b.append(et(f.text));const w=d.performers?.length===1&&(f.performerObjectIds===null||f.performerObjectIds.length===1&&f.performerObjectIds[0]===d.performers[0].objectId),y=[f.obligation==="required"?"必須":"任意",...f.appliesWhen?[`適用条件：${f.appliesWhen}`]:[],...w?[]:[`旧形式の担当：${zo(r,d,f.performerObjectIds)}`]];b.append(R("p",y.join(" · "))),h.append(b)}if(i.append(h),d.procedure.orderRules.length){i.append(R("h3","手順の順序制約"));const f=R("ul"),b=w=>String(d.procedure.steps.findIndex(y=>y.id===w)+1);for(const w of d.procedure.orderRules)f.append(R("li",w.kind==="before"?`手順${b(w.beforeId)} → 手順${b(w.afterId)}`:`手順${w.stepIds.map(b).join("・")}は入替可能`));i.append(f)}i.append(R("h3","Result"));const m=R("ul");m.dataset.businessResult="",m.dataset.resultScope="activity";for(const f of d.results){const b=R("li");b.append(et(f.text)),m.append(b)}i.append(m),Qe(i,"Problem",d.problem),Qe(i,"Pain level",d.painLevel)}else if(typeof d.who!="string"){const c=d;if(Qe(i,"Scope",c.scope===null?"未決":String(c.scope)),Qe(i,"Why",c.why),Qe(i,"When",c.when),Qe(i,"Who",En(r,c)),Qe(i,"Where",c.where),o.formatVersion==="0.7")Qd(i,e,c);else{i.append(R("h3","Procedure"));const m=R("table");m.dataset.procedureTable="";const f=R("thead"),b=R("tr");for(const x of["Step","From","To","Data","Action"]){const A=R("th",x);A.scope="col",b.append(A)}f.append(b),m.append(f);const w=R("tbody"),y=x=>x?x.kind==="who"?En(r,c):r.objects.find(A=>A.id===x.objectId)?.name??"未決":"未決";for(const[x,A]of c.procedure.steps.entries()){const L=R("tr");L.dataset.stepId=A.id;const $=A.parties,N=(te,Y)=>te===null||Y===null?te===Y:te.length===Y.length&&te.every((ae,me)=>ae===Y[me]),D=$?y($.from):A.exchange.kind==="internal"?En(r,c):"未決",C=$?y($.to):A.exchange.kind==="internal"?"—":"未決";for(const te of[String(x+1),D,C])L.append(R("td",te));const J=R("td");A.exchange.kind!=="interaction"||N(A.whatDataIds,A.exchange.dataIds)?J.append(qi(r,A.whatDataIds)):J.append(R("span","対象："),qi(r,A.whatDataIds),R("span","受渡し："),qi(r,A.exchange.dataIds)),L.append(J);const U=R("td",A.action),Z=[...A.obligation==="optional"?["任意"]:[],...A.method?[`方法：${A.method}`]:[],...A.appliesWhen?[`適用条件：${A.appliesWhen}`]:[],...A.effect?[`操作効果：${A.effect}`]:[]];if(A.exchange.kind==="interaction"){const te=A.exchange,Y=r.objects.find(Ie=>Ie.id===te.objectId)?.name??"未決",ae=A.parties,me=ae?.from?.kind==="who"&&ae.to?.kind==="object"&&ae.to.objectId===te.objectId,he=ae?.from?.kind==="object"&&ae.from.objectId===te.objectId&&ae.to?.kind==="who";if(!(te.direction==="output"?me:he)){const Ie=te.direction==="input"?"Input":"Output";Z.push(`受渡し：${me||he?"":Y+" / "}${Ie}`)}te.phase===null?Z.push("Request/Response：未決"):te.phase!=="not-applicable"&&Z.push(te.phase==="request"?"Request":"Response"),te.pairedStepId&&Z.push(`対応：手順${c.procedure.steps.findIndex(Ie=>Ie.id===te.pairedStepId)+1}`)}else A.exchange.kind==="unresolved"&&Z.push("やり取り：未決");if(Z.length&&U.append(R("small",Z.join(" · "))),A.legacyText){const te=R("details");te.className="procedure-original",te.append(R("summary","元の手順"),et(A.legacyText)),U.append(te)}L.append(U),w.append(L)}m.append(w);const E=R("p","表は左右にスクロールできます。無印の手順は必須です。");E.className="procedure-scroll-hint";const S=R("div");if(S.dataset.procedureScroll="",S.tabIndex=0,S.setAttribute("role","region"),S.setAttribute("aria-label","手順表"),S.append(m),i.append(E,S),c.procedure.orderRules.length){i.append(R("h3","手順の順序制約"));const x=R("ul"),A=L=>String(c.procedure.steps.findIndex($=>$.id===L)+1);for(const L of c.procedure.orderRules)x.append(R("li",L.kind==="before"?`手順${A(L.beforeId)} → 手順${A(L.afterId)}`:`手順${L.stepIds.map(A).join("・")}は入替可能`));i.append(x)}}i.append(R("h3","Result"));const h=R("ul");h.dataset.businessResult="",h.dataset.resultScope="activity";for(const m of c.results){const f=R("li");f.append(et(m.text)),h.append(f)}i.append(h),Qe(i,"Problem",c.problem),Qe(i,"Pain level",c.painLevel)}else{const c=d;for(const[h,m]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const f=Qe(i,h,m==="who"?ms(e,c.id)?.name??c.who:c[m]===null?null:String(c[m]));m==="result"&&f&&(f.dataset.businessResult="")}}const l=Xd("exception"in d?d.exception:null,a),u=Yd(e,d.id,a),p=(c,h,m)=>{if(!h.length&&!m)return;const f=R("section");f.dataset.businessVariations="",f.append(R("h3",c)),m&&f.append(m);for(const b of h){const w=et(b.description);w.dataset.businessException=b.id,f.append(R("h4",b.name),w);const y=b.continuity;if(y){const E=R("dl"),S=L=>L&&typeof d.procedure!="string"?`手順${d.procedure.steps.findIndex($=>$.id===L)+1}`:"未決",x=L=>L===null?"未決":L.map($=>r.data?.find(N=>N.id===$)?.name??"未決").join("、")||"なし",A=[["発生条件",y.trigger??"未決"]];(y.onInterrupt!==null||y.outcome==="resume"||y.outcome===null)&&A.push(["中断時の扱い",y.onInterrupt??"未決"]),A.push(["その後",y.outcome==="resume"?"再開":y.outcome==="continue"?"そのまま続行":y.outcome==="end"?"終了":"未決"]),(y.outcome==="resume"||y.outcome===null||y.resumeCondition!==null||y.resumeAction!==null)&&A.push(["再開条件",y.resumeCondition??"未決"],["再開方法",y.resumeAction??"未決"]),y.interruptedAtStepId&&A.push(["中断した手順",S(y.interruptedAtStepId)]),y.resumeAtStepId&&A.push(["再開する手順",S(y.resumeAtStepId)]),(y.retainedDataIds!==null||y.outcome==="resume")&&A.push(["保持するData",x(y.retainedDataIds)]);for(const[L,$]of A)E.append(R("dt",L),R("dd",$));f.append(E)}}i.append(f)};["0.6","0.7"].includes(o.formatVersion)?p("Exception",a,l):u.size?(p("例外",a.filter(c=>u.get(c.id)==="exception")),p("別ルート",a.filter(c=>u.get(c.id)==="alternative")),p("通常以外の扱い",a.filter(c=>!u.has(c.id)),l)):p("通常以外の扱い",a,l);const g=new Map([...r.objects,...r.activities].map(c=>[c.id,c.name]));if(["0.6","0.7"].includes(o.formatVersion))for(const[c,h]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const m=e.graph.relations.filter(b=>b.kind===c&&(b.from===t||b.to===t));if(!m.length)continue;i.append(R("h3",h));const f=R("ul");for(const b of m){const y=`${c==="business-exception"?`${g.get(b.from)} → ${g.get(b.to)}`:g.get(c==="input"?b.from:b.to)} — ${b.label||"未決"}`;if(c==="business-exception"){i.append(R("p",y));continue}f.append(R("li",y))}c!=="business-exception"&&i.append(f)}else for(const[c,h]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const m=r.relations.filter(b=>b.kind===c&&(b.fromId===t||b.toId===t));if(!m.length)continue;i.append(R("h3",h));const f=R("ul");for(const b of m){const w=c==="business-exception"?`${g.get(b.fromId)} → ${g.get(b.toId)}`:g.get(c==="input"?b.fromId:b.toId),y=Hr(r,b),E=`${w} — ${y||"未決"}`;if(c==="business-exception"){i.append(R("p",E));continue}const S=R("li",E);if("dataId"in b){const x=r.data.find(L=>L.id===b.dataId),A=R("ul");for(const L of x.items){const $=r.objects.flatMap(D=>D.information).find(D=>typeof D!="string"&&D.id===L.informationId);if(!$||typeof $=="string")continue;const N=R("li",$.name+(L.condition?`（条件：${L.condition}）`:""));$.description&&N.append(et($.description)),A.append(N)}S.append(A)}f.append(S)}c!=="business-exception"&&i.append(f)}}else i.append(R("p","項目を選択すると業務内容を表示します。"));return i}function sa(e,t){return e.model?.formatVersion!=="0.7"?[]:e.model.business.activities.flatMap(n=>"decisions"in n?n.decisions??[]:[]).filter(n=>n.rows.some(i=>i.checkRefs.some(o=>o.checkId===t)))}function to(e,t,n){const i=new Set(Object.values(n.fields).flat().filter(o=>o.kind==="reference").map(o=>o.targetId));for(const o of sa(t,n.id)){if(o.rows.some(d=>i.has(d.id)))continue;const r=R("details");r.dataset.linkedBusinessDecision=o.id,r.append(R("summary",`${o.title}（業務判断）`));let s=!1;r.addEventListener("toggle",()=>{!r.open||s||(s=!0,r.append(hs(o,t.model.checks),...bs(o,t.model.business,t.model.checks)))}),e.append(r)}}class yi{remaining=5e3;warned=!1;doc;design;requester;constructor(t,n,i=!1){this.doc=t,this.design=n,this.requester=i}take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(R("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,i=new Set){for(const o of n){if(!this.take(t))break;if(o.kind==="markdown"){t.append(et(o.value));continue}if(o.kind==="text"){const a=R("span",o.value);a.style.whiteSpace="pre-wrap",t.append(a);continue}if(o.kind==="link"){t.append(R("span",`${o.label} (${o.uri})`));continue}const r=R("details"),s=R("summary",o.label||o.targetId);r.append(s),t.append(r);let d=!1;r.addEventListener("toggle",()=>{if(!r.open||d)return;if(d=!0,i.has(o.targetId)){r.append(R("p","循環参照："+o.targetId));return}if(i.size>=16){r.append(R("p","参照の深さの上限です。続きは原文で確認してください。"));return}const a=new Set(i).add(o.targetId),l=this.doc,u=l.guarantees.find(m=>m.id===o.targetId),p=l.examples.find(m=>m.id===o.targetId),g=l.items.find(m=>m.id===o.targetId),c=l.sections.find(m=>m.id===o.targetId),h=l.notes.find(m=>m.id===o.targetId);if(u){r.append(R("h4",u.title));for(const m of u.blocks){if(!this.take(r))break;m.kind==="prose"?this.runs(r,m.content,a):this.example(r,m.exampleId,a)}}else if(p)this.example(r,p.id,a);else if(g){r.append(R("p",`${g.checkId} · ${g.title}`+(this.requester?"":` · ${g.reviewState}`))),this.requester&&(g.reviewState==="要確認"||g.reviewState==="要修正")&&r.append(R("p","確認が必要です。"));const m=this.requester?Object.fromEntries(Object.entries(g.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f))):g.fields;this.fields(r,m,a)}else if(c)r.append(R("h4",c.title)),this.runs(r,c.preamble,a);else if(h)r.append(R("h4",h.title)),this.runs(r,h.content,a);else if(o.targetId===l.id)r.append(R("h4",l.title)),this.runs(r,l.intro,a);else if(this.design.model?.formatVersion==="0.7"){const m=this.design.model.business,f=m.activities.flatMap(w=>"decisions"in w?w.decisions??[]:[]).find(w=>w.rows.some(y=>y.id===o.targetId)),b=m.exceptions?.find(w=>w.id===o.targetId);f?r.append(R("h4",f.title),hs(f,this.design.model.checks),...bs(f,m,this.design.model.checks)):b&&r.append(R("h4",b.name),et(b.description))}})}}fields(t,n,i,o=!1){for(const[r,s]of Object.entries(n)){if(!this.take(t))break;if(t.append(R("h4",Zd[r]??r)),r==="guarantee"&&o){const d=new Set;for(const a of s){const l=a.kind==="reference"?this.doc.guarantees.find(p=>p.id===a.targetId):void 0;if(!l){this.runs(t,[a],i);continue}if(d.has(l.id))continue;d.add(l.id);const u=new Set(i).add(l.id);for(const p of l.blocks){if(!this.take(t))break;p.kind==="prose"?this.runs(t,p.content,u):this.example(t,p.exampleId,u)}}}else this.runs(t,s,i)}}example(t,n,i,o=!1){const r=this.doc.examples.find(p=>p.id===n);if(!Gn(this.doc,r).length)return;const s=R("table"),d=o?r.columns.indexOf("結果"):-1,a=d>0&&r.columns.at(-1)==="Check ID";if(a){const p=R("colgroup");p.span=d,s.append(p);for(let f=d;f<r.columns.length;f++)s.append(R("colgroup"));const g=R("thead"),c=R("tr"),h=R("th","条件");h.colSpan=d,h.scope="colgroup",c.append(h);for(let f=d;f<r.columns.length;f++){const b=R("th",r.columns[f]);b.rowSpan=2,b.scope="col",f===d?b.className="decision-result":r.columns[f]==="備考"&&(b.className="decision-notes"),c.append(b)}const m=R("tr");for(const f of r.columns.slice(0,d)){const b=R("th",f);b.scope="col",m.append(b)}g.append(c,m),s.append(g)}else{const p=R("tr");for(const g of r.columns){if(!this.take(t))break;p.append(R("th",g))}s.append(p)}const l=a?R("tbody"):s;for(const p of r.rows){if(!this.take(t))break;const g=R("tr");for(const[c,h]of p.entries()){if(!this.take(t))break;const m=R("td");if(a&&c===d?m.className="decision-result":a&&r.columns[c]==="備考"&&(m.className="decision-notes"),o)for(const f of h){const b=f.kind==="reference"?this.doc.items.find(w=>w.id===f.targetId):void 0;b?m.append(R("span",b.checkId)):this.runs(m,[f],i)}else this.runs(m,h,i);g.append(m)}l.append(g)}a&&s.append(l);const u=R("div");u.className="json-example",u.append(s),t.append(u)}}function ar(e,t,n=e.model.checks,i=new Set,o=new Set){const r=R("section");r.className="check-content json-checks";const s=e.model.business,d=n.filter(l=>l.basedOn.documentId===s.id);let a=!1;for(const l of d){const u=new yi(l,e),p=l.index.filter(m=>m.activityId===t),g=new Set(l.index.flatMap(m=>m.checkIds)),c=(t?[...new Set(p.flatMap(m=>m.checkIds))]:l.items.filter(m=>!g.has(m.id)).map(m=>m.id)).filter(m=>!i.has(m)),h=l.sections.filter(m=>t?m.activityId===t:m.activityId===null);for(const m of h){(m.preamble.length||l.guarantees.some(f=>f.sectionId===m.id&&!o.has(f.id)))&&(a=!0),u.runs(r,m.preamble);for(const f of l.guarantees.filter(b=>b.sectionId===m.id&&!o.has(b.id)))u.runs(r,[{kind:"reference",targetId:f.id,label:f.title}])}for(const m of c){const f=l.items.find(y=>y.id===m);if(!f)continue;a=!0;const b=R("section");b.className="check-item",b.dataset.checkId=f.checkId,b.dataset.elementId=f.id,b.append(R("h3",f.checkId+" · "+f.title)),(f.reviewState==="要確認"||f.reviewState==="要修正")&&b.append(R("p","確認が必要です。"));const w=Object.fromEntries(Object.entries(f.fields).filter(([y])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(y)));u.fields(b,w,new Set([f.id])),to(b,e,f),r.append(b)}if(!t)for(const m of l.notes)a=!0,u.runs(r,[{kind:"reference",targetId:m.id,label:m.title}])}return a||r.append(R("p","この業務のテスト仕様はありません。")),r}function tl(e,t,n=e.model.checks){const i=R("section");i.className="check-content json-checks sample-checks";const o=e.model.business,r=new Set(t);for(const s of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new yi(s,e);for(const a of s.items.filter(l=>r.has(l.id))){const l=R("section");l.className="check-item",l.dataset.checkId=a.checkId,l.dataset.elementId=a.id,l.append(R("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&l.append(R("p","確認が必要です。"));const u=Object.fromEntries(Object.entries(a.fields).filter(([p])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(p)));d.fields(l,u,new Set([a.id]),!0),to(l,e,a),i.append(l)}}return i}const nl=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function il(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const i=n.value.replace(nl,"");i===n.value?t.push(n):i.trim()&&t.push({...n,value:i})}return t}function ol(e,t,n=e.model.checks){const i=R("section");i.className="check-content json-checks decision-examples";const o=e.model.business;for(const r of t)for(const s of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=s.examples.find(h=>h.id===r);if(!d||!Gn(s,d).length)continue;const a=new yi(s,e,!0),l=s.guarantees.find(h=>h.id===d.guaranteeId),u=R("section");u.dataset.decisionExample=r;for(const h of l?.blocks??[])h.kind==="prose"&&a.runs(u,il(h.content),new Set([l.id]));d.rows.length>1&&u.append(R("p","上から順に判定し、最初に当てはまる行を見ます。"));const p=d.columns.indexOf("結果"),g=p>0?p:d.columns.length;d.rows.some(h=>h.slice(0,g).some(m=>m.some(f=>f.kind==="text"&&/^\s*[-‐]\s*$/.test(f.value))))&&u.append(R("p","‐＝値不問。")),a.example(u,r,new Set([r]),!0),i.append(u)}return i}function sl(e,t,n=e.model.checks){const i=R("section");i.className="check-content json-checks decision-checks";const o=e.model.business,r=new Set(t);for(const s of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new yi(s,e,!0);for(const a of s.items.filter(l=>r.has(l.id))){const l=R("section");l.className="check-item",l.dataset.checkId=a.checkId,l.dataset.elementId=a.id,l.append(R("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&l.append(R("p","確認が必要です。")),a.fields.condition?.length&&(l.append(R("h4","条件")),d.runs(l,a.fields.condition,new Set([a.id])));const u=Object.fromEntries(Object.entries(a.fields).filter(([p])=>["expectedResult","guarantee","question","alternatives"].includes(p)));if(Object.keys(u).length){const p=R("details");p.append(R("summary","期待結果")),d.fields(p,u,new Set([a.id]),!0),l.append(p)}to(l,e,a),i.append(l)}}return i}function rl(e,t,n=e.model.checks,i=new Set){const o=R("section");o.className="check-content json-checks result-checks";const r=e.model.business,s=new Set(t);for(const d of n.filter(a=>a.basedOn.documentId===r.id&&a.basedOn.revision===r.revision)){const a=new yi(d,e,!0),l=d.items.filter(u=>s.has(u.id)&&i.has(u.id)&&u.reviewState!=="要確認"&&u.reviewState!=="要修正"&&!u.fields.question?.length&&!u.fields.alternatives?.length&&!sa(e,u.id).length);l.length&&o.append(R("p",l.map(u=>u.checkId).join("、")));for(const u of d.items.filter(p=>s.has(p.id))){if(l.includes(u))continue;const p=R("section");p.className="check-item",p.dataset.checkId=u.checkId,p.dataset.elementId=u.id,p.append(R("h3",u.checkId)),(u.reviewState==="要確認"||u.reviewState==="要修正")&&p.append(R("p","確認が必要です。"));const g=Object.fromEntries(Object.entries(u.fields).filter(([m])=>["expectedResult","guarantee","question","alternatives"].includes(m)));a.fields(p,g,new Set([u.id]),!0);const c=R("details"),h=R("summary","Check の詳細");c.append(h,R("p",u.title)),u.fields.condition?.length&&a.runs(c,u.fields.condition,new Set([u.id])),p.append(c),to(p,e,u),o.append(p)}}return o}const Co=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function al(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(u=>u.id)),i=[],o=new Set,r=new Set,s=t.filter(u=>u.basedOn.documentId===e.business.id&&u.basedOn.revision===e.business.revision),d=(u,p)=>s.some(g=>g.items.some(c=>c.id===u)&&(!p||g.index.some(c=>c.activityId===p&&c.checkIds.includes(u)))),a=(u,p,g,c,h=[])=>{const m=p.testSpecification,f=(m?.decisionCheckIds??[]).filter(A=>d(A,g)),b=(m?.resultCheckIds??[]).filter(A=>d(A,g)),w=(m?.decisionExampleIds??[]).filter(A=>s.some(L=>{const $=L.examples.find(D=>D.id===A),N=$?Gn(L,$):[];return N.length>0&&N.every(D=>d(D,g))})),y=p.samples.filter(A=>(!m||m.sampleIds.includes(A.id))&&A.checkIds?.length&&(m?A.checkIds.every(L=>d(L,g)):A.checkIds.some(L=>d(L,g)))),E=w.flatMap(A=>s.flatMap(L=>{const $=L.examples.find(N=>N.id===A);return $?Gn(L,$).filter(N=>d(N,g)):[]})),S=[...new Set([...f,...b,...E,...y.flatMap(A=>(A.checkIds??[]).filter(L=>d(L,g)))])];if(!S.length)return;const x=`fn:${g??"_"}:${u}:${p.id}`;r.has(x)||(r.add(x),i.push({key:x,activityId:g,groupId:u,capability:p,name:c,samples:y,checkIds:S,decisionCheckIds:f,resultCheckIds:b,decisionExampleIds:w,decisionTableCheckIds:[...new Set(E)],businessSections:h}))},l=e.model.presentation.activityViews;if(Array.isArray(l)){for(const u of l)if(!(!Co(u)||typeof u.activityId!="string"||!n.has(u.activityId)||!Array.isArray(u.testSpecificationFunctions)))for(const p of u.testSpecificationFunctions){if(!Co(p)||typeof p.groupId!="string"||typeof p.capabilityId!="string")continue;const g=e.model.reviewGroups.find(m=>m.id===p.groupId),c=g?.capabilities.find(m=>m.id===p.capabilityId);if(!g||!c)continue;o.add(JSON.stringify([g.id,c.id]));const h=[];if(Array.isArray(p.businessSections))for(const m of p.businessSections){if(!Co(m)||!Array.isArray(m.pages)||m.kind!=="result"&&m.kind!=="exception"||m.kind==="exception"&&(typeof m.exceptionId!="string"||!e.business.exceptions?.some(b=>b.id===m.exceptionId&&b.activityId===u.activityId)))continue;const f=[...new Set(m.pages.filter(b=>b==="decision"||b==="result"))];f.length&&h.push({kind:m.kind,exceptionId:m.kind==="exception"?m.exceptionId:void 0,pages:f})}a(g.id,c,u.activityId,typeof p.name=="string"&&p.name.trim()?p.name.trim():c.title,h)}}for(const u of e.model.reviewGroups)for(const p of u.capabilities)o.has(JSON.stringify([u.id,p.id]))||a(u.id,p,void 0,p.title);return i}function cr(e,t,n,i){const o=e.filter(s=>s.groupId===t&&s.capability.id===n),r=o.find(s=>s.samples.some(d=>d.id===i));if(r)return{kind:"sample",key:r.key,sampleId:i};for(const s of o){if(!s.capability.testSpecification)continue;const d=s.capability.samples.find(l=>l.id===i),a=s.decisionExampleIds.length?s.decisionTableCheckIds:s.decisionCheckIds;if(d?.checkIds?.some(l=>a.includes(l)))return{kind:"decision",key:"decision:"+s.key}}}const Tn=["landscape","overview"];function cl(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const i=e.querySelector(".tab-strip"),o=i.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const r=document.createElement("div");r.className="shell-workbench",n.before(r);const s=document.createElement("aside");s.id="design-explorer",s.setAttribute("aria-label","設計ナビゲーション"),s.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const d=document.createElement("div");d.className="shell-center",r.append(s,d),d.append(i,n);const a=document.createElement("div");a.className="shell-open-tabs",o.before(a),a.append(o),Wc(a);const l=document.createElement("nav");l.className="concept-tabs",l.setAttribute("aria-label","開いているサブシステムとデータ構造"),a.append(l);const u=document.createElement("nav");u.className="state-tabs",u.setAttribute("aria-label","開いている状態遷移"),a.append(u);const p=document.createElement("nav");p.className="spec-tabs",p.setAttribute("aria-label","開いているテスト仕様"),a.append(p);const g=document.createElement("section");g.id="concept-workspace",g.hidden=!0,g.setAttribute("aria-label","データ構造"),g.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',d.append(g);const c=document.createElement("section");c.id="states-workspace",c.hidden=!0,c.setAttribute("aria-label","状態遷移"),c.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',d.append(c);const h=document.createElement("section");h.id="tests-workspace",h.hidden=!0,h.setAttribute("aria-label","テスト仕様"),h.innerHTML='<main class="test-spec-page"></main>',d.append(h);const m=document.createElement("aside");m.id="test-related-panel",m.className="spec-related",m.setAttribute("aria-label","関連資料"),m.hidden=!0,m.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const f=document.createElement("section");f.id="empty-workspace",f.hidden=!0,f.innerHTML="<p>左の一覧から図を開いてください。</p>",d.append(f);const b=n.querySelector("#node-list-drawer");s.append(b);const w=e.querySelector("#node-list-toggle"),y=e.querySelector("#drawer"),E=s.querySelector("input"),S=s.querySelector("nav"),x=g.querySelector("iframe"),A=g.querySelector(".concept-related"),L=c.querySelector("article"),$="alder-explorer-v1:"+location.pathname,N=location.protocol==="file:"||location.origin==="null"?"*":location.origin,D=window.__alderConceptHtml;let C,J,U,Z,te={},Y=[],ae=[...Tn],me=new Map,he=new Map,ye=new Map,Ie=new Map;const q=v=>ye.get(v)??v,B=v=>Ie.get(v)??v,_=v=>J?.findGroup(me.get(v??"")),be=v=>U?.contentFor(me.get(v)??""),ie=(v,k)=>U?.findDataExample(me.get(v)??"",k),Ce=v=>U?.examplesFor(me.get(v)??"")??[],Pe=v=>Tn.includes(v)?"全体図":be(v)?.title??_(v)?.name??te[he.get(v)??""]?.name,ke=()=>{const v=t.business(),k=v.design?.model;return k?[...k.checks,...v.relatedChecks??[]].filter(M=>M.basedOn.documentId===k.business.id):[]},ce=()=>al(C,ke()),Ee=v=>ce().find(k=>k.key===(v.startsWith("decision:")?v.slice(9):v)),Ve=v=>ce().filter(k=>k.name===v.name).length>1?v.name+"（"+(t.business().activities.find(k=>k.id===v.activityId)?.name??"その他")+"）":v.name,Ge=v=>ke().some(k=>k.index.some(M=>M.activityId===v)||k.sections.some(M=>M.activityId===v)),Jt=v=>new Set(ce().filter(k=>k.activityId===v).flatMap(k=>k.checkIds)),wn=v=>{const k=new Set(ce().filter(M=>M.activityId===v).flatMap(M=>M.decisionExampleIds));return new Set(ke().flatMap(M=>M.examples.filter(O=>k.has(O.id)).map(O=>O.guaranteeId)))},an=v=>{const k=Jt(v),M=wn(v);return ke().some(O=>O.index.some(V=>V.activityId===v&&V.checkIds.some(X=>!k.has(X)))||O.sections.some(V=>V.activityId===v&&(V.preamble.length>0||O.guarantees.some(X=>X.sectionId===V.id&&!M.has(X.id)))))},Fa=()=>ke().some(v=>v.items.some(k=>!v.index.some(M=>M.checkIds.includes(k.id)))||v.sections.some(k=>k.activityId===null)||v.notes.length>0),Ba=v=>{const k=Ee(v);return k?k.capability.testSpecification?Ve(k)+"・"+(v.startsWith("decision:")?"可否":"結果"):k.name:(v==="@unassigned"?"未割当":v.startsWith("remaining:")?t.business().activities.find(M=>M.id===v.slice(10))?.name:v.startsWith("checks:")?t.business().activities.find(M=>M.id===v.slice(7))?.name:v==="@overview"?"テスト仕様":void 0)??v},xi=n.querySelector("#formattedMarkdownDrawer");xi&&r.append(xi),r.append(A,m),er(A,r,$+":drawer-width"),er(m,r,$+":test-drawer-width");let Ai=!1;const gt=t.rightDrawer??{isOpen:()=>Ai,setOpen:v=>{Ai=v}};let oe="business",We=!1,st=[],K="overview",rt=[],yt="",vt=[],Te="@overview",Ln,_t=innerWidth>800,Ei=!1,Oi=!0,wt=!1,Qn;const kt=new Map,Ot=new Map([["overview",x]]),mt=new Map,kn=new Map,In=new Map,ze=new Map,cn=new Map,jt=new Set,Ke=new Set,Sn=new Set,Xe=new Map;let Oe;try{if(Oe=JSON.parse(sessionStorage.getItem($)||"null"),Oe){if(wt=Oe.overviewClosed===!0,Qn=typeof Oe.documentKey=="string"?Oe.documentKey:void 0,_t=typeof Oe.left=="boolean"?Oe.left:_t,Array.isArray(Oe.expanded)){Ke.clear();for(const v of Oe.expanded)typeof v=="string"&&Ke.add(v)}rt=Array.isArray(Oe.states)?Oe.states.filter(v=>typeof v=="string"):[],t.rightDrawer||(typeof Oe.rightOpen=="boolean"?Ai=Oe.rightOpen:typeof Oe.right?.["concept:"+Oe.active]=="boolean"&&(Ai=Oe.right["concept:"+Oe.active]))}}catch{}function Ga(){if(!(!Oe||Qn!==t.business().key||!We)){for(const v of Array.isArray(Oe.overviewModes)?Oe.overviewModes:[])_(v)&&jt.add(v);for(const[v,k]of Object.entries(Oe.lastExamples??Oe.examples??{}))typeof k=="string"&&ie(v,k)&&cn.set(v,k);for(const[v,k]of Object.entries(Oe.examples??{}))typeof k=="string"&&ie(v,k)&&ze.set(v,k);for(const[v,k]of Object.entries(Oe.selected??{}))typeof k=="string"&&Y.includes(k)&&mt.set(v,k);st=[...new Set((Array.isArray(Oe.concepts)?Oe.concepts:[]).filter(v=>typeof v=="string"&&ae.includes(v)))],K=st.includes(Oe.active)?Oe.active:"landscape"}}let xn;const He=()=>{try{sessionStorage.setItem($,JSON.stringify({documentKey:Ln,overviewClosed:wt,selected:Object.fromEntries(mt),examples:Object.fromEntries(ze),lastExamples:Object.fromEntries(cn),overviewModes:[...jt],left:_t,expandedVersion:4,expanded:[...Ke],concepts:st,active:K,states:rt,specs:vt,activeSpec:Te,specExamples:Object.fromEntries(kt),...t.rightDrawer?{}:{rightOpen:gt.isOpen()}}))}catch{}},dn=()=>{oe==="concept"&&Xe.set("drawer:"+K,A.querySelector(".concept-drawer-body").scrollTop),oe==="concept"&&gt.isOpen()&&jt.has(K)&&Xe.set("review-overview:"+K,A.querySelector(".data-review-overview").scrollTop),oe==="concept"&&ze.has(K)&&Xe.set("example:"+K+":"+ze.get(K),A.querySelector(".data-examples-panel").scrollTop),oe==="states"&&yt&&Xe.set("state:"+yt,L.scrollTop),oe==="tests"&&Xe.set("tests:"+Te,h.querySelector(".test-spec-page").scrollTop),oe==="concept"&&K==="landscape"&&Xe.set("concept:landscape",g.querySelector(".concept-review-landscape").scrollTop)};function Ze(v=!0){if(Ei)return;const k=new URL(location.href);if(k.searchParams.set("view",oe),k.searchParams.delete("concept"),k.searchParams.delete("dataExample"),k.searchParams.delete("dataView"),oe==="concept"&&gt.isOpen()&&jt.has(K)?k.searchParams.set("dataView","overview"):oe==="concept"&&_(K)&&!ze.has(K)&&k.searchParams.set("dataView","structure"),oe==="concept"&&gt.isOpen()&&ze.has(K)&&k.searchParams.set("dataExample",ze.get(K)),oe==="tests"&&kt.has(Te)&&k.searchParams.set("dataExample",kt.get(Te)),k.searchParams.delete("state"),k.searchParams.delete("activity"),k.searchParams.delete("object"),k.searchParams.delete("spec"),oe==="concept"&&k.searchParams.set("concept",K),oe==="states"&&yt&&k.searchParams.set("state",yt),oe==="tests"&&k.searchParams.set("spec",Te),oe==="business"){const M=t.business(),O=M.views?.find(V=>V.key===M.viewKey);O?.activity?k.searchParams.set("activity",O.activity):O?.object&&k.searchParams.set("object",O.object)}k.href!==location.href&&history[v?"pushState":"replaceState"]({alderShell:!0},"",k)}function Re(v,k,M){const O=document.createElement(k);return O.textContent=M,v.append(O),O}function It(v){v!==oe&&(oe==="business"?t.capture():dn(),oe=v),n.hidden=oe!=="business",g.hidden=oe!=="concept",c.hidden=oe!=="states",h.hidden=oe!=="tests",f.hidden=oe!=="empty",e.dataset.workspaceArea=oe,oe==="business"&&t.refresh(),Dt(),St()}function Tt(v,k=!0){We&&(v==="subsystems"&&(v="landscape"),ae.includes(v)&&(dn(),st.includes(v)||st.push(v),K=v,It("concept"),Ao(),Ct(),He(),k&&Ze()))}function Ha(){dn(),ze.delete(K),jt.add(K),Ao(),A.querySelector(".concept-drawer-body").scrollTop=Xe.get("drawer-overview:"+K)??0,He(),Ze()}function Ja(v,k=!0){if(v&&!ie(K,v))return;const M=!ze.has(K),O=A.querySelector(".concept-drawer-body");M&&Xe.set("drawer-overview:"+K,O.scrollTop),dn(),jt.delete(K),v?(ze.set(K,v),cn.set(K,v)):ze.delete(K),gt.setOpen(!0),Ao(),M&&(O.scrollTop=0),He(),Ze(),k&&A.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}A.querySelector(".concept-example-back").onclick=()=>{Ha(),A.querySelector(".data-review-overview").focus({preventScroll:!0})};function Nn(v,k=!0){t.business().states?.some(M=>M.id===v)&&(dn(),rt.includes(v)||rt.push(v),yt=v,It("states"),tc(),Ct(),He(),k&&Ze())}function vo(v){return v.startsWith("decision:")&&Ee(v)&&!Ee(v)?.capability.testSpecification?Ee(v).key:Ee(v)||v==="@overview"||v==="@unassigned"||v.startsWith("checks:")&&Ge(v.slice(7))||v.startsWith("remaining:")&&an(v.slice(10))?v:t.business().activities.some(k=>k.id===v)?ce().find(k=>k.activityId===v)?.key??(Ge(v)?"checks:"+v:"@overview"):"@overview"}function qt(v,k=!0){const M=t.business();if(!M.design?.model||!M.key)return;v=vo(v),oe==="tests"&&v!==Te&&dn(),vt.includes(v)||vt.push(v),Te=v;const O=Ee(v);Ei||(O?.capability.testSpecification?Ke.add("tests-function-"+O.key):O?.activityId?Ke.add("tests-activity-"+O.activityId):v.startsWith("checks:")?Ke.add("tests-activity-"+v.slice(7)):v.startsWith("remaining:")?Ke.add("tests-activity-"+v.slice(10)):O&&Ke.add("tests-other")),It("tests"),wo(),Ct(),St(),He(),k&&Ze()}function wo(){const v=t.business().design;if(!v?.model)return;const k=h.querySelector(".test-spec-page"),M=Ee(Te);if(M){const O=document.createElement("section");O.className="test-spec-sample";const V=J?.findGroup(M.groupId),X=M.samples.find(ue=>ue.id===kt.get(Te))??M.samples[0],G=!!M.capability.testSpecification,Q=Te.startsWith("decision:");if(G)if(Re(O,"h2",M.name),Re(O,"h3",Q?"可否判定":"処理結果"),Q)M.decisionExampleIds.length?O.append(ol(v,M.decisionExampleIds,ke())):M.decisionCheckIds.length?O.append(sl(v,M.decisionCheckIds,ke())):Re(O,"p","可否条件の記載はありません。");else{const ue=V&&X&&U?new Set(M.samples.flatMap(Le=>Le.checkIds??[])):new Set;if(O.append(rl(v,M.resultCheckIds,ke(),ue)),V&&X&&U){Re(O,"h3","データ例");const Le=document.createElement("div");Le.className="data-examples-panel test-spec-examples",O.append(Le),U.renderDataExample(Le,V,X.id,Fe=>{Xe.set("tests:"+Te,k.scrollTop),kt.set(Te,Fe),wo(),He(),Ze(),h.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:M.capability.id,sampleIds:M.samples.map(Fe=>Fe.id),hideCapability:!0,hideSinglePicker:!0})}}else if(V&&X&&U){const ue=document.createElement("div");ue.className="data-examples-panel test-spec-examples",O.append(ue),U.renderDataExample(ue,V,X.id,Le=>{Xe.set("tests:"+Te,k.scrollTop),kt.set(Te,Le),wo(),He(),Ze(),h.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:M.capability.id,heading:M.name,sampleIds:M.samples.map(Le=>Le.id),renderSpecification:Le=>Le.append(tl(v,X.checkIds??[],ke()))})}k.replaceChildren(O)}else if(Te==="@overview")k.replaceChildren(),Re(k,"p","左のメニューからテスト仕様を選択してください。");else if(Te.startsWith("remaining:")){const O=Te.slice(10);k.replaceChildren(ar(v,O,ke(),Jt(O),wn(O)))}else k.replaceChildren(ar(v,Te.startsWith("checks:")?Te.slice(7):void 0,ke()));Xa(M),k.scrollTop=Xe.get("tests:"+Te)??0}function ei(v){v||(wt=!1),It("business"),v?t.openActivity(v):(wt=!1,t.openOverview()),St(),Ct(),Ze()}function _a(v){It("business"),t.openObject(v),St(),Ct(),Ze()}function Us(v){const k=t.business(),M=k.design?.model;return M?[...new Set(M.states.filter(O=>O.objectId===v&&O.basedOn.documentId===M.business.id&&O.basedOn.revision===M.business.revision).flatMap(O=>O.transitions.map(V=>V.activityId)))]:[...new Set((k.design?.objectStateTransitions?.[v]?.model?.transitions??[]).flatMap(O=>O.activityId?[O.activityId]:[]))]}function Vs(v){return(t.business().states??[]).filter(k=>Us(k.id).includes(v))}function Fs(v){const k=t.business(),M=k.design?.model,O=C?.model.concepts.find(V=>V.id===v);return!M||!C||!O?[]:(k.states??[]).filter(V=>O.businessObjectIds.includes(V.id)&&M.states.some(X=>X.objectId===V.id&&X.basedOn.documentId===M.business.id&&X.basedOn.revision===M.business.revision&&C.model.relatedStates.some(G=>G.documentId===X.id&&G.revision===X.revision)))}function ko(v,k,M="状態遷移"){if(!k.length)return;const O=document.createElement("section");O.className="shell-related-links",Re(O,"h3",M);for(const V of k){const X=Kt(O,V.name,()=>Nn(V.id));X.dataset.relatedState=V.id}v.append(O)}function Bs(v){const k=C?.model.reviewGroups.find(O=>O.id===v.groupId);if(!k)return[];const M=new Set(k.graph.nodes.map(O=>O.conceptId));return[...new Set(v.samples.flatMap(O=>O.blocks.map(V=>V.card)))].filter(O=>M.has(O)&&C?.model.concepts.some(V=>V.id===O))}function Kt(v,k,M){const O=document.createElement("button");return O.type="button",O.className="shell-evidence",Re(O,"span",k),O.onclick=M,v.append(O),O}function Io(v,k){const M=k.filter(V=>V.capability.testSpecification);if(!M.length)return;const O=document.createElement("section");O.className="shell-test-links",Re(O,"h3","テスト仕様書");for(const V of M)for(const[X,G]of[["decision:","可否判定"],["","処理結果"]]){const Q=X+V.key,ue=Kt(O,Ve(V)+"・"+G,()=>qt(Q));ue.dataset.relatedSpec=Q}v.append(O)}function Ka(v,k){const M=ce().filter(Q=>Q.activityId===k&&Q.capability.testSpecification),O=C?.model.presentation.activityViews,V=Array.isArray(O)?O.find(Q=>Q&&typeof Q=="object"&&Q.activityId===k):void 0,X=Array.isArray(V?.uncreatedTestSections)?V.uncreatedTestSections:[],G=v.querySelectorAll("[data-business-result],[data-business-exception]");for(const Q of Array.from(G)){const ue=Q.dataset.businessException,Le=ue?"exception":"result",Fe=ue??"result",Be=M.flatMap(at=>at.businessSections.filter($t=>$t.kind===Le&&(Le==="result"||$t.exceptionId===ue)).flatMap($t=>$t.pages.filter(H=>H==="decision"?at.decisionCheckIds.length||at.decisionExampleIds.length:at.resultCheckIds.length||at.samples.length).map(H=>({target:at,page:H})))),Mt=document.createElement("section");Mt.className="shell-section-links",Mt.setAttribute("aria-label","テスト仕様書"),Q.dataset.resultScope==="activity"&&Re(Mt,"p",(Be.length?"Activity全体との対応です。":"")+"各Resultとの対応は未確認です。");const ht=new Set;for(const{target:at,page:$t}of Be){const H=($t==="decision"?"decision:":"")+at.key;if(ht.has(H))continue;ht.add(H);const De=Kt(Mt,Ve(at)+"・"+($t==="decision"?"可否判定":"処理結果"),()=>qt(H));De.dataset.relatedSpec=H}if(!ht.size){const at=Re(Mt,"p",X.includes(Fe)?"テスト仕様書未作成":"テスト仕様書との対応未確認");at.className="shell-spec-warning"}Q.after(Mt)}Io(v,M.filter(Q=>!Q.businessSections.length))}function Xa(v){const k=m.querySelector(".spec-related-content");if(k.replaceChildren(),!v?.capability.testSpecification)return;const M=t.business().activities.find(X=>X.id===v.activityId),O=J?.findGroup(v.groupId);if(M){Re(k,"h3","Activity");const X=Kt(k,M.name,()=>ei(M.id));X.dataset.relatedActivity=M.id}if(O){Re(k,"h3","概念モデル");const X=Kt(k,O.name,()=>Tt(q(O.id)));X.dataset.relatedGroup=O.id}const V=Bs(v);if(V.length){Re(k,"h3","概念");for(const X of V){const G=C.model.concepts.find(ue=>ue.id===X),Q=Kt(k,G.name,()=>Tt(B(X)));Q.dataset.relatedConcept=X}}v.activityId&&ko(k,Vs(v.activityId),"状態遷移（同じ Activity）")}function Za(v,k){Re(v,"h3","Activity");const M=t.business(),O=_(K),V=C?.model.concepts.find(G=>G.id===k),X=O?.concepts[k]?.sourceActivities??O?.activities??V?.activityLinks.filter(G=>G.uses.includes("生成")).map(G=>G.activityId)??[];for(const G of X){const Q=M.activities.find(Le=>Le.id===G);if(!Q)continue;const ue=document.createElement("button");ue.className="shell-evidence",Re(ue,"span",Q.name),ue.title=Q.name+"を業務タブで開く",ue.setAttribute("aria-label",ue.title),ue.onclick=()=>ei(Q.id),v.append(ue)}}function So(v){const k=_(v);return k?J?.graph(k.id):v==="overview"?J?.overviewGraph():void 0}function Gs(v){const k=kn.get(K),M=k?So(K)?.tables[k]:void 0;return M?.conceptId===v?M:void 0}function Ya(v,k){const M=Gs(k)??_(K)?.concepts[k]??{...te[k],sources:void 0};v.replaceChildren(),Re(v,"p",M.note),Re(v,"h3","持つ情報");const O=document.createElement("ul");for(const[,V]of M.fields)Re(O,"li",V);if(v.append(O),M.sources?.length){Re(v,"h3","情報の出所・対象時点");const V=document.createElement("ul");for(const X of M.sources)Re(V,"li",X);v.append(V)}Za(v,k),Io(v,ce().filter(V=>Bs(V).includes(k))),ko(v,Fs(k))}function xo(v){const k=A.querySelector(".shell-heading strong");k.textContent=v,A.setAttribute("aria-label",v)}function Hs(v=!1){_(K)&&(mt.delete(K),kn.delete(K),In.delete(K),v||Ot.get(K)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},N),ji(),Dt(),A.querySelector(".concept-drawer-body").scrollTop=0,He())}A.querySelector(".concept-selection-clear").onclick=()=>{Hs(),ze.has(K)?A.querySelector(".concept-example-back").focus({preventScroll:!0}):A.querySelector(".data-review-overview").focus({preventScroll:!0})};function ji(){const v=A.querySelector(".concept-related-content");A.querySelector(".concept-selection").hidden=!!_(K)&&!mt.has(K)&&!In.has(K),A.querySelector(".concept-selection>h2").hidden=!_(K),A.querySelector(".concept-selection-clear").hidden=!_(K);const k=In.get(K);if(k&&Z){const X=Z.describe(v,{kind:"group",id:k});xo(X);return}if(K==="landscape"&&xn){v.replaceChildren();for(const[X,G]of Z.sections){Re(v,"h3",X);const Q=document.createElement("ul");for(const ue of G)Re(Q,"li",ue);v.append(Q)}xo("サブシステムの情報");return}const M=mt.get(K),O=_(K),V=We&&M?Gs(M)?.name??O?.concepts[M]?.name??te[M].name:O?.name??"データ構造の情報";xo(V),We&&M?Ya(v,M):(v.replaceChildren(),O||Re(v,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function Js(v){v.onload=()=>{_s(),v.contentDocument&&(Ys(v.contentDocument),Qs(v.contentDocument));const k=v.dataset.conceptView??"overview";if(!J||!C)return;const M=_(k),O=M?J.graph(M.id):k==="overview"?J.overviewGraph():{ids:Y,edges:J.edges,tables:te};v.contentWindow?.postMessage({type:"alder-concept-data",graph:O,focus:he.get(k),viewKey:k,documentKey:Ln??C.model.id,clearSelectionOnBackground:!!M},N);const V=mt.get(k);V&&v.contentWindow?.postMessage({type:"alder-concept-highlight",id:V},N)}}Js(x),x.dataset.conceptView="overview";function Qa(){A.querySelector(".concept-page-details").hidden=!0,A.querySelector(".concept-example-back").hidden=!0;const v=A.querySelector(".data-review-overview");v.hidden=!0,v.replaceChildren();const k=A.querySelector(".data-examples-panel");k.hidden=!0,k.replaceChildren(),delete k.dataset.dataExample,xn?.root.remove(),xn=void 0;for(const[M,O]of Ot)M!=="overview"&&(O.remove(),Ot.delete(M));x.removeAttribute("src"),x.removeAttribute("srcdoc"),mt.clear(),kn.clear(),In.clear()}function Ao(){g.setAttribute("aria-label",K==="landscape"||_(K)?"サブシステム":"データ構造"),g.querySelector(".concept-empty").hidden=We;const v=g.querySelector(".concept-review-landscape"),k=_(K),M=A.querySelector(".concept-page-details"),O=A.querySelector(".data-review-overview"),V=A.querySelector(".data-examples-panel");if(M.hidden=!We||!k,O.hidden=!We||!k||ze.has(K),V.hidden=!We||!k||!ze.has(K),A.querySelector(".concept-example-back").hidden=V.hidden,We&&k){const G=ce();Gc(O,k,U,(ue,Le)=>{const Fe=cr(G,k.id,ue,Le);if(Fe)return{kind:Fe.kind,open:()=>{const Be=cr(ce(),k.id,ue,Le);Be&&(Be.sampleId?kt.set(Be.key,Be.sampleId):kt.delete(Be.key),qt(Be.key))}}},ue=>ei(ue),t.business().activities),Io(O,G.filter(ue=>ue.groupId===k.id));const Q=ze.get(K)??cn.get(K)??Ce(K)[0]?.id;Q&&U.renderDataExample(V,k,Q,ue=>Ja(ue)),O.scrollTop=Xe.get("review-overview:"+K)??0,V.scrollTop=Xe.get("example:"+K+":"+Q)??0}if(v.hidden=!We||!Tn.includes(K),We&&Tn.includes(K)&&(K==="landscape"&&!xn&&(xn=Zc(document,C,Ln??C.model.id,G=>Tt(q(G)))),Bc(v,xn?.root,K==="overview"?"graph":"overview"),K==="landscape"&&xn?.restore()),We&&K!=="landscape"&&!Ot.has(K)){const G=document.createElement("iframe");G.className="concept-frame",G.dataset.conceptView=K,G.title=k?k.name+"のデータ構造":te[he.get(K)].name+"と隣接する概念",G.hidden=!0,Ot.set(K,G);const Q=he.get(K);Q&&mt.set(K,mt.get(K)??Q),Js(G),g.querySelector(".concept-main").append(G)}for(const[G,Q]of Ot)Q.hidden=!We||G!==K,We&&G===K&&!Q.hasAttribute("src")&&!Q.hasAttribute("srcdoc")&&(D?Q.srcdoc=D:Q.src=new URL("concept.html?view=overview"+(_(G)?"&group="+encodeURIComponent(_(G).id):G==="overview"?"":"&focus="+encodeURIComponent(he.get(G))),document.baseURI).href);const X=mt.get(K);X&&Ot.get(K)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:X},N),ji(),Dt(),A.querySelector(".concept-drawer-body").scrollTop=Xe.get("drawer:"+K)??0}function Pn(){const v=t.business(),k=v.views?.find(M=>M.activity!==void 0||M.object!==void 0||!wt);k?(It("business"),t.activateView(k.key)):st.length?Tt(st.at(-1),!1):rt.length?Nn(rt.at(-1),!1):vt.length?qt(vt.at(-1),!1):It("empty")}function ec(){if(wt=!0,oe==="business"){const v=t.business().views?.find(k=>k.key===t.business().viewKey);!v?.activity&&!v?.object&&Pn()}Ct(),St(),He(),Ze(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function tc(){L.replaceChildren();const v=t.business().states?.find(Q=>Q.id===yt);if(!v)return;const k=t.statePanel(v.id);k?L.append(k):Re(L,"p","この対象の状態遷移は未定義です。");const M=m.querySelector(".spec-related-content");M.replaceChildren();const O=Us(v.id),V=t.business().activities.filter(Q=>O.includes(Q.id));if(V.length){Re(M,"h3","Activity");for(const Q of V){const ue=Kt(M,Q.name,()=>ei(Q.id));ue.dataset.relatedActivity=Q.id}}const X=C?.model.concepts.filter(Q=>Fs(Q.id).some(ue=>ue.id===v.id))??[];if(X.length){Re(M,"h3","概念");for(const Q of X){const ue=Kt(M,Q.name,()=>Tt(B(Q.id)));ue.dataset.relatedConcept=Q.id}}const G=ce().filter(Q=>Q.activityId&&O.includes(Q.activityId)&&Q.capability.testSpecification);if(G.length){Re(M,"h3","Activity に関連するテスト仕様書");for(const Q of G)for(const[ue,Le]of[["decision:","可否判定"],["","処理結果"]]){const Fe=ue+Q.key,Be=Kt(M,Ve(Q)+"・"+Le,()=>qt(Fe));Be.dataset.relatedSpec=Fe}}L.scrollTop=Xe.get("state:"+yt)??0}let Eo="";function Ct(){for(const O of Array.from(o.querySelectorAll(".tab"))){const V=t.business().views?.find(G=>G.key===O.dataset.key);O.hidden=wt&&V?.activity===void 0&&V?.object===void 0;const X=!O.hidden&&oe==="business"&&O.dataset.key===t.business().viewKey;O.classList.toggle("active",X),O.querySelector("button")?.setAttribute("aria-current",String(X))}const v=(O,V,X)=>{O.replaceChildren();for(const G of V){const Q=X==="concept"?Pe(G):t.business().states?.find(ht=>ht.id===G)?.name??G,ue=oe===X&&G===(X==="concept"?K:yt),Le=document.createElement("div");Le.className="tab"+(ue?" active":"");const Fe=X==="concept"&&(G==="landscape"||_(G))?"subsystems":X;Le.dataset.viewKind=Fe;const Be=document.createElement("button");Be.id=(X==="concept"?"concept-tab-":"state-tab-")+G,$o(Be,Fe,Q),Be.setAttribute("aria-current",String(ue)),Be.onclick=()=>X==="concept"?Tt(G):Nn(G),Le.append(Be);const Mt=Wo((Fe==="subsystems"?"サブシステム：":X==="concept"?"データ構造：":"状態遷移：")+Q+"のタブを閉じる");Mt.onclick=()=>{dn(),X==="concept"?(st=st.filter(ht=>ht!==G),G!=="overview"&&(Ot.get(G)?.remove(),Ot.delete(G)),mt.delete(G),kn.delete(G),In.delete(G),ze.delete(G),cn.delete(G),jt.delete(G),oe===X&&K===G&&(st.length?Tt(st.at(-1),!1):Pn())):(rt=rt.filter(ht=>ht!==G),oe===X&&yt===G&&(rt.length?Nn(rt.at(-1),!1):Pn())),Ct(),St(),He(),Ze(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Le.append(Mt),O.append(Le)}};v(l,st,"concept"),v(u,rt,"states"),p.replaceChildren();for(const O of vt){const V=Ba(O),X=document.createElement("div");X.className="tab"+(oe==="tests"&&O===Te?" active":""),X.dataset.viewKind="tests";const G=document.createElement("button");G.id="spec-tab-"+O,$o(G,"tests",V),G.setAttribute("aria-current",String(oe==="tests"&&O===Te)),G.onclick=()=>qt(O);const Q=Wo("テスト仕様："+V+"のタブを閉じる");Q.onclick=()=>{vt=vt.filter(ue=>ue!==O),oe==="tests"&&Te===O&&(vt.length?qt(vt.at(-1),!1):Pn()),Ct(),St(),He(),Ze()},X.append(G,Q),p.append(X)}const k=a.querySelector(".tab.active:not([hidden])"),M=oe==="business"?"business:"+t.business().viewKey:oe==="concept"?"concept:"+K:oe==="states"?"states:"+yt:oe==="tests"?"tests:"+Te:"";k?(M!==Eo&&zc(a,k),Eo=M):Eo=""}function nc(){innerWidth<=800&&Ci(!1)}function St(){const v=S.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,k=S.scrollTop,M=t.business(),O=E.value.trim().toLocaleLowerCase();S.replaceChildren();const V=(H,De,ct)=>({kind:"item",id:H,name:De,key:ct}),X=(H,De,ct)=>({kind:"group",id:H,name:De,children:ct}),G=ce(),Q=H=>V(H.key,H.name,"tests:"+H.key),ue=G.filter(H=>H.capability.testSpecification),Le=G.filter(H=>!H.capability.testSpecification),Fe=ue.map(H=>X("tests-function-"+H.key,Ve(H),[V("decision:"+H.key,"可否判定","tests:decision:"+H.key),V(H.key,"処理結果","tests:"+H.key)]));for(const H of M.activities){const De=Le.filter(nt=>nt.activityId===H.id).map(Q),ct=(Jt(H.id).size?"remaining:":"checks:")+H.id;an(H.id)&&De.push(V(ct,"その他","tests:"+ct)),De.length&&Fe.push(X("tests-activity-"+H.id,H.name,De))}const Be=Le.filter(H=>!H.activityId);Be.length&&Fe.push(X("tests-other","その他",Be.map(Q))),Fa()&&Fe.push(V("@unassigned","未割当","tests:@unassigned"));const Mt=[{id:"business",label:"業務設計",items:[V("overview","全体図","business:overview"),X("business-activity","Activity",M.activities.map(H=>V(H.id,H.name,"business:"+H.id))),X("business-object","Object",(M.objects??[]).map(H=>V(H.id,H.name,"object:"+H.id)))]},{id:"states",label:"状態遷移",items:(M.states??[]).map(H=>V(H.id,H.name,"states:"+H.id))},{id:"subsystems",label:"サブシステム",items:C?.model.subsystems.length?[V("landscape","全体図","concept:landscape"),...C.model.subsystems.map(H=>X("subsystem-"+H.id,H.name.replace(/サブシステム$/,""),C.model.reviewGroups.filter(De=>De.subsystemId===H.id).map(De=>V(q(De.id),De.title,"concept:"+q(De.id)))))]:[]},{id:"concept",label:"データ構造",items:We&&Y.length?[V("overview","全体図","concept:overview"),X("concept-relations","概念",Y.map(H=>V(B(H),te[H].name,"concept:"+B(H))))]:[]},{id:"tests",label:"テスト仕様",items:M.design?.model&&(G.length||ke().length)?Fe:[]}];let ht=0;const at=(H,De,ct)=>{const nt=document.createElement("button");nt.className="explorer-item"+(ct?" explorer-item-nested":""),nt.dataset.explorerKey=H.key,nt.textContent=H.name;const Ye=M.views?.find(Je=>Je.key===M.viewKey);return oe===(De.id==="subsystems"?"concept":De.id)&&(["concept","subsystems"].includes(De.id)?H.id===K:De.id==="states"?H.id===yt:De.id==="tests"?H.id===Te:H.key.startsWith("object:")?Ye?.object===H.id:H.id==="overview"?!wt&&Ye?.activity===void 0&&Ye?.object===void 0:Ye?.activity===H.id)&&nt.setAttribute("aria-current","page"),nt.disabled=De.id==="business"&&!M.key,nt.onclick=()=>{b.hidden||t.closeLegacyList(),De.id==="business"?H.key.startsWith("object:")?_a(H.id):ei(H.id==="overview"?void 0:H.id):De.id==="concept"||De.id==="subsystems"?Tt(H.id):De.id==="tests"?qt(H.id):Nn(H.id),nc()},nt},$t=(H,De,ct,nt=!1)=>{const Ye=document.createElement("button"),Wt=O?!Sn.has(H):Ke.has(H);return Ye.className=(ct?"explorer-subparent":"explorer-parent")+(nt?" explorer-pending":""),Ye.dataset.explorerKey="group:"+H,Re(Ye,"span",De).className="explorer-parent-label",nt?(Ye.disabled=!0,Ye):(Ye.setAttribute("aria-expanded",String(Wt)),Ye.setAttribute("aria-controls","explorer-"+H),Ye.append($c(Wt)),Ye.onclick=()=>{O?Sn.has(H)?Sn.delete(H):Sn.add(H):(Ke.has(H)?Ke.delete(H):Ke.add(H),He()),St()},Ye)};for(const H of Mt){const De=H.items.flatMap(Je=>{if(Je.kind==="item")return!O||(H.label+" "+Je.name).toLocaleLowerCase().includes(O)?[Je]:[];const ln=O?Je.children.filter(jo=>(H.label+" "+Je.name+" "+jo.name).toLocaleLowerCase().includes(O)):Je.children;return!O||ln.length?[{...Je,children:ln}]:[]});if(O&&!De.length)continue;const ct=H.id!=="business"&&!H.items.length,nt=document.createElement("section"),Ye=$t(H.id,H.label,!1,ct),Wt=document.createElement("div");Wt.id="explorer-"+H.id,Wt.hidden=ct||(O?Sn.has(H.id):!Ke.has(H.id));for(const Je of De){if(Je.kind==="item"){Wt.append(at(Je,H,0)),ht++;continue}const ln=document.createElement("div");ln.id="explorer-"+Je.id,ln.hidden=O?Sn.has(Je.id):!Ke.has(Je.id),Wt.append($t(Je.id,Je.name,!0),ln);for(const jo of Je.children)ln.append(at(jo,H,1)),ht++;!Je.children.length&&!O&&(Re(ln,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!De.length&&!ct&&(Re(Wt,"p","項目がありません。").className="explorer-empty"),nt.append(Ye,Wt),S.append(nt)}O&&!ht&&(Re(S,"p","該当する項目はありません。").className="explorer-empty"),S.scrollTop=k,v&&Array.from(S.querySelectorAll("[data-explorer-key]")).find(H=>H.dataset.explorerKey===v)?.focus({preventScroll:!0})}function Ci(v){_t=v,Dt(),He(),(v?s.querySelector(".shell-heading button"):w).focus({preventScroll:!0})}w.addEventListener("click",v=>{v.preventDefault(),v.stopImmediatePropagation(),Ci(!_t)},!0),s.querySelector(".shell-heading button").onclick=()=>Ci(!1),E.oninput=()=>{Sn.clear(),St()},s.addEventListener("keydown",v=>{if(v.key==="Escape"&&!v.defaultPrevented&&b.hidden&&(v.preventDefault(),v.stopPropagation(),Ci(!1)),(v.key==="ArrowDown"||v.key==="ArrowUp")&&S.contains(document.activeElement)){const k=Array.from(S.querySelectorAll("button")).filter(V=>!V.disabled&&!V.closest("[hidden]")),M=k.indexOf(document.activeElement),O=k[M+(v.key==="ArrowDown"?1:-1)];O&&(v.preventDefault(),O.focus())}}),y.addEventListener("click",v=>{oe!=="business"&&(v.preventDefault(),v.stopImmediatePropagation(),(oe==="concept"||oe==="states"||oe==="tests"&&Ee(Te)?.capability.testSpecification)&&(gt.setOpen(!gt.isOpen()),Dt(),He(),Ze(!1)))},!0),A.querySelector(".shell-heading button").onclick=()=>{gt.setOpen(!1),Dt(),He(),Ze(!1),y.focus({preventScroll:!0})},m.querySelector(".shell-heading button").onclick=()=>{gt.setOpen(!1),Dt(),He(),Ze(!1),y.focus({preventScroll:!0})},window.addEventListener("message",v=>{if(v.origin!==location.origin&&!(location.protocol==="file:"&&v.origin==="null"))return;const k=Array.from(Ot).find(([,O])=>v.source===O.contentWindow);if(!k)return;if(v.data?.type==="alder-concept-rendered"){k[1].contentDocument&&(Ys(k[1].contentDocument),Qs(k[1].contentDocument));return}if(oe!=="concept"||k[0]!==K)return;const M=_(K);if(v.data?.type==="alder-concept-clear-selection"){M&&Hs(!0);return}if(v.data?.type==="alder-concept-subsystem"){if(!So(K)?.regions.some(O=>O.id===v.data.id))return;mt.delete(K),kn.delete(K),In.set(K,v.data.id),ji(),Dt(),He();return}if(!(!Y.includes(v.data?.id)||M&&!M.concepts[v.data?.id])){if(v.data.type==="alder-concept-open"){Tt(B(v.data.id));return}v.data.type==="alder-concept-select"&&(In.delete(K),mt.set(K,v.data.id),(typeof v.data.viewId=="string"?So(K)?.tables[v.data.viewId]:void 0)?.conceptId===v.data.id?kn.set(K,v.data.viewId):kn.delete(K),innerWidth<=800&&(_t=!1),ji(),Dt(),He())}});function _s(){const v=getComputedStyle(document.documentElement);for(const k of Ot.values()){const M=k.contentDocument?.documentElement;if(M){M.dataset.theme=document.documentElement.dataset.theme??"light";for(const O of["--bg","--panel","--fg","--line","--subtle","--select"])M.style.setProperty(O,v.getPropertyValue(O))}}}function Dt(){!b.hidden&&oe==="business"&&(_t=!0),s.hidden=!_t,w.disabled=!1,w.setAttribute("aria-controls","design-explorer"),w.setAttribute("aria-label","ナビゲーションを開閉"),w.setAttribute("aria-expanded",String(_t));const v=gt.isReady?.()??!0;A.hidden=oe!=="concept"||!We||!v||!gt.isOpen();const k=!!Ee(Te)?.capability.testSpecification;m.hidden=!(oe==="states"||oe==="tests"&&k)||!v||!gt.isOpen(),xi&&oe!=="business"&&(xi.hidden=!0),oe==="concept"?(y.disabled=!We||!v,y.setAttribute("aria-controls","concept-related-panel"),y.setAttribute("aria-label","データ構造の情報を開閉"),y.setAttribute("aria-expanded",String(!A.hidden))):oe==="business"?y.setAttribute("aria-controls","formattedMarkdownDrawer"):oe==="states"||oe==="tests"&&k?(y.disabled=!v,y.setAttribute("aria-controls","test-related-panel"),y.setAttribute("aria-label","関連資料を開閉"),y.setAttribute("aria-expanded",String(!m.hidden))):(oe==="tests"||oe==="empty")&&(y.disabled=!0,y.setAttribute("aria-expanded","false"));const M=i.querySelector("#document-actions");M&&(M.hidden=oe!=="business");const O=i.querySelector("#document-actions-toggle");O&&oe!=="business"&&(O.hidden=!0),_s(),Oo()}function Oo(){const v=i.getBoundingClientRect().bottom;v>0&&e.style.setProperty("--shell-content-top",v+"px")}if(typeof ResizeObserver<"u"){const v=new ResizeObserver(Oo);v.observe(i),v.observe(e.querySelector("header"))}window.addEventListener("resize",Oo);function Ks(){dn(),Ei=!0;try{const v=new URL(location.href).searchParams;if(oe==="concept"&&v.get("view")==="concept"&&v.get("concept")===K&&!ze.has(K)&&ie(K,v.get("dataExample"))&&Xe.set("drawer-overview:"+K,A.querySelector(".concept-drawer-body").scrollTop),We||(jt.clear(),ze.clear(),cn.clear(),st=[],K="overview",x.removeAttribute("src"),x.removeAttribute("srcdoc")),v.get("view")==="concept"){const k=We&&ae.includes(v.get("concept")??"")?v.get("concept"):"landscape",M=v.get("dataExample");We&&_(k)&&v.get("dataView")==="overview"&&!ie(k,M)?(jt.add(k),ze.delete(k)):(jt.delete(k),We&&ie(k,M)?(ze.set(k,M),cn.set(k,M)):ze.delete(k)),Tt(k,!1)}else if(v.get("view")==="states")t.business().states?.some(k=>k.id===v.get("state"))?Nn(v.get("state"),!1):Pn();else if(v.get("view")==="tests"){const k=vo(v.get("spec")??"@overview"),M=v.get("dataExample"),O=Ee(k);O&&M&&O.samples.some(V=>V.id===M)?kt.set(k,M):O&&kt.delete(k),qt(k,!1)}else if(v.get("view")==="empty")It("empty");else if(It("business"),t.business().key){const k=v.get("activity"),M=v.get("object"),O=t.business(),V=O.views?.find(X=>X.key===O.viewKey);k&&O.activities.some(X=>X.id===k)?V?.activity!==k&&t.openActivity(k):M&&O.objects?.some(X=>X.id===M)?V?.object!==M&&t.openObject(M):(wt=!1,(!V||V.activity!==void 0||V.object!==void 0)&&t.openOverview())}Ct(),St()}finally{Ei=!1}}return window.addEventListener("popstate",Ks),{closeBusinessOverview:ec,reopenBusinessOverview(){wt=!1},activateBusiness(){It("business")},businessActivated(){It("business"),Ct(),St(),Ze()},syncChrome:Dt,appendActivityTestLinks(v,k){Ka(v,k),ko(v,Vs(k))},openRelatedChecks(v){Ke.add("tests"),qt(v&&Ge(v)?"checks:"+v:"@overview")},syncDocument(){const v=t.business(),k=v.concept,M=!!(Ln&&v.key!==Ln||Oi&&Qn&&v.key&&v.key!==Qn),O=C?.model!==k?.model||C?.business!==k?.business;if((M||O&&C)&&(h.querySelector(".test-spec-page").replaceChildren(),m.querySelector(".spec-related-content").replaceChildren(),A.querySelector(".concept-related-content").replaceChildren(),wt=!1,st=[],rt=[],vt=[],K="overview",yt="",Te="@overview",kt.clear(),Xe.clear(),jt.clear(),ze.clear(),cn.clear(),Qa(),oe!=="business"&&It("business"),M&&!Oi&&Ze(!1)),O){C=k,J=k?Vc(k):void 0,U=k?Qc(k):void 0,Z=k?Hc(k):void 0,We=!!k,te=J?.tables??{},Y=Object.keys(te);const V=J?.groups.map(G=>G.id)??[],X=new Set([...Tn,"subsystems"]);if(ye=new Map(V.map(G=>[G,X.has(G)||Y.includes(G)?"group:"+G:G])),Ie=new Map(Y.map(G=>[G,X.has(G)||V.includes(G)?"concept:"+G:G])),me=new Map([...ye].map(([G,Q])=>[Q,G])),he=new Map([...Ie].map(([G,Q])=>[Q,G])),ae=[...Tn,...me.keys(),...he.keys()],Array.isArray(Oe?.expanded)&&Oe.expandedVersion!==4){Ke.add("subsystems"),Ke.add("concept-relations");for(const G of k?.model.subsystems??[])Ke.add("subsystem-"+G.id)}}if(Ln=v.key,rt=rt.filter(V=>v.states?.some(X=>X.id===V)),oe==="business"&&wt&&v.views?.find(V=>V.key===v.viewKey)?.activity===void 0&&v.views?.find(V=>V.key===v.viewKey)?.object===void 0&&Pn(),Oi&&v.key){if(Ga(),Qn===v.key){Array.isArray(Oe?.specs)&&(vt=[...new Set(Oe.specs.filter(V=>typeof V=="string").map(V=>vo(V)))]);for(const[V,X]of Object.entries(Oe?.specExamples??{})){const G=Ee(V);typeof X=="string"&&G?.capability.samples.some(Q=>Q.id===X)&&kt.set(V,X)}}Oi=!1,Ks()}St(),Ct(),Dt(),M&&He()}}}class Ho{tabs=new WeakMap;router;constructor(t=To){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,i,o,r){const s=JSON.stringify([i.map(g=>[g.id,g.width,g.height]),o.map(g=>[g.kind,g.from,g.to,g.label]),r]),d=this.tabs.get(t),a=!d||d.design!==n||d.structure!==s,l=new Set(i.filter(g=>{const c=d?.nodes.get(g.id);return!c||c.x!==g.x||c.y!==g.y}).map(g=>g.id)),u=new Set(i.map(g=>g.id)),p=a?new Array(o.length):d.routes.slice();if(o.forEach((g,c)=>{!a&&!l.has(g.from)&&!l.has(g.to)||(p[c]=u.has(g.from)&&u.has(g.to)?this.router({from:g.from,to:g.to,index:c,nodes:i,kind:g.kind,matrix:r?.[c],labels:r?.[c]?[]:[...p.flatMap((h,m)=>h&&m<c?[{id:String(m),x:h.label[0]-Math.max(30,o[m].label.length*12)/2,y:h.label[1]-9,width:Math.max(30,o[m].label.length*12),height:18}]:[])],wires:r?.[c]?[]:p.flatMap((h,m)=>h&&m<c?[h.points]:[]),labelWidth:Math.max(30,g.label.length*12),labelHeight:18}):void 0)}),r){const g=[],c=new Map,h=p.map((m,f)=>f).sort((m,f)=>Number(r[m].returning)-Number(r[f].returning));for(const m of h){const f=p[m];if(!f)continue;const b=i.find(x=>x.id===o[m].from),w=Math.max(30,o[m].label.length*12),y=r[m].returning?[Math.max(...f.points.map(x=>x[0]))+8+w/2,f.points[0][1]]:[b.x+b.width*.125+8+w/2,dc(b.y+b.height,r[m].captionLane*Vr)+9],E=Fr(o[m],m,r[m]),S=c.get(E)??qo(y,w,18,i,g);(S[0]!==f.label[0]||S[1]!==f.label[1])&&(p[m]={...f,label:S}),c.has(E)||(c.set(E,S),g.push({id:String(m),x:S[0]-w/2,y:S[1]-9,width:w,height:18}))}}return this.tabs.set(t,{design:n,structure:s,nodes:new Map(i.map(g=>[g.id,{...g}])),routes:p}),p}}function dl(e,t,n,i){const o=(p,g,c)=>(g[0]-p[0])*(c[1]-p[1])-(g[1]-p[1])*(c[0]-p[0]),r=o(e,t,n),s=o(e,t,i),d=o(n,i,e),a=o(n,i,t),l=1e-6;if(r*s<-l&&d*a<-l)return!0;if(Math.max(Math.abs(r),Math.abs(s),Math.abs(d),Math.abs(a))>l)return!1;const u=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[u],t[u]),Math.max(n[u],i[u]))-Math.max(Math.min(e[u],t[u]),Math.min(n[u],i[u]))>.1}function ll(e,t,n,i,o=[]){const r=e.x+e.width,s=24,d=e.y+e.height,a=r-8-(2*(n.count-n.index)-1)*s,l=t.filter(w=>w.id!==e.id);let u;for(const w of[0,-24,24,-48,48,-72,72])for(const y of[0,16,32,64,128,256]){const E=[a+w,d],S=[E[0]+s,d];if(E[0]<e.x+8||S[0]>r-8)continue;const x=d+n.depth+y,A=Math.min(12,(S[0]-E[0])/2,(x-d)/2),L=[E];let $=`M${E}`;const N=U=>{$+=` L${U}`,L.push(U)},D=(U,Z)=>{const te=L.at(-1);$+=` Q${U} ${Z}`;for(let Y=1;Y<=4;Y++){const ae=Y/4,me=1-ae;L.push([me*me*te[0]+2*me*ae*U[0]+ae*ae*Z[0],me*me*te[1]+2*me*ae*U[1]+ae*ae*Z[1]])}};N([E[0],x-A]),D([E[0],x],[E[0]+A,x]),N([S[0]-A,x]),D([S[0],x],[S[0],x-A]),N(S);const C=lc(L,l,.3),J=o.filter(U=>L.slice(1).some((Z,te)=>U.slice(1).some((Y,ae)=>dl(L[te],Z,U[ae],Y)))).length;if((!u||C<u.collisions||C===u.collisions&&J<u.wireCollisions)&&(u={path:$,points:L,collisions:C,wireCollisions:J,low:x,extra:y,shift:w}),C===0&&J===0)break}const{path:p,points:g,collisions:c,wireCollisions:h,low:m,extra:f,shift:b}=u;return{path:p,points:g,label:[Math.max(r+8,n.labelLeft)+i/2,m],bounds:{right:Math.max(...g.map(w=>w[0])),bottom:Math.max(...g.map(w=>w[1]))},collisions:c+h,rerouted:f>0||b!==0,fallback:c+h>0}}function ul(e,t=ls()){const n="http://www.w3.org/2000/svg",i=(q,B={})=>{const _=document.createElementNS(n,q);for(const[be,ie]of Object.entries(B))_.setAttribute(be,ie);return _},o={"@new":"作成前","@none":"作成なし","@unknown":"未決"},r=e.transitions.map(q=>[q]),s=[...new Set(["@new",...e.states,...r.map(q=>q[0].to)])],d={nodes:s.map(q=>({id:q,type:"business",name:o[q]??q,scope:!0})),relations:r.map(([q])=>({kind:q.path==="exception"?"business-exception":"input",from:q.from,to:q.to,label:q.id+"："+q.activity+"："+q.condition}))},a=fs(d,s),l=q=>{const B=Array.from(q);return Array.from({length:Math.ceil(B.length/28)},(_,be)=>B.slice(be*28,(be+1)*28).join(""))},u=r.map(([q])=>({from:q.from,activity:q.activity,rows:[q],lines:[],lineRows:[],offset:0,width:0,height:0})),p=new Map;for(const[q,B]of u.entries()){const _=B.rows[0],be=e.transitions.filter(ce=>ce.from===_.from&&(ce.activityId??ce.activity)===(_.activityId??_.activity)&&ce.path===_.path&&(_.path!=="exception"||(ce.exception??"例外名未定義")===(_.exception??"例外名未定義"))),ie=be.map(ce=>(ce.conditionLabel??ce.condition).trim().replace(/\s+/g," ")),Ce=new Set(ie).size===be.length?_.conditionLabel??_.condition:_.condition,ke=[_.path==="exception"?"例外："+(_.exception??"例外名未定義"):"",...be.length>1||_.path==="normal"&&_.conditionLabel?[Ce]:[]].filter(Boolean).join("：");B.lines=l(B.activity+(ke?"（"+ke+"）":"")),B.lineRows=B.lines.map(()=>B.rows),B.width=Math.max(...B.lines.map(ce=>Array.from(ce).length*14)),B.height=B.lines.length*18,a.wires[q].returning||(B.offset=p.has(B.from)?p.get(B.from)+8:0,p.set(B.from,B.offset+B.height))}const g=new Map;r.forEach(([q],B)=>{if(q.from===q.to){const _=g.get(q.from)??[];_.push(B),g.set(q.from,_)}});const c=new Map,h=new Map;for(const[q,B]of g){let _=0;for(const ie of[...B].reverse())c.set(ie,{leader:B[0],index:0,count:1,depth:0,offset:_}),_+=u[ie].height+8;const be=24+Math.max(0,_-8)+8;h.set(q,be);for(const ie of B)c.get(ie).depth=be}const m=q=>44,f=s.slice().sort((q,B)=>a.positions[q][1]-a.positions[B][1]);let b=Math.max(40,...u.map((q,B)=>a.wires[B].returning&&q.from===f[0]?16+q.height/2-44*(a.wires[B].fromPort??.5):40));const w=new Map;for(const q of f){const B=m(),_=(p.get(q)??0)+(h.get(q)??0);w.set(q,b),b+=uc(B,_)}const y=s.map(q=>({id:q,x:t.positions.get(q)?.[0]??a.positions[q][0],y:t.positions.get(q)?.[1]??w.get(q),width:Math.max(104,Array.from(o[q]??q).length*14+32),height:m()})),E=i("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),S=i("title");S.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(s.includes("@none")?"作成なしはこの操作の処理結果。":"")+(s.includes("@unknown")?"未決は設計課題。":""),E.append(S),E.append(us("state-transition-"));const x=new Map,A=[],L=[];let $=t.selected;const N=q=>{$=q,t.selected=q;const B=Ui(e.transitions,$);for(const[ie,Ce]of x)Ce.setAttribute("class","node graph-shape state-shape"+B.nodeClasses(ie)),Ce.setAttribute("aria-pressed",String(ie===$));A.forEach(({element:ie,rows:Ce})=>{const Pe=Ce[0].from===Ce[0].to;ie.setAttribute("class","edge"+(Pe?" state-self-loop":Ce[0].path==="exception"?" exception":"")+B.labelClasses(Ce)),ie.setAttribute("marker-end","url(#state-transition-"+(Ce.some(B.related)?"related-arrow":"arrow")+")")});for(const ie of L)ie.element.setAttribute("class","state-caption-line"+B.labelClasses(ie.rows));E.querySelectorAll("[data-exception-paint]").forEach(ie=>ie.remove());const _=Array.from(E.children).find(ie=>ie.matches(".state-diagram-edge-label,[data-state]"))??null,be=[...A].sort((ie,Ce)=>Number(ie.rows.some(B.related))-Number(Ce.rows.some(B.related)));for(const{element:ie}of be)if(E.insertBefore(ie,_),ie.classList.contains("exception")||ie.classList.contains("state-self-loop")){const Ce=E.children.length;ps(E,ie,{path:ie.getAttribute("d")},{"data-transitions":ie.getAttribute("data-transitions")});for(const Pe of Array.from(E.children).slice(Ce))E.insertBefore(Pe,_)}E.querySelectorAll(".state-diagram-edge-label").forEach(ie=>E.append(ie))};E.addEventListener("click",q=>{q.target===E&&N()}),E.addEventListener("keydown",q=>{q.key==="Escape"&&(q.preventDefault(),N())});const D=a.wires.map((q,B)=>({...q,captionLane:(u[B].offset+(h.get(u[B].from)??0))/Vr})),C=d.relations.map((q,B)=>({...q,label:String(B).padEnd(Math.ceil(u[B].width/12),"x")})),J=[...c].map(([q,B])=>{const _=y.find(ie=>ie.id===r[q][0].from),be=u[q];return{x:_.x+_.width+8,y:_.y+_.height+24+B.offset,width:be.width,height:be.height}});let U=new Ho().update({},e,y,C,D);for(let q=0;q<=J.length;q++){let B=!1,_=0;if(U.forEach((be,ie)=>{if(!be||c.has(ie)||!D[ie].returning)return;let Ce=0;for(const Pe of J)for(let ke=1;ke<be.points.length;ke++){const ce=be.points[ke-1],Ee=be.points[ke];if(Math.abs(ce[0]-Ee[0])>1e-7||Math.abs(ce[1]-Ee[1])<2)continue;const Ve=ce[0];if(Ve<Pe.x-4||Ve>Pe.x+Pe.width+4||Math.max(ce[1],Ee[1])<Pe.y-4||Math.min(ce[1],Ee[1])>Pe.y+Pe.height+4)continue;const Ge=Pe.x+Pe.width+12-Ve;Ge>0&&(Ce=Math.max(Ce,Ge))}Ce&&(D[ie]={...D[ie],returnLane:(D[ie].returnLane??0)+Math.ceil(Ce/16)+_++},B=!0)}),!B)break;U=new Ho().update({},e,y,C,D)}const Z=U.flatMap((q,B)=>q&&!c.has(B)?[q.points]:[]),te=new Map,Y=U.map((q,B)=>{const _=c.get(B);if(!_)return q;const be=r[B][0].from,ie=y.find(Ge=>Ge.id===be),Ce=U.flatMap((Ge,Jt)=>Ge&&!c.has(Jt)?[Ge.points]:[]),Pe=Math.max(30,C[B].label.length*12),ke=u[B];let ce=te.get(_.leader);ce||(ce=ll(ie,y,{..._,labelLeft:ie.x+ie.width+8},Pe,Z),te.set(_.leader,ce),Z.push(ce.points));const Ee=Ce.flatMap((Ge,Jt)=>Ge.slice(1).map((wn,an)=>({id:`${Jt}:${an}`,x:Math.min(Ge[an][0],wn[0])-2,y:Math.min(Ge[an][1],wn[1])-2,width:Math.abs(Ge[an][0]-wn[0])+4,height:Math.abs(Ge[an][1]-wn[1])+4}))),Ve=qo([ie.x+ie.width+8+ke.width/2,ie.y+ie.height+24+_.offset+ke.height/2],ke.width,ke.height,[...y,...Ee]);return{...ce,label:[Ve[0]-ke.width/2+Pe/2,Ve[1]]}}),ae=new Array(r.length),me=[],he=r.map((q,B)=>B).sort((q,B)=>Number(D[q].returning)-Number(D[B].returning));for(const q of he){const B=Y[q],_=u[q],be=Math.max(30,C[q].label.length*12);let ie=[B.label[0]-be/2+_.width/2,B.label[1]+(D[q].returning?0:_.height/2-9)];const Ce=y.find(ce=>ce.id===r[q][0].from),Pe=y.find(ce=>ce.id===r[q][0].to);if(!c.has(q)&&D[q].returning&&Pe&&Pe.y>Ce.y){const ce=B.points.slice(1).map((Ee,Ve)=>[B.points[Ve],Ee]).filter(([Ee,Ve])=>Math.abs(Ee[0]-Ve[0])<.01&&Ve[1]-Ee[1]>24).sort(([Ee,Ve],[Ge,Jt])=>Jt[1]-Ge[1]-(Ve[1]-Ee[1]))[0];if(ce){const[Ee,Ve]=ce;ie=[Ee[0]+8+_.width/2,Ee[1]+Math.min(24+_.height/2,(Ve[1]-Ee[1])/2)]}}const ke=qo(ie,_.width,_.height,y,me);ae[q]=ke,me.push({id:String(q),x:ke[0]-_.width/2,y:ke[1]-_.height/2,width:_.width,height:_.height})}let ye=Math.max(...y.map(q=>q.x+q.width))+40,Ie=Math.max(...y.map(q=>q.y+q.height))+40;r.forEach((q,B)=>{const _=c.get(B);if(_&&_.leader!==B)return;const be=_?r.flatMap((ce,Ee)=>c.get(Ee)?.leader===B?ce:[]):q,ie=be[0],Ce=Y[B],Pe=i("path",{d:Ce.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":be.map(ce=>ce.id).join(" ")});(_||ie.path==="exception")&&Pe.setAttribute("stroke-dasharray","6 5");const ke=i("title");ke.textContent=be.map(ce=>`${ce.id} ${ce.activity} / ${ce.path==="normal"?"通常":"例外："+(ce.exception??"例外名未定義")}：${ce.condition}`).join(" / "),Pe.append(ke),E.append(Pe),A.push({element:Pe,rows:be}),ye=Math.max(ye,Ce.bounds.right+40),Ie=Math.max(Ie,Ce.bounds.bottom+40)});for(const[q,B]of u.entries()){const _=ae[q],be=_[0]-B.width/2,ie=_[1]-B.height/2+14;E.append(i("rect",{x:String(be),y:String(ie-14),width:String(B.width),height:String(B.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const Ce=i("text",{x:String(be),y:String(ie),class:"state-diagram-edge-label","data-activity":B.activity,"data-transition-id":B.rows[0].id,"aria-label":B.lines.join("")});B.lines.forEach((Pe,ke)=>{const ce=i("tspan",{x:String(be),dy:ke?"18":"0","font-size":"14","font-weight":"600"});ce.textContent=Pe,ce.setAttribute("data-transitions",B.lineRows[ke].map(Ee=>Ee.id).join(" ")),L.push({element:ce,rows:B.lineRows[ke]}),Ce.append(ce)}),E.append(Ce),ye=Math.max(ye,be+B.width+24),Ie=Math.max(Ie,ie+B.height+24)}for(const q of y){const B=q.id.startsWith("@"),_=i("g",{role:"button",tabindex:"0","aria-label":o[q.id]??q.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":q.id,"data-node":q.id});_.append(zr(document,q,B)),_.append(i("rect",{x:String(q.x),y:String(q.y),width:String(q.width),height:String(q.height),rx:B?"20":"8",class:B?"state-diagram-node state-note":"state-diagram-node"}));const be=i("text",{x:String(q.x+q.width/2),y:String(q.y+q.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(be.textContent=o[q.id]??q.id,_.append(be),B&&q.id!=="@new"){const ie=i("text",{x:String(q.x+q.width/2),y:String(q.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});ie.textContent=q.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",_.append(ie)}_.addEventListener("click",()=>N(q.id)),_.addEventListener("keydown",ie=>{(ie.key==="Enter"||ie.key===" ")&&(ie.preventDefault(),N(q.id))}),x.set(q.id,_),E.append(_)}return N(t.selected),E.setAttribute("viewBox",`0 0 ${ye} ${Ie}`),E.style.minWidth=`${ye}px`,E}const dr=new WeakMap;function pl(e,t,n){const i=e.objectStateTransitions?.[t];if(!i||!e.graph.nodes.some(m=>m.id===t&&m.type==="object"))return;const o=document.createElement("section");o.className="state-transition-panel",o.setAttribute("aria-label","状態遷移");const r=(m,f,b=o)=>{const w=document.createElement(m);return w.textContent=f,b.append(w),w};if(i.error)return r("p","状態遷移を表示できません："+i.error).setAttribute("role","status"),o;const s=i.model;for(const m of s.transitions){if(!e.graph.nodes.some(f=>f.id===m.activity&&f.type==="business"))return r("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),o;if(m.exceptionId){const f=e.model?.business.exceptions?.find(b=>b.id===m.exceptionId);if(!f||f.activityId!==m.activity)return r("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),o}}const d=dr.get(e)??new Map;dr.set(e,d);const a=d.get(t)??ls();d.set(t,a);const l={...s,transitions:s.transitions.map(m=>({...m,activityId:m.activity,activity:e.graph.nodes.find(f=>f.id===m.activity)?.name??m.activity}))};o.append(Wr(document,m=>ul(l,m),a));const u=m=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[m]??m,p={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},g=document.createElement("details");r("summary",`操作の詳細（${s.transitions.length}）`,g);const c=document.createElement("ol");g.append(c),o.append(g);for(const m of s.transitions){const f=document.createElement("li");f.dataset.transition=m.id,r("h3",`${m.id} · ${u(m.from)} → ${u(m.to)}`,f),m.path==="exception"&&r("p","例外名："+(m.exception??"未定義"),f),r("p",`${p[m.effect]} · ${m.path==="normal"?"正常":"例外"}`,f);const b=e.graph.nodes.find(w=>w.id===m.activity&&w.type==="business");if(b){const w=document.createElement("button");w.type="button",w.textContent=b.name,w.onclick=()=>n(b.id),f.append(w)}else r("p","要確認：根拠Activityが見つかりません — "+m.activity,f);r("p","条件："+m.condition,f),r("p",m.note,f),r("p","根拠："+m.evidence,f),c.append(f)}s.transitions.length||r("p","明示された操作はありません。");const h=document.createElement("details");return r("summary","宣言の出典",h),r("p",s.source,h),o.append(h),o}const lr=64,fl=96,ml=260,ur=40,hl=4;function bl(e,t,n=!0){const{nodes:i,previous:o,children:r,parents:s,forwardRelations:d,feedbackRelations:a,exceptionRelations:l}=pc(e,t),u=s.map(S=>S.length),p=i.map(()=>0),g=i.flatMap((S,x)=>u[x]===0?[x]:[]);for(let S=0;S<g.length;S++)for(const x of r[g[S]])p[x]=Math.max(p[x],p[g[S]]+1),--u[x]===0&&g.push(x);const c=Array.from({length:p.reduce((S,x)=>Math.max(S,x),0)+1},()=>[]);i.forEach((S,x)=>c[p[x]].push(x));const h=i.map(()=>0),m=S=>S.forEach((x,A)=>h[x]=A);c.forEach(m);for(let S=0;S<hl;S++){const x=S%2?[...c].reverse():c;for(const A of x){const L=new Map(A.map($=>{const N=S%2?r[$]:s[$];return[$,N.length?N.reduce((D,C)=>D+h[C],0)/N.length:h[$]]}));A.sort(($,N)=>L.get($)-L.get(N)||$-N),m(A)}}const f=c[0].filter(S=>i[S].type==="object"&&o[S].length===0&&r[S].length>0);if(n&&f.length>1){const S=new Set(f),x=c[0].filter(A=>!S.has(A));c.splice(0,1,...f.map((A,L)=>L===0?[...x,A]:[A]))}const b=Object.create(null),w=i.map(()=>0),y=[],E=Math.ceil(ml/lr)-1;for(let S=0;S<c.length;S++){const x=new Map;for(const $ of y)for(const N of $)x.set(N,N+1);const A=$=>{let N=$;for(;x.has(N);)N=x.get(N);let D=$;for(;x.has(D);){const C=x.get(D);x.set(D,N),D=C}return N},L=[];for(const $ of c[S]){let N=S;for(const C of s[$])N=Math.max(N,w[C]+1);const D=A(N);w[$]=D,x.set(D,D+1),L.push(D),b[i[$].id]=[ur+S*lr,ur+D*fl]}y.push(L),y.length>E&&y.shift()}return{positions:b,forwardRelations:d,feedbackRelations:a,exceptionRelations:l}}function gl(e,t){return Br(e)?fs(e,t).positions:bl(e,t).positions}const pr=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const r=n[o].codePointAt(0)-i[o].codePointAt(0);if(r)return r}return n.length-i.length};function ra(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,i)=>pr(n.name,i.name)),relations:[...e.relations].sort((n,i)=>{for(const o of["kind","from","to","label"]){const r=pr(o==="from"||o==="to"?t.get(n[o]):n[o],o==="from"||o==="to"?t.get(i[o]):i[o]);if(r)return r}return 0})}}function aa(e){const t=ra(e.graph),n=new Map(t.nodes.map(o=>[o.id,o.name])),i=new Map(t.nodes.map(o=>[o.name,o.id]));return{graph:{...t,nodes:t.nodes.map(o=>({...o,id:o.name})),relations:t.relations.map(o=>({...o,from:n.get(o.from),to:n.get(o.to)}))},order:e.activityOrder?.map(o=>n.get(o)),restore:o=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(o).map(([r,s])=>[i.get(r),s])))}}function ca(e){const t=aa(e);return t.restore(gl(t.graph,t.order))}function yl(e){const t=aa(e),n=fs(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function da(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,i]=t;return{database:`alder-web-viewer:preview:pr-${n}:${i}`,pr:n,version:i}}function vl(e,t){if(!e)return!1;const n=r=>"format"in r?!!r.document?.handle||r.recovery.some(s=>s.handle!==void 0):r.tabs.some(s=>s.handle!==void 0);if(n(e)||n(t))return!1;const i=new Set;function o(r,s){if(Object.is(r,s))return!0;if(!r||!s||typeof r!="object"||typeof s!="object"||i.has(r)||i.has(s))return!1;const d=c=>Array.isArray(c)||Object.getPrototypeOf(c)===null||Object.getPrototypeOf(c)?.constructor?.name==="Object";if(!d(r)||!d(s)||Array.isArray(r)!==Array.isArray(s)||Array.isArray(r)&&r.length!==s.length)return!1;i.add(r),i.add(s);const a=r,l=s,u=Object.keys(a),p=Object.keys(l),g=u.length===p.length&&u.every(c=>Object.hasOwn(l,c)&&o(a[c],l[c]));return i.delete(r),i.delete(s),g}return o(e,t)}function Xn(e,t){const n=new Set(t.graph.nodes.map(r=>r.id)),i=Object.create(null);for(const[r,s]of Object.entries(e.positions))n.has(r)&&(i[r]=[...s]);const o=t.graph.nodes.filter(r=>!i[r.id]);if(o.length){const r=ca(t),s=Object.values(i);for(const d of o){const a=[...r[d.id]];for(;s.some(l=>Math.abs(l[0]-a[0])<280&&Math.abs(l[1]-a[1])<88);)a[1]+=180;i[d.id]=a,s.push(a)}}return{...e,design:t,positions:i,hiddenNodes:e.hiddenNodes?.filter(r=>n.has(r)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function la(){return new Promise((e,t)=>{const n=indexedDB.open(da(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class ks extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let Bi;function ua(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function wl(e){const t=Bi;if(t===void 0)throw Error("Session has not been loaded");const n=await la();try{await new Promise((i,o)=>{const r=n.transaction("session","readwrite"),s=r.objectStore("session"),d=s.get("generation"),a=s.get("current"),l=s.get("readonly-legacy");let u,p;l.onsuccess=()=>{try{const g=ua(d.result);if(vl(a.result,e)){p=g;return}if(g!==t)throw new ks;if(p=t+1,!Number.isSafeInteger(p))throw Error("Session generation exhausted");l.result===void 0&&Il(a.result)&&s.put(a.result,"readonly-legacy"),s.put(e,"current"),s.put(p,"generation")}catch(g){u=g,r.abort()}},r.oncomplete=()=>{Bi=p,i()},r.onerror=()=>o(u??r.error??Error("Session save failed")),r.onabort=()=>o(u??r.error??Error("Session save aborted"))})}finally{n.close()}}async function kl(){Bi=void 0;const e=await la();try{return await new Promise((t,n)=>{const i=e.transaction("session"),o=i.objectStore("session"),r=o.get("current"),s=o.get("generation");i.oncomplete=()=>{try{Bi=ua(s.result),t(r.result)}catch(d){n(d)}},i.onerror=()=>n(i.error),i.onabort=()=>n(i.error??Error("Session load aborted"))})}finally{e.close()}}function Il(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const fr=new WeakMap;function Sl(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(u=>u.id===t&&u.type==="business"))throw Error("Unknown Activity: "+t);let i=fr.get(e);i||(i=new Map,fr.set(e,i));const o=i.get(t);if(o)return o;const r=new Set(e.graph.nodes.filter(u=>u.type==="object").map(u=>u.id)),s=new Set(e.graph.nodes.filter(u=>u.type==="business").map(u=>u.id)),d=e.graph.relations.filter(u=>u.kind==="input"&&u.to===t&&r.has(u.from)||u.kind==="output"&&u.from===t&&r.has(u.to)||u.kind==="business-exception"&&(u.from===t&&s.has(u.to)||u.to===t&&s.has(u.from))),a=new Set([t,...d.flatMap(u=>[u.from,u.to])]),l={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(u=>a.has(u.id)),relations:d},activityOrder:(e.activityOrder??e.graph.nodes.filter(u=>u.type==="business").map(u=>u.id)).filter(u=>a.has(u))};return i.set(t,l),l}const mr=new WeakMap;function xl(e,t){if(!e.graph.nodes.find(p=>p.id===t&&p.type==="object"))throw Error("Unknown Object: "+t);let i=mr.get(e);i||(i=new Map,mr.set(e,i));const o=t,r=i.get(o);if(r)return r;const s=new Set(e.graph.nodes.filter(p=>p.type==="object").map(p=>p.id)),d=new Set(e.graph.nodes.filter(p=>p.type==="business").map(p=>p.id)),a=e.graph.relations.filter(p=>p.kind==="input"&&p.from===t&&d.has(p.to)||p.kind==="output"&&p.to===t&&d.has(p.from)||p.kind==="object-exception"&&(p.from===t&&s.has(p.to)||p.to===t&&s.has(p.from))),l=new Set([t,...a.flatMap(p=>[p.from,p.to])]),u={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(p=>l.has(p.id)),relations:a},activityOrder:(e.activityOrder??e.graph.nodes.filter(p=>p.type==="business").map(p=>p.id)).filter(p=>l.has(p))};return i.set(o,u),u}const pa=new WeakMap;function tn(e){return pa.get(e)}const fa=["design","checks","source","draft","edited","handle"];function Al(e){return{key:e.key,name:e.name,...Object.fromEntries(fa.map(t=>[t,e[t]]))}}function Ut(e){const{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:r,selectedEdgesOnly:s,viewInset:d,canvasOrigin:a,scroll:l,zoom:u}=e;return{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:r,selectedEdgesOnly:s,viewInset:d,canvasOrigin:a,scroll:l,zoom:u,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function no(e,t){const n=t;pa.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const i=t.activity??t.object;return i===void 0?"全体図":e.design.graph.nodes.find(o=>o.id===i)?.name??i}});for(const i of fa)Object.defineProperty(n,i,{configurable:!0,get:()=>e[i],set:o=>{e[i]=o}});return n}function Gi(e){return e.activity}function Hi(e){return e.object}function li(e){return e.activity??e.object}function io(e){return e.object===void 0?Sl(e.design,e.activity):xl(e.design,e.object)}function oo(e){const t=io(e),n=Xn({...e},t);if(e.hiddenNodes!==void 0){const i=new Set([...e.design.graph.nodes,...t.graph.nodes].map(o=>o.id));n.hiddenNodes=e.hiddenNodes.filter(o=>i.has(o))}return n}function Vt(e,t=[],n,i){const o=n??(e.tabs[0]?Al(e.tabs[0]):void 0),r=o?(i??[e.tabs[0]?Ut(e.tabs[0]):{key:o.key,positions:{},scroll:[0,0],zoom:1}]).map(g=>{const c=no(o,g);return Object.assign(g,Ut(oo(c))),c}):[],{dark:s,drawer:d,width:a,preferWrite:l,nodeDrawer:u,sampleLayout:p}=e;return{dark:s,drawer:d,width:a,preferWrite:l,nodeDrawer:u,sampleLayout:p,document:o,tabs:r,recovery:t,urlHistory:e.urlHistory??[...o?.source?.kind==="url"?[{url:o.source.url,name:o.name}]:[],...t.filter(g=>g.source?.kind==="url").map(g=>({url:g.source.url,name:g.name}))].filter((g,c,h)=>h.findIndex(m=>m.url===g.url)===c),legacyViews:e.legacyViews,active:r.some(g=>g.key===e.active)?e.active:r[0]?.key}}function Is(e){const{document:t,recovery:n,tabs:i,...o}=e;return{...o,format:3,document:t,views:i.map(Ut),recovery:n}}function Di(e){const t=(n,i=!1)=>Array.isArray(n)&&n.length===2&&n.every(o=>typeof o=="number"&&Number.isFinite(o)&&(!i||o>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function El(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(i=>!i||typeof i.name!="string"||typeof i.url!="string"||!Rl(i.url))||new Set(t.map(i=>i.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const i=e;if(![2,3].includes(i.format)||!Array.isArray(i.views)||!Array.isArray(i.recovery))throw Error("Invalid workspace");const o=e.legacyViews;if(o){if(!Array.isArray(o.views)||o.active!==void 0&&typeof o.active!="string"||o.documentKey!==void 0&&typeof o.documentKey!="string")throw Error("Invalid legacy backup");for(const u of o.views)Di(u)}const{format:r,views:s,document:d,recovery:a,...l}=e;for(const u of s)Di(u);for(const u of a)Di(u);if(!!d!=!!s.length||new Set(s.map(u=>u.key)).size!==s.length)throw Error("Invalid workspace views");if(i.format===2){if(i.views.some(g=>g.group!==void 0&&typeof g.group!="string"))throw Error("Invalid legacy Group");if(i.views.length&&(i.views[0].group!==void 0||i.views.filter(g=>g.group===void 0).length!==1))throw Error("Invalid legacy views");const u=i.views[0],p=u?{...u}:void 0;return p&&delete p.group,Vt({...l,tabs:[],active:p?.key,legacyViews:{documentKey:d?.key,views:structuredClone(i.views),active:i.active}},a,d,p?[p]:[])}if(s.length&&(s[0].activity!==void 0||s[0].object!==void 0||s.filter(u=>u.activity===void 0&&u.object===void 0).length!==1)||new Set(s.filter(u=>u.activity!==void 0).map(u=>u.activity)).size!==s.filter(u=>u.activity!==void 0).length||new Set(s.filter(u=>u.object!==void 0).map(u=>u.object)).size!==s.filter(u=>u.object!==void 0).length)throw Error("Invalid workspace views");if(d&&s.some(u=>u.activity!==void 0&&!d.design.graph.nodes.some(p=>p.type==="business"&&p.id===u.activity)))throw Error("Unknown saved Activity");if(d&&s.some(u=>u.object!==void 0&&!d.design.graph.nodes.some(p=>p.type==="object"&&p.id===u.object)))throw Error("Unknown saved Object");return Vt({...l,tabs:[]},a,d,s)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(i=>i.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const i of e.tabs)Di(i);const n=e.tabs.find(i=>i.key===e.active)??e.tabs[0];return Vt({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function Ol(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,i=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(o=>o.url!==n)]:e.urlHistory;return Vt({...e,urlHistory:i,tabs:[t],active:t.key},e.recovery)}function jl(e,t,n=e.document?.handle,i=!1){if(!e.document)return e;const o={...e.document,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},r=new Set(t.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)),s=new Set(t.graph.nodes.filter(a=>a.type==="object").map(a=>a.id)),d=e.tabs.filter(a=>(a.activity===void 0||r.has(a.activity))&&(a.object===void 0||s.has(a.object))).map(Ut);return Vt(e,e.recovery,o,d)}function Cl(e,t){const n=e.tabs.find(o=>Gi(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="business"&&o.id===t))throw Error("Unknown Activity");const i=no(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Ut(oo(i))),e.tabs.push(i),e.active=i.key,i}function Dl(e,t){const n=e.tabs.find(o=>Hi(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="object"&&o.id===t))throw Error("Unknown Object");const i=no(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Ut(oo(i))),e.tabs.push(i),e.active=i.key,i}function Ml(e,t){const n=e.tabs.map(i=>{const o=t.tabs.find(r=>r.key===i.key);return Ut(o?oo(no(e.document,{...Ut(i),...Ut(o)})):i)});return Vt({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(i=>i.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function Rl(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function so(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const i=d=>d instanceof HTMLButtonElement&&d.disabled,o=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(d=>!d.hidden&&!i(d));for(const d of Array.from(t.querySelectorAll("button,a[href]")))d.setAttribute("role","menuitem");const r=(d=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),d&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},s=(d=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const a=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),l=a.getBoundingClientRect();t.style.left=Math.max(8,Math.min(l.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(l.bottom+4,innerHeight-t.offsetHeight-8))+"px",(d?o().at(-1):o()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?s():r(!0),e.onkeydown=d=>{(d.key==="ArrowDown"||d.key==="ArrowUp")&&(d.preventDefault(),s(d.key==="ArrowUp"))},t.addEventListener("keydown",d=>{const a=d,l=o(),u=l.indexOf(document.activeElement);let p;a.key==="ArrowDown"&&(p=(u+1)%l.length),a.key==="ArrowUp"&&(p=(u+l.length-1)%l.length),a.key==="Home"&&(p=0),a.key==="End"&&(p=l.length-1),p!==void 0&&(a.preventDefault(),l[p]?.focus())}),t.addEventListener("click",d=>{const a=d.target.closest("button,a[href]");!t.hidden&&a&&!i(a)&&r(!0)},!0),document.addEventListener("keydown",d=>{!t.hidden&&d.key==="Escape"&&(d.preventDefault(),d.stopImmediatePropagation(),r(!0))},!0),document.addEventListener("pointerdown",d=>{!t.hidden&&!t.contains(d.target)&&!e.contains(d.target)&&r()}),document.addEventListener("focusin",d=>{!t.hidden&&!t.contains(d.target)&&d.target!==e&&r()}),window.addEventListener("resize",()=>r()),{close:r}}const Ll=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),Nl={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function Pl(e,t,n,i){const o=e.replace(/\r\n?/g,`
`).split(`
`),r=y=>o.slice(y.line+1,i.find(E=>E.line>y.line&&E.level<=y.level)?.line??o.length).join(`
`).trim(),s=new Map(i.filter(y=>y.level===3&&t.some(E=>E.title===y.title)).map(y=>[y.title,y])),d=y=>{const E=t.find(S=>S.title===y.title);return E?"legacy-check:"+E.id:y.level===1?"legacy-check-document":"legacy-heading:"+y.line},a=new Map,l=(y,E)=>{a.has(y)?a.get(y)!==E&&a.set(y,void 0):a.set(y,E)};for(const y of i){const E=d(y);l(Ll(y.title),E);const S=t.find(x=>x.title===y.title);S&&l(S.id.toLowerCase(),E)}for(const[y,E]of o.entries()){const S=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(E);if(S){const x=i.find(A=>A.line>y);x&&l(S[1].toLowerCase(),d(x))}}const u=y=>{y=y.replace(/<a\s+id=[^>]+><\/a>/g,"");const E=[];let S=0;for(const x of y.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){x.index>S&&E.push({kind:"markdown",value:y.slice(S,x.index)});let A=x[2].slice(1);try{A=decodeURIComponent(A)}catch{}const L=x[2].startsWith("#")?a.get(A.toLowerCase()):void 0;E.push(L?{kind:"reference",targetId:L,label:x[1]}:{kind:"link",uri:x[2],label:x[1]}),S=x.index+x[0].length}return S<y.length&&E.push({kind:"markdown",value:y.slice(S)}),E},p=[],g=[],c=[],h=new Map;for(const y of i.filter(E=>E.level===2)){if(y.title==="業務一覧")continue;const E=d(y),S=i.find(x=>x.line>y.line)?.line??o.length;p.push({id:E,activityId:Object.hasOwn(n,y.title)?y.title:null,title:y.title,preamble:u(o.slice(y.line+1,S).join(`
`).trim())}),h.set(y.title,E)}const m="legacy-unassigned",f=y=>{const E=i.filter(S=>S.line<y.line&&S.level===2).at(-1);return E?h.get(E.title):void 0},b=t.map(y=>{const E=s.get(y.title),S=f(E)??m,x=Object.create(null),A=[];let L={name:"補足",value:""},$="";for(const D of y.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const C=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(D);C&&($?C[1][0]===$[0]&&C[1].length>=$.length&&!C[2].trim()&&($=""):$=C[1]);const J=$?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(D);J?(L.value.trim()&&A.push(L),L={name:J[1],value:J[2]}):L.value+=`
`+D}L.value.trim()&&A.push(L);let N="";for(const D of A)if(D.name==="人間レビュー状態"){N=D.value.split(`
`)[0].trim();const C=D.value.split(`
`).slice(1).join(`
`).trim();C&&(x.補足=[...x.補足??[],...u(C)])}else{const C=Nl[D.name]??D.name;x[C]=[...x[C]??[],...u(D.value.trim())]}return{id:"legacy-check:"+y.id,checkId:y.id,title:y.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:N,sectionId:S,detailSummary:[...y.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(D=>D[1]).join(`
`),fields:x}});b.some(y=>y.sectionId===m)&&p.push({id:m,activityId:null,title:"未割当",preamble:[]});for(const y of i.filter(E=>E.level===3&&!s.has(E.title))){const E=f(y);E?g.push({id:d(y),sectionId:E,title:y.title,blocks:[{kind:"prose",content:u(r(y))}]}):c.push({id:d(y),title:y.title,content:u(r(y))})}const w=i.find(y=>y.level===2)?.line??o.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:i.find(y=>y.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:u(o.slice(/^# /.test(o[0])?1:0,w).join(`
`)),sections:p,items:b,index:Object.entries(n).map(([y,E])=>{const S=o.find(x=>x.startsWith("|")&&x.includes("["+y+"]"))?.split("|").slice(1,-1)??[];return{activityId:y,purpose:S[1]?.trim()??"",connections:S[2]?.trim()??"",checkIds:E.map(x=>"legacy-check:"+x)}}),guarantees:g,examples:[],notes:c}}function Do(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[i,o,...r]=n;if(!i||!o)return;r[0]==="refs"&&["heads","tags"].includes(r[1])&&r.splice(0,2);const[s,...d]=r;return!s||!d.length||!["main","master"].includes(s)&&!/^[a-f0-9]{40}$/i.test(s)?void 0:{document:`${i.toLowerCase()}/${o.toLowerCase()}/${d.join("/")}`,ref:s}}catch{return}}function Jo(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function Tl(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),i=[];let o="";if(n.forEach((p,g)=>{const c=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(p);if(c){o?c[1][0]===o[0]&&c[1].length>=o.length&&!c[2].trim()&&(o=""):o=c[1];return}if(!o){t.add(g);const h=/^(#{1,6}) (.+)$/.exec(p);h&&i.push({line:g,level:h[1].length,title:h[2]})}}),o)throw Error("Check Markdownのコードブロックが閉じていません。");const r=i.filter(p=>p.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(p.title));if(!r.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const s=new Set,d=r.map(p=>{const g=i.find(m=>m.line>p.line&&m.level<=3)?.line??n.length,c=p.title.split(/\s/)[0];if(s.has(c))throw Error("Check IDが重複しています: "+c);s.add(c);const h=n.slice(p.line+1,g).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const m of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+m+"[：:]\\s*\\S","m").test(h))throw Error(c+" の"+m+"が見つかりません。");return{id:c,title:p.title,body:h,activities:[]}}),a=Object.create(null);let l=!1;for(const[p,g]of n.entries()){if(!t.has(p)||(/^## /.test(g)&&(l=/^## 業務一覧\s*$/.test(g)),!l||!/^\|/.test(g)))continue;const c=g.split("|").slice(1,-1);if(c.length!==4)continue;const h=Jo(c[0])[0]?.label;if(!h)continue;if(Object.hasOwn(a,h))throw Error("業務一覧のActivityが重複しています: "+h);const m=Jo(c[3]);if(m.some(b=>b.url.toLowerCase()!=="#"+b.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+h);const f=m.map(b=>b.label);if(!f.length||f.some(b=>!s.has(b)))throw Error("業務一覧のCheck ID参照を確認できません: "+h);a[h]=[...new Set(f)];for(const b of d)f.includes(b.id)&&b.activities.push(h)}if(!Object.keys(a).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const u=i.find(p=>p.level===2)?.line??r[0].line;return{markdown:e,intro:n.slice(0,u).join(`
`),items:d,index:a,model:Pl(e,d,a,i)}}function ui(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function pi(e,t){const n=new Set(t.design.graph.nodes.filter(l=>l.type==="business").map(l=>l.name)),i=Object.keys(e.index).filter(l=>!n.has(l)),o=Object.keys(e.index).filter(l=>n.has(l)),r=(l,u)=>({state:l,reason:u,unknown:i});if(!o.length)return r("mismatch","業務一覧に、この業務設計書のActivityがありません。");const s=e.intro.split(`
`).filter(l=>/原典|^[-*] Source[：:]|Business Design/i.test(l)).join(`
`),d=Jo(s).map(l=>Do(l.url)).filter(l=>l!==void 0),a=t.source?.kind==="url"?Do(t.source.url):t.source?.kind==="sample"?Do("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return a&&d.length&&d.some(l=>l.document!==a.document)?r("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):i.length?r("unverified","業務一覧に対応先不明のActivityがあります: "+i.join("、")):!a||!d.length?r("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||d.some(l=>l.ref!==a.ref)||!/^[a-f0-9]{40}$/i.test(a.ref)?r("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):r("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const hr=new WeakMap;function Hn(e){let t=hr.get(e);return t||(t=Tl(e.markdown),hr.set(e,t)),t}const Mo=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function Mi(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function ql(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function $l(e){if(!e.checks)return[];const t=Hn(e.checks),n=pi(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===ui(e)?[t.model]:[]}function Wl(e,t,n){const i=document.createElement("section");i.className="check-controls",i.setAttribute("aria-label","関連Check");const o=document.createElement("section");if(o.className="check-notices",t.busy&&Mi(o,"関連Checkを読み込み・保存しています…"),t.error){const d=document.createElement("p");d.className="check-warning",d.setAttribute("role","alert"),d.textContent=t.error,o.append(d)}let r,s=!1;if(e.checks){r=Hn(e.checks);const d=pi(r,e);if(s=d.state==="matched"||d.state==="unverified"&&e.checks.confirmedFor===ui(e),!s&&(Mi(o,"現在のBDとの対応を再確認してください。"+d.reason),d.state==="unverified")){const a=Mo("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));a.disabled=n.disabled||t.busy===!0,o.append(a)}}if(t.candidate){const d=t.candidate,a=Hn(d),l=pi(a,e),u=document.createElement("section");u.className="check-candidate",u.id="check-candidate",Mi(u,"一致未確認: "+d.name+" — "+l.reason),Mi(u,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const p=document.createElement("details"),g=document.createElement("summary");g.textContent="原典参照・業務別インデックス・Check本文を確認",p.append(g,ql(a.markdown)),u.append(p);const c=Mo("対応を確認して表示する",()=>n.confirm(d));c.id="check-confirm",c.disabled=l.state==="mismatch"||n.disabled||t.busy===!0;const h=Mo("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});h.disabled=n.disabled||t.busy===!0,u.append(c,h),o.append(u)}return o.childNodes.length&&i.append(o),i}function zl(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),i=e.querySelector("#document-actions-toggle"),o=Array.from(n.querySelectorAll("button"));for(const u of o){const p=document.createElement("span");p.className="document-action-label",p.textContent=u.getAttribute("aria-label"),u.append(p)}let r=!1;const s=(u=!1)=>{r=!1,e.dataset.actionsOpen="false",i.setAttribute("aria-expanded","false"),u&&!i.hidden&&i.focus({preventScroll:!0})},d=()=>o.filter(u=>!u.hidden&&!u.disabled),a=()=>{const u=e.dataset.actionsMode,p=document.activeElement;e.dataset.actionsMode="inline";const c=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,h=n.getBoundingClientRect().width+c,m=o.some(f=>!f.hidden)&&e.clientWidth>0&&h>e.getBoundingClientRect().width;e.dataset.actionsMode=m?"menu":"inline",i.hidden=!m,(!m||u!==e.dataset.actionsMode)&&(s(),m&&n.contains(p)?i.focus({preventScroll:!0}):!m&&p===i&&d()[0]?.focus({preventScroll:!0}))},l=(u=!1)=>{if(i.hidden)return;r=!0,e.dataset.actionsOpen="true",i.setAttribute("aria-expanded","true");const p=d();(u?p.at(-1):p[0])?.focus({preventScroll:!0})};return i.onclick=()=>r?s(!0):l(),i.onkeydown=u=>{(u.key==="ArrowDown"||u.key==="ArrowUp")&&(u.preventDefault(),l(u.key==="ArrowUp"))},n.addEventListener("keydown",u=>{if(!r)return;const p=d(),g=p.indexOf(document.activeElement);let c;u.key==="ArrowDown"&&(c=(g+1)%p.length),u.key==="ArrowUp"&&(c=(g+p.length-1)%p.length),u.key==="Home"&&(c=0),u.key==="End"&&(c=p.length-1),c!==void 0&&(u.preventDefault(),p[c]?.focus())}),document.addEventListener("keydown",u=>{r&&u.key==="Escape"&&(u.preventDefault(),u.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",u=>{r&&!n.contains(u.target)&&!i.contains(u.target)&&s()}),document.addEventListener("focusin",u=>{r&&!n.contains(u.target)&&u.target!==i&&s()}),n.addEventListener("click",u=>{const p=u.target.closest("button");r&&p&&!p.disabled&&s(!0)},!0),s(),a(),window.addEventListener("resize",a),typeof ResizeObserver<"u"&&new ResizeObserver(a).observe(e),new MutationObserver(a).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(a),document.fonts?.addEventListener("loadingdone",a),{update:a,close:s}}function Ul(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),i=()=>{e.classList.remove("header-icons-only");const o=getComputedStyle(e),r=parseFloat(o.columnGap)||0,s=parseFloat(o.paddingLeft)+parseFloat(o.paddingRight),d=n.reduce((l,u)=>l+u.getBoundingClientRect().width,0)+r*n.length+s,a=d+t.getBoundingClientRect().width+r;t.classList.toggle("header-title-hidden",!t.querySelector("select")&&a>e.clientWidth),e.classList.toggle("header-icons-only",d>e.clientWidth)};if(i(),window.addEventListener("resize",i),typeof ResizeObserver<"u"){const o=new ResizeObserver(i);[e,t,...n].forEach(r=>o.observe(r))}document.fonts?.ready.then(i),document.fonts?.addEventListener("loadingdone",i)}const ti="http://www.w3.org/2000/svg",Vl="http://www.w3.org/1999/xhtml",Ri=24,br=8192,Fl=16e6,Bl=8e6,Gl=4e3,Hl=1e6,_o="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function Jl(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(u=>![u.x,u.y,u.width,u.height].every(Number.isFinite)||u.width<0||u.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,i=-1/0,o=-1/0;for(const u of e)t=Math.min(t,u.x),n=Math.min(n,u.y),i=Math.max(i,u.x+u.width),o=Math.max(o,u.y+u.height);const r=Math.floor(t)-Ri,s=Math.floor(n)-Ri,d=Math.ceil(i)-r+Ri,a=Math.ceil(o)-s+Ri,l=Math.min(2,br/d,br/a,Math.sqrt(Fl/(d*a)));if(l<1)throw Error(_o);return{bounds:{x:r,y:s,width:d,height:a},width:Math.floor(d*l),height:Math.floor(a*l),scale:l}}const _l="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function gr(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],i=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((o,r)=>{const s=i[r],d=getComputedStyle(o);s.removeAttribute("style");for(const a of _l){const l=d.getPropertyValue(a);l&&!/url\s*\(/i.test(l)&&s.style.setProperty(a,l)}for(const a of Array.from(s.attributes))(a.name.startsWith("data-")||a.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(a.name))&&s.removeAttribute(a.name)}),t}function Kl(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>Gl||(e.textContent?.length??0)+(t.textContent?.length??0)>Hl)throw Error(_o);const i=Array.from(e.querySelectorAll(":scope > .node")),o=i.map(m=>({x:parseFloat(m.style.left),y:parseFloat(m.style.top),width:m.offsetWidth,height:m.offsetHeight}));for(const m of i)for(const f of Array.from(m.querySelectorAll(".finding-badges")))o.push({x:parseFloat(m.style.left)+m.clientLeft+f.offsetLeft,y:parseFloat(m.style.top)+m.clientTop+f.offsetTop,width:f.offsetWidth,height:f.offsetHeight});if(!i.length)throw Error("画像にする項目がありません。");const r=e.ownerDocument,s=Array.from(t.children).map(gr),d=s.filter(m=>m.matches(".edge,.edge-label"));if(d.length){const m=r.createElementNS(ti,"svg");m.setAttribute("viewBox","0 0 1 1"),m.setAttribute("width","1"),m.setAttribute("height","1"),m.setAttribute("aria-hidden","true"),m.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",m.append(...d),r.body.append(m);try{for(const f of d){const b=f.getBBox();o.push({x:b.x-12,y:b.y-12,width:b.width+24,height:b.height+24})}}finally{m.remove()}}const a=Jl(o),l=r.createElementNS(ti,"svg");l.setAttribute("width",String(a.width)),l.setAttribute("height",String(a.height)),l.setAttribute("viewBox",`0 0 ${a.bounds.width} ${a.bounds.height}`);const u=r.createElementNS(ti,"rect");u.setAttribute("width","100%"),u.setAttribute("height","100%"),u.setAttribute("fill",n),l.append(u);const p=r.createElementNS(ti,"g");p.setAttribute("transform",`translate(${-a.bounds.x} ${-a.bounds.y})`);for(const m of s)p.append(m);l.append(p);const g=r.createElementNS(ti,"foreignObject");g.setAttribute("width",String(a.bounds.width)),g.setAttribute("height",String(a.bounds.height));const c=r.createElementNS(Vl,"div");c.style.cssText=`position:relative;width:${a.bounds.width}px;height:${a.bounds.height}px;`;for(const m of i){const f=gr(m);f.querySelector(".activity-open,.object-open")?.remove(),f.style.left=parseFloat(m.style.left)-a.bounds.x+"px",f.style.top=parseFloat(m.style.top)-a.bounds.y+"px",c.append(f)}g.append(c),l.append(g);const h=new XMLSerializer().serializeToString(l);if(new TextEncoder().encode(h).length>Bl)throw Error(_o);return{svg:h,...a}}function Xl(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function ma(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((o,r)=>{const s=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",r(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(s),o()},n.onerror=()=>{clearTimeout(s),r(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const i=t.getContext("2d");if(!i)throw Error("画像用のメモリを確保できませんでした。");return i.drawImage(n,0,0,e.width,e.height),await new Promise((o,r)=>{const s=window.setTimeout(()=>r(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(d=>{clearTimeout(s),d?o(d):r(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(d){clearTimeout(s),r(d)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function Zl(e,t){const n=await ma(e),i=URL.createObjectURL(n),o=document.createElement("a");try{o.href=i,o.download=Xl(t),o.hidden=!0,document.body.append(o),o.click()}finally{o.remove(),window.setTimeout(()=>URL.revokeObjectURL(i),1500)}}async function Yl(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=ma(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function ha(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,i)=>({id:Ql(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function Ql(e,t,n){const i=JSON.stringify([e,t,n]);let o=2166136261,r=2246822507;for(const s of i)o=Math.imul(o^s.codePointAt(0),16777619)>>>0,r=Math.imul(r^s.codePointAt(0),3266489909)>>>0;return"exception-"+o.toString(16).padStart(8,"0")+r.toString(16).padStart(8,"0")}function ba(e,t,n){if(n==null||n==="-")return null;const i=e.exceptions.filter(o=>o.activityId===t&&o.name===n);return P(i.length===1,"Unknown or ambiguous State exception name: "+n),i[0].id}function ga(e){P(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),mn(e),Fi(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(i=>i.kind==="businessDesign")){n.exceptions=ha(n),n.roles??=[],n.schemaVersion="0.3";for(const i of n.activities)Object.hasOwn(i,"roleId")||(i.roleId=null,t.diagnostics.push("Role未確定: "+i.id+" — "+i.who))}for(const n of t.documents.filter(i=>i.kind==="stateTransition")){const i=t.documents.find(o=>o.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const o of n.transitions)o.exceptionId=ba(i,o.activityId,o.exception),delete o.exception,o.path==="exception"&&o.exceptionId===null&&t.diagnostics.push("例外参照未決: "+o.id)}return Fi(t),t}const yr=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),eu={anyOf:di.anyOf},tu={type:"string",pattern:"^[A-Za-z0-9_-]+$"},nu={type:"string",minLength:1,pattern:"\\S"},iu={$schema:"https://json-schema.org/draft/2020-12/schema",...yr({format:{enum:["alder-named-plans"]},formatVersion:{enum:["1.0"]},plans:{type:"array",minItems:1,items:yr({id:tu,name:nu,package:eu})}}),$defs:di.$defs};function ou(e){try{mn(e,iu)}catch(n){if(Array.isArray(e?.plans))for(const i of e.plans)try{mn(i?.package,di)}catch(o){throw Error("Plan "+(i?.id??"<missing>")+" (formatVersion "+String(i?.package?.formatVersion)+"): "+o.message,{cause:o})}throw n}P(e.plans.length>0,"At least one named plan is required");const t=new Set;for(const n of e.plans){P(!t.has(n.id),"Duplicate plan ID: "+n.id),t.add(n.id),P(n.name===n.name.trim()&&!/[\r\n]/.test(n.name),"Invalid plan name: "+n.id);try{Fi(n.package),["0.1","0.2","0.3"].includes(n.package.formatVersion)&&ga(n.package)}catch(i){throw Error("Plan "+n.id+" (formatVersion "+n.package.formatVersion+"): "+i.message,{cause:i})}}return{valid:!0,plans:e.plans.map(({id:n,name:i})=>({id:n,name:i}))}}const fe=(e,t)=>{if(!e)throw new Error(t)},ii=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),Ro=e=>!!e&&typeof e=="object"&&!Array.isArray(e),Li=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),ya=e=>ii(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function su(e){fe(Ro(e),"Graph must be an object");const t=e;fe(Li(t,["version","nodes","relations"])||Li(t,["version","nodes","relations","scope"]),"Invalid graph fields"),fe(t.version===1,"Unsupported graph version"),"scope"in t&&fe(ii(t.scope),"Invalid scope"),fe(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),fe(Array.isArray(t.relations),"Relations required");const n=new Map;for(const r of t.nodes){fe(Ro(r),"Node must be an object");const s=r;fe(s.type==="business"||s.type==="object","Invalid node type");const d=s.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];s.type==="business"&&("problem"in s||"pain_level"in s)&&(d.push("problem","pain_level"),fe(["Low","Medium","High"].includes(String(s.pain_level)),"Invalid Pain level")),fe(Li(s,d),"Invalid node fields"),fe(Object.entries(s).every(([l,u])=>l==="scope"||l==="information"||ii(u)),"Empty node text"),fe(typeof s.scope=="boolean","Invalid node scope"),fe(ya(s.name)&&s.id===s.name,"Node ID must equal visible name"),fe(!n.has(s.id),"Duplicate node ID"),s.type==="object"&&(fe(typeof s.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.icon),"Invalid Lucide icon"),fe(Array.isArray(s.information)&&s.information.every(ii),"Invalid information")),n.set(s.id,s.type)}fe([...n.values()].includes("business"),"Activity required");const i={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},o=new Set;for(const r of t.relations){fe(Ro(r),"Relation must be an object");const s=r;fe(Li(s,["kind","from","to","label"])&&Object.values(s).every(ii),"Invalid relation fields");const d=i[s.kind];fe(Array.isArray(d)&&n.has(s.from)&&n.has(s.to)&&n.get(s.from)===d[0]&&n.get(s.to)===d[1],"Invalid relation endpoints");const a=JSON.stringify([s.kind,s.from,s.to,s.label]);fe(!o.has(a),"Duplicate relation"),o.add(a)}}function hn(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function si(e){const t=[];let n="";return hn(e).forEach((i,o)=>{const r=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(i);if(r){n?r[1][0]===n[0]&&r[1].length>=n.length&&!r[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=r[1];return}!n&&/^#{1,6} /.test(i)&&t.push([o,i])}),fe(!n,"Unclosed code fence"),t}function Ko(e,t,n,i=[]){const o=hn(e),r=si(e),s=Object.create(null);return fe(r.length&&!o.slice(0,r[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),r.forEach(([d,a],l)=>{fe(t.includes(a)&&!(a in s),n+": unsupported/duplicate "+a),s[a]=o.slice(d+1,r[l+1]?.[0]??o.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),fe(s[a]||i.includes(a),n+": empty "+a)}),fe(r.map(d=>d[1]).join("|")===t.join("|"),n+": invalid field order"),s}const vr=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const r=n[o].codePointAt(0)-i[o].codePointAt(0);if(r)return r}return n.length-i.length};function ru(e){const t=hn(e),n=si(e).filter(([,o])=>o.startsWith("## ")),i=new Set;return fe(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([o,r],s)=>{const d=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(r);fe(d,"Invalid Finding ID");const a=d[1];fe(!i.has(a),"Duplicate Finding ID"),i.add(a);const l=Ko(t.slice(o+1,n[s+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+a);fe(["question","correction"].includes(l["### Kind"]),"Invalid Finding Kind"),fe(["open","resolved"].includes(l["### Status"]),"Invalid Finding Status"),fe(["items","document","unassigned"].includes(l["### Scope"]),"Invalid Finding Scope");const u=l["### Targets"]==="(none)"?[]:hn(l["### Targets"]).filter(p=>p.trim()).map(p=>(fe(p.startsWith("- ")&&ya(p.slice(2)),"Invalid Finding target"),p.slice(2)));return fe(new Set(u).size===u.length,"Duplicate Finding target"),fe(l["### Scope"]==="items"?u.length>0:l["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:a,kind:l["### Kind"],status:l["### Status"],scope:l["### Scope"],targets:u,summary:l["### Summary"],content:l["### Content"],unresolvedTargets:[]}})}function au(e,t){fe(!e.includes("<!--"),"HTML comments are unsupported");const n=hn(e),i=si(e).filter(g=>g[1].startsWith("# ")),o=/^# (Activity|Object) (\S.*)$/;fe(i.length&&!o.test(i[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(i[0][1]),"Document title required"),t?.document?.(i[0][1].slice(2),n.slice(i[0][0]+1,i[1]?.[0]??n.length).join(`
`).trim());let r=[];const s={version:1,nodes:[],relations:[]},d=Object.create(null),a=new Set;i.slice(1).forEach(([g,c],h)=>{const m=i[h+2]?.[0]??n.length,f=n.slice(g+1,m).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(fe(f,"Empty section "+c),c==="# Findings"){fe(!a.has(c),"Duplicate Findings"),a.add(c),r=ru(f);return}if(["# Scope","# Graph exceptions"].includes(c)){fe(!a.has(c),"Duplicate "+c),a.add(c),c==="# Scope"?(fe(!si(f).length,"Scope must be prose"),s.scope=f):hn(f).filter(L=>L.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(L=>{const $=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(L);fe($,"Invalid exception"),s.relations.push({kind:$[1],from:$[2],to:$[3],label:$[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const b=o.exec(c);fe(b,"Unsupported heading "+c);const w=b[1],y=b[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");d[y]=n.slice(g,m).join(`
`);const E=L=>si(f).some($=>$[1]===L);if(w==="Object"){const L=["## Scope","## Icon"];E("## Information")&&L.push("## Information");const $=Ko(f,L,y);fe(["true","false"].includes($["## Scope"]),"Invalid Scope");const N=hn($["## Information"]??"").filter(D=>D.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(D=>(fe(/^- \S.*$/.test(D),"Invalid Information"),D.slice(2)));s.nodes.push({id:y,type:"object",name:y,scope:$["## Scope"]==="true",icon:$["## Icon"]==="(generic icon)"?"box":$["## Icon"],information:N});return}const S=["## Scope","## Why","## When"];E("## Exception When")&&S.push("## Exception When"),S.push("## Who","## Where","## How","### Input","### Procedure"),E("### Exception")&&S.push("### Exception"),S.push("### Output","## Result"),(E("## Problem")||E("## Pain level"))&&S.push("## Problem","## Pain level");const x=Ko(f,S,y,["## How"]);fe(!x["## How"],"How must only contain fields"),fe(["true","false"].includes(x["## Scope"]),"Invalid Scope"),t?.activity?.(y,x);const A={id:y,type:"business",name:y,scope:x["## Scope"]==="true",why:x["## Why"],when:x["## When"],who:x["## Who"],where:x["## Where"],result:x["## Result"]};"## Problem"in x&&(A.problem=x["## Problem"],A.pain_level=x["## Pain level"]),s.nodes.push(A);for(const[L,$]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(L in x)||$!=="business-exception"&&x[L]==="(none)"||hn(x[L]).filter(N=>N.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(N=>{const D=/^- (.+?) — (\S.*)$/.exec(N);fe(D,"Invalid relation in "+y),s.relations.push({kind:$,from:$==="output"?y:D[1],to:$==="output"?D[1]:y,label:D[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const l=s.nodes.filter(g=>g.type==="business").map(g=>g.id);su(s),s.nodes.sort((g,c)=>vr(g.id,c.id)),s.relations.sort((g,c)=>{for(const h of["kind","from","to","label"]){const m=vr(g[h],c[h]);if(m)return m}return 0});const u=new Set(s.nodes.map(g=>g.id));for(const g of r)g.unresolvedTargets=g.targets.filter(c=>!u.has(c));return{graph:s,sections:d,markdown:e,activityOrder:l,findings:r}}const cu=["id","from","activity","condition","to","effect","path","evidence","note"],_e=(e,t)=>{if(!e)throw Error(t)},Ni=e=>typeof e=="string"&&!!e.trim();function du(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());_e(n,"state-meta と遷移表が必要です");const i=na(n[1]);_e(i&&typeof i=="object"&&!Array.isArray(i),"メタ情報が不正です"),_e(Object.keys(i).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),_e(i.object===t,"対象Objectが一致しません"),_e(Array.isArray(i.states)&&i.states.length>0&&i.states.every(l=>Ni(l)&&!l.startsWith("@"))&&new Set(i.states).size===i.states.length,"状態一覧が不正です"),_e(i.start==="@new"&&i.terminal==="@unknown"&&i.completeness==="partial"&&Ni(i.source),"開始・終端・部分定義の宣言が不正です");const o=n[2].trim().split(/\r?\n/),r=l=>(_e(l.startsWith("|")&&l.endsWith("|"),"表の行が不正です"),l.slice(1,-1).split("|").map(u=>u.trim())),s=r(o[0]);_e([cu,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(l=>s.join("|")===l.join("|")),"表の列名が不正です"),_e(r(o[1]).length===s.length&&r(o[1]).every(l=>/^-+$/.test(l)),"表の区切りが不正です"),_e(o.length<=1002,"遷移は1000行以内にしてください");const d=new Set,a=o.slice(2).map(l=>{const u=r(l);_e(u.length===s.length&&u.every(Ni),"表の列数・空欄が不正です");const p=Object.fromEntries(s.map((g,c)=>[g,u[c]]));return _e(/^T[0-9]+$/.test(p.id)&&!d.has(p.id),"遷移IDが不正または重複しています"),d.add(p.id),_e([...i.states,"@new"].includes(p.from)&&[...i.states,"@unknown","@none"].includes(p.to),"未登録の状態が参照されています"),_e(["change","unchanged","no-create","constraint"].includes(p.effect)&&["normal","exception"].includes(p.path),"効果・経路の指定が不正です"),s.includes("exception")&&_e(p.path==="normal"?p.exception==="-":Ni(p.exception)&&p.exception!=="-","通常は例外名なし、例外は名前が必要です"),_e(p.effect!=="unchanged"||p.from===p.to,"状態不変の元と先が一致しません"),_e(p.effect!=="change"||!p.to.startsWith("@")&&p.from!==p.to,"状態変更の遷移先が不正です"),_e(p.effect!=="no-create"||p.from==="@new"&&p.to==="@none","不成立の元と先が不正です"),_e(p.effect!=="constraint"||p.to==="@unknown","未決の制約は遷移先未決としてください"),p});return{model:{...i,transitions:a}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const wr=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function lu(e){const t=[];let n=null;const i=e.split(/\r?\n/),o=[];let r="";for(let s=0;s<i.length;s++){const d=i[s];if(!r&&/^# Object /.test(d)?n=d.slice(9):!r&&/^# /.test(d)&&(n=null),!r&&d==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const a=[];let l="";for(s++;s<i.length;s++){const p=i[s];if(!l&&/^#{1,2} /.test(p)){s--;break}a.push(p),l=wr(p,l)}const u=du(a.join(`
`),n);if(u.error)throw Error(u.error);t.push(u.model);continue}o.push(d),r=wr(d,r)}if(new Set(t.map(s=>s.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:o.join(`
`),declarations:t}}function uu(e){const t=/^## State Transitions$/m.test(e)?lu(e):{markdown:e,declarations:[]};let n="",i="";const o=new Map,r=au(t.markdown,{activity:(a,l)=>o.set(a,l),document:(a,l)=>{n=a,i=l}}),s={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:i,scope:r.graph.scope??"",objects:r.graph.nodes.filter(a=>a.type==="object").map(a=>({id:a.id,name:a.name,scope:a.scope,icon:String(a.icon),information:a.information})),activities:(r.activityOrder??[]).map(a=>{const l=r.graph.nodes.find(p=>p.id===a),u=o.get(a);return{id:a,name:l.name,scope:l.scope,why:String(l.why),when:String(l.when),who:String(l.who),where:String(l.where),procedure:u["### Procedure"],exception:u["### Exception"]??null,result:String(l.result),problem:l.problem===void 0?null:String(l.problem),painLevel:l.pain_level===void 0?null:String(l.pain_level)}}),relations:r.graph.relations.map((a,l)=>({id:"legacy-relation-"+l,kind:a.kind,fromId:a.from,toId:a.to,label:a.label})),findings:(r.findings??[]).map(a=>({...a,sourceId:a.id,targetIds:a.targets.filter(l=>r.graph.nodes.some(u=>u.id===l))}))};s.exceptions=ha(s);const d=t.declarations.map((a,l)=>({id:"legacy-state-"+l,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:s.id,revision:s.revision,verification:"unverified"},objectId:a.object,states:a.states.map(u=>({id:u,name:u})),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(u=>({id:u.id,sourceId:u.id,fromId:u.from,toId:u.to,activityId:u.activity,exceptionId:ba(s,u.activity,u.exception),event:u.event??null,condition:u.condition,effect:u.effect,path:u.path,evidence:u.evidence,note:u.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:s,checks:[],states:d,diagnostics:[]}}}const Nt={type:"string"},de={type:"string",minLength:1,pattern:"\\S"},le={type:"string",pattern:"^[A-Za-z0-9_-]+$"},At=e=>({anyOf:[e,{type:"null"}]}),ve=e=>({type:"array",items:e}),pe=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),pu=e=>({$ref:"#/$defs/"+e}),zn=ve({anyOf:[pe({kind:{enum:["text"]},value:Nt}),pe({kind:{enum:["reference"]},targetId:le,label:Nt}),pe({kind:{enum:["link"]},uri:de,label:Nt})]}),Xo=pe({id:le,name:de,scope:{type:"boolean"}}).properties,va=pe({id:le,kind:{enum:["input","output","business-exception","object-exception"]},fromId:le,toId:le,label:de}),fu=pe({id:le,sourceId:le,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:ve(le),unresolvedTargets:ve(de),summary:de,content:de}),Zo=pe({id:le,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:de,title:de,preface:Nt,scope:Nt,objects:ve(pe({...Xo,icon:de,information:ve(de)})),activities:ve(pe({...Xo,why:de,when:de,who:de,where:de,procedure:de,exception:At(de),result:de,problem:At(de),painLevel:At({enum:["Low","Medium","High"]})})),relations:ve(va),findings:ve(fu)}),mu=pe({id:le,name:de,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),wa=pe({...Zo.properties,schemaVersion:{enum:["0.2"]},roles:ve(mu),activities:ve(pe({...Zo.properties.activities.items.properties,roleId:At(le)}))}),Ss=pe({...wa.properties,schemaVersion:{enum:["0.3"]},exceptions:ve(pe({id:le,activityId:le,name:de,description:Nt}))}),Un=e=>({...ve(e),minItems:1}),hu=pe({id:le,name:de,description:Nt}),bu=pe({objectId:le,roleIds:ve(le)}),gu=pe({id:le,text:de,obligation:{enum:["required","optional"]},appliesWhen:At(de),performerObjectIds:At(Un(le))}),yu={anyOf:[pe({kind:{enum:["before"]},beforeId:le,afterId:le}),pe({kind:{enum:["interchangeable"]},stepIds:{...ve(le),minItems:2}})]},vu=Object.fromEntries(Object.entries(Ss.properties.activities.items.properties).filter(([e])=>!["who","roleId","procedure","result","exception"].includes(e))),wu=pe({...Ss.properties,schemaVersion:{enum:["0.4"]},objects:ve(pe({...Xo,icon:de,information:ve(hu)})),activities:Un(pe({...vu,performers:At(Un(bu)),procedure:pe({steps:Un(gu),orderRules:ve(yu)}),results:Un(pe({id:le,text:de}))})),data:ve(pe({id:le,name:de,items:Un(pe({informationId:le,condition:At(de)}))})),relations:ve({anyOf:[pe({id:le,kind:{enum:["input","output"]},fromId:le,toId:le,dataId:le}),pe({...va.properties,kind:{enum:["business-exception","object-exception"]}})]})}),ku=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,zn])),Iu=pe({id:le,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:de,title:de,basedOn:pe({documentId:le,revision:de,verification:{enum:["unverified"]}}),intro:zn,index:ve(pe({activityId:le,purpose:Nt,connections:Nt,checkIds:ve(le)})),sections:ve(pe({id:le,activityId:At(le),title:de,preamble:zn})),guarantees:ve(pe({id:le,sectionId:le,title:de,blocks:ve({anyOf:[pe({kind:{enum:["prose"]},content:zn}),pe({kind:{enum:["example"]},exampleId:le})]})})),examples:ve(pe({id:le,guaranteeId:le,columns:ve(de),rows:ve(ve(zn))})),items:ve(pe({id:le,checkId:le,title:de,detailSummary:Nt,sectionId:le,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:pe(ku,[])})),notes:ve(pe({id:le,title:de,content:zn}))}),xs=pe({id:le,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:de,title:de,basedOn:pe({documentId:le,revision:de,verification:{enum:["unverified"]}}),objectId:le,states:ve(pe({id:le,name:de})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:de,transitions:ve(pe({id:le,sourceId:de,fromId:de,activityId:le,event:At(de),exception:At(de),condition:de,toId:de,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:de,note:de}))}),kr=Object.fromEntries(Object.entries({...xs.properties.transitions.items.properties,exceptionId:At(le)}).filter(([e])=>e!=="exception")),Su=pe({...xs.properties,schemaVersion:{enum:["0.2"]},transitions:ve(pe({...kr,conditionLabel:de},Object.keys(kr)))}),ni=(e,t)=>pe({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:de,documents:ve({anyOf:t.map(pu)}),sources:ve(pe({documentId:le,revision:de,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Nt})),externalDocuments:ve(pe({id:le,kind:{enum:["businessDesign"]},revision:de,activities:ve(pe({id:le,name:de}))})),diagnostics:ve(de)}),Ir={anyOf:[ni("0.1",["businessDesign","checkItems"]),ni("0.2",["businessDesign","checkItems","stateTransition"]),ni("0.3",["businessDesignRoles","checkItems","stateTransition"]),ni("0.4",["businessDesignStructured","checkItems","stateTransitionStructured"]),ni("0.5",["businessDesignD2","checkItems","stateTransitionStructured"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:Zo,businessDesignRoles:wa,businessDesignStructured:Ss,businessDesignD2:wu,checkItems:Iu,stateTransition:xs,stateTransitionStructured:Su}},qn=(e,t)=>ee(new Set(e).size===e.length,t);function xu(e,t,n){const i=(o,r,s)=>{const d=n(o,r,e.id);return s&&ee(t.parent.get(o)===s,"Structure owner mismatch: "+o),d};qn(e.data.map(o=>o.name),"Duplicate Data name");for(const o of e.data){ee(o.name===o.name.trim(),"Data name whitespace"),qn(o.items.map(r=>r.informationId),"Duplicate Data information");for(const r of o.items)i(r.informationId,"information")}for(const o of e.activities){if(o.performers!==null){qn(o.performers.map(g=>g.objectId),"Duplicate performer");for(const g of o.performers){i(g.objectId,"object"),qn(g.roleIds,"Duplicate performer Role");for(const c of g.roleIds)i(c,"role")}}let r=o.performers===null;for(const g of o.procedure.steps)if(g.performerObjectIds!==null){qn(g.performerObjectIds,"Duplicate Step performer");for(const c of g.performerObjectIds)ee(o.performers?.some(h=>h.objectId===c),"Step performer outside Activity assignment: "+c)}else o.performers?.length!==1&&(r=!0);r&&ee(e.findings.some(g=>g.status==="open"&&g.scope==="items"&&g.targetIds.includes(o.id)),"Unresolved performer requires an open Activity Finding: "+o.id);const s=o.procedure.steps.map(g=>g.id),d=new Map(s.map(g=>[g,[]])),a=new Set,l=[];for(const g of o.procedure.orderRules)if(g.kind==="before"){i(g.beforeId,"step",o.id),i(g.afterId,"step",o.id),ee(g.beforeId!==g.afterId,"Self Step order");const c=JSON.stringify([g.beforeId,g.afterId]);ee(!a.has(c),"Duplicate Step order"),a.add(c),d.get(g.beforeId).push(g.afterId),ee(s.indexOf(g.beforeId)<s.indexOf(g.afterId),"Standard Step order contradicts before constraint")}else{qn(g.stepIds,"Duplicate interchangeable Step");for(const c of g.stepIds)i(c,"step",o.id);l.push(g.stepIds)}const u=(g,c)=>{const h=[g],m=new Set;for(;h.length;){const f=h.pop();if(!m.has(f)){m.add(f);for(const b of d.get(f)){if(b===c)return!0;h.push(b)}}}return!1};for(const g of s)ee(!u(g,g),"Step order cycle");const p=new Set;for(const g of l){const c=JSON.stringify([...g].sort());ee(!p.has(c),"Duplicate interchangeable group"),p.add(c);for(const h of g)for(const m of g)h!==m&&ee(!u(h,m),"Interchangeable Steps conflict with before constraint")}}for(const o of e.relations)if(["input","output"].includes(o.kind)){const r=i(o.dataId,"data"),s=o.kind==="input"?o.fromId:o.toId;for(const d of r.items)i(d.informationId,"information",s)}}const ee=(e,t)=>{if(!e)throw Error(t)};function oi(e,t=Ir,n="$"){if(t.$ref)return oi(e,Ir.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{oi(e,o,n);return}catch(r){i.push(r.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&ee(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;ee(i===t.type,"Invalid type at "+n)}if(t.minLength&&ee(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&ee(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])ee(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))ee(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),oi(e[i],t.properties[i],n+"."+i)}t.type==="array"&&(t.minItems!==void 0&&ee(e.length>=t.minItems,"Too few items at "+n),e.forEach((i,o)=>oi(i,t.items,n+"["+o+"]")))}function Au(e){const t=new Map,n=new Map,i=new Map,o=new Map,r=(s,d,a,l=d.id)=>{ee(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,d.id),i.set(s.id,a),o.set(s.id,l)};for(const s of e.documents){r(s,s,"document");for(const[d,a]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const l of s[d]??[])r(l,s,a)}for(const s of e.externalDocuments){r(s,s,"document");for(const d of s.activities)r(d,s,"activity")}for(const s of e.documents.filter(d=>d.kind==="businessDesign"&&d.schemaVersion==="0.4")){for(const d of s.objects)for(const a of d.information)r(a,s,"information",d.id);for(const d of s.activities){for(const a of d.procedure.steps)r(a,s,"step",d.id);for(const a of d.results)r(a,s,"result",d.id)}for(const d of s.data)r(d,s,"data")}return{map:t,owner:n,types:i,parent:o}}function Eu(e){return oi(e),ka(e)}function ka(e,{allowUnresolvedFindings:t=!1}={}){ee(e.documents.length>0,"Document required");const n=Au(e),{map:i,owner:o,types:r}=n,s=[...e.diagnostics],d=new Set;for(const c of e.sources)if(c.uri){const h=new URL(c.uri);ee(h.protocol==="https:"&&!h.username&&!h.password,"Unsafe source URI")}const a=(c,h,m)=>(ee(i.has(c),"Dangling reference: "+c),h&&ee(r.get(c)===h,"Reference type mismatch: "+c),m&&ee(o.get(c)===m,"Cross-document mismatch: "+c),i.get(c)),l=c=>c?.some(h=>h.kind==="text"?h.value.trim().length>0:!0),u=(c,h)=>{for(const m of c)if(m.kind==="reference"&&(a(m.targetId,null,h),ee(["document","section","guarantee","example","check","note"].includes(r.get(m.targetId)),"Invalid rich reference target")),m.kind==="link"){const f=new URL(m.uri);ee(f.protocol==="https:"&&!f.username&&!f.password,"Unsafe external link")}};for(const c of e.documents)if(ee(e.formatVersion!=="0.1"||c.kind!=="stateTransition","State documents require formatVersion 0.2"),c.kind==="businessDesign"){ee(c.activities.length>0,"Activity required");const h=[...c.objects,...c.activities].map(b=>b.name);ee(new Set(h).size===h.length,"Duplicate visible name"),ee(h.every(b=>b===b.trim()&&!(["0.4","0.5"].includes(e.formatVersion)?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(w=>b.includes(w))),"Invalid Graph-visible name");for(const b of c.objects)ee(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.icon),"Invalid icon");if(["0.2","0.3","0.4"].includes(c.schemaVersion)&&(ee(new Set(c.roles.map(b=>b.name)).size===c.roles.length,"Duplicate Role name"),ee(c.roles.every(b=>b.name===b.name.trim()&&!/[\r\n]/.test(b.name)),"Invalid Role name"),c.schemaVersion!=="0.4"))for(const b of c.activities)b.roleId!==null?a(b.roleId,"role",c.id):d.add("Role未確定: "+b.id+" — "+b.who);for(const b of c.activities)ee(b.problem===null==(b.painLevel===null),"Problem/Pain pair mismatch");for(const b of c.exceptions??[])a(b.activityId,"activity",c.id);const m={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},f=new Set;c.schemaVersion==="0.4"&&xu(c,n,a);for(const b of c.relations){a(b.fromId,m[b.kind][0],c.id),a(b.toId,m[b.kind][1],c.id);const w=JSON.stringify([b.kind,b.fromId,b.toId,b.dataId??b.label]);ee(!f.has(w),"Duplicate relation"),f.add(w)}ee(new Set(c.findings.map(b=>b.sourceId)).size===c.findings.length,"Duplicate Finding source ID");for(const b of c.findings){ee(b.scope==="items"?b.targetIds.length+b.unresolvedTargets.length>0:!b.targetIds.length&&!b.unresolvedTargets.length,"Finding scope mismatch"),ee(new Set(b.targetIds).size===b.targetIds.length,"Duplicate Finding target");for(const w of b.targetIds)a(w,null,c.id),ee(["object","activity"].includes(r.get(w)),"Invalid Finding target");b.unresolvedTargets.length&&(ee(t,"Unresolved Finding target: "+b.sourceId),s.push("Finding参照未決: "+b.sourceId))}}else if(c.kind==="stateTransition"){const h=a(c.basedOn.documentId,"document");ee(h.kind==="businessDesign"&&h.objects,"State source must be an in-package BD"),ee(h.revision===c.basedOn.revision,"Stale State source revision"),a(c.objectId,"object",h.id),ee(!e.documents.some(f=>f!==c&&f.kind==="stateTransition"&&f.objectId===c.objectId),"Duplicate Object state declaration"),ee(c.states.length>0&&new Set(c.states.map(f=>f.name)).size===c.states.length,"Duplicate/empty state names"),ee(c.states.every(f=>!f.name.startsWith("@")),"Reserved state name"),ee(c.transitions.length<=1e3,"State transition row budget"),ee(new Set(c.transitions.map(f=>f.sourceId)).size===c.transitions.length,"Duplicate transition source ID");const m=new Map;for(const f of c.transitions){f.fromId!=="@new"&&a(f.fromId,"state",c.id),["@unknown","@none"].includes(f.toId)||a(f.toId,"state",c.id);const b=a(f.activityId,"activity",h.id);if(e.formatVersion!=="0.5"){const w=JSON.stringify([f.fromId,f.activityId,f.condition.trim().replace(/\s+/gu," ")]);ee(!m.has(w),"Duplicate state transition condition: "+m.get(w)+" / "+f.sourceId),m.set(w,f.sourceId)}if(["0.4","0.5"].includes(e.formatVersion))if(ee(f.path!=="normal"||f.exceptionId===null,"Normal transition cannot reference an exception"),f.exceptionId!==null){const w=a(f.exceptionId,"exception",h.id);ee(w.activityId===b.id,"Exception Activity mismatch")}else f.path==="exception"&&ee(s.includes("例外参照未決: "+f.id),"Unresolved exception requires a diagnostic");else ee(f.path!=="normal"||f.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+f.id);ee(f.effect!=="unchanged"||f.fromId===f.toId,"Unchanged state mismatch"),ee(f.effect!=="change"||!f.toId.startsWith("@")&&f.fromId!==f.toId,"Invalid changed state"),ee(f.effect!=="no-create"||f.fromId==="@new"&&f.toId==="@none","Invalid no-create transition"),ee(f.effect!=="constraint"||f.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+c.id)}else{const h=a(c.basedOn.documentId,"document");ee(h.kind==="businessDesign","Check source is not BD"),ee(h.revision===c.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+c.id),ee(new Set(c.items.map(f=>f.checkId)).size===c.items.length,"Duplicate Check ID");const m=new Set;for(const f of c.index){a(f.activityId,"activity",h.id),ee(!m.has(f.activityId),"Duplicate Activity index"),m.add(f.activityId),ee(new Set(f.checkIds).size===f.checkIds.length,"Duplicate Check binding");for(const b of f.checkIds)a(b,"check",c.id)}ee(new Set(c.sections.map(f=>f.activityId??f.title)).size===c.sections.length,"Duplicate Activity section");for(const f of c.sections)f.activityId!==null&&(a(f.activityId,"activity",h.id),ee(m.has(f.activityId),"Section missing from index")),u(f.preamble,c.id);for(const f of c.guarantees){ee(f.blocks.some(b=>b.kind==="prose"&&l(b.content)),"General guarantee prose required"),a(f.sectionId,"section",c.id);for(const b of f.blocks)if(b.kind==="prose")u(b.content,c.id);else{const w=a(b.exampleId,"example",c.id);ee(w.guaranteeId===f.id,"Example owner mismatch")}}for(const f of c.examples){a(f.guaranteeId,"guarantee",c.id),ee(f.columns.length>0,"Example columns required");for(const b of f.rows){ee(b.length===f.columns.length,"Example column mismatch");for(const w of b)u(w,c.id)}}for(const f of c.items){const b=a(f.sectionId,"section",c.id);ee(b.activityId===null?!c.index.some(w=>w.checkIds.includes(f.id)):c.index.some(w=>w.activityId===b.activityId&&w.checkIds.includes(f.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),ee(l(f.fields.guarantee)||l(f.fields.condition)&&l(f.fields.expectedResult),"Check guarantee required");for(const w of Object.values(f.fields))u(w,c.id);ee(b.activityId===null||c.index.some(w=>w.checkIds.includes(f.id)),"Unbound Check")}for(const f of c.notes)u(f.content,c.id);u(c.intro,c.id)}const p=e.diagnostics.filter(c=>c.startsWith("Role未確定:"));ee(new Set(p).size===p.length,"Duplicate unresolved Role diagnostic");for(const c of p)ee(d.delete(c),"Unresolved Who requires a diagnostic matching a current unresolved Activity");ee(d.size===0,"Unresolved Who requires a diagnostic");const g=new Set;for(const c of e.sources){a(c.documentId,"document");const h=c.documentId+"@"+c.revision;ee(!g.has(h),"Duplicate source descriptor"),g.add(h)}for(const c of e.externalDocuments)ee(e.sources.some(h=>h.documentId===c.id&&h.revision===c.revision),"External source revision missing"),ee(c.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+c.id);return{diagnostics:s,entities:i.size}}function Ou({data:e,original:t,namedPlans:n}){if(e.version!==1)throw Error("Unsupported Viewer document version");const o=(e.formatVersion==="0.5"?ka:ia)({formatVersion:["0.5","0.6","0.7"].includes(e.formatVersion)?e.formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(o.diagnostics)]};const r=e.business,s=[...r.objects,...r.activities],d=[...r.objects.map(p=>({...p,information:p.information.map(g=>typeof g=="string"?g:g.name),type:"object"})),...r.activities.map(p=>({id:p.id,type:"business",name:p.name,scope:p.scope,why:p.why,when:p.when,who:En(r,p),where:p.where,result:"results"in p?p.results.map(g=>g.text).join(`
`):p.result,...p.problem===null?{}:{problem:p.problem,pain_level:p.painLevel}}))],a=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(p=>p.basedOn.documentId===r.id).map(p=>{const g=new Map(p.states.map(h=>[h.id,h.name])),c={object:s.find(h=>h.id===p.objectId).name,states:p.states.map(h=>h.name),start:p.start,terminal:p.terminal,completeness:p.completeness,source:p.source,transitions:p.transitions.map(h=>({id:h.sourceId,from:g.get(h.fromId)??h.fromId,to:g.get(h.toId)??h.toId,activity:h.activityId,...h.event?{event:h.event}:{},...h.exceptionId?{exceptionId:h.exceptionId,exception:r.exceptions?.find(m=>m.id===h.exceptionId)?.name}:{},condition:h.condition,...h.conditionLabel?{conditionLabel:h.conditionLabel}:{},effect:h.effect,path:h.path,evidence:h.evidence,note:h.note}))};return[p.objectId,{model:c}]}))),l=r.relations.map(p=>({kind:p.kind,from:p.fromId,to:p.toId,label:Hr(r,p)})),u=["0.6","0.7"].includes(e.formatVersion)?(()=>{const g=_d(r).edges.map(c=>({kind:c.direction,from:c.direction==="input"?c.objectId:c.activityId,to:c.direction==="input"?c.activityId:c.objectId,label:c.label||(c.transferUndecided?"未決":"")}));for(const c of l)g.some(h=>h.kind===c.kind&&h.from===c.from&&h.to===c.to)||g.push(c);return g})():l;return{graph:ra({version:1,...r.scope?{scope:r.scope}:{},nodes:d,relations:u}),sections:Object.fromEntries(d.map(p=>[p.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},...n?{namedPlans:n}:{},model:e,activityOrder:r.activities.map(p=>p.id),objectStateTransitions:a,findings:[...r.findings.map(p=>({...p,displayId:p.sourceId,targets:[...p.targetIds,...p.unresolvedTargets],targetNames:[...p.targetIds,...p.unresolvedTargets].map(g=>s.find(c=>c.id===g)?.name??g)})),...nd(r)]}}const Ia=8*1024*1024;function Sa(e){return/^\s*[\[{]/.test(e)}function Yo(e){const t=[e];let n=0;for(;t.length;){const i=t.pop();if(i&&typeof i=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const o of Object.values(i))o&&typeof o=="object"&&t.push(o)}}for(const i of Array.isArray(e?.documents)?e.documents:[])if(i&&typeof i=="object"&&i.kind==="businessDesign"&&((i.objects?.length??0)+(i.activities?.length??0)>2e3||(i.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function Sr(e,t){if(!e||!["0.4","0.5","0.6","0.7"].includes(e.formatVersion))throw Error("JSON専用経路はformatVersion 0.4、旧候補0.5または候補0.6・0.7が必要です（旧形式は互換入力adapter）。");Yo(e);const n=e.formatVersion==="0.5"?Eu(e):Fi(e),i=e.documents.filter(r=>r.kind==="businessDesign");if(i.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const o=i[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:o,checks:e.documents.filter(r=>r.kind==="checkItems"),states:e.documents.filter(r=>r.kind==="stateTransition"),concepts:e.documents.filter(r=>r.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function ju(e,t){if(!Sa(e)){if(t!==void 0)throw Error("案を含まない文書です。");return uu(e)}if(new TextEncoder().encode(e).byteLength>Ia)throw Error("ローカルJSONは8MiB以内にしてください。");let n=na(e.replace(/^\uFEFF/,""));Yo(n);let i;if(n?.format==="alder-named-plans"){ou(n);for(const s of n.plans)if(Yo(s.package),s.package.documents.filter(d=>d.kind==="businessDesign").length!==1)throw Error("業務案 "+s.id+" にはBusiness Designが1件必要です。");const o=t??n.plans[0].id,r=n.plans.find(s=>s.id===o);if(!r)throw Error("指定した業務案がありません: "+o);i={selected:o,choices:n.plans.map(({id:s,name:d})=>({id:s,name:d}))},n=r.package}else if(t!==void 0)throw Error("指定した業務案がありません: "+t);if(["0.1","0.2","0.3"].includes(n?.formatVersion)){const o=Sr(ga(n),e);if(["0.1","0.2"].includes(n.formatVersion)){const r=o.data.business;r.schemaVersion="0.1",delete r.roles;for(const s of r.activities)"roleId"in s&&delete s.roleId;o.data.diagnostics=o.data.diagnostics.filter(s=>!s.startsWith("Role未確定:"))}return{...o,...i?{namedPlans:i}:{}}}return{...Sr(n,e),...i?{namedPlans:i}:{}}}function sn(e,t){return Ou(ju(e,t))}async function Cu(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>Ia)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!Sa(n))throw Error("JSONファイルの本文を確認してください。");return sn(n)}const Du=(e,t)=>As(e,t,!1);async function As(e,t,n=!0){let i;try{i=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(i.protocol!=="https:"||i.username||i.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const o=new AbortController,r=()=>o.abort();t?.addEventListener("abort",r,{once:!0}),t?.aborted&&r();const s=setTimeout(r,3e4);try{const d=await fetch(i.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:o.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!d.ok)throw Error("URL取得に失敗しました（HTTP "+d.status+"）。");const a=d.headers.get("content-type")?.toLowerCase()??"";if(a.includes("html")||!n&&a.includes("json")||a.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const l=2*1024*1024;if(Number(d.headers.get("content-length"))>l)throw Error("本文は2MiB以内にしてください。");const u=d.body?.getReader();if(!u)throw Error("本文を読み取れません。");let p=0,g="";const c=new TextDecoder;try{for(;;){const{done:h,value:m}=await u.read();if(h)break;if(p+=m.length,p>l){try{u.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}g+=c.decode(m,{stream:!0})}g+=c.decode()}finally{u.releaseLock()}if(n&&a.includes("json")&&!/^\s*[\[{]/.test(g))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(g))throw Error("HTMLページは読み込めません。");return g}catch(d){const a=o.signal.aborted;throw r(),a?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):d instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):d}finally{clearTimeout(s),t?.removeEventListener("abort",r)}}const Ji=Cu;async function ro(e,t){return sn(await As(e,t))}function Mu(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return sn(e)}const ao=e=>e==="question"?"要確認":"要修正";function Ru(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const i of["question","correction"]){const o=(e.findings??[]).filter(r=>r.status==="open"&&r.kind===i&&r.targets.includes(t.id)).length;o&&n.push(`${ao(i)} ${o}`)}return n}function Lu(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${ao(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const i=document.createElement("p");i.className="finding-summary",i.textContent=e.summary;const o=document.createElement("p");if(o.className="finding-target",o.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,i,o),e.unresolvedTargets.length){const r=document.createElement("p");r.className="finding-reference-warning",r.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(r)}return t.append(et(e.content)),t}function Nu(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function Pu(e,t,n,i=!1){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const r of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t)&&(!i||!s.id.startsWith("viewer:")))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=r.id,s.textContent=`${ao(r.kind)} · ${r.displayId??r.id}　${r.summary}`,s.onclick=()=>n({type:"finding",id:r.id}),o.append(s)}return o}function Tu(e,t,n,i,o){const r=document.createElement("section");r.className="findings-index";const s=document.createElement("label");s.className="finding-filter";const d=document.createElement("input");d.type="checkbox",d.checked=t,d.onchange=()=>n(d.checked),s.append(d,document.createTextNode("解消済みも表示")),r.append(s);const a=(u,p,g)=>{const c=document.createElement("button");c.className="node-navigate finding-index-row",c.dataset.findingKey=u.type+":"+u.id;const h=document.createElement("strong");h.textContent=p;const m=document.createElement("span");return m.textContent=g,c.append(h,m),c.onclick=()=>i(u),c},l=e.graph.nodes.filter(u=>(!o||u.id===o)&&typeof u.problem=="string");if(l.length){const u=document.createElement("h3");u.textContent="困りごと",r.append(u);for(const p of l)r.append(a({type:"problem",id:p.id},`${p.name}（${String(p.pain_level)}）`,String(p.problem)))}for(const[u,p]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const g=(e.findings??[]).filter(h=>(!o||h.targets.includes(o))&&(t||h.status==="open")&&(u==="broken"?h.unresolvedTargets.length>0:h.scope===u&&!h.unresolvedTargets.length));if(!g.length)continue;const c=document.createElement("h3");c.textContent=`${p}（${g.length}件）`,r.append(c);for(const h of g)r.append(a({type:"finding",id:h.id},`${ao(h.kind)} · ${h.displayId??h.id}${h.status==="resolved"?" · 解消済み":""}`,h.summary))}if(r.childElementCount===1){const u=document.createElement("p");u.textContent="表示する指摘はありません。",r.append(u)}return r}function qu(e){const t=ca(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([i,o])=>e.positions[i]?.every((r,s)=>r===o[s]))&&e.zoom===1&&e.scroll.every(i=>i===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(i=>i===0))?e:{...e,positions:t,...fc(),viewInset:[40,0],canvasOrigin:void 0}}function $u(e,t){const n=new Set;if(!t)return n;const i=new Set(e.filter(o=>o.kind==="output").map(o=>JSON.stringify([o.to,o.from])));return e.forEach((o,r)=>{o.kind==="input"&&i.has(JSON.stringify([o.from,o.to]))&&n.add(r)}),n}function Es(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function Wu(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{Es(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function zu(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(Es(t)),n.href}function Uu(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return Es(t)}const Os=`# Alderを使った設計業務 — Business Design

この文書は、Alderを使って業務を設計し、必要に応じて業務改善を検討し、検査項目を作成して後続の開発へ引き渡す利用業務を記述する。引き渡し前後の画面・システム設計、実装、検証と結果統合は、責任範囲外の業務との受け渡しとして記述する。Alderそのものの研究・保守・リリースは含まない。業務上の意図の唯一の正本（SSOT）はBusiness Designであり、コード、テスト、Check Item、Decision Record、生成されたGraph JSONはその代わりにならない。この文書は依頼者による業務上の意味のレビューを待つ草案であり、exportやテストの成功は承認を意味しない。

Business Designは依頼者との合意に使う文書である。本文は依頼者が実際に使用する言語で書き、依頼者自身が内容を理解し、誤りを指摘し、合意できることを前提とする。今回の本文は日本語とする。ヘッダーやセクション名は英語でもよい。

各Activityは責務を示しており、必ず順番に実行する工程ではない。1人が複数の役割を担ってもよい。**Whoはその業務を行うロール**を表し、同じ役割には同じ短い名称を使う。AIや人間への割り当て、支援者、確認者の分担はProcedureに記す。一方、\`依頼者\` Objectは、担当者が意図を受け取ったり、質問や結果を返したりする外部の相手を表す。同じ人が両方に関わる場合も、この2つの役割は区別する。

既存の運用規則の参照元は、[導入ガイド](../../docs/adoption.md)、[業務改善レビュー](../../docs/optimization-review.md)、[レビュー知識 v0.3](../../docs/phase2/review-knowledge-v0.3.md)、[Checkの追跡関係](../../docs/check-item-traceability.md)、[任意のDrift試行](../../docs/traceability-drift/study.md)である。見出しの業務名・Object名と、Input / Outputに書いたObject名から接続を読み取る。人間がヒアリング結果をまとめ、単独でも読み書き・保守できる文書とし、AIも同じ表面上の情報を編集して協業する。IconはAIが提案しても、人間が変更してもよい。非表示のIDや機械専用の注釈は管理しない。生成JSONは手で編集しない。Input / OutputはObjectと業務の間で実際に受け渡す情報を表し、一般的な参照資料の一覧にはしない。業務要件の問題による業務間の差し戻しは、発生側のHow / Exceptionと、再開側のException Whenまたは末尾の例外フローで表す。Graphの関係は再開側で一度だけ記述する。

\`Alder: 検査項目設計ナレッジ\` の現行内容は[検査項目の作成・レビュー手順](../../docs/adoption.md#draft-and-review-check-items-required)と[追跡関係](../../docs/check-item-traceability.md)にある。

検査項目のレビュー状態は期待結果の意味を人間が確認したかを表す。Objectに保持する「Testによる検証根拠の不足」は意味の未決とは異なり、実装後の別のAlderフォローアップで既存・新規Testの根拠を確認して保守する情報である。実装への引き渡し時点に、新規Testとの対応やTest evidenceの確定を要求しない。

外部の画面設計資料、システム要件書、検証結果は製品側が管理する。文書名は情報のまとまりを表し、専用ファイルや新しい台帳を要求しない。既存のIssue / PRや資料への参照で受け渡してもよい。検証結果はAlder実装レビュー、画面検証、システム要件・品質検証ごとの出所と証拠を区別して保持する。GUIを持たない製品では画面設計・画面検証を理由付きで非適用にできる。非適用は合格や未実施と区別する。

# Scope

この文書は、Alder利用者が業務設計を作成・合意し、現在の業務にProblem / Painがあれば任意で改善を検討し、合意済みの業務設計書と検査項目を後続の開発へ引き渡すまでを対象とする。設計・改善・実現と検証は一つのBusiness Designを業務上の正本として共有する。業務改善レビューは正常に成立している業務に対する任意の業務であり、設計の失敗や例外による差し戻しではない。改善候補を採用するのは依頼者・責任者であり、採用時には業務設計を改訂・再合意してから検査項目や実装を更新する。未承認の候補は現在の業務設計書に含めない。標準設計業務は合意済み業務設計書と検査項目の引き渡しで完了する。

画面設計、システム全体の要件・品質条件を整理するシステム設計、実装、実装後のAlder実装レビュー・製品検証・検証結果の統合は、前後の受け渡しを示すScope外の業務である。Alder実装レビューはAlderの開発ループで必須だが、この標準設計業務の境界には含めない。画面設計、SRの作成・妥当性・完全性の確認、UIや性能・安全性・運用等の実検証は製品側の責務であり、Alderレビューが代行・保証するものではない。検証結果の統合は報告と証拠の整理までを扱い、製品の採否・リリースを判断しない。Scope外であることは、製品に必要な作業を省略してよいという意味ではない。

同期漏れ検査は疑いが生じたときだけ使う任意の診断として独立させる。Business Graph JSONは外部ツール向けの任意の中間投影形式で、標準Activityや依頼者への成果物ではない。Alderという手法自体の研究、ガイド改訂の採否、PR・Release、製品の採否判断・デプロイの手順は記述しない。Activity Scopeのtrueは標準設計業務とその任意の診断、falseは受け渡しを示す範囲外の業務を表す。Object Scopeのtrueはこの業務境界内で成立・管理する成果物またはAlderが提供する知識・照合情報、falseは依頼者や範囲外の業務が成立・管理するObjectを表す。Input / Outputの向きだけで内外を決めない。

# Object 依頼者

## Scope

false

## Icon

users

## Information

- システム要件
- フィードバック・レビュー結果
- 業務上の判断・承認

# Object 業務設計書

## Scope

true

## Icon

file-text

## Information

- 業務範囲・目的
- 業務手順・入出力
- 業務間の相関・例外
- 現在の業務で経験されるProblem / Pain（ある場合）
- 期待結果・未決事項

# Object システム要件書

## Scope

false

## Icon

file-text

## Information

- 技術要件
- インフラ・開発言語・アーキテクチャ・フレームワーク
- 保守・性能・セキュリティ・運用等の適用要件と検証条件
- 要件の出所・版・適用範囲・担当責任者・未決事項
- 画面設計・画面検証の適用有無と非適用の理由

# Object 画面設計資料

## Scope

false

## Icon

panels-top-left

## Information

- 画面Reference（画面要件・部品・操作・表示状態）
- 画面チェックリスト・検証条件
- 対象版・適用範囲・確認結果・未決事項

# Object Alder: 業務相関ナレッジ

## Scope

true

## Icon

book-open

## Information

- 状態遷移・前後業務の確認観点

# Object Alder: 業務ナレッジ

## Scope

true

## Icon

book-open

## Information

- 業務手順・条件・考慮事項の確認観点
- Problem起点の改善レビューの観点

# Object Alder: 検査項目設計ナレッジ

## Scope

true

## Icon

book-open

## Information

- 検査項目の導出・レビュー観点
- IDと追跡関係の保守観点

# Object 判断記録

## Scope

true

## Icon

notebook-pen

## Information

- 判断内容・理由
- 残る制約・未決事項

# Object 検査項目

## Scope

true

## Icon

list-checks

## Information

- 期待結果・レビュー状態
- Business DesignとTestの対応
- Testによる検証根拠の不足

# Object コード

## Scope

false

## Icon

file-code

## Information

- 実装された振る舞い
- 変更内容
- 実装対象版・実行可能な成果物への参照

# Object テスト

## Scope

false

## Icon

flask-conical

## Information

- 実行可能な検証ケース・アサーション
- 検証対象と期待結果

# Object 検証結果

## Scope

false

## Icon

clipboard-check

## Information

- 検証元（Alder実装レビュー・画面検証・システム要件／品質検証）と担当責任者
- 実装・設計・要件の対象版と検証範囲
- 検査根拠・実行条件・観測結果・証拠への参照
- 合格・不合格・未実施・未決の区別と残る未検証範囲
- 非適用の理由・判断者

# Object 統合検証結果

## Scope

false

## Icon

files

## Information

- 対象版・要件・各検証結果への参照と対応
- 検証元ごとの結論・根拠・未検証範囲・非適用の理由
- 版や結論の不一致・未決事項・担当責任者

# Object 同期照合情報

## Scope

true

## Icon

fingerprint

## Information

- 原文・Check・Testの照合基準
- 検出されたTestの識別情報

# Object 同期漏れの候補

## Scope

true

## Icon

scan-search

## Information

- 古い関係・欠落の候補
- 再確認の理由

# Activity 業務設計

## Scope

true

## Why

業務上の意味と保証の合意

## When

目的・変更要求・現在業務のProblem / Painの記録依頼を受領したとき、または改善候補の採用判断を受けたとき

## Exception When

- 検査項目の設計 — 検査項目レビューで業務上の意味・条件・保証の修正や未決事項の解消が必要と判明したとき
- 実装 — 未決定の業務上の意味が見つかったとき

## Who

業務設計者

## Where

規定なし

## How

### Input

- 依頼者 — システム要件 / 現場で認識されたProblem・Pain / レビュー結果 / 改善候補の採用判断
- 業務設計書 — 現行業務要件 / 期待結果 / 未決事項 / Problem / Pain
- Alder: 業務相関ナレッジ — 状態遷移・前後業務の確認観点
- Alder: 業務ナレッジ — 業務手順・条件・考慮事項の確認観点

### Procedure

1. 業務設計者は依頼者からシステム要件、現場で認識されたProblem / Pain、または改善候補の採用判断を受け取る。更新時には業務設計書の現行業務要件・期待結果・未決事項とProblem / Painを確認する。変更が手段や新フローだけで提示され、背景を知ると案の採否が変わり得る場合は、草案化の前に必要な背景を依頼者へ確認する。会話や業務設計書にある背景と確定決定は聞き直さず、検討案か決定事項かも不明な場合だけ短く確認する。既知の範囲は未決事項を区別して進め、5W1H + Input / Output / Resultの形式で業務設計書の業務要件と期待結果を作成・更新する。現在の業務が成立していても困っていることがあれば、その具体的なProblemと相対的なPain levelを依頼者と確認して業務設計書へ記録する。未決の業務仕様とは区別し、改善のためにProblemを捏造しない。本文は依頼者が実際に使用する言語で書き、スコープ、業務手順、業務相関を整理する。AIは草案作成を支援できるが、責任を持つ人間の業務設計者が意味を確認する。
2. 業務設計者はAlder: 業務相関ナレッジを使って業務相関をレビューし、状態遷移と前後業務の確認結果を業務設計書へ反映して未決事項を整理する。
3. 業務設計者はAlder: 業務ナレッジを使って業務手順・条件・考慮事項をレビューし、確認結果を業務設計書へ反映して未決事項を整理する。
4. 改善候補が採用された場合、業務設計者は採用判断に基づく業務上の意味と残るProblem / Painを業務設計書に反映する。採用されない候補は現在の業務要件として記載しない。業務設計者は依頼者へ業務設計案と確認事項を伝えてレビューを依頼する。依頼者からレビュー結果を受け取り、未決事項について必要な判断も確認して、業務設計書と未決事項を更新する。
5. 依頼者や責任者の判断で未決事項が解消された時点で、確定した重要な判断と結果を判断記録（Decision Record）へ残す。どの未決事項を誰が判断し、何が確定したかを記録する。業務上の意味は業務設計書にも反映し、判断記録だけを正本の代わりにしない。
6. 業務設計書と未決事項が依頼者と合意できる状態になるまで、必要なレビューと修正を繰り返す。確認済みの内容と未決事項を区別し、将来のあらゆる方針の確定は求めない。

### Output

- 業務設計書 — 業務要件 / 期待結果 / 未決事項 / Problem / Pain
- 判断記録 — 判断内容 / 結果
- 依頼者 — 業務設計案 / レビュー依頼 / 確認事項

## Result

業務上の意味・手順・業務相関と、記録したProblem / Painが依頼者と確認・合意され、検査項目の設計または任意の業務改善レビューを開始できる。

# Activity 業務改善レビュー

## Scope

true

## Why

現在の業務上の困りごとに対する改善余地の検討

## When

合意済みの業務設計書に具体的なProblem / Painがあり、改善検討を依頼されたとき

## Who

業務設計者

## Where

規定なし

## How

### Input

- 業務設計書 — 現在の業務上の意味 / Problem / Pain
- 依頼者 — 改善検討の依頼 / 記録済みProblemの補足
- Alder: 業務ナレッジ — Problem起点の改善レビューの観点

### Procedure

1. 業務設計者は依頼者から改善検討の依頼と記録済みProblemの補足を受け、合意済み業務設計書に記録されたProblem / Painと維持すべき業務上の意味を確認する。新たな困りごとは先に業務設計で記録・確認し、未決の業務仕様と混同しない。
2. 業務設計者はAlder: 業務ナレッジの改善レビューの観点を使い、AIの提案支援を受けてProblemに関係する範囲で少数の代替業務案を検討する。Scopeと業務変更のDifficulty、期待する効果、前提と未確認事項を区別する。採用案が0件でもよい。
3. 業務設計者は依頼者へ改善候補と比較根拠、採用前に確認すべき事項を伝える。候補の採否は依頼者・責任者が判断する。このレビューでは業務設計書を変更しない。採用判断を受けた場合だけ、業務設計へ通常の情報の受け渡しとして渡し、業務設計書の更新・再合意を行う。候補の評価は現在の業務上の事実として扱わない。

### Output

- 依頼者 — 改善候補 / 比較根拠 / 確認事項

## Result

業務上の困りごとに対する候補と前提が依頼者に示され、採否を判断できる。採用時には業務設計書の更新・再合意へ進める。

# Activity 検査項目の設計

## Scope

true

## Why

期待結果と検証範囲の確認

## When

業務設計書の合意完了

## Who

業務設計者

## Where

規定なし

## How

### Input

- 業務設計書 — 業務要件 / 期待結果
- 検査項目 — 現行項目 / ID / レビュー状態 / 既存対応関係
- Alder: 検査項目設計ナレッジ — 検査項目の導出・レビュー・追跡関係の確認観点
- 依頼者 — 検査項目レビュー結果

### Procedure

業務設計者は、Alder: 検査項目設計ナレッジを使い、AIの草案・更新支援を受けて検査項目を整え、依頼者と期待結果を確認する。

1. 業務設計者は、業務設計書全体の業務要件・期待結果とAlder: 検査項目設計ナレッジを確認し、AIの草案作成支援を受けて検査項目の初版または更新案を作る。更新時は既存の検査項目を読み、ID、レビュー状態、業務設計書や既存Testとの対応を確認する。
2. 業務設計者は依頼者へ検査項目案の期待結果と確認事項を説明し、レビューを依頼する。
3. 業務設計者は依頼者から検査項目レビュー結果を受け取る。修正要求や確認結果もこの結果として扱う。
4. 業務設計者はAIの更新支援を受けて、検査項目自体の修正で解消できるレビュー結果を反映する。既存IDと業務設計書・既存Testとの追跡関係を保ち、レビュー状態（未レビュー / 要確認 / 確認済み / 要修正）を更新する。直接編集した場合も対応関係を確認する。
5. 業務設計者は依頼者と合意できるまで説明、レビュー、更新を繰り返す。確認済みの期待結果と未確認の候補を区別し、検査項目を実装へ渡す。

### Exception

- 検査項目レビューで業務上の意味・条件・保証の修正や未決事項が判明したときは、検査項目側で決めずに業務設計へ戻す。業務設計書が修正・合意された後、その内容から検査項目を更新し、レビューを再開する。

### Output

- 検査項目 — 期待結果 / レビュー状態 / 業務設計書との対応
- 依頼者 — 検査項目案 / レビュー依頼 / 確認事項

## Result

検査すべき期待結果が依頼者と合意され、実装へ引き渡せる。

# Activity システム設計

## Scope

false

## Why

業務上の意図を実現するシステム要件と技術手段の整理

## When

技術検討の依頼

## Who

システム開発者

## Where

規定なし

## How

### Input

- 業務設計書 — 業務要件
- 依頼者 — 製品全体の要求 / 既存の技術・運用上の制約

### Procedure

1. システム開発者は業務設計書の業務要件と依頼者から受け取る製品全体の要求・既存制約を基に、適用するシステム要件（SR）を整理する。保守・性能・セキュリティ・運用等の必要な品質条件と、対象環境・確認方法・判定根拠となる検証条件をシステム要件書へまとめる。SRの作成・妥当性・完全性の確認は製品側が担う。
2. システム開発者は必要な技術手段を検討し、インフラ・開発言語・アーキテクチャ・フレームワーク等の現在の技術条件を同じシステム要件書へ記録する。GUIの有無も確認し、画面を持たないバッチ・CLI等では画面設計・画面検証の非適用理由を残す。技術検討の詳細はAlderでは規定しない。
3. 要件の出所・版・適用範囲と担当責任者を残し、確定した条件と未決事項を分けて実装へ渡す。未提示・未決の要件を「要件なし」と扱わず、影響する作業と確認先を明らかにする。業務上の意味は業務設計書を正本とし、SRで上書きしない。

### Output

- システム要件書 — 適用SR / 技術要件 / 品質の検証条件 / 画面設計・検証の適用有無 / 未決事項と担当責任者

## Result

システム全体の適用要件と検証条件、残る未決事項が区別され、画面設計・実装・製品検証へ引き渡せる。

# Activity 画面設計

## Scope

false

## Why

利用者が業務を行える画面と確認条件の具体化

## When

GUIを備える実装範囲の業務要件・確認済み検査項目と、適用SRの提供状況が示されたとき

## Who

画面設計者

## Where

製品が対象とする画面の利用環境

## How

### Input

- 業務設計書 — 業務手順 / 入出力 / 利用環境
- 検査項目 — 確認済みの業務上の期待結果
- システム要件書 — 画面に関係する適用SR / 技術条件
- 依頼者 — 画面要件 / 画面案の確認結果

### Procedure

1. 画面設計者は業務設計書、確認済み検査項目、システム要件書と依頼者の画面要件を読み、対象範囲の画面・部品・操作・表示状態を画面Referenceとして画面設計資料へまとめる。同じ資料に画面チェックリストと実際の画面で確かめる検証条件を整理する。
2. 画面設計者は画面案と確認事項を依頼者へ示し、確認結果を反映する。対象版・適用範囲・確認結果と未決事項を区別して実装へ渡す。SR等の未提供・未決がある場合は、それに依存する範囲と確認先を明らかにし、影響しない範囲は進める。画面設計資料で業務上の意味や確認済みの期待結果を変更しない。

### Output

- 画面設計資料 — 画面Reference / 画面チェックリスト・検証条件 / 確認結果と未決事項
- 依頼者 — 画面案 / 確認事項

## Result

実装する画面と検証時に確かめる条件が整理され、実装・画面検証へ引き渡せる。

# Activity 実装

## Scope

false

## Why

意図した業務の実現

## When

確認済み検査項目の実装依頼と、対象範囲の適用SR・GUI画面設計資料の提供状況を受領したとき

## Who

システム開発者

## Where

規定なし

## How

### Input

- 業務設計書 — 業務要件
- システム要件書 — 適用SR / 技術要件 / 品質の検証条件 / 未決事項
- 画面設計資料 — GUI対象範囲の画面Reference / 画面チェックリスト・検証条件 / 未決事項
- 検査項目 — 確認済み期待結果
- コード — 既存の実装
- テスト — 既存のテスト

### Procedure

1. システム開発者は業務設計書の業務要件と検査項目の確認済み期待結果、システム要件書の適用SR・技術要件・検証条件を受け取る。GUIの対象範囲では画面設計資料の画面Referenceと画面チェックリスト・検証条件も受け取り、既存のコードとテストを踏まえて、コードと実行可能なテストを作成・更新する。
2. 使用した設計・要件の版と実装対象版を特定できるようにし、実行可能な成果物への参照をコードとともに渡す。入力の未提供・未決がある場合は、影響範囲・進められない作業・確認先を明らかにし、影響しない範囲は進める。外部の画面・SR・検証結果を業務設計書や確認済み期待結果の代わりにしない。

### Exception

- 実装中に未決定の業務上の意味が明らかになったときは、コードやテストで方針を決めず、具体的な問いを業務設計へ戻す。

### Output

- コード — 実装結果 / 対象版 / 実行可能な成果物への参照
- テスト — 実行可能な検証

## Result

合意済みの業務要件と検査項目を受けた実装が用意され、製品側の検証へ進める。

# Activity Alder実装レビュー

## Scope

false

## Why

業務上の意味と提供済みSRに対する実装適合・検証根拠の確認

## When

実装・テストと比較対象の設計・要件の版が示されたとき

## Who

実装レビュー担当者

## Where

規定なし

## How

### Input

- 業務設計書 — 合意済み業務要件 / 期待結果
- 検査項目 — 確認済み期待結果 / レビュー状態 / Testとの対応
- 判断記録 — 文書化された判断と理由
- システム要件書 — 提供済みSRの出所・版・適用範囲 / 未決事項
- コード — 対象版の実装
- テスト — 対象版の検証ケース・アサーション
- 検証結果 — 利用可能な製品検証の実行結果・証拠

### Procedure

1. 実装レビュー担当者は、実装時の作業履歴を共有しない別のAIまたは新しいコンテキストで、業務設計書、検査項目、判断記録、提供済みのシステム要件書を読み、対象版のコード・テストと利用可能な検証結果を照合する。レビュー中は設計・実装・対応記録を変更しない。
2. 業務上の期待結果とTestの検証内容、変更範囲に適用するSRへの適合を確認し、根拠・不一致・未決の業務判断・不足する証拠を検証結果へ記録する。SRの未提示・未読・非適用を区別し、非適用には理由を残す。レビューはSRの妥当性・完全性や、未実施のUI・性能・安全性・運用試験の成功を保証しない。

### Output

- 検証結果 — Alder実装レビューの対象版・範囲 / 適合所見・根拠 / 未決事項・検証不足

## Result

実装の適合所見と確認できない範囲が区別され、製品検証の結果と合わせて整理できる。

# Activity 製品検証

## Scope

false

## Why

実際の製品が画面・システム要件と品質条件を満たすかの確認

## When

検証対象版の実装と適用する検証条件が用意されたとき

## Who

検証担当者

## Where

適用する画面・システム要件の検証環境

## How

### Input

- コード — 検証対象版の実装 / 実行可能な成果物への参照
- テスト — 実行可能な検証ケース・期待結果
- システム要件書 — 適用SR / 品質の検証条件 / 画面検証の適用有無 / 未決事項
- 画面設計資料 — GUI対象範囲の画面Reference / 画面チェックリスト・検証条件

### Procedure

1. 検証担当者はコードの対象版・成果物とテストを受け取り、システム要件書の適用範囲と検証条件に沿ってテストや性能・安全性・運用等の検証を実施する。GUIの対象範囲では、実際の画面を操作して画面設計資料のReference・チェックリストと照合する。方法・環境・必要な試験の選択は製品側が担う。
2. 画面検証とSR・品質検証を区別し、対象版・条件・観測結果・証拠への参照・担当責任者を検証結果へ残す。合格・不合格、実施できなかった範囲、条件が未決の範囲を分け、非GUI製品の画面検証はシステム要件書の非適用理由を引き継ぐ。自動テストの成功だけから、実際には観測していない画面・品質条件の合格を推定しない。

### Output

- 検証結果 — 画面検証とSR・品質検証それぞれの対象版・範囲・担当責任者 / 観測結果・証拠 / 未実施・未決・非適用

## Result

実検証で確認できた条件と残る未検証範囲が明らかになり、Alder実装レビューの所見と合わせて整理できる。

# Activity 検証結果の統合

## Scope

false

## Why

製品の採否判断に必要な検証範囲・根拠・残課題の明確化

## When

対象版の各検証結果、または未実施・未決の状態が示されたとき

## Who

検証担当者

## Where

規定なし

## How

### Input

- コード — 実装対象版 / 実行可能な成果物への参照
- 業務設計書 — 比較対象の業務要件と版
- 検査項目 — 確認済み期待結果と版
- システム要件書 — 適用SR・検証条件と版 / 非適用の理由 / 未決事項と担当責任者
- 画面設計資料 — GUI対象範囲の画面Reference・検証条件と版
- 検証結果 — Alder実装レビュー・画面検証・SR品質検証それぞれの結果 / 根拠 / 未検証範囲・未決事項

### Procedure

1. 検証担当者はコードの対象版に対し、業務設計書・検査項目・システム要件書とGUI対象範囲の画面設計資料の版・適用範囲を確認する。検証結果に含まれる各報告の検査根拠・対象版・範囲を照合する。
2. 検証元ごとに合格・不合格・未実施・未決と非適用を区別し、元の所見と分類を保ったまま、根拠への参照、版や結論の不一致、残る未検証範囲と担当責任者を統合検証結果へまとめる。対象版や条件が変わった範囲は再検証が必要と示し、過去の結果を現行版の合格根拠にしない。未提供の結果や責任者不明もそのまま明示し、全体合格に読み替えない。結果全文のコピーや専用の報告書は要求しない。
3. 依頼者へ統合検証結果と残る確認事項を渡す。統合では業務設計書・確認済み期待結果や原報告を上書きせず、製品として受け入れるか、何を修正・保留するかは人間が別に判断する。統合の完了は採用・merge・releaseの承認ではない。

### Output

- 統合検証結果 — 対象版と各検証の対応 / 根拠への参照 / 不一致・未検証・未決事項・担当責任者
- 依頼者 — 統合検証結果への参照 / 残る確認事項

## Result

確認できた範囲と残課題が検証元・対象版に沿って整理され、人間が製品の採否や追加対応を判断できる。

# Activity 同期漏れ検査

## Scope

true

## Why

原文・検査項目・テストの同期漏れの検出

## When

業務設計書・検査項目・テストの対応関係に同期漏れの疑いが生じたとき

## Who

システム開発者

## Where

規定なし

## How

### Input

- 業務設計書 — 現行原文項目
- 検査項目 — 現在のCheck本文
- 同期照合情報 — 原文・Check・Testの照合基準 / Test ID
- テスト — 期待結果 / アサーション

### Procedure

システム開発者は、通常工程で維持される追跡関係の同期漏れが疑われる部分を任意に診断し、再確認候補を検出する。試行用のフィクスチャまたはプロダクト用アダプターで読み取り専用の検出器を実行し、文章の更新状態と業務上の正しさを区別する。

1. システム開発者は業務設計書の現行原文項目、検査項目のCheck本文、同期照合情報のpinとTest IDを照合し、人間のレビュー状態を変更せずに更新状態と参照の不一致を算出する。
2. 古くなった関係や欠落した関係を理由とともに再確認の候補として記録する。不具合として自動分類しない。
3. 影響するCheckを原文と照合する。Check本文の変更と原文の再確認を区別して同期照合情報を更新する。
4. 変更したCheckの期待結果をテストの期待結果・アサーションと照合する。照合を完了した関係だけpinを更新し、検査結果と残る再確認候補をまとめる。

### Output

- 同期漏れの候補 — 再確認候補 / 理由
- 同期照合情報 — 照合済みの基準値

## Result

疑いのある対応関係の照合状態と再確認候補が明らかになり、影響する検査項目を再確認できる。
`,Vu=`{
  "format": "alder-document-package",
  "formatVersion": "0.4",
  "revision": "alder-design-package-1",
  "documents": [
    {
      "id": "alder-design",
      "schemaVersion": "0.3",
      "kind": "businessDesign",
      "revision": "alder-design-1",
      "title": "Alderを使った設計業務 — Business Design",
      "preface": "この文書は、Alderを使って業務を設計し、必要に応じて業務改善を検討し、検査項目を作成して後続の開発へ引き渡す利用業務を記述する。引き渡し前後の画面・システム設計、実装、検証と結果統合は、責任範囲外の業務との受け渡しとして記述する。Alderそのものの研究・保守・リリースは含まない。業務上の意図の唯一の正本（SSOT）はBusiness Designであり、コード、テスト、Check Item、Decision Record、生成されたGraph JSONはその代わりにならない。この文書は依頼者による業務上の意味のレビューを待つ草案であり、exportやテストの成功は承認を意味しない。\\n\\nBusiness Designは依頼者との合意に使う文書である。本文は依頼者が実際に使用する言語で書き、依頼者自身が内容を理解し、誤りを指摘し、合意できることを前提とする。今回の本文は日本語とする。ヘッダーやセクション名は英語でもよい。\\n\\n各Activityは責務を示しており、必ず順番に実行する工程ではない。1人が複数の役割を担ってもよい。**Whoはその業務を行うロール**を表し、同じ役割には同じ短い名称を使う。AIや人間への割り当て、支援者、確認者の分担はProcedureに記す。一方、\`依頼者\` Objectは、担当者が意図を受け取ったり、質問や結果を返したりする外部の相手を表す。同じ人が両方に関わる場合も、この2つの役割は区別する。\\n\\n既存の運用規則の参照元は、[導入ガイド](../../docs/adoption.md)、[業務改善レビュー](../../docs/optimization-review.md)、[レビュー知識 v0.3](../../docs/phase2/review-knowledge-v0.3.md)、[Checkの追跡関係](../../docs/check-item-traceability.md)、[任意のDrift試行](../../docs/traceability-drift/study.md)である。Activity・Objectと、そのInput / Outputの参照から接続を読み取る。業務設計書と検査項目は一つのJSONに保持し、ID・参照・版はPluginが管理する。人間はViewerで業務の内容を確認し、AIに作成・更新を依頼する。Iconは提案や指示により変更できる。Input / OutputはObjectと業務の間で実際に受け渡す情報を表し、一般的な参照資料の一覧にはしない。業務要件の問題による業務間の差し戻しは、発生側のHow / Exceptionと、再開側のException Whenまたは末尾の例外フローで表す。Graphの関係は再開側で一度だけ記述する。\\n\\n\`Alder: 検査項目設計ナレッジ\` の現行内容は[検査項目の作成・レビュー手順](../../docs/adoption.md#draft-and-review-check-items-required)と[追跡関係](../../docs/check-item-traceability.md)にある。\\n\\n検査項目のレビュー状態は期待結果の意味を人間が確認したかを表す。Objectに保持する「Testによる検証根拠の不足」は意味の未決とは異なり、実装後の別のAlderフォローアップで既存・新規Testの根拠を確認して保守する情報である。実装への引き渡し時点に、新規Testとの対応やTest evidenceの確定を要求しない。\\n\\n外部の画面設計資料、システム要件書、検証結果は製品側が管理する。文書名は情報のまとまりを表し、専用ファイルや新しい台帳を要求しない。既存のIssue / PRや資料への参照で受け渡してもよい。検証結果はAlder実装レビュー、画面検証、システム要件・品質検証ごとの出所と証拠を区別して保持する。GUIを持たない製品では画面設計・画面検証を理由付きで非適用にできる。非適用は合格や未実施と区別する。",
      "scope": "この文書は、Alder利用者が業務設計を作成・合意し、現在の業務にProblem / Painがあれば任意で改善を検討し、合意済みの業務設計書と検査項目を後続の開発へ引き渡すまでを対象とする。設計・改善・実現と検証は一つのBusiness Designを業務上の正本として共有する。業務改善レビューは正常に成立している業務に対する任意の業務であり、設計の失敗や例外による差し戻しではない。改善候補を採用するのは依頼者・責任者であり、採用時には業務設計を改訂・再合意してから検査項目や実装を更新する。未承認の候補は現在の業務設計書に含めない。標準設計業務は合意済み業務設計書と検査項目の引き渡しで完了する。\\n\\n画面設計、システム全体の要件・品質条件を整理するシステム設計、実装、実装後のAlder実装レビュー・製品検証・検証結果の統合は、前後の受け渡しを示すScope外の業務である。Alder実装レビューはAlderの開発ループで必須だが、この標準設計業務の境界には含めない。画面設計、SRの作成・妥当性・完全性の確認、UIや性能・安全性・運用等の実検証は製品側の責務であり、Alderレビューが代行・保証するものではない。検証結果の統合は報告と証拠の整理までを扱い、製品の採否・リリースを判断しない。Scope外であることは、製品に必要な作業を省略してよいという意味ではない。\\n\\n同期漏れ検査は疑いが生じたときだけ使う任意の診断として独立させる。Business Graph JSONは外部ツール向けの任意の中間投影形式で、標準Activityや依頼者への成果物ではない。Alderという手法自体の研究、ガイド改訂の採否、PR・Release、製品の採否判断・デプロイの手順は記述しない。Activity Scopeのtrueは標準設計業務とその任意の診断、falseは受け渡しを示す範囲外の業務を表す。Object Scopeのtrueはこの業務境界内で成立・管理する成果物またはAlderが提供する知識・照合情報、falseは依頼者や範囲外の業務が成立・管理するObjectを表す。Input / Outputの向きだけで内外を決めない。",
      "objects": [
        {
          "id": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "name": "依頼者",
          "scope": false,
          "icon": "users",
          "information": [
            "システム要件",
            "フィードバック・レビュー結果",
            "業務上の判断・承認"
          ]
        },
        {
          "id": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "name": "業務設計書",
          "scope": true,
          "icon": "file-text",
          "information": [
            "業務範囲・目的",
            "業務手順・入出力",
            "業務間の相関・例外",
            "現在の業務で経験されるProblem / Pain（ある場合）",
            "期待結果・未決事項"
          ]
        },
        {
          "id": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "name": "システム要件書",
          "scope": false,
          "icon": "file-text",
          "information": [
            "技術要件",
            "インフラ・開発言語・アーキテクチャ・フレームワーク",
            "保守・性能・セキュリティ・運用等の適用要件と検証条件",
            "要件の出所・版・適用範囲・担当責任者・未決事項",
            "画面設計・画面検証の適用有無と非適用の理由"
          ]
        },
        {
          "id": "2b16611b-d83b-5586-af1a-80f81519f9f5",
          "name": "画面設計資料",
          "scope": false,
          "icon": "panels-top-left",
          "information": [
            "画面Reference（画面要件・部品・操作・表示状態）",
            "画面チェックリスト・検証条件",
            "対象版・適用範囲・確認結果・未決事項"
          ]
        },
        {
          "id": "8923acfa-5c39-5207-b14b-3aa42260f010",
          "name": "Alder: 業務相関ナレッジ",
          "scope": true,
          "icon": "book-open",
          "information": [
            "状態遷移・前後業務の確認観点"
          ]
        },
        {
          "id": "dfe4f16e-dc2c-579c-a3f6-b498dfa04bda",
          "name": "Alder: 業務ナレッジ",
          "scope": true,
          "icon": "book-open",
          "information": [
            "業務手順・条件・考慮事項の確認観点",
            "Problem起点の改善レビューの観点"
          ]
        },
        {
          "id": "31027247-2568-5a9a-b6ed-22efb0c9e0d8",
          "name": "Alder: 検査項目設計ナレッジ",
          "scope": true,
          "icon": "book-open",
          "information": [
            "検査項目の導出・レビュー観点",
            "IDと追跡関係の保守観点"
          ]
        },
        {
          "id": "9cac475b-2725-5274-8724-02b909bc50d1",
          "name": "判断記録",
          "scope": true,
          "icon": "notebook-pen",
          "information": [
            "判断内容・理由",
            "残る制約・未決事項"
          ]
        },
        {
          "id": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "name": "検査項目",
          "scope": true,
          "icon": "list-checks",
          "information": [
            "期待結果・レビュー状態",
            "Business DesignとTestの対応",
            "Testによる検証根拠の不足"
          ]
        },
        {
          "id": "90d61e0f-35f9-5092-87b5-37939127b09f",
          "name": "コード",
          "scope": false,
          "icon": "file-code",
          "information": [
            "実装された振る舞い",
            "変更内容",
            "実装対象版・実行可能な成果物への参照"
          ]
        },
        {
          "id": "ace541a0-d4a2-59bc-9ade-f14968016a30",
          "name": "テスト",
          "scope": false,
          "icon": "flask-conical",
          "information": [
            "実行可能な検証ケース・アサーション",
            "検証対象と期待結果"
          ]
        },
        {
          "id": "b468672a-c472-5407-8656-5202cbdfc19f",
          "name": "検証結果",
          "scope": false,
          "icon": "clipboard-check",
          "information": [
            "検証元（Alder実装レビュー・画面検証・システム要件／品質検証）と担当責任者",
            "実装・設計・要件の対象版と検証範囲",
            "検査根拠・実行条件・観測結果・証拠への参照",
            "合格・不合格・未実施・未決の区別と残る未検証範囲",
            "非適用の理由・判断者"
          ]
        },
        {
          "id": "4657b60d-dd29-5ecd-88a7-594fdcf3befd",
          "name": "統合検証結果",
          "scope": false,
          "icon": "files",
          "information": [
            "対象版・要件・各検証結果への参照と対応",
            "検証元ごとの結論・根拠・未検証範囲・非適用の理由",
            "版や結論の不一致・未決事項・担当責任者"
          ]
        },
        {
          "id": "a03a2276-7aa5-596c-8f18-5510afae5fbe",
          "name": "同期照合情報",
          "scope": true,
          "icon": "fingerprint",
          "information": [
            "原文・Check・Testの照合基準",
            "検出されたTestの識別情報"
          ]
        },
        {
          "id": "69c0151d-4d7a-5b1c-a5a9-65e63eeedd3b",
          "name": "同期漏れの候補",
          "scope": true,
          "icon": "scan-search",
          "information": [
            "古い関係・欠落の候補",
            "再確認の理由"
          ]
        }
      ],
      "activities": [
        {
          "id": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "name": "業務設計",
          "scope": true,
          "why": "業務上の意味と保証の合意",
          "when": "目的・変更要求・現在業務のProblem / Painの記録依頼を受領したとき、または改善候補の採用判断を受けたとき",
          "who": "業務設計者",
          "where": "規定なし",
          "procedure": "1. 業務設計者は依頼者からシステム要件、現場で認識されたProblem / Pain、または改善候補の採用判断を受け取る。更新時には業務設計書の現行業務要件・期待結果・未決事項とProblem / Painを確認する。変更が手段や新フローだけで提示され、背景を知ると案の採否が変わり得る場合は、草案化の前に必要な背景を依頼者へ確認する。会話や業務設計書にある背景と確定決定は聞き直さず、検討案か決定事項かも不明な場合だけ短く確認する。既知の範囲は未決事項を区別して進め、5W1H + Input / Output / Resultの形式で業務要件と期待結果を整理し、Pluginに依頼して業務設計書のJSONを作成・更新する。現在の業務が成立していても困っていることがあれば、その具体的なProblemと相対的なPain levelを依頼者と確認して業務設計書へ記録する。未決の業務仕様とは区別し、改善のためにProblemを捏造しない。本文は依頼者が実際に使用する言語で書き、スコープ、業務手順、業務相関を整理する。AIは草案作成を支援できるが、責任を持つ人間の業務設計者が意味を確認する。\\n2. 業務設計者はAlder: 業務相関ナレッジを使って業務相関をレビューし、状態遷移と前後業務の確認結果を業務設計書へ反映して未決事項を整理する。\\n3. 業務設計者はAlder: 業務ナレッジを使って業務手順・条件・考慮事項をレビューし、確認結果を業務設計書へ反映して未決事項を整理する。\\n4. 改善候補が採用された場合、業務設計者は採用判断に基づく業務上の意味と残るProblem / Painを業務設計書に反映する。採用されない候補は現在の業務要件として記載しない。業務設計者は依頼者へ業務設計案と確認事項を伝えてレビューを依頼する。依頼者からレビュー結果を受け取り、未決事項について必要な判断も確認して、業務設計書と未決事項を更新する。\\n5. 依頼者や責任者の判断で未決事項が解消された時点で、確定した重要な判断と結果を判断記録（Decision Record）へ残す。どの未決事項を誰が判断し、何が確定したかを記録する。業務上の意味は業務設計書にも反映し、判断記録だけを正本の代わりにしない。\\n6. 業務設計書と未決事項が依頼者と合意できる状態になるまで、必要なレビューと修正を繰り返す。確認済みの内容と未決事項を区別し、将来のあらゆる方針の確定は求めない。",
          "exception": null,
          "result": "業務上の意味・手順・業務相関と、記録したProblem / Painが依頼者と確認・合意され、検査項目の設計または任意の業務改善レビューを開始できる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-285a6c5b4bca97f50fdc0951c4e888d5"
        },
        {
          "id": "cb68420b-c2c3-5d91-9a95-612e42d456e7",
          "name": "業務改善レビュー",
          "scope": true,
          "why": "現在の業務上の困りごとに対する改善余地の検討",
          "when": "合意済みの業務設計書に具体的なProblem / Painがあり、改善検討を依頼されたとき",
          "who": "業務設計者",
          "where": "規定なし",
          "procedure": "1. 業務設計者は依頼者から改善検討の依頼と記録済みProblemの補足を受け、合意済み業務設計書に記録されたProblem / Painと維持すべき業務上の意味を確認する。新たな困りごとは先に業務設計で記録・確認し、未決の業務仕様と混同しない。\\n2. 業務設計者はAlder: 業務ナレッジの改善レビューの観点を使い、AIの提案支援を受けてProblemに関係する範囲で少数の代替業務案を検討する。Scopeと業務変更のDifficulty、期待する効果、前提と未確認事項を区別する。採用案が0件でもよい。\\n3. 業務設計者は依頼者へ改善候補と比較根拠、採用前に確認すべき事項を伝える。候補の採否は依頼者・責任者が判断する。このレビューでは業務設計書を変更しない。採用判断を受けた場合だけ、業務設計へ通常の情報の受け渡しとして渡し、業務設計書の更新・再合意を行う。候補の評価は現在の業務上の事実として扱わない。",
          "exception": null,
          "result": "業務上の困りごとに対する候補と前提が依頼者に示され、採否を判断できる。採用時には業務設計書の更新・再合意へ進める。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-285a6c5b4bca97f50fdc0951c4e888d5"
        },
        {
          "id": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "name": "検査項目の設計",
          "scope": true,
          "why": "期待結果と検証範囲の確認",
          "when": "業務設計書の合意完了",
          "who": "業務設計者",
          "where": "規定なし",
          "procedure": "業務設計者は、Alder: 検査項目設計ナレッジを使い、AIの草案・更新支援を受けて検査項目を整え、依頼者と期待結果を確認する。\\n\\n1. 業務設計者は、業務設計書全体の業務要件・期待結果とAlder: 検査項目設計ナレッジを確認し、AIの草案作成支援を受けて検査項目の初版または更新案を作る。更新時は既存の検査項目を読み、ID、レビュー状態、業務設計書や既存Testとの対応を確認する。\\n2. 業務設計者は依頼者へ検査項目案の期待結果と確認事項を説明し、レビューを依頼する。\\n3. 業務設計者は依頼者から検査項目レビュー結果を受け取る。修正要求や確認結果もこの結果として扱う。\\n4. 業務設計者はAIの更新支援を受けて、検査項目自体の修正で解消できるレビュー結果を反映する。既存IDと業務設計書・既存Testとの追跡関係を保ち、レビュー状態（未レビュー / 要確認 / 確認済み / 要修正）を更新する。更新後も対応関係を確認する。\\n5. 業務設計者は依頼者と合意できるまで説明、レビュー、更新を繰り返す。確認済みの期待結果と未確認の候補を区別し、検査項目を実装へ渡す。",
          "exception": "- 検査項目レビューで業務上の意味・条件・保証の修正や未決事項が判明したときは、検査項目側で決めずに業務設計へ戻す。業務設計書が修正・合意された後、その内容から検査項目を更新し、レビューを再開する。",
          "result": "検査すべき期待結果が依頼者と合意され、実装へ引き渡せる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-285a6c5b4bca97f50fdc0951c4e888d5"
        },
        {
          "id": "d8de0d5e-3176-57ac-96a1-961b96142ce3",
          "name": "システム設計",
          "scope": false,
          "why": "業務上の意図を実現するシステム要件と技術手段の整理",
          "when": "技術検討の依頼",
          "who": "システム開発者",
          "where": "規定なし",
          "procedure": "1. システム開発者は業務設計書の業務要件と依頼者から受け取る製品全体の要求・既存制約を基に、適用するシステム要件（SR）を整理する。保守・性能・セキュリティ・運用等の必要な品質条件と、対象環境・確認方法・判定根拠となる検証条件をシステム要件書へまとめる。SRの作成・妥当性・完全性の確認は製品側が担う。\\n2. システム開発者は必要な技術手段を検討し、インフラ・開発言語・アーキテクチャ・フレームワーク等の現在の技術条件を同じシステム要件書へ記録する。GUIの有無も確認し、画面を持たないバッチ・CLI等では画面設計・画面検証の非適用理由を残す。技術検討の詳細はAlderでは規定しない。\\n3. 要件の出所・版・適用範囲と担当責任者を残し、確定した条件と未決事項を分けて実装へ渡す。未提示・未決の要件を「要件なし」と扱わず、影響する作業と確認先を明らかにする。業務上の意味は業務設計書を正本とし、SRで上書きしない。",
          "exception": null,
          "result": "システム全体の適用要件と検証条件、残る未決事項が区別され、画面設計・実装・製品検証へ引き渡せる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-89dad1594c2b0a2a5abc007054500e7b"
        },
        {
          "id": "23427931-db9c-5b16-a397-3fafd429d989",
          "name": "画面設計",
          "scope": false,
          "why": "利用者が業務を行える画面と確認条件の具体化",
          "when": "GUIを備える実装範囲の業務要件・確認済み検査項目と、適用SRの提供状況が示されたとき",
          "who": "画面設計者",
          "where": "製品が対象とする画面の利用環境",
          "procedure": "1. 画面設計者は業務設計書、確認済み検査項目、システム要件書と依頼者の画面要件を読み、対象範囲の画面・部品・操作・表示状態を画面Referenceとして画面設計資料へまとめる。同じ資料に画面チェックリストと実際の画面で確かめる検証条件を整理する。\\n2. 画面設計者は画面案と確認事項を依頼者へ示し、確認結果を反映する。対象版・適用範囲・確認結果と未決事項を区別して実装へ渡す。SR等の未提供・未決がある場合は、それに依存する範囲と確認先を明らかにし、影響しない範囲は進める。画面設計資料で業務上の意味や確認済みの期待結果を変更しない。",
          "exception": null,
          "result": "実装する画面と検証時に確かめる条件が整理され、実装・画面検証へ引き渡せる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-3534f43eafb8de2f57a7de0b5d561eab"
        },
        {
          "id": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "name": "実装",
          "scope": false,
          "why": "意図した業務の実現",
          "when": "確認済み検査項目の実装依頼と、対象範囲の適用SR・GUI画面設計資料の提供状況を受領したとき",
          "who": "システム開発者",
          "where": "規定なし",
          "procedure": "1. システム開発者は業務設計書の業務要件と検査項目の確認済み期待結果、システム要件書の適用SR・技術要件・検証条件を受け取る。GUIの対象範囲では画面設計資料の画面Referenceと画面チェックリスト・検証条件も受け取り、既存のコードとテストを踏まえて、コードと実行可能なテストを作成・更新する。\\n2. 使用した設計・要件の版と実装対象版を特定できるようにし、実行可能な成果物への参照をコードとともに渡す。入力の未提供・未決がある場合は、影響範囲・進められない作業・確認先を明らかにし、影響しない範囲は進める。外部の画面・SR・検証結果を業務設計書や確認済み期待結果の代わりにしない。",
          "exception": "- 実装中に未決定の業務上の意味が明らかになったときは、コードやテストで方針を決めず、具体的な問いを業務設計へ戻す。",
          "result": "合意済みの業務要件と検査項目を受けた実装が用意され、製品側の検証へ進める。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-89dad1594c2b0a2a5abc007054500e7b"
        },
        {
          "id": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "name": "Alder実装レビュー",
          "scope": false,
          "why": "業務上の意味と提供済みSRに対する実装適合・検証根拠の確認",
          "when": "実装・テストと比較対象の設計・要件の版が示されたとき",
          "who": "実装レビュー担当者",
          "where": "規定なし",
          "procedure": "1. 実装レビュー担当者は、実装時の作業履歴を共有しない別のAIまたは新しいコンテキストで、業務設計書、検査項目、判断記録、提供済みのシステム要件書を読み、対象版のコード・テストと利用可能な検証結果を照合する。レビュー中は設計・実装・対応記録を変更しない。\\n2. 業務上の期待結果とTestの検証内容、変更範囲に適用するSRへの適合を確認し、根拠・不一致・未決の業務判断・不足する証拠を検証結果へ記録する。SRの未提示・未読・非適用を区別し、非適用には理由を残す。レビューはSRの妥当性・完全性や、未実施のUI・性能・安全性・運用試験の成功を保証しない。",
          "exception": null,
          "result": "実装の適合所見と確認できない範囲が区別され、製品検証の結果と合わせて整理できる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-38ef110c089e72658c209a855a988c09"
        },
        {
          "id": "34f8bfd4-8c01-5929-9b78-2cd67f7aa5de",
          "name": "製品検証",
          "scope": false,
          "why": "実際の製品が画面・システム要件と品質条件を満たすかの確認",
          "when": "検証対象版の実装と適用する検証条件が用意されたとき",
          "who": "検証担当者",
          "where": "適用する画面・システム要件の検証環境",
          "procedure": "1. 検証担当者はコードの対象版・成果物とテストを受け取り、システム要件書の適用範囲と検証条件に沿ってテストや性能・安全性・運用等の検証を実施する。GUIの対象範囲では、実際の画面を操作して画面設計資料のReference・チェックリストと照合する。方法・環境・必要な試験の選択は製品側が担う。\\n2. 画面検証とSR・品質検証を区別し、対象版・条件・観測結果・証拠への参照・担当責任者を検証結果へ残す。合格・不合格、実施できなかった範囲、条件が未決の範囲を分け、非GUI製品の画面検証はシステム要件書の非適用理由を引き継ぐ。自動テストの成功だけから、実際には観測していない画面・品質条件の合格を推定しない。",
          "exception": null,
          "result": "実検証で確認できた条件と残る未検証範囲が明らかになり、Alder実装レビューの所見と合わせて整理できる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-4e820e9cd09f1bb95e4b58302c415d4e"
        },
        {
          "id": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "name": "検証結果の統合",
          "scope": false,
          "why": "製品の採否判断に必要な検証範囲・根拠・残課題の明確化",
          "when": "対象版の各検証結果、または未実施・未決の状態が示されたとき",
          "who": "検証担当者",
          "where": "規定なし",
          "procedure": "1. 検証担当者はコードの対象版に対し、業務設計書・検査項目・システム要件書とGUI対象範囲の画面設計資料の版・適用範囲を確認する。検証結果に含まれる各報告の検査根拠・対象版・範囲を照合する。\\n2. 検証元ごとに合格・不合格・未実施・未決と非適用を区別し、元の所見と分類を保ったまま、根拠への参照、版や結論の不一致、残る未検証範囲と担当責任者を統合検証結果へまとめる。対象版や条件が変わった範囲は再検証が必要と示し、過去の結果を現行版の合格根拠にしない。未提供の結果や責任者不明もそのまま明示し、全体合格に読み替えない。結果全文のコピーや専用の報告書は要求しない。\\n3. 依頼者へ統合検証結果と残る確認事項を渡す。統合では業務設計書・確認済み期待結果や原報告を上書きせず、製品として受け入れるか、何を修正・保留するかは人間が別に判断する。統合の完了は採用・merge・releaseの承認ではない。",
          "exception": null,
          "result": "確認できた範囲と残課題が検証元・対象版に沿って整理され、人間が製品の採否や追加対応を判断できる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-4e820e9cd09f1bb95e4b58302c415d4e"
        },
        {
          "id": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "name": "同期漏れ検査",
          "scope": true,
          "why": "原文・検査項目・テストの同期漏れの検出",
          "when": "業務設計書・検査項目・テストの対応関係に同期漏れの疑いが生じたとき",
          "who": "システム開発者",
          "where": "規定なし",
          "procedure": "システム開発者は、通常工程で維持される追跡関係の同期漏れが疑われる部分を任意に診断し、再確認候補を検出する。試行用のフィクスチャまたはプロダクト用アダプターで読み取り専用の検出器を実行し、文章の更新状態と業務上の正しさを区別する。\\n\\n1. システム開発者は業務設計書の現行原文項目、検査項目のCheck本文、同期照合情報のpinとTest IDを照合し、人間のレビュー状態を変更せずに更新状態と参照の不一致を算出する。\\n2. 古くなった関係や欠落した関係を理由とともに再確認の候補として記録する。不具合として自動分類しない。\\n3. 影響するCheckを原文と照合する。Check本文の変更と原文の再確認を区別して同期照合情報を更新する。\\n4. 変更したCheckの期待結果をテストの期待結果・アサーションと照合する。照合を完了した関係だけpinを更新し、検査結果と残る再確認候補をまとめる。",
          "exception": null,
          "result": "疑いのある対応関係の照合状態と再確認候補が明らかになり、影響する検査項目を再確認できる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-89dad1594c2b0a2a5abc007054500e7b"
        }
      ],
      "relations": [
        {
          "id": "cd62ec7a-e8c9-55e8-b6cd-161930fac417",
          "kind": "business-exception",
          "fromId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "toId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "label": "未決定の業務上の意味が見つかったとき"
        },
        {
          "id": "105ab071-170e-5772-917d-c01e005733f6",
          "kind": "business-exception",
          "fromId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "toId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "label": "検査項目レビューで業務上の意味・条件・保証の修正や未決事項の解消が必要と判明したとき"
        },
        {
          "id": "4d51f2aa-a417-5596-81d5-e45b7acbd998",
          "kind": "input",
          "fromId": "31027247-2568-5a9a-b6ed-22efb0c9e0d8",
          "toId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "label": "検査項目の導出・レビュー・追跡関係の確認観点"
        },
        {
          "id": "f41e96b8-8b98-577a-aa97-54d0e6eb3cb8",
          "kind": "input",
          "fromId": "dfe4f16e-dc2c-579c-a3f6-b498dfa04bda",
          "toId": "cb68420b-c2c3-5d91-9a95-612e42d456e7",
          "label": "Problem起点の改善レビューの観点"
        },
        {
          "id": "43bea2d1-eea9-511d-a303-dcd2a9adbab3",
          "kind": "input",
          "fromId": "dfe4f16e-dc2c-579c-a3f6-b498dfa04bda",
          "toId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "label": "業務手順・条件・考慮事項の確認観点"
        },
        {
          "id": "6c4268c2-536d-5524-8918-37e906c2b763",
          "kind": "input",
          "fromId": "8923acfa-5c39-5207-b14b-3aa42260f010",
          "toId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "label": "状態遷移・前後業務の確認観点"
        },
        {
          "id": "21946fc1-7d74-5d67-83cc-755308974338",
          "kind": "input",
          "fromId": "90d61e0f-35f9-5092-87b5-37939127b09f",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "対象版の実装"
        },
        {
          "id": "07332462-0e8e-579b-816b-d14c9aad5753",
          "kind": "input",
          "fromId": "90d61e0f-35f9-5092-87b5-37939127b09f",
          "toId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "label": "既存の実装"
        },
        {
          "id": "2919ef13-37d6-5cd3-955f-080ca8a987df",
          "kind": "input",
          "fromId": "90d61e0f-35f9-5092-87b5-37939127b09f",
          "toId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "label": "実装対象版 / 実行可能な成果物への参照"
        },
        {
          "id": "f631da10-b421-5e28-a6e8-44afa8c1d757",
          "kind": "input",
          "fromId": "90d61e0f-35f9-5092-87b5-37939127b09f",
          "toId": "34f8bfd4-8c01-5929-9b78-2cd67f7aa5de",
          "label": "検証対象版の実装 / 実行可能な成果物への参照"
        },
        {
          "id": "9f33e8f9-5bc5-5ea8-92c0-01636dae87f6",
          "kind": "input",
          "fromId": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "提供済みSRの出所・版・適用範囲 / 未決事項"
        },
        {
          "id": "34658dd0-846d-53af-8ba1-3fc6c12ec21b",
          "kind": "input",
          "fromId": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "toId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "label": "適用SR / 技術要件 / 品質の検証条件 / 未決事項"
        },
        {
          "id": "986e955f-3f70-57cc-ba2c-f0dc91c2ac6a",
          "kind": "input",
          "fromId": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "toId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "label": "適用SR・検証条件と版 / 非適用の理由 / 未決事項と担当責任者"
        },
        {
          "id": "ade4ec7f-08f4-5f60-95e8-d40215086668",
          "kind": "input",
          "fromId": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "toId": "23427931-db9c-5b16-a397-3fafd429d989",
          "label": "画面に関係する適用SR / 技術条件"
        },
        {
          "id": "0d3b983c-334f-5b12-b4ee-e5b7948cfa3b",
          "kind": "input",
          "fromId": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "toId": "34f8bfd4-8c01-5929-9b78-2cd67f7aa5de",
          "label": "適用SR / 品質の検証条件 / 画面検証の適用有無 / 未決事項"
        },
        {
          "id": "d6cfe062-02eb-54bf-96c3-e61f1ebaca9d",
          "kind": "input",
          "fromId": "ace541a0-d4a2-59bc-9ade-f14968016a30",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "対象版の検証ケース・アサーション"
        },
        {
          "id": "258ab72a-46ba-551d-bd2e-06e13974ad46",
          "kind": "input",
          "fromId": "ace541a0-d4a2-59bc-9ade-f14968016a30",
          "toId": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "label": "期待結果 / アサーション"
        },
        {
          "id": "839cd44f-e189-57dc-a0cc-bd03d468de94",
          "kind": "input",
          "fromId": "ace541a0-d4a2-59bc-9ade-f14968016a30",
          "toId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "label": "既存のテスト"
        },
        {
          "id": "f1f6b117-1ede-5b6b-92be-6aa962651bb6",
          "kind": "input",
          "fromId": "ace541a0-d4a2-59bc-9ade-f14968016a30",
          "toId": "34f8bfd4-8c01-5929-9b78-2cd67f7aa5de",
          "label": "実行可能な検証ケース・期待結果"
        },
        {
          "id": "9d9856a5-a95e-5375-9c7e-907d517cd55b",
          "kind": "input",
          "fromId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "toId": "d8de0d5e-3176-57ac-96a1-961b96142ce3",
          "label": "製品全体の要求 / 既存の技術・運用上の制約"
        },
        {
          "id": "4fccf499-ded2-572f-b894-864cb5ee43a0",
          "kind": "input",
          "fromId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "toId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "label": "検査項目レビュー結果"
        },
        {
          "id": "672c60f6-e2cd-5d35-8b07-10ec4352ffbd",
          "kind": "input",
          "fromId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "toId": "cb68420b-c2c3-5d91-9a95-612e42d456e7",
          "label": "改善検討の依頼 / 記録済みProblemの補足"
        },
        {
          "id": "53be3f0b-d858-5afc-8d34-559c239a041f",
          "kind": "input",
          "fromId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "toId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "label": "システム要件 / 現場で認識されたProblem・Pain / レビュー結果 / 改善候補の採用判断"
        },
        {
          "id": "bad78f03-703a-5d09-8b48-a1142c7a206b",
          "kind": "input",
          "fromId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "toId": "23427931-db9c-5b16-a397-3fafd429d989",
          "label": "画面要件 / 画面案の確認結果"
        },
        {
          "id": "1c6cfe35-f2d5-53fd-bd4a-ffb21dd57881",
          "kind": "input",
          "fromId": "9cac475b-2725-5274-8724-02b909bc50d1",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "文書化された判断と理由"
        },
        {
          "id": "13e84091-0494-5b46-a015-47548177a457",
          "kind": "input",
          "fromId": "a03a2276-7aa5-596c-8f18-5510afae5fbe",
          "toId": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "label": "原文・Check・Testの照合基準 / Test ID"
        },
        {
          "id": "e558474d-d3d9-5633-860d-28587639e5bf",
          "kind": "input",
          "fromId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "確認済み期待結果 / レビュー状態 / Testとの対応"
        },
        {
          "id": "d2da3b29-cd0d-5473-9ac6-86839ab80b2f",
          "kind": "input",
          "fromId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "toId": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "label": "現在のCheck本文"
        },
        {
          "id": "eafad302-2b75-5c48-8b97-7a503e3e31de",
          "kind": "input",
          "fromId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "toId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "label": "確認済み期待結果"
        },
        {
          "id": "614d17a0-7d0e-593f-b473-8a4ed922de8e",
          "kind": "input",
          "fromId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "toId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "label": "現行項目 / ID / レビュー状態 / 既存対応関係"
        },
        {
          "id": "f55d291e-f921-5f81-90ce-5cfaff1abc49",
          "kind": "input",
          "fromId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "toId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "label": "確認済み期待結果と版"
        },
        {
          "id": "e255ccdf-764a-5dd5-b042-2515cca54953",
          "kind": "input",
          "fromId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "toId": "23427931-db9c-5b16-a397-3fafd429d989",
          "label": "確認済みの業務上の期待結果"
        },
        {
          "id": "593150b2-f023-598e-8165-ba49ccc28f08",
          "kind": "input",
          "fromId": "b468672a-c472-5407-8656-5202cbdfc19f",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "利用可能な製品検証の実行結果・証拠"
        },
        {
          "id": "2cd4c0b4-9792-5501-9937-7213ecfaac44",
          "kind": "input",
          "fromId": "b468672a-c472-5407-8656-5202cbdfc19f",
          "toId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "label": "Alder実装レビュー・画面検証・SR品質検証それぞれの結果 / 根拠 / 未検証範囲・未決事項"
        },
        {
          "id": "e4c24ed1-9274-5b7b-8c24-76c760578b4d",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "合意済み業務要件 / 期待結果"
        },
        {
          "id": "27bf750b-09ec-5fc0-bca8-1cb07562c68b",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "d8de0d5e-3176-57ac-96a1-961b96142ce3",
          "label": "業務要件"
        },
        {
          "id": "ddca5fe2-8fd9-52da-8a45-27f05ccf6ece",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "label": "現行原文項目"
        },
        {
          "id": "1002a697-54f6-54c4-9182-486d32c7d0e8",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "label": "業務要件"
        },
        {
          "id": "ea5b5479-1b4d-5596-8006-ddc708bd3638",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "label": "業務要件 / 期待結果"
        },
        {
          "id": "f5d7a501-e285-598b-9e60-3c6d8764cc36",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "label": "比較対象の業務要件と版"
        },
        {
          "id": "668a401c-0902-5727-98c7-da2294e2db51",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "cb68420b-c2c3-5d91-9a95-612e42d456e7",
          "label": "現在の業務上の意味 / Problem / Pain"
        },
        {
          "id": "39f85562-d739-558f-8188-c9894d68b9fc",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "label": "現行業務要件 / 期待結果 / 未決事項 / Problem / Pain"
        },
        {
          "id": "ca0b6795-7e33-5ba7-aa7d-428b2cd4d574",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "23427931-db9c-5b16-a397-3fafd429d989",
          "label": "業務手順 / 入出力 / 利用環境"
        },
        {
          "id": "6f5ee272-c33d-5674-88bc-94dba406a9d6",
          "kind": "input",
          "fromId": "2b16611b-d83b-5586-af1a-80f81519f9f5",
          "toId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "label": "GUI対象範囲の画面Reference / 画面チェックリスト・検証条件 / 未決事項"
        },
        {
          "id": "a2cabc7f-3699-5269-9e78-61852b209db6",
          "kind": "input",
          "fromId": "2b16611b-d83b-5586-af1a-80f81519f9f5",
          "toId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "label": "GUI対象範囲の画面Reference・検証条件と版"
        },
        {
          "id": "ec4aa7bf-cc7c-578c-863c-bb1df56ab8c9",
          "kind": "input",
          "fromId": "2b16611b-d83b-5586-af1a-80f81519f9f5",
          "toId": "34f8bfd4-8c01-5929-9b78-2cd67f7aa5de",
          "label": "GUI対象範囲の画面Reference / 画面チェックリスト・検証条件"
        },
        {
          "id": "af5b38fb-c38f-58ba-adae-7c5eb2133024",
          "kind": "output",
          "fromId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "toId": "b468672a-c472-5407-8656-5202cbdfc19f",
          "label": "Alder実装レビューの対象版・範囲 / 適合所見・根拠 / 未決事項・検証不足"
        },
        {
          "id": "8fe12318-d835-5c69-aef4-0182a3b8e2e5",
          "kind": "output",
          "fromId": "d8de0d5e-3176-57ac-96a1-961b96142ce3",
          "toId": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "label": "適用SR / 技術要件 / 品質の検証条件 / 画面設計・検証の適用有無 / 未決事項と担当責任者"
        },
        {
          "id": "53213646-87f7-5ef0-926b-d5c2ac7112e7",
          "kind": "output",
          "fromId": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "toId": "69c0151d-4d7a-5b1c-a5a9-65e63eeedd3b",
          "label": "再確認候補 / 理由"
        },
        {
          "id": "c50959aa-315f-5c11-b94e-9058da8f5a46",
          "kind": "output",
          "fromId": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "toId": "a03a2276-7aa5-596c-8f18-5510afae5fbe",
          "label": "照合済みの基準値"
        },
        {
          "id": "55ab9ee8-7b66-5d56-9764-a6359edec01b",
          "kind": "output",
          "fromId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "toId": "90d61e0f-35f9-5092-87b5-37939127b09f",
          "label": "実装結果 / 対象版 / 実行可能な成果物への参照"
        },
        {
          "id": "df344126-2a13-5c40-a280-784f5fe04430",
          "kind": "output",
          "fromId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "toId": "ace541a0-d4a2-59bc-9ade-f14968016a30",
          "label": "実行可能な検証"
        },
        {
          "id": "f3f1faad-4bb1-593c-ac96-054b99e7fc93",
          "kind": "output",
          "fromId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "toId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "label": "検査項目案 / レビュー依頼 / 確認事項"
        },
        {
          "id": "bce45cb0-7586-53fb-bbc8-ae9b2eeb7970",
          "kind": "output",
          "fromId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "toId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "label": "期待結果 / レビュー状態 / 業務設計書との対応"
        },
        {
          "id": "f1d629c5-5d3c-519e-9a3e-0c22cb4ca056",
          "kind": "output",
          "fromId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "toId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "label": "統合検証結果への参照 / 残る確認事項"
        },
        {
          "id": "f131aab9-364e-50ad-9509-e3cd86361819",
          "kind": "output",
          "fromId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "toId": "4657b60d-dd29-5ecd-88a7-594fdcf3befd",
          "label": "対象版と各検証の対応 / 根拠への参照 / 不一致・未検証・未決事項・担当責任者"
        },
        {
          "id": "366b91d0-4098-58eb-8fb0-b75ec8b3408d",
          "kind": "output",
          "fromId": "cb68420b-c2c3-5d91-9a95-612e42d456e7",
          "toId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "label": "改善候補 / 比較根拠 / 確認事項"
        },
        {
          "id": "3d23fa3a-d500-5aa0-91a0-faf5d764e6b1",
          "kind": "output",
          "fromId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "toId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "label": "業務設計案 / レビュー依頼 / 確認事項"
        },
        {
          "id": "fe5aba58-cd0a-5c1f-b57f-9ac16353c1d1",
          "kind": "output",
          "fromId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "toId": "9cac475b-2725-5274-8724-02b909bc50d1",
          "label": "判断内容 / 結果"
        },
        {
          "id": "196e86f5-34a4-5204-8da5-0b09eb039006",
          "kind": "output",
          "fromId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "toId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "label": "業務要件 / 期待結果 / 未決事項 / Problem / Pain"
        },
        {
          "id": "84604925-bb55-5dcd-a57f-c6a62b586518",
          "kind": "output",
          "fromId": "23427931-db9c-5b16-a397-3fafd429d989",
          "toId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "label": "画面案 / 確認事項"
        },
        {
          "id": "94172be1-d015-5c55-a097-5ada2bdc474a",
          "kind": "output",
          "fromId": "23427931-db9c-5b16-a397-3fafd429d989",
          "toId": "2b16611b-d83b-5586-af1a-80f81519f9f5",
          "label": "画面Reference / 画面チェックリスト・検証条件 / 確認結果と未決事項"
        },
        {
          "id": "5e4198a8-2f3f-5588-830a-384fb0dc5ee2",
          "kind": "output",
          "fromId": "34f8bfd4-8c01-5929-9b78-2cd67f7aa5de",
          "toId": "b468672a-c472-5407-8656-5202cbdfc19f",
          "label": "画面検証とSR・品質検証それぞれの対象版・範囲・担当責任者 / 観測結果・証拠 / 未実施・未決・非適用"
        }
      ],
      "findings": [],
      "roles": [
        {
          "id": "role-285a6c5b4bca97f50fdc0951c4e888d5",
          "name": "業務設計者",
          "color": "#8b5cf6"
        },
        {
          "id": "role-89dad1594c2b0a2a5abc007054500e7b",
          "name": "システム開発者",
          "color": "#2563eb"
        },
        {
          "id": "role-3534f43eafb8de2f57a7de0b5d561eab",
          "name": "画面設計者",
          "color": "#2563eb"
        },
        {
          "id": "role-38ef110c089e72658c209a855a988c09",
          "name": "実装レビュー担当者",
          "color": "#8b5cf6"
        },
        {
          "id": "role-4e820e9cd09f1bb95e4b58302c415d4e",
          "name": "検証担当者",
          "color": "#2563eb"
        }
      ],
      "exceptions": []
    },
    {
      "id": "alder-sample-checks",
      "schemaVersion": "0.1",
      "kind": "checkItems",
      "revision": "alder-sample-checks-1",
      "title": "Alderのチェックリストサンプル",
      "basedOn": {
        "documentId": "alder-design",
        "revision": "alder-design-1",
        "verification": "unverified"
      },
      "intro": [
        {
          "kind": "text",
          "value": "原典は"
        },
        {
          "kind": "link",
          "uri": "https://github.com/mk3008/alder/blob/main/business-design/alder/business-design.json",
          "label": "Alderを使った設計業務"
        },
        {
          "kind": "text",
          "value": "です。表示を試すための2項目で、業務全体のチェックリストではありません。"
        }
      ],
      "index": [
        {
          "activityId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "purpose": "業務上の意味と保証の合意",
          "connections": "合意した業務設計書を検査項目の設計へ渡す",
          "checkIds": [
            "eb5df2d7-973b-542f-93ce-d3ce844b6d53"
          ]
        },
        {
          "activityId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "purpose": "期待結果と検証範囲の確認",
          "connections": "合意した検査項目を実装へ渡す",
          "checkIds": [
            "4c8a249a-d4af-5a9c-9061-0c964400fbfd"
          ]
        }
      ],
      "sections": [
        {
          "id": "96ea9b3c-7e86-5811-bbde-26976169489a",
          "activityId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "title": "業務設計",
          "preamble": []
        },
        {
          "id": "f2ad6238-b8e0-570d-a942-6e3843073243",
          "activityId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "title": "検査項目の設計",
          "preamble": []
        }
      ],
      "guarantees": [],
      "examples": [],
      "items": [
        {
          "id": "eb5df2d7-973b-542f-93ce-d3ce844b6d53",
          "checkId": "SAMPLE-01",
          "detailSummary": "SAMPLE-01 の根拠・関連業務・テスト証拠",
          "title": "合意した業務設計から次の設計を開始できる",
          "sectionId": "96ea9b3c-7e86-5811-bbde-26976169489a",
          "reviewState": "未レビュー",
          "fields": {
            "condition": [
              {
                "kind": "text",
                "value": "業務上の意味・手順・業務相関と、記録したProblem / Painを依頼者と確認・合意する。"
              }
            ],
            "expectedResult": [
              {
                "kind": "text",
                "value": "検査項目の設計または任意の業務改善レビューを開始できる。"
              }
            ],
            "evidence": [
              {
                "kind": "text",
                "value": "原典「Activity 業務設計」のResult。"
              }
            ],
            "related": [
              {
                "kind": "text",
                "value": "検査項目の設計。"
              }
            ],
            "testEvidence": [
              {
                "kind": "text",
                "value": "業務上の期待結果に対応する自動テスト証拠は未収集。"
              }
            ]
          }
        },
        {
          "id": "4c8a249a-d4af-5a9c-9061-0c964400fbfd",
          "checkId": "SAMPLE-02",
          "detailSummary": "SAMPLE-02 の根拠・関連業務・テスト証拠",
          "title": "合意した検査項目を実装へ渡せる",
          "sectionId": "f2ad6238-b8e0-570d-a942-6e3843073243",
          "reviewState": "未レビュー",
          "fields": {
            "condition": [
              {
                "kind": "text",
                "value": "合意した業務設計書に基づいて検査項目を整え、検査すべき期待結果を依頼者と確認・合意する。"
              }
            ],
            "expectedResult": [
              {
                "kind": "text",
                "value": "検査項目を実装へ引き渡せる。"
              }
            ],
            "evidence": [
              {
                "kind": "text",
                "value": "原典「Activity 検査項目の設計」のProcedure 5とResult。"
              }
            ],
            "related": [
              {
                "kind": "text",
                "value": "実装。"
              }
            ],
            "testEvidence": [
              {
                "kind": "text",
                "value": "業務上の期待結果に対応する自動テスト証拠は未収集。"
              }
            ]
          }
        }
      ],
      "notes": []
    }
  ],
  "sources": [
    {
      "documentId": "alder-design",
      "revision": "alder-design-1",
      "sha256": "64701618618bd565fb540647cf15c06e20d3f3f6fc45dc8b64244c01e3910aa5",
      "uri": "https://github.com/mk3008/alder/blob/304e7d4e82fe7087193012511a437a3c726ce7c2/business-design/alder/README.md"
    },
    {
      "documentId": "alder-sample-checks",
      "revision": "alder-sample-checks-1",
      "sha256": "9901011b7b673d9a3ad2749ecdb0d93621cfbd180f0c43324ea9d76f6994c909",
      "uri": ""
    }
  ],
  "externalDocuments": [],
  "diagnostics": [
    "旧JSON 0.3 の互換入力由来。業務意味・承認は未評価"
  ]
}
`;function Fu(e,t){const n=new Set(t.graph.nodes.map(g=>g.id)),i=new Map;for(const g of t.graph.nodes)i.set(g.name,i.has(g.name)?void 0:g.id);const o=g=>n.has(g)?g:i.get(g),r=Object.create(null);for(const[g,c]of Object.entries(e.positions)){const h=o(g);h&&(r[h]=c)}const{scroll:s,zoom:d,viewInset:a,canvasOrigin:l,showExceptions:u,selectedEdgesOnly:p}=e;return{positions:r,scroll:s,zoom:d,viewInset:a,canvasOrigin:l,showExceptions:u,selectedEdgesOnly:p,selected:e.selected?o(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(g=>{const c=o(g);return c?[c]:[]}))]}}}const Bu=`# Alderのチェックリストサンプル

原典は[Alderを使った設計業務](https://github.com/mk3008/alder/blob/main/business-design/alder/README.md)です。表示を試すための2項目で、業務全体のチェックリストではありません。

## 業務一覧

| 業務（Activity） | 目的 | 業務設計に記載された接続 | チェック項目 |
| --- | --- | --- | --- |
| [業務設計](#activity-design) | 業務上の意味と保証の合意 | 合意した業務設計書を検査項目の設計へ渡す | [SAMPLE-01](#sample-01) |
| [検査項目の設計](#activity-checks) | 期待結果と検証範囲の確認 | 合意した検査項目を実装へ渡す | [SAMPLE-02](#sample-02) |

<a id="activity-design"></a>

## 業務設計

<a id="sample-01"></a>

### SAMPLE-01 — 合意した業務設計から次の設計を開始できる

- 条件：業務上の意味・手順・業務相関と、記録したProblem / Painを依頼者と確認・合意する。
- 期待結果：検査項目の設計または任意の業務改善レビューを開始できる。
- 人間レビュー状態：未レビュー

<details>
<summary>SAMPLE-01 の根拠・関連業務・テスト証拠</summary>

- 根拠：原典「Activity 業務設計」のResult。
- 関連業務：検査項目の設計。
- テスト証拠：業務上の期待結果に対応する自動テスト証拠は未収集。

</details>

<a id="activity-checks"></a>

## 検査項目の設計

<a id="sample-02"></a>

### SAMPLE-02 — 合意した検査項目を実装へ渡せる

- 条件：合意した業務設計書に基づいて検査項目を整え、検査すべき期待結果を依頼者と確認・合意する。
- 期待結果：検査項目を実装へ引き渡せる。
- 人間レビュー状態：未レビュー

<details>
<summary>SAMPLE-02 の根拠・関連業務・テスト証拠</summary>

- 根拠：原典「Activity 検査項目の設計」のProcedure 5とResult。
- 関連業務：実装。
- テスト証拠：業務上の期待結果に対応する自動テスト証拠は未収集。

</details>
`;function Gu(e,t,n,i,o=()=>!0,r=()=>{}){const s=e.ownerDocument,d=s.defaultView;let a,l=0,u=0,p=!1,g=null,c="";const h=new Map,m=()=>{a!==void 0&&(d.clearTimeout(a),l=Math.max(0,l-(Date.now()-u)),a=void 0)},f=(y=!1)=>{if(y&&!o())return;m(),h.delete(c);const E=[...h].at(-1);if(E){w(E[1],"error",E[0]);return}const S=e.contains(s.activeElement);e.hidden=!0,t.textContent="",r(),S&&(g?.isConnected?g:i).focus({preventScroll:!0})},b=()=>{e.hidden||e.dataset.kind==="error"||p||s.hidden||e.contains(s.activeElement)||(m(),u=Date.now(),a=d.setTimeout(f,l))};e.addEventListener("pointerenter",()=>{p=!0,m()}),e.addEventListener("pointerleave",()=>{p=!1,b()}),e.addEventListener("focusin",y=>{const E=y.relatedTarget;E&&!e.contains(E)&&(g=E),m()}),e.addEventListener("focusout",()=>d.setTimeout(b,0)),e.addEventListener("keydown",y=>{y.key==="Escape"&&(y.preventDefault(),y.stopPropagation(),f(!0))}),s.addEventListener("visibilitychange",()=>s.hidden?m():b()),n.onclick=()=>f(!0);const w=(y,E,S)=>{m(),e.contains(s.activeElement)||(g=s.activeElement),c=S,e.dataset.kind=E,e.dataset.key=S,t.setAttribute("role",E==="error"?"alert":"status"),t.setAttribute("aria-live",E==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=y,r(),l=E==="warning"?8e3:5e3,b()};return(y,E="success",S="operation")=>{E==="error"&&y?(h.delete(S),h.set(S,y)):h.delete(S);const x=[...h].at(-1);if(x){if(!e.hidden&&t.textContent===x[1]&&c===x[0])return;w(x[1],"error",x[0]);return}if(!y){c===S&&f();return}!e.hidden&&t.textContent===y&&e.dataset.kind===E||w(y,E,S)}}const xr=Vu,Et=document.querySelector("#app");Et.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong id="header-title">Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Ue;const I=e=>document.getElementById(e),Vn=da(location.pathname);Vn.version&&(I("preview-badge").hidden=!1,I("preview-badge").textContent=`確認用 · ${Vn.version}`,I("preview-badge").title=`PR #${Vn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const fi=e=>Kn(e,{"stroke-width":1.8,"aria-hidden":"true"}),vi=document.createElement("div");vi.id="source-menu";vi.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';Et.append(vi);const co=document.createElement("div");co.id="checks-menu";co.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';Et.append(co);const Dn=document.createElement("section");Dn.id="check-followup";Dn.hidden=!0;Dn.setAttribute("aria-labelledby","check-followup-title");Dn.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(Dn);const lo=document.createElement("div");lo.id="check-followup-menu";lo.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';Et.append(lo);const Ft=document.createElement("input");Ft.type="file";Ft.id="check-file";Ft.accept=".md,.markdown,text/markdown,text/plain";Ft.hidden=!0;Et.append(Ft);const rn=document.createElement("section");rn.id="check-url-dialog";rn.hidden=!0;rn.setAttribute("role","dialog");rn.setAttribute("aria-labelledby","check-url-title");rn.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';Et.append(rn);const uo=document.createElement("div");uo.id="help-menu";uo.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;Et.append(uo);so(I("help-menu-toggle"),uo);const ri=document.createElement("div");ri.id="url-history";vi.append(ri);function Hu(){if(ri.replaceChildren(),!j.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",ri.append(e);for(const t of j.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const i=document.createElement("small");i.textContent=t.url,n.append(i),n.title=t.url,n.disabled=se||Ne||re,n.onclick=()=>{Ju(t.url)},ri.append(n)}}async function Ju(e){if(!(se||Ne||re)){if(j.document?.source?.kind==="url"&&j.document.source.url===e){we(),Ue?.reopenBusinessOverview(),j.active=j.tabs[0].key,Me(),Si();return}Ne=!0,Me();try{const t=await ro(e),n=Xn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await wi(n)}catch(t){t instanceof Rn||$e("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Ne=!1,Me()}}}const _u=so(I("open-menu-toggle"),vi),Ku=so(I("open-checks"),co,()=>{const e=ne();I("check-open-sample").hidden=!e||!Rs(e),I("check-close").disabled=!e?.checks}),xa=so(I("check-followup-open"),lo,()=>{I("check-followup-sample").hidden=!ne()||!Rs(ne())});for(const[e,t]of[["open-menu-toggle",Xs],["open",Xs],["open-url",mc],["open-text",hc],["view-markdown",bc],["open-checks",Rr],["share-source",gc],["refresh",yc],["help-menu-toggle",vc],["drawer",wc],["node-list-toggle",kc],["node-list-close",Lr],["display-settings-toggle",Nr],["reset-layout",Ic],["save-image",Sc],["copy-image",xc],["out",qr],["in",$r]])I(e).prepend(fi(t));Ul(document.querySelector("header"));const Qo=zl(document.querySelector(".tab-strip"));let j={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},Rt=!0,Yt=!1,se=!0,Jn=!1,On=!1,Ne=!1,Ar=Promise.resolve(),bn,ge,Lt=0,re=!1,ai=!1,Fn=0,_i=0,Bn=!1,js=!1,es=!1,Er=!1;const ts=new Set,Qt=new Set,Ki=new Set;function Aa(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of Ki){const i=[...j.document?[j.document]:[],...j.recovery].find(r=>r.key===n),o=t.find(r=>r.key===n&&r.draft===i?.draft);i&&o&&Ki.delete(n)}}const ne=()=>j.tabs.find(e=>e.key===j.active),Mn=e=>tn(e)?.key??e.key,nn=e=>j.document?.key===Mn(e);let ns="";const Xu=Gu(I("status"),I("status-text"),I("status-close"),I("viewport"));function $e(e,t="success",n="operation"){if(n==="storage"){if(ns===e)return;ns=e}Xu(e,t,n)}function Cs(){$e("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Ds(){$e("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Ht(){se||(Lt++,tt())}function Zu(e){e.preventDefault(),e.returnValue=!0}function tt(){const e=Lt>Fn||_i>0||!1||re||Ki.size>0||es||Bn||On,t=!se&&e;t!==Er&&(Er=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",Zu));const n=se?"restoring":Jn?"protected":On?"conflict":Bn?"error":es||Ki.size>0?"draft":_i>0||re?"saving":Lt>Fn?"dirty":js?"saved":"unchanged";Et.dataset.saveState!==n&&(Et.dataset.saveState=n),Jn?Cs():On?Ds():Bn?$e("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):$e("","success","storage"),fo()}function Ms(e){Bn=!0,ns=""}function po(){if(Jn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(On)throw new ks}async function Yu(e){po();try{await wl(e)}catch(t){throw t instanceof ks&&(On=!0,clearTimeout(bn),bn=void 0,Ds()),t}}function Ea(e,t){_i++,ts.add(t),tt();const n=Ar.catch(()=>{}).then(()=>Yu(e)).then(()=>{Fn=Math.max(Fn,t),js=!0,Aa(e),Fn===Lt&&(Bn=!1)},i=>{throw Ms(),i}).finally(()=>{_i--,ts.delete(t),tt()});return Ar=n.catch(()=>{}),n}function Ae(e=180,t=!0){if(se)return;if(t&&Lt++,clearTimeout(bn),bn=void 0,Jn){Cs(),tt();return}if(On){Ds(),tt();return}if(re||ts.has(Lt)||!t&&Lt<=Fn&&!Bn){tt();return}const n=()=>{bn=void 0;let i;try{i=structuredClone(Is(j))}catch{Ms(),tt();return}Ea(i,Lt).catch(()=>tt())};e===0?n():bn=window.setTimeout(n,e),tt()}async function Qu(e){if(se||ge||re||!j.tabs.includes(e))return;if(li(e)===void 0){Ue?.closeBusinessOverview();return}bt.cancel(),we();const t=j.active===e.key,n={...j,tabs:j.tabs.filter(i=>i!==e),active:t?j.tabs[0]?.key:j.active};try{await ki(()=>n,()=>{j=n}),t&&Et.dataset.workspaceArea==="business"&&Ue?.businessActivated()}catch{tt()}}function pt(){I("drawer").setAttribute("aria-label","業務内容開閉"),I("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!ne(),t=e&&j.drawer,n=e&&!!j.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Yt=!1),fo(),I("layout-lock").replaceChildren(fi(Rt?Pr:Tr)),I("layout-lock").setAttribute("aria-pressed",String(Rt)),I("layout-lock").title=Rt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",I("layout-lock").toggleAttribute("disabled",se),I("viewport").dataset.layoutLocked=String(Rt),I("prefer-write").checked=j.preferWrite===!0,I("prefer-write").disabled=se,I("show-exceptions").checked=ne()?.showExceptions!==!1,I("show-exceptions").disabled=se||re||!ne()||ge===ne(),I("selected-edges-only").checked=ne()?.selectedEdgesOnly===!0,I("selected-edges-only").disabled=se||re||!ne()||ge===ne(),document.documentElement.dataset.theme=j.dark?"dark":"light",I("theme").replaceChildren(fi(j.dark?Dc:Mc)),I("formattedMarkdownDrawer").hidden=!t,I("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(j.width,innerWidth*.65))+"px",I("drawer").setAttribute("aria-expanded",String(t)),I("drawer").toggleAttribute("disabled",se||!e),I("node-list-drawer").hidden=!n||ft().mode!=="findings",I("node-list-toggle").setAttribute("aria-expanded",String(n)),I("node-list-toggle").toggleAttribute("disabled",se||!e),Ue?.syncChrome()}function is(){for(const e of["save-image","copy-image"]){const t=I(e);t.hidden=!ne(),t.disabled=ai||se||!ne()||ge===ne(),t.setAttribute("aria-busy",String(ai))}}function fo(){is(),document.querySelector(".toolbar").dataset.settingsOpen=String(Yt),I("display-options").hidden=!Yt,I("reset-layout").disabled=se||Ne||re||!1||!ne()||Qt.has(j.document?.key??"")||Jn||On;const e=I("display-settings-toggle"),t=Yt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Yt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=se||re||!ne()||ge===ne()}function Oa(e,t=!1){const n=ne();se||re||!n||ge===n||e===Yt||(e&&(_n.delete(tn(n)?.key??n.key),mo()),bt.cancel(),qe=void 0,we(),Yt=e,fo(),Gt(n),!e&&(t||I("display-options").contains(document.activeElement))&&I("display-settings-toggle").focus({preventScroll:!0}))}async function ja(e){const t=ne();if(!(ai||se||!t||ge===t)){ai=!0,is();try{const n=Kl(I("nodes"),I("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await Yl(n),$e("グラフ全体のPNGをコピーしました。")):await Zl(n,(tn(t)?.name??t.name)+(li(t)?" - "+li(t):""))}catch(n){$e((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{ai=!1,is()}}}I("save-image").onclick=()=>ja(!1);I("copy-image").onclick=()=>ja(!0);I("display-settings-toggle").onclick=()=>Oa(!Yt);I("reset-layout").onclick=()=>{const e=ne();if(se||Ne||re||ge||!e||Qt.has(Mn(e)))return;try{po()}catch{tt();return}bt.cancel(),fn.cancel(),qe=void 0,we();const t={...e,design:io(e)},n=qu(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),Na.invalidate(e),Me(),n!==t&&Ae()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Yt&&I("source-dialog").hidden&&(e.preventDefault(),Oa(!1,!0))});function we(e=!0){const t=ne();if(!t)return!1;const n=[I("viewport").scrollLeft,I("viewport").scrollTop],i=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,i&&e&&(Ht(),Ae(180,!1)),i}function Ca(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,i=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(o=>o.dataset.key===n)?.querySelector(i?".close":"button")?.focus({preventScroll:!0})}function os(){_u.close(),Ku.close(),xa.close(),Qo.close(),Ca(ep),Qo.update()}function ep(){const e=I("tabs");e.replaceChildren(),j.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===j.active?" active":""),n.draggable=li(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Gi(t)!==void 0&&(n.dataset.activity=Gi(t)),Hi(t)!==void 0&&(n.dataset.object=Hi(t));const i=document.createElement("button");$o(i,"business",t.name),i.setAttribute("aria-current",String(t.key===j.active)),i.disabled=re,i.onclick=async()=>{if(re||Pt&&Pt!==t.key&&!await Ii())return;const r=we()||j.active!==t.key;Ue?.activateBusiness(),j.active=t.key,Me(),Ue?.businessActivated(),Ae(180,r)};const o=Wo("業務設計："+t.name+"を閉じる");o.disabled=re,o.onclick=()=>Qu(t),n.append(i,o),n.ondragstart=r=>r.dataTransfer?.setData("text/plain",t.key),n.ondragover=r=>r.preventDefault(),n.ondrop=r=>{if(r.preventDefault(),re)return;const s=j.tabs.findIndex(a=>a.key===r.dataTransfer?.getData("text/plain")),d=j.tabs.indexOf(t);if(s>0&&d>0&&s!==d){const[a]=j.tabs.splice(s,1);j.tabs.splice(d,0,a),os(),Ae()}},n.onkeydown=r=>{if(!re&&r.altKey&&(r.key==="ArrowLeft"||r.key==="ArrowRight")){r.preventDefault();const s=j.tabs.indexOf(t),d=s+(r.key==="ArrowLeft"?-1:1);s>0&&d>0&&d<j.tabs.length&&([j.tabs[s],j.tabs[d]]=[j.tabs[d],j.tabs[s]],os(),Ae())}},e.append(n)})}const Or=new Map,_n=new Set;function mo(){const e=ne(),t=!!e&&e.design.sourceFormat!=="json"&&_n.has(tn(e)?.key??e.key)&&!e.checks;t||(xa.close(),Dn.contains(document.activeElement)&&I("viewport").focus({preventScroll:!0})),Dn.hidden=!t;for(const n of["check-followup-open","check-followup-later"])I(n).disabled=se||Ne||re||!1||!e||yn(e).busy===!0}I("check-followup-later").onclick=()=>{const e=ne();e&&_n.delete(tn(e)?.key??e.key),mo()};let ss;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])I("check-followup-"+e).onclick=()=>{ss=I("check-followup-open"),I(t).click(),ss=void 0};function Rs(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===Os}function yn(e){const t=tn(e)?.key??e.key;let n=Or.get(t);return n||(n={},Or.set(t,n)),n}async function Ls(e,t){if(!nn(e))throw Error("原本文書が切り替わりました。");const n=Vt(j,j.recovery,{...j.document,checks:t},Is(j).views);await ki(()=>n,()=>{j=n,t&&_n.delete(tn(e)?.key??e.key)})}async function Da(e,t){const n=yn(e);if(e.design.sourceFormat==="json"||n.busy||re||se||ge===e)return;const i=ui(e);n.busy=!0,n.error=void 0,n.candidate=void 0,on();try{const o=await t();if(!nn(e))return;if(i!==ui(j.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const r=Hn(o),s=pi(r,j.tabs[0]);if(s.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+s.reason);s.state==="unverified"?n.candidate=o:(await Ls(e,o),n.candidate=void 0,Ue?.openRelatedChecks(ne()?.selected))}catch(o){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+o.message,$e(n.error,"error")}finally{n.busy=!1,on()}}async function Ma(e,t){const n=yn(e);if(n.busy||re||!nn(e))return;const i=pi(Hn(t),j.tabs[0]);if(i.state==="mismatch"){n.error=i.reason,on();return}n.busy=!0,n.error=void 0;try{await Ls(e,{...t,confirmedFor:ui(j.tabs[0])}),n.candidate=void 0,Ue?.openRelatedChecks(ne()?.selected)}catch(o){n.error="関連Checkを開けません: "+o.message}finally{n.busy=!1,on()}}function on(){mo();const e=ne(),t=I("detail"),n=e?yn(e):void 0,i=e?e.key+":"+(e.selected??""):"";I("open-checks").disabled=se||re||ge===e||!e||n?.busy===!0;const o=t.contains(document.activeElement)?document.activeElement?.id:void 0,r=t.dataset.contentKey===i?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=i,!e)return;const s=e.design.graph.nodes.find(p=>p.id===e.selected),d=Wl(e,n,{disabled:se||re||ge===e,redraw:on,confirm:p=>{Ma(e,p)}}),a=document.createElement("div");a.className="right-drawer-heading";const l=td(s?.name??"業務設計");if(s){const p=s.type==="business"?Ra(String(s.who),s.id):Gr(s);p.classList.add("drawer-node-icon"),l.prepend(p)}a.append(l);const u=document.createElement("button");if(u.type="button",u.id="business-drawer-close",u.setAttribute("aria-label","右ドロワーを閉じる"),u.textContent="×",u.onclick=()=>{I("drawer").click(),I("drawer").focus({preventScroll:!0})},a.append(u),t.append(a),d.hasChildNodes()&&t.append(d),s){const p=Pu(e.design,s.id,Xi,s.type==="business");p.hasChildNodes()&&t.append(p)}t.append(el(e.design,s?.id,p=>Xi({type:"finding",id:p}))),s?.type==="business"&&Ue?.appendActivityTestLinks(t,s.id),t.scrollTop=r,o&&document.getElementById(o)?.focus({preventScroll:!0})}const jr=new Map,ft=()=>{const e=j.active??"";let t=jr.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},jr.set(e,t)),t};function Xi(e){if(!ne())return;const t=ft();t.mode="findings",t.finding=e,j.nodeDrawer=!0,innerWidth<=800&&(j.drawer=!1),pt(),xt(),I("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),Ae()}function tp(e){const t=ne();if(!t)return;const n=ft();n.mode="findings",n.filterNode=e,n.finding=void 0;const i=(t.design.findings??[]).filter(o=>o.status==="open"&&o.targets.includes(e)).map(o=>({type:"finding",id:o.id}));if(t.design.graph.nodes.some(o=>o.id===e&&typeof o.problem=="string")&&i.unshift({type:"problem",id:e}),i.length===1){Xi(i[0]);return}j.nodeDrawer=!0,innerWidth<=800&&(j.drawer=!1),pt(),xt(),I("drawer-mode-findings").focus({preventScroll:!0}),Ae()}function np(e,t){const n=ft().finding;if(!n)return!1;const i=n.type==="finding"?e.design.findings?.find(d=>d.id===n.id):void 0,o=n.type==="problem"?e.design.graph.nodes.find(d=>d.id===n.id&&typeof d.problem=="string"):void 0;if(!i&&!o)return ft().finding=void 0,!1;const r=document.createElement("button");if(r.className="node-navigate finding-back",r.textContent="← 指摘一覧に戻る",r.onclick=()=>{ft().finding=void 0,xt(),I("drawer-mode-findings").focus({preventScroll:!0})},t.append(r),i)t.append(Lu(i));else{const d=document.createElement("h2");d.textContent=`困りごと · ${o.name}（${String(o.pain_level)}）`,t.append(d,et(String(o.problem)))}const s=i?.targets??[o.id];if(s.length){const d=document.createElement("section"),a=document.createElement("h3");a.textContent="関連項目へ移動",d.append(a);for(const l of s){const u=document.createElement("button");u.className="node-navigate finding-target-link",u.dataset.findingTarget=l;const p=e.design.graph.nodes.some(c=>c.id===l),g=e.hiddenNodes?.includes(l);u.disabled=!p||!!g,u.textContent=(e.design.graph.nodes.find(c=>c.id===l)?.name??l)+(p?g?"（非表示）":"":"（参照先なし）"),u.onclick=()=>$i(l,!0),d.append(u)}t.append(d)}return!0}function Ra(e,t){let n=0;for(const s of e)n=n*31+s.codePointAt(0)>>>0;const i=document.createElement("span");i.className="who-badge",i.style.setProperty("--role-color",(t&&ne()?.design.model?.business.roles?ms(ne().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),i.setAttribute("aria-hidden","true");const o=ne()?.design.model?.business.activities.find(s=>s.id===t),r=o&&"who"in o&&typeof o.who=="object"?o.who?.kind:void 0;return i.append(fi(r==="system"?Rc:r==="scheduler"?Lc:Ur)),i}function ho(e,t=!0){se||!ne()||(bt.cancel(),we(),j.nodeDrawer=e,e&&ft().mode==="findings"&&innerWidth<=800&&(j.drawer=!1),pt(),e&&ne()?.selected&&Zn(ne().selected),xt(),t&&I(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),Ae())}function Zn(e){const t=ne(),n=t?.design.graph.nodes.find(o=>o.id===e);if(!n)return;const i=ft();(i.category!=="role"||n.type!=="business")&&(i.category=n.type==="business"?"activity":"object"),i.collapsed.delete(ed(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(i.search.toLocaleLowerCase())||(i.search=""),requestAnimationFrame(()=>{Array.from(I("node-list").querySelectorAll("[data-list-node]")).find(r=>r.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function ip(e,t){const n=ne();if(!n||se||re||ge===n)return;bt.cancel(),qe=void 0,we();const i=new Set(n.hiddenNodes??[]);for(const o of e)t?i.delete(o):i.add(o);n.hiddenNodes=[...i],vn(),Ae()}function $i(e,t=!1){let n=ne();if(n&&!io(n).graph.nodes.some(p=>p.id===e)&&(we(),Ue?.reopenBusinessOverview(),j.active=j.tabs[0].key,n=ne(),Me()),!n||n.hiddenNodes?.includes(e)||ge===n)return;t||(ft().finding=void 0);const i=I("node-list").contains(document.activeElement);bt.cancel(),qe=void 0,we(),n.selected=e,Zn(e),pt(),vn();const o=I("viewport"),r=o.getBoundingClientRect(),s=I("formattedMarkdownDrawer").getBoundingClientRect(),d=j.drawer&&s.left>r.left&&s.left<r.right?s.left:r.right,a=Math.max(1,Math.min(o.clientWidth,d-r.left-o.clientLeft)),l=o.clientHeight;n.viewInset=[o.clientWidth/(2*n.zoom),o.clientHeight/(2*n.zoom)];const u=n.positions[e];if(n.scroll=[(u[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-a/2,(u[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-l/2],Gt(n),o.scrollLeft=n.scroll[0],o.scrollTop=n.scroll[1],we(),i){const p=t?"[data-finding-target]":"[data-list-node]",g=Array.from(I("node-list").querySelectorAll(p)).find(c=>(t?c.dataset.findingTarget:c.dataset.listNode)===e);(t?g:g?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}Ae()}function xt(){const e=ne(),t=ft(),n=I("node-list"),i=n.scrollTop,o=document.activeElement;o?.closest("[data-list-node]")?.dataset.listNode,o?.hasAttribute("data-node-visibility"),o?.dataset.role;const r=I("drawer-modes");r.replaceChildren();for(const h of["findings"]){const m=document.createElement("button");m.id="drawer-mode-"+h,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.mode===h)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.mode===h?0:-1,m.textContent=`指摘（${e?Nu(e.design):0}）`;const f=()=>{t.mode=h,xt(),I("drawer-mode-"+h).focus({preventScroll:!0})};m.onclick=f,m.onkeydown=b=>{["ArrowLeft","ArrowRight","Home","End"].includes(b.key)&&(b.preventDefault(),m.focus({preventScroll:!0}))},r.append(m)}for(const h of[I("node-categories"),I("node-list-search"),document.querySelector(".scope-bulk")])h.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const s=I("node-list-search");s.value=t.search,s.disabled=!e||se;const d=I("node-categories");d.replaceChildren();for(const[h,m]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const f=document.createElement("button");f.dataset.category=h,f.id="node-category-"+h,f.setAttribute("role","tab"),f.setAttribute("aria-selected",String(t.category===h)),f.setAttribute("aria-controls","node-list"),f.tabIndex=t.category===h?0:-1,f.textContent=m,f.onclick=()=>{t.category=h,xt(),I("node-category-"+h).focus({preventScroll:!0})},f.onkeydown=b=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(b.key))return;b.preventDefault();const w=["activity","object","role"],y=w.indexOf(h);t.category=b.key==="Home"?"activity":b.key==="End"?"role":w[(y+(b.key==="ArrowRight"?1:2))%3],xt(),I("node-category-"+t.category).focus({preventScroll:!0})},d.append(f)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const a=new Set(e?.hiddenNodes??[]),l=e?.design.graph.nodes.filter(h=>h.scope===!1)??[],u=l.filter(h=>!a.has(h.id)).length,p=I("scope-outside"),g=u===l.length?"true":u===0?"false":"mixed";p.setAttribute("aria-pressed",g),p.setAttribute("aria-label",g==="true"?"スコープ外を非表示":"スコープ外を表示"),p.replaceChildren(fi(g==="false"?Nc:Pc)),p.disabled=!l.length||se||ge===e;const c=I("show-outside");if(c.checked=g==="true",c.indeterminate=g==="mixed",c.setAttribute("aria-checked",g),c.disabled=p.disabled,I("scope-count").textContent=g==="mixed"?`${u}/${l.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(np(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=i;return}if(t.filterNode){const h=document.createElement("p");h.textContent=(e.design.graph.nodes.find(f=>f.id===t.filterNode)?.name??t.filterNode)+"の指摘";const m=document.createElement("button");m.className="node-navigate finding-all",m.textContent="すべての指摘",m.onclick=()=>{t.filterNode=void 0,xt(),I("drawer-mode-findings").focus({preventScroll:!0})},n.append(h,m)}n.append(Tu(e.design,t.resolved,h=>{t.resolved=h,xt(),n.querySelector("input")?.focus({preventScroll:!0})},Xi,t.filterNode))}n.scrollTop=i;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}I("node-list-toggle").onclick=()=>ho(!j.nodeDrawer);I("node-list-close").onclick=()=>ho(!1);I("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),ho(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!I("node-list-drawer").hidden&&I("source-dialog").hidden&&(e.preventDefault(),ho(!1))});I("node-list-search").oninput=()=>{ft().search=I("node-list-search").value,xt()};function La(){const e=ne();if(e){const t=e.design.graph.nodes.filter(n=>n.scope===!1);ip(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}I("scope-outside").onclick=La;I("show-outside").onchange=La;const op="http://www.w3.org/2000/svg",Lo=e=>document.createElementNS(op,e),Na=new Ho,Cr=new WeakMap;function sp(e){if(!Br(e.graph))return;let t=Cr.get(e);return t||(t=yl(e),Cr.set(e,t)),t.wires}function rp(e,t,n){ps(I("edges"),e,t,{"data-relation":String(n)})}let mi=()=>{},Zt=[0,0],pn=[0,0];function ap(){const e=I("node-list-drawer");return I("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function cp(){const e=I("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Gt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],i=Object.values(e.positions),o=[Math.min(0,...i.map(p=>p[0])),Math.min(0,...i.map(p=>p[1]))],r=[o[0]<0||n[0]>0?Math.min(o[0],pn[0]):0,o[1]<0||n[1]>0?Math.min(o[1],pn[1]):0],{growth:s,origin:d}=Cc(n,r,e.zoom),a=s.some(Boolean);a&&(e.canvasOrigin=d,e.scroll=[e.scroll[0]+s[0],e.scroll[1]+s[1]],Ht(),Ae(180,!1));const l=Math.ceil(Math.max(1400,Zt[0],(ap()+e.scroll[0])/e.zoom-t[0]*2-d[0],...i.map(p=>p[0]+340))),u=Math.max(850,Zt[1],Math.max(Zt[1],...i.map(p=>p[1]+68))+cp()/e.zoom-t[1],(I("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-d[1],...i.map(p=>p[1]+220));I("canvas").style.width=(l+d[0]+t[0]*2)*e.zoom+"px",I("canvas").style.height=(u+d[1]+t[1]*2)*e.zoom+"px",I("nodes").style.left=(d[0]+t[0])*e.zoom+"px",I("nodes").style.top=(d[1]+t[1])*e.zoom+"px",I("edges").style.left=t[0]*e.zoom+"px",I("edges").style.top=t[1]*e.zoom+"px",I("nodes").style.width=l+"px",I("nodes").style.height=u+"px",I("nodes").style.transform=`scale(${e.zoom})`,I("edges").setAttribute("viewBox",`${-d[0]} ${-d[1]} ${l+d[0]} ${u+d[1]}`),I("edges").style.width=(l+d[0])*e.zoom+"px",I("edges").style.height=(u+d[1])*e.zoom+"px",a&&(I("viewport").scrollLeft=e.scroll[0],I("viewport").scrollTop=e.scroll[1]),I("zoom").textContent=Math.round(e.zoom*100)+"%"}function vn(){Ca(dp)}function dp(){fo(),fn.cancel(),mi=()=>{},Zt=[0,0],pn=[0,0];const e=ne();if(I("nodes").replaceChildren(),I("edges").replaceChildren(),I("empty").hidden=!!e,I("canvas").hidden=!e,!e){I("viewport").scrollLeft=0,I("viewport").scrollTop=0,on(),xt();return}const t=io(e),n=t.graph.nodes,i=n.filter(u=>!e.hiddenNodes?.includes(u.id)),o=new Set(i.map(u=>u.id));e.selected&&!o.has(e.selected)&&(e.selected=void 0);const r=e.selected,s=e.positions,d=Ui(t.graph.relations,r);Gt(e),I("edges").append(us());const a=$u(t.graph.relations,j.preferWrite===!0),l=()=>{const u=n.flatMap(f=>{const b=s[f.id];return b?[{id:f.id,x:b[0],y:b[1],width:260,height:68}]:[]}),p=sp(t),g=Na.update(e,t,u,t.graph.relations,p),c=new Map;for(Zt=[0,0],pn=[0,0];I("edges").childNodes.length>1;)I("edges").lastChild.remove();const h=new Map(e.design.graph.nodes.map(f=>[f.id,f.name]));t.graph.relations.forEach((f,b)=>{if(a.has(b))return;const w=g[b];if(!w||(Zt[0]=Math.max(Zt[0],w.bounds.right+20,w.label[0]+Math.max(30,f.label.length*12)/2+12),Zt[1]=Math.max(Zt[1],w.bounds.bottom+20,w.label[1]+22),pn[0]=Math.min(pn[0],...w.points.map(L=>L[0]-20),w.label[0]-Math.max(30,f.label.length*12)/2-12),pn[1]=Math.min(pn[1],...w.points.map(L=>L[1]-20),w.label[1]-22),e.selectedEdgesOnly===!0&&d.muted(f)||!o.has(f.from)||!o.has(f.to)||e.showExceptions===!1&&(f.kind==="business-exception"||f.kind==="object-exception")))return;const y=Lo("path");y.setAttribute("d",w.path),y.dataset.relation=String(b),y.dataset.collisions=String(w.collisions),y.dataset.rerouted=String(w.rerouted),y.dataset.fallback=String(w.fallback),y.setAttribute("marker-end","url(#arrow)"),y.classList.add("edge"),f.kind.endsWith("exception")&&y.classList.add("exception"),d.related(f)&&(y.classList.add("review-related"),y.setAttribute("marker-end","url(#related-arrow)")),d.muted(f)&&y.classList.add("muted");const E=Lo("title");E.textContent=(h.get(f.from)??f.from)+" → "+(h.get(f.to)??f.to)+": "+f.label,y.append(E),I("edges").append(y),f.kind.endsWith("exception")&&rp(y,w,b);const S=Fr(f,b,p?.[b]),x=c.get(S);if(x){x.dataset.relations+=" "+b,d.related(f)&&(x.classList.add("review-related"),x.classList.remove("muted"));return}const A=Lo("text");c.set(S,A),A.dataset.relations=String(b),A.setAttribute("x",String(w.label[0]-Math.max(30,f.label.length*12)/2)),A.setAttribute("y",String(w.label[1])),A.setAttribute("text-anchor","start"),A.classList.add("edge-label"),A.setAttribute("dominant-baseline","middle"),A.dataset.relation=String(b),d.related(f)&&A.classList.add("review-related"),d.muted(f)&&A.classList.add("muted"),A.textContent=f.label,I("edges").append(A)});const m=I("edges");for(const f of[...Array.from(m.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(m.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(m.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(m.querySelectorAll(".edge-label.review-related"))])m.append(f);Gt(e)};mi=l,l(),i.forEach(u=>{const p=document.createElement("div");p.setAttribute("role","group"),p.className="node "+u.type+(u.scope===!1?" outside":u.scope===null?" scope-undecided":"")+d.nodeClasses(u.id),p.dataset.node=u.id,u.type==="business"&&(p.dataset.activity=u.id),p.style.left=s[u.id][0]+"px",p.style.top=s[u.id][1]+"px",u.type==="business"?p.append(Ra(String(u.who),u.id)):p.append(Gr(u));const g=document.createElement("span");g.className="node-text";const c=document.createElement("span");c.className="review-kind",c.textContent=(u.type==="business"?"Activity":"Object")+(u.scope===null?" · 範囲未決":u.scope?" · 範囲内":" · 範囲外"),g.append(c);const h=document.createElement("span");if(h.className="node-name",h.textContent=u.name,g.append(h),u.type==="business"){const y=document.createElement("small");y.textContent=String(u.who),g.append(y)}if(p.append(g),Tc(u.id,li(e))){const y=document.createElement("button");y.type="button",y.className=u.type==="business"?"activity-open":"object-open",y.setAttribute("aria-label",u.name+"の詳細タブを開く"),y.title="詳細タブを開く",y.textContent="開く",y.onpointerdown=E=>E.stopPropagation(),y.onpointerup=E=>E.stopPropagation(),y.onclick=E=>{E.stopPropagation(),u.type==="business"?rs(u.id):Pa(u.id),Ue?.businessActivated()},p.append(y)}p.title=u.name+(u.type==="business"?" — "+String(u.who):""),p.setAttribute("aria-label",p.title+(u.id===r?"（選択中）":""));const m=Ru(e.design,u);if(m.length){const y=document.createElement("button");y.type="button",y.className="finding-badges",y.textContent=m.join(" · "),y.setAttribute("aria-label",u.name+"の指摘を開く"),y.onpointerdown=E=>E.stopPropagation(),y.onpointerup=E=>E.stopPropagation(),y.onclick=E=>{E.stopPropagation(),tp(u.id)},p.append(y),p.setAttribute("aria-label",p.getAttribute("aria-label")+" · "+m.join("、"))}let f;const b=p;b.onpointerdown=y=>{y.button!==0||ge===e||Rt||(y.stopPropagation(),b.setPointerCapture(y.pointerId),f=y.pointerId,fn.begin(u.id,[y.clientX,y.clientY]))},b.onpointermove=y=>{f===void 0||y.pointerId!==void 0&&y.pointerId!==f||!p.isConnected||ge===e||fn.move([y.clientX,y.clientY])},b.onpointerup=y=>{if(f===void 0||f!==y.pointerId||(f=void 0,!p.isConnected||ge===e))return;const E=fn.end();b.hasPointerCapture?.(y.pointerId)&&b.releasePointerCapture(y.pointerId),E&&(E.moved||(ft().finding=void 0,e.selected!==u.id&&(e.selected=u.id,Ht()),Zn(u.id)),we(),vn(),Ae(180,!1))};const w=y=>{f===void 0||f!==y.pointerId||(f=void 0,p.isConnected&&(fn.cancel(),we(),Ae(180,!1)))};b.onpointercancel=w,b.onlostpointercapture=w,I("nodes").append(p)}),I("zoom").textContent=Math.round(e.zoom*100)+"%",on(),xt()}function rs(e){se||re||ge||(we(),Cl(j,e),Me(),Ae(),I("viewport").focus({preventScroll:!0}))}function Pa(e){se||re||ge||(we(),Dl(j,e),Me(),Ae(),I("viewport").focus({preventScroll:!0}))}function Me(){Ta(),document.title=j.document?j.document.name+" · Alder Viewer":"Alder Viewer",bt.cancel(),qe=void 0,pt(),os(),vn();const e=ne();e&&(I("viewport").scrollLeft=e.scroll[0],I("viewport").scrollTop=e.scroll[1]),I("refresh").toggleAttribute("disabled",se||re||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Qt.has(Mn(e))),I("refresh").hidden=!e,I("view-markdown").toggleAttribute("disabled",se||Ne||re||!1||!e||Qt.has(Mn(e))),I("view-markdown").hidden=!e,I("open-checks").hidden=!e||e.design.sourceFormat==="json",I("open-checks").toggleAttribute("disabled",se||Ne||re||!1||!e||!!(e&&yn(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])I(t).toggleAttribute("disabled",se||Ne||re);I("open-sample").setAttribute("aria-disabled",String(se||Ne||re)),I("open-sample").tabIndex=se||Ne||re?-1:0,I("theme").toggleAttribute("disabled",se),gi(),mo(),Hu(),yo(),Ue?.syncDocument()}function Ta(){const e=I("header-title"),t=j.document?.design.namedPlans;if(!t){(e.textContent!=="Alder Viewer"||e.querySelector("select"))&&(e.textContent="Alder Viewer");return}e.classList.remove("header-title-hidden");let n=e.querySelector("select");n||(e.replaceChildren(),n=document.createElement("select"),n.id="plan-select",n.setAttribute("aria-label","業務案を切り替える"),n.onchange=()=>{lp(n.value)},e.append(n));const i=Array.from(n.options).map(o=>[o.value,o.textContent]);JSON.stringify(i)!==JSON.stringify(t.choices.map(({id:o,name:r})=>[o,r]))&&n.replaceChildren(...t.choices.map(({id:o,name:r})=>{const s=document.createElement("option");return s.value=o,s.textContent=r,s})),n.value=t.selected,n.title=t.choices.find(o=>o.id===t.selected)?.name??"",n.disabled=se||Ne||re||!1}async function lp(e){const t=j.document;if(!t?.design.namedPlans||se||Ne||re||ge||e===t.design.namedPlans.selected)return;const n=document.querySelector("#plan-select"),i=document.activeElement===n;try{if(!I("source-dialog").hidden&&!await Ii()){Ta();return}const o=sn(t.design.markdown,e),r=crypto.randomUUID(),s=Vt({...j,tabs:[],active:r},j.recovery,{...t,design:o},[{key:r,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]);await ki(()=>s,()=>{j=s}),Ue?.reopenBusinessOverview(),Ue?.activateBusiness(),Ue?.businessActivated(),$e("")}catch(o){Me(),o instanceof Rn||$e("案を切り替えられません: "+o.message,"error")}finally{i&&(document.activeElement===document.body||document.activeElement===document.documentElement||document.activeElement===n)&&document.querySelector("#plan-select")?.focus({preventScroll:!0})}}async function wi(e){const t=j.document,n=Ol(j,e);return t?(await ki(()=>n,()=>{j=n,_n.add(tn(j.tabs[0])?.key??j.tabs[0].key)}),!0):(we(),j=n,_n.add(tn(j.tabs[0])?.key??j.tabs[0].key),Me(),Ae(),!0)}async function qa(e,t){if(Pt&&!await Ii())return;const n=await Ji(e),i=ne();if(t&&i?.handle&&await i.handle.isSameEntry(t)){if(i.design.markdown!==n.markdown&&!await hi(i,n,t))return;Ue?.reopenBusinessOverview(),j.active=j.tabs[0].key,Me(),Ae();return}const o=Xn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await wi(o)}I("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])I("guide-"+e).onclick=()=>I(e).click();I("open-sample").onpointerdown=e=>e.stopPropagation();I("open-sample").onclick=async e=>{if(e.preventDefault(),!(se||Ne||re))try{if(j.document?.source?.kind==="sample"&&j.document.design.markdown===xr){we(),Ue?.reopenBusinessOverview(),j.active=j.tabs[0].key,Me(),I("viewport").focus({preventScroll:!0});return}const t=sn(xr),n=j.document?.source?.kind==="sample"&&j.document.design.markdown===Os?j.tabs[0]:void 0;n&&we();const i=n??j.sampleLayout,o=i?Fu(i,t):{},r=Xn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...o},t);await wi(r)&&I("viewport").focus({preventScroll:!0})}catch(t){$e("サンプルを開けません: "+t.message,"error")}};I("open").onclick=async()=>{if(!(se||Ne||re)){Ne=!0,Me();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await qa(await n.getFile(),n)}else I("fallback").click()}catch(e){e.name!=="AbortError"&&$e("開けません: "+e.message,"error")}finally{Ne=!1,Me()}}};I("fallback").onchange=async()=>{const e=I("fallback");if(!(se||Ne||re)){Ne=!0,Me();try{for(const t of Array.from(e.files??[]))await qa(t)}catch(t){$e("開けません: "+t.message,"error")}e.value="",Ne=!1,Me()}};class Rn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function ki(e,t){if(re||ge)throw Error("表示を切り替えています。完了後に再試行してください。");try{po()}catch(o){throw new Rn(o)}we(),clearTimeout(bn),bn=void 0,re=!0,Lt++;const n=Lt;Me(),tt();let i=!1;try{const o=structuredClone(Is(e()));await Ea(o,n);const r=j;t(),j!==r&&(j=Ml(j,r)),ut==="view"&&Pt&&!j.tabs.some(s=>s.key===Pt)&&(Pt=j.tabs[0]?.key),Aa(o),i=!0}catch(o){throw Ms(),new Rn(o)}finally{re=!1,Me(),tt(),i&&Lt!==n&&Ae(0,!1)}}async function hi(e,t,n=e.handle,i=!1){if(!nn(e)||e.design!==j.document?.design)return!1;e.design.namedPlans&&t.namedPlans&&(t=sn(t.markdown,e.design.namedPlans.selected));const o=!!e.design.namedPlans!=!!t.namedPlans,r=crypto.randomUUID(),s=j.document,d=o&&s?Vt({...j,tabs:[],active:r},j.recovery,{...s,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},[{key:r,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]):jl(j,t,n,i);return await ki(()=>d,()=>{j=d}),jn=void 0,yo(),$e(""),!0}async function Dr(e){if(!nn(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await hi(e,await Ji(await n.getFile()),n)}else await new Promise((n,i)=>{const o=document.createElement("input");o.type="file",o.accept=".md,.markdown,.json",o.hidden=!0,document.body.append(o);const r=()=>{o.remove(),n()};o.oncancel=r,o.onchange=async()=>{try{const s=o.files?.[0];s&&await hi(e,await Ji(s)),r()}catch(s){o.remove(),i(s)}},o.click()})}I("refresh").onclick=async()=>{const e=ne();if(se||re||ge||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Qt.has(Mn(e)))return;Pt===e.key&&Yi();const t=Mn(e);Qt.add(t),Me();try{if(e.source?.kind==="url"){const i=await ro(e.source.url);await hi(e,i);return}if(!e.handle){await Dr(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!nn(e))return;if(n!=="granted"){$e("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Dr(e);return}await hi(e,await Ji(await e.handle.getFile()))}catch(n){nn(e)&&n.name!=="AbortError"&&!(n instanceof Rn)&&$e("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Qt.delete(t),Me()}};let ut="text",Pt,en=!1,gn=0,Zi,as=null;const Bt=()=>I("source-text"),bi=()=>I("source-url");function Ns(){es=!I("source-dialog").hidden&&ut!=="view"&&(ut==="text"?Bt().value:bi().value)!=="",tt()}bi().addEventListener("input",Ns);function gi(){cs();const e=ut==="view",t=en||re;Bt().disabled=t,Bt().readOnly=e,I("source-dialog").dataset.mode=ut,I("source-submit").hidden=e,I("source-submit").textContent="表示",I("source-submit").disabled=t||e,I("source-cancel").disabled=re||t&&ut!=="url",I("source-cancel").textContent=e?"閉じる":"キャンセル",Ns(),queueMicrotask(za)}function Ps(e,t){if(!(se||Ne||re||t&&Qt.has(Mn(t)))){Zi?.abort(),gn++,ut=e,Pt=t?.key,en=!1,as=document.activeElement,I("source-dialog").hidden=!1,I("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${j.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])I(n).hidden=e!=="url";for(const n of["text-label","source-text"])I(n).hidden=e==="url";I("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Bt().value=t.design.markdown:e==="text"&&(Bt().value=bo),gi(),(e==="url"?bi():Bt()).focus()}}let bo="",Pi;function up(){if(as?.isConnected&&as.focus({preventScroll:!0}),Pi!==void 0&&cancelAnimationFrame(Pi),ut!=="view")return;const e=gn;Pi=requestAnimationFrame(()=>{if(Pi=void 0,e!==gn||!I("source-dialog").hidden)return;const t=window.visualViewport,n=Et.querySelector("header"),i=n.getBoundingClientRect();t&&t.height>0&&i.height>0&&i.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Yi(){gn++,Zi?.abort(),en=!1,Pt=void 0,I("source-dialog").hidden=!0,gi(),up()}async function Ii(){return re?!1:(ut==="text"&&(bo=Bt().value),Yi(),!0)}function $a(){return Ii()}Bt().oninput=()=>{ut==="text"&&(bo=Bt().value,Ns())};let Wi=!1;function Wa(){return se||Ne||en||re||ge?"読込が終わってから共有してください。":Wu(ne())}function cs(){const e=Wa(),t=I("share-source");t.hidden=!ne(),t.setAttribute("aria-disabled",String(Wi||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}I("share-source").onclick=async()=>{if(Wi)return;const e=Wa();if(e){$e(e,"warning");return}const t=ne();if(t.source?.kind!=="url")return;const n=t.source.url,i=zu(location.href,n);Wi=!0,cs();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(i),$e("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{$e("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{Wi=!1,cs()}};let Xt,$n=0,Mr=0,ci;function za(){if(se||Ne||en||ge||re||Xt||ci===void 0)return;const e=ci;ci=void 0,Ts(e)}async function Ts(e=location.hash){const t=e;if(se)return;const n=++Mr;if(!/^#source(?:=|$)/.test(t)){ci=void 0,Xt&&!re&&(Xt.abort(),Xt=void 0,$n++,Ne=!1,Me());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),re){ci=t;return}if(en||Ne&&!Xt){$e("読込が終わってから共有リンクを開き直してください。","warning");return}const i=++$n;Xt?.abort();try{const o=Uu(t);po();const r=j.tabs.find(l=>l.source?.kind==="url"&&l.source.url===o),s=r;if(s){if(Pt&&Pt!==s.key&&!await Ii()||i!==$n||n!==Mr)return;const l=we()||j.active!==s.key;j.active=s.key,Me(),Ae(180,l),$e("開いている共有元のタブを選択しました。表示内容は保持しています。"),Si();return}Xt=new AbortController,Ne=!0,Me();const d=await ro(o,Xt.signal);if(i!==$n)return;const a=Xn({key:crypto.randomUUID(),name:new URL(o).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:o},design:d,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},d);if(!await wi(a))return;$e("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+o)}catch(o){i===$n&&!(o instanceof Rn)&&$e("共有リンクを開けません。既存の表示は保持しています: "+o.message,"error")}finally{i===$n&&(Xt=void 0,Ne=!1,Me(),za())}}window.addEventListener("hashchange",()=>{Ts().then(()=>{j.document?.key===ds&&Si()})});function qs(e){j.drawer=!0,pt(),on()}async function pp(e){const t=yn(e);if(!(e.design.sourceFormat==="json"||t.busy||re||se||ge===e)){t.busy=!0;try{await Ls(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,on()}}}let Qi;Ft.onchange=()=>{const e=Ft.files?.[0],t=Qi??ne();Qi=void 0,Ft.value="",!(!e||!t||!nn(t))&&(qs(),Da(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};Ft.oncancel=()=>{Qi=void 0};I("check-open").onclick=()=>{Qi=ne(),Ft.click()};let $s,zi=null;function Ws(){rn.hidden=!0,$s=void 0,(zi&&!zi.closest("[hidden]")?zi:I("open-checks").getBoundingClientRect().width?I("open-checks"):I("document-actions-toggle")).focus({preventScroll:!0})}I("check-open-url").onclick=()=>{const e=ne();e&&(zi=ss??document.activeElement,$s=e,I("check-url").value=yn(e).url??"",rn.hidden=!1,I("check-url").focus())};I("check-url-cancel").onclick=Ws;rn.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),Ws())};I("check-url-form").onsubmit=e=>{e.preventDefault();const t=$s;if(!t||!nn(t))return;const n=I("check-url").value.trim();yn(t).url=n,Ws(),qs(),Da(t,async()=>({name:n,url:n,markdown:await Du(n)}))};I("check-open-sample").onclick=()=>{const e=ne();!e||!Rs(e)||(qs(),Ma(e,{name:"チェックリストのサンプル",markdown:Bu}))};I("check-close").onclick=()=>{const e=ne();e&&pp(e)};I("open-sample-menu").onclick=()=>{I("open-sample").click()};I("view-markdown").onclick=()=>{const e=ne();e&&Ps("view",e)};I("open-url").onclick=()=>Ps("url");I("open-text").onclick=()=>Ps("text");I("source-cancel").onclick=()=>$a();I("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),$a())};I("source-submit").onclick=async()=>{if(en||re||ut==="view"&&ge||I("source-dialog").hidden||ut==="view")return;en=!0,gi();const e=++gn,t=ut;Zi=new AbortController;try{const n=ut==="url"?new URL(bi().value.trim()).href:bi().value.trim();if(t==="url"&&j.document?.source?.kind==="url"&&j.document.source.url===n){Ue?.reopenBusinessOverview(),j.active=j.tabs[0].key,Yi(),Me(),Si();return}const i=t==="url"?await ro(n,Zi.signal):Mu(Bt().value),o=i.markdown;if(e!==gn)return;const r=Xn({key:crypto.randomUUID(),name:t==="text"?i.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:i,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},i);if(!await wi(r))return;$e(""),t==="text"&&(bo=o),Yi()}catch(n){e===gn&&!(n instanceof Rn)&&$e("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===gn&&(en=!1,gi())}};I("layout-lock").onclick=()=>{se||(bt.cancel(),qe=void 0,we(),Rt=!Rt,pt(),vn())};I("selected-edges-only").onchange=()=>{const e=ne();!e||se||re||ge===e||(bt.cancel(),qe=void 0,we(),e.selectedEdgesOnly=I("selected-edges-only").checked,mi(),Ae())};I("show-exceptions").onchange=()=>{const e=ne();!e||se||re||ge===e||(bt.cancel(),qe=void 0,we(),e.showExceptions=I("show-exceptions").checked,mi(),Ae())};I("prefer-write").onchange=()=>{se||(we(),j.preferWrite=I("prefer-write").checked,vn(),Ae())};I("theme").onclick=()=>{se||(j.dark=!j.dark,pt(),Ae())};I("drawer").onclick=()=>{se||!ne()||(we(),j.drawer=!j.drawer,Me(),Ae())};for(const[e,t]of[["in",Zs],["out",1/Zs]])I(e).onclick=()=>{const n=ne();if(n&&ge!==n){const i=we(),o=Ac({zoom:n.zoom,scroll:n.scroll},t).zoom,r=i||o!==n.zoom;n.zoom=o,Me(),Ae(180,r)}};const je=I("viewport");function Ua(e,t){const n=ne();if(!n||re||ge===n)return;we();const i=n.positions[e];n.positions[e]=t,(i?.[0]!==t[0]||i?.[1]!==t[1])&&Ht();const o=Array.from(I("nodes").children).find(r=>r.dataset.node===e);o&&(o.style.left=t[0]+"px",o.style.top=t[1]+"px"),mi()}const fn=jc({read:()=>{const e=ne();return e&&!re&&e!==ge&&!Rt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[je.scrollLeft,je.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>ne()?.positions[e],connected:e=>Array.from(I("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=je.getBoundingClientRect(),t=e.left+je.clientLeft,n=e.top+je.clientTop,i={left:t,top:n,right:t+je.clientWidth,bottom:n+je.clientHeight};for(const[r,s]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const d=I(r),a=d.getBoundingClientRect();d.hidden||a.bottom<=n||a.top>=i.bottom||(s==="right"&&a.left>i.left&&a.left<i.right&&(i.right=a.left),s==="left"&&a.right>i.left&&a.right<i.right&&(i.left=a.right))}const o=document.querySelector(".toolbar").getBoundingClientRect();return o.height&&o.top<i.bottom&&o.bottom>i.top&&(i.bottom=Math.max(i.top,o.top-12)),i},change:Ua,pan:e=>{const t=ne();if(!t||t===ge||Rt)return;we();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],i=t.canvasOrigin??[0,0],o=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];o.some(Boolean)&&(t.canvasOrigin=[i[0]+o[0]/t.zoom,i[1]+o[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+o[0]),Math.max(0,n[1]+o[1])],Gt(t),je.scrollLeft=t.scroll[0],je.scrollTop=t.scroll[1],we(),Ht()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),bt=Ec(je,{nodeDrag:fn,read:()=>{const e=ne();return e&&!re&&ge!==e?{key:e.key,zoom:e.zoom,locked:Rt,scroll:[je.scrollLeft,je.scrollTop]}:void 0},position:e=>ne()?.positions[e],change:e=>{const t=ne();if(!t||re||ge===t)return;const n=t.scroll;let i=!1;e.node&&Ua(e.node.id,e.node.position),e.selected&&(ft().finding=void 0,i=i||t.selected!==e.selected,t.selected=e.selected,Zn(e.selected)),e.zoom!==void 0&&(i=i||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?vn():e.zoom!==void 0&&Gt(t),e.scroll&&(je.scrollLeft=e.scroll[0],je.scrollTop=e.scroll[1]),we(!1),(i||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Ht()},finish:()=>{const e=ne();e&&Gt(e),we(),Ae(180,!1)}}),zs=()=>{bt.cancel(),qe=void 0,we(),Ae(0,!1)};window.addEventListener("blur",zs);window.addEventListener("pagehide",zs);document.addEventListener("visibilitychange",()=>{document.hidden&&zs()});je.onscroll=()=>{we()};let qe;Oc(je,{read:()=>{const e=ne();return e&&!se&&!re&&e!==ge?{zoom:e.zoom,scroll:[je.scrollLeft,je.scrollTop]}:void 0},change:e=>{const t=ne();!t||re||t===ge||(bt.cancel(),fn.cancel(),qe=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Gt(t),je.scrollLeft=t.scroll[0],je.scrollTop=t.scroll[1],we(!1),Ht(),Ae(180,!1))}});je.onpointerdown=e=>{const t=ne(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||re||t===ge||n&&!Rt||(qe={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[je.scrollLeft,je.scrollTop],node:n,moved:!1},je.setPointerCapture(e.pointerId))};je.onpointermove=e=>{if(qe&&qe.pointer===e.pointerId&&qe.key===ne()?.key&&ne()!==ge){const t=e.clientX-qe.x,n=e.clientY-qe.y;Math.hypot(t,n)>3&&(qe.moved=!0),je.scrollLeft=qe.scroll[0]-t,je.scrollTop=qe.scroll[1]-n,we()}};je.onpointerup=e=>{if(!qe||qe.pointer!==e.pointerId)return;const t=ne(),n=qe;qe=void 0,je.hasPointerCapture?.(e.pointerId)&&je.releasePointerCapture(e.pointerId),t&&t!==ge&&n.key===t.key&&!n.moved&&n.node&&(ft().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Ht()),Zn(n.node),vn()),we(),Ae(180,!1)};je.onpointercancel=()=>{qe=void 0};je.addEventListener("lostpointercapture",e=>{e.target===je&&qe?.pointer===e.pointerId&&(qe=void 0)});let go=!1;I("resize").onpointerdown=e=>{se||(go=!0,I("resize").setPointerCapture(e.pointerId))};I("resize").onpointermove=e=>{if(go){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==j.width&&(j.width=t,Ht()),pt()}};I("resize").onpointerup=()=>{go=!1,Ae(180,!1)};I("resize").onpointercancel=()=>{go=!1,Ae(180,!1)};I("resize").onkeydown=e=>{if(!se&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,j.width+(e.key==="ArrowLeft"?20:-20)));t!==j.width&&(j.width=t,Ht()),pt(),Ae(180,!1)}};window.addEventListener("resize",()=>{pt();const e=ne();e&&Gt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=ne();t&&Gt(t)});e.observe(I("viewport")),e.observe(document.querySelector(".toolbar"))}function Ti(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");const t=e.design.namedPlans?.selected;if(e.design.namedPlans!==void 0&&typeof t!="string")throw Error("Invalid saved plan selection");if(e.design=sn(e.design.markdown,t),e.design.namedPlans&&t===void 0)throw Error("Missing saved plan selection");if(e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");Hn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Yn=document.createElement("section");Yn.id="source-update-notice";Yn.className="info-bar";Yn.hidden=!0;Yn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Yn);let jn;const Va=new Set;let No=0,ds,Po;function yo(){const e=j.document;Yn.hidden=!jn||jn.key!==e?.key||jn.baseline!==e.design.markdown||Va.has(e.key),I("source-update-refresh").disabled=se||Ne||re||!!(e&&Qt.has(e.key))}I("source-update-close").onclick=()=>{jn&&Va.add(jn.key),yo()};I("source-update-refresh").onclick=()=>{I("refresh").click()};async function Si(){const e=j.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(Po===t)return;Po=t;const n=++No,i=e.key,o=e.source.url,r=e.design.markdown;try{const s=await As(o);if(n!==No||j.document?.key!==i||j.document.design.markdown!==r||j.document.source?.kind!=="url"||j.document.source.url!==o)return;sn(s),jn=s.replace(/\r\n?/g,`
`)!==r.replace(/\r\n?/g,`
`)?{key:i,url:o,baseline:r}:void 0,yo()}catch{}finally{n===No&&(Po=void 0)}}Ue=cl(Et,{rightDrawer:{isOpen:()=>j.drawer,isReady:()=>!se,setOpen:e=>{se||(j.drawer=e,pt(),Ae())}},capture:()=>{we(),bt.cancel(),qe=void 0},business:()=>({key:j.document?.design.namedPlans?JSON.stringify([j.document.key,j.document.design.namedPlans.selected]):j.document?.key,design:j.document?.design,relatedChecks:j.tabs[0]?$l(j.tabs[0]):[],viewKey:ne()?.key,views:j.tabs.map(e=>({key:e.key,name:e.name,activity:Gi(e),object:Hi(e)})),activities:j.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:j.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:j.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!j.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=j.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{rs(e),$i(e)},openObject:e=>{Pa(e),$i(e)},openOverview:()=>{j.tabs[0]&&(we(),Ue?.reopenBusinessOverview(),j.active=j.tabs[0].key,Me(),Ae())},activateView:e=>{j.tabs.some(t=>t.key===e)&&(we(),j.active=e,Me(),Ae())},statePanel:e=>j.document?pl(j.document.design,e,t=>{Ue?.activateBusiness(),rs(t),$i(t),Ue?.businessActivated()}):void 0,closeLegacyList:()=>{j.nodeDrawer=!1,pt()},refresh:()=>{pt(),Qo.update()}});const fp=j;Me();tt();kl().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const l of t.recovery??[])Ti(l);if(t.document){const l={...t.document};Ti(l),t.document.design=l.design,t.document.checks=l.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const l of t.tabs)Ti(l)}const n=El(t),i={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(l=>({...l,name:n.document.name,design:l.design,checks:l.checks,source:l.source,draft:l.draft,edited:l.edited,handle:l.handle}))};if(!Array.isArray(i.tabs)||typeof i.dark!="boolean"||typeof i.drawer!="boolean"||i.preferWrite!==void 0&&typeof i.preferWrite!="boolean"||i.scopeOutside!==void 0&&!["show","dim","hide"].includes(i.scopeOutside)||i.dimOutside!==void 0&&typeof i.dimOutside!="boolean"||i.hideOutside!==void 0&&typeof i.hideOutside!="boolean"||!Number.isFinite(i.width))throw Error("Invalid session");for(const l of i.tabs)Ti(l);if(new Set(i.tabs.map(l=>l.key)).size!==i.tabs.length||i.active!==void 0&&typeof i.active!="string")throw Error("Invalid saved tab keys");if(i.nodeDrawer!==void 0&&typeof i.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const l of[...i.tabs,...i.sampleLayout===void 0?[]:[i.sampleLayout]])if(!l||!l.positions||typeof l.positions!="object"||Array.isArray(l.positions)||l.selectedEdgesOnly!==void 0&&typeof l.selectedEdgesOnly!="boolean"||l.showExceptions!==void 0&&typeof l.showExceptions!="boolean"||l.hiddenNodes!==void 0&&(!Array.isArray(l.hiddenNodes)||!l.hiddenNodes.every(u=>typeof u=="string"))||l.viewInset!==void 0&&(!Array.isArray(l.viewInset)||l.viewInset.length!==2||!l.viewInset.every(u=>Number.isFinite(u)&&u>=0))||l.canvasOrigin!==void 0&&(!Array.isArray(l.canvasOrigin)||l.canvasOrigin.length!==2||!l.canvasOrigin.every(u=>Number.isFinite(u)&&u>=0))||!Array.isArray(l.scroll)||l.scroll.length!==2||!l.scroll.every(Number.isFinite)||!Number.isFinite(l.zoom)||l.zoom<.25||l.zoom>2.5||!Object.values(l.positions).every(u=>Array.isArray(u)&&u.length===2&&u.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:o,hideOutside:r,scopeOutside:s,...d}=i,a=l=>({...l,hiddenNodes:l.hiddenNodes??(i.scopeOutside==="hide"?l.design.graph.nodes.filter(u=>u.scope===!1).map(u=>u.id):[])});j=Vt({...d,tabs:i.tabs.map(a)},n.recovery,n.document,i.tabs.map(l=>{const{design:u,checks:p,source:g,draft:c,edited:h,handle:m,name:f,...b}=a(l);return b})),i.sampleLayout&&i.sampleLayout.hiddenNodes===void 0&&i.scopeOutside==="hide"&&(j.sampleLayout={...i.sampleLayout,hiddenNodes:sn(Os).graph.nodes.filter(l=>l.scope===!1).map(l=>l.id)}),j.tabs.some(l=>l.key===j.active)||(j.active=j.tabs[0]?.key),ne()?.selected&&Zn(ne().selected),ds=j.document?.key,Me(),js=!0}).catch(()=>{j=fp,Jn=!0,Cs()}).finally(()=>{se=!1,Me(),tt(),Ts().then(()=>{j.document?.key===ds&&Si()})});
