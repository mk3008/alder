// Node-only execution of the exact bundled worker logic. This is not a browser measurement.
import {parentPort} from 'node:worker_threads';
globalThis.self={postMessage:message=>parentPort.postMessage(message)};
await import('./.generated/worker.bundle.mjs');
parentPort.on('message',data=>self.onmessage({data}));
parentPort.postMessage({ready:true});
