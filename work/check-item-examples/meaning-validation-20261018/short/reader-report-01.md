# Consistency review-only — short / candidate-01

## 依頼全文

> Alder SkillのConsistency review-onlyを実行。入力は /workspace/scratch/0261bb5be107/meaning-packets/short と /workspace/scratch/0261bb5be107/meaning-runs/short/candidate-01.md のみ。AGENTS.md、plugins/alder/skills/alder-draft-check-items/SKILL.mdと必須guidance、work/check-item-examples/meaning-validation-20261018/short/source.md全体を読みcandidateを読取専用レビュー。公開入力/Skill版75fb043568ade8b442853421a0bc78ef999b23e1、authority b3113b7c0b6915562f0ebd6892e01199510cf319。規約適合、一般保証と例、参照、未決と状態を検査し具体source/artifact対応を示しNG/原典未決/任意提案/未実施を分離。/workspace/scratch/0261bb5be107/meaning-runs/short/reader-report-01.mdに依頼全文・入力hash・要求gpt-6-sol medium fork none（実効設定attestationなし）・実行診断と未検証を記録。候補・packet編集/修復、人間承認、再委譲禁止。完成見本・作者点検・過去評価・他出力/packet・実装/テスト・会話履歴・ネットワーク禁止。

## 入力・版・実行境界

- 公開入力／Skill版：`75fb043568ade8b442853421a0bc78ef999b23e1`（依頼指定）。Alder authority：`b3113b7c0b6915562f0ebd6892e01199510cf319`（同梱 `provenance.json` と一致）。同梱Plugin版 `0.4.8`。
- 要求された実行設定：`gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。独立した新規readerとして依頼された。実効モデル・effort・fork設定をこちらから証明するattestationは利用できない。
- SHA-256：`AGENTS.md` `29b2c0fe7b5da19414f3a274eb8f4780fd2b4b2e89627a8a1bd8e66a3611bf7f`、`source.md` `34f595ee693d839b7d05a614c94cf2a0f6dd9daf603f11da264f832adc69b754`、`SKILL.md` `aab470d8e289a1dd65ae6ab75a231ee171f519cd12a49316ed0660074d12d8d4`、`check-item-traceability.md` `7470dc6123fd4fa0e19e864d67eb1e8f5a8c53ab1653d056dfdaeecb9cdb2ce6`、`adoption.md` `2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3`、`candidate-c3.md` `a5c3874601d70edf87e1fc79b5501be80c35aa4f98d3870a545b79f4867f8446`、`candidate-01.md` `ed4c519d197d456e18a33d47f382abe7636825d94c14f176ec80301251f11c67`。packetの `input-hashes.json` と該当同梱入力hashは一致。
- 読んだ範囲：指定packetのAGENTS、Skill、同梱のcurrent traceability全文、adoptionの必要範囲（Check設計からoptional Functional Interfaceまで）、初稿用c3、provenance、manifest、結果返却guidance、`source.md`全文、および指定候補。禁止された他の出力・評価・実装・テスト・ネットワークは参照していない。

## 原典からの照合

1. **名前と参照。** 原典 `source.md:5` の宣言は文字どおり `# Activity 出荷対象を見直す`。候補のindex表示 `candidate-01.md:7` とActivity見出し `:9` はどちらも `出荷対象を見直す` で一致する。原典のActivityは一つで、C-01の保証と、C-02/C-03の未決事項はそのActivityに属する。4列indexのC-01～03直接リンク、H2 Activity、各H3の単一ID／状態は `:5-7,9,29-55` で確認した。宣言名の診断を同梱 `check_activity_names.py --design .../source.md --checks .../candidate-01.md` で実行し、exit 0、`status: match`、declared/headings/indexが同じ文字列、mismatches/target_issuesは空。診断は意味やリンクを証明しない。
2. **一般保証。** 原典 `:8,11,14,17,20` は出荷担当者による注文の取消状態と対象の照合、および取消済み注文の除外・照合後の対象外を定める。候補 `:11,15` の一般定義は、対象注文の取消済み条件、照合という行為、照合後にその注文が含まれない結果を保持する。照合前に対象に含まれていても除外するという `:15` の補足は原典 `:17` に対応する。C-01 `:29-35` は同じ保証を指し、有限例だけに保証を閉じていない。これは非取消注文の含有・出荷可否まで保証しない（原典 `:20`、候補 `:15,41`）。C-02/C-03は一般的な確定結果のCheckではなく、未決を明示する候補である。
3. **例の観測差。** 候補 `:19,21-27` の全行で共通の照合行為と注文ID、取消状態、照合前後の対象状態を明示する。甲は取消済み・事前に含有→事後に除外、乙は取消済み・事前に対象外→事後も対象外で、原典 `:17,20` の除外結果が異なる事前状態を通じて成立することを示す。丙は非取消・事前に含有→事後の扱い未決で、甲乙の保証から逆方向に出荷可否を導けない境界を示す。丙は確定した合否観測例ではないが、原典の未決 `:20` と矛盾せずC-02に対応する。甲へのC-03リンクは誤登録を示すだけで、通知等を観測済みと主張していない（候補 `:23,51-52`）。甲乙の対象外という結果だけでC-03の通知等を満たしたとは判定しない。
4. **根拠・状態。** 候補の原典参照 `:34,44,54` のローカル行範囲は、それぞれWhy/How/Result `source.md:7-20`、Result `:19-20`、How/Result `:16-20` を含みラベルと整合する。日本語の業務用語、C-01の未レビュー、C-02/C-03の要確認・明示未決・未承認、Test未収集の別扱いは `candidate-01.md:31-55` に見える。原典 `:20` が取消状態の変更方法と自動処理方式を規定しないことについても候補は方式を追加していない。

