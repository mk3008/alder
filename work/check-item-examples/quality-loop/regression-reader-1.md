# Consistency review-only — 相談受付 Check 表示更新

対象：`regression-raw.md`（保存済み候補）、`quality-loop-packet/product/consultation/README.md`（業務設計全文、提示された公開ソース版 `8853a63101bb5968751986b0260bb8bc036505e2`）、同ディレクトリの `checks.md`（変更前）。Alder Plugin `0.4.8`、同梱 authority revision `a46427276070107d53066ee1282ac8b4a86b2ef2`。読み取り専用の独立レビューであり、人間の業務承認ではない。候補と原典は編集していない。

## 第1パス：宣言名、対応関係、単一本文

原典の宣言構文と表示名を分けて照合した。`README.md:12` の `# Activity 相談を受付する` は ActivityName `相談を受付する`、`:34` の `# Activity 次の連絡方法を説明する` は ActivityName `次の連絡方法を説明する`。候補の索引で抽出した生のリンク表示は順に `相談を受付する`、`次の連絡方法を説明する`（`:7–8`）、H2 の生文字列も同順・同字（`:10,80`）。接頭語を表示名から後処理で削らず、文字列が一致した。索引は所定の日本語4列で、Activity 行から H2 と各 Check 本文へ直接リンクする。H3 は `C-01`～`C-04` が各1回で、主本文とレビュー状態も各1件（`:12–14,54–57,82–84,104–106`）。目視の GitHub 見出し slug と記載 fragment は一致する。

| Check | 自身の保証が属する Activity | 必要な索引・節参照と候補の実際 |
| --- | --- | --- |
| C-01 | 相談を受付する（受付条件成立時、その相談が受付済み） | 第1行→C-01、同 Activity H2 配下の単一本体。後段への依存は C-01 自体を後段にも共有させない。候補`:7,12,51`。 |
| C-02 | 相談を受付する（不成立時の未決） | 第1行→C-02、同 H2 配下、種別と要確認が同一本文。候補`:7,54–65`。 |
| C-03 | 次の連絡方法を説明する（受付後の説明結果） | 第2行→C-03、同 H2 配下、単一本体。候補`:8,82–92`。 |
| C-04 | 次の連絡方法を説明する（その相談の依頼者という対象同一性） | 第2行→C-04、同 H2 配下、単一本体。候補`:8,104–114`。 |

原典 `README.md:28,32,42,50,54` から、受付済みが後段の開始条件である接続はあるが、C-01 の受付結果そのものは後段 Activity にまたがる共有 Check ではない。C-03/C-04 も前段への共有参照を要しない。欠けた共有参照は見当たらない。索引の目的と接続は `README.md:16,32,38,42,50` と対応する。

## 第2パス：一般条件・入力から結果へ

- C-01 の主条件 `:18–25` は登録済み、本人 **または** 委任済み代理人（両資格併存可）、非停止、同じ暦の日付で0～30日両端を含む条件を保持し、操作 `:27` は受付担当者が利用者・資格・両日付・相談内容を受け取って確認する。主結果 `:29,31` は**その相談**を受付済みとし、サンプル `:39–41` の A/B/C、0/30/1日だけに一般保証を限定していない。`README.md:7–8,20,24,28,32` と整合する。31日目の結果を逆含意から決めない表現 `:31` も妥当。
- C-02 は原典 `README.md:9` の不成立時の応答、記録、再申請という未決を主結果と種別で保ち `:56–65`、31日目の具体例 `:69` を未決のまま示す。希望日変更は別の未決として `:73` に残る。保留済みの質問を再質問していない。
- C-03 は `README.md:42,50,54` の受付後、その相談の依頼者、担当窓口と次の連絡方法という入力／相手／結果を主条件・操作・結果 `:88–92` に保持する。A のサンプル `:96` は一般条件を A のみに狭めず、固定文や自動理解判定を追加しない。
- C-04 は `README.md:42,50` の対象同一性を主結果 `:114` に、A の依頼者甲と B の依頼者乙という比較を例 `:118` に示す。甲への A の案内が乙への B の案内で代替できないことを具体化している。ただし下記の時点条件を確認されたい。

## 所見

**NG（適用する記述ルールへの不適合）**：C-04 の主条件 `regression-raw.md:110` は「担当者が相談の依頼者に案内するとき」で、原典 `README.md:42` が置く「相談の受付後」を書いていない。サンプル `:118` も A の受付後を明示しない。Check の正確な条件・前後時点を主表示に置くという `check-item-traceability.md` の「Conditions, expressions and examples」に照らし、受付前にも同じ期待結果が適用されるように読める。原典の確定範囲で C-04 の条件を受付後に限定できる。既存 `checks.md:42` にも同じ省略はあるが、以前からの省略は原典との照合を免れない。`要修正` の状態を保持し、意味の再承認とみなさない。

