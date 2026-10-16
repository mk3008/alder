# 初稿作成・Consistency review 記録

## 依頼（受領した全文）

> Use alder-draft-check-items at /workspace/scratch/0261bb5be107/quality-loop-packet/plugins/alder/skills/alder-draft-check-items/SKILL.md to produce Japanese initial Check Items from the WHOLE packet business-design/purchase-request/README.md. Read packet AGENTS.md and required bundled guidance. Pinned public source8853a63101bb5968751986b0260bb8bc036505e2, plugin0.4.8, authoritya46427276070107d53066ee1282ac8b4a86b2ef2. Include useful Japanese conditions/expressions/concrete input-result samples, preserving general meaning and undecided scope. BD unconfirmed; no approval/handoff. Follow the Skill's distinct read-only Consistency review and source-validated repair operation: you are explicitly authorized to spawn one Fresh reader agent (gpt-6-sol/medium, fork none) with samepacketguidance, source and actualsavedcandidate only (no specimen/expectedfindings); reader cannot edit. Preserve every saved raw draft and repaired revision separately in /workspace/scratch/0261bb5be107/quality-loop-runs/initial-*.md, invoke rereview after corrections; no evaluator edits. Record reviewer full prompts/reports, dispositions and whole-scope final check; stop honestly perSkill. Save report initial-report.md incl full task verbatim, agentID/settings/readpaths/revisions, retained/changed meaning, unresolved business questions and actualchecks/limits. Do not read product/defective-checks.md, consultation, docs/examples, otheroutputs/reports/specimens/answerkeys/rootissue/tests/implementation/network or anything outsidepacket except youroutputs and ownreaderreports. Do not edit packet or send externalmessages. Humanreviewstates neverpromote.

## 入力、版、作業範囲