## NG（適用規約に対する修正対象）

- **C-01の一般保証の重複定義。** 同梱Skillの「条件・期待結果を一度」「一般保証をActivityの共有文に一度定義し、各Checkから明示参照」、traceability `§3 Conditions, expressions and examples` および `§7 Before returning` に対し、候補 `:15` で条件・照合後の対象外を定義した後、C-01 `:32` が「対象は照合した取消済み注文であり、照合後は出荷対象に含まれない」と同じ条件・結果を再定義している。IDから `#共通の保証` へのリンク自体はあるので保証欠落ではない。単一の定義への参照を明確にし、重複文の扱いを作者が直せる表示上のNGであり、業務意味の追加判断や人間レビュー状態の変更は不要。

## 原典で未決の業務判断（NGとは別）

- **C-02：** 原典 `source.md:20` は非取消注文の出荷可否を未決とする。候補 `:25,37-45` は自動的な含有・出荷可能を保証せず、要確認と問いを維持する。出荷可否の判断条件と対象への反映を決めるなら、業務設計の人間確認が先になる。
- **C-03：** 原典 `:20` は照合前に誤って対象だったときの通知・記録・回復手順を未決とする。候補 `:23,47-55` はC-01の除外だけを確定し、その後の措置を未承認としている。行う範囲、相手、内容、時機を業務設計側で決める必要がある。ここで行う／行わないをレビュー者が採択しない。

## 任意提案（NGではない）

- C-01 `:32` を修める際、共通保証への参照と甲乙への参照だけで固有の範囲を一意に読めるか確認するとよい。丙 `:25` は未決境界の例であると現状のまま明確だが、後の人間レビューで必要なら事前対象外の非取消注文も比較して「自動追加を導かない」を見やすくできる。これは原典にない事後結果を決める提案ではない。

## 未実施・検証限界

- GitHubの公開固定URLが当該commitで実際に解決すること、遠隔の内容が同梱sourceと同一であることはネットワーク禁止により未検証。根拠ラベルと行範囲は同梱sourceでのみ照合した。
- Markdownの実レンダリング、GitHubのUnicode断片リンクの実動作、人間の読解・承認は未検証。本文の見出しとリンク文字列は静的に照合した。名称診断のexit 0をこれらの証明とは扱わない。
- 実装・Test/assertionは入力禁止で未読。候補自体がTest未収集と記すため、Test mappingの意味一致・網羅や運用効果は評価していない。更新前のCheck、フィードバックが指定されていない初稿なので旧保証の差分監査は対象外。
- 候補とpacketは編集していない。修復・再レビュー・人間承認は実施していない。上記NGが残るため、全項目適合のpassとは報告しない。
