# #104 独立評価

**判定：H5（入口の必要性は識別不能）。** この合成事例では、既知の改善対象には直接 Optimization Review が適合し、未知の入口では Structural Discovery が人の調査対象を追加で示した。ただし、Discovery の手掛かりは Authoring 後の設計書に既に明記されていた。K と U3 に渡した Problem も同じ範囲ではない。したがって、Discovery を常に前置すべきだという因果的な結論は出ない。

## 固定と比較の確認

`oracle-revealed.md` の SHA-256 は `d8443346e2bf6c9f414ec304a4135c24d067ad78d97260381566004a9fb18308` で、事前の `oracle-commitment.sha256` と一致した。commitment は `d9d6cd9`、K・U1・control の raw は `c5ab374`、U3 の raw は `78a7895` で固定され、oracle の開示はその後の `ba1d915` である。`78a7895` は `ba1d915` の祖先で、前者には開示ファイルがない。これは記録上の固定順序を裏付けるが、共有ファイルシステムでの完全な情報遮断や requested model の実効設定までは証明しない。

## 比較軸 A〜G

| 軸 | 評価 |
|---|---|
| **A. Route fitness** | K は与えられた保存条件の Problem に絞り、企画・回答時の早期照合（候補1）と、条件更新から進行中の計画・回答への影響確認・連絡（候補2）を提示した。U1 は Problem を与えられず、期間の相互約束（Observation 1）と保存条件の時間差（Observation 2）を観察した。両入口とも、その入力に対する仕事は概ね適切である。 |
| **B. Known 時の Discovery 必要性** | K は Discovery を前置せず、oracle の主要論点である両側の早期判断と変更連絡に直接届いた。保存担当の条件判断と展示・貸出の許可を分け、後段の現物確認も残した。この既知 Problem に限れば、前置 Discovery の必要性は示されない。K が Observation 1 の期間相互照合を扱わないのは、その Problem の対象外だからであり、K の欠落とは数えない。 |
| **C. Unknown 時の Discovery value** | U1 の Observation 2 は oracle に沿って、保存条件の更新後、進行中の企画・回答への伝達を問うた。Observation 1 は oracle とは別の、同じ資料番号に関する展示会期と貸出期間の相互確認を発見し、人間が調査対象として確認した。これは局所的な問いの発見価値である。一方、設計書の「未決定・未確認の事項」に双方の手掛かりが既に明記されており、手掛かりなしの未知問題を発見した証拠ではない。 |
| **D. Optimization の主要作用点の収束** | U3_2 は保存条件変更時の引き渡しと、案件担当が節目で照合する案を出し、K 候補2の「更新から既存案件への影響確認・連絡」と重なる。だが U3_2 の Problem は変更後の影響・伝達に限定され、K 候補1の企画・回答**前**の照合は求めていない。U3_1 は別の期間相互照合に対し、約束前の相互確認と共通予定管理を出した。したがって関連する部分での収束はあるが、K と U3 全体の完全な収束とは評価できない。 |
| **E. 専用 Structural Optimization の必要性** | **この事例では立証されない。** U1 が観察を人へ返し、人が1・2を調査対象として確認した後、既存の Optimization Review がそれぞれ具体的な責任・時点の代替案を出した。横断範囲を扱うために別の専用 workflow が不可欠だった形跡はない。ただし、一般的な不要性まで示す結果でもない。 |
| **F. False positive / negative control** | K と U3 は館内企画承認と対外貸出承認を統合せず、設営時と梱包前の異なる確認も消していない。独立した講演会 control は Observation **0件**とし、共通の講演会名だけで統合対象にしなかった。U1 の Observation 3 は「経路が未定義」と断定しており、原資料の「未確認」より強い。人間は事実不足として保留した。Observation 4 の Evidence は返却照合結果を保存担当へ「伝える」と記すが、その伝達方法・事実は入力から確認できない。これも人間が保留した。探索の候補を人間が留保する安全弁は働いたが、U1 自体に過剰な記述がある。 |
| **G. Human agency** | 人間役は Observation 1・2を「調査して改善要否を検討する対象」とし、失敗の発生を認定しなかった。最初の回答では Problem 文がなく、その後の明示的な確認で両者を U3 に渡した。3・4は保留した。K・U3も採否、承認順序、変更権限、借受館への連絡、約束の意味を人へ残し、実測のない便益を条件付きで記述した。暫定 Medium は実測の痛みを意味しない。 |

## 交絡と限界

K の Problem は「企画・回答時の保存条件照合」と「保存条件変更後の連絡」の両方を含む。U3_2 は後者に限り、U3_1 は別論点である期間相互照合を扱う。K と U3 の候補数や網羅範囲をそのまま勝敗として比較できない。また、Authoring Skill による追加質問と設計書の未確認事項の明記が U1 の発見を助けた。Discovery 固有の効果と、先行する良質な Authoring の効果を切り分けられない。

確認された「Problem」は現行業務の失敗、競合、連絡漏れを実証したものではなく、**運用実態を調べる対象**である。oracle も後段の設営・梱包確認と不適合時の相談がある現行業務を前提としている。候補の期待便益、負担、難度、実行可能性は測定されていない。単一の合成事例であり、一般の組織や全 Business Design への成績は推定できない。

H1 の条件のうち、K の対応、U1 の観察、人の確認、関連部分の U3 収束、negative control の保持は観察された。しかし入口の**必要性**を識別するには、K と U3 の範囲差と設計書に露出した手掛かりが大きい。H2（K の重要な欠落）、H3（U1 固有の価値なし）、H4（多数の根拠薄い Problem や意味破壊）を主判定とする証拠も不足するため、事前条件に沿い H5 を選ぶ。

次に人が確認すべきなのは、企画・回答時に既に何を照合しているか、同一資料の期間競合と条件変更の実例・頻度、承認と対外的な約束の時点、変更の判断権限と連絡責任である。その結果によって候補を採らない判断もあり得る。

**読取パス：** `work/optimization-comparison/issue-104/evaluator-prompt.md`、`protocol.md`、`scenario/customer-role.md`、`authoring/customer-raw.md`、`authoring/customer-followup-raw.md`、`authoring/design.md`、`authoring/quality.md`、`phase1/conditions.md`、`phase1/human-confirmation-raw.md`、`phase1/human-clarification-raw.md`、`runs/{k,u1,control,u3_1,u3_2}/{prompt.md,raw.md}`、`oracle-revealed.md`、`oracle-commitment.sha256`（いずれも `work/optimization-comparison/issue-104/` 以下）、`docs/optimization-review.md`。加えて上記ファイルに関する Git 履歴、tree、SHA-256、作業ツリー状態を読み取り専用で確認した。ファイル変更なし。
