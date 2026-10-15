# How Alder treats data modeling

[日本語](data-modeling.ja.md) · [Back to Alder](../README.md) · [Authoring guidance](adoption.md#business-structure-requirements-follow-the-work-they-change)

Alder treats data modeling as a design activity: **choose a data representation that satisfies business-side structural requirements together with system requirements, existing constraints, and explicit design constraints**. Business Design records the states, operations, and guarantees the requester needs; it does not prescribe a table layout.

```text
Business-side structural requirements + system requirements, existing constraints,
and explicit design constraints → data modeling → representation and constraints
```

Business questions include what counts as one item, whether several items can be grouped, optional information, identity, uniqueness, history, and the unit of approval. System considerations include performance, storage volume, existing schemas, migration, integrations, and technical limits. Several representations can satisfy the same business meaning. If a particular design choice is already required, state it and its reason explicitly as a design constraint, then check that it fits the business requirements.

## Why table design is not a required separate stage

People may model data before implementation, during implementation, or in System Design, as the work requires. Alder asks that **the business effects of the selected structure can be traced to agreed requirements or explicit constraints**. It does not require every business decision to be settled before implementation begins.

As code, DDL, and tests make choices concrete, compare the states they permit and operations they reject with Business Design. Correct a mismatch with agreed meaning; return an unresolved business choice to the requester as a concrete question. Implemented behavior or a passing test alone is not business approval. AI does not change the established principle of designing models from requirements. See [the rationale for iterative validation](philosophy.md#why-not-settle-every-decision-before-implementing).

## Why Business Design has no dedicated data-structure field

Structure matters to Business Design where it changes the work. “One order can contain several products,” “pickup needs no delivery address,” and “approve the request as a whole” belong beside the relevant Activity's **Procedure / Result / Input**, the Object's **Information**, or a relevant exception. The format intentionally lets readers recover structural requirements from the work and its outcomes. A later designer can identify grouping, optionality, identity, history, and approval units in context. Leave undecided business policy as a question, rather than presenting it as agreed.

A dedicated field could duplicate the condition already stated in the procedure and encourage fixing keys or cardinalities before confirming their business effects. The [Issue #114 comparison](data-structure-requirements-study.md) selected existing fields; the [Issue #116 Fresh comparison](../work/data-structure-requirements/public-repeat.md) tried the revised authoring and review guidance. That comparison used one synthetic input and qualitative observations: it cannot rule out benefits of a dedicated field in general. It found no difference that justified a dedicated field or required template line here, so Alder retains the existing format. See [the adoption guide](adoption.md#business-structure-requirements-follow-the-work-they-change) for where to write and review specific conditions.

## Examples: business meaning and data representation

| Confirm in Business Design | Choose during data modeling |
| --- | --- |
| One order can contain several products and is confirmed as one order. | Whether to use order headers and lines and how to relate them. A structure that can store only one product per order would violate the requirement. |
| A delivery order needs an address; a pickup order does not. | Nullable columns, separate delivery information, conditional validation, or other suitable mechanisms. A universally required address would prevent pickup. |
| A member number must be unique within an organization but can recur in another. | How to enforce uniqueness for the organization and number together. Global uniqueness of the member number would reject allowed cases. |

These examples do not uniquely determine table count or primary keys. If partial confirmation of individual products is undecided, confirm that business policy rather than inferring it from a proposed schema.

## Human modeling and reliable constraints

People can design the model themselves, or review candidates produced by AI. Even when AI implements the system, choosing and checking a model against business and system requirements remains the same design task. AI or DDL cannot approve business meaning on the requester's behalf.

Correct PK / FK / UNIQUE / NOT NULL / CHECK constraints make invalid states impossible to persist and can improve system reliability. An incorrect constraint can also reject valid business states. Trace the rationale for each consequential constraint to Business Design or an explicit system constraint. Database constraints alone cannot express every rule concerning authority, time, external facts, or concurrent updates; also check application behavior and operational guarantees.

The [structure-requirements study](data-structure-requirements-study.md) and [Fresh rerun at public revisions](../work/data-structure-requirements/public-repeat.md) record the decision and its evidence. Effects in real projects and generalization to other business domains remain unverified.
