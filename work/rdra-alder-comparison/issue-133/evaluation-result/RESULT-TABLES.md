## 完了・利用可能性

| 手法 | Stage | 予定 | 技術的完了 | strict有効 | source-clean探索有効 |
|---|---|---:|---:|---:|---:|
| alder | s1 | 10 | 10 | 8 | 10 |
| alder | s2 | 10 | 10 | 7 | 10 |
| alder | s3 | 10 | 10 | 7 | 10 |
| rdra | s1 | 10 | 10 | 1 | 10 |
| rdra | s2 | 10 | 10 | 3 | 10 |
| rdra | s3 | 10 | 10 | 3 | 10 |

strictのguard許可は両手法で非対称だった。上の有効率を手法品質へ換算しない。技術的完了と厳密な条件遵守も同一ではない。

## 探索観測の各資料

以下はsource-clean探索資料の記述値。strict列は原wrapper条件でも有効だった資料を示す。NAは適用外または根拠を確定できない指標であり、0点ではない。原採点・引用根拠・未確定metric名はJSONで追跡できる。

### s1

| case | rep | 手法 | ID | strict | 未決発見 | 回答可能な質問 | source保持 | 無断決定 | 補完 | 再質問 | C4停止 |
|---|---:|---|---|---|---|---|---|---:|---:|---:|---|
| C1 | 1 | alder | P048 | yes | 2/2 | 2/2 | 5/5 | 0 | 1 | 0 | NA |
| C1 | 1 | rdra | P038 | no | 2/2 | 0/2 | 5/5 | 5 | 1 | 0 | NA |
| C1 | 2 | alder | P028 | yes | 2/2 | 2/2 | 5/5 | 0 | 1 | 0 | NA |
| C1 | 2 | rdra | P035 | no | 2/2 | 0/2 | 5/5 | NA | NA | 0 | NA |
| C2 | 1 | alder | P027 | yes | 3/5 | 3/5 | 6/6 | 0 | 0 | 0 | NA |
| C2 | 1 | rdra | P006 | no | 0/5 | 0/5 | 6/6 | 5 | 7 | 0 | NA |
| C2 | 2 | alder | P026 | yes | 4/5 | 4/5 | 6/6 | 0 | 0 | 0 | NA |
| C2 | 2 | rdra | P012 | yes | 0/5 | 0/5 | 6/6 | 5 | 7 | 0 | NA |
| C3 | 1 | alder | P009 | no | 3/3 | 3/3 | 6/6 | 0 | 0 | 0 | NA |
| C3 | 1 | rdra | P013 | no | 2/3 | 0/3 | 6/6 | 2 | 2 | 0 | NA |
| C3 | 2 | alder | P032 | no | 3/3 | 3/3 | 6/6 | 0 | 0 | 0 | NA |
| C3 | 2 | rdra | P042 | no | 1/3 | 0/3 | 6/6 | NA | NA | 0 | NA |
| C4 | 1 | alder | P011 | yes | NA | NA | 6/6 | 0 | 2 | 2 | False |
| C4 | 1 | rdra | P016 | no | NA | NA | 5/6 | NA | NA | 0 | False |
| C4 | 2 | alder | P047 | yes | NA | NA | 6/6 | 0 | 1 | 1 | False |
| C4 | 2 | rdra | P030 | no | NA | NA | 6/6 | NA | NA | 0 | False |
| C5 | 1 | alder | P024 | yes | 1/2 | 1/2 | 18/18 | 0 | 0 | 0 | NA |
| C5 | 1 | rdra | P023 | no | 1/2 | 0/2 | 17/18 | 1 | 2 | 0 | NA |
| C5 | 2 | alder | P021 | yes | 1/2 | 1/2 | 18/18 | 0 | 0 | 0 | NA |
| C5 | 2 | rdra | P004 | no | 1/2 | 0/2 | 17/18 | 1 | 2 | 0 | NA |

### s2

