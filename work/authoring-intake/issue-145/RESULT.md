# 採否に影響する背景だけを確認する

**背景を知ると、その案の採否が変わり得るなら、草案化の前に確認する。** この採用済みの判断原則を、既存Authoring入口と正式authorityへ実装した。

会話や業務設計書にある背景は聞き直さない。決定済み・外部制約で固定された手段の採否は蒸し返さない。手段だけの依頼で検討案か決定事項かも不明な場合に限り短く確認し、具体的な矛盾は残す。未決事項があっても、先に進められる既知範囲の草案を一律に止めない。

[Draft PR #146](https://github.com/mk3008/alder/pull/146)に実装・検証を保存した。Plugin **0.4.1開発版で、未リリース**。公開済み0.4.0、既存10 Skills、安定版のインストール先は維持した。新Skill・必須欄・仮業務状態は追加していない。merge、tag、release、登録Pluginの更新は実施していない。

## 変更した範囲

- `docs/adoption.md` に判断原則を一箇所で定義し、既存Authoring Skillがその入口条件を適用する。
- `business-design/alder/README.md` の業務設計の受領・草案化を同じ原則へ整合する。既存の人間合意、Draft / unconfirmed、具体的Problem / Pain後のOptimizationとの境界を保持する。
- adoptionを同梱する3 Skillsのコピーとprovenanceを更新した。他のSkillsはpackage版の表示だけを更新し、機能・write境界を変えていない。
- 後続版をPRで検証できるよう、旧0.4.0固定のCI検証を調整した。公開jobはpackage版が0.4.0である場合に限り進むため、0.4.1を自動公開する経路は追加していない。既存tagを移動しない検査も保持する。

## 固定版と再現記録

- base：公開済みPlugin 0.4.0、`554414c2df623ecb23ef724624f8e1920d5f1d23`
- 正式authorityの固定版：`aa950a7c29366e33c281803b086c3e00c9769933`
- 実装・ケースを公開してから検証した版：`541fc89ae65cf35e1e2e6e2a711b521aa4a9764e`
- [ケース](cases.md)、[事前の対象確認条件](protocol.md)、[入力hash](source-manifest.json)、[公開用の実験指示・設定・出力hash](runs.json)、[raw応答](raw-intake.md)、[ケース別観測](observations.json)

要求model / effortは `gpt-6-sol` / `medium`、履歴forkなし。実効runtimeの独立確認、token数、課金額は得られていない。公開用promptは実験に必要な指示を保持し、実験外の実行情報を省き、ローカルパスを中立化している。完全なruntime promptの再現は主張しない。

## 6ケースで確認したこと

| 入力 | 観測した入口の挙動 |
| --- | --- |
| CSVという手段だけ | 採用済みか検討案かを短く確認し、検討中の場合に背景を求めた |
| 背景と未採用状態が既知 | 同じ目的・採否状態を聞き直さず、依頼された候補草案を作った。他案比較は行わなかった |
| 採用は確定、過去の理由は省略 | 選定理由を再質問せず、決定内容の草案へ進んだ |
| 新規業務、再貸出は後で判断 | 貸出と返却の既知範囲を先に返し、再貸出は今回は回答不要とした |
| 外部I/FでCSVが固定 | 採否を蒸し返さず、既存の精算・受領証の用語と交換を維持した |
| 採用済みだが条件が矛盾 | 採用は保持し、購買開始が発注を含むかという具体的な矛盾だけを尋ねた |

これは**一つの独立context内の6件の初回応答**であり、6独立試行や確実な自動判別の証明ではない。元研究のA/B/Cや純粋Whyの試行は再実行していない。実装した判断原則の対象回帰であり、効果量や優越の比較ではない。

草案全体の正しさも保証しない。T3の照合と登録の順序表現には、元の手順と意味が変わらないか確認する余地がある。T5のfixtureは受領証記録の主体を受動形で記述しているため、応答が記録担当を未指定としたことを「既知の担当を再質問した失敗」と断定しない。こうした初回草案の確認点と、入口の判断原則が適用されたことは別である。後続対話、人間の合意、実運用での負荷や効果は未検証。

## 検証

[独立した差分レビュー](diff-review.md)ではblocking defectなし。authority / Skill / 3つの同梱コピー・provenance、10 Skills、版表示、0.4.0専用公開境界とtag不変性を確認した。行動確認とは別のsource reviewである。

[ローカル検証記録](checks.json)：

- package / CLI / release mock：13 tests成功
- Graph：44 tests成功
- drift：12 tests、26 scenarios成功
- Skill形式検証：10件成功
- diff whitespace検査：成功

実装固定版のGitHub CIも [Plugin package](https://github.com/mk3008/alder/actions/runs/37198147607)、[Business Graph](https://github.com/mk3008/alder/actions/runs/37198147587)、[Plugin release tagのvalidate](https://github.com/mk3008/alder/actions/runs/37198147605)が成功し、release jobはskipだった。CodeRabbitのDraft時successを内容レビューとして数えない。

実クライアントのSkill routing、登録Pluginへの反映、実利用効果は確認していない。今回の成果はレビュー可能な開発版であり、releaseや利用者の業務意味を自動承認するものではない。

## 研究からの接続

[研究PR #142](https://github.com/mk3008/alder/pull/142)で、Draft区別や自然なWhyだけでは変更手段に先に固定する挙動を観測した。2026-10-04に採用されたのは、その限定観測から得た背景確認の判断原則である。研究のrawを変更せず、実装は[Issue #145](https://github.com/mk3008/alder/issues/145)へ分離した。研究の採用、今回のbranch実装、merge / release、実効果はそれぞれ別の状態として扱う。
