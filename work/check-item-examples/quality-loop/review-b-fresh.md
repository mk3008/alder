# Alder Check 整合性 Fresh review

レビュー担当 agent ID：`/root/quality_fresh_review`。依頼されたモデル：`gpt-6-sol`、reasoning effort：`medium`。有効な実行時設定を独立に検証したものではない。指定された公開ソース改訂：`525a39db6ec43c196c5b927dbc1b9c3cf32f08c6`。対象は提示された `product/design.md` と `product/checks.md` の読取時点の全体である。Check の人間レビュー状態や業務上の意味を承認していない。

## 根拠のある記述規則不適合（NG）

1. **PR-11 の金額差の例が、未決の成立条件を既決の結果として示す。** 場所：`product/checks.md` L305–315、特に L307 と L311。適用規則：`check-item-traceability.md`「Conditions, expressions and examples」は、未決の値・条件から成功を作らず、例の結果に関係する入力と判断を明示し、制約と未指定の応答を分ける。業務設計 L291–314 は実購入金額の入力と購入結果を定めるが、希望購入金額との差を許すか定めない。Check 自身も L311・L315、PR-U04 L345–355 で差額の扱いは未決とする一方、希望額12000・実額11000という差額のある組合せを条件として「11000と購入日時が記録される」と断定する。**影響：** 差額がある購入結果登録の可否が未承認なのに、例と主たる期待結果からその組合せで登録が成立するテスト・実装オラクルを作れてしまう。金額差を許すか、条件つきの例に留めるかは業務設計の確認事項であり、レビュー側で決めない。

2. **PR-02 の行為が成立済みの結果を前提にする。** 場所：`product/checks.md` L48–50。適用規則：同ガイド「Conditions, expressions and examples」は、行為を前提条件と観測結果から分け、「register the request」が登録成功を前提にしないよう求める。業務設計 L153–168 は「新しい購入申請として登録する」手順と、成立した申請に情報が保持される結果を分ける。Check は条件で「対象R1の購入申請を登録する」、行為で「対象R1を成立させる」と書き、期待結果の前に成立を含める。**影響：** 保持されるべきデータの独立した期待が、成立を言い換えた前提に埋もれ、未成立時の扱いと成立後の保証を取り違えやすい。これは文面上の規則違反であり、失敗時の業務結果そのものをここで決める指摘ではない。

3. **PR-01 の比較表の二行目が結果に関係する入力を前行から継承する。** 場所：`product/checks.md` L29–32。適用規則：同ガイド「Conditions, expressions and examples」は、各例の関連入力・対象と判断を明示し、前行から継承しないことを求める。二行目の「申請者Aが同じ内容を再び登録する」は品名・数量・希望額・理由を一行目への相対参照だけで表し、同一要求の判定範囲も未指定である。業務設計 L147–168 は四入力を必須とし、L21 は一意識別を定めるが重複要求の扱いは定めない。**影響：** 単独で参照した例の条件が不明瞭になる。二行目が重複を未決としている判断自体は適切であり、重複禁止の規則を要求するものではない。

## 未決の業務上の意味（NG や承認ではない）

- PR-U01（L78–98）：必須四入力の値域・欠落時の業務結果。業務設計 L147–168 は必須と成功時の結果まで。空白、0、負数、小数等の成立可否は未定義。
- PR-U02（L168–188）：金額による承認者・段階。業務設計 L33–48 は今回の対象外として明示する。追加するなら適用範囲・段階・`approved` への到達条件を業務設計で先に判断する必要がある。現行 PR-04/06 にその経路を読み込まない。
- PR-U03（L252–272）：却下理由の欠落・空白・値の妥当性と不成立時結果。業務設計 L242–265 は理由必須を示すが失敗時の状態を定めない。
- PR-U04（L339–359）：実購入金額の値域、希望額との差、欠落時・無効時結果。業務設計 L291–314 は購入と登録の通常結果まで。上記 PR-11 の例がこの未決事項と衝突する。

