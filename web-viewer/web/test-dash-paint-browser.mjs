import assert from 'node:assert/strict';
/** Native SVG stroke/raster boundary only. Geometry and phase permutations live
 * in test-shared-layout, with no browser, HTTP service or external source. */
export async function verifyDashPaint(page){
 const result=await page.evaluate(async()=>{
  const edges=[...document.querySelectorAll('.edge.exception')].filter(e=>e.querySelector('title').textContent.includes(' → 業務設計:'));
  if(edges.length!==2)throw Error('Expected two real exception returns');
  const b=edges[0].getPointAtLength(edges[0].getTotalLength()),y=b.y;
  const paints=edges.map(e=>[...document.querySelectorAll(`.edge-paint[data-relation="${e.dataset.relation}"]`)]);
  const shared=paints.map(runs=>runs.map(p=>p.getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number)).filter(p=>p.length===4&&Math.abs(p[1]-y)<.001&&Math.abs(p[3]-y)<.001).map(p=>Math.max(p[0],p[2]))[0]);
  const left=Math.ceil(b.x+16),right=Math.floor(Math.min(...shared)-12),width=right-left;
  if(!Number.isFinite(width)||width<30)throw Error('Insufficient straight overlap');
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  svg.setAttribute('xmlns',ns);svg.setAttribute('viewBox',`${left} ${y-10} ${width} 20`);svg.setAttribute('width',String(width));svg.setAttribute('height','20');
  for(const paint of [...edges,...paints.flat()]){
   const clone=paint.cloneNode(true),style=getComputedStyle(paint);clone.removeAttribute('class');clone.removeAttribute('marker-end');
   clone.setAttribute('stroke-opacity',style.strokeOpacity);clone.setAttribute('stroke','white');clone.setAttribute('stroke-width',style.strokeWidth);clone.setAttribute('fill','none');
   clone.setAttribute('stroke-dasharray',style.strokeDasharray);clone.setAttribute('stroke-dashoffset',style.strokeDashoffset);svg.append(clone);
  }
  const image=new Image();image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));await image.decode();
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=20;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
  const pixels=ctx.getImageData(0,10,width,1).data;let painted=0,longest=0,run=0,gaps=0;
  for(let x=0;x<width;x++){if(pixels[x*4+3]>127){painted++;longest=Math.max(longest,++run);}else{gaps++;run=0;}}
  return {width,painted,gaps,longest};
 });
 assert.ok(result.gaps>result.width*.25,'overlaid native SVG strokes retain visible gaps');
 assert.ok(result.longest<=7,'overlap cannot become a continuous stroke');
 return result;
}
