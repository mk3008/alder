import { defineConfig } from 'vite';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const purchaseFixture=fileURLToPath(new URL('../work/concept-review/issue-133/versions/purchase-v2-beta.json',import.meta.url));
let building=false;
export default defineConfig({
 base:'./',
 plugins:[{
  name:'purchase-review-source',
  configResolved(config){building=config.command==='build';},
  configureServer(server){server.middlewares.use((request,response,next)=>{
   if(request.url?.split('?')[0]!=='/purchase-v2-beta.json')return next();
   response.setHeader('Content-Type','application/json; charset=utf-8');response.end(readFileSync(purchaseFixture));
  });},
  buildStart(){if(building)this.emitFile({type:'asset',fileName:'purchase-v2-beta.json',source:readFileSync(purchaseFixture)});}
 }],
 build:{rollupOptions:{input:{main:'index.html',concept:'concept.html'}}}
});