## 任意の提案

- PR-05（L134–136）、PR-08（L217–219）は条件と行為の両方に「承認する」「却下する」を置く。観測対象を分かりやすくするため、条件には選択・判断・入力、行為には承認／却下の試行を置く表現を検討できる。これだけで新たな業務結果や明白な不適合を主張しない。

## 実施した照合と限界

四つの Activity、通常 Check 12件、未決候補4件について、業務設計の Scope・ロール・Object 情報・各 Activity の When/Input/Procedure/Output/Result・業務相関を通読して照合した。Activity 名、四列表、見出し階層、各 ID の一次項目とレビュー状態、候補の種別・起源、Check への索引リンクと文書内リンク、出典行範囲、期待結果の独立性と後続接続を点検した。各 Activity 名は業務設計 L123、170、218、267 の宣言と一致する。`submitted`→`approved`／`rejected`→`purchased` と `rejected` の購買対象除外は PR-01/04/07/09/10 の期待と整合し、日時・理由・実購入金額・後続取扱いも該当 Check に現れる。人間レビュー状態は通常項目が未レビュー、候補が要確認で、Test 未収集とは分離されている。ID の重複した主本文、永久的な Code 対応付け、明らかな存在しない見出しリンク、宣言外の Activity 略称は見つからなかった。

各「業務設計 L…」表記は提示された `product/design.md` の行で内容を照合したが、Check 冒頭の別パス `generation-candidate-v3/business-design/purchase-request/README.md` と改訂 `b7de3bf013e9133d72384ec5ffb26f66d4fdbfe9` が、その提示ファイルと同一内容であることは検証していない。指定公開改訂 `525a39db6ec43c196c5b927dbc1b9c3cf32f08c6` におけるその別パスの実体・リンク到達性、GitHub レンダリング、実装、Test、過去版との差分、人間の確認履歴は調べていない。したがって参照改訂の不一致を断定せず、提示二ファイル上の対応に結論を限る。出典不明の追加保証や網羅性、人間承認は証明していない。ファイルとレビュー状態は変更していない。

## 読んだパス

- `/workspace/scratch/0261bb5be107/return-quality-comparison/AGENTS.md`
- `/workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/skills/alder-draft-check-items/SKILL.md`
- `/workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md`（全文）
- `/workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/skills/alder-draft-check-items/references/adoption.md`（見出し一覧と required Check から optional Functional Interface の節まで）
- `/workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/skills/alder-draft-check-items/references/provenance.json`
- `/workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/plugin.json`（導入版 0.4.8、参照権威改訂 `a3821d3d14dabd568a0d6da93b706dc251e24d0b`）
- `/workspace/scratch/0261bb5be107/return-quality-comparison/product/design.md`（全文）
- `/workspace/scratch/0261bb5be107/return-quality-comparison/product/checks.md`（全文）

## 依頼プロンプト（全文）

> Use alder-draft-check-items at /workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/skills/alder-draft-check-items/SKILL.md in Consistency review-only mode. Read its required bundled references, AGENTS.md, product/design.md and product/checks.md under return-quality-comparison. Pinned public source revision 525a39db6ec43c196c5b927dbc1b9c3cf32f08c6. Review the whole Check artifact against the whole Business Design and applicable description rules, meaning authority, granularity, scope and traceability contracts. Report evidenced nonconformance separately from undecided business meaning and optional suggestions. Do not edit artifacts, approve meaning, or change review states. Write only /workspace/scratch/0261bb5be107/quality-fresh-review.md with findings (location, applicable rule, source evidence, effect), actual checks/limits, read paths, your agent ID, and this full prompt verbatim. Do not read any other outputs, prior evaluation reports, accepted specimens, answer keys, root issue or files outside this packet except your own report; no network/other agents. Requested model gpt-6-sol, reasoning medium. This is a new Fresh context; do not claim independently attested effective runtime settings.
