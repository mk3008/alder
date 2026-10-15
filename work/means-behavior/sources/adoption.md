# Applying Alder to a product

[Back to Alder](../README.md) · [Why this loop](philosophy.md)

Alder assumes an AI agent performs implementation, followed by a separate agent or fresh context for review. No installer, runtime dependency, proprietary DSL, submodule, or dedicated configuration is required. The reviewer needs readable Business Design and the selected Alder review knowledge.

## 1. Place Business Design where the agent can read it

For a new product, prefer this local arrangement in the product repository:

```text
product/
  AGENTS.md
  docs/
    business-design/
      ...
    decisions/
      ...
    alder/
      review-knowledge.md
  src/
  tests/
```

| Example path | Content |
| --- | --- |
| `docs/business-design/` | Current Business Design. |
| `docs/decisions/` | Decision Records for material implementation assumptions and choices. |
| `docs/alder/review-knowledge.md` | A copy of the selected Alder version's review knowledge / review definition. |

This is a recommended example, not a required layout. Keep existing equivalent locations when they are already established. Copy the selected review knowledge without changing its rules and record its source revision, so the local filename does not obscure which version is used.

This keeps design and implementation comparable in the same commit and PR, aligned on each branch, and available without additional repository discovery. The review can identify exactly which versions it compares.

A separate repository is also possible when both are readable at stable paths in the same workspace:

```text
workspace/
  product/
  business-design/
```

State the design path and target revision in the task prompt or AGENTS.md. Pin a commit or tag where possible; if using a branch, record its resolved commit alongside the product revision at review time. A GitHub URL alone, or an expectation that the agent will discover the design, is not the standard arrangement. Make the access path known before reviewing.

### Recommended Business Design format

The current research recommends **5W1H, with How written as Input → Procedure → Output**, to make relationships between activities traceable. This is the current reference format used by the evaluated cases, not a mandatory input specification. Equivalent review behavior has not been established for arbitrary specification formats.

| Field | What to describe |
| --- | --- |
| What | The name of the work. We consider it necessary to identify the activity. |
| Why | Its purpose, stated briefly enough to help explain decisions and constraints. Deep purpose analysis is not required. |
| When | Its trigger. Prefer work that starts in response to a preceding result, external event, or state change. |
| Who | Who performs the work, makes the judgment, or bears responsibility. |
| Where | A site, location, or channel when it affects operational decisions or procedures. Otherwise, “not specified” is sufficient. |
| How | Input: what is received from preceding work, users, or external sources → Procedure: what is decided or processed → Output: what is passed to subsequent work as an established fact. |

The point is not to fill every field mechanically. It is to **identify the activity through What and trace relationships between activities through Who / When / Input / Output**.

A When such as “whenever the person feels like doing it” makes timing depend on individual initiative. If human discretion itself is the operational trigger, state that discretion explicitly. This recommendation helps describe work consistently; it is not an additional rule in the review knowledge.

Examples (Japanese): [Facilities maintenance](../business-design/facilities-maintenance/README.md) / [Purchase requests](../business-design/purchase-request/README.md) / [Meeting-room reservation](../business-design/meeting-room/README.md)

## 2. Point the agent to the design and review knowledge

Use root AGENTS.md as a router. Adapt the paths to your workspace:

```markdown
## Business Design

- Current business design is under `docs/business-design/`.
- Treat it as the current source of operational intent.
- Do not invent business policy when the design does not decide it.
- Record material implementation assumptions and choices in Decision Records under `docs/decisions/`.
- For an Alder review, use `docs/alder/review-knowledge.md` from the selected Alder revision. Read Business Design, then Decision Records, then implementation, DDL, and tests.
```

Record the selected review knowledge source revision in the routing instructions or alongside the copied document. Do not copy the full review knowledge into AGENTS.md or inject Q1–Q3 / P1 / P2 / S into every implementation task. Apply it explicitly during review.

### Versions and access

The planned first release is **Alder v0.1**, containing **research review knowledge v0.3**. These versions describe different things and are not renamed to match.

For the recommended local setup, copy [the review knowledge](phase2/review-knowledge-v0.3.md) from the selected revision to `docs/alder/review-knowledge.md`. Before v0.1 is published, select and record a commit; after publication, select tag `v0.1`. The Alder release remains v0.1 and the copied knowledge remains research version v0.3, regardless of the local filename.

A local copy is optional. A readable versioned GitHub URL for `docs/phase2/review-knowledge-v0.3.md`, or a checkout of the selected Alder revision in the same workspace, also works. State its path or URL and revision and confirm the reviewer can read it. The current review knowledge is in Japanese.

## 3. Let the AI implement without inventing business policy

