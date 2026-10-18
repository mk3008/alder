# 最終限定修正 — 作者実行記録

- 作業日：2026-10-18 UTC。保存先名は依頼指定の `final-corrections-20261019`。
- 要求モデル／effort／fork：親からの指示値 `gpt-6-sol`／`medium`／`none`。実効runtimeの独立したモデル・effort証明は取得できない。作業エージェント自身にはforkの実効値表示がなく、親からの要求値を記録する。
- Skill／bundle：`plugins/alder/skills/alder-draft-check-items/SKILL.md` と同ディレクトリの `references/check-item-traceability.md`、`adoption.md`、`candidate-c3.md`、`prompt.md`、`provenance.json` を読んだ。Plugin `0.4.8`。提示された公開Skill/bundle版 `ee99fd399a520abf7ba52f113f17d3c7dc090846`、provenanceのcanonical authority `e8d808902641d4571bbc5656b4b23d9e959f7636`。ローカルbundled guidanceには他作業による既存のworking-tree変更があったため、公開bundleとのバイト一致は検証していない。
- 新BD入力：`work/check-item-examples/fixtures/README.md`、SHA-256 `cfb4a60b2f1f2dade893237cbdc38b9cda1bc4c8d89e9491d77affe13dd39c91`。旧BDは `git show 5768e0fa1582a40d6d1dab92b9931fb5b4ab2aa7:work/check-item-examples/fixtures/README.md` の表示だけを読んだ。旧BD表示のSHA-256は `e00c06ef469c015120add5dc92249b53eabd496750ff9aeb1b7f9a84ab469cd0`。
- 既存Check入力：`work/check-item-examples/meaning-validation-20261018/initial/final.md`、SHA-256 `5f0ed04d946d9df17aa7fad2fbdf22dc7d87b43d5d9892bc3a131cff9ff1f68d`；`work/check-item-examples/meaning-validation-20261018/update/final.md`、SHA-256 `9796b282318df8191d0804187bd9965105bf0d4662228b7e1e08644ecbfebce9`。旧BDとこの2つ以外の業務入力／出力／完成見本／過去review・adjudication・disposition・README／実装・Test本体は読んでいない。`rg --files` によるファイル名列挙は行ったが、それらの内容は開いていない。
- 新BD公開固定版：`e8d808902641d4571bbc5656b4b23d9e959f7636`。指定raw URL：`https://raw.githubusercontent.com/mk3008/alder/e8d808902641d4571bbc5656b4b23d9e959f7636/work/check-item-examples/fixtures/README.md`。ネットワーク禁止のためURLの応答・公開版とローカルBDのバイト一致は検査していない。Markdown根拠リンクは同固定版のGitHub blobと実在見出しアンカーを使用。
- 出力：`initial-candidate-01.md`、SHA-256 `817babf252168c927b1153bef6aa8362a77340788c770088f8bf4fe93fe28fd8`；`update-candidate-01.md`、SHA-256 `14217b081248021af68b4d7f6a00d40bfab002ed0ae7bf6341926c6ad3daa403`。

## 依頼全文（親から作者への作業指示）

> root #105 / Alder PR235 の限定作者修正。作業repo /workspace/scratch/0261bb5be107/final-fix-delivery。公開Skill/bundle版 ee99fd399a520abf7ba52f113f17d3c7dc090846、canonical authority e8d808902641d4571bbc5656b4b23d9e959f7636。当該repo plugins/alder/skills/alder-draft-check-items/SKILL.md と必要なbundled guidanceを実際に読んで適用。新BD work/check-item-examples/fixtures/README.md、旧BDは git show 5768e0fa1582a40d6d1dab92b9931fb5b4ab2aa7:work/check-item-examples/fixtures/README.md だけ読む。既存Checkの入力は work/check-item-examples/meaning-validation-20261018/initial/final.md と update/final.md の2点のみ。完成見本/specimen、過去review/adjudication/disposition/README、他の生成物、実装/Test本体を読まない。
>
> 依頼: 既存初稿CI-02の「本人・14日という他の条件が同じ場合でも、停止の有無が判定を変える」は表には本人14日非停止の対照行がない。表の実在行と、原典一般則による仮定比較の区別が明らかになるよう、最小の文章修正を行う。行追加/Checkの全面再生成は不要。BDは現行形式へ移行済みなので、この2つの新候補だけ原典リンク/根拠ラベルを新BD公開固定版 e8d808902641d4571bbc5656b4b23d9e959f7636 へ必要範囲追従し、古い根拠位置が残らないか検査する。新しいraw URLは https://raw.githubusercontent.com/mk3008/alder/e8d808902641d4571bbc5656b4b23d9e959f7636/work/check-item-examples/fixtures/README.md 。業務意味、旧ID/人間状態、一般保証、共有参照、既存Test記述と未決/保留、比較例を保持。期待の追加/削除や人間承認はしない。過去入力/出力/確定hash/研究記録を編集せず、work/check-item-examples/final-corrections-20261019/initial-candidate-01.md と update-candidate-01.md に保存。作者点検、差分、要求モデル/effort/fork/公開版、依頼全文、読んだ入力hash/出力hash、実施範囲と限界を同dir author-check.md / author-execution.mdに記録。rawは安全な架空例のみ。統括は生成物を手編集しない。CLIで名称診断/リンク検査できれば実施。browser/ネットワーク/外部書込み/他ファイル変更禁止。根拠付き未解決欠陥ならそう返す。

