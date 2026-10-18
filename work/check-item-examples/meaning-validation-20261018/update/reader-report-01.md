# Alder Consistency review-only — update candidate-01

## 依頼全文と実行条件

> Alder SkillのConsistency review-onlyを実行。入力は /workspace/scratch/0261bb5be107/meaning-packets/update と /workspace/scratch/0261bb5be107/meaning-runs/update/candidate-01.md のみ。AGENTS.md、plugins/alder/skills/alder-draft-check-items/SKILL.mdと必須guidance、work/check-item-examples/fixtures/README.md全体、同checks.md（旧版）を読み、candidateを読取専用レビューしてください。公開Skill/guidance/input版75fb043568ade8b442853421a0bc78ef999b23e1、authority b3113b7c0b6915562f0ebd6892e01199510cf319。実際のフィードバック：一般保証を共通説明で一度だけ置き、各Checkは参照中心で簡潔に、例で意味の違いを確認できること。既存限定スコープの意味/ID/人間状態/未決/補足/Test証拠を保持。具体的なsource/artifact対応を示しNG/原典未決/任意提案/未実施を分離。/workspace/scratch/0261bb5be107/meaning-runs/update/reader-report-01.mdに依頼全文・入力hash・要求gpt-6-sol medium fork none（実効設定attestationなし）・実行診断と未検証を記録。候補・packetを編集/修復しない、人間承認なし、再委譲なし。完成見本・作者点検・過去評価・他出力/packet・実装/テスト・会話履歴・ネットワーク禁止。

要求された Fresh 設定は `gpt-6-sol` / reasoning `medium` / `fork_turns: none`。実効モデル・effort・fork の独立した runtime attestation は得られていない。公開版指定 `75fb043568ade8b442853421a0bc78ef999b23e1`、authority revision は packet の provenance にも記載された `b3113b7c0b6915562f0ebd6892e01199510cf319`。plugin version は `0.4.8`。レビューは読取専用であり、人間の業務判断・承認ではない。

入力 SHA-256：candidate `712a2d705f3909736c15091c2848d861cc7a8a98b2e3c97c311035314f4cad0f`、業務設計 README `e00c06ef469c015120add5dc92249b53eabd496750ff9aeb1b7f9a84ab469cd0`、旧 checks `5381e599a4a3e184aaf669670017e9976e46683a6597307baf894ea103c788df`、AGENTS `29b2c0fe7b5da19414f3a274eb8f4780fd2b4b2e89627a8a1bd8e66a3611bf7f`、Skill `aab470d8e289a1dd65ae6ab75a231ee171f519cd12a49316ed0660074d12d8d4`、traceability guidance `7470dc6123fd4fa0e19e864d67eb1e8f5a8c53ab1653d056dfdaeecb9cdb2ce6`、adoption guidance `2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3`。packet の `input-hashes.json` とこれらの値は一致した。

## 診断・source-led pass 1：名前と必須参照

`python3 meaning-packets/update/plugins/alder/skills/alder-draft-check-items/scripts/check_activity_names.py --design meaning-packets/update/work/check-item-examples/fixtures/README.md --checks meaning-runs/update/candidate-01.md` を実行。exit 0、`status: match`、`mismatches: []`、`target_issues: []`。原典の宣言文字列は `相談を受付する` と `次の連絡方法を説明する`（README 12, 34行）。candidate の索引表示ラベルは同じ二つ（7–8行）、H2 も同じ二つ（10, 66行）。短縮名・位置番号はない。診断は保証の意味や証拠を検査しない。

原典「相談を受付する」のWhen/How/Result（20–32行）に対応する C-01 は索引7行から単一のH3 46行へ、C-02 は原典の未決規則9行に対応し索引7行からH3 54行へ直結する。「次の連絡方法を説明する」のWhen/How/Result（42–54行）に対応する C-03 と相手の対応関係に限定された C-04 は索引8行からそれぞれH3 76, 84行へ直結する。後続の案内は C-01 の関連業務であって C-01 を二業務共有の Check にする根拠ではない。candidate は四列索引、同階層のActivity H2と配下のCheck H3、一ID一本文・一人間状態を保持する。二つの共通保証節、表の行、各Checkからの戻り参照の見出しフラグメントはテキスト上対応している。公開URLが指す外部版の実体は開いていない。

## source-led pass 2：保証、例、更新保存

