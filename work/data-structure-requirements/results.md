# Issue #116: 業務上の構造要求のFresh比較

## 条件と観測範囲

- 指定モデル: `gpt-6-sol`、reasoning effort `medium`、各agent `fork_turns: none`。これは要求した設定であり、実効runtime設定を独立検証したものではない。
- baseline指針: `6a1bac6a58550521298fd26810f53665813b72e0` の `docs/adoption.md` / `docs/business-design-quality-review.md`。
- treatment指針: `904835981dd87f99b7731153122627af492095c7` の同ファイル。入力メモは `9048359`、共通レビュー草案は `c74f928e27d3d1db2e3e5592815bfa855ac2750a`。同じメモを両authorへ、同じメモと草案を両reviewerへ渡した。agentは読み取り専用。
- 出力の照合は一つの入力での定性的比較。単一回・同一モデル・異なるサンプルの確率的出力のため、発見率、効果の有無、一般性を統計的に主張しない。reviewer入力の草案は、業務設計書全体ではなく意図的に省略・矛盾を含む試験用断片。

## 結果

| 観点 | baseline | treatment | 解釈 |
| --- | --- | --- | --- |
| authorの確認事項 | 部分承認、品切れ、希望価格と実額、異動後の申請識別、購入額の確認単位、却下後の扱い | 部分承認、品切れ、希望価格と実額・確認単位、異動後の識別、却下後の扱い | 主要な未決事項は両方で露出。treatment固有の重大発見なし。baselineの6件とtreatmentの5件は質問の束ね方も違うため、件数を優劣に使わない。 |
| authorの記述位置 | 複数品目・配送時のみ届け先・部署内一意をObjectとActivityに記述。承認単位と価格を未確認に置く | 同じ確定事実をObjectとActivityに記述し、承認単位・価格・異動を未確認に置く | 両方ともER/DDLを先決しない。baselineは申請時の部署をObjectに置き、treatmentも部署と番号の関係を明記。 |
| reviewerの確定不一致 | 店頭にも届け先を要求、全社で番号重複を拒否、現在カタログ価格で過去購入額を再計算 | 同じ3件 | 構造的な結果差の検出はbaselineでも成立。 |
| reviewerの未決と指摘不要 | 部分承認、異動後識別、価格の意味、品切れを未決として保持。複数品目は既記述、キー・DDLは指摘不要 | 同じ4領域を未決として保持。複数品目は既記述、PK/FK・NULL等は指摘不要 | 誤ったBusiness確定やER誘導は観測されなかった。 |
| reviewerの記述品質 | 購買への受け渡し・購入額の出所、When / Output / Scopeの欠落を指摘 | 購買への受け渡し・購入額の出所、When / Outputの欠落を指摘 | 既存の相関・記述品質指針でも多くの問題が見つかる。 |

**判断:** A（現行欄で結果差を記述）を維持する。今回の対照例は改訂指針による新規発見を示さないが、短い記述位置の説明として残せる。専用欄または既存欄への定型行追加を正当化する差はない。review knowledge v0.3のルールは変更せず、authoring/運用レビューの説明に具体例を足す。新たな必須チェックリストやPluginのreview skill変更は不要。

## Agent・全文prompt

### Author baseline — `/root/fresh_author_baseline`

> 独立Fresh author試験（baseline）。モデル指定 gpt-6-sol、effort medium。対象リポジトリ /workspace/scratch/66fd7fe60a81/alder。基準の著者指針は revision 6a1bac6a58550521298fd26810f53665813b72e0 の docs/adoption.md（`git show 6a1bac6a58550521298fd26810f53665813b72e0:docs/adoption.md` で読み、Section 1全体を適用）。ヒアリング入力は revision 904835981dd87f99b7731153122627af492095c7 の work/data-structure-requirements/notes.md。依頼: このヒアリングメモからAlder業務設計書の簡潔な草案を日本語で作り、業務上の意味を変える未確認事項を質問として挙げてください。完成済みの仕様と扱わず、根拠のない方針を補わないでください。出力は回答本文に草案と質問を記載し、ファイル編集、GitHubへの書込み、既存の別試験の出力閲覧はしないでください。特に改訂候補 revision 9048359 の docs/adoption.md、docs/business-design-quality-review.md および他エージェントの出力は読まないでください。読んだパス、根拠revision、未決事項、考えたが見送った質問を報告してください。今回の全文promptをそのまま検証記録に保存します。

### Author treatment — `/root/fresh_author_treatment`

