/** Build a review artifact from the exact Vite output. No server or deployment. */
import {mkdirSync,cpSync,writeFileSync,readdirSync,readFileSync} from 'node:fs';
import {join,relative,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export function packageViewerPreview({dist,output,head,pr,fixture}){
 if(!/^[0-9a-f]{40}$/.test(head)||!/^\d+$/.test(String(pr)))throw Error('Pinned review head and PR required');
 const checkout=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),tree=execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim(),sourceTree=execFileSync('git',['rev-parse',`${head}^{tree}`],{encoding:'utf8'}).trim();
 if(tree!==sourceTree)throw Error('Review build tree differs from the pinned head');
 execFileSync('git',['diff','--quiet','HEAD','--','src','../tools/viewer-preview.mjs']);
 const sub=`preview/pr-${pr}/${head}`,web=join(output,sub),offline=join(output,'offline',sub);
 mkdirSync(web,{recursive:true});cpSync(dist,web,{recursive:true});mkdirSync(offline,{recursive:true});
 const html=readFileSync(join(dist,'index.html'),'utf8'),js=/src="\.\/([^\"]+\.js)"/.exec(html)?.[1],css=/href="\.\/([^\"]+\.css)"/.exec(html)?.[1];
 if(!js||!css)throw Error('Unexpected Vite entrypoints');
 const script=readFileSync(join(dist,js),'utf8'),style=readFileSync(join(dist,css),'utf8');
 if(/<\/script/i.test(script)||/<\/style/i.test(style))throw Error('Unsafe inline delimiter in build');
 const standalone=html.replace(/<script type="module"[^>]*src="[^\"]+"><\/script>/,()=>'<script type="module">'+script+'</script>').replace(/<link rel="stylesheet"[^>]*href="[^\"]+">/,()=>'<style>'+style+'</style>');
 writeFileSync(join(offline,'index.html'),standalone);cpSync(fixture,join(output,'gate-b-example.json'));
 const files=readdirSync(output,{recursive:true}).filter(f=>/\.(?:html|js|css|txt|json)$/.test(f)&&!['manifest.json','README.txt'].includes(f));
 const manifest={source:head,checkout,tree,sourceTree,urlPath:`/${sub}/`,offlinePath:`offline/${sub}/index.html`,scriptSha256:createHash('sha256').update(script).digest('hex'),styleSha256:createHash('sha256').update(style).digest('hex'),files:Object.fromEntries(files.map(f=>[f,createHash('sha256').update(readFileSync(join(output,f))).digest('hex')]))};
 writeFileSync(join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 writeFileSync(join(output,'README.txt'),`Alder JSON確認版（未採用・本番とは別の保存領域）\nsource: ${head}\n\nZIPをフォルダー構造を保って展開し、${manifest.offlinePath} をChromeで開きます。\n「開く」→「ファイルを開く」から同梱gate-b-example.jsonを選択します。\n図・一覧でActivityを選び、右Drawerの業務内容/チェック項目、共有保証と例、指摘を確認してください。\nJSONを編集・送信する機能はありません。Checkの確認済みは模擬試験の保存値であり、実際の人間承認ではありません。\nファイルoriginではHTTPSのCORS許可にOrigin:nullが必要です。URL操作を確認する場合は展開先で python3 -m http.server 4173 を起動し、http://localhost:4173${manifest.urlPath} を開いてください。\n公開や本番配備は行いません。\n`);
 return {manifest,offline:join(offline,'index.html'),web};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))packageViewerPreview({dist:resolve('dist'),output:resolve('review-package'),head:process.env.REVIEW_HEAD,pr:process.env.REVIEW_PR,fixture:resolve('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json')});
