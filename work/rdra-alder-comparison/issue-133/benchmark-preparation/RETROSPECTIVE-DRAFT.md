# 実行ふりかえり草案

結果確定前の作業記録。正式Alder仕様の変更や一般的な手法優劣を決定する記録ではない。

| 発生したこと | 今回の扱い | 次回の改善候補 |
|---|---|---|
| native CLIがなくpreflightが失敗した | 07:32の明示決定に従い、公式DAGを維持したWork Fresh呼出し置換へ進んだ。nativeと同一とは呼ばない | 実行環境の可否と比較方式の選択を実験開始前に分けて記録する |
| AI node数の初期認識と公式scaffoldingに誤りがあった | 最終freezeは18 AI node。元script失敗と6 scripts再実行の原記録を保存した | 出力を生成しないpreflightでDAG node数とscript前提directoryを確認する |
| wrapperの自己生成output検証read許可が非対称だった | 厳密条件を遡及的に合格へ変更せず、source-clean探索分類を別に保存した | 両手法で同一のinput/own-output検証許可を先に固定する |
| read-logだけでは非存在path試行を見落とした | metadata/finalに残った診断も含めて再監査し、元のall-pass報告を訂正した | 成功した取得、失敗したpath試行、自己生成output検証を別fieldで記録する |
| strict違反後に元DAGの残りが止まった | 原失敗snapshotを保存し、正しい既存outputを再生成せず予定DAGを探索的に完了した | strict分類と完成資料の補助観測を別の状態として管理する |
| Stage2全体とprobeの実受領資料の範囲が異なった | 原採点attemptを保持し、実受領packetだけのcanonicalを別Fresh抽出した。同一byteは再利用証明を残した | 直接評価用とhandoff用canonicalの範囲を初回採点前に区別する |
| 採点のraw-check flagsが別judgeで変わった | 初回・retry双方の全claimsをledgerへ保存し、局所原文引用で対応を確認した | flagの追加・解決・原文の曖昧さをclaim ID単位で追跡する |
| 未決発見と具体的質問の採点が混同された | 固定rubricに照らしてevaluatorへ確認し、operatorによる点数修正を避けた | 指標間の証拠要件を実行前のschemaに明示し、同じ意味を二重計測しない |

| canonicalの完全ファイル保存後も最終応答が全文を返さなかった | payload検証成功とstrict配送不合格を別記し、元finalと追加turnを保持した。完全payloadだけ探索観測に使う | 保存ファイルを正式返却とする契約を先に固定し、実際の本文欠落と配送形式を分ける |
| Handoff入力コピーのskip処理が準備allowlist追加もskipした | Fresh子の起動前に検出し、元準備物と修正版を保持した。未許可入力で採点しなかった | 存在確認とallowlist作成を独立させ、dispatch前に全入力hashと可読pathを照合する |
| 依存資料準備前に最後のRDRA nodeを1件起動した | 直ちに停止し、未提供入力・原応答・artifactなしの証跡を保存した。正式nodeは準備後の別Freshで実行 | envelope完成、依存hash照合、dispatchの順を機械gateにする |
| GitHubの進捗が古く、Chatから停止扱いされた | 全20 workflow完了のcheckpointを保存・再取得し、Issue Currentを更新した | 長い実験では保存checkpointと実状態の差を明示し、外部から復帰できる進捗を残す |

| P050のcanonical引用1件が指定物理行と一致しなかった | 原mechanical failureをsnapshotし、同一packet/prompt/settingsだけの別Fresh抽出を実施した。元業務成果物と原抽出は保持 | 引用/行の機械gateと配送形式gateを分け、計測payload retryを生成rep追加と区別する |
| P008の引用が単語中心だった | 原canonicalを保存し、機械quote存在確認では意味解釈まで証明できない限界を中立に伝えた | 行範囲と文脈を含む引用契約を開始前に明確化する。今回へ遡及適用しない |

共有filesystemの手続的隔離、自己申告read-log、実効model設定の独立証明不在は今回の保存方法では解消できない。次回改善候補を今回の条件へ遡及的に適用しない。