- 公開入力版：`8853a63101bb5968751986b0260bb8bc036505e2`。対象は `quality-loop-packet/business-design/purchase-request/README.md` 全文。ローカル内容 SHA-256 `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`。
- Alder Plugin 0.4.8、権威版 `a46427276070107d53066ee1282ac8b4a86b2ef2`。出典の参照用資料の digest は `references/provenance.json` に記録されている。
- 著者が読んだもの：packet `AGENTS.md`、対象Business Design全文、`plugins/alder/skills/alder-draft-check-items/SKILL.md`、同skillの `references/check-item-traceability.md`、`references/adoption.md`（必要箇所からFunctional Interface節まで）、`references/candidate-c3.md`、`references/provenance.json`、`plugins/alder/plugin.json`。禁止された資料・ネットワークは読んでいない。
- 保存版：`initial-raw.md`（SHA-256 `54f32a6e0a14324a8a07396b71e34a9cef7797de932b13e1077ba7725f61407b`）、`initial-repaired.md`（SHA-256 `a6080a9ade04ef239c67ac76e52a438986a552ea3a27ebab3c8f2f7632e7ce4e`）。原稿を上書きせず、修復を別ファイルに保存した。
- Fresh reader agent ID：`/root/quality_initial/fresh_initial_review`。要求した設定：`gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。実効runtime設定を独立検証できていない。

## Fresh reader への初回全文プロンプト

> Perform Alder alder-draft-check-items Skill's distinct Consistency review-only, read-only. Pinned public source revision 8853a63101bb5968751986b0260bb8bc036505e2; installed Alder plugin 0.4.8; authority a46427276070107d53066ee1282ac8b4a86b2ef2. Read only these inputs: /workspace/scratch/0261bb5be107/quality-loop-packet/AGENTS.md; /workspace/scratch/0261bb5be107/quality-loop-packet/business-design/purchase-request/README.md (whole); /workspace/scratch/0261bb5be107/quality-loop-packet/plugins/alder/skills/alder-draft-check-items/SKILL.md and its references/check-item-traceability.md, references/adoption.md through optional Functional Interface, references/candidate-c3.md, references/provenance.json, and plugin.json; actual saved candidate /workspace/scratch/0261bb5be107/quality-loop-runs/initial-raw.md. Do not read specimens, expected findings, product/defective-checks.md, consultation, docs/examples, other outputs/reports, root issue, tests, implementation, network, or anything outside packet except this candidate. Do not edit any file. Run two source-led passes: (1) extract declared ActivityName values, record raw index labels and Activity heading text beside declarations and compare literally, then establish each Check's governed Activities and inspect required index and section shared references/single primary body/state; (2) trace source's general input/condition→result guarantees into each primary Check separately from examples, compare value retention and scope, then unresolved scope, logic, IDs, states, references. Report concrete source/artifact correspondence, evidenced NG distinct from genuine business uncertainty and suggestions, unperformed checks. Do not recursively review or approve human meaning. Return full review report.

## 初回読取専用レビュー全文

> Alder Consistency review-only を、指定された Business Design 公開版 `8853a63101bb5968751986b0260bb8bc036505e2`、Alder 0.4.8／権威版 `a46427276070107d53066ee1282ac8b4a86b2ef2`、保存済み `initial-raw.md` に対して読み取り専用で実施した。依頼どおり指定外の資料、実装、テスト、ネットワークは参照せず、ファイルと人間レビュー状態を変更していない。これは業務意味の承認ではない。
>
> **第1パス — 名称・共有参照。** 宣言された `# Activity ActivityName`、候補の索引表示、H2見出しを文字列として照合した。
>
> | Business Design 宣言行と ActivityName | 候補索引の生表示 | 候補H2の生表示 |
> | --- | --- | --- |
> | 123 `備品購入を申請する` | 7 `備品購入を申請する` | 12 `備品購入を申請する` |
> | 170 `購入申請を承認する` | 8 `購入申請を承認する` | 79 `購入申請を承認する` |
> | 218 `購入申請を却下する` | 9 `購入申請を却下する` | 128 `購入申請を却下する` |
> | 267 `承認済み備品を購入する` | 10 `承認済み備品を購入する` | 176 `承認済み備品を購入する` |
>
> 四つとも完全一致する。四列索引、索引とActivity節の順序、各IDの単一主本文・単一の「未レビュー」状態も確認できた。ただし、現在の主本文が定める共有範囲について次の**記述規則NG**がある。現行 traceability guidance の「GitHub Markdown document layout」は、共有Checkを関係する各索引行から同じ主本文へ直接リンクし、他のActivity節にも同じIDへの参照を置くよう求める。
>
> - **PR-02の共有参照欠落。** Business Design 21行は購入申請の一意識別を、196–197行と244–245行は承認・却下における対象申請の選択を定める。候補PR-02の主期待結果49行は「後続で選択する対象もその一意に識別できる申請」と明記するため、承認と却下の両方を直接統べる。しかし両者の索引行8–9と節79–175にPR-02への参照がない。単なる前段依存でなく、PR-02自体が後続選択の同一性を保証している点が根拠である。
> - **PR-03の共有参照欠落。** Business Design 168行と承認・却下の180–205、228–254行に対応し、候補PR-03の主期待結果68行は同じ申請を承認・却下の両対象として扱えると明記する。索引行8–9と対応節にPR-03への参照がない。
> - **PR-05の共有参照欠落。** Business Design 216行から277–300行への接続を、候補PR-05の主期待結果117行が「承認済み備品を購入する業務の対象にできる」と明記する。購買の索引行10と節176–206にPR-05への参照がない。
>
> 各々は既存IDの直接リンクを追加する記述上の修復で足りる。新しい主本文やレビュー状態を作る必要はない。PR-07は却下と購買の索引行9–10、購買節178行から同一の主本文157–174行を参照しており、共有の扱いは整合する。PR-01、PR-04、PR-06、PR-08の前後接続は、それだけを理由に全前後Activityへ共有する保証ではない。
>
> **第2パス — 一般条件・入力値から主期待結果への対応。** サンプルによる補完とは分けて主本文を確認した。申請の必須四入力、`submitted`、申請日時、一意識別（Business Design 19–21、149–168行）はPR-01の条件・結果20–23行に、入力した四値と申請者の保持はPR-02の47–49行にある。`submitted` の同一申請が判断対象になる保証はPR-03の66–68行にある。承認者が選択した `submitted` の同一申請を `approved` にして承認日時を記録する結果（182–216行）はPR-04の87–90行に、購買への接続はPR-05の115–117行にある。却下の対象選択・入力した却下理由・`rejected`・却下日時（230–265行）はPR-06の136–139行に、`rejected` が購買対象外である保証（31、265行）はPR-07の163–165行にある。購買担当者が購入した `approved` の同一申請へ、入力した実購入金額、購入日時、`purchased` を記録する結果（279–314行）はPR-08の186–189行にある。例示額30,000／28,000や数量2は主条件・結果の値域へ持ち込まれておらず、一般保証は例示値に限定されていない。サンプルの結果も対応する主本文と矛盾しない。
>
> **未決の業務意味と限界。** Business Design 33–44行が列挙する金額別承認経路、購入先、納品・支払などは今回の対象外であり、候補はこれらを決定済みの期待結果にしていない。必須値の欠落・空白、数量や金額の値域、条件外の操作・失敗応答もBusiness Designで結果が定まらず、候補の「未決事項」や例の注記はその境界をおおむね保つ。これらをNGとして架空の拒否結果へ補うことはできない。人間による業務設計の合意は候補3行でも未確認とされ、全PR-01～08は「未レビュー」で整合する。テスト対応は「未作成・未照合」と明記されており、テストの存在や実行結果を確認したものではない。提示された版の対応と記載行を照合したが、外部URLの到達性、GitHub上での実レンダリング、実装・テスト、業務上の妥当性・網羅性、修復後の再レビューは実施していない。

