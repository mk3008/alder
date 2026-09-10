# Phase 4 run matrix

Status: exploratory. This matrix is not a comparison score and does not select a candidate.

All four arms used the same frozen fixture, stage requirements, frozen behavioral tests, requested model (`gpt-5.6-terra`), and requested effort (`medium`). The only intended arm difference was the candidate text listed in `freeze-record.md`.

| arm | candidate | A | B | C | D | E | F |
| --- | --- | --- | --- | --- | --- | --- | --- |
| none | none | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass |
| p3-baseline | Phase 3 frozen text | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass |
| nearest-common | smallest-access / nearest-common | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass |
| semantic-first | nearest-common plus semantic-before-technical | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass | impl pass; ref pass |

`pass` means `npm test` executed in that run directory and reported one passing frozen stage test. Each implementation and each refactoring used a separately spawned fresh Terra/medium task. Requested metadata is recorded above; actual model/version/session identifiers were not exposed by the execution interface and are therefore **unverified**.

## Recorded protocol deviation

At Stage D, the frozen `d.test.js` was initially copied to the run root. Its existing relative import (`../app.js`) then resolved outside the run directory, so the first `npm test` invocation in each implementation arm failed before behavioral execution. The frozen test text was not changed. It was moved to the pre-existing `test/app.test.js` location used by prior stages, then all four Stage D implementation directories were rerun and passed. The initial failure and rerun are retained as a fixture-placement deviation, not attributed to an arm.

## Raw-output retention

The repository retains the full source snapshots and frozen tests. The orchestration interface returned agent completion summaries but did not expose durable per-run session identifiers or transcript files; those fields are recorded as `unverified` rather than reconstructed. The exact summarized completion observations are preserved in the stage records below.
