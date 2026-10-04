# Traceability drift research PoC

Research implementation for [Issue #76](https://github.com/mk3008/alder/issues/76). Read the [decision, contract, measurements and limitations](../../docs/traceability-drift/study.md) before reuse. Python 3.12+, standard library only. The synthetic participant-limit fixture does not change Alder's meeting-room business requirements.

From the repository root:

```sh
python3 -m unittest discover -s work/traceability-drift -p 'test_drift.py' -v
python3 work/traceability-drift/evaluate.py
```

The evaluator asserts 26 scenarios, executes actual product tests and CLI checks in temporary directories, and prints JSON observations. Exit 0 means every expected result (including deliberately exposed false negatives and one expected product-test failure) was reproduced. It does **not** mean every mutated scenario is correct. `--output /tmp/alder-drift-observations.json` saves a local rerun; the committed [observations](../../docs/traceability-drift/observations.json) record the current environment and measurements; the pre-review results remain in Git history.

For the read-only detector alone, supply a JSON list of test IDs obtained from **current runner discovery**, not a copied list from the mapping:

```sh
python3 work/traceability-drift/drift.py \
  work/traceability-drift/fixture/business-design.md \
  work/traceability-drift/fixture/checks.md \
  work/traceability-drift/fixture/trace.json \
  /tmp/current-test-inventory.json
```

`evaluate.py` contains the small unittest inventory adapter. The CLI returns 0 for no candidates, 1 for stale/missing/mapping candidates, and 2 for invalid input. Test pins hash only the Check body. A source change can flag a Test through its unreconciled Check, but reconfirming that source without changing the Check body leaves the matching Test pin current. The detector never changes pins or human review states. Missing tests are checked against the supplied inventory; no Code location mapping is read or maintained. This is a restricted fixture adapter, not a production Markdown parser or installable Alder runtime.