## 修復判断

初回レビューの三件は、各Checkの主期待結果そのものが後続Activityを統べることを原文の一意識別、承認・却下対象、購買対象への接続と照合して採用した。`initial-repaired.md` の索引と関連Activity節にPR-02、PR-03、PR-05への直接リンクだけを追加。PR-07の共有参照は維持した。保証・条件・サンプル・根拠行・ID・人間レビュー状態を変更せず、旧版の全保証を保持した。初回レビューに不採用のNGはない。金額別承認、欠落・空白、値域、条件外操作、購入不成立時の応答はBusiness Designの未決・対象外として保持し、AIで結果を決めなかった。

## 再レビュー全文プロンプト

> Rereview the saved repaired revision /workspace/scratch/0261bb5be107/quality-loop-runs/initial-repaired.md read-only against the same full source and guidance, including affected shared references and whole requested scope regression. Do not edit or approve business meaning. Record raw declared/index/H2 names and governed-Activity link coverage, and separate general primary guarantees from examples again. Report remaining NG, undecided meanings, unperformed checks. The prior raw draft remains preserved; review this actual repaired artifact.

## 再レビュー全文

> 保存済み `initial-repaired.md` を、同じ公開版 Business Design `8853a63101bb5968751986b0260bb8bc036505e2` と Alder 0.4.8／権威版 `a46427276070107d53066ee1282ac8b4a86b2ef2` に対して読み取り専用で再レビューした。**全8項目の今回確認した範囲に、残る出典に裏付けられたNGは見つからなかった。** ファイルとレビュー状態は変更していない。
>
> 第1パスでは宣言値を加工せず照合した。Business Design の `# Activity` 宣言123、170、218、267行の ActivityName は順に「備品購入を申請する」「購入申請を承認する」「購入申請を却下する」「承認済み備品を購入する」であり、修復版の索引7、8、9、10行の生表示およびH2の12、79、130、180行とそれぞれ完全一致する。索引は指定の四列で、H2とH3の階層・順序も一致する。
>
> 各主期待結果が統べる業務とリンクを改めて照合した。PR-01は申請（索引7、主本文14）、PR-02は申請と後続の承認・却下で選ぶ同一対象（索引7–9、他節81・132、単一主本文41）、PR-03は申請から承認・却下の判断対象への接続（索引7–9、他節81・132、単一主本文60）、PR-04は承認（索引8、主本文83）、PR-05は承認から購買対象への接続（索引8・10、他節182、単一主本文111）、PR-06は却下（索引9、主本文134）、PR-07は却下した対象の購買除外（索引9・10、他節182、単一主本文161）、PR-08は購買結果登録（索引10、主本文184）に対応する。修復前に欠けていたPR-02、PR-03、PR-05の共有参照は索引と関連節の双方に加わり、各IDの主本文と「未レビュー」状態は一つのままである。単なる前段依存を共有と数えていない。
>
> 第2パスではサンプルとは独立に、出典の一般条件・値保持・結果を主本文へたどった。申請の四必須入力、一意の新規申請、`submitted`、申請日時（出典19–21、149–168行）はPR-01の20–23行、入力した申請者・品名・数量・希望購入金額・理由を同じ申請に保持し後続で同じ対象を選ぶ保証はPR-02の47–49行、承認者の判断対象への接続はPR-03の66–68行にある。`submitted` の選択対象を `approved` にし承認日時を記録する結果（出典182–216行）はPR-04の89–92行、同じ申請を購買対象にする結果はPR-05の117–119行にある。`submitted` の選択対象を、入力した却下理由・却下日時とともに `rejected` とする結果（出典230–265行）はPR-06の140–143行、却下中の購買対象外という保証（出典31、265行）はPR-07の167–169行にある。購入した `approved` の同一申請に入力した実購入金額・購入日時を記録し `purchased` とする結果（出典279–314行）はPR-08の190–193行にある。例示の数量2、希望額30,000、実額28,000は主条件をその値に制限しておらず、サンプルの結果も主保証と矛盾しない。
>
> 業務設計33–44行の金額別承認経路、購入先や納品・支払などは未決定かつ今回の対象外として保たれている。必須値欠落時の受付可否、空白・数値の妥当域、条件外操作の応答、購入途中不成立時の記録結果も出典から決定できないため、候補は結果を創作せず未決として表示している。これらは今回のNGではなく、具体化する場合は責任者によるBusiness Designでの判断が必要になる。設計の合意は候補3行で未確認、全項目は「未レビュー」、テスト対応は未作成・未照合で整合する。
>
> 今回実施していないのは、人間による業務意味の確認、実装・テストと実行結果の照合、外部URLの到達性とGitHub上の実レンダリング、網羅性の証明である。修復版について別の修正や追加の再レビューは行っていない。