- C-01：原典の規則7–8行とActivityのWhen/How/Result 20–32行に対し、candidate 16–25行は登録済み AND (本人 OR 委任済み代理人、重複可) AND 非停止 AND 暦日0–30日を保持し、当該相談の受付済みという結果を定義する。C-01本文50行がこの定義へ戻る。旧版の確定した期待は「その相談が受付済みになる」（旧checks 48–52行）である。一方、candidate 25行と例35–37行は「担当者が相談対応の対象として扱える」を **C-01の保証・観察結果として追加** した。原典Result 32行には実際にこの結果があるが、今回の表示変更は既存の限定Checkを拡張する権限を与えない。式の後件は受付済みのみで、同じ段落内でも保証範囲が食い違う。C-01の確認済み状態を拡張部分への人間確認と見なせない。これは原典に欠ける意味の創作ではなく、限定スコープ保存のNGである。原典の追加結果を別の欠落候補として扱うかは本レビューで決めない。
- 比較表はAの0日、Bの30日、Cの両資格、Dの-1日、Eの31日、Fの停止、Gの未登録、Hの資格なしという入力と各相談の条件判定を明示する（candidate 31–42行）。不成立の応答・記録・再申請を未決とし拒否を断定しない。A対Dは日付だけが0/-1日、B対Eは30/31日、A対Hは資格だけが異なり、具体的な境界・資格差を示す。ただし44行の「BとFでは停止状態」「AとGでは登録」が違うという一軸比較は事実と異なる。Bは30日/Fは1日、Aは0日/Gは1日でもある。停止・登録による違いを単独で説明する比較としては成立せず、例の差分確認という依頼を損なう。表の行自体が原典未決を決めたわけではないが、独立軸を正確に示す guidance の examples 条項に対するNG。
- C-02：原典規則9行の不成立時の応答・記録・再申請、希望日の変更の未決はcandidate 27, 38–44, 56–64行に可視のまま残る。種別は「原典で未決」、人間状態は要確認、候補・未承認、再質問しないという旧版の保留も保持。表の「不成立」は条件判定であって受付拒否を意味しない。C-02本文60行は未決定義と比較表へ戻る。
- C-03：原典の案内When/How/Result 42–54行に対し、candidate 70行は受付後、その相談の依頼者に担当窓口と次の連絡方法が説明される保証を一度置き、80行が戻る。甲に窓口と方法を告げる場合と、窓口だけで方法を欠く場合（74行）は、説明内容の観察差を示す。相手が正しいことだけから説明内容全体の成立を推定していない。固定文や自動理解判定を規定しない原典範囲も保つ。
- C-04：原典How 50行の「その相談の依頼者」という対応と旧版125–131行の限定期待に対し、candidate 70行は相談Aの相手を他相談の相手に置換しない保証をC-03と別に定義し、88行が戻る。甲への案内を乙への説明に置換した74行の例は、正しい相談・依頼者の対応を具体化する。この対比例だけでC-03の内容保証全体を満たしたとは述べていない。要修正と人間フィードバックを保持し、相手以外への配布一般や誤案内後の処理まで拡張しない。

旧版のID C-01～C-04、状態 確認済み／要確認／未レビュー／要修正、C-01の導出分類・AI確度・関連業務・`test_acceptance::test_inclusive_window`と最終実行結果未収集、C-02の未収集・未承認、C-03の未収集、C-04の既存証拠なしとフィードバックは候補内に残る。旧版の公開固定URLとrevisionもそのまま。テストの内容や実行の真偽は検証していない。

## 判定の分離

**NG（修正根拠あり）：** C-01の確認済み保証と例に旧限定範囲外の「対応対象」を追加したこと（candidate 25, 35–37, 50行。旧checks 48–52行、原典Result 32行、guidance「For presentation-only updates」「Meaning-preservation audit」）。比較説明でB/F、A/Gを一軸差として扱ったこと（candidate 35–44行、guidance「Conditions, expressions and examples」の独立軸・具体差分）。候補は編集していない。

**原典未決：** 条件不成立時の応答・記録・再申請、希望日変更（README 9行）。candidate は未承認のまま可視であり、本レビューから受付拒否や変更結果を決めない。新たな人間決定は要求しない。

**任意提案：** C-01の旧限定期待と原典の「対応対象」を混同しない表示に戻し、後者を別途扱う必要がある場合は依頼範囲・人間レビューの扱いを明示する。比較を一軸にするなら同じ日数差の行を用いるか、44行で複数軸が異なることを正確に述べる。これは修復作業の指示ではなく、レビューの根拠付き提案である。

**未実施・限界：** Markdown の実際のGitHub描画・折返しと人間の理解容易性は確認できず、テキスト上のフラグメント・構造だけを確認した。公開固定URLの到達性と当該revisionの内容、実装・テスト・実行結果は指定により確認していない。報告後の候補修正と再レビューも実施していない。このため現候補を「Consistency gate通過」や人間承認済みとはしない。