**原典の別保証のカバレッジ差（今回の表示更新へ黙って追加しない）**：原典 `README.md:32` は「その相談が受付済み」**かつ**「担当者が相談対応の対象として扱える」を Result に置く。候補 C-01 の主結果 `:29,31` は前者のみで、後者は索引の接続説明 `:7` と参照情報 `:51` に暗示されるだけで観測可能な主期待結果にはない。旧 `checks.md:11,16` も前者のみだったため、これは今回削除された保証ではない。表示だけの更新では Check の範囲を勝手に広げず、別途レビュー可能な不足期待として報告する。担当者が扱える状態の独立 Check を設けるか、その保証の扱いを人間が確認する余地があるが、原典自体の意味は未決ではない。

**未決（業務意味）**：C-02 の不成立時応答・記録・再申請と希望日変更は原典 `README.md:9` の未決のまま。候補 `:65,69,73` は期待値を確定せず、既存の保留・再質問しない旨を保持する。ここを NG や C-01 の確認済みの取り消しにしない。

**任意の文言確認**：C-03 の参照情報 `:102` は既存 `checks.md:38` と同じ「説明内容を判定する自動方式は未決」と書く。原典 `README.md:50` は「固定の説明文や自動理解判定は規定しない」とする。対象外の具体方式について決定待ちが必須という印象を避けるなら「規定しない」に揃えるとよい。今回の意味保持上、単なる文言提案として扱う。

## 更新前との照合・限界

ID C-01～C-04、各状態（確認済み／要確認／未レビュー／要修正）、C-02 の種別・保留・未承認、C-04 の人間フィードバック、C-01 の Test `test_acceptance::test_inclusive_window` と最終実行結果未収集、C-02/C-03 の Test 未収集、C-04 の既存証拠なしが残る。旧 C-01 の条件・結果・AI確度・関連業務も保持。C-03 の説明対象と両説明事項も保持。新サンプルはテスト実行の証拠ではない。`C-01` の確認済みはテスト証拠の未収集と両立する。

候補の相対原典リンクは配置上 `quality-loop-runs` から `quality-loop-packet/product/consultation/README.md` を指す。公開コミットの内容一致、リンク先 GitHub の公開到達性、Markdown レンダラでの実クリック、既存 Test の実体・assertion・実行結果、外部からの fragment 参照、業務担当者による新規確認は行っていない。根拠は指定された提示ファイルの行と同梱 guidance に限る。修正後の再レビューも未実施である。

## レビュー設定・依頼記録

Fresh agent の要求モデル・effort は、この子エージェントに渡されたメッセージからは確認できない。実効ランタイム設定を独立検証したとは主張しない。親から渡された依頼全文：

> Run the alder-draft-check-items Skill's Consistency review-only on saved candidate /workspace/scratch/0261bb5be107/quality-loop-runs/regression-raw.md. Source whole BD: /workspace/scratch/0261bb5be107/quality-loop-packet/product/consultation/README.md. Previous list: /workspace/scratch/0261bb5be107/quality-loop-packet/product/consultation/checks.md. Actual feedback: add Japanese conditions/useful logical expressions/concrete input-result samples to discuss meaning; do not force tables onto narrative explanation; preserve guarantees, boundaries, IDs, review states, existing Test reference/untested status, shared reference, deferred question/no reasking, unresolved responses. Read /workspace/scratch/0261bb5be107/quality-loop-packet/AGENTS.md and the Skill at /workspace/scratch/0261bb5be107/quality-loop-packet/plugins/alder/skills/alder-draft-check-items/SKILL.md and its required bundled references. Pinned public source 8853a63101bb5968751986b0260bb8bc036505e2; plugin 0.4.8; authority a46427276070107d53066ee1282ac8b4a86b2ef2. Two source-led passes required: (1) extract literal declared ActivityName values and compare raw displayed index labels/headings, then establish required Check-to-Activity references and single bodies/states; (2) trace general source input/condition-to-result guarantees into primary text separately from examples, retained values and scope. Then unresolved logic, IDs, states, references, old guarantees/supporting detail/Test evidence. Report concrete evidence, NG vs undecided vs suggestion, and unperformed checks. Read-only: do not edit candidate or packet. Do not read purchase BD/docs/examples, defective checks, other outputs/reports/specimens/answers/root issue/tests/implementation/network/files outside packet except candidate and your own report. Save your report at /workspace/scratch/0261bb5be107/quality-loop-runs/regression-reader-1.md. Do not recursively review.
