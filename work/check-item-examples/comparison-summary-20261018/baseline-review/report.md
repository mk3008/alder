# Alder Consistency review — baseline

## 対象と設定

- 操作：読取専用のConsistency review。候補の編集、修復、再帰レビュー、人間承認は行っていない。
- 候補：`matrix-baseline-packet/candidate.md`。依頼で指定された公開版 `38cf3ac7ea6d7e802daddc3483c42bbed0455bcb/work/check-item-examples/index-diagnostic-20261018/run/checks-final.md` からの原文コピーとして受領した。公開元との同一性は、このpacketの外を読まない制約により独立検証していない。
- 正本：`matrix-baseline-packet/work/check-item-examples/fixtures/README.md`（合意済みと明記、3行）。更新前：同ディレクトリの `checks.md`。人間フィードバックとして読めるものはその46行の記述のみ。
- Alder Plugin `0.4.8`（同梱 `plugin.json`）、指定された公開Skill/bundle版 `d7f84fcca636e88015b15b9da993b200abd62999`、authority `1584c9e1db3437eac5fa35f82a951cc9a28922f3`（同梱 `provenance.json`）。同梱adoption、traceability、c3、promptおよび診断スクリプトのSHA-256は `provenance.json` の値と一致した。公開コミットの実在やpacketと公開版との同一性はネットワーク禁止により別途確認していない。
- 要求設定：`gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。この設定の依頼は受領したが、実効モデル・effort・forkの独立attestationは利用できない。以下は渡された資料に基づく独立読者の結果であり、実効設定を検証済みとは主張しない。

## Pass 1 — 原典のActivity名、参照、単一性

README.mdの宣言は12行の `# Activity 相談を受付する`、34行の `# Activity 次の連絡方法を説明する`。候補のindexの生ラベル（7–8行）とH2の生見出し（10、72行）はそれぞれ `相談を受付する`、`次の連絡方法を説明する` で、接頭辞 `Activity` を表示名に混入させず、宣言されたActivityNameと文字どおり一致する。同梱 `check_activity_names.py --design .../README.md --checks .../candidate.md` の終了コードは0、`declared`、`headings`、`index` はこの2値、`mismatches` と `target_issues` は空だった。診断は名称・狭いリンク形だけの検査であり、意味や必須の共有参照を証明しない。

原典の相談受付（README.md 20、28、32行）にはC-01の受付成立保証とC-02の受付条件不成立時の未決が属する。連絡説明（42、50、54行）にはC-03の窓口・方法の説明とC-04の「その相談の依頼者」という相手の同一性が属する。候補indexの7–8行は各IDをその唯一の主本文へ直接リンクし、H2とH3の階層・並びは一致する。C-01の結果は後段の前提だが、そのことだけでC-01自体を後段にも共有する根拠はない。C-01～04は各一つの本文・状態で、重複した共有IDや不足した別Activityへの必須リンクは見当たらない。C-04は「要修正」、C-02は原典由来の未決事項として明示されている。

## Pass 2 — 原典の一般保証、例、更新前の保持

- README.md 7–8、20、28、32行から、登録済み、本人または委任済み代理人（両資格可）、非停止、同じ暦の日付で0～30日を両端含む相談について、受付担当者が入力を受け受付条件を確認し、**その相談**が受付済みになる。C-01の主条件・操作・結果（18–27行）はこの一般範囲と対象を保つ。0日・30日・両資格の例（33–35行）も範囲内。例の値が主条件を狭めていない。受付後に次の連絡方法を説明できる接続は候補7–8、46、80行にある。
- README.md 9行は不成立時の応答・記録・再申請と希望日の変更を未決とする。C-02の主条件・未承認の結果（51–57行）、31日の例（61行）、保留（65行）はこれを勝手な拒否・記録状態へ確定していない。C-01も39行で重なりを除外している。保留済み事項を再質問する必要はない。
- README.md 42、50、54行の受付後の案内、**その相談の依頼者**、担当窓口と次の連絡方法はC-03の主条件・結果（80–82行）とC-04の相手の同一性（100–102行）に別々に保持される。C-04のA/甲、B/乙の例は対象を取り違えない保証を具体化している。README.md 50行の固定文面・自動理解判定の非規定もC-03の例と参照（86、92行）で触れられる。
- 更新前checks.mdのC-01～04のID、各一般期待結果、人間状態（順に確認済み、要確認、未レビュー、要修正）、C-01の代表テスト名と最終実行未収集、C-02～04の証拠不足は候補に保持される。C-04の「対象の区別が読みにくい」という人間フィードバックも111行に残る。更新前の意味を正本へ昇格させず、README.mdとの照合にも上記の範囲で矛盾は見つからなかった。C-01のテストの存在・assertion・実行結果は指定資料からは検証できず、候補自身も最終結果未収集と記す。

