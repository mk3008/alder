import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
const { createService } = await import(pathToFileURL(join(resolve(process.argv[2]), 'src/service.mjs')));
const s = createService(() => 100);
const trace = { pastAvailability: s.available(10, 20) };
try { s.reserve('a', 10, 20, 'user'); trace.pastBooking = 'accepted'; }
catch(e) { trace.pastBooking = e.message; }
trace.first = s.reserve('a', 200, 300, 'user');
try { trace.second = s.reserve('a', 250, 350, 'other'); }
catch(e) { trace.second = e.message; }
console.log(JSON.stringify(trace, null, 2));