## 著者の最終全範囲チェックと停止点

- Business Designの四つの宣言ActivityNameを索引・H2の生表示と照合。四列索引の各IDはH3の単一主本文に直接つながり、共有PR-02/03/05/07は関係する索引行と他Activity節に同一IDを参照する。
- 全PR-01～08は日本語の条件・期待結果・具体例・根拠を持ち、人間状態は各々「未レビュー」一つ。必要条件の式を十分条件とせず、例示値を一般保証に昇格していない。ローカルの見出しリンク照合で欠落ゼロ、ID重複ゼロ、状態数各一。出典行番号は指定ローカル版の全文と照合した。修復はリンクのみで原稿の意味を削除していない。
- 優先する業務判断は、合意前のBusiness Design自体、欠落・空白値の扱い、数量・金額の妥当範囲、条件外操作と購入途中不成立時の結果。金額別承認経路その他列挙済み業務は今回対象外であり決定を装わない。
- 出典に裏付けられたNGは再レビューでは残らなかった。人間の承認・引き渡しはしていない。外部レンダリング、実装・テスト、完全網羅と効果検証は実施していない。ここでレビュー可能な初稿として停止する。

## 追加指示と更新Skillでの最終検証

親エージェントから、既存の原稿・修復版を保持し、最終検証のみ `quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/SKILL.md`（公開バンドル `be8d23aa331d61ffe10934f86190172726a5db78`、権威版 `0986ae5c67efeed0797f3f78083f81ac12dbe047`）へ切り替える追加指示を受けた。対象Business Designと意味指針は同じ。Skillを読んで、同Skill相対の `scripts/check_activity_names.py` を元のBusiness Design全文と保存済み `initial-repaired.md` に対し実行した。終了コード0、出力は `status: match`、`mismatches: []`、`declared/headings/index` はいずれも「備品購入を申請する／購入申請を承認する／購入申請を却下する／承認済み備品を購入する」の順だった。これは名前のみの診断であり意味保証の検査を代替しない。

