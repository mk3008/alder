# U1 stage report

Implemented optional submission notes while preserving the existing vertical-slice organization and purchase workflow.

## Files read

Read the current REQUEST.md and acceptance.test.mjs, plus entry.mjs, validation.mjs, all six slices/*.mjs modules and additional.test.mjs. check.py was executed as supplied. No files outside the assigned workspace were inspected. REQUEST.md, acceptance.test.mjs and check.py remain unchanged.

## Design decisions and changes

- slices/submit.mjs owns optional-note validation alongside submission validation. An absent property becomes an empty string; a supplied property must contain a primitive string, including when its value is undefined. JavaScript string.length enforces the exact 280 UTF-16-code-unit boundary. Whitespace is preserved. Validation occurs before the existing single write, so invalid notes cannot create records or alter existing state.
- validation.mjs target lookup now returns a copied record with an empty-note default for records lacking the field. Detail and transition slices already use this lookup, so old records gain the required read and command-result semantics without mutating on queries. Transitions save the normalized record. No persistence or new public migration interface was added to this ephemeral application.
- slices/list.mjs strips note using object rest when creating each independent output record. It retains all other fields and the existing JavaScript string ordering.
- Existing command copies preserve note through approval, rejection and purchase without further changes. All stored fields remain primitives, so copies preserve isolation.
- Added note.test.mjs for explicit non-string note rejection and atomicity, note copy isolation, list omission across events, and direct slice-level reads/transitions of pre-change records. Existing additional tests were preserved unchanged.

## Verification and failures

Ran `python3 check.py` once for U1. The supplied script checked all eleven .mjs files with `node --check`, then ran `node --test --test-reporter=tap acceptance.test.mjs additional.test.mjs note.test.mjs`. All syntax checks and all 19 tests passed. The script reported .audit/check-001.json as this stage's saved evidence; no audit files were manually modified.

No failed attempts, correction rounds, or observed untested intermediate failures occurred. No evaluator tests were changed or weakened.

## Scope and exposure

All work remained in /workspace/scratch/532ba6a0b129/pilot-c. No accidental outside-context exposure occurred during this stage. No skills, external sources, sub-agents, commits, pushes or publication were used. No unclear requirements remain for U1.
