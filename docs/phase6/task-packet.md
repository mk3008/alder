# Phase 6 frozen business change packet

The fixed public application API remains `study.MunicipalApplication`. Implement the following new public operation:

```java
void setOperatingCap(int amount)
```

The operating cap is a municipal-wide business rule. The total of all **approved permit** amounts and all **released vendor-payment** amounts must never exceed the currently configured cap.

When approving a submitted permit or releasing an entered vendor payment would exceed the cap, reject that operation with an `IllegalStateException` whose message contains `cap`; do not change that record's lifecycle state. Existing public behaviors and exact approval/release messages remain unchanged.

No implementation form, package, class, interface, visibility modifier, persistence mechanism, or shared abstraction is required by this packet.
