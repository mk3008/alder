# Alder Check Items Consistency review（読取専用）

## 対象・実行条件

- 候補：`matrix-runs/update/candidate-01.md`（SHA-256 `22661f0c1bf21aa4ae71847582be2b83a1ca15ecdccd926d1f9ae18446cb7146`）。保存版を検査し、変更していない。
- 業務設計：`matrix-update-packet/work/check-item-examples/fixtures/README.md`（SHA-256 `e00c06ef469c015120add5dc92249b53eabd496750ff9aeb1b7f9a84ab469cd0`）。合意済みと明記される。
- 旧Check・実際のフィードバック：同ディレクトリの`checks.md`（SHA-256 `f554ea5fb9a9e2652d692db24c40a6febdbdfe6e6dce15a06729a4109778b4c9`）。C-02の保留、C-04の「対象の区別が読みにくい。今回の表示変更では意味の採否を再確認しない」を含む。
- 指示・規則：`matrix-update-packet/AGENTS.md`、`plugins/alder/skills/alder-draft-check-items/SKILL.md`、その必須参照`references/check-item-traceability.md`と`references/adoption.md`（Optional Functional Interface節まで）、`references/provenance.json`、`plugins/alder/plugin.json`。Bundle公開版指定 `d7f84fcca636e88015b15b9da993b200abd62999`、provenanceのauthority `1584c9e1db3437eac5fa35f82a951cc9a28922f3`、plugin表示版`0.4.8`。公開commit自体の実在・ファイル一致はネットワークや別の版管理資料では再検証していない。
- 要求設定：`gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。このreaderは独立した履歴なしのサブエージェントとして依頼されたが、実効モデル・effort・fork設定をこの作業環境から独立にattestできない。設定値の記録は要求・引渡し情報の記録であって実効値の証明ではない。

## Pass 1 — 原典の宣言名、所属、必要な参照

| 原典の宣言（README） | 保存版の索引表示 | 保存版のH2表示 | 自身の意味を担うCheckと参照 |
| --- | --- | --- | --- |
| L12 `# Activity 相談を受付する` | L7 `相談を受付する` | L10 `相談を受付する` | C-01、原典で未決のC-02。索引から各H3へ直接リンク。 |
| L34 `# Activity 次の連絡方法を説明する` | L8 `次の連絡方法を説明する` | L89 `次の連絡方法を説明する` | C-03、同じ相談の依頼者を対象とするC-04。索引から各H3へ直接リンク。 |

索引は指定の4列で原典のWhyと受付後の接続を示す。見出し順とCheck本体順は一致する。C-01の「関連業務」は後続の案内との接続であり、受付済みになる保証自体をC-03側に共有する根拠ではない。逆にC-03・C-04の案内対象は受付後の相談だが、受付条件のCheckを案内Activityに共有する必要はない。したがって現在の索引・単一の本体と状態・参照の所属について欠落は見つからない。C-02は未決事項の種別が本体に可視である。

Skill指定の診断 `python3 plugins/alder/skills/alder-draft-check-items/scripts/check_activity_names.py --design …/README.md --checks …/candidate-01.md` を束内の実パスで実行し、exit 0、`status: match`、declared/headings/indexとも上記二つの生文字列、mismatchesとtarget_issuesは空だった。これは名前の狭い診断であり、意味やリンクの十分性の判定には使っていない。Markdown内の相対原典リンク、索引のActivity・C-01～C-04リンク、両Checkからの比較表への戻りリンクはテキスト上の見出しターゲットと照合した。

## Pass 2 — 一般保証、具体例、旧版からの保持

- README L7–8、L20、L28–32の受付条件は、登録済み、本人または委任済み代理人（両立可）、停止中でない、希望日が申請日から0～30日（両端含む）の組合せで、その相談が受付済みになるという一般保証。C-01 L35–48の主条件、操作、期待結果にはこれらと相談の同一性が記載される。比較表A・B・C（L18–20）の0日、30日、両資格の結果も一致する。ただし下記NGの式中の日数差の文章定義は、主条件と表の値に反する。
- README L9の条件不成立時の応答・記録・再申請と希望日変更の未決は、C-02 L63–87および表D～H、L27で未承認のまま表示される。表は不成立を受付拒否とは判定しない。旧C-02の保留・再質問しない旨、状態`要確認`、未収集のTest証拠も保持。
- README L42、L50、L54の受付後の案内はC-03 L97–105の一般条件・対象となる相談の依頼者・担当窓口と次の連絡方法の結果に対応する。例の相談Aは一般保証をAに限定しない。C-04 L119–127は旧来の同じ相談の依頼者という対象保証を残し、区別の例を付け、人間フィードバックと`要修正`をL132に保持。C-03の`未レビュー`も保持。
- C-01の`確認済み`、導出分類`明示`、AI確度`高`、関連業務、`test_acceptance::test_inclusive_window`と「最終実行結果は未収集」は旧版から保持。C-03の導出分類とTest未収集、C-04の既存証拠なしも保持。テスト名の記載は実行結果の検証ではない。C-01～C-04のID・各状態と旧版の期待結果を対照した限り、意図的な削除や別IDへの付け替えは見つからない。

