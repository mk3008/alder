# Proposed implementation scope
Review all six independent candidates in implementation.py. These replace the existing behavior listed below.
1. case01: add acceptance telemetry; the collector persists records unchanged. Previously no acceptance event was emitted.
2. case02: replace route's identity/tenant binding; platform identity resolver remains installed. Previously the route compared case.tenant_id with the resolver's tenant_id.
3. case03: simplify acceptance response serialization. Previously response included both id and case_id with equal values, plus status=accepted. No versioned endpoint routing is changed.
4. case04: rename cases.legacy_title to subject using supplied SQLite up/down migration. Previous schema has id primary key and legacy_title text. Existing reader v1 selects id, legacy_title; reader v2 selects id, subject. Both are deployed by the platform.
5. case05: change deployment/restore plan to the supplied configuration. Previous plan used blue/green deployment and five-minute incremental restore points; no business-side fallback change is proposed.
6. case06: move existing whitespace trimming into case06_subject. It previously used value.strip() inline; no persistence, API, identity or deployment behavior changes.
The executable tests are narrow existing business tests, not a full technical assurance suite. No production execution or measurements beyond the fixture configuration are available.