| case | rep | 手法 | ID | strict | 回答後保持 | 無断決定 | 補完 | 未決漏出 |
|---|---:|---|---|---|---|---:|---:|---:|
| C1 | 1 | alder | P025 | yes | 13/13 | 0 | 0 | 0 |
| C1 | 1 | rdra | P029 | no | 12/13 | NA | NA | 0 |
| C1 | 2 | alder | P019 | yes | 13/13 | 0 | 0 | 0 |
| C1 | 2 | rdra | P005 | no | 13/13 | NA | NA | 0 |
| C2 | 1 | alder | P058 | yes | 14/14 | 0 | 0 | 0 |
| C2 | 1 | rdra | P002 | yes | 13/14 | 0 | NA | 0 |
| C2 | 2 | alder | P036 | no | 14/14 | 0 | 0 | 0 |
| C2 | 2 | rdra | P022 | no | 14/14 | 0 | 3 | 0 |
| C3 | 1 | alder | P031 | no | 14/14 | 0 | 0 | 0 |
| C3 | 1 | rdra | P033 | yes | 14/14 | NA | NA | 0 |
| C3 | 2 | alder | P017 | yes | 14/14 | 0 | 0 | 0 |
| C3 | 2 | rdra | P010 | no | 14/14 | 2 | 4 | 0 |
| C4 | 1 | alder | P053 | yes | 6/6 | 0 | 0 | 0 |
| C4 | 1 | rdra | P056 | yes | 6/6 | NA | NA | 0 |
| C4 | 2 | alder | P001 | yes | 6/6 | 0 | 1 | 0 |
| C4 | 2 | rdra | P008 | no | 5/6 | NA | NA | 0 |
| C5 | 1 | alder | P018 | no | 21/22 | 0 | 0 | 0 |
| C5 | 1 | rdra | P051 | no | NA | NA | 1 | 0 |
| C5 | 2 | alder | P049 | yes | 22/22 | 0 | 0 | 0 |
| C5 | 2 | rdra | P059 | no | NA | 0 | 1 | 0 |

### s3

| case | rep | 手法 | ID | strict | 下流保持 | probe独自発明 | 無断決定 | 補完 | 未決漏出 |
|---|---:|---|---|---|---|---:|---:|---:|---:|
| C1 | 1 | alder | P007 | yes | 11/11 | 0 | 0 | 0 | 0 |
| C1 | 1 | rdra | P060 | no | 11/11 | 0 | 1 | 1 | 0 |
| C1 | 2 | alder | P003 | yes | 11/11 | 0 | 0 | 0 | 0 |
| C1 | 2 | rdra | P046 | no | 11/11 | 0 | 1 | 1 | 0 |
| C2 | 1 | alder | P055 | yes | 13/13 | 0 | 0 | 0 | 0 |
| C2 | 1 | rdra | P043 | yes | 13/13 | NA | 0 | 0 | NA |
| C2 | 2 | alder | P037 | no | 13/13 | 0 | 0 | 0 | 0 |
| C2 | 2 | rdra | P044 | no | 13/13 | 0 | 0 | 0 | 0 |
| C3 | 1 | alder | P034 | no | 13/13 | 0 | 0 | 0 | 0 |
| C3 | 1 | rdra | P041 | yes | 13/13 | 0 | 0 | 0 | 0 |
| C3 | 2 | alder | P039 | yes | 13/13 | 0 | 0 | 0 | 0 |
| C3 | 2 | rdra | P020 | no | 13/13 | 0 | 0 | 0 | 0 |
| C4 | 1 | alder | P015 | yes | 5/5 | 0 | 0 | 0 | 0 |
| C4 | 1 | rdra | P054 | yes | 5/5 | NA | 0 | 1 | NA |
| C4 | 2 | alder | P052 | yes | 5/5 | 0 | 0 | 1 | 0 |
| C4 | 2 | rdra | P050 | no | 5/5 | 0 | 0 | 1 | 0 |
| C5 | 1 | alder | P057 | no | 15/16 | 0 | 0 | 0 | 0 |
| C5 | 1 | rdra | P040 | no | NA | NA | NA | 0 | 0 |
| C5 | 2 | alder | P045 | yes | 15/16 | 0 | 0 | 0 | 0 |
| C5 | 2 | rdra | P014 | no | 14/16 | 0 | 0 | 0 | 0 |

### C5 資料のhandoff readiness

