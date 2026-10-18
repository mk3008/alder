# Fresh read-only Consistency review — candidate 01

Agent: `/root/oct18_skill_cycle/fresh_consistency`; requested `gpt-6-sol`, `medium`, `fork_turns: none`. Effective runtime settings not independently attested. Candidate SHA-256 `34834fd420377a8525c758f6fe4bfefd7f8454ad0f3824f13fea7e952542dc00`. No file edits by reader.

Raw intermediate finding 1: "Fresh read-only review in progress. Diagnostic exit 0, raw declared/headings/index names exact match. One evidenced NG: candidate C-04 lines 100–102 conditions on already giving guidance to 'その相談の依頼者', then expects recipient to be that requester; source README line 50 establishes recipient as the result of the explanation, and Skill conditions/expressions says action/preconditions must not presuppose result. Rephrase condition around selecting consultation A for guidance and action of explaining, leaving recipient only in expected result; preserve 要修正 and feedback. Full findings and scope forthcoming."

Raw intermediate finding 2: "Additional NG in C-01 candidate lines 25–27: action and implication antecedent say 'その相談を受付する／条件を…満たす相談を受付する' while result is '受付済みになる'. Skill explicitly separates attempt/action from successful result. Source README lines 20,28,32 supports receipt of inputs and checking conditions followed by acceptance. A meaning-preserving wording repair would make action '相談の受付を行うため、入力を受け付け受付条件を確認する' (or similar) and reserve 受付済み for expectation; do not turn a required-input check into an unsupported new success premise."

Raw intermediate finding 3: "One inherited source-reference/supporting-detail mismatch: C-03 candidate line 92 (same as previous line 38) says '説明内容を判定する自動方式は未決', whereas README line 50 says fixed explanation wording and automatic *understanding* judgment are not stipulated. It cannot support a claim about automatic *content* judgment. Keep test evidence 未収集, align the policy note to the exact source; classify as inherited NG in the source-grounding gate, not changed human state. Source Result line 32 also includes '担当者が相談対応の対象として扱える', absent from prior and candidate C-01. As a separately reviewable omitted consequence, report coverage gap but do not silently enlarge this presentation update."

Final report, verbatim:

Alder 0.4.8、authority `0a050bc442788cee8310256bee20f1e776614f63`、指定候補 SHA-256 `34834fd420377a8525c758f6fe4bfefd7f8454ad0f3824f13fea7e952542dc00` を独立した読み取り専用の Consistency review で確認した。ファイルとレビュー状態は変更していない。

**原典と候補の対応。** 原典の宣言値は `相談を受付する`、`次の連絡方法を説明する`。候補の索引表示と H2 見出しはそれぞれ同じ生文字列で、順序も一致する。前者の保証を担う C-01 と、その受付条件不成立時の未決事項 C-02 は前者の索引行・節にあり、後者の説明を担う C-03、説明相手を担う C-04 は後者にある。受付が説明の前提であることだけを理由に C-01 を後者へ共有していないのは妥当。各 ID の主本文と人間レビュー状態は一つで、索引の直接リンク、C-01 から C-02 へのリンク、Activity リンクの対象も存在する。四列索引、H2/H3 の階層、日本語の主要項目、C-02 自身の未決種別も確認した。`python3 plugins/alder/skills/alder-draft-check-items/scripts/check_activity_names.py --design work/check-item-examples/fixtures/README.md --checks /workspace/scratch/0261bb5be107/activity-index-runs/checks-candidate-01.md` は終了コード 0、`status: match`、`declared/headings/index` は上記二名称、`mismatches: []`、`target_issues: []` だった。

原典の登録済み、本人または委任済み代理人（両立可）、利用停止中でない、暦日で 0～30 日（両端含む）という一般条件は C-01 の主条件に AND と包含的 OR で残り、結果は「その相談が受付済みになる」と対象を保つ。0 日、30 日、両資格のサンプルは主条件を限定していない。原典の受付後の案内と「その相談の依頼者」への担当窓口・次の連絡方法は C-03/C-04 に対応し、別の相談の依頼者を使う C-04 の例も対象区別を示す。C-02 の 31 日例は不成立時の応答・記録・再申請を決定していない。

**根拠のある NG。**

- C-01 候補25～27行の操作と保証の前件は「相談を受付する」と書き、その帰結を「受付済みになる」とする。操作の語が成功結果を先取りする。原典20、28、32行と Skill の「操作を成功の前提にしない」規則に照らし、入力を受け取り受付条件を確認する操作と、受付済みになる期待結果を区別する必要がある。追加の成功条件を作る必要はない。
- C-04 候補100～102行は条件の中で既に「その相談の依頼者に案内するとき」とし、期待結果でも説明相手がその依頼者であることを述べる。原典50行の宛先保証を条件に先取りしている。対象相談を選んで案内する条件と操作を示し、正しい相手を期待結果に残すのが原典に沿う。人間レビュー状態「要修正」とフィードバックは維持する。
- C-03 のテスト証拠補足（候補92行、旧版38行）の「説明内容を判定する自動方式は未決」は、原典50行の「固定の説明文や自動理解判定は規定しない」と対象が違う。「内容判定」は原典から裏付けられない継承された根拠ずれである。テスト証拠「未収集」と人間レビュー状態は別に維持できる。

**別扱いの未決・不足。** 条件不成立時の応答、記録、再申請、希望日の変更は原典9行で未決。C-02 の「要確認」と保留を保持し、再質問や不受理結果の推定は不要。原典32行には受付済みになることに加えて「担当者が相談対応の対象として扱える」という結果があるが、旧 C-01 と候補 C-01 は前半のみを保証する。これは独立にレビュー可能な期待結果の収録不足として報告する。今回の表示更新で C-01 の確認済み保証を黙って拡張する根拠にはしない。

任意の表現改善として、C-03 の期待結果に「その相談の依頼者へ」を明記すれば原典54行を単独でも読みやすい。ただし C-04 と重なるため、これは新たな NG や意味の承認ではない。旧 C-01～C-04 の ID、主要保証、人間レビュー状態、C-01 の境界テスト名と最終実行結果未収集、C-02/C-03/C-04 の証拠不足、C-04 のフィードバックは候補に保持されている。リンク先ファイルの相対パスと見出し対象は静的に確認したが、GitHub 上の実描画、既存 Test の実体・assertion・実行結果、外部 URL は確認していない。診断は名称と狭いリンク対象の検査であり、上記の意味・証拠判定を代替しない。
