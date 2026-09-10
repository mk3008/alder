# Phase 6 freeze record

Frozen before either arm is dispatched. Phase 6 starting SHA: `cc9d84ff932a9abfa12343c2384a2f80d3797fab`.

## Exact arm difference

Arm A exact directive (`prompts/arm-a.txt`, SHA-256 `EBE503F050D7ECB94F4C29E06AC382021C3640FEFA742793B7135A80C975913A`):

```text
Use Package by Component.
```

Arm B exact directive (`prompts/arm-b.txt`, SHA-256 `B5DFF8B16DDDFCBBC56211D9ED4376A1B38CC4BF1F4F9C6341E6EF71FC40BFC9`):

```text
Use Package by Component.

Place each decision behind the narrowest enforceable boundary containing its current semantic owner and actual consumers.
```

The second sentence is the sole intended arm difference. It is a measurement instrument, not normative Scope-First wording.

## Other frozen input hashes

| input | SHA-256 |
| --- | --- |
| implementation common prompt | `FE8E6607ABBE5775D9E089E850FCEB898E84955C4D7D5A1C98640150FC8CCBA8` |
| refactoring common prompt | `68EEF2A4063F68CC9966F74FACE85558C1A6591C378CC58850CF25A059D43263` |
| task packet | `8FAAEEE18D53A858BB589C02A675FF08D6A59A72B3039D783D2D3B4F1F48CC86` |
| frozen acceptance test | `11F88E9EA9EA58885475FFC487E8301BADD444F2FAA0099949DE72CCBB1E70BC` |
| fixture manifest (README + source path/content hashes) | `5958BC85AD35F8066E8E53B17C7963FD083D05322069A8B2151DF588628CFCC8` |

Java toolchain image: `eclipse-temurin:21-jdk`, pulled digest `sha256:85f00967bcc624fc19fa9c2cf124ea426a5363898e267141726f31f358c2e14b`.

The frozen build/test command for every run is:

```text
docker run --rm -v <run-directory>:/work -w /work eclipse-temurin:21-jdk sh -lc "rm -rf out && mkdir out && javac -d out $(find src/main/java src/test/java -name '*.java') && java -cp out acceptance.MunicipalApplicationAcceptance"
```

The path substitution is mechanical. No test asserts package names, type names, directory names, visibility modifiers, patterns, or component counts.
