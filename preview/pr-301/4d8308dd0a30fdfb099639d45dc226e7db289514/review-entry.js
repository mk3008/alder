// Each review link loads the same packaged V2 Business Design as the Viewer fixture.
const page=new URL('./index.html',location.href);
const state='65c10539-528d-5569-a3a1-5fe721ba1970';
const mode=document.body.dataset.review;
page.searchParams.set('review',mode==='business'?'business':mode==='states'?'states':'concept');
page.searchParams.set('reviewState',state);
if(['request','examples','subsystems'].includes(mode)){
 page.searchParams.set('view','concept');page.searchParams.set('conceptFixture','purchase');
 page.searchParams.set('concept',mode==='subsystems'?'subsystems':mode==='examples'?'group-handoff':'group-request');
 if(mode==='request')page.searchParams.set('dataView','overview');
 if(mode==='examples')page.searchParams.set('dataExample','handoff-batch');
}
page.hash='source='+encodeURIComponent(new URL('./purchase-v2-beta.json',location.href).href);
location.replace(page.href);
