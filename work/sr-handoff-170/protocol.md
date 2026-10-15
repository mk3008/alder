# SR handoff regression protocol

## Purpose and current status

These small, synthetic handoffs exercise the adopted separation of business
meaning, applicable technical constraints, source availability and review evidence.
They are test inputs for Alder guidance, not product templates, new required
ledgers, a runtime feature, or a new approval gate. No customer data, real accounts,
private URLs or external services are present. The named source locations and
source revisions inside cases are fictional labels for the supplied text.

Fixture preparation began against Alder commit
`318058920c07249468d7e9d4be88c87f51602e4f`, package version 0.4.4.
The guidance under test must be pinned separately when a review is actually run;
do not use that preparation revision to describe later uncommitted guidance.
No Fresh review has been executed by preparing these files. `inputs/execution.txt`
is an actual local Python test run only. Prior independent-review events mentioned
inside C04 are synthetic scenario facts, not a claim that such a review occurred.

## Files and case inventory

- `inputs/design-and-checks.md`: shared BD-1 and human-confirmed CK-1.
- `inputs/cases.md`: nine mutually exclusive caller handoffs and their SR source text.
- `inputs/order_register.py`: tiny Python/SQLite implementation with inline DDL.
- `inputs/test_order_register.py`: three actual unittest tests.
- `inputs/execution.txt`: runner output, environment, source hashes and limits.
- `expected-outcomes.md`: evaluator-only outcomes; never part of reviewer context.

| Case | Regression distinction |
| --- | --- |
| C01 | SR not provided |
| C02 | Known SR source/revision but unreadable body |
| C03 | Explicit SR non-applicability limited to receipt scope |
| C04 | SR revision changed after review; hold affected storage, continue unchanged receipt evidence |
| C05 | Ambiguous BD–SR relationship; clarify the identifier |
| C06 | Explicit BD–SR conflict with unaffected work |
| C07 | Business guarantee versus permitted technical means |
| C08 | Static support, no execution, and no operational restore evidence |
| C09 | Provided SR contradicts the proposed production backend |

## Blinding and preparation

The orchestrator, not the Fresh reviewer, reads this protocol. Use a new isolated
review input directory per case. Copy shared implementation, tests and design into
it. Extract only the chosen `## Cxx` section from `inputs/cases.md` into `case.md`;
retain the opening explanation that these are synthetic, independent inputs.
Copy `execution.txt` for C01–C07 and C09 only. For C03, supply only its receipt test
entry plus the command, source hashes and stated environment/scope, or explicitly
retain the case restriction on which runner result is admissible. C08 receives
no execution file. The reviewer must not inspect another case, this protocol,
expected outcomes, prior reviewer outputs, implementer conversation or proposed
fixes. Documented project decisions supplied inside a case remain valid inputs.

Pin the actual guidance under test, the exact copied inputs and project AGENTS.md
to a retrievable commit, or record the working-tree paths and SHA-256 digests for
an explicitly local trial. Supply the full installed review skill, read-only
stage and bundled review knowledge; for C04 also supply the current follow-up
skill and its required bundled authorities. Include installed version/provenance.
Follow repository Fresh settings: request model `gpt-6-sol`, reasoning `medium`,
`fork_turns: none`. Record the requested settings and agent ID with each result;
do not claim independent attestation of effective runtime settings when unavailable.

The exact reviewer prompt below is a template: expand every placeholder and save
the full expanded prompt with the result. Case-specific answers must not be added.
A safe one-case extraction, performed by the orchestrator, is equivalent to:

```python
import re
from pathlib import Path
source = Path("inputs/cases.md").read_text()
case_id = "C01"  # selected case, changed by the orchestrator
intro = source.split("## C01", 1)[0]
case = re.search(rf"^## {case_id}\n.*?(?=^## C\d\d\n|\Z)",
                 source, re.M | re.S).group(0)
Path("case.md").write_text(intro + case)
```

## Exact reviewer prompt proposal

```text
Conduct the selected synthetic Alder implementation-review regression, read-only.
Case: {CASE_ID}. Input snapshot: {INPUT_REVISION_AND_DIGEST_MANIFEST}.
Alder guidance snapshot: {GUIDANCE_REVISION_AND_READABLE_PATHS}.
Installed version and provenance: {VERSION_AND_PROVENANCE_PATHS}.
Project instructions: {PINNED_AGENTS_PATH}.
Readable case directory: {ISOLATED_CASE_DIRECTORY}.

Read case.md, then apply the installed review skill and its complete bundled
knowledge to the requested scope. Read design-and-checks.md before implementation,
DDL and tests. Use the supplied source revisions and selected System Requirements
material. Treat unavailable sources and evidence exactly as described by the case;
do not search outside the permitted inputs to fill them. Do not infer any
requirement from another case. Inspect only the handed-over execution evidence
when case.md makes it available. Do not rerun tests in this exercise.

For C04, apply the supplied follow-up guidance to identify which pending record
updates are supported and which require more work; perform no writes. Its prior
review pins are scenario facts, not permission to import prior review conclusions.

Return concise findings with source evidence and current/downstream effects,
separating business meaning, technical conditions, static assertions and observed
execution. State what could not be checked and the smallest necessary decision,
clarification or next step, if any. Continue genuinely unaffected scoped work.
Do not edit inputs, approve business meaning, or claim implementation acceptance.
Do not read expected-outcomes.md, protocol.md, other cases, previous reviewer
outputs, proposed fixes or the implementer conversation. Report the files and
source revisions actually read, requested model/effort/fork settings as provided
by the orchestrator, and any unavailable settings attestation.
```

## Evaluation and evidence publication

Keep each raw result separate from evaluator observations. Only after the result
is fixed may the evaluator read `expected-outcomes.md` and compare observations.
If a reviewer reads prohibited inputs, mark that run contaminated and exclude it
from independent-review or reproducibility claims; preserve a correction note.

Before citing a run as publicly reproducible adoption evidence, publish only safe
guidance/fixtures at an immutable commit and verify retrieval by a third party.
A local-only SHA does not qualify. Record full expanded prompts, permitted inputs,
prohibited inputs, paths/revisions actually read, requested settings, agent IDs,
results, evaluator observations and limitations. Check outputs for safe release
before any publication; raw agent output is optional. This preparation does not
publish files, create Issues, establish public retrieval or run a comparison.
Follow `docs/research-publication.md` for the evidence category actually supported.

## Local fixture check

From `work/sr-handoff-170/inputs`:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest -v test_order_register
```

This is standard-library-only, uses an in-memory SQLite database, and makes no
network calls. The recorded run passes three tests. It demonstrates only the
provided local business behaviors; no WAL, PostgreSQL, load, deployment, backup
or restore condition was executed. Re-run after changing either Python file and
refresh the runner source hashes. Do not give the resulting log to C08, whose
purpose is to review a handoff without execution evidence.