> 独立Fresh author試験（treatment）。モデル指定 gpt-6-sol、effort medium。対象リポジトリ /workspace/scratch/66fd7fe60a81/alder。改訂候補の著者指針は revision 904835981dd87f99b7731153122627af492095c7 の docs/adoption.md（Section 1全体を読む）。ヒアリング入力は同revisionの work/data-structure-requirements/notes.md。依頼: このヒアリングメモからAlder業務設計書の簡潔な草案を日本語で作り、業務上の意味を変える未確認事項を質問として挙げてください。完成済みの仕様と扱わず、根拠のない方針を補わないでください。出力は回答本文に草案と質問を記載し、ファイル編集、GitHubへの書込み、既存の別試験の出力閲覧はしないでください。特にbaseline revision 6a1bac6 の docs/adoption.md、比較研究 docs/data-structure-requirements-study.md および他エージェントの出力は読まないでください。読んだパス、根拠revision、未決事項、考えたが見送った質問を報告してください。今回の全文promptをそのまま検証記録に保存します。

### Reviewer baseline — `/root/fresh_reviewer_baseline`

> 独立Fresh reviewer試験（baseline、読み取り専用）。モデル指定 gpt-6-sol、effort medium。対象リポジトリ /workspace/scratch/66fd7fe60a81/alder。レビュー指針は revision 6a1bac6a58550521298fd26810f53665813b72e0 の docs/business-design-quality-review.md と docs/adoption.md Section 1（両方 `git show <revision>:<path>` で読む）。ヒアリング入力は revision c74f928e27d3d1db2e3e5592815bfa855ac2750a の work/data-structure-requirements/notes.md、レビュー対象は同revisionの work/data-structure-requirements/common-draft.md。依頼: 草案をヒアリングメモと現行Business Design指針に照らして読み取り専用でレビューし、確定的な不一致と業務判断待ちの問いを区別し、各指摘が変える結果と根拠箇所を述べてください。表・DDLの形だけから要件を推測しないでください。指摘不要とした候補も簡潔に記録してください。ファイル編集、GitHubへの書込み、改訂候補 revision 9048359 の docs/adoption.md と docs/business-design-quality-review.md、他試験の出力閲覧は禁止です。読んだパスとrevisionを報告してください。今回の全文promptをそのまま検証記録に保存します。

### Reviewer treatment — `/root/fresh_reviewer_treatment`

> 独立Fresh reviewer試験（treatment、読み取り専用）。モデル指定 gpt-6-sol、effort medium。対象リポジトリ /workspace/scratch/66fd7fe60a81/alder。改訂候補のレビュー指針は revision 904835981dd87f99b7731153122627af492095c7 の docs/business-design-quality-review.md と docs/adoption.md Section 1（該当revisionの内容を読む）。ヒアリング入力は revision c74f928e27d3d1db2e3e5592815bfa855ac2750a の work/data-structure-requirements/notes.md、レビュー対象は同revisionの work/data-structure-requirements/common-draft.md。依頼: 草案をヒアリングメモと改訂候補Business Design指針に照らして読み取り専用でレビューし、確定的な不一致と業務判断待ちの問いを区別し、各指摘が変える結果と根拠箇所を述べてください。表・DDLの形だけから要件を推測しないでください。指摘不要とした候補も簡潔に記録してください。ファイル編集、GitHubへの書込み、baseline revision 6a1bac6 の docs/adoption.md と docs/business-design-quality-review.md、比較研究 docs/data-structure-requirements-study.md、他試験の出力閲覧は禁止です。読んだパスとrevisionを報告してください。今回の全文promptをそのまま検証記録に保存します。

## 制約・紛れ込み

- Author treatmentは報告上、指定のadoptionに加えてリポジトリのAGENTS.mdとPluginのSKILL.mdも読んだ。baseline authorの報告はadoptionとnotesのみ。指針だけを分離した厳密なA/Bではない。Pluginに収録された指針はこの試験時点で旧版だったため、treatmentは依頼指定revisionを優先したと報告した。
- 両authorの草案は簡潔版で、全てのObjectとの接続や例外を完成させる試験ではない。reviewerは共通の意図的に不完全な草案を読んだので、authorそれぞれの成果を後段でreviewした評価でもない。
- 実際の依頼者による可読性・合意や、実装とDDLからのP2レビューは未検証。保存したのは出力の主要事実の比較であり、全文のraw agent出力ではない。必要になれば同条件で再実行する。
