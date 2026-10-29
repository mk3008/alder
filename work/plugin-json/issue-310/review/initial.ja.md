# 来訪案内 Business Design 読み取り専用レビュー

対象は `review-input/business-design.json` の package `package-3`、Business Design `b8a1e7e8-1b0e-4f17-88c8-f89b538d5b13` / `bd-3`（`alder-document-package/0.5`、BD schema `0.4`）。本文は日本語。原資料は `review-input/intake.ja.md` と `review-input/update.ja.md` のみ。これらは合意証拠ではない。

## 要修正（業務判断を追加せずに記述できる）

1. **来訪日の台帳記録が手順に現れない。** Activity `来訪案内を登録する`（`79289579-0a13-491c-9b9f-c80116a7d821`）の Step 1（`0b08d343-bb58-4c3c-986c-6f818de43f18`）は希望日と連絡先の登録のみを述べる。Step 2 は条件付きの希望詳細、Step 3（`e091d686-2744-40f6-9dad-1d68160404a2`）は台帳から来訪日と連絡先を読み戻して通知する。一方、台帳への共通Data `案内台帳の来訪案内`（`614a6e82-87bf-4248-81a3-c413b8d6e3cb`）は来訪日と連絡先を含み、同じDataが台帳へのOutput（`b6ff5b69-0460-4cd6-ba18-a1e8a5d5eb2c`）と台帳からのInput（`83e5e2d8-2c8f-4f50-8d15-de7f99b1107e`）に使われ、Result `80d0aec8-c1a0-46b7-b515-c5eeb0236638` は来訪日と連絡先の台帳記録を保証する。ヒアリングは「来訪日はこの業務では希望日と同じ日」と明記する。現状ではStep 3の読み戻す来訪日と正常Resultの出所を手順からたどれない。**修正案:** Step 1 に、受け取った希望日と同じ日を来訪日として案内台帳へ記録することを明記し、現在の台帳Output/InputとResultにつなぐ。既存の一つの `before` 規則以外の順序制約は加えない。これは原資料で決まった同日という意味を手順へ割り当てる記述修正であり、新しい業務規則の採用ではない。

## 確認できた範囲

- 文書Scopeは記録と通知まで、当日の応対を対象外とし、Activity名は仕事を識別する。When/Why/Where、4 ObjectのScopeとInformation、2 Role、1 Activityの2主体、3 Stepの担当・必須性・適用条件、局所順序、2 Result、4 Data、5 I/O関係、通知失敗の例外と対象Activityのopen Findingを原資料と照合した。
- `受付スタッフ`は一つのObjectとして `受付担当` と改名後の `案内担当` を兼任し、案内システムはRoleなし。利用者は主体ではない。希望詳細は届いた場合に必須で、明示されたStep 1→3のみを厳守順としている。台帳Outputと読み戻しInputは同じData IDを参照し、Informationの所有者は利用者と台帳で分かれている。
- `通知失敗`の扱いは例外とFinding `F01` で未決のまま保持され、失敗時に正常Resultを確定しない。これを解く業務判断やProblem/Painは追加しない。

## 検査と限界

- 使用したインストール済み Alder Plugin は `final-installed/plugins/alder/plugin.json` の `0.4.9`。レビューSkill、JSON管理Skillとその参照（構造、品質、相関、漏れ、JSON 0.5契約、Findings、操作ガイド、adoption section 1、provenance）を読んだ。同梱レビュー/JSON管理参照の pinned Alder source revision は双方とも `f2716613a1fb65236ac1c30ec1eab221ef576392`。提示されたPlugin snapshot revision は `47a458cef88bc17c242da23f74d79789566e563a`。外部コミットはアクセス・比較していない。
- 同梱 `author-cli.mjs runtime` は Node `v24.22.1`、`directJSON:true`（Python `3.12.14`）。`cli.mjs validate review-input/business-design.json` は `valid:true`、診断なし、32 entities。`author-cli.mjs inspect` は上記hash、`package-3`、`bd-3`、Checkなし。Schema/参照の成功はこの記述上の指摘を閉じない。
- `sha256sum` による対象BDの開始時と終了時のhashは双方 `741f88eb8ce891451c63c39d4e02b8800b094033314b466aee3a402c0895fc78` で、依頼の公開ピンと一致。intake は `fa561b97301b763be9a535775f044e66f3b4f89250e30442aa825527c663b506`、update は `5f3cbbe42fd1a80b1eeccb027e9c31d4df8c50172f68d4d74465f85914630bb6`。入力を変更していない。
- 更新前の正本、実運用、合意記録、Viewer表示は許可入力に含まれず、Role ID/色が改名前から実際に維持されたかは独立に証明できない。現在の参照整合と改名後の名前は検査済み。対象は単一ActivityなのでActivity間の引継ぎや受け側Exception Whenは存在しない。網羅的な未記載条件探索や業務意味の承認は行っていない。
