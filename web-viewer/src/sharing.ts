import type {Tab} from './session';

/** Keep the original source string; never serialize a document or session. */
export function validateShareSource(value:string):string{
  let url:URL;try{url=new URL(value);}catch{throw Error('共有元には有効なHTTPS URLが必要です。');}
  if(value!==value.trim()||/[\u0000-\u0020\u007f\\]/.test(value)||url.protocol!=='https:'||url.username||url.password||value.includes('?')||value.includes('#')||!/^https:\/\//i.test(value))throw Error('共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。');
  // An empty userinfo delimiter is still user information syntax.
  if(value.slice(value.indexOf('//')+2).split('/')[0].includes('@'))throw Error('認証情報を含むURLは共有できません。');
  return value;
}
export function sourceSharingReason(tab?:Tab):string|undefined{
  if(!tab||tab.source?.kind!=='url')return '「URLを開く」で取得した文書だけ共有できます。';
  try{validateShareSource(tab.source.url);}catch(error){return (error as Error).message;}
  if(tab.edited===true)return '編集を反映した文書は共有できません。「更新」で取得元から読み直してください。';
  if(tab.draft!==undefined)return '未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。';
}
export function createSourceShareLink(viewerURL:string,sourceURL:string):string{
  const url=new URL(viewerURL);url.username='';url.password='';url.search='';url.hash='source='+encodeURIComponent(validateShareSource(sourceURL));return url.href;
}
export function readSharedSource(hash:string):string|undefined{
  if(!/^#source(?:=|$)/.test(hash))return;
  if(!hash.startsWith('#source=')||hash.slice(8).includes('&'))throw Error('共有リンクの形式が正しくありません。');
  let source:string;try{source=decodeURIComponent(hash.slice(8));}catch{throw Error('共有リンクのURLを読み取れません。');}
  return validateShareSource(source);
}
