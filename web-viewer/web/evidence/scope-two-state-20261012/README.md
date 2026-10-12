# Scope outside: show or hide only

Latest user correction removes the half-opacity option. This source supersedes the three-state UI at b2c0ca18 but does not change its already-published fixed preview. No new deployment is included without separate approval.

The visible select now offers only 表示 and 非表示. Scope-specific dim classes and CSS are removed. Existing selection emphasis and type/Scope colors remain as before. Hiding removes outside cards and their incident edges/labels, retains all source data, positions and complete routing/canvas extents, and clears only selections that become hidden. Showing restores the same coordinates. Lock, zoom, Write preference, input icons and the directed/facing-port layout are unchanged. No left Drawer or per-node visibility controls are added.

Live Session accepts only show/hide. The legacy stored-session type allows old scopeOutside:'dim' and dimOutside/hideOutside booleans solely during restore. Every old dim/boolean setting migrates to show, so previously visible items are not silently hidden. Explicit scopeOutside:'hide' remains hide and takes precedence. Deprecated fields are removed before the next save. Invalid stored values still report failed restoration.

Model tests cover both modes and repeated restore, legacy true/false/dim and precedence, hidden selection versus in-scope selection, unchanged all25positions/data/extents, Write filtering, all-outside documents, stale pointer cancellation, lock/unlock and invalid settings. Browser regression uses actual hide12nodes, hidden incident lines, close/reload/reopen and exact25coordinate restoration; 320/393px keyboard modes and source icons remain checked. The full directed/facing curve, input, preview isolation and touch suites remain in the single final gate.

The previous run18 failure remains recorded; run19 on b2c0ca18 succeeded. This separate correction is validated by its own initial run20/attempt1, one Ubuntu24.04job/15minutes without added artifact/cache or retries. Final result is recorded in PR/root checkpoints after execution. Physical Android and the known native Drawer touch-scroll limitation are not certified.
