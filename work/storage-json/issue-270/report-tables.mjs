import fs from 'node:fs';
const dir=new URL('./',import.meta.url),read=p=>JSON.parse(fs.readFileSync(new URL(p,dir),'utf8'));
const perf=read('results/node-performance.json'),edits=read('results/edits.json');
let report=fs.readFileSync(new URL('REPORT.ja.md',dir),'utf8');
const node=['| Activity数 | UTF-8 bytes | ディスク読込 ms | JSON解析 ms | 型・参照 ms | 索引 ms | Graph投影 ms | JSON化 ms | ディスク保存 ms |','| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',...perf.rows.map(r=>`| ${r.activities} | ${r.bytes.toLocaleString('en-US')} | ${['readDisk','syntax','structuralAndReference','index','graphProjection','serialization','writeDisk'].map(k=>r[k].medianMs.toFixed(3)).join(' | ')} |`)].join('\n');
const edit=['| 課題 | 方式 | 追加/削除行 | 変更行bytes | 構文・参照・目的 | 指示外変更 |','| --- | --- | ---: | ---: | --- | ---: |',...edits.rows.map(r=>`| ${r.task} | ${r.format} | +${r.addedLines}/-${r.removedLines} | ${r.changedLineBytes} | 合致（再試行） | ${r.unintendedChanges} |`)].join('\n');
for(const [key,value]of [['NODE_TABLE',node],['EDIT_TABLE',edit]]){
 const re=new RegExp('<!-- '+key+'(?:_START -->[\\s\\S]*?<!-- '+key+'_END)? -->');
 if(!re.test(report))throw Error('missing marker');report=report.replace(re,'<!-- '+key+'_START -->\n\n'+value+'\n\n<!-- '+key+'_END -->');
}
fs.writeFileSync(new URL('REPORT.ja.md',dir),report);