## 実施差分と限界

- 初稿CI-02の具体例だけ、表の利用停止中の実在行と、本人・14日・非停止を他条件同一と仮定した一般則上の比較を区別した。表に行を追加していない。
- 初稿では旧固定版 `75fb043568ade8b442853421a0bc78ef999b23e1` を新BD固定版に置換。更新候補では旧固定版 `d7f84fcca636e88015b15b9da993b200abd62999` を同じ新BD固定版に置換。各根拠ラベルのWhen・How・Result、規則、未決記述は新BDに存続するためラベル文言の変更は不要と判断。
- 内容上のCheck追加／削除、旧ID、人間状態、一般保証、共有参照、Test記述、保留事項、比較例の変更は行っていない。承認は付与していない。
- GitHub画面でのrender、公開URLのHTTP応答、人間の可読性・合意は未検証。ローカルMarkdown断片と名称をCLIで点検した。

## 追加の指示と候補02

> CI-06の指摘を原典と自身の保証へ照合し、修正必要なら最小の前提表現修復を追加して別candidate-02として保存し、独立readerへaffected再読取を依頼してください。誤宛先時に成立を先取りする前提だけを除き、元ID・人間状態・結果保証を保持し、比較例や全Check再生成へ拡張しない。前候補/読取所見は残す。新たな業務判断が要るなら修復せず返す。この追加の理由と依頼全文も記録。独立readerの設定/依頼全文・読んだ入力/公開版・hashと未実施を出力して下さい。

新BDの `次の連絡方法を説明する` のHow/Resultは、その相談の依頼者に説明することを結果とする。候補01のCI-06共有条件「その依頼者へ次の案内をするとき」は宛先の正しさを結果に先立ち仮定しており、同IDの誤宛先例を条件から排除する。業務判断は不要な記述修正と判断し、`initial-candidate-02.md` に条件の宛先句だけ「その相談について次の案内をするとき」へ変えた。SHA-256 `6f23acee887e35724fb589e17b76f4372efc08906137dea9887ffafdebcfe6f4`。旧候補01と更新候補01を保存したまま、CI-06の結果、ID、状態、例、Test文言は不変。

独立readerは子エージェント `/root/final_correction_author/read_only_consistency`。設定は `fork_turns=none`、model/effort overrideなし（実効値の独立証明なし）。最初の依頼全文：

> Read-only Alder Check Consistency review for /workspace/scratch/0261bb5be107/final-fix-delivery. Read only bundled current skill guidance plugins/alder/skills/alder-draft-check-items/SKILL.md and references/check-item-traceability.md, new BD work/check-item-examples/fixtures/README.md, prior Check inputs work/check-item-examples/meaning-validation-20261018/initial/final.md and update/final.md, saved candidates work/check-item-examples/final-corrections-20261019/initial-candidate-01.md and update-candidate-01.md. Do not read other work artifacts, tests/code, completed specimens, reviews, web. No file edits. Two source-led passes: declared Activity names and shared references; BD general guarantees versus each ID and distinct examples. Check source anchor/label migration to e8d808902641d4571bbc5656b4b23d9e959f7636, states, IDs and retained mappings. Return concrete evidenced defects or no defects, limits. Focus request narrowly: initial CI-02 table has no 本人14日非停止 row, so author marked counterfactual distinction; update only source version. Avoid proposing scope expansion.

再読取依頼全文：

> Affected re-review only. Parent authorized minimal CI-06 premise repair in new saved /workspace/scratch/0261bb5be107/final-fix-delivery/work/check-item-examples/final-corrections-20261019/initial-candidate-02.md (SHA-256 6f23acee887e35724fb589e17b76f4372efc08906137dea9887ffafdebcfe6f4). Compare with candidate-01, new BD fixtures/README.md, original initial/final.md, guidance already read. Read-only, no files edited, no other artifacts/web/tests. Check changed CI-06 condition no longer assumes correct recipient, retains source How/Result guarantee and wrong-recipient example; recheck CI-02, affected shared links/name and whole requested initial scope for regressions. Return concrete evidence and unperformed checks.

readerへ指定した入力hash：新BD `cfb4a60b2f1f2dade893237cbdc38b9cda1bc4c8d89e9491d77affe13dd39c91`、既存初稿 `5f0ed04d946d9df17aa7fad2fbdf22dc7d87b43d5d9892bc3a131cff9ff1f68d`、既存更新 `9796b282318df8191d0804187bd9965105bf0d4662228b7e1e08644ecbfebce9`、候補01 `817babf252168c927b1153bef6aa8362a77340788c770088f8bf4fe93fe28fd8`／`14217b081248021af68b4d7f6a00d40bfab002ed0ae7bf6341926c6ad3daa403`、候補02は上記。公開原典版は `e8d808902641d4571bbc5656b4b23d9e959f7636`、公開Skill/bundle指定版は `ee99fd399a520abf7ba52f113f17d3c7dc090846`。readerにもネットワーク・render・実装/Test本体は依頼せず、未実施。