## 根拠付きNG（説明規則への不適合）

1. **候補3行の原典リンクが指定packet内の正本を指さない。** `../activity-index-packet/work/check-item-examples/fixtures/README.md` を候補の配置から解決すると `matrix-baseline-packet` の外へ出る。一方、このレビューに与えられた正本は `matrix-baseline-packet/work/check-item-examples/fixtures/README.md`（1–55行）であり、更新前checks.md 3行も同じディレクトリのREADME.mdを原典とする。traceabilityの「Before returning a draft or update」は参照先・source labelを実際の参照版に照合し、更新時は確立したURL/版を根拠なく置き換えないよう求める。公開元配置での相対リンクの成否は検証不可だが、**今回渡された候補と正本の組**では原典へのリンクとして解決できない。リンク先を推測で変更せず、元の配置・確立した参照版を確認してから修復する必要がある。
2. **比較可能な境界例がActivity内の共有比較になっていない。** 候補の同じ受付ActivityでC-01の0/30日成立例は33–35行の表、C-02の31日不成立・応答未決例は61行の別の短文にあり、行→CheckのリンクとCheck→共有表の戻り先もない。traceabilityの「Conditions, expressions and examples」は共通評価軸を持つ成立・不成立をActivity内のCheck本文より上の共有summaryで比較し、各行から該当IDへ、各Checkからsummaryへリンクするよう求める。日数、利用者資格、停止状態、受付条件の判定という共通軸を保ちつつ、31日は範囲外と判定できても応答・記録・再申請は未決であることを別列で示すべき箇所である。これは表現・ナビゲーションのNGであり、31日の拒否処理を新たに決める指摘ではない。

## 未決・状態、任意提案

- **未決（新しい決定要求なし）：** C-02の不成立時の応答、記録、再申請、および希望日の変更はREADME.md 9行で未決で、候補39、57、65行にも保留された。C-04の要修正は元の人間フィードバックが残る状態であり、この読取レビューは修正完了や人間確認を認定しない。C-03の未レビュー、C-01の確認済みも維持する。NGは新たな人間レビュー状態ではない。
- **任意の明確化：** C-03の「説明内容を判定する自動方式は未決」（92行）は、README.md 50行の「固定の説明文や自動理解判定は規定しない」と語の対象が違う。更新前checks.md 38行にもあった記述なので今回の保持違反ではないが、どの判定を指すかが読者に紛らわしい。原典の非規定事項をそのまま説明する表現がよい。これを自動判定方式の新たな業務決定にはしない。

## 未実施・検証限界

- 画面表示・GitHub Markdownの実レンダリング、折返し、表幅、人間の読解テストは利用できず未実施。文字列、見出し、相対参照の検査だけで人間可読性の合格とは判定していない。
- packet外、公開元、他の出力、過去レビュー、正解見本、ネットワークを見ていない。候補3行の元の配置におけるリンクの実在性や公開コピーの同一性は未検証。参照根拠は同梱fixtureの行で確認し、外部URLは踏んでいない。
- 実装・テスト・実行ログを読まず、Test証拠の実効性、全業務ケース網羅、業務上の人間承認は検証していない。原典の定義済み範囲と記載された未決を対象とするConsistency reviewである。

## 受領した依頼prompt全文

```text
AlderのConsistency reviewだけを実施してください。/workspace/scratch/0261bb5be107/matrix-baseline-packet のAGENTS.md、plugins/alder/skills/alder-draft-check-items/SKILL.mdと必須参照を読み、candidate.mdを合意済みBD work/check-item-examples/fixtures/README.md、更新前checks.mdに照合してください。Skill/bundle公開版d7f84fcca636e88015b15b9da993b200abd62999、authority1584c9e1db3437eac5fa35f82a951cc9a28922f3、candidateは公開38cf3ac7ea6d7e802daddc3483c42bbed0455bcb/work/check-item-examples/index-diagnostic-20261018/run/checks-final.mdからの原文コピー。指定packet以外・他の出力・過去レビュー・正解見本・ネットワークは参照禁止です。読取専用で編集/修復/再帰レビューはしないでください。二つのsource-led passesと保存版の検査を実施し、根拠付きNG、未決、任意提案、未実施/検証限界を区別してください。結果は /workspace/scratch/0261bb5be107/matrix-runs/baseline-review/report.md。prompt全文、入力/版/要求設定gpt-6-sol medium fork none、実効設定の独立attestation不可も含めてください。画面表示は利用できない場合その限界を明記し、文字検査だけで人間可読性を合格にしないでください。ファイルの公開や人間承認の代行はしないでください。
```
