# Phase 9 freeze record

Frozen before arm dispatch. Phase 9 starting head: `a34a3aead2e4d2e5d29ce41170f309f7487954af`.

## Exact arm difference

Arm A (`prompts/arm-a.txt`):

```text
For physical placement, choose the narrowest meaningful semantic boundary that owns the decision and contains its current required consumers.
```

Arm B (`prompts/arm-b.txt`):

```text
Use Package by Component.

For physical placement, choose the narrowest meaningful semantic boundary that owns the decision and contains its current required consumers.
```

The only intended difference is the first sentence in Arm B.

## Frozen inputs

Phase 9 files are exact copies of the listed Phase 8 frozen inputs unless stated otherwise. SHA-256 values are recorded after copying; matching values verify byte reuse.

| input | Phase 8 source | Phase 9 SHA-256 |
| --- | --- | --- |
| Arm A directive | new, exact Phase 7 sentence | `67146B07C5C4D27D22CB8006586125B2AA98552189C6F2DE9AFAC30632F72016` |
| Arm B directive | `docs/phase8/prompts/arm-b.txt` | `5E422A5F98EE7DC16EFCDE3830931E0FD04B269F0EA145B1C15EE1DB22D8B1CC` |
| implementation common prompt | `docs/phase8/prompts/implementation-common.txt` | `15AEF45105EAA3296CB8A49741B9748536AC78CC31380031696636710F681FCC` |
| refactoring common prompt | `docs/phase8/prompts/refactoring-common.txt` | `30E9F283EFDD3B2E47D8B31F0FC5E215420203DCF3D245FF05C46D2DA3340E62` |
| all-stage task packet | `docs/phase8/task-packets.md` | `EE91C2A49A9011E494FA89159AC0522A483711D445F3A186A3F3846B977AAED0` |
| Stage 1 test | `work/phase8/frozen-tests/stage1.test.js` | `78F60CDA0D8B28913AACC50C1716789CBDF179DAB1B6E28F0D66DB4CFCC0700F` |
| Stage 2 test | `work/phase8/frozen-tests/stage2.test.js` | `A823D22AECAEF522147CDB4F7DE279733772DD206E6CCF804EE3B0E09F2AF822` |
| Stage 3 test | `work/phase8/frozen-tests/stage3.test.js` | `3431BAA2E46F7726DB30406BB391F46917FDF3FADAA3CBBBE17A4E7FA15A1F2E` |
| Stage 4 test | `work/phase8/frozen-tests/stage4.test.js` | `C97CCF69ECA4A2F757CD5BA835EB98A4CDC09F71602DC943BF7C887F7EC73214` |
| Stage 5 test | `work/phase8/frozen-tests/stage5.test.js` | `3AFF246DA5B8F4D0CB0C6E47B4C6AAFC84D4B31FC66416D670275AD7D1D23AE9` |
| fixture individual-file manifest (documented algorithm) | `work/phase8/fixture-base/` | `19F1E4542E90FFA254A09CB9AE332EA1E88988037E39A65CDCD756ACFC4AD36C` |

The fixture manifest is SHA-256 over newline-separated `SHA256  relative-path` rows, paths sorted ordinally. Its calculation method differs from the Phase 8 fixture manifest record; byte equivalence is additionally checked before dispatch with `git diff --no-index` over the copied fixture tree.
