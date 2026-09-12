# Finding discovery provenance (observer-only)

Historical records are preserved. This retrospective classification does not change their outcomes.

| finding | stage | classification | provenance | basis |
| --- | --- | --- | --- | --- |
| transaction-start expiry comparison | 1 | implementation defect | uncertain | review found implementation timing behavior; packet did not explicitly request transaction-start semantics |
| numeric NaN acceptance | 1 | implementation defect | uncertain | numeric validity was required, but provenance cannot be established from the preserved prompt alone |
| conversion eligibility, post-conversion association, revision, order cardinality, snapshot projection | 2 | HUMAN_BLOCKER — under-specification | latent_cross_activity | required by interactions between quotation revision and order creation, rather than a single implementation detail |
| torn quotation read | 2 | implementation defect | uncertain | implementation coherence issue |
| revised quotation header omission | 2 | implementation defect | uncertain | HD-007 supplied header mutability but implementation omitted it |
| performer authority and creator/manager separation | 3 | HUMAN_BLOCKER — under-specification / data-model insufficiency | latent_cross_activity | approval and confirmation activities require individual identity relation not represented by then-current order data |

Stage 4's published approval-validity-after-revision ambiguity, if it becomes a blocker, is `explicitly_cued`; it must not be counted as discovery of a hidden inconsistency.

## Observer-only correction — HB-S5-01

HB-S5-01 contained mixed observations. This correction is not worker input.

| sub-finding | packet evidence | provenance | explanation |
| --- | --- | --- | --- |
| async reservation and commercial/reservation separation | stated | explicitly_cued | packet directly supplies both facts |
| result authority | omitted | uncertain | not inferable from a single stated activity or DDL name |
| failed-result commercial consequence | omitted | latent_cross_activity | only becomes required when confirmation and asynchronous failure are related |
| allowed result transitions | omitted | uncertain | state names do not define a transition system |
| later-Activity interaction | omitted | uncertain | no then-visible later activity supplied its own semantics |

## Observer-only correction — HB-S3-02

HB-S3-02 was not homogeneous. The implementation's `pending_approval` outcome against then-active sourced-Order `draft` wording is an implementation/requirement mismatch. Retaining `draft` exposes a separate Business Process under-specification: no activity/transition moved a high-value draft into approval waiting. The sourced `draft` wording was explicit in then-active HD-009; the missing transition was obtained by relating source conversion, approval, and confirmation (`latent_cross_activity`).

## Observer-only decomposition — HB-S6-01

The Stage 6 packet explicitly cued cancellation during a requested reservation,
late result arrival, release need, and the eventual-no-inventory objective. It
did not supply the following exact decisions. This decomposition preserves the
original blocker rather than reclassifying it wholesale.

| sub-finding | packet evidence | provenance | explanation |
| --- | --- | --- | --- |
| cancellation performer/authority | omitted | uncertain | no actor authority was stated |
| eligibility and meaning of before shipment | omitted | uncertain | no authoritative shipment fact/mapping was supplied |
| release initiation/completion authority | omitted | uncertain | state names do not establish authority |
| reservation/release transitions | partially omitted | uncertain | packet cues the race but not concrete local transitions |
| cancellation while requested | stated | explicitly_cued | packet expressly permits it |
| late reservation result after cancellation | stated | explicitly_cued | packet expressly supplies it; it is not latent cross-activity discovery |
| environmental assumptions behind ultimately | omitted | uncertain | external progress and event processing were not specified |

HD-015/HD-016 and `STAGE6_ENVIRONMENT_ASSUMPTIONS.md` resolve these decisions
for the study. The environment assumptions are not Business Rules.
