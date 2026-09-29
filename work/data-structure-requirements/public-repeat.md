# Issue #116: 公開revisionを固定したFresh追試

この記録が#116の再現性に関する**有効な比較結果**である。[最初の試行](results.md)はローカルにしか存在しないcommitを参照していたため、第三者が入力を取得できず、追試の根拠から除外する。初回結果の条件・promptは履歴として残すが、今回の判断は以下の公開commitによる追試で確認した。

## 固定入力と結果

- baseline指針: Alder公開commit `6a1bac6a58550521298fd26810f53665813b72e0` の `docs/adoption.md` Section 1、reviewerには `docs/business-design-quality-review.md` も渡した。
- treatment指針、両authorの同一メモ、両reviewerの同一草案: PR #117の公開commit `ec53fc98c973ae85e36fa8db0914e42b0206a7ad`。指針は `docs/adoption.md` Section 1およびreviewer向け `docs/business-design-quality-review.md`、入力は `work/data-structure-requirements/notes.md`、共通草案は `work/data-structure-requirements/common-draft.md`。
- GitHubから `ec53fc98` のadoptionとcommon-draftをファイル取得し、同commitを`git fetch`後に`git show SHA:path`でnotesも取得できることを確認した。baselineはマージ済みmainのcommit。
- 四agentとも指定モデル `gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。実効runtime設定の独立検証はできない。各agentは下記の個別の全文promptで読み取り専用の結果を返した。

| 比較対象 | baseline | treatment | 判断 |
| --- | --- | --- | --- |
| author | 部分承認、希望価格と実額、異動後の識別、一部品切れを未決とし、複数品目・配送先の条件・部署内一意を草案へ書いた | 同じ4領域を未決とし、同じ確定条件を草案へ書いた | どちらもER/DDLを先決せず、主要な構造的要求を業務語で配置。treatment固有の重大な発見なし。 |
| reviewer | 届け先を店頭でも要求、全社の番号重複拒否、現在カタログ価格で過去購入額を計算する3件を確定的不一致として検出。部分承認・価格・異動・品切れを未決とした | 同じ3件の確定的不一致と4領域の未決を検出 | baselineでも構造による業務結果差を検出。表分割・キー・NULL可否などを要求しない。 |
| 追加の観測 | 購買工程と購入結果の受渡し欠落を業務上の不足として挙げた | 希望価格を上限や承認根拠とする可能性に触れたが、決定済みとは扱わなかった | 指摘の粒度は異なる。単一例で改訂指針の優越・一般的発見率は主張しない。 |

**結論:** A案（既存欄に業務上の結果差を書く）を維持し、短い例示の追加のみを採る。既存欄の定型拡張・専用欄を正当化する差は観測されなかった。単一入力・単回の定性的試験であり、実案件の依頼者可読性や実装・DDLからのP2は未検証。両authorは指定の同一種類のAGENTS.mdを読み、Plugin SKILL.mdと過去出力を読まない条件に統一した。両reviewerは同一草案を読んだため、author成果を縦につないだ評価ではない。

## 全文promptとagent ID

### `/root/public_author_baseline`

> 独立Fresh author追試（baseline）。指定モデル gpt-6-sol、reasoning effort medium。対象 /workspace/scratch/66fd7fe60a81/alder。指針は公開commit 6a1bac6a58550521298fd26810f53665813b72e0 の docs/adoption.md Section 1、入力は公開commit ec53fc98c973ae85e36fa8db0914e42b0206a7ad の work/data-structure-requirements/notes.md。指定revisionの内容を `git show <SHA>:<path>` で読む。必要なrepoルールは baseline commit の AGENTS.md のみ読む。依頼: このヒアリングメモからAlder業務設計書の簡潔な草案を日本語で作り、業務上の意味を変える未確認事項を質問として挙げてください。未合意の方針を補わず、既知の事実と未決を分け、結果に影響しない仮説は問わないでください。回答本文に草案、質問、見送った質問、読んだパス・revisionを示してください。ファイル編集とGitHub書込みは禁止。改訂候補commit ec53fc98 の docs/adoption.md、docs/business-design-quality-review.md、work/data-structure-requirements/results.md、docs/data-structure-requirements-study.md、Plugin SKILL.md、他agentの出力は読まないでください。過去試験の出力は禁止です。

### `/root/public_author_treatment`

> 独立Fresh author追試（treatment）。指定モデル gpt-6-sol、reasoning effort medium。対象 /workspace/scratch/66fd7fe60a81/alder。指針は公開commit ec53fc98c973ae85e36fa8db0914e42b0206a7ad の docs/adoption.md Section 1、入力は同じ公開commitの work/data-structure-requirements/notes.md。指定revisionの内容を `git show <SHA>:<path>` で読む。必要なrepoルールは同commitの AGENTS.md のみ読む。依頼: このヒアリングメモからAlder業務設計書の簡潔な草案を日本語で作り、業務上の意味を変える未確認事項を質問として挙げてください。未合意の方針を補わず、既知の事実と未決を分け、結果に影響しない仮説は問わないでください。回答本文に草案、質問、見送った質問、読んだパス・revisionを示してください。ファイル編集とGitHub書込みは禁止。baseline commit 6a1bac6 の docs/adoption.md、work/data-structure-requirements/results.md、docs/data-structure-requirements-study.md、Plugin SKILL.md、他agentの出力は読まないでください。過去試験の出力は禁止です。

### `/root/public_reviewer_baseline`

> 独立Fresh reviewer追試（baseline、読み取り専用）。指定モデル gpt-6-sol、reasoning effort medium。対象 /workspace/scratch/66fd7fe60a81/alder。指針は公開commit 6a1bac6a58550521298fd26810f53665813b72e0 の docs/business-design-quality-review.md と docs/adoption.md Section 1。入力は公開commit ec53fc98c973ae85e36fa8db0914e42b0206a7ad の work/data-structure-requirements/notes.md、レビュー対象は同commitの work/data-structure-requirements/common-draft.md。指定revisionの内容を `git show <SHA>:<path>` で読む。必要なrepoルールはbaseline commitの AGENTS.md のみ読む。依頼: 草案をヒアリングメモと指針に照らし、確定的な不一致と未決の業務判断を分け、各指摘の業務上の結果差と根拠を報告してください。指摘不要の候補も示してください。表やDDLだけで要件を推測しないでください。ファイル編集とGitHub書込みは禁止。改訂候補commit ec53fc98 の docs/adoption.md と docs/business-design-quality-review.md、work/data-structure-requirements/results.md、docs/data-structure-requirements-study.md、Plugin SKILL.md、他agentの出力、過去試験出力は読まないでください。読んだパス・revisionを示してください。

### `/root/public_reviewer_treatment`

> 独立Fresh reviewer追試（treatment、読み取り専用）。指定モデル gpt-6-sol、reasoning effort medium。対象 /workspace/scratch/66fd7fe60a81/alder。指針は公開commit ec53fc98c973ae85e36fa8db0914e42b0206a7ad の docs/business-design-quality-review.md と docs/adoption.md Section 1。入力は同じ公開commitの work/data-structure-requirements/notes.md、レビュー対象は同commitの work/data-structure-requirements/common-draft.md。指定revisionの内容を `git show <SHA>:<path>` で読む。必要なrepoルールは同commitの AGENTS.md のみ読む。依頼: 草案をヒアリングメモと指針に照らし、確定的な不一致と未決の業務判断を分け、各指摘の業務上の結果差と根拠を報告してください。指摘不要の候補も示してください。表やDDLだけで要件を推測しないでください。ファイル編集とGitHub書込みは禁止。baseline commit 6a1bac6 の docs/adoption.md と docs/business-design-quality-review.md、work/data-structure-requirements/results.md、docs/data-structure-requirements-study.md、Plugin SKILL.md、他agentの出力、過去試験出力は読まないでください。読んだパス・revisionを示してください。