Alder does not prescribe an architecture style or when to introduce structure. Give the implementation agent the Business Design, current requirements, project constraints, and the information below; let it choose how to realize them. See [the architecture position](philosophy.md#ai-coding-and-architecture).

Describe futures you actually foresee in concrete terms, separately from current requirements. For example: “additional delivery or payment providers are likely,” “there is a concrete prospect of changing the database,” or “business logic must be testable without external I/O.” The last example is a desired property, not a prediction. State the risk or property itself rather than translating it into “create a Port,” “add a Repository,” or “use Clean Architecture.”

Pass on what people actually know about likely changes; do not add hypothetical requirements merely because something might change someday. If no such future is foreseen, say so or omit it. Foresight informs design decisions; it does not authorize the agent to invent undecided future business rules or implement them as current requirements.

Replace the placeholders with the requested task and actual design path:

```text
Task: <requested work and acceptance conditions>
Business Design: <path and revision>
Current requirements / constraints / review concerns: <concrete requirements and desired properties>
Known risks / likely future changes: <concrete foresight, separate from current requirements; omit if none>

Read the relevant Business Design before implementing this task.
Implement the requested work using the existing project conventions. Use the stated risks and desired properties to choose the implementation; do not treat architecture names as substitutes for requirements. Treat future foresight as design context, not authorization to implement undecided future behavior. Do not invent unforeseen future requirements or business policy that the Business Design does not decide.

When implementation makes a material assumption or choice that is not obvious from the Business Design, record it in a Decision Record. Record what was chosen, why it was needed, and the evidence or constraint that led to it. Do not create Decision Records for every routine, reversible technical choice.

If the choice would change the business outcome, authority, allowed state, data meaning or cardinality, unit of work, or a guarantee relied on by another activity, and the Business Design does not decide it, do not record it as an approved business decision. Report it as a focused Human Decision instead and keep it unresolved. Explain why the existing Business Design does not decide it, give the smallest useful alternatives, and continue independent work where possible.

Routine, reversible technical choices do not require Human Decision. Perform the relevant non-destructive verification for the requested work.
```

A Decision Record is evidence of material assumptions and choices actually made during implementation, together with their reasons. A Human Decision is needed when Business Design leaves unresolved a choice that changes business meaning. A Decision Record does not replace that human decision; neither passing tests nor completed implementation constitute business approval.

Use the repository’s existing location and format for Decision Records, or a suitable location such as `docs/decisions/` if none exists. Alder requires the record, not a particular directory or template. These are Decision Records, not only architecture decisions.

## 4. Run a separate Alder review after implementation

Use a separate agent or fresh context so that implementation assumptions are not simply carried forward as justification. Provide the design and implementation revisions, documented decisions, and readable review knowledge. This is a workflow recommendation, not an additional rule in review knowledge v0.3.

```text
Review the current implementation against the relevant Business Design using Alder review knowledge v0.3 from Alder v0.1. Review only; do not modify files.

Business Design: <path and revision>
Implementation: <path and revision or precise working-tree scope>
Review knowledge: <readable path or versioned URL and revision>

Read in this order:
1. Business Design
2. Decision Records / documented assumptions
3. implementation, DDL, and tests

Apply the referenced review knowledge, including its boundaries and stopping conditions. Check whether the implemented work can continue truthfully, whether constraints have explainable causes and remaining effects, and whether meaning, conditions, units of work, authority, and guarantees connect across preceding and subsequent activities.

Walk through representative work from each participant's perspective, then trace business-significant choices in the implementation back to the Business Design.

For each important finding, report:
- evidence
- concrete effect on current or downstream work
- classification: definite mismatch / Business confirmation / technical improvement / sufficient
- the minimal decision or confirmation needed, including who is responsible for deciding; state when none is needed

Do not turn every undocumented detail into a requirement. Do not prescribe a particular architecture, UI, data model, or implementation solution when multiple implementations could satisfy the business meaning. A technical fix is not a substitute for confirming unresolved business meaning.
```

Before release, replace “from Alder v0.1” with the selected pre-release commit. The prompt routes to the full knowledge; its summary does not replace that document.

A Business confirmation is not automatically a request to change implementation. An existing contract or external procedure may supply the required meaning. Confirm that basis and stop when sufficient.

### Follow up on human decisions

Give the agent the actual decisions from the responsible people; this prompt does not authorize it to decide unresolved business policy:

```text
Apply these human decisions to the Business confirmation items from the review: <decisions and responsible people>.
Update Business Design first for decisions that change business meaning, then update implementation and tests to match. Do not turn technical improvement suggestions into business policy. Keep still-unresolved items open and continue independent work where possible.
```

### Before or after implementation?

A light check for obvious contradictions or Human Blockers before implementation is useful. The main use shown here is post-implementation review: ambiguity has become a concrete choice that can be traced back to Business Design. The optimal division between pre- and post-implementation review is still a research question, not a validated conclusion. See [validation and limits](validation.md).

## Optional companion tools

For a product that chooses Raw SQL, these projects have independent responsibilities:

| Project | Responsibility |
| --- | --- |
| Alder | Review business meaning, continuity, and guarantees against Business Design. |
| [Raw SQL Rules](https://github.com/mk3008/raw-sql-rules) | A repository contract for reviewable Raw SQL construction: application-owned structure, with no arbitrary SQL syntax supplied by runtime input. |
| [Serene](https://github.com/mk3008/serene) | Make TypeScript Raw SQL construction easier to classify and triage while retaining native drivers and application-owned execution. |

Raw SQL Rules does not prescribe architecture or a framework. Serene is not an ORM, query builder, or mapper, and does not prove SQL meaning, authorization, or business behavior. Construction triage does not replace Alder review. They are optional companions, not a combined framework or Alder dependencies.

After adopting your selected Raw SQL Rules version, a product can route both concerns from AGENTS.md:

```text
For business implementation and Alder review, use the Business Design under `docs/business-design/` and the selected Alder review knowledge referenced above.
For Raw SQL data-access work, read `rules/raw-sql-rules.md` and follow it as the repository contract.
```

For a TypeScript product also using Serene, follow its [AI adoption guide](https://github.com/mk3008/serene/blob/main/docs/ai-adoption.md) separately. Keep SQL meaning, binding, authorization, and business-behavior review even when construction is recognized as ordinary.
