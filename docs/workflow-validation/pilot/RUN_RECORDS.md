# Pilot run records

| run | requested condition | result | metadata |
| --- | --- | --- | --- |
| acceptance design | fresh Terra / medium | adopted frozen Stage 1–4 acceptance design | actual model/session unverified |
| Stage 1 acceptance instrument design | fresh Terra / medium | adopted frozen contract | actual model/session unverified |
| Stage 1 implementation | fresh Terra / medium | runtime script produced `STAGE1_ACCEPTANCE_PASS` in disposable schema; adoption pending evidence repair/review findings | actual model/session unverified |
| Stage 1 consistency review | fresh Sol / medium, read-only | HUMAN_BLOCKER HB-WV-S1-01; acceptance evidence defect recorded | actual model/session unverified |
| Stage 1 v3 resolution/review/refactoring | fresh Terra / medium; fresh Sol / medium read-only | adopted — v3 cumulative acceptance pass; no blocker; no structural move | actual model/session unverified |
| Stage 2 implementation | fresh Terra / medium | **unadopted** — cumulative PASS produced but later review found policy/evidence defects | actual model/session unverified |
| Stage 2 consistency review | fresh Sol / medium, read-only | HUMAN_BLOCKER HB-WV-S2-01 — completion-time authority and early-completion policy missing | actual model/session unverified |
| Stage 2 policy resolution | external Human Decision | HD-WV-002 selected a trusted DB clock, allowed early completion, and required `completed_at >= reported_at`; the prior blocker remains historical | external policy selection; not candidate-procedure derivation |
| Stage 2 v2/v3 fixture runs | fresh Terra / medium | **unadopted** — each exposed an acceptance-fixture time contradiction against HD-WV-002; raw outputs and schema cleanup are preserved | actual model/session unverified |
| Stage 2 v4 review | fresh Sol / medium, read-only | no HUMAN_BLOCKER; found missing executable S2-10 `db_after < scheduled_for` gate and label drift | actual model/session unverified |
| Stage 2 v5 verification | fresh Terra / medium | **unadopted / inconclusive** — mechanical gate repair recorded but local PostgreSQL authentication failed before schema creation | actual model/session unverified |
| Stage 2 v6 verification and review | fresh Terra / medium; fresh Sol / medium read-only | accepted candidate — Stage 1 v3 + Stage 2 v4 cumulative pass, repaired S2-10 gate executed, cleanup 0, no blocker | actual model/session unverified |
| Stage 2 post-acceptance refactoring | fresh Terra / medium | adopted — source files unchanged after ownership/consumer reassessment; cumulative v4 pass and cleanup 0 | actual model/session unverified |
| Stage 3 acceptance design and implementation | fresh Terra / medium | **unadopted** — frozen cumulative contract and implementation snapshot recorded; raw run emitted Stage 1–3 pass markers with cleanup 0 | actual model/session unverified |
| Stage 3 cross-activity consistency review | fresh Sol / medium, read-only | HUMAN_BLOCKER HB-WV-S3-01 — existing open-request outcome at safety closure was not determined; two acceptance-instrument defects also recorded | actual model/session unverified |
| 2026-09-10 prospective resume and instrument preparation | Astra requested as primary phase owner; no delegated worker | State reconstructed; HB-WV-S3-01 remains open; two repair fragments prepared without freezing policy; static checks only, no new SQL run or adoption | serving-model version/effort/session unverified; see ASTRA_RESUME.md |