## 根拠付きNG（記述・意味整合性の診断であり人間レビュー状態ではない）

1. **C-01 L44の日数差の向きが逆。** 式は`0 ≤ 日数差 ≤ 30`だが、直後に「希望日の暦の日付から申請日の暦の日付までの日数」と定義する。日本語の「希望日から申請日まで」は希望日を起点に申請日へ数えるため、表Bの申請日10月1日→希望日10月31日を-30日と読み、式で除外する。README L7・L20の「希望日が申請日から0日以上30日以内」、候補L42と表Bの30日成立に反する。現行ガイダンス`conditions, expressions and examples`およびreturn-time quality checkは式の記号定義・境界・例を主条件と照合し、表示更新で保証を保持するよう要求する。方向を原典に合わせた意味保持の記述修正が必要であり、受付可否を新たに人間決定する問題ではない。候補は未編集。

## 未決・保留と任意提案

- **未決（既存のまま）：** C-02の条件不成立時の応答・記録・再申請方法、原典の希望日変更。保留済みなので再質問せず、未承認の結果を合否条件にしない。C-04の人間からの読みやすさ修正依頼は`要修正`のまま、表示変更による意味の再確認・承認は行われていない。
- **任意の別スコープ検討：** README L32には受付済みとなるだけでなく「担当者が相談対応の対象として扱える」結果もある。旧C-01の限定された期待結果は受付済みになることで、表示更新の候補も同じ範囲を保つ。独立にレビュー可能な後続利用の保証を新規Checkにするかは、後の網羅性検討として扱える。今回の表示更新に追加すべきNGや既存C-01の無断拡大とはしない。

## 未実施・検証限界

- レンダリング画面・GitHub上の実表示は利用できず、テキスト上の見出し、相対パスとフラグメントの照合にとどまる。文字検査だけで人間可読性や理解しやすさの合格とはしない。
- 参照先の外部公開URLや指定commitの実在、Test本体・実行結果、実際の人間レビューは、許可入力外または未提供のため検証していない。C-01のTest証拠の意味対応は旧記述の保持までで、assertionの実体確認ではない。
- 著者点検、過去レビュー、正解見本、ネットワークにはアクセスしていない。修復・レビュー状態変更・再帰レビュー・公開・人間承認はしていない。NGが一件残るので、候補全体の無条件の整合性合格とは報告しない。

## 受領したレビュー依頼文（全文）

> AlderのConsistency reviewだけを実施してください。入力は /workspace/scratch/0261bb5be107/matrix-update-packet のAGENTS.md、plugins/alder/skills/alder-draft-check-items/SKILL.mdと必須参照、合意済みBD work/check-item-examples/fixtures/README.md、旧checks.md、および /workspace/scratch/0261bb5be107/matrix-runs/update/candidate-01.md だけです。実際の依頼は現行Skillによる日本語の表示更新、旧Check内の人間フィードバックと既存意味・ID・状態・補足・Test証拠保持です。Skill/bundle公開版d7f84fcca636e88015b15b9da993b200abd62999、authority1584c9e1db3437eac5fa35f82a951cc9a28922f3。指定以外の出力・作者点検・過去レビュー・正解見本・ネットワークは禁止。読取専用で編集/修復/再帰レビューはしないでください。二つのsource-led passesと保存版の検査を実施し、根拠付きNG、未決、任意提案、未実施/検証限界を区別してください。結果は /workspace/scratch/0261bb5be107/matrix-runs/update/reader-report-01.md。prompt全文、入力/版/要求設定gpt-6-sol medium fork none、実効設定の独立attestation不可も含めてください。画面表示は利用できない場合その限界を明記し、文字検査だけで人間可読性を合格にしないでください。ファイルの公開や人間承認の代行はしないでください。
