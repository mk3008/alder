# Follow-up JSON入口候補の独立確認

対象: `candidate-followup/plugins/alder/skills/alder-follow-up-review/SKILL.md` とbaselineの冒頭差分、固定Mölkky Check入力。製品・Skill・成果物は変更していない。

## 観測

- 差分は冒頭の入口1段落のみ。選択されたJSONを `alder-manage-json-documents` の公式validatorへ通し、未知・独自形式は保存対象とせず原本保持と読み取り専用の根拠準備を返す。Markdown入力の経路、review-only、明示許可されたJSON commitのID・人間状態・正確なBD版の保存条件は同じ段落内に残る。
- 固定入力の `format: molkky-research-check-items`, `format_version: "1"` をcanonical `node alder/tools/document_storage/cli.mjs validate eval-inputs/molkky/check-items-draft.json` で検証すると終了コード2、`Legacy JSON version required`。正式パッケージの検証成功ではない。
- `eval-inputs/molkky/check-items-draft.json` とafter `agent-output/candidate-followup-input/check-items-draft.json` はSHA-256 `584aa36748f4465dc2f9a8e1826750e116b8457923c7850e3e733fe2d339b808` で同一。revision `check-draft-0.37`、人間状態CI-08/41/71 `未レビュー`、CI-63 `要確認` を維持。準備メモは未保存の候補対応と明示し、validator失敗を記録する。
- before `agent-output/followup-input/check-items-draft.json` はSHA-256 `b61c0cd0ce921cb88bccef4d5beccb7253b443cf263134dbc7d4ec0ed19031d9`、revision `check-draft-0.38`。CI-08/41/63/71の4項目に差分がある。人間状態に差分はない。この独自形式の直接更新を、候補は正規保存成功と扱わない。
- 準備メモは独立レビュー原資料の代表場面・テスト証拠・残る範囲を区別し、保存済みCheck↔Test対応・実人間確認・製品受入れを主張しない。追加の必須台帳や承認条件は入口差分にない。

## 判定と限界

候補は固定入力に対して形式誤認を防ぎ、既存の型付きJSON validator/guarded-save経路を指示する。Markdown互換、人間状態、意味判断の権限を弱める差分はない。未知形式のCheck↔Test対応は未保存のままで、実際の保存には別途サポートされた経路が必要。文言上のガードと一例の成果を確認したもので、ホストのSkill routingや実効モデル設定を実証していない。
