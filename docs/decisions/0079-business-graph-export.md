# Issue #79 — deterministic Business Design projection

## Decision and reason

Use a standalone Python 3.12+ standard-library CLI under `tools/business_graph/`, alongside the existing Python verification tooling rather than adding an npm/runtime package. Keep the existing Markdown 5W1H fields and annotate identity and connections in that same source. The exporter does not attempt natural-language entity resolution and has no second hand-authored JSON specification.

The source profile is opt-in, versioned and strict. Existing free-form benchmark Business Designs remain unchanged. Reusing their headings without requiring identifiable Objects would force inference or silently lose connections; explicit Object references avoid that ambiguity. The extra authoring cost is stable IDs, one Object declaration each and labeled references where I/O is already written. This is not a mandatory format for ordinary Alder reviews.

Use `input` / `output` kinds as the two data directions and separate `business-exception` / `object-exception` kinds. Document-wide Scope is copied once. Who stays prose, independent of external-human Objects. What and heading name remain distinct existing source texts. Procedure stays authoritative in the design but is deliberately outside the projection, so Graph JSON never claims complete meaning preservation of the specification.

The executable `validate_graph` function is the machine-checkable v1 specification, including unique IDs and cross-node constraints. Avoid a duplicate schema and validator pair for this small format. It is tested directly as well as through the CLI. No network call/catalog snapshot is needed for icon-name syntax; consumers own Lucide-version resolution and an unavailable-icon fallback.

## Validation and stopping condition

Use Alder's self-design as a committed regeneratable example. Verify multiple I/O, shared Objects with different labels, all endpoint-kind constraints, missing references/labels, malformed source, determinism, exclusion of Procedure and protection of the source/existing output. Run the existing drift regression/evaluation to protect the unchanged optional-pilot boundary. Perform independent Fresh review for the business/technical projection boundary before submitting the PR. No architecture/performance experiment is needed for a local bounded Markdown-to-JSON transform.

## Limits

The validator cannot establish whether a human correctly identified an Object, whether the declared correlations are complete, whether a label describes reality, or whether business meaning has been approved. The initial self-design is a proposed description of the existing workflow plus this issue's export operation, subject to human PR review. Existing experimental practices retain their optional status. This does not promote the drift PoC to a production parser, introduce a new review knowledge version, implement a Viewer or authorize release.

## Verification record

Against base `5405a50` (Alder v0.5.1), Python 3.12.14:

- 21 exporter/contract/CLI tests passed, including byte-for-byte regeneration of 26 nodes (11 Business, 15 Object) and 74 labeled relations.
- Existing drift pilot: 12 detector regression tests and all 26 evaluation scenarios passed. No pilot source or historical evidence was changed.
- 32 local links in the changed/new entrypoint and specification documents resolve; staged diff whitespace checks passed.
- Independent Fresh reviewer `/root/fresh_review_79` received the issue requirements and repository paths without the implementer's conversation context. It read the design/Decision before implementation, applied review knowledge v0.3, ran all 21 tests and additional malformed-endpoint/empty-label/unsupported-heading probes, and reported no findings requiring changes. It confirmed Who/Object separation, optional-workflow conditions, shared-object labels, exception semantics and explicit Procedure exclusion.

This is bounded verification of the documented profile, not arbitrary Markdown support, exhaustive correlation discovery or human approval of the initial self-design. CI results are attached to the PR.