### 更新Skillの再照合プロンプト全文

> Final distinct read-only recheck under updated published Skill /workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/SKILL.md, public bundle be8d23aa331d61ffe10934f86190172726a5db78, authority 0986ae5c67efeed0797f3f78083f81ac12dbe047, plugin 0.4.8. Same full Business Design /workspace/scratch/0261bb5be107/quality-loop-packet/business-design/purchase-request/README.md (pinned 8853a63101bb5968751986b0260bb8bc036505e2), final actual saved candidate /workspace/scratch/0261bb5be107/quality-loop-runs/initial-repaired.md. Read updated Skill and its relevant bundled guidance; run its bundled read-only literal-name diagnostic script on those paths; inspect raw output, then perform the whole-scope two source-led Consistency passes and report evidence, remaining NG, uncertainty, limits. Do not edit files; do not read specimens, expected findings, unrelated outputs/reports, product/defective-checks.md, consultation, docs/examples, root issue, tests, implementation or network. Prior review history is context only, not authority. No human approval.

### 更新Skillの再照合報告全文

> 更新された Alder Skill（公開バンドル `be8d23aa331d61ffe10934f86190172726a5db78`、権威版 `0986ae5c67efeed0797f3f78083f81ac12dbe047`、Plugin 0.4.8）により、保存済み `initial-repaired.md` を読み取り専用で再確認した。指定の名前診断は終了コード0、原出力は `status: "match"`、`mismatches: []` だった。`declared`、`headings`、`index` の各生配列は、順に「備品購入を申請する」「購入申請を承認する」「購入申請を却下する」「承認済み備品を購入する」で完全一致した。Business Designの宣言行は123、170、218、267、候補の索引行は7–10、H2は12、79、130、180である。診断は共有リンクや意味を検証しないため、以下を別に確認した。
>
> 第1パスでは、各主保証が統べるActivityについて、索引と他節の直接リンク、単一主本文・状態を照合した。PR-01は申請、PR-02とPR-03は申請・承認・却下（索引7–9、承認節81、却下節132）、PR-04は承認、PR-05は承認・購買（索引8・10、購買節182）、PR-06は却下、PR-07は却下・購買（索引9・10、購買節182）、PR-08は購買を対象とする。いずれも各IDに主本文一つと「未レビュー」状態一つがあり、前段依存だけを理由に余分な共有を要求していない。四列索引、ActivityとCheckの見出し階層、リンク先IDも確認した。
>
> 第2パスでは、例の値で主保証を補わず、出典の一般条件・入力値・結果を追った。Business Designの四必須入力、一意な新規申請、`submitted`、申請日時（19–21、149–168行）はPR-01の20–23行、入力した申請者・品名・数量・希望購入金額・理由を同じ申請に保持する結果はPR-02の47–49行、承認・却下の判断対象への接続はPR-03の66–68行にある。選択した `submitted` 申請の `approved` と承認日時（182–216行）はPR-04の89–92行、同じ申請の購買対象化はPR-05の117–119行、選択対象の `rejected`、入力した却下理由と却下日時（230–265行）はPR-06の140–143行、却下中の購買除外はPR-07の167–169行、購入した `approved` の同じ申請への入力実購入金額・購入日時・`purchased`（279–314行）はPR-08の190–193行に対応する。サンプルの数量2、希望額30,000、実額28,000は主本文をその値に限定していない。
>
> **今回の全8項目の範囲に、残る出典裏付けのあるNGは見つからなかった。** 金額別承認経路、購入先、納品・支払などはBusiness Design 33–44行で未決定かつ対象外とされ、候補も決定済みの結果にしていない。欠落・空白入力、数値の値域、条件外操作や途中不成立時の応答は出典から確定できず、候補では未決のまま扱っている。業務設計の人間合意は候補3行で未確認、全Checkは未レビュー、テスト対応は未作成・未照合である。業務意味の承認、実装・テストの照合、外部リンク到達性、GitHubでの実レンダリング、網羅性の証明は行っていない。ファイルは編集していない。

