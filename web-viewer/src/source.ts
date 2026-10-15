export async function fetchMarkdown(value:string,signal?:AbortSignal):Promise<string>{
  let url:URL;try{url=new URL(value);}catch{throw Error('有効なHTTPS URLを入力してください。');}
  if(url.protocol!=='https:'||url.username||url.password)throw Error('認証情報を含まないHTTPS URLだけ使えます。');
  const controller=new AbortController(),abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});if(signal?.aborted)abort();
  const timer=setTimeout(abort,30000);
  try{
    const response=await fetch(url.href,{method:'GET',mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',redirect:'error',signal:controller.signal,headers:{Accept:'text/markdown, text/plain;q=0.9'}});
    if(!response.ok)throw Error('URL取得に失敗しました（HTTP '+response.status+'）。');
    const type=response.headers.get('content-type')?.toLowerCase()??'';
    if(type.includes('html')||type.includes('json')||type.includes('xml'))throw Error('HTML等の表示ページではなくMarkdown本文URLを指定してください。');
    const limit=2*1024*1024;if(Number(response.headers.get('content-length'))>limit)throw Error('本文は2MiB以内にしてください。');
    const reader=response.body?.getReader();if(!reader)throw Error('本文を読み取れません。');
    let size=0,text='';const decoder=new TextDecoder();
    try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){
      // Cleanup must not replace the size error or delay rejection.
      try{void reader.cancel().catch(()=>{});}catch{}
      throw Error('本文は2MiB以内にしてください。');
    }text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}finally{reader.releaseLock();}
    if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(text))throw Error('HTMLページは読み込めません。');
    return text;
  }catch(e){
    // Abort rejected responses, preserving the reason recorded before cleanup.
    const aborted=controller.signal.aborted;abort();
    if(aborted)throw Error('取得を中止しました。時間を置いて明示的に再試行してください。');if(e instanceof TypeError)throw Error('URLへ接続できません。匿名取得とCORS許可を確認してください。');throw e;
  }
  finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
}
