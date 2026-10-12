# Public routing comparison, review only

This directory is isolated from the product entry point. It produces a static
review diagram with the product's current CSS, card contents, Lucide icon data,
Who-color hash, path ordering, edge labels and arrowheads. It is **not a live
product screenshot**, and does not change the product router or initial layout.

## Inputs and comparisons

- Only the canonical public `business-design/alder/README.md` is parsed. Its
  expected SHA-256 is checked before rendering.
- `positions-current.json` is the frozen 360-unit current-layout specimen.
- `positions-staircase.json` is the frozen staircase specimen.
- `baseline-routing.ts` is the unchanged `338f8765…` router snapshot.
- `candidate-routing.ts` is the `b15627cc…` review candidate snapshot.
- Both snapshots remain byte-for-byte frozen, including type-only imports;
  Node 24 strips those types. No browser bundle is imported.
- `hiddenReadIndexes(relations, true)` is the exact product visibility rule.
  The 53 original indexes, 34 Read / 17 Write / 2 exception counts, 25-node
  obstacle set, all 63 source relations, and fixture hashes are asserted.

Exactly two comparison PNGs are planned:

1. `overview`: current positions + baseline router, then staircase positions +
   candidate router. Both panels share a union world crop and one common scale.
   Neither panel is fitted separately. Planned size: 1008 × 1194 CSS pixels.
2. `detail-edge-59`: baseline and candidate routers at identical staircase
   coordinates. Both panels use the world crop `(-20, 306, 776, 302)` at 1×.
   Planned size: 800 × 748 CSS pixels. All 25 cards and 53 routes remain in each
   DOM, with the same crop clipping the surrounding material. Relation 59's
   endpoint cards and both full estimated label boxes are inside this crop.

There is no label relocation, conflict cleanup, manual hiding, annotation
overlay, selective route removal, or alternate rendering of either variant.
The overview changes two variables and is a visual layout overview; only the
detail comparison isolates the routing change.

The candidate's known relation-59 estimated label/card overlap is about
102.74 × 0.158 world pixels. That number comes from the router's `label.length *
12` by 18 estimate. It is not asserted to be a glyph collision. The CI report
also records Chrome's real SVG text bounds and their card intersections,
separately. It preserves whatever the browser actually renders.

## Local preflight, no image generation

From `web-viewer`:

```sh
node web/review-routing/preflight.mjs
```

This parses the actual public fixture and both routing snapshots, validates
finite route and estimated crop geometry, constructs both exact HTML documents
in JSDOM, checks their node/route indexes, label strings, selectors, unique
marker IDs, 52 SVG elements per document and static dimensions, and exercises
both aggregate size-cap boundaries. It also checks the one-shot entry guard and
single capture call site. JSDOM does not measure rendered font or layout bounds.
It does not run Chrome, call screenshot, produce a PNG, or predict PNG size.

## Single authorized CI browser invocation

The parent browser harness imports `verifyRoutingReviewImages` from
`../test-routing-review-images.mjs` and calls it once with its already-open
Chromium browser. Install official `fonts-noto-cjk` before running this case.
The renderer explicitly includes `Noto Sans CJK JP` in its system-font stack.

Before capturing either image, the case validates both page DOMs, exact route
paths, labels, node coordinates, dimensions, crop bounds, equal transforms and
styles. It awaits `document.fonts.ready` and two animation frames, and verifies
Chrome's actual Noto CJK font usage for relation 59 through
`CSS.getPlatformFontsForNode`. A separate browser context uses light mode,
device scale factor 1 and blocked network. There is no app navigation, storage,
external font fetch or product bundle import.

Each PNG is captured once into memory, with no file path. The PNG signature and
IHDR dimensions are checked. Combined PNG bytes must be at most 196,608; the
combined base64 strings must be at most 262,144 characters. If any check,
capture, font setup or size cap fails, there is no retry, resize, compression
pass, recapture, automatic re-run or artifact fallback. Both aggregate caps are
checked before any payload is logged.

## Bounded log delivery and recovery

- One `ROUTING_REVIEW_METADATA` JSON line identifies the batch, source hashes,
  browser version, transforms, dimensions, measured relation-59 bounds, platform
  fonts, image SHA-256 values and expected chunk counts.
- Each `ROUTING_REVIEW_CHUNK` line contains at most 6,000 base64 characters and
  includes the batch, image ID, image SHA-256, 1-based chunk index, total chunks
  and this chunk's character count.
- One `ROUTING_REVIEW_COMPLETE` line gives the final hashes and size totals.
- Only small hash/dimension summaries are returned to the browser harness, so
  its case and final summary do not duplicate image data.

To recover an image from the fresh CI log, select records with the exact batch,
image ID and SHA-256. Require every index from 1 to `total` exactly once and
validate each chunk's character count. Concatenate only `data` in numeric index
order, base64-decode, and verify byte count, PNG dimensions and SHA-256 against
the metadata. Missing logs are a delivery failure, never a reason to capture
again. No CI artifact or cache is used.
