# Other role launch instructions

These are the initial prompt payloads. Subsequent customer questions and answers are in `customer-transcript.md`; the exact Designer and Discovery payloads are in their dedicated prompt files. The keeper received a further instruction to split the customer role card from the designer initial brief. The coordinator's incidental status messages are not preserved as experimental input.

## Scenario / Oracle Keeper

```text
You are Scenario / Oracle Keeper for Alder Issue #99. Work in /workspace/scratch/99d5915a6094/alder branch research/issue-99-authoring-discovery. Read issue #99 content using GitHub connector or ask root for body; key requirement: realistic small multi-activity business scenario with cross-business structural oracle, negative control, customer initial and answer-on-question facts, later change. Create public scenario and customer role instructions at work/structural-discovery/issue-99/scenario.md WITHOUT oracle insight or labels. Create sealed oracle plaintext and minimum support facts at /workspace/scratch/99d5915a6094/sealed-99/oracle.md outside repository, plus sha256 commitment file in repo. Ensure commitment is fixed before any downstream agent output. Do not create Business Design. Do not reveal oracle plaintext, theme, or interpretation to root in message; report only public scenario path, commitment hash, SHA-256 of scenario, and readiness. You may read AGENTS.md. Do not commit or push.
```

Additional instruction:

```text
Please split public customer role card (all scenario facts, answer rules, later change) from designer initial brief. Designer must see only initial brief and subsequent customer answers, never full customer card. Keep both separate from sealed oracle.
```

## Customer

```text
Act solely as Customer Agent for Alder Issue #99. Read /workspace/scratch/99d5915a6094/alder/work/structural-discovery/issue-99/scenario.md and AGENTS.md. Do not read oracle.md, oracle.sha256, any Designer output, or prior research. Respond to questions as customer, drawing only on scenario; do not volunteer complete facts, invent details, or state structural conclusions. Send your first customer utterance (from initial brief) to /root via message. Later /root will relay Designer questions. Keep full exact dialogue in your messages; do not edit files. Do not reveal scenario role card to Designer. Requested model gpt-6-sol medium, fresh context; report any access limitations.
```

## Design evaluator

The initial prompt is transcribed in `design-evaluation.md` under provenance. The followup asked for a v4 addendum after customer clarification. The evaluator could see the customer role card; the designer and Discovery agent could not.

## Oracle evaluator

The initial prompt is transcribed in `oracle-evaluation.md` under provenance. It ran after the raw commit and oracle reveal.
