# 備品貸出業務設計草案の独立・読取り専用評価

## 対象と再現情報

- 元依頼: `eval-inputs/lending/notes.ja.md` SHA-256 `79a0fdd23dce13973a0b8d5d3e3dc498cd6a5f3f0157b45dc5aa92ddedb91b13`
- A: `agent-output/baseline-author/lending-business-design-reviewed.json` SHA-256 `a72164810a6af609633b4e9c254baae3faf03d5e1da1a6cbc55a06f608e2e4ab`
- B: `agent-output/candidate-author/lending-business-design.json` SHA-256 `7d7754baf43122ba8a960538cfe09105fd306e85a2c7437461394ab767a0e21f`
- 指定Alder source revision: `4494e2e22ed84c73e8ea0e770d4ff4e576ca0ab2`。同梱Plugin版 `0.4.9`。レビューガイドのprovenance記載の元revisionは `17a38e66841814de9182735bdb17671834270522`。適用した `alder-draft-business-design/SKILL.md`、`alder-review-business-design/SKILL.md`、`alder-manage-json-documents/SKILL.md`、同梱 `adoption.md` section 1、文書構造・品質・相関・漏れ・Findings・JSON操作・部分状態のガイドを参照。
- `node .../author-cli.mjs runtime`: Node v24.22.1、直接JSON可。`node .../cli.mjs validate` は A: `valid:true, diagnostics:[], entities:21`、B: `valid:true, diagnostics:[], entities:22`。これは構造・参照・版の検査であり、業務合意の証拠ではない。
- レビュー依頼のモデル・effort指定は受領していない。実効設定を独立検証したとは主張しない。依頼文は親agentのタスク伝達として本報告の対象と評価観点に記載された通り。作者の解説・実行記録、evaluation-private、他レビュー、Issue/PR本文は参照していない。対象ファイルは変更していない。

## 評価

| 観点 | A | B | 根拠と判断 |
| --- | --- | --- | --- |
| 元依頼の流れ・境界 | 充足 | 充足 | 両者とも申出→台帳で利用日を確認→空きなら申込者・備品名・利用日を記録、埋まりなら追記せず不可を伝える、利用日に記録された利用者へ引渡しと貸出中への更新、返却の受領と返却済みへの更新を記述。自動承認・督促・支払いを除外。三Activityの分割は利用日までの待ちを表す。 |
| Input/Procedure/Output | 充足 | 概ね充足 | 両者の関係は利用者・台帳・備品を通した実際の授受を表し、記録済みの台帳情報を引渡しの入力へ、返却品を返却の入力へつなぐ。Aの申込入力labelは「申込者」を明示する。Bの同labelは「借りたい備品名と利用日」のみだが、利用者Objectからの入力であり、Procedureが「申込者」を記録するため、厳密な双方向照合では出所の一語を補うとより明瞭。元依頼の意味が欠落したとまでは判定しない。 |
| Result→When | 充足 | 充足 | 記録済みと利用日の到来が次の引渡しへつながり、貸出中から利用者の返却を受け、返却済みで終了する。返却を引渡し直後の必須実行と誤記していない。 |
| 例外・未決 | 充足 | 充足 | 埋まり時は両者のexceptionと出力にあり、追記せず不可を通知する。破損の判断主体・方法は両者のprefaceとopen questionに残し、返却済みとの関係も問いとして扱う。人間の答えを創作しない。 |
| 明示部分状態・合意 | 充足 | 充足 | 両者のprefaceは記録済み・貸出中・返却済みを今回明示された台帳状態に限定し、全状態仕様としない。新しいstateTransition文書も作っていない。草案・未合意を明記し、Checkや人間承認に昇格していない。 |
| Scope・名前 | 充足 | 充足 | Scopeは対象業務と対象外の境界を示し、手順を過度に再録しない。Activity名は仕事を識別し、利用日の開始条件はWhenに置かれている。 |

### 小さな記述上の改善候補

Bの「備品の貸出申込を記録する」の利用者→Activity入力labelは「借りたい備品名と利用日」だけで、Procedureおよび台帳へのOutputに「申込者」が登場する。文書構造のInput欄と同梱adoptionの「ProcedureとI/Oの双方向照合」に従うと、申込者の情報の出所が利用者であることをlabelに明示すると読みやすい。元依頼は「利用者」が伝え、空いていれば「申込者」を記録すると述べるので、これは既知事項の表現調整であり、新規の本人確認手続きや権限規則を足す理由ではない。Aはそのlabelに申込者を含めている。これ以外の意味上の重大な欠落・創作・相関不成立は確認できなかった。

## 適用規則と限界

文書構造の「原要求の保持と欄への割当」、品質ガイドの各欄とInput→Procedure→Output、相関ガイドのOutput→Object→InputおよびResultとWhenを別々に適用した。漏れガイドは実際の対象に関係する少数の問いだけを対象とし、破損時の未決を勝手に確定しなかった。JSON検査で有効でも意味や人間合意は保証されない。現場の追加運用・人間の合意記録・実装は提供されていないため評価していない。
