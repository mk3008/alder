# Stage 3 resolution implementation prompt (frozen)

Implement the current Stage 3 business requirements in the supplied working directory. Use only the supplied current DDL, complete active Business Rules, applicable Human Decisions, current cumulative acceptance test, and Stage 3 packet. Do not inspect or use future-stage packets, historical ledgers, prior Stage 3 output, or other evidence.

The trusted actor object used by the acceptance harness is boundary context, not authentication infrastructure. Implement only the stated business semantics. Do not alter DDL, frozen tests, package metadata, or documentation. Run the supplied PostgreSQL cumulative acceptance test after implementation.

For physical placement, choose the narrowest meaningful semantic boundary that owns the decision and contains its current required consumers.
