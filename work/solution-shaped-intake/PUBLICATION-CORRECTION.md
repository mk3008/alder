# 公開する実験記録の訂正

2026-10-04。公開用のprompt・実行metadataに、実験内容と関係しない実行情報を含めていたため訂正した。

- 実験外の実行管理文を公開promptから省いた。
- ローカルの絶対パスを `<study-root>` へ置き換え、実行識別子を `responder-control`、`responder-A`、`evaluator-1` などの中立なラベルにした。
- `full_task_prompt` 等の名称を改め、公開記録が完全な実行promptであるという説明を取り消した。
- 実験上の依頼、使用可能・禁止入力、case / treatment、要求model / effort、版、rawの内容とhash、判定は変えていない。再試行による結果の置換はしていない。

[runs.json](runs.json)、[監査条件](audit-run.json)、[純粋Whyの実行条件](pure-why/run.json)、[補足監査条件](pure-why/audit-run.json)は、必要な実験内容を残した公開用記録である。実験外の実行情報を含む完全なruntimeの再現を保証しない。モデル設定も要求値であり、実効runtimeを独立に証明するものではない。

5件のraw業務応答は一切書き換えていない。[訂正前後で不変のSHA-256](raw-integrity-correction.json)を、元のrun manifestの値とも照合した。入力ケースとtreatmentも変更していない。元protocolの公開記録方針に関する文言だけを修正し、実験の操作・評価条件は維持した。

この修正は新しいcommitで行う。過去のcommitには訂正前のmetadataが残るため、履歴から消去済みとは言わない。履歴の書換えや削除は行っていない。公開用promptを見る場合は、この訂正を含む版を使う。

検証状態も区別する。CodeRabbitのsuccessはDraft PRでレビューがスキップされた状態であり、研究内容の実質的レビュー成功ではない。保存した証跡監査と同一視しない。製品testは実施していない。
