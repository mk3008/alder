# Independent routing and three read-only cases

Requested Fresh settings: model `gpt-6-sol`, reasoning effort `medium`, `fork_turns: none`; source revision `mk3008/alder@5ca4ae84f2d1266dac445fcec27cb7319562bc29`. These are requested settings; the effective runtime model/effort/fork and source revision cannot be independently verified from this checkout. The local directory has no `.git` metadata discoverable by `git rev-parse HEAD`. No prior COVERAGE or review results were read. No source or fixture was edited.

## Public evaluation instructions

Inspect the ten Skills’ name/description fields to select a route for each request below, then execute the three read-only cases using the stated fixture. Do not edit product inputs. The full orchestration assignment is not published; this record preserves the experiment requests and conditions needed to repeat it.

## Frontmatter-only routing answer

The following decisions were made after reading only the name and description frontmatter of the ten installed Alder Skills, before reading their bodies or bundled references.

1. `このヒアリング結果をAlder業務設計書にして` → `alder-draft-business-design`. It drafts a Business Design from interview notes.
2. `業務設計書をAlderでレビューして` → `alder-review-business-design`. It reviews design quality and business correlations.
3. `コードをAlderでレビューして` → `alder-review-implementation`. It compares completed implementation with agreed design.
4. `Alderで改善提案して。この業務のProblem/Painは設計書にある` → `alder-optimize-business`. It proposes improvements with a stated Problem/Pain; confirm the named design supplies them.
5. `Alderでチェック項目を作って` → `alder-draft-check-items`. It drafts Check Items from agreed design.
6. `Alderの検査項目を更新して` → `alder-draft-check-items`. It updates existing Check Items while preserving IDs/review state.
7. `AlderでFunctional Interfaceを整理して` → `alder-draft-check-items`. Its description explicitly includes organizing Functional Interfaces.
8. `Alderで未記載の機能条件を探して` → `alder-explore-functional-conditions`. It explores undecided conditions after design/correlation review.
9. `ProblemはまだないのでAlderで業務構造を見て` → `alder-discover-business-questions`. It asks structural questions before a Problem is known.
10. `Alderレビューのフォローアップをして` → `alder-follow-up-review`. It maintains follow-up decisions/evidence after implementation review.
11. `Alderのチェックとテストの対応を更新して` → `alder-follow-up-review`. It maintains Check-to-Test evidence mappings.
12. `この業務設計をAlderでJSON化して` → `alder-export-business-graph`. It exports the supported Business Design profile to graph JSON.
13. `Alderでチェックとテストの同期漏れを調べて` → clarify compatibility before `alder-check-traceability-drift`. Its optional drift pilot needs compatible source units, reviewed mappings and runner-discovered test IDs; the wording alone does not establish those prerequisites.
14. `Alderでチェック項目の内容をレビューして。編集しないで` → `alder-draft-check-items`, read-only. Its description covers consistency review; the explicit no-edit instruction limits the operation.
15. `このJSONを整形して` → no Alder Skill. Arbitrary JSON formatting is outside their descriptions.

## Inputs and installed provenance observed

- Fixture: `work/workflow-skills/issue-143/fixtures/business-design.md`; no fixture revision available from Git in this local directory.
- Alder plugin manifest version: `0.4.0`.
- Bundled authority provenance for all three case Skills: Alder source revision `a971d60bb64fbc048a871d70dda277c93b680288`.
- Packaged graph exporter digest declared in provenance: `4f5cf06d2c3795cded69ab751110a11807ea580586b12805e06e175ecd60a9ed`.
- Local `sha256sum` of the packaged graph exporter matches that digest; the bundled `business-graph.md` likewise matches its declared digest `3924abae22875512c46a74fad6720ef88b5c9144d873588d6bf5b02fcb396746`.

## Case A response

User request: `ProblemはまだないのでAlderで業務構造を見て。fixtures/business-design.md は合意した現状です。`

対象は合意済みの現状設計（上記fixture、実ファイルは `work/workflow-skills/issue-143/fixtures/business-design.md`）。Alder plugin 0.4.0、authority source `a971d60bb64fbc048a871d70dda277c93b680288`。設計書自体が依頼者による確定範囲の確認と業務相関レビュー済みを述べています（3行）。

構造上の観察：貸出と返却は同じ受付担当・受付で行い、返却で備品を貸出可能に戻すことが次の貸出を可能にします。

- Evidence: 貸出の担当・場所と状態確認（19–28行）、返却の担当・場所と状態更新（39–52行）。
- Why it may matter: 両活動の間で状態と貸出記録の受け渡し方を確認すると、実際の運用上の論点があるか判断できます。負荷や遅延があるとはまだ言えません。
- Unknowns: 受付での貸出・返却のタイミングや担当交代、状態を参照・更新する実際の運用、困りごとの有無。
- Question: 返却から次の貸出へ移る際、状態確認や担当間の引き継ぎで実際に困ることはありますか。あるなら具体例とPainを確認したいです。