親エージェントから、金額別承認の未決表示と複合結果のCheck粒度について追加の具体的フィードバックを受け、同じ読取専用readerに追加判定を求めた。

### 追加判定プロンプト全文（送信および再開）

> Root has identified two source/guidance points for explicit disposition before final claim: PR-04 amount-dependent approval is source-declared undecided/excluded but appears only as H4 note without visible kind/question or 要確認; determine whether this is an unresolved item requiring own kind/state vs bounded out-of-scope note. Also assess whether PR-01 state+time, PR-04 state+approval time, PR-06 rejection+reason+time, PR-08 purchase state+actual amount+time+usable are independently reviewable guarantees requiring split under §2, versus inseparable event/result. Cite source/guidance and recommend minimal source-supported repair or explain no NG. Do not edit.
>
> Additional read-only adjudication specifically requested by root; your previous final did not address these two points. (1) PR-04 amount-dependent approval source-declared undecided/excluded appears in H4 note under 未レビュー without visible unresolved-item kind/question; should this be a distinct 要確認 candidate or merely scope note? (2) PR-01 state+timestamp, PR-04 state+time, PR-06 rejection+reason+time, PR-08 state+actual amount+time+usable: assess independent reviewable outcomes vs inseparable event/result under Check granularity §2, with precise source/guidance citations and concrete minimal repair if NG. Do not edit, no policy invention. Return explicit disposition, even if no change.

### 追加判定報告全文

> 追加の二点を判定した。
>
> **PR-04の金額別承認はNGではない。** Business Design 33–44行は未決定とし、48行は今回の対象から除く。候補104行はその境界を述べる注記で、未承認の期待結果を持つ独立Checkではない。したがって個別の「種別：未決事項（候補）」やPR-04全体の「要確認」は要求されず、現在の `submitted`→`approved` 保証の「未レビュー」は妥当である。見出しを「対象外の事項」等に変えると読み違いを減らせるが、任意の表現改善にとどまる。
>
> **複合結果には粒度NGがある。** 現行 traceability guidance §2は一つの独立してレビューできる観測結果を原則とし、c3「検査項目の粒度」は人が一方だけ採否・修正できる期待結果を原則別Checkとする。これはAND条件や一つの条件／結果の組を機械的に分ける指示ではない。以下の記録事実は状態遷移とは独立に「状態は正しいが日時や入力値が記録されない」と判定できる。
>
> | 現IDと主結果 | 出典 | 最小限の分離 |
> | --- | --- | --- |
> | PR-01、23行：新規 `submitted` と申請日時 | 申請のResult 166–168行 | PR-01に新規申請・状態を残し、申請日時の記録を別IDにする。PR-02の既存値・同一性保持との重複を整理する。 |
> | PR-04、92行：`approved` と承認日時 | 承認のResult 214–216行 | PR-04に同じ対象の承認状態を残し、承認日時を別IDにする。購買接続は既存PR-05が担う。 |
> | PR-06、143行：`rejected`、入力した却下理由、却下日時 | 却下のOutput/Result 259、263–265行 | PR-06に却下状態を残し、入力理由の同一対象への記録と却下日時の記録をそれぞれ独立にレビュー可能なIDへ移す。購買除外は既存PR-07が担う。 |
> | PR-08、193行：`purchased`、入力実購入金額、購入日時、購入済みとして扱えること | 購買のOutput/Result 308、312–314行 | PR-08に同じ対象の購入済み状態を残し、入力実購入金額と購入日時の記録を独立IDにする。「購入済みとして扱える」はこの出典では状態の業務上の意味を表し、別の後続業務保証として機械的に分ける必要はない。 |
>
> 分離時には現ID、出典、一般値の保証、未レビュー状態を保持し、新IDの索引・節リンクと例を整える。日時や金額の値域・失敗応答を追加してはならない。こちらは読み取り専用の判定であり、修正や修正後レビュー、人間の意味承認は行っていない。

## 粒度修復と再レビュー

