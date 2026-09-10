# Phase 8 freeze record

Frozen before arm dispatch. Phase 8 starting head: `ccf647d09db2755b336c81880e383c163c5337d0`.

## Exact arm difference

Arm A (`prompts/arm-a.txt`, SHA-256 `EBE503F050D7ECB94F4C29E06AC382021C3640FEFA742793B7135A80C975913A`):

```text
Use Package by Component.
```

Arm B (`prompts/arm-b.txt`, SHA-256 `5E422A5F98EE7DC16EFCDE3830931E0FD04B269F0EA145B1C15EE1DB22D8B1CC`):

```text
Use Package by Component.

For physical placement, choose the narrowest meaningful semantic boundary that owns the decision and contains its current required consumers.
```

The second sentence is the sole intended arm difference and is copied exactly from Phase 7 advice.

## Frozen hashes

| input | SHA-256 |
| --- | --- |
| implementation common prompt | `15AEF45105EAA3296CB8A49741B9748536AC78CC31380031696636710F681FCC` |
| refactoring common prompt | `30E9F283EFDD3B2E47D8B31F0FC5E215420203DCF3D245FF05C46D2DA3340E62` |
| all-stage task packet | `EE91C2A49A9011E494FA89159AC0522A483711D445F3A186A3F3846B977AAED0` |
| Stage 1 test | `78F60CDA0D8B28913AACC50C1716789CBDF179DAB1B6E28F0D66DB4CFCC0700F` |
| Stage 2 test | `A823D22AECAEF522147CDB4F7DE279733772DD206E6CCF804EE3B0E09F2AF822` |
| Stage 3 test | `3431BAA2E46F7726DB30406BB391F46917FDF3FADAA3CBBBE17A4E7FA15A1F2E` |
| Stage 4 test | `C97CCF69ECA4A2F757CD5BA835EB98A4CDC09F71602DC943BF7C887F7EC73214` |
| Stage 5 test | `3AFF246DA5B8F4D0CB0C6E47B4C6AAFC84D4B31FC66416D670275AD7D1D23AE9` |
| fixture manifest | `8E9B6AF4754ED3E1B327CDFBE9B743EC802AC2E913F2918F28EC153932572363` |

Every stage uses `npm test`; frozen test content is copied mechanically into the arm's `test/acceptance.test.js` before that stage's implementation. Tests are behavioral only and do not name folders, packages, modules, classes, interfaces, technical roles, scope, or visibility.
