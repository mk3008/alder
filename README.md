# Semantic Scope / Structural Placement Research

This repository records a staged research program on how AI-assisted business-application development should represent semantic ownership and dependency range in physical code structure.

Status: **research checkpoint after Phase 9**. No normative Scope-First rules, architecture, framework, package, installer, or product decision are published here.

## Current checkpoint

The research has moved away from trying to invent a new architecture. The strongest current framing is established software-engineering practice: **information-hiding modular decomposition**, plus an explicit physical-placement judgment when needed.

The tested judgment is:

> For physical placement, choose the narrowest meaningful semantic boundary that owns the decision and contains its current required consumers.

Phase 8 found a practical structural difference when this judgment was added to `Use Package by Component.`: the augmented trajectory expressed feature/subsystem/application range and promotion/demotion more explicitly in the source tree.

Phase 9 then removed the Package by Component dependency from one arm. In that matched single trajectory, the placement judgment alone still expressed feature-local, subsystem-shared, and application-wide ranges, including promotion and later demotion. Adding `Use Package by Component.` produced deeper and more explicit component-shaped nesting, but no demonstrated structural-range or change-locality capability absent from the judgment-only arm.

This is narrow evidence, not a universal conclusion. Model/session metadata were requested but not independently verifiable, and the longitudinal experiments use small Node.js/ESM fixtures with behavior-only tests.

## Research trail

- [Initial research synthesis](docs/research.md)
- [Initial candidate proposal](docs/proposal.md)
- [Initial evaluation plan](docs/evaluation-plan.md)
- [Sources and evidence boundary](docs/sources.md)
- [Phase 2](docs/phase2/) — small matched pilot; no practical separation observed
- [Phase 3](docs/phase3/) — architecture-label comparison; protocol status `INVALID`, retained for hypothesis generation
- [Phase 4](docs/phase4/) — exploratory candidate/fixture work
- Phase 5 — independent Sol research advice recorded in PR #1
- [Phase 6](docs/phase6/) — Package by Component visibility experiment
- Phase 7 — independent Sol research advice on language-agnostic structural scope recorded in PR #1
- [Phase 8](docs/phase8/) — matched longitudinal structural-topology experiment
- [Phase 9](docs/phase9/) — placement judgment only vs. placement judgment + Package by Component

The raw/source snapshots and observer evidence for the experiments are retained under `work/` and the corresponding phase evidence directories.

## Current non-decision

The repository does **not** currently claim that:

- Scope-First is a novel architecture;
- Package by Component is generally unnecessary;
- one architecture is superior to DDD, Clean Architecture, VSA, or layered designs;
- the placement sentence above is final normative wording.

The useful checkpoint is narrower: physical structure can be treated as an expression of current semantic ownership and dependency range, and the Phase 9 trajectory did not require an architecture label to demonstrate that tested property.
