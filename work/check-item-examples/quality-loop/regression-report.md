# 相談受付 Check 表示更新 — 回帰実行記録

## 結果と対象

最終候補は [regression-repair-1.md](regression-repair-1.md)。`C-01`～`C-04` の既存範囲に、日本語の条件、役立つ論理表現、具体的な入力・結果のサンプルを加えた。C-01 は比較が有用な日付・資格の表、C-02～C-04 は短い場面記述とした。初稿 [regression-raw.md](regression-raw.md)、読者の初回報告 [regression-reader-1.md](regression-reader-1.md)、修正後報告 [regression-reader-2.md](regression-reader-2.md) を別々に保存した。原典・旧リストは編集していない。最終候補は人間の新規承認を意味しない。

読み取り対象：`/workspace/scratch/0261bb5be107/quality-loop-packet/AGENTS.md`、`product/consultation/README.md` 全文、`product/consultation/checks.md` 全文、同 packet の `plugins/alder/skills/alder-draft-check-items/SKILL.md` とその必須参照・provenance・plugin.json。更新検証では `/workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/SKILL.md` と同梱診断を使用した。旧 guidance の `check-item-traceability.md` と `adoption.md` の SHA-256 は更新バンドルでもそれぞれ `413d5db2d02ac3390427c2f58370d2ae532f827489fff89180037fa5fa484721`、`2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3` で一致する。提示された公開業務設計ソース版は `8853a63101bb5968751986b0260bb8bc036505e2`。初回 plugin 0.4.8／authority `a46427276070107d53066ee1282ac8b4a86b2ef2`、最終検証の公開 bundle `be8d23aa331d61ffe10934f86190172726a5db78`／authority `0986ae5c67efeed0797f3f78083f81ac12dbe047`。作業ツリーの厳密な入力範囲は上記の2製品ファイルと guidance であり、公開コミットとのバイト一致は検証していない。

## 初回所見、判断、修正

初回の別読者は原典 `README.md` の `# Activity` 宣言名を生の索引ラベルと H2 に照合し、2件とも一致、4 ID の単一本体と必要な Activity 参照を確認した。一般保証はサンプルと別に検査し、C-01 の0～30日・両端、本人または委任済み代理人（両立可）、非停止とその相談の受付結果を確認した。C-02 の未決応答を31日目の例から決めていないことも確認した。

読者の NG は C-04 の主条件に原典 `README.md` の「相談の受付後」が欠ける点だった。原典の「次の連絡方法を説明する」When に照らして支持されるため、修正版では C-04 の主条件と例に受付後の時点を追加した。旧リストにも省略はあったが、今回の正確な条件表示で修正した。ID・`要修正` 状態・期待結果は変えていない。修正差分は raw と repair-1 の2行だけである。

原典 Result の「担当者が相談対応の対象として扱える」は旧 C-01 の主期待結果にもなかった。これは今回削除した保証ではなく、既存の限定されたリストに対する別のカバレッジ論点。表示更新に黙って追加しなかった。C-03 の既存補足「説明内容を判定する自動方式は未決」は、原典の「自動理解判定は規定しない」との文言差がある。読者は任意の文言提案と分類したが、既存補足を今回の表示変更で消さず、業務結果やテスト判定の条件にも昇格させていない。

## 最終検証

更新 Skill の読み取り専用診断を、業務設計全文と保存した `regression-repair-1.md` に実行した。終了コードは `0`、`status: match`。生の `declared`、`headings`、`index` はいずれも `["相談を受付する", "次の連絡方法を説明する"]`、`mismatches` は `[]`。初稿にも同じ診断を実行し、終了コード `0`／同じ値だった。この狭い診断だけで保証や共有参照を判定していない。

別読者は更新 Skill による実際の保存版再レビューを実施した。原典の宣言名・必要な参照・一つの本文と状態を抽出し、次に各原典の一般条件→結果を主条件・期待結果に照合してサンプルの限定値と区別した。C-04 の時点修正を確認し、今回の表示更新範囲の記述ルール NG は見いださなかった。著者も最終保存版の見出し、ID、状態、原典相対リンク、raw との差分を再読した。GitHub の実レンダリングと公開 URL の到達性は未検証。

全範囲の保持確認：ID `C-01`～`C-04`、人間状態 `確認済み／要確認／未レビュー／要修正`、C-01 の既存根拠・明示・AI確度高・後段関連、`test_acceptance::test_inclusive_window` の0日と30日対応および最終実行結果未収集、C-02 の原典未決種別・候補未承認・保留済みで再質問しない旨・テスト未収集、C-03 の根拠・明示・テスト未収集、C-04 のフィードバックと既存証拠なしが残る。前段の受付結果から後段へ接続する参照はあるが、前段 Check を後段 Activity の共有 Check と誤認して複製していない。希望日変更は別の未決として保持し、受付条件不成立時の応答・記録・再申請を確定していない。未収集の Test 証拠を C-01 の確認済み状態の否定に使っていない。

未解決の人間判断は原典で未決の不成立時応答・記録・再申請方法と希望日変更。前者の問いは明示的に保留済みなので再質問しない。C-04 は表示を修正しても `要修正` のまま。原典の別保証を Check として追加するかは今回の限定更新とは別に検討可能であり、この報告で新たな業務決定を求めない。

未実施：公開ソース版とのバイト照合、GitHub レンダラでの fragment 実クリック、外部からの既存 fragment 参照、Test 本体・assertion・実行結果、実装、人間による意味確認。診断は名前の狭いプロファイルのみ。Fresh reader は依頼時に `gpt-6-sol`、effort `medium`、`fork_turns: none` を指定したが、実効設定を独立検証したとは主張しない。著者は `/root/quality_regression`、別読者は `/root/quality_regression/fresh_reader`。

