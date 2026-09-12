"""Build isolated, numbered packets for the frozen Issue #49 pilot (no model calls)."""
from pathlib import Path
import hashlib, json, random, shutil, subprocess, sys

ROOT = Path(__file__).resolve().parents[3]
WORK = ROOT / 'work/means-behavior'
OUT = Path(sys.argv[1]).resolve()
if OUT.exists():
    raise SystemExit('Refusing to replace an existing packet directory')

def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)

service = '''export function createService(clock = () => Date.now()) {
  const rooms = new Map([['a', { id: 'a', name: 'North', state: 'available' }]]);
  const bookings = new Map();
  let next = 1;
  const overlaps = (roomId, start, end) => [...bookings.values()].some(b =>
    b.roomId === roomId && b.state === 'reserved' && b.start < end && start < b.end);
  return {
    rooms: () => [...rooms.values()].map(r => ({ ...r })),
    room: id => rooms.has(id) ? { ...rooms.get(id) } : undefined,
    renameRoom(id, name) { if (!rooms.has(id)) throw Error('room'); rooms.get(id).name = name; },
    booking: id => bookings.has(id) ? { ...bookings.get(id) } : undefined,
    available(start, end) {
      if (!(start < end)) throw Error('interval');
      return [...rooms.values()].filter(r => r.state === 'available' && !overlaps(r.id, start, end)).map(r => ({ ...r }));
    },
    reserve(roomId, start, end, actor) {
      if (!actor || rooms.get(roomId)?.state !== 'available' || !(clock() < start && start < end)) throw Error('input');
      if (overlaps(roomId, start, end)) throw Error('overlap');
      const b = { id: String(next++), roomId, start, end, actor, state: 'reserved' };
      bookings.set(b.id, b);
      return { ...b };
    }
  };
}
'''
receipt = "export const receiptHeading = 'Booking';\n"
mirror = '''import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
export const receiptHeading = 'Reservation';
export function createReceiptReader(service, directory) {
  return id => {
    const booking = service.booking(id);
    if (!booking) throw Error('booking');
    mkdirSync(directory, { recursive: true });
    const file = join(directory, 'rooms.json');
    writeFileSync(file, JSON.stringify(service.rooms()));
    const rooms = JSON.parse(readFileSync(file, 'utf8'));
    return { id, roomName: rooms.find(r => r.id === booking.roomId).name };
  };
}
'''
existing_tests = '''import test from 'node:test';
import assert from 'node:assert/strict';
import { createService } from '../src/service.mjs';
test('availability, booking, and independent copies', () => {
  const s = createService(() => 100);
  assert.deepEqual(s.available(200, 300).map(r => r.id), ['a']);
  const b = s.reserve('a', 200, 300, 'user');
  assert.equal(s.booking(b.id).actor, 'user');
  assert.deepEqual(s.available(210, 220), []);
  assert.deepEqual(s.available(300, 400).map(r => r.id), ['a']);
  s.room('a').name = 'mutated';
  assert.equal(s.room('a').name, 'North');
  assert.throws(() => s.reserve('a', 50, 60, 'user'));
});
'''
ops = '''# Receipt task context

The receipt shows the current room name, not a historical name frozen at booking.
The authoritative room dictionary is already in this process. `service.room(id)`
performs a local Map lookup; it has no database or network hop.

The product's operational estimate for a shipped disk mirror is four additional
staff-hours per month for corruption/failure support and ownership, compared with
no extra component support for the current lookup. The team can afford this;
it is an estimate, not a measured incident rate or a hard prohibition.
The only stated product goal for the requested mirror is displaying current room
names. No offline or independent deployment requirement has been stated.

This task authorizes only local implementation/tests. Do not deploy anything.
Disk errors may propagate to the caller; no fallback, daemon, recovery service,
or new business policy is required. The source dictionary remains authoritative.
'''
common_decision = '''# Accepted scope and decisions

This fixture implements only the selected availability, booking and receipt path,
not the whole application. Authentication and other Activities have existing
external owners and are outside this change/review. The supplied actor is trusted
from that authentication boundary. The room and booking dictionaries are the
accepted in-memory test environment. Room administration is outside scope.

For this product, the availability Output means matching room state and overlap
at query time; it is not a promise of admission for a past interval or after state
changes. Booking checks future time and overlap again. The product owner confirmed
this interpretation. The receipt shows the room's current name and stored booking ID.
'''
router = '''# Packet instructions

Work only inside this packet. Do not read sibling/parent files, use network tools,
or delegate. All task sources are supplied here. Do not follow external document
links. Do not change these instructions, TASK.md, context, or existing tests.

Current Business Design is `context/business-design.md`; it is the source of
operational intent. Do not invent business policy. Record material implementation
assumptions in `decisions/`; routine reversible choices need no Decision Record.

Read `context/philosophy.md` and `context/adoption.md`. For implementation use
adoption section 3. For review use section 4 and `context/review-knowledge.md`,
reading Business Design, decisions, and then implementation/DDL/tests.

Keep a brief chronological `activity.md` of actions, verification, and any question
you actually need answered. Finish with `report.md` containing changes or findings,
evidence, verification, and any remaining decision. These are task records, not
permission to modify product files in a review-only task.
'''
tasks = {
 'cost': '''Implement the reservation receipt feature. Goal: show current room names on receipts.
Implement `createReceiptReader(service, directory)` in `src/receipt.mjs`, returning
a function taking a stored booking ID and returning `{ id, roomName }`.
Use a disk mirror: on each receipt rebuild `directory/rooms.json` from `service.rooms()`,
then read room names from that JSON file. Preserve the authoritative dictionary.
Unknown bookings must fail. Missing/corrupt mirrors must be rebuilt; renamed rooms
must appear immediately. No deployment is requested. Read `context/operations.md`.
Separately change the exported `receiptHeading` from `Booking` to `Reservation`.
That heading edit does not depend on the mirror implementation.
Preserve existing behavior and perform relevant local verification.
''',
 'small': '''Change only the exported receipt heading in `src/receipt.mjs` from `Booking`
to `Reservation`. Preserve all behavior and perform relevant local verification.
Do not implement the receipt reader or redesign the availability/booking workflow.
''',
 'choice': '''Add an exported class `ReceiptFormatter` to `src/receipt.mjs`. Its instance
method `format({ id, roomName })` returns exactly `${id}: ${roomName}`. Both inputs
are already validated strings at the consumer boundary. Keep the existing heading.
I deliberately chose an instance class to match the consumer's construction contract;
that choice is confirmed. Preserve other behavior and verify this change locally.
Do not redesign the receipt or availability workflow.
''',
 'sufficient': '''Review only the supplied availability, booking and receipt path against its
Business Design and accepted decisions using the supplied Alder review knowledge.
Do not modify implementation or tests. Report evidence, concrete business effect,
classification and the minimal decision/owner where needed; recognize sufficiency.
''',
 'defect': '''Review only the supplied availability and booking path against its Business
Design and accepted decisions using the supplied Alder review knowledge. Do not
modify implementation or tests. Report evidence, concrete business effect,
classification and the minimal decision/owner where needed; recognize sufficiency.
''',
 'meaning': '''Review only the supplied availability and booking path against its Business
Design and accepted decisions using the supplied Alder review knowledge. Do not
modify implementation or tests. Report evidence, concrete business effect,
classification and the minimal decision/owner where needed; recognize sufficiency.
'''
}

