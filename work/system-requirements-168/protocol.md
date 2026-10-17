# Issue #168 preregistered comparison
Status: research/design only, 2026-10-06. No adoption, release or production Skill edit.

## Question and hypotheses
Determine whether supplied System Requirements need explicit inclusion in independent implementation review. Distinguish missing input from missing procedure. Existing project-instruction and documented-assumption routes may already cover them; this is a genuine alternative to the Issue hypothesis. This is not a risk classifier or a general security evaluation.

## Baseline
Alder main f716c1a1ea8fa8b3adebb9001d9762eee89eadb0, plugin 0.4.4, bundled review knowledge v0.3. Current production Skill and references are unchanged. The local checkout started at eb177dab8d30383f0a5e084ad22a8eca59455d27; connector comparison verified the only subsequent main changes were README.md / README.ja.md, both replaced with exact main content. Published experiment commit's parent is actual current main, not this local reconstruction.

## Arms and permitted input boundary
One separate no-history-fork agent for each arm, each reviews the six candidates once. Each reads current AGENTS Fresh settings, current Skill, full bundled knowledge, read-only stage and provenance. All read common Business Design, Checks, decisions, scope, code and executable tests. They can run those tests.
- A: current Skill, without-sr/AGENTS.md, common files only. No SR content is available. This is an input-withheld diagnostic, not the sole baseline for judging procedure.
- B: current Skill, with-sr/AGENTS.md, common files plus with-sr/system-requirements.md. SR is readable via project instructions and supplied product documentation, but the request does not add an explicit SR comparison procedure. Its bytes are frozen with the packet; 'not explicitly pinned' means absent from the current Skill's named pin list, not moving/missing experimental content.
- C: exact same readable product files as B, current Skill plus candidate.md. SR is explicitly pinned and compared. The only B/C intervention is the experimental procedure.

Agents must not read Issue #168 hypotheses, this protocol's scoring discussion, other arms' prompts/results, evaluator material or prior research. They receive file allowlists and the neutral original review request. Separate contexts are real; file-access isolation is instruction-based, not an OS sandbox. Record paths read and violations. Runtime effective model/effort cannot be independently attested; record requested gpt-6-sol / medium / fork none per repository Fresh settings. Exact dispatch prompt and agent IDs are retained after run.

## Scope and evidence
Synthetic minimal Python/SQLite implementation and real assertions provide behavior evidence. Five business tests deliberately have limited coverage; reviewers must inspect assertions, not equate green with technical compliance. SR constraints include exact approved alternatives and thresholds not derivable from Business Design. Case02 overlaps existing business authorization meaning, a positive control for indirect coverage. Case05 mixes compliant downtime/restore duration with noncompliant restore-point interval. Case06 is an unchanged-behavior negative control. No real PII, credentials, private URLs or production deployments.

## Frozen evaluation plan
Score each substantive result against implementation and approved source, retaining quotes/evidence: detected mismatch with correct authority; concrete uncertainty/source request; unsupported policy invention; false positive on compliant subconditions/benign case; new mandatory artifact/checklist; technical-vs-business decision attribution; honest evidence limits. A cannot establish unseen exact SR facts: credit specific questions without calling them confirmed SR detection. Compare B/C primarily for input traceability/coverage behavior, not only counts. Even equal findings can support minimal clarification of responsibility, not an efficacy claim.

Coordinator-only oracle is kept outside agent allowlists and committed with results after reviews. Execute a deterministic observation harness for contract facts without exposing oracle to reviewers. Freeze safe inputs at a publicly retrievable immutable commit BEFORE dispatch; record hashes, requested settings, full prompts and raw outputs. Do not revise fixture or candidate between arms; post-run changes require a separately identified run.

## Stopping condition and limits
One bounded three-arm qualitative pilot, six independent candidates per arm, then evidence-based design decision. No population detection rates, causal efficacy claim or exhaustive SR completeness claim. Shared model, synthetic simple code, one reviewer per arm, no deployment/load/penetration test and no runtime-setting attestation are explicit limits. If agent context or revision is invalid, mark run invalid and rerun only that arm with unchanged public inputs. Production work is a separate task after human adoption.
