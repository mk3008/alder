import {defineConfig} from 'vite';
import config from './vite.config';
// Build the experimental HTML separately: the ordinary index keeps its single
// module entrypoint and existing standalone/offline packaging contract.
export default defineConfig({...config,build:{emptyOutDir:false,rollupOptions:{input:{d2:'d2.html'}}}});