指摘はBusiness DesignのResultの分離可能な記録事実とCheck粒度規則に照らし採用した。`initial-granular.md`（SHA-256 `543432be828274f13c15c6d9417f108d524681bcbdb9ecb65a0ecf3a5261f532`）を別版保存。PR-01/04/06/08には同一対象の状態結果を残し、日時をPR-09/10/12/14、入力した却下理由をPR-11、入力した実購入金額をPR-13に分割した。PR-02の日時との重複を整理し、PR-03/05/07や既存の同一性・接続・除外を保持。全新項目は未レビュー。金額別承認は出典で今回対象外の注記であり独立未決候補にしていない。

### 粒度修復の再レビュープロンプト全文

> Author saved source-supported granularity repair as /workspace/scratch/0261bb5be107/quality-loop-runs/initial-granular.md, preserving earlier raw/repaired. Run updated-bundle literal diagnostic and distinct read-only whole-scope two-pass review of this actual artifact against same full Business Design and updated Skill/guidance. Specifically verify old PR-01–08 guarantees mapped to new PR-09–14, source labels, examples, index/section links and states; identify any new NG. Do not edit files or approve meaning. Report concrete evidence and unperformed checks.

### 粒度修復の再レビュー報告全文

> `initial-granular.md` の全14項目を、更新Skillと指定のBusiness Design公開版 `8853a63101bb5968751986b0260bb8bc036505e2` に対して読み取り専用で再レビューした。名前診断の生出力は終了コード0、`status: "match"`、`mismatches: []`。宣言値（Business Design 123、170、218、267行）、索引表示（候補7–10行）、H2（12、98、168、261行）は四つとも同じ順序・文字列だった。
>
> 共有の主保証と直接リンクは、PR-02・PR-03が申請／承認／却下の索引7–9行と他節100・170行、PR-05が承認／購買の索引8・10行と他節263行、PR-07が却下／購買の索引9・10行と他節263行にある。各IDの主本文と人間レビュー状態は一つで、PR-09は申請、PR-10は承認、PR-11・12は却下、PR-13・14は購買の索引からそれぞれ直接リンクされる。全14項目は「未レビュー」で、出典ラベルのActivity名と行範囲は該当するBusiness Designの節に対応する。
>
> 旧PR-01の新規・`submitted` 保証は23行に残り、日時記録・保持はPR-09の87行へ移った。旧PR-02の入力四値・申請者・同一対象の保持は49行に残り、旧PR-03の承認判断への接続は68行に残る。旧PR-04の同一申請の `approved` は111行、承認日時はPR-10の157行、旧PR-05の購買接続は138行である。旧PR-06の `rejected` は181行、入力した理由の同一対象への記録はPR-11の227行、却下日時はPR-12の250行、旧PR-07の購買除外は207行である。旧PR-08の `purchased` と購入済み扱いは274行、入力した実購入金額はPR-13の302行、購入日時はPR-14の325行へ対応する。各サンプルも主保証と対応し、例示値2、30,000、28,000を一般条件の閾値にしていない。欠落時の応答や値域は未決として残る。
>
> **新たな記述規則NGが一件ある。** PR-09の条件85行は「新しい購入申請が登録される」と、成功した登録を既に前提にしている一方、操作86行は同じ登録を行うとしている。Business Design 149–168行の入力・登録行為から申請日時の記録へ至る直接の期待結果を、成功済み条件へ弱める書き方である。更新 guidance の「Conditions, expressions and examples」は登録という操作の成功を条件に先取りしないよう求める。PR-09の条件を、申請者が新規申請の四必須情報を入力して申請しようとする状況へ直し、操作を登録、結果を同じ申請への日時記録・保持として残すのが最小の修復である。ID、未レビュー状態、出典、索引リンクは維持できる。
>
> PR-04の金額別承認はBusiness Design 33–44、48行で未決定かつ今回の対象外であり、候補123行は範囲注記にとどまる。独立した未決CheckやPR-04の「要確認」を求めるNGではない。候補49行の読点「理由、が」は任意の校正事項である。実装・テスト照合、GitHubでの実レンダリング、外部URL到達性、人間による意味の承認と網羅性の証明は行っていない。ファイルは編集せず、上記NGの修復後の再レビューも未実施である。

