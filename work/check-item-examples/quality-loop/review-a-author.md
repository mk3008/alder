# Check Item 整合性レビュー（読み取り専用）

エージェントID：`/root/candidate_v3_initial`。要求されたモデル `gpt-6-sol`、推論 effort `medium`。実効ランタイム設定は独立検証していない。この作業は先行する作成者コンテキストを保持した継続レビューであり、Fresh な独立レビューではない。指定の公開ソース改訂は `525a39db6ec43c196c5b927dbc1b9c3cf32f08c6`。この改訂との内容一致をGitやネットワークから検証していない。Plugin manifestは `0.4.8`、同梱 provenance の Alder authority revision は `a3821d3d14dabd568a0d6da93b706dc251e24d0b`。

## 根拠のある記述規則違反（NG）

1. **PR-02の行為が結果を前提にしている。** `product/checks.md` L48–50では条件に「対象R1の購入申請を登録する」、行為に「対象R1を成立させる」と書き、後者は期待結果の成立を行為に含める。同梱 `check-item-traceability.md` の「Conditions, expressions and examples」は行為を前提条件・観測結果から分け、登録行為に成功を前提とさせない。`product/design.md` L151–168では新しい購入申請を登録する手順と、その結果としての記録・保持を分けている。**影響：** 成立しなかったときの検討を条件から排除し、結果を循環的に説明する。R1の同一性を残しつつ、行為を「R1として登録する」など成功を含まない表現に直せる。レビュー状態はここでは変更しない。
2. **PR-U02が明示的に対象外とした採否を再質問している。** `product/checks.md` L168–188は未決の金額別承認を残す一方、L184で「今回の対象に含めるか」を優先判断として求める。`product/design.md` L33–48はその扱いを未決定とし、今回の対象には含めないと明示する。同梱 `SKILL.md` の「Before returning Check Items」は明示的な未決を保持しながら対象外policyをCheckに強制しないことを求め、`candidate-c3.md` の「根拠の強さとレビュー」は明示的非対象を再質問しない。**影響：** 既に定めた今回の範囲が未決のように見え、不要な承認待ちを作る。金額別経路の業務上の意味は未決のまま、現在の対象外という決定を保持する必要がある。
3. **PR-11の例が自ら保留した金額差で結果を確定する。** `product/checks.md` L305–315は希望額12000と実額11000で購入結果登録を行い、実額と日時が記録されると断定するが、同じ箇所で差額による購入可否を未決と書く。同梱 `check-item-traceability.md` の「Conditions, expressions and examples」は例の結果関連入力・判断を明示し、未決の値や結果から成功を作らないよう求める。`product/design.md` L291–314には実額入力・記録はあるが差額の可否条件はない。**影響：** 差額がある購入の成立と記録を、注記の保留と矛盾した検査oracleにしてしまう。確定した通常結果と差額時の未決結果を区別して表す必要がある。PR-U04 L339–359も同じ差額を未決としている。

## 業務意味の未決（NGとは別）

- **PR-U01、PR-U03、PR-U04：** 必須入力の欠落、空文字・空白、数量・金額の0、負数、小数といった値域、実額と希望額の差や失敗時の結果は `product/design.md` L147–168、L242–265、L291–314で定義されていない。これらを否認・登録成功・無変更のいずれとも判定できない。該当IDの要確認は維持する。一般的な入力エラー形式や金額閾値は導出しない。
- **PR-U02：** 金額別の承認者・段階の中身は `product/design.md` L33–44で未決。今回のスコープには含まれない（L46–48）。将来範囲を変更するなら先にBusiness Designで決めるべき内容であり、現行Checkで閾値・経路を採用できない。
- **対象未発見、中断、重複登録：** `checks.md` L31–36、L72、L117–118、L289で一部保留されている。Business Designには応答・再選択・終了・再試行・重複可否の保証がないため、ここでは欠陥や特定結果とは扱わない。

## 任意の表現提案（NGではない）