| rep | Stage | 手法 | ID | architecture追加必須 | 未承認architecture昇格 | readiness | 実装動作 |
|---:|---|---|---|---|---:|---|---|
| 1 | s1 | alder | P024 | False | 0 | 既存APIとschemaを保持し、再決定は未決として引渡しへの影響を示す | not_executed |
| 1 | s1 | rdra | P023 | False | 1 | APIの重要分岐は伝わるが範囲外の画面・データ構造を除く必要 | not_executed |
| 1 | s2 | alder | P018 | False | 0 | 主要フローと応答は揃うが既存schemaの列型制約を展開していない | not_executed |
| 1 | s2 | rdra | P051 | False | 1 | 分岐と既存制約はあるが統合フロー行のアクター不整合を要確認 | not_executed |
| 1 | s3 | alder | P057 | False | 0 | API分岐と回答反映は明瞭。schema列型制約は維持宣言だけ | not_executed |
| 1 | s3 | rdra | P040 | False | 0 | 業務分岐は読めるがHTTP値とschema詳細欠落、活動・画面対応に未確定箇所 | not_executed |
| 2 | s1 | alder | P021 | False | 0 | 既存制約と範囲を保持し、再決定判断を確認可能 | not_executed |
| 2 | s1 | rdra | P004 | False | 1 | API・分岐は概ね追えるがschema外属性と再決定の先決めで要修正 | not_executed |
| 2 | s2 | alder | P049 | False | 0 | 既存APIと列型制約、分岐応答を追跡できる。本人性の未決を維持 | not_executed |
| 2 | s2 | rdra | P059 | False | 1 | 応答と承認から購買引渡しの連続性を保持。schema逐語制約と追加社員モデルは要点検 | not_executed |
| 2 | s3 | alder | P045 | False | 0 | API分岐と応答、承認後引渡しは追える。schemaの列型制約は要約で欠落 | not_executed |
| 2 | s3 | rdra | P014 | False | 0 | 流れとHTTP分岐は有用。既存API入力の具体形・schema制約は欠ける | not_executed |

## 出力量

| case | rep | 手法 | s1 artifact bytes/files | s1 response bytes | s2 artifact bytes/files | s2 response bytes | s3 probe response bytes |
|---|---:|---|---|---:|---|---:|---:|
| C1 | 1 | alder | 3089/1 | 3936 | 2841/1 | 3428 | 3032 |
| C1 | 1 | rdra | 97430/27 | 0 | 66769/27 | 0 | 5435 |
| C1 | 2 | alder | 2959/1 | 3943 | 3333/1 | 4226 | 2154 |
| C1 | 2 | rdra | 105082/27 | 0 | 67546/27 | 0 | 5966 |
| C2 | 1 | alder | 6675/1 | 7498 | 6385/1 | 7200 | 3026 |
| C2 | 1 | rdra | 53555/27 | 0 | 79510/27 | 0 | 5234 |
| C2 | 2 | alder | 5278/1 | 6295 | 7013/1 | 7921 | 3462 |
| C2 | 2 | rdra | 81367/27 | 0 | 83586/27 | 0 | 4456 |
| C3 | 1 | alder | 4939/1 | 5609 | 6087/1 | 6933 | 2858 |
| C3 | 1 | rdra | 72397/27 | 0 | 63815/27 | 0 | 4471 |
| C3 | 2 | alder | 6066/1 | 6991 | 6304/1 | 6304 | 2893 |
| C3 | 2 | rdra | 73768/27 | 0 | 83578/27 | 0 | 3423 |
| C4 | 1 | alder | 3723/1 | 4483 | 3639/1 | 4256 | 3057 |
| C4 | 1 | rdra | 49418/27 | 0 | 53112/27 | 0 | 3714 |
| C4 | 2 | alder | 2749/1 | 3417 | 3503/1 | 4010 | 2425 |
| C4 | 2 | rdra | 39402/27 | 0 | 53666/27 | 0 | 2916 |
| C5 | 1 | alder | 5694/1 | 6509 | 4515/1 | 5215 | 3401 |
| C5 | 1 | rdra | 115658/27 | 0 | 77659/27 | 0 | 4784 |
| C5 | 2 | alder | 5001/1 | 5808 | 4744/1 | 5579 | 3078 |
| C5 | 2 | rdra | 86814/27 | 0 | 85580/27 | 0 | 3764 |

UTF-8 byte数。artifactとresponseには重複する本文があり、合算を意味量や品質点にしない。RDRAのs1/s2 artifactは完成した中間・最終資料を含む。s3はprobeのresponse本文。raw tool logやretry証跡の総量とは異なる。

## paired資料の範囲

| 分析 | s1 | s2 | s3 |
|---|---:|---:|---:|
| strict | 1 | 2 | 2 |
| source-clean探索 | 10 | 10 | 10 |

予定のpairは各Stage 10組。欠測・無効・未確定metricを0へ置換しない。総合点・総合勝敗・統計的一般化は行わない。
