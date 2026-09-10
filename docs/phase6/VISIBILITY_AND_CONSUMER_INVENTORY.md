# Phase 6 visibility and consumer inventory

Status: raw structural evidence. The tables describe declared source visibility and observed production imports/calls. They do not rate either arm.

Generated artifacts: `evidence/<arm>/refactoring/top-level-types.json`, `external-type-probes.json`, and `javap-public.txt`. The generic probe discovers every top-level source type, generates an external-package reference to each discovered type, and records compiler exit code. No candidate type name was preconfigured.

## Arm A — Package by Component

| artifact | location | declared visibility | observed production consumers | semantic owner stated/represented in source | created/moved |
| --- | --- | --- | --- | --- | --- |
| `MunicipalApplication` | `study/` | public | acceptance external client | fixed public application API | fixture; refactored facade |
| `PermitComponent` | `study.permits/` | public | `MunicipalApplication` | permit lifecycle/data | refactoring |
| `VendorPaymentComponent` | `study.payments/` | public | `MunicipalApplication` | vendor-payment lifecycle/data | refactoring |
| `OperatingBudget` | `study.budget/` | public | `MunicipalApplication`, permit component, vendor-payment component | operating-cap rule | refactoring |
| permit/payment maps, records, lookup helpers | inside respective component classes | private | methods of the enclosing component only | component-local data and lifecycle detail | refactoring |

The source imports show each workflow imports `study.budget.OperatingBudget`; `MunicipalApplication` imports all three top-level implementation types. The generic external compiler probes for all four top-level types exit `0`; `javap -public` reports public constructors and operational methods for the three non-API types. Thus a component-external client can compile references to these implementation types; the raw probe and `javap` output are retained rather than treated as a score.

## Arm B — Package by Component plus judgment

| artifact | location | declared visibility | observed production consumers | semantic owner stated/represented in source | created/moved |
| --- | --- | --- | --- | --- | --- |
| `MunicipalApplication` | `study/` | public | acceptance external client | fixed public application API | fixture; refactored facade |
| `PermitWorkflow` | `study.permit/` | public | `MunicipalApplication` | permit lifecycle/data | refactoring |
| `VendorPaymentWorkflow` | `study.payment/` | public | `MunicipalApplication` | vendor-payment lifecycle/data | refactoring |
| `OperatingCap` | `study.budget/` | public | `MunicipalApplication`, permit workflow, vendor-payment workflow | cross-workflow operating-cap rule | refactoring |
| permit/payment maps, records, status enums, lookup helpers | inside respective workflow classes | private | methods of the enclosing workflow only | component-local data and lifecycle detail | refactoring |

The source imports show each workflow imports `study.budget.OperatingCap`; `MunicipalApplication` imports all three top-level implementation types. The generic external compiler probes for all four top-level types exit `0`; `javap -public` reports public constructors and operational methods for the three non-API types. Thus a component-external client can compile references to these implementation types; retained raw output makes the details inspectable.

## Similar-but-different logic and shared invariant

Both arms retain separate permit approval and vendor-payment release lifecycle logic in different top-level workflow/component files after refactoring. Their source contains separate record/state/check helper representations. Both arms create one budget/cap artifact that each workflow invokes before its transition. In Arm A, the budget tracks committed amount and receives `commit` from both workflows. In Arm B, the cap receives an aggregate supplier from the application facade and each workflow invokes `requireCapacityFor` before transition. These are factual representations; this record does not characterize either as the required or preferred authority.

No source file or test asserts a specific package, component count, class name, facade, visibility modifier, Repository, Service, or Interface. No unused top-level abstraction was identified by a production-import search in the final source; this is a limited source observation, not proof of future-use absence.
