# 初稿実行記録

## 依頼プロンプト全文

> Alderでチェック項目を作ってください。合意済みの架空相談受付Business Designです。作業入力は /workspace/scratch/0261bb5be107/matrix-initial-packet 内だけ。公開固定版 d7f84fcca636e88015b15b9da993b200abd62999、authority1584c9e1db3437eac5fa35f82a951cc9a28922f3。AGENTS.mdと plugins/alder/skills/alder-draft-check-items/SKILL.md を読み、そのSkillと必須参照に従って work/check-item-examples/fixtures/README.md から日本語Check初稿を作成してください。生成物は /workspace/scratch/0261bb5be107/matrix-runs/initial/candidate-01.md、作者点検は author-check-01.md、実行記録は execution.md に保存。原典リンクは公開固定版のBD URLを使えます。初稿を保存してから作者点検を実施し、この段階では編集せず所見を返してください。独立Consistency reviewはホストが別途起動し、その後あなたに修復と再読取依頼を渡します。完成見本・既存Check・過去生成物・評価・実装・テスト・他packet・会話履歴・ネットワークは読まないでください。許可外ディレクトリの探索は禁止。プロンプト全文、読んだ入力、版、要求設定 gpt-6-sol/medium/fork none（実効設定の独立attestationなし）、実行診断と限界を実行記録に残してください。公開への書込みや人間承認の代行はしないでください。

## 版と実行設定

- 要求モデル：`gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。実効ランタイム設定を独立にattestする手段はなく、要求値として記録する。
- 公開固定版：`d7f84fcca636e88015b15b9da993b200abd62999`。原典URLはその版の `work/check-item-examples/fixtures/README.md` とした。URLへのネットワーク照合は実施していない。
- Alder authority revision：`1584c9e1db3437eac5fa35f82a951cc9a28922f3`。packet内 `provenance.json` の値と一致。インストール版：plugin.json `0.4.8`。plugin commitは独立確認していない。
- authority内の参照digest：traceability `d8897a0a42fc00aeb95cb2798ce7316c6a6c0f37edf7d0305d433dd3fb9d1c89`、adoption `2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3`、c3 `a5c3874601d70edf87e1fc79b5501be80c35aa4f98d3870a545b79f4867f8446`。ローカルSHA-256もこれらと一致。

## 読んだ入力

すべて `/workspace/scratch/0261bb5be107/matrix-initial-packet/` 以下のみ。

| 相対パス | 用途 | ローカルSHA-256 |
| --- | --- | --- |
| `AGENTS.md` | プロジェクト指示 | `29b2c0fe7b5da19414f3a274eb8f4780fd2b4b2e89627a8a1bd8e66a3611bf7f` |
| `plugins/alder/skills/alder-draft-check-items/SKILL.md` | 適用Skill | `2bd80b0a38d70600e5f7168cdde6188b3a39840bcfa466a36b64576c1f06fc82` |
| `plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md` | 必須参照全文 | `d8897a0a42fc00aeb95cb2798ce7316c6a6c0f37edf7d0305d433dd3fb9d1c89` |
| `plugins/alder/skills/alder-draft-check-items/references/adoption.md` | 必須参照、該当節とFunctional Interface節まで | `2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3` |
| `plugins/alder/skills/alder-draft-check-items/references/candidate-c3.md` | 初稿導出参照全文 | `a5c3874601d70edf87e1fc79b5501be80c35aa4f98d3870a545b79f4867f8446` |
| `plugins/alder/skills/alder-draft-check-items/references/provenance.json` | authority記録 | `751b4562bfe20432875135b06e51601e9a1df5e7b8bc021c96145530d8257aa3` |
| `plugins/alder/plugin.json` | インストール版 | `8831bdea6a9fb06aef307f4859f71c1f3699eda32bde3d55a15c936743b1a1e6` |
| `work/check-item-examples/fixtures/README.md` | Business Design全文 | `e00c06ef469c015120add5dc92249b53eabd496750ff9aeb1b7f9a84ab469cd0` |

最初の許可packet内ファイル列挙の出力にはSkillの付属スクリプトのパスも含まれた。スクリプト本文は読まず、Skillの指示に従って診断として実行した。完成見本、既存Check、過去出力、評価、実装、テスト、他packet、会話履歴、ネットワークは参照していない。

## 実行と診断

1. Business Design全文の二つの `# Activity`、全規則、明示的未決、二つのResultを起点に、日本語Check初稿を `candidate-01.md` に保存した。初稿SHA-256：`832e1cf5350468719d41c3d521465a84fb05a251966d6c61ceefe93e01127630`。
2. 保存後にSkill付属 `check_activity_names.py --design .../README.md --checks .../candidate-01.md` を実行。exit 0、`status: match`、宣言名・見出し・索引ラベルは二件とも文字列一致、mismatchesおよびtarget_issuesは空。
3. 保存済み初稿を読み返し、原典と現在の説明規則に照らす作者点検を `author-check-01.md` に保存した。C-03の一般範囲、C-04の独立結果と共有関係、C-02の粒度にNG所見がある。初稿は点検後に編集していない。

## 限界・未実施

- この段階の作者点検は独立Consistency reviewではない。別読者の二つのsource-led pass、修復、修復後の再読取はホストからの後続依頼待ち。NG所見の検討前に適合・承認を主張しない。
- 固定版URLの現物取得とGitHub描画、クリック可能性、人間可読性、人間の業務判断、Test証拠は未検証。ローカルの見出しテキストとMarkdownリンク文字列を点検しただけである。
- 公開への書込み、Business Designの変更、人間承認の代行はしていない。