- `checks.md` L3の長い制作・レビュー案内は、利用者に必要な「人間レビュー前」「未確認」を残して短くできる。AGENTS.md の読者向けmeta情報チェックに照らし、入力パスや制作来歴を本文にどこまで要するか検討する余地がある。これは現行Checkの業務意味の違反判定ではない。
- PR-08は却下理由と却下日時を一つの結果に含める。両方を一組の却下記録としてレビューすることも可能であり、機械的な分割をNGとはしない。人間が片方だけ採否・修正する必要が出た場合は粒度を見直せる。

## 実施した照合と限界

`product/design.md` 全314行と `product/checks.md` 全359行を読み、全4 Activity、16 ID（通常12、未決4）を、相関・ロール・Object情報・Scope・各Activityの Input/Procedure/Output/Resultと照合した。四列索引、Activityの宣言名と順序、H2/H3/H4関係、単一の項目本文、状態・未決種別、必要条件式と保証式、各通常・境界例、BD根拠、Test境界を確認した。自動的な局所確認では16 IDの重複がなく、四つのActivity表示名が一致し、内部フラグメントリンクの欠落がなく、状態は未レビュー12・要確認4・確認済み0・要修正0だった。引用行範囲はこのパケットの設計314行内に収まり、NGの主要根拠を本文と照合した。`rejected` の購買対象外というPR-09の保証は設計L31、L265と整合する。Test証拠を業務意味の承認に用いた箇所や恒久的なCode/SQL位置マッピングは見当たらない。

`checks.md` L3は別パスと改訂 `b7de3bf013e9133d72384ec5ffb26f66d4fdbfe9` を参照し、今回の指定公開改訂 `525a39db6ec43c196c5b927dbc1b9c3cf32f08c6` とは異なる。移送時の元ソース参照か更新漏れかは、禁止された元ファイル・Git履歴・URLを読まずには判定できないためNGと断定しない。行範囲を指定公開改訂に対して独立照合したとも主張しない。以前の版のCheck、Feedback、Test、実装は読んでおらず、変更前後の意味保持・Test/assertionの実証・人間確認は検証不能。レビュー対象の二つの製品ファイルは編集せず、人間レビュー状態も変更していない。

## 読んだパス

- `/workspace/scratch/0261bb5be107/return-quality-comparison/AGENTS.md`
- `/workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/skills/alder-draft-check-items/SKILL.md`
- `/workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md`
- `/workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/skills/alder-draft-check-items/references/adoption.md`（Check作成・レビューおよび任意Functional Interfaceの節まで）
- `/workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/skills/alder-draft-check-items/references/candidate-c3.md`
- `/workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/skills/alder-draft-check-items/references/provenance.json`
- `/workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/plugin.json`
- `/workspace/scratch/0261bb5be107/return-quality-comparison/product/design.md`
- `/workspace/scratch/0261bb5be107/return-quality-comparison/product/checks.md`

## 完全な依頼文

> Use alder-draft-check-items at /workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/skills/alder-draft-check-items/SKILL.md in Consistency review-only mode. Read its required bundled references, AGENTS.md, product/design.md and product/checks.md under return-quality-comparison. Pinned public source revision 525a39db6ec43c196c5b927dbc1b9c3cf32f08c6. Review the whole Check artifact against the whole Business Design and applicable description rules, meaning authority, granularity, scope and traceability contracts. Report evidenced nonconformance separately from undecided business meaning and optional suggestions. Do not edit artifacts, approve meaning, or change review states. Write only /workspace/scratch/0261bb5be107/quality-self-review.md with findings (location, applicable rule, source evidence, effect), actual checks/limits, read paths, your agent ID, and this full prompt verbatim. Do not read any other outputs, prior evaluation reports, accepted specimens, answer keys, root issue or files outside this packet except your own report; no network/other agents. Requested model gpt-6-sol, reasoning medium. This continuation retains your existing author context; do not claim Fresh independence.
