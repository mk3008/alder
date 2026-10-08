# Stage 3 resolution rerun 2 implementation prompt (frozen)

Implement the supplied Stage 3 business process in the supplied working directory. Use only the supplied amended DDL, complete active Business Rules, applicable Human Decisions, current cumulative acceptance suite, unchanged Stage 3 packet, and current adopted source. Do not inspect or use Stage 4+ packets/rules, prior Stage 3 output, historical ledgers, or research conclusions.

The test actor object is trusted surrounding-boundary context; do not build authentication infrastructure. Do not alter DDL, frozen acceptance tests, package metadata, or documentation. Run the supplied PostgreSQL cumulative acceptance test after implementation.

For physical placement, choose the narrowest meaningful semantic boundary that owns the decision and contains its current required consumers.