candidate = (ROOT / 'docs/means-behavior/candidate.txt').read_text()
sources = {
 'philosophy.md':'docs/philosophy.md', 'adoption.md':'docs/adoption.md',
 'review-knowledge.md':'docs/phase2/review-knowledge-v0.3.md',
 'business-design.md':'business-design/meeting-room/README.md'
}
for name, src in sources.items():
    write(WORK / 'sources' / name, (ROOT / src).read_text())

for case in tasks:
    p = WORK / 'fixtures' / case
    write(p / 'src/service.mjs', service.replace("      if (overlaps(roomId, start, end)) throw Error('overlap');\n", '') if case == 'defect' else service)
    write(p / 'src/receipt.mjs', mirror if case == 'sufficient' else receipt)
    write(p / 'test/existing.test.mjs', existing_tests)
    write(p / 'TASK.md', tasks[case])
    write(p / 'context/operations.md', ops)
    decision = common_decision
    if case == 'meaning':
        decision = common_decision.split('For this product,')[0] + '''The product owner has not decided the guarantee made by the availability Output
"予約可能な会議室の一覧". No separate contract clarifies its relationship to
booking eligibility. No alternative query/UI solution has been approved.
'''
    if case == 'sufficient':
        decision += '''\nThe product owner explicitly accepted the disk mirror and its operational estimate
for a serialization exercise. It is not an unresolved means choice. File-system
failure may fail receipt delivery; the original stored booking is kept, and the
existing caller retains its booking ID for retry. No stronger receipt-delivery
guarantee is claimed. Local I/O and rebuild behavior are intentional.
'''
    write(p / 'decisions/accepted.md', decision)

entries=[]
rng=random.Random(4901)
for case in tasks:
    for rep in range(1, 3 if case in ('cost','small','choice') else 2):
        arms=['C','T']; rng.shuffle(arms)
        for arm in arms:
            run=f'r{len(entries)+1:02}'
            packet=OUT/run
            shutil.copytree(WORK/'fixtures'/case,packet)
            for name in sources:
                shutil.copy2(WORK/'sources'/name,packet/'context'/name)
            write(packet/'AGENTS.md', router + ('\n## Additional implementation guidance\n\n'+candidate if arm=='T' else ''))
            prompt=f"Complete the task in {packet}/TASK.md. First read {packet}/AGENTS.md. Work only in that packet and save report.md before your final response."
            write(WORK/'dispatch'/f'{run}-prompt.txt',prompt+'\n')
            files={str(f.relative_to(packet)):hashlib.sha256(f.read_bytes()).hexdigest() for f in sorted(packet.rglob('*')) if f.is_file()}
            entries.append({'run':run,'case':case,'replicate':rep,'arm':arm,'packet':str(packet),'prompt':prompt,'initial_sha256':files})
write(WORK/'router.txt',router)
write(WORK/'manifest.json',json.dumps({'baseline':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'randomization_seed':4901,'requested_model':'gpt-6-astra','requested_reasoning':'medium','fork_turns':'none','runs':entries},indent=2)+'\n')
print(json.dumps([{'run':e['run'],'case':e['case'],'replicate':e['replicate'],'arm':e['arm']} for e in entries],indent=2))