著者がPR-09の成功先取りを元の入力四項目と登録操作へ修正し、PR-02の読点を校正して `initial-final.md`（SHA-256 `b1c03ad0d6a50b72a9323e6e9d692419d0915fdb0a0f230f8cf2992ebc885217`）に別版保存した。レビューの一件NGを採用、一件任意校正を採用。不採用の指摘はない。旧版はいずれも保存した。

### 最終再レビュープロンプト全文

> Author validated and repaired PR-09 success-as-precondition NG and optional comma typo in separate saved /workspace/scratch/0261bb5be107/quality-loop-runs/initial-final.md; prior granular preserved. Run updated-bundle literal diagnostic and actual read-only final re-review of this saved revision, affected PR-09 and whole 14-item scope for regression, both source-led passes and old guarantees. Report any remaining source-backed NG and limits; do not edit or approve meaning.

### 最終再レビュー報告全文

> 保存済み [initial-final.md](sandbox:/workspace/scratch/0261bb5be107/quality-loop-runs/initial-final.md) を、更新Alder SkillとBusiness Design公開版 `8853a63101bb5968751986b0260bb8bc036505e2` に対して読み取り専用で再レビューした。**全14項目の確認範囲に、残る出典に裏付けられたNGは見つからなかった。**
>
> バンドルの名前診断は終了コード0、原出力は `status: "match"`、`mismatches: []`。宣言された四つのActivityName（Business Design 123、170、218、267行）は、候補の索引7–10行とH2の12、98、168、261行に文字列・順序とも一致する。PR-02・03は申請／承認／却下、PR-05は承認／購買、PR-07は却下／購買の索引と他節に同じ主本文への直接リンクがある。新規PR-09～14も対応する索引行から各一つの主本文へリンクし、全IDの人間レビュー状態は「未レビュー」一つずつである。
>
> 第2パスではサンプルと分けて一般保証をたどった。申請の一意な新規 `submitted` はPR-01（23行）、申請日時の記録・保持はPR-09（87行）、入力した四値・申請者と後続選択対象の同一性はPR-02（49行）、承認判断への接続はPR-03（68行）にある。承認の同一対象 `approved` はPR-04（111行）、承認日時はPR-10（157行）、購買対象化はPR-05（138行）。却下の `rejected` はPR-06（181行）、入力した理由はPR-11（227行）、日時はPR-12（250行）、購買除外はPR-07（207行）。購入の同一対象 `purchased` と購入済み扱いはPR-08（274行）、入力した実購入金額はPR-13（302行）、日時はPR-14（325行）にある。これはBusiness Designの申請149–168、承認194–216、却下242–265、購買291–314行の条件・入力値・結果を保持する。PR-09の条件85行は四入力、操作86行は登録、期待結果87行は日時記録となり、前回の「成功を条件に先取りする」NGは解消した。例示値を一般の閾値としていない。
>
> 金額別承認経路などBusiness Design 33–44、48行の未決・対象外事項、必須値欠落時の応答、空白や数値の妥当域、途中不成立時の結果は確定した期待結果へ昇格していない。実装・テスト照合、GitHubでの実レンダリング、外部URL到達性、人間による意味承認、網羅性の証明は実施していない。ファイルは編集していない。

## 最終版の全範囲確認と限界

著者も最終保存版を再読し、更新Skillの名前診断を実行した。終了コード0、宣言名・見出し・索引の四件が完全一致、`mismatches: []`。14個のIDは一意で、人間状態は各一、内部見出しリンク欠落ゼロ。四つのActivity、主条件／結果、一般値の保持、例と未決境界、共有リンクを全範囲で照合した。初期8項目の保証は14項目へ保持され、削除した意味はない。出典裏付けのあるNGは最終再レビューで残らなかった。BD合意とCheckの人間確認は未了であり、引き渡しを宣言しない。外部レンダリング・URL到達性・実装・テスト・網羅性の証明はしていない。
