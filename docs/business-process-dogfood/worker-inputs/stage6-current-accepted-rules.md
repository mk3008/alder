# Current accepted Business Rules — Stage 6

Stage 1–5 accepted rules remain active. Stage 6 adds only the following rules; no future material is included.

1. Authorized Sales may cancel only confirmed, unshipped (`shipment_at IS NULL`) Orders. Cancellation immediately makes Order cancelled.
2. Cancellation of reserved produces release_requested; cancellation of failed retains failed; cancellation of requested retains requested until an authoritative result.
3. Trusted inventory result on cancelled requested changes failed to failed or reserved to release_requested. No late result restores confirmed.
4. Trusted inventory authority alone completes release_requested→released. No result/release may silently discard an obligation or make cancelled Order hold reserved inventory as terminal state.
5. Conditional liveness depends on external inventory progress and continued application result processing; permanent external outage retains the outstanding local obligation and does not prove physical release.
