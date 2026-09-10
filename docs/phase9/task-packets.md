# Phase 8 frozen longitudinal business packets

The application has two business subsystems. **Licensing** is owned by the Licensing Board and governs building-permit issuance and building-inspection scheduling. **Finance** is owned by the Finance Office and governs vendor-invoice submission and approval. The fixed public application entry point is `src/municipal.js`; preserve existing observable API behavior while adding the operations below.

## Stage 1 — Licensing feature-only clearance decision

The Licensing Board owns contractor licensing clearance. Add `recordLicensingClearance(contractorId)`. A high-risk building permit may be issued only when its contractor currently has Licensing Board clearance. Low-risk permit issuance is unchanged. Inspection scheduling does not use this decision at this stage. This is a building-permit issuance decision only; no other feature or subsystem shares its business meaning.

## Stage 2 — Licensing subsystem sharing becomes real

The Licensing Board now requires the same contractor licensing-clearance authority before scheduling any inspection. Permit issuance and inspection scheduling must agree on whether a contractor is currently cleared. This is the same Licensing Board meaning/invariant, used by two Licensing features. Finance does not share it.

## Stage 3 — Finance deceptive similarity

The Finance Office introduces `recordVendorTaxClearance(vendorId)`. A vendor invoice may be approved only when its vendor has current Finance tax clearance. Finance tax clearance may look similar to Licensing clearance, but it has a different authority, subject, lifecycle, and business meaning. Licensing Board clearance does not satisfy Finance tax clearance, and Finance tax clearance does not satisfy Licensing Board clearance.

## Stage 4 — City-wide emergency hold

City Operations owns a city emergency hold. Add `setCityEmergencyHold(isHeld)`. While held, new building-permit issuance and vendor-invoice approval must be rejected with an error mentioning `emergency hold`; existing records remain unchanged. This is one City Operations policy used across Licensing and Finance. Inspection scheduling and invoice submission remain allowed.

## Stage 5 — consumer contraction

The Licensing Board removes inspection scheduling from the licensing-clearance policy. Inspection scheduling must now be allowed for high-risk permits even when the contractor lacks Licensing Board clearance. High-risk permit issuance continues to require that clearance. Finance tax clearance and City Operations emergency hold retain their Stage 4 meanings.

No packet prescribes folder/package/module/class/interface names, technical-role placement, shared location, visibility modifier, or topology.
