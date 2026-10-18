# Alder Check guidance 独立・読取専用レビュー

## 依頼全文・設定

> AlderのSkill/guidance改修を読取専用で独立レビューしてください。公開候補75fb043568ade8b442853421a0bc78ef999b23e1（source b3113b7c0b6915562f0ebd6892e01199510cf319、bundle a8ae2af200b7e27b3f411228ef8b02638b3c89e0）。ローカル /workspace/scratch/0261bb5be107/matrix-summary-delivery に同内容の作業コピーがありgit status/logも確認可。対象：docs/check-item-traceability.md、plugins/alder/skills/alder-draft-check-items/SKILL.md、tools/test_workflow_skills.pyと3 Skill参照bundle/provenance。AGENTS.mdと必要な関連設計/テストを読み、862d1dd6d9132147b6bcefb1202774078652fe88との差分をレビュー。要件は、一般保証を一か所に明示し各Checkから参照、個別欄/式/操作の重複必須を解消、例の具体的な観察/差を生成・Consistency reviewで検査、一般保証・安定ID・状態・未決・共有参照・Test契約を保持。Viewerと二視点実装へ拡張しない。根拠付き不具合・要確認・任意提案・未検証を区別し、/workspace/scratch/0261bb5be107/meaning-runs/guidance-review.mdへこの依頼全文/設定gpt-6-sol medium fork none/入力/診断と結果を記録。候補/Skill/テストは変更禁止、人間承認なし。他agentの出力、work/check-item-examples/meaning-review-20261018の正解見本・分析、meaning-runs内の他記録、過去の研究raw/評価、会話履歴・ネットワークは読まないでください。

要求された Fresh 設定：`gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。この実行に対する設定の実効値は独立検証していない。親から受け取った上記依頼だけを作業文脈とした。

## 入力と範囲

- 公開候補ID：`75fb043568ade8b442853421a0bc78ef999b23e1`。公開候補 `75fb043568ade8b442853421a0bc78ef999b23e1` のGit objectを確認した。source `b3113b7c0b6915562f0ebd6892e01199510cf319`、bundle `a8ae2af200b7e27b3f411228ef8b02638b3c89e0` と区別し、公開候補全体を `862d1dd6d9132147b6bcefb1202774078652fe88` と比較した。公開候補で追加された `work/check-item-examples/meaning-validation-20261018/short/source.md` は依頼対象外であり読んでいない。
- 読んだもの：作業コピー直下 `AGENTS.md`、上記対象ファイルの固定コミット差分と周辺本文、`tools/test_plugin_references.py`、`tools/export_plugin_references.py` の関連箇所、`alder-explore-functional-conditions` と `alder-follow-up-review` のSkill入口。禁止された出力・研究記録・ネットワークは読んでいない。
- 作業コピーの状態は並行作業で変化したため、候補テストの診断は `git show 75fb043:<path>` から直接読み出したコードに固定した。禁止された未追跡ファイルは読まず、対象ファイルの編集なし。

## 根拠付き不具合

- 公開候補に対する確定的不具合は見つからなかった。中間bundle commit `a8ae2af2` には、旧文言を要求する既存assertと改稿済みガイドの不整合があったが、**公開候補 `75fb043` は修正済み**。当初これを候補の不具合として親へ速報したため訂正した。`75fb043:tools/test_workflow_skills.py` の `test_current_check_presentation_guidance_is_reachable` は「kind and decision with that ID」と「condition and expectation uniquely reachable through an explicit guarantee reference」の2文をともに検査する。文言assertの形式的限界は変わらないが、以前のcondition/expectation保持要求を消して弱めた変更ではない。

## 要確認

- 公開候補について、ビジネス意味の要確認事項は見つからなかった。中間commitのテスト不整合も公開候補では解消している。

## 任意提案

- 共有Checkが複数Activityに属する場合の「Activity内に一般保証を一度定義する」配置について、単一primary bodyと唯一の保証定義を維持し、他Activityはその定義へリンクする例を短く添えると誤複製を避けやすい。現行の「one primary body」「unique definition」「shared Check」の規則を合わせれば解釈できるため、現時点でNGとは判定しない。

## 照合結果と未検証

- `862d1dd6..75fb043` の対象変更は、canonical guidance、draft Skill、3参照bundle/provenance、テストの9ファイル。`b3113b7c..a8ae2af2` は3参照bundleとprovenanceのみ。固定コミットのcanonical/sourceと3 bundleのSHA-256は全て `7470dc6123fd4fa0e19e864d67eb1e8f5a8c53ab1653d056dfdaeecb9cdb2ce6` に一致し、3 provenanceの source revision は `b3113b7c0b6915562f0ebd6892e01199510cf319` を指す。
- 一般保証は共有Activity proseで一度定義して各Checkから明示参照し、曖昧ならそのitemへ短い定義を移す（両方で二重定義しない）と明記。式、action、個別condition/result欄は必須ではない。生成側は具体値・関係と観察差を求め、Consistency review-only側は表と短文の両方で差、重複・欠落、overlapの部分成立を調べる。単一ID・human state、未決、共有参照、Test境界と証拠区別は周辺規定に維持されている。Viewerや二視点実装の追加は差分にない。
- 公開候補のコミットに収録された `tools/test_workflow_skills.py` を `git show` で取り出して、作業コピーのcanonical guidance/bundleに対し3件の関連テストを実行し成功（3/3）。作業コピー版のテストを直接実行した4件は並行する状態変化により旧assertで1件失敗したため、候補評価には採用しない。テストスイート全体、追加された依頼対象外のfixture、エージェントによる実際の生成・検出、人間の理解しやすさ、外部公開先の状態は未検証。文言assertは指示の配布と文字列の保持だけを確かめる。
