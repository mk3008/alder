# Issue #71 — Velvet Fresh Agent試行

最新の採否は[historical backtest](issue-71-historical.md)。以下の試行結果・当時の判断は変更せず、後の証拠による採否変更を別記録とする。

[追加コメント](https://github.com/mk3008/alder/pull/72#issuecomment-5746501730)に従い、生成と評価を分離して1回実行した。**候補2件はいずれも既存Decisionで既決（A）。有用な未決論点は0件で、採用条件を満たさないためexperimentalを維持する。** 独立生成を実施したこと自体を、探索promptの独立した効果の証明にはしない。

## 入力と実行条件

| 項目 | 固定した内容 |
| --- | --- |
| 対象 | Velvetの設定済み転送の実行。業務相関レビュー完了済みの設計を対象とする |
| Velvet版 | main `6b64e3b99845a315a394fee8e500564c3631e2af` |
| Alder版 / prompt | `f428ef40b5045abadcacaef7bd08eb79897dbcff` の functional-considerations.md、byte同一 |
| 生成担当 | `/root/velvet_fresh_discovery`、`fork_turns=none` |
| モデル / effort | 要求モデル `gpt-6-astra`。effortは指定を省略して継承。実ランタイム値の独立証明は未取得 |
| 入力6ファイル | prompt、SYSTEM_SCOPE、Transfer Execution Process、対応DFD、defined Concept全16件の本文投影、Business Design入口末尾の確定済み共通前提 |
| 除外 | Issue71/PR72の議論・結果、既存Check、過去レビュー、Decision、実装・テスト、既知の候補例。リンク先も辿らせない |
| 回数 / 追加指示 | 1回。内容フィードバック・再生成・生成後のprompt修正なし |
| 評価担当 | `/root`。履歴を知る評価側が、生成終了後に原本を分類 |

Concept投影は全statementのID/text、summary、全externalRelationshipsのto/kind/reasonを含み、論点別の選別はしていない。reviewStateや重複するナビゲーション情報は省いた。Scope/Process/DFDはbyte同一で保存した。Conceptがdefinedであることを確認したが、全運用条件の完成・本番承認まで推定しない。

入力は専用ディレクトリへのallowlist指示で分離した。共有ファイルシステムをOS権限で遮断した実験ではない。生成担当のread logは指定6ファイルの全文読み取りのみを記録し、外部URL・その他の参照はない。文書外の知識は一般知識からの推論として出力に明示している。

## 全候補と採否

| 候補 | 分類 | 評価 |
| --- | --- | --- |
| FC-01: 別キーの失敗後に先行キーの成功分を残すか | A: 既決 | Decision0002/0013は全workの原子的確定を定める。入力に答えがないことは製品として未決であることを意味しない |
| FC-02: 設定更新と実行が重なる場合の設定版 | A: 既決 | 設定ロック・再取得・変更拒否で決まっている。条件付きの設定編集環境を理由に既存境界を問い直さない |

A=2、B（既知の重要な未決論点の再発見）=0、C（有用な新規未記載論点）=0、D（実装方式のみ）=0、E（遠い仮説等）=0。生成側が既決として閉じた9項目・見送った5項目は発見数へ加えない。詳細は[全候補の評価と固定版根拠](../../work/behavior-derivation/issue-71/fresh-velvet/assessment.md)。既存テストは証拠として読んだもので、この試行では実行していない。

人間が検討する価値のある未決論点を1件以上という事前条件は未達。工程を標準採用せず、[実験用入口](../adoption.md#optional-explore-undocumented-functional-conditions)を維持する。既決事項を例なしで挙げられたことは観察事実だが、未決論点の発見とは区別する。候補を要件やTest期待値へ転記しない。

## 再確認できる記録

- [生成前の評価条件](../../work/behavior-derivation/issue-71/fresh-velvet/records/protocol.md)と[生成指示全文](../../work/behavior-derivation/issue-71/fresh-velvet/records/launch.txt)
- [使用入力原本6件のarchive](../../work/behavior-derivation/issue-71/fresh-velvet/inputs.tar.gz)、[入力・原典hash](../../work/behavior-derivation/issue-71/fresh-velvet/records/input-manifest.json)
- [出力原本](../../work/behavior-derivation/issue-71/fresh-velvet/outputs/raw.md)、[read log](../../work/behavior-derivation/issue-71/fresh-velvet/records/read-log.json)、[Agent/model/effortと出力hash](../../work/behavior-derivation/issue-71/fresh-velvet/records/run.json)
- [分類と評価根拠hash](../../work/behavior-derivation/issue-71/fresh-velvet/records/evaluation.json)、[整合確認スクリプト](../../work/behavior-derivation/issue-71/fresh-velvet/verify.py)

`python work/behavior-derivation/issue-71/fresh-velvet/verify.py --velvet ../velvet` でarchive内容、原典・原本hash、read log、候補と分類の対応を検証する。意味の妥当性・人間承認を機械的に証明するものではない。以前の証拠は従来のdiscovery/verify.pyで別途検証する。

## 限界

1機能・1回の観察であり、promptなし対照、発見率、再現性、因果効果、人間の有用性評価はない。Decisionを生成入力から外した分、既決事項を再質問し得る。入力追加でそれが減るかは未実施であり、今回の成績を補正しない。生成モデル/effortとアクセス制限の独立証明もない。今回の採用根拠不足から、手法全体の無効性までは主張しない。

探索結果を使う場合の境界は、未承認候補 → 人間判断 → 必要ならBusiness Design更新 → c3 / Atomic Check → Test。前回の[既知文脈の試行](issue-71-discovery.md)はその限界とともに残す。
