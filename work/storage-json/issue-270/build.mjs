import fs from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {fileURLToPath} from 'node:url';
import {schema} from './schema.mjs';
const dir=fileURLToPath(new URL('./',import.meta.url)),root=fileURLToPath(new URL('../../../',import.meta.url));
const unexport=s=>s.replace(/^export /gm,'');
const baseline=(()=>{
 const source=['graph.ts','source.ts','check-items.ts'].map(f=>unexport(stripTypeScriptTypes(fs.readFileSync(root+'web-viewer/src/'+f,'utf8')).replace(/[ \t]+$/gm,''))).join('\n');
 return `const baseline=(()=>{${source}\nreturn {parseDesign,validateGraph,parseChecks,fetchMarkdown};})();`;
})();
const core=unexport(fs.readFileSync(dir+'core.mjs','utf8').replace(/^import .*;\n/,''));
const common='const schema='+JSON.stringify(schema)+';\n'+core+'\n'+baseline;
const worker=common+'\n'+fs.readFileSync(dir+'worker.mjs','utf8');
const app=common+'\nconst WORKER_SOURCE='+JSON.stringify(worker)+';\n'+fs.readFileSync(dir+'app.mjs','utf8');
const sample=fs.readFileSync(dir+'fixtures/purchase.json','utf8').replace(/</g,'\\u003c');
const html=`<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Alder 保存形式 Phase 2 PoC</title>
<style>body{font:15px system-ui,sans-serif;margin:24px;max-width:1200px;color:#142d30;background:#f7faf9}h1{font-size:25px}button,input,textarea{font:inherit;padding:8px;margin:4px}button{cursor:pointer}section{background:white;padding:16px;border:1px solid #cbd8d3;border-radius:10px;margin:14px 0}label{display:block}pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:440px;overflow:auto}#entities{max-height:180px;overflow:auto;display:flex;flex-wrap:wrap}#entities button{font-size:13px}textarea{width:95%;height:90px}#url{width:75%}#status{font-weight:700}svg{width:100%;max-height:120px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:700px){.grid{display:block}}</style>
<h1>型付き単一JSONの読込・保存</h1><p>独立PoC。ローカルファイルはブラウザー内で処理します。正式な保存形式・製品Viewerではありません。</p>
<section><label>JSONローカルファイル <input id="file" type="file" accept=".json,application/json"></label><button id="sample">小規模サンプルを読む</button><button id="cancel">中止</button><label><input id="legacy-limit" type="checkbox">URL・テキストで現行の2MiB条件を再現</label><label>JSON URL <input id="url" type="url" placeholder="https://raw.githubusercontent.com/..."></label><button id="url-load">URLを読む</button><label>JSONテキスト<textarea id="input"></textarea></label><button id="load-text">テキストを読む</button><p id="status" role="status">未読込</p></section>
<section><button id="save-db">ブラウザー内へ保存</button><button id="restore">保存から復元</button><button id="download">JSONを書き出す</button><button id="failure-tests">失敗時の表示保持を検査</button><label>文書<select id="document-select"></select></label><label>表示対象<select id="view-select"><option value="activities">Activity / Check</option><option value="objects">Object</option><option value="findings">Findings</option><option value="guarantees">共通保証</option><option value="examples">比較例</option></select></label><h2 id="title">文書</h2><p id="summary"></p><svg id="graph" aria-label="先頭要素の読取見本"></svg><div id="entities"></div><div class="grid"><pre id="detail"></pre><pre id="diagnostics"></pre></div></section>
<section><h2>既存parserとの互換確認</h2><label>旧BD Markdown <input id="legacy-file" type="file" accept=".md"></label><p id="legacy-result"></p><label>旧Check Markdown <input id="checks-file" type="file" accept=".md"></label></section>
<section><h2>測定・通信記録</h2><button id="export-log">検証記録を保存</button><pre id="metrics"></pre></section>
<script id="sample-data" type="application/json">${sample}</script><script>${app.replace(/<\/script/gi,'<\\/script')}</script></html>`;
fs.writeFileSync(dir+'index.html',html);
fs.mkdirSync(dir+'.generated',{recursive:true});
fs.writeFileSync(dir+'.generated/worker.bundle.mjs',worker);
fs.writeFileSync(dir+'schema.json',JSON.stringify(schema,null,2)+'\n');
console.log(JSON.stringify({htmlBytes:Buffer.byteLength(html),workerBytes:Buffer.byteLength(worker)}));
