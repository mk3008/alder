# Issue #103 Phase 0 — current-state ベンチマークの固定条件

本記録は #99 の `design/v4.md` を修正せず、別の比較用 copy を作る。実在団体の合意ではなく、synthetic customer が確認した現行業務・既に決めた将来業務を分けて記す。横断 Problem の解決方法を Authoring 段階へ持ち込まない。

入力を固定する研究ブランチ revision は `691994afd9c602d4f739bc2b751e14fc10e91205`。#99 の v4 SHA-256 は `253b8226880a3055bd6d1233e400fcf0f108f995dfa9a97087ed06a7144c777e`、scenario は `8a5c2b4e901592dc85da3a972acc41b5fe3b07fa9a5c70a2cadb22345b6411c9`、transcript は `6336ed4f0f831ba32f0802eb66e02ad3b498f08089b279557b0f0102500192e6`、oracle evaluation は `ea6eec487f971edb16040e58be0a7f638b2e1de0a5cf84715040ca20c71e0d89`。これらおよび #101/#102 raw は変更しない。

1. 顧客役は Fresh (`gpt-6-sol` / `medium` / `fork_turns: none`)。#99 scenario、transcript、v4 のみ業務資料として読み、`customer-prompt.md` の中立な事実確認に回答する。Oracle、Discovery raw、Optimization 案と本件評価基準は見ない。現行・決定した将来業務・未決・未確認を区別し、解決策や Pain を創作しない。
2. 顧客回答を raw として固定後、別 Fresh Designer (`gpt-6-sol` / `medium` / `fork_turns: none`) に v4 の copy、顧客回答、Authoring Skill 0.2.6 の copy、保存先指示だけを渡す。既存 v4 を全編書き直す必要はない。source fidelity と相関に必要な最小改訂を行い、草案全体を synthetic current-state benchmark draft / confirmed facts と明示する。未知の優先順位・共通予約方式・承認者は確定しない。negative control の3種類の確認を保持する。Designer は #99 oracle、Discovery raw、#103 の比較評価を読まない。
3. Designer が重要な質問を返したら、顧客役に一度だけ中立な事実回答を求め、同じ Authoring Skill で改稿する。未決ならそのまま停止する。raw、差分、read log、全 prompt、hash を保存する。完成時に root が source と fidelity を確認し、比較入力を別 commit で固定する。

旧 raw の物理的隔離やモデルの実効設定は shared filesystem 上では証明できない。ハッシュは比較するファイルの同一性を示すだけである。