改善案、Problem/Painの認定、設計変更はしていません。この問いを課題として採用するかは担当者判断です。

## Case B response

User request: `Alderで未記載の機能条件を探して。fixtures/business-design.md は業務相関レビュー済み。既存契約として対象備品が存在しなければ貸出不可で記録不変と確認済み。返却前の予約機能は対象外です。`

対象は同じfixture。設計書3行目と依頼文により、対象範囲の確認・業務相関レビュー済みを扱います。Alder plugin 0.4.0、authority source `a971d60bb64fbc048a871d70dda277c93b680288`。以下は人間レビュー前の考慮候補で、網羅性や欠陥発見率は主張しません。

文書内で決まること：貸出中なら貸し出さず既存記録は変わらない（28–29行）。正常な貸出は記録作成と貸出中への変更を伴い（28、31–33行）、返却は返却日時の記録と貸出可能への変更を伴います（45–52行）。対象備品が存在しない場合の貸出不可・記録不変は依頼者確認済みの既存契約です。

候補 FC-1（候補・未承認／要確認）：貸出処理の途中失敗時の結果境界。

- 対象機能と場面・結果差：貸出可能な備品について受付担当が貸出を開始した後、利用者へ渡す行為、貸出記録の保存、備品状態の更新の途中で処理が失敗する場面。利用者には貸出成立を伝えて後から記録を復旧する扱いと、成立を伝えず備品を渡さず再試行する扱いでは結果が異なります。
- 適用性の設計根拠：貸出は備品の引き渡し・記録作成・状態更新を一つの通常手順に含みます（16、28、31–33行）。この根拠は提案する失敗時の答えを承認していません。
- 未決の部分：これらの処理が一部だけ成功したとき、利用者に貸出成立をどう伝え、記録と現物をどう回復するか。通常完了後のResultはありますが、途中失敗の扱いは書かれていません。
- 発見に使った知識と推論：複数の現物・記録・状態変更を含む処理では、途中失敗により一部だけ完了する可能性があるという一般的な失敗モードからの推論です。特定の技術構成や故障頻度を示す資料ではありません。
- 最小限の選択肢と影響：①引き渡し前に記録・状態の確定を確認し、未確定なら渡さない。②引き渡し済みの失敗を許容し、受付による復旧と利用者への扱いを定める。どちらも既存の正常時保証と、既に貸出中なら記録不変という保証を守る必要があります。
- 前提：記録や状態更新が失敗し得る運用・システムであること。現状が完全に手作業なら具体的な失敗例を確認する必要があります。

閉じた論点：存在しない備品は既存契約が答えを決めているため再質問しません。返却前予約は明示された対象外なので候補にしません。貸出中の再貸出不可・既存記録不変も設計に明記されているため、未記載の条件には数えません。

FC-1の業務上の扱いが決まった場合は、Business Designの改訂・確認へ戻し、その確認版からCheckを導出します。未承認候補をpass/fail条件にしません。

## Case C response and actual CLI output

User request: `この業務設計をAlderでJSON化して。fixtures/business-design.md を使って。`

指定fixtureをバンドル済み公式exporterで検証しましたが、この設計書はBusiness Graphのopt-in Markdown profile v1に合致せず、JSONを出力できませんでした。最初の診断はObject「備品」に必須の`## Scope`と`## Icon`がないことです。Activityにもprofile v1で必須の`## Scope`などの適合確認が要ります。元の設計は編集していません。JSONが必要なら、業務上の意味を人が確認しつつ、別途このprofileへの設計改訂を依頼してください。Alder plugin 0.4.0、bundled authority/exporter revision `a971d60bb64fbc048a871d70dda277c93b680288`、digest `4f5cf06d2c3795cded69ab751110a11807ea580586b12805e06e175ecd60a9ed`。構造検証の失敗であり、業務設計自体の妥当性判断ではありません。

Actual command (temporary output only):

```sh
python3 plugins/alder/skills/alder-export-business-graph/scripts/export.py work/workflow-skills/issue-143/fixtures/business-design.md -o /tmp/alder-issue143-graph.json
```

Actual stdout: empty. Actual stderr:

```text
business-graph: 備品: required fields are ## Scope, ## Icon, ## Information
```

Exit status: `2`. Python version: `3.12.14`. `/tmp/alder-issue143-graph.json` was absent after the run.

## Observed limitations

- `git rev-parse HEAD` returned `fatal: not a git repository (or any parent up to mount point /)` in the local source directory. The pinned revision is therefore a requested setting, not independently checked local Git metadata.
- Case C cannot produce JSON from this unchanged fixture under the bundled strict profile; treating it as arbitrary Markdown conversion or silently adding business Scope/Icon decisions would cross the Skill boundary.
- Case A structural relationships do not establish an actual Problem or Pain. Case B's partial-failure scenario is an unapproved question conditional on an implementation/operational possibility, not a confirmed requirement.
- Requested model, reasoning effort and history-fork settings cannot be independently verified from inside this review runtime.