## 受領した全タスク文（原文）

```text
Use existing alder-draft-check-items Skill at /workspace/scratch/0261bb5be107/quality-loop-packet/plugins/alder/skills/alder-draft-check-items/SKILL.md on small synthetic Business Design product/consultation/README.md and update priorlist product/consultation/checks.md. Read packetAGENTS/allrequiredguidance/fullBD/list. Publicsource8853a63101bb5968751986b0260bb8bc036505e2, plugin0.4.8, authoritya46427276070107d53066ee1282ac8b4a86b2ef2. Feedback: add Japaneseconditions/useful logicalexpressions and concreteinput/result samples to discussmeaning; do not force tables onto narrative explanation. Preserve guarantees, boundaries, IDs, reviewstates, existingTestreference/untestedstatus, sharedreference, deferredquestion (no reasking), unresolvedresponses. Use Skill distinct Consistency review/repair: explicitlyauthorized to spawn one Fresh read-only reader gpt-6-sol/medium fork none using ownsavedcandidate/fullBD/priorlist/feedback/sameguidance only, noanswers/specimens. Preserve raw and allrepairedrevisions separately /workspace/scratch/0261bb5be107/quality-loop-runs/regression-*.md; afterrepairs rerunreader; validatefindings againstsource beforeediting. Save regression-report.md with fulltaskpromptverbatim, own andreaderIDs/prompts/reports/settings/readpaths/source/version/dispositions/finalwholescopechecks/questions/limits. Do not editpacket or humanstates, read purchaseBD/docs/examples/productdefectivechecks/otheroutputs/reports/specimens/answers/rootissue/tests/implementation/network/filesoutsidepacket exceptownoutputs/readerreports, or sendexternalmessages. Stop honestlyperSkill; no evaluatorrewrite.
```

追加された指示（原文）：

```text
Keep all raw/repairs and readerhistory. A final narrowly scoped read-only literal-name diagnostic was added after a separatemethodtest showed text-onlyreview still normalized headingwords. Before finalreturn switch finalvalidation to updatedSkill /workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/SKILL.md, publicbundle be8d23aa331d61ffe10934f86190172726a5db78 authority0986ae5c67efeed0797f3f78083f81ac12dbe047(sameBD/allmeaningguidance). Read updatedSkill, execute bundledscript on fullconsultationBD/yoursavedcandidate; ask existingreader finaldistinctrecheck using updatedSkill too; record actualresults/revisions/fullprompts. Noexpectedfindingssupplied. Preserve rawuntouched; only you repairsource-supporteddefects iffound. No unrelatedoutputs.
```

## 別読者への依頼全文

初回：

```text
Run the alder-draft-check-items Skill's Consistency review-only on saved candidate /workspace/scratch/0261bb5be107/quality-loop-runs/regression-raw.md. Source whole BD: /workspace/scratch/0261bb5be107/quality-loop-packet/product/consultation/README.md. Previous list: /workspace/scratch/0261bb5be107/quality-loop-packet/product/consultation/checks.md. Actual feedback: add Japanese conditions/useful logical expressions/concrete input-result samples to discuss meaning; do not force tables onto narrative explanation; preserve guarantees, boundaries, IDs, review states, existing Test reference/untested status, shared reference, deferred question/no reasking, unresolved responses. Read /workspace/scratch/0261bb5be107/quality-loop-packet/AGENTS.md and the Skill at /workspace/scratch/0261bb5be107/quality-loop-packet/plugins/alder/skills/alder-draft-check-items/SKILL.md and its required bundled references. Pinned public source 8853a63101bb5968751986b0260bb8bc036505e2; plugin 0.4.8; authority a46427276070107d53066ee1282ac8b4a86b2ef2. Two source-led passes required: (1) extract literal declared ActivityName values and compare raw displayed index labels/headings, then establish required Check-to-Activity references and single bodies/states; (2) trace general source input/condition-to-result guarantees into primary text separately from examples, retained values and scope. Then unresolved logic, IDs, states, references, old guarantees/supporting detail/Test evidence. Report concrete evidence, NG vs undecided vs suggestion, and unperformed checks. Read-only: do not edit candidate or packet. Do not read purchase BD/docs/examples, defective checks, other outputs/reports/specimens/answers/root issue/tests/implementation/network/files outside packet except candidate and your own report. Save your report at /workspace/scratch/0261bb5be107/quality-loop-runs/regression-reader-1.md. Do not recursively review.
```

最終再レビュー：

```text
Run a distinct final read-only Consistency re-review of saved revision /workspace/scratch/0261bb5be107/quality-loop-runs/regression-repair-1.md, against whole /workspace/scratch/0261bb5be107/quality-loop-packet/product/consultation/README.md and prior /workspace/scratch/0261bb5be107/quality-loop-packet/product/consultation/checks.md, with same actual feedback as first assignment. Switch to updated Skill /workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/SKILL.md, public bundle be8d23aa331d61ffe10934f86190172726a5db78, authority 0986ae5c67efeed0797f3f78083f81ac12dbe047, plugin 0.4.8. Read updated Skill and required references, run its bundled read-only literal-name diagnostic on full BD and saved repaired candidate, record raw output/exit. Then repeat BOTH source-led passes and whole scope; do not take first report as findings to reproduce. Read project AGENTS at original packet path. Do not edit files. Same prohibitions on unrelated packet material, previous reports/specimens/answers/root issue/tests/implementation/network/outside except candidate and your own output. Save /workspace/scratch/0261bb5be107/quality-loop-runs/regression-reader-2.md with actual evidence, findings/limits/full followup prompt. No recursive review.
```
