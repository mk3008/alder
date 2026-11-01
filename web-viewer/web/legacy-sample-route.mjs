// Historic shared links remain readable even though overview links now open test specifications.
export function openLegacySample(window,id){
 const url=new URL(window.location.href);url.searchParams.set('view','concept');url.searchParams.set('dataExample',id);url.searchParams.delete('dataView');
 window.history.pushState({},'',url);window.dispatchEvent(new window.PopStateEvent('popstate'));
}
export async function openLegacySampleInBrowser(page,id){
 await page.evaluate(sampleId=>{const url=new URL(location.href);url.searchParams.set('view','concept');url.searchParams.set('dataExample',sampleId);url.searchParams.delete('dataView');history.pushState({},'',url);window.dispatchEvent(new PopStateEvent('popstate'));},id);
}
