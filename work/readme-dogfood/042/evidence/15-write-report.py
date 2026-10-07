from pathlib import Path
import json, hashlib
r=Path.cwd(); e=r.parent/'evidence'; inv=json.loads((e/'15-invariants.json').read_text()); s=r.parent/'codex-home/plugins/cache/alder-development/alder/0.4.2/skills/alder-follow-up-review'
h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
authority=json.loads((s/'references/provenance.json').read_text())
for name in ['adoption.md','check-item-traceability.md']:
 assert h(s/'references'/name)==authority['sources']['docs/'+name]
refs={str(p.relative_to(r.parent)):h(p) for p in [e/'available-skills.txt',e/'13-implementation-review.md',e/'14-regression-strengthening.md',s/'SKILL.md',s/'references/adoption.md',s/'references/check-item-traceability.md',s/'references/provenance.json']}
inv['source_and_prior_evidence_hashes']=refs
inv['checks']['bundled_authority_hashes_match_provenance']=True
inv['checks']['check_snapshot_matches_current_file']=h(r/'docs/checks/tool-return.md')==h(e/'15-checks.after.md')==inv['after_sha256']
assert all(inv['checks'].values())
(e/'15-invariants.json').write_text(json.dumps(inv,ensure_ascii=False,indent=2)+'\n')
report='''# Bounded Check-to-Test follow-up

## Result

Updated only `workspace/docs/checks/tool-return.md`. TR-01–TR-09 now have actual representative Test IDs, inspected assertion meaning, evidence qualifications, and forward/reverse navigation. The stale current “uncreated/unrun” statement is replaced with revision-pinned observations. Final execution: **21 tests, 0 failures, 0 errors, exit 0**. Separate unittest discovery returned **21 unique Test IDs**.

All nine IDs, titles, conditions, expected results, Business Design sources, derivation classifications, representative cases, connections, and `確認済み（模擬）` rows are unchanged. The unresolved BD-Q01–04, physical-handoff deferral, and boundary sections are byte-identical. No implementation acceptance, real user business approval, or new decision is asserted.

## Route and scope

Exact README prompt: 「Alderで実装をレビューして、チェックとテストの対応も更新して。」

The independent read-only stage was already complete in `13-implementation-review.md`; this stage is solely the authorized bounded record update. I inspected all ten descriptors in `available-skills.txt`. The combined prompt belongs initially to `alder-review-implementation`; because that stage had finished and this assignment is evidence-only follow-up, I selected `alder-follow-up-review`. The other routes concern Business Design authoring/review, Check drafting, optional functional or structural exploration, optimization, graph export, or explicitly chosen drift pilots. None authorizes treating this mapping update as a new business decision or implementation rewrite.

I loaded the **local pinned source catalog's** `alder-follow-up-review/SKILL.md`, its complete `references/check-item-traceability.md`, `adoption.md` Check Item section and section 4, plus provenance. No installed account skill package was used as a substitute. The catalog was manually supplied for this diagnostic; this is **not evidence of natural routing in an unassisted real client**. No optional drift pilot was requested, so no detector, baseline, adapter, or drift-pin scheme was created.

Alder plugin **0.4.2**, source commit **6d30b93abf8ecdc8902fef5c16bfb53fda8617e9**. Follow-up authority revision **f904fe1e584ed6693983d58749b1f9dec83b3c8c**. Requested settings for this worker: **inherited, no explicit model/effort override**. Effective runtime model and reasoning effort are **unverified**. The prior review's requested Fresh settings are historical metadata for that review, not settings attributed to this follow-up.

## Evidence inspected and reconciliation

I read the independent review, current complete Business Design, Checks, simulated decisions, system requirements, implementation notes, implementation, runner, all current test assertions, and final `14-regression-strengthening.md` before finalizing mappings. Workspace revisions are identified by complete SHA-256 manifests rather than a product commit because the synthetic workspace has no Git repository.

- TR-01: matching receipt status/property plus selected-loan isolation.
- TR-02: first selected-loan timestamp and unchanged other loan; UTC normalization is explicitly technical supporting evidence, not new business meaning.
- TR-03: inspection pending after receipt; no notification or physical transfer claim.
- TR-04: original postcondition test plus the new artificial nondefault sentinel. The sentinel is not asserted to be a valid real-world loan state. The separately recorded targeted mutation passed the old 20-test suite but failed only the new assertion in the 21-test suite. This corrects the observed regression blind spot without claiming an implementation defect was fixed.
- TR-05–08: number mismatch, pure shortage, both, and all accessories absent. Receipt/timestamp/inspection/result assertions are mapped separately to the corresponding guarantees. The counter evidence is a returned result, not message delivery.
- TR-05–07 and TR-09 also use the mismatching-replay assertions only for the corresponding continued receipt/time/state guarantees. Existing receipt/time are preserved rather than erased.
- TR-07 precision: fresh failures begin false and would catch incorrectly setting true; successful-then-mismatching replay begins true and would catch clearing it. These existing tests cover both Boolean values in their respective fixture contexts. The initial review's optional suggestion is not promoted to a definite missing-regression finding; no additional TR-07 test was added or required.
- TR-09: both earlier/later matching replay and mismatching replay preserve the first timestamp; general side-effect idempotence is not claimed.

The Check details state actual conditions and assertions rather than relying on test names or pass results. The reverse table includes all 21 discovered IDs: 13 have bounded Check/support mappings and 8 are classified as technical input/domain boundaries without new approved business outcomes. No permanent Check-to-Code symbol, SQL, or line map was introduced. Implementation and runner hashes identify executed snapshots only.

## Distinct historical scopes

1. `13-implementation-review.md` remains the original independent review of the **20-test** snapshot (test SHA-256 `4dfd53ba191ef48b6af4d7c891171905b104239fe5385208ad2845bc2a963d1d`). It was not rewritten to imply it reviewed the new sentinel.
2. `14-regression-strengthening.md` documents the separately authorized one-test addition and mutation comparison.
3. This follow-up inspects current assertions and executes the **21-test** snapshot (test SHA-256 `0ff16b58155d6d0c6f30a9261bdd5c35519b800880612db41764a40a773ce5c7`) before attaching final evidence to unchanged Check meaning.

The older “Test uncreated/unrun” sentence in the immutable simulated decision input remains historical evidence of the design-time stage. The implementation-notes conclusion likewise describes the pre-review implementation stage; it is not treated as a current denial that stages 13–15 occurred. Neither file was in this edit scope, so neither was rewritten.

## Execution and artifacts

Working directory: `<dogfood><workspace-root>`.

- Executed `PYTHONDONTWRITEBYTECODE=1 python run_tests.py`: 21 pass, exit 0. Exact stdout, empty stderr, and exit value are in `15-final-tests.stdout.txt`, `15-final-tests.stderr.txt`, and `15-final-tests.exit.txt`.
- Independently called `unittest.defaultTestLoader.discover('tests')`, flattened the suite, and recorded all `TestCase.id()` values. Exact Python executable, full `-c` command, environment addition, cwd, and result paths for both calls are recorded in `15-commands.json`. Output is in `15-discovery.stdout.txt`; stderr is empty and exit is 0. `15-test-ids.json` is the machine-readable ID list.
- `15-checks.before.md` and `15-checks.after.md` preserve complete Check snapshots; `15-checks.diff` is the exact diff.
- `15-before-hashes.json` and `15-after-hashes.json` cover all eight product files.
- `15-invariants.json` preserves semantic fields, exact forward/reverse mappings, discovered IDs, commands, metadata, and verification results. All invariant checks are true.
- `15-verify-and-update.py` records the exact bounded transformation and tests; `15-write-report.py` writes this evidence report. These scripts live outside the product workspace.

## Workspace hashes

| File | Before | After |
| --- | --- | --- |
'''
for f,b in inv['before'].items(): report+=f'| `{f}` | `{b}` | `{inv["after"][f]}` |\n'
report+='\n## Pinned source and prior evidence\n\n| Input | SHA-256 |\n| --- | --- |\n'
for p,v in refs.items():report+=f'| `{p}` | `{v}` |\n'
report+='''
## Remaining limits and stopping condition

BD-Q01–04 and physical handoff remain unresolved/excluded exactly as before. Real roles, permissions, notification/storage responsibility, investigation/re-reception, accessory equivalence/quantity/extras/substitution, UI, durable persistence, concurrency, interruption recovery, and production operation have no new approval or validation from this local fixture. Passing execution is not exhaustive correctness evidence or product acceptance.

No new human decision is required for this narrowly scoped evidence update. Any future business-meaning change must return to Business Design and responsible-human confirmation before downstream expectation changes. Stop condition is met: actual assertions reconciled, final 21 IDs discovered, suite passed, bounded records updated, forward/reverse mapping verified, original review scope preserved, and before/after meaning invariants saved.
'''
(e/'15-follow-up-review.md').write_text(report)
artifacts={p.name:h(p) for p in sorted(e.glob('15-*')) if p.is_file() and p.name!='15-evidence-hashes.json'}
(e/'15-evidence-hashes.json').write_text(json.dumps(artifacts,indent=2)+'\n')
print('Report ready:',e/'15-follow-up-review.md')
print('Current Check SHA-256:',inv['after_sha256'])
print('Invariant checks:',len(inv['checks']),'all true')
print('Mapped IDs:',sum(bool(v) for v in inv['reverse'].values()))
