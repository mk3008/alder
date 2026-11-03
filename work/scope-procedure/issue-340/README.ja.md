# Scope・Procedure契約の検証候補

このディレクトリは**研究用の部分モデル**であり、正式なAlder package、製品Schema、保存器、移行器、Viewerではない。版やフィールド名の採用を意味しない。[Viewer統合 #340](https://github.com/mk3008/alder/issues/340)の後続検討用。例はすべて合成データ。

2026-11-03の本人回答で、WhoをRoleのみに限定せず、Stepのやり取りを明細として図の線・ラベルを集約する方向を確認した。`step-summary*.mjs` / `step-summary-fixture.json` が新しい限定実験。以前の `validate.mjs` / `test.mjs` / `fixture.json` は**旧Relation正本・Role必須の仮説を含む履歴**として残し、新契約の根拠にしない。

## Activity・Whoと図／表の対応

**1 ActivityのWhoは単一で、業務フロー図のActivity図形は当該Whoを表す。** Whoは権限のある人間操作を表すRoleの場合も、認可された環境で自動実行されるシステム／スケジューラーの場合もある。自動処理に人間のRoleを捏造しない。具体的なIDや型の保存方法は候補であり未決。通常I/Oの `Object → Activity` は表の `Object → Who`、`Activity → Object` は `Who → Object` として扱う。Whoが未決でも図形との対応は維持し、同一Roleを複数Activityが使っても図形は別に保つ。

| 図の線 | 集約元となるProcedure行 |
| --- | --- |
| 業務 → ノート：検索条件 | Who → ノート：検索条件 |
| ノート → 業務：検索結果 | ノート → Who：検索結果 |

ProcedureをRequest／Responseに分解し、各StepがObject・方向・Data・業務操作の明細を持つ。図はStepの明細を**Activity・Object・方向ごとに集約**し、同方向は1本にしてラベルもまとめる。逆方向は別線。表示の集約でStep ID・情報・順序・適用条件を消さない。既存例外の区別や旧Relation IDの保持・移行は別途照合し、ここで暗黙に削除しない。I/O方向とRequest/Responseは別軸で、**Input Requestも成立**する。

開始パターンが異なっても途中から手順・結果が共通なら、一つのActivityの複数の開始条件と条件付きStepとして表す案を検討する。開始パターン固有のStepは適用条件付きで必須にでき、共通Stepを重複させない。変更連絡は新しいActivityのWhenにも、既存ActivityのWhenにもできる。目的・Who・手順・結果を確認し、通知ごとに自動分割しない。Whenの保存表現と分割判断の詳細は未確定。

他ActivityとのRequest／Response対応を、現在のActivityの成立条件にしない。連絡や開始イベントを架空の手順や応答に変換しない。今回の変更連絡の例はWhenの観点で再検討し、旧PoCの`notification`という第3種を正式分類として採用しない。その他の通知例を含めて表現可能性を引き続き検証する。

内部判断や未決の情報は消さず、実在しないObject・Dataを補わない。Object同士の通信をどの業務粒度で記述するか、Scopeの境界例、旧Relation IDを集約後にどう対応付けるかは引き続き検討する。

## Scopeの定義（新契約）

**Scopeは、対象システムを作る際に、そのActivityやObjectを考慮する必要があるかを表す。** `true` はシステムの作成に当たって対象として考慮するもの、`false` は対象システムの実装では考慮を要しないもの。所有者、出自、図の線の向きだけでは決めない。対象システムの境界が分からなければ推測で真偽を決めず未決として保持する。

Scope外Objectも、業務やシステムを検討する際に、入力情報の元ネタや業務のつながりを調べる資料としてBusiness Designに残せる。対象システムを実装するときは、そのScope外Object自体を実装・連携・読み込みする必要はない。そこから人間が調べた情報が、別途対象システムへの入力として要求されていれば、その入力の仕様は対象として扱う。元のObjectを実行時にアクセスする対象だと推測しない。

| 例 | Scope | 理由 |
| --- | --- | --- |
| 対象システムが書類を生成し、人間が読む | `true` | 生成責任を考慮してシステムを作る |
| 外部のPDFを対象システムが開いて表示し、人間が読む | `true` | 表示のためにシステムがファイルへアクセスする |
| 外部の情報を人が直接参照して、必要な値を手入力する | 外部資料は `false` | 資料は入力項目を調べる参考。システムは資料自体にアクセスしない |

最後の例で、入力項目が実際に要求されているなら、その項目の入力・検証はシステムの作成に含まれる。Scope外の元資料を自動的に取り込み対象とするわけではない。外部Objectを対象システムが実際にアクセス・連携する必要があると判明したら、その関係を正本に反映してScopeを見直す。Scopeが`true`でも、外部サービスそのものの実装を担うことまで意味しない。

現行0.4や旧Markdownの旧定義は管理・業務責任の意味である。既存値をこの新しい意味へ暗黙に読み替えない。正式反映では版識別、明示移行、既存ID・人間確認状態の保護とともに、現行構造定義・ガイド・Plugin同梱参照を整合させる。

## Whoの候補

Whoは単一のRoleまたは自動実行主体。PoCはRole・system・schedulerを例示するが、正式な型や参照方法を決定したものではない。名前やI/O相手からWhoを決めず、未決は未決として保持する。個人やRoleの内部構成・兼任は管理しない。

## 表と部分JSON

標準表示の候補は `Step | A（送信） | B（受信） | C（Data） | D | 操作名 | 操作効果 | 対応するやり取り`。必須/任意・適用条件・局所順序はStepに保持し、必要な形で表にも示す。`Step.text` は業務上の意味の正本で、操作名はCRUDから生成しない。Dataは共通定義、Informationの名前・説明はObject側を正本とする。

| Stepの例 | A → B | C | D | 操作名 / 効果 | 対応 |
| --- | --- | --- | --- | --- | --- |
| 過去の問合せを検索する | 設計者 → ノート | 検索条件 | Request | 検索 / Read | 次行と対応 |
| 検索結果を受け取る | ノート → 設計者 | 検索結果 | Response | 検索結果を受領 / — | 直前の検索Request |
| 顧客に確認する | 設計者 → 顧客 | 確認事項 | Request | ヒアリング / 適用なし | 回答と対応 |
| 顧客の回答を受け取る | 顧客 → 設計者 | 回答 | Response | 回答を受領 / — | ヒアリングRequest |
| 回答の矛盾を判断する | — | — | — | 判断の本文を保持 | — |
| 顧客から確認を依頼される | 顧客 → 設計者 | 確認事項 | Request | 確認依頼を受領 / 未決 | この範囲に応答なし |

複数の開始パターンと共通手順、Roleと自動システムのWho、同じノートを複数回検索する例は `step-summary-fixture.json` にある。例中のDataやObjectは合成シナリオで事前に与えたもの。実データで未記載のDataやObject機能を追加してよいという意味ではない。旧0.5候補はData項目を関係先ObjectのInformationに所属させるため、この条件を満たせない実データも自動変換せず、保持方法をレビューする。

```json
{
  "id": "s-search",
  "text": "過去の問合せを検索する",
  "obligation": "required",
  "appliesWhen": null,
  "effect": "read",
  "exchange": {"phase": "request", "direction": "output", "objectId": "notebook", "dataId": "d-name-filter"}
}
```

同じActivityが同じノートへ複数回Requestを送る例では、各StepとDataを保ったうえで、図はActivity→ノートを1本にし、そのラベルに各Dataをまとめる。Responseは逆向きの別線。Responseに別ActivityのRequest参照や架空の対応Stepを必須にしない。具体的なID・複数Dataの持ち方・同一Activity内の対応表示は製品契約ではない。

CRUDは図形や線で表さず、Stepの属性として扱う。Requestに限定する旧PoCの前提は撤回する。業務操作の意味とCRUDは同一ではなく、適用なしと未決も区別する。送受信Dataと操作対象の情報が異なる場合の参照の要否は未決。判断・例外・Resultの意味は別々に保ち、一般的な更新結果や例外を捏造しない。

## 検証と限界

```sh
node step-summary.test.mjs
node step-summary.mjs step-summary-fixture.json
```

`step-summary.test.mjs` はNode標準機能で、単一Role／システム／スケジューラー、同一Object・同一方向の線とラベルの集約、逆方向の分離、個々のStep ID/Dataの保持、CRUD変更が図へ出ないこと、複数開始条件から条件付き手順を経て合流する例、不正参照や未決を確認する。

開始条件と適用条件は文字列として保持し、共通Stepを1件だけ置くことを確認する。条件文を実行して各パターンの到達可能性や合流を証明するものではない。ラベルの区切り文字はPoC用で、Viewerの最終表示を決めるものではない。Whoの検査も構造だけで、実際の権限や認可環境を検証するものではない。

PoCの `edges` はStepから生成した**図のモデル**で、実Viewerの描画ではない。図と表はStepを共有するため互いの構造のずれを減らせる。一方、必要なStep自体が欠落すれば図と表の両方から消える。元の要求・既存I/O・独立したCheck等との意味レビューで欠落を確認する必要がある。出力の `errors: []` は構造検査の結果であり、業務合意ではない。PoCは旧0.4/0.5の読込・移行、正式package、例外や順序の全契約、実Viewerや旧検証正本を実行していない。

## 互換性・明示移行の方針

| 対象 | 識別と読取り | 編集・明示移行で守ること |
| --- | --- | --- |
| 現行main 0.4 | `alder-document-package` / `formatVersion: 0.4`、BD `schemaVersion: 0.3`。旧Scope意味と文字列Procedure、Relationのlabelをその版として読む | 新版の直接編集が正式対応した後、旧版直接編集可否は版ゲートで判断。明示依頼時に別出力。本文の句点分割、Data化、Scope値の転記、Whoの推測をしない |
| 旧0.5候補 | `formatVersion: 0.5` / BD `schemaVersion: 0.4`。未リリース候補。#342の互換読取はmain未統合 | `performers[]` とStep担当は旧情報として保存。1 Object・1 Roleでも直接Whoと自動認定しない。Step/Result/Data・局所順序・例外・ID・原文を保持し、未決や分割を人間が判断 |
| 新候補 | `step-summary-poc/1` は研究用の部分モデル識別子のみ。正式package版ではない | 正式採用時は**旧0.5と異なる**未使用の構造版を新規決定。形式版、BD Schema版、文書revision、Plugin製品版は別。未知／将来版は推測しない |
| 旧JSON 0.1〜0.3・MD | 既存の入力adapterと共通投影を維持。原本は不変 | 表示用モデルを移行正本にしない。明示変換の対象・参照・意味を別途確認 |

移行要求がなければ読み取りのみ。明示移行は元bytesと旧BD・Check/State/概念の組を保ち、新しい候補を別ファイルに作り、版・ID・原典・変更差分・Scopeの再判定・未決・移行不能を報告する。旧0.5のStep/Result/Data/Information・Relation・例外IDと所有者、旧Who情報、例外本文、局所順序と業務条件を消さない。無根拠な1→N分割、ID変更、草案の承認、空のDataやObjectの創作はしない。

Check/State/概念などの参照先版と人間確認状態は旧原本にそのまま残す。新BD版へ旧Check/Stateを一括rebaseしたり、旧確認済みを新版への合意として再利用したりしない。新版との意味対応・人間確認・参照の付替えは独立に確認し、移行不能なら旧組を保持して未完了を返す。旧#309のBD-only別package方式は安全な出発点だが、現mainの概念/Check参照と単一ファイル運用を含む完全な再照合方式は未実装。保存は既存hash/版・lock・失敗時非書込みを保持し、[版ゲート/明示変換 #348](https://github.com/mk3008/alder/issues/348)の進行と整合する。

## 既存PRの保証別処遇

比較基準：main `8f75179ac8f2d51b9250d621e70e31a0e36509d8`、#341 `0cc6fb6f6e5c050b800252e2f999b9df83c310f6`、#342 `fbc2b06b799f25c154cac268c1babc79221d2bd6`、#309 `85ed1d14b0e6cc0cdc9c62f6e4ac37d8b187acf8`、#311 `5a1a4f47eb4635e6221bffa39e5d52fe2f8519bc`、#313 `fa93735283f84e51fceac74e07b35f9df70d2d9a`。以前のCI・GUIの記録は各PRを参照。今回その全体CIや本人操作は再実施していない。

| PR・保証 | 推奨処遇・理由 | 後継で残す検証 |
| --- | --- | --- |
| [#341](https://github.com/mk3008/alder/pull/341)：Input/Output詳細から自Activity名だけを除く | **先行統合候補**。旧0.4/MDの独立した表示変更でGUI採用済み。今回mergeしない。後続作業時に最新main・CIを再確認し、別のmerge判断を経る | `ACTIVITY-IO-DETAIL-001..004`、`test-activity-io-detail.mjs`、`test-business-drawer-direct.mjs`、関連Chrome。0.5・新形式も同じ期待で追加検証。相手/情報/同名・複数Relation・例外方向・元データを保持 |
| [#342](https://github.com/mk3008/alder/pull/342)：旧0.5互換・Step/Result/Data・Who診断 | **新契約へ選択移植**し、後継実装・検証・別判断後にClose。#342の「Whoは必ずRole」前提は訂正する。互換読取と新表は別の保証。#341と `document-view.ts` が重なるため片方で上書きしない | `WHO-ROLE-001..010`の旧0.4・旧0.5読取に必要な保証を保持しつつ、新たにRoleを要しないシステム／スケジューラーWhoを正例とする。旧Whoは推測せず旧担当情報・原文・ID・各Result/共通Dataを保持。`JSON05-REINTEGRATE-001..008`、`JSON05-VIEWER-001..006`、File/URL/復元・不正入力・状態・Check回帰を照合 |
| #342のGUI指摘 | **後継Viewerの受入条件に移植**。固定headのGUIは部分採用 | Procedure前の黄色警告・指摘詳細への到達・左の指摘・原文Finding/Checkと状態を維持。同一Viewer生成指摘の上部重複行だけ解消。0.4/MD/旧0.5の正負DOMと狭幅Chrome、本人の実操作確認 |
| [#309](https://github.com/mk3008/alder/pull/309)：0.5 Schema・保存 | **新契約へ保証を選択移植**し、後継検証後にClose。旧Who設計は履歴のみ | `D2A-02`のWho旧解釈を訂正し、`D2A-12`は当時のPhase範囲の履歴として扱う。その他の条件・理由を確認して維持。`test-structured.mjs` のStep/順序/Result/Data/所有者、例外本文、ID、明示移行、Check/State rebase拒否、CAS/lock/失敗時非書込み。main側の概念・Check追加保証も併せて保持 |
| [#311](https://github.com/mk3008/alder/pull/311)：生成/レビューSkill・同梱runtime | **新契約へ選択移植**し、後継検証後にClose。旧performers/Role兼任指示は採用しない | canonicalとbundle/provenance完全一致、exact-SHA取得、版ゲート・未対応停止、Check人間合意、作成→更新→保存→読戻し・read-onlyレビューの実Agent検証と異常系を残す。旧形式を黙って直接編集しない |
| [#313](https://github.com/mk3008/alder/pull/313)：旧0.5 Viewer・State | **履歴と選択移植元として保持**し、後継検証後にClose。旧Viewer一式はmainへ戻さない | `JSON05-STATE-COMPAT-001..005` と `test-json-05-state-compat.mjs` の同条件・別遷移ID/条件/選択/未決、0.4/0.5の読取差、`conditionLabel`と元条件の扱いを照合。自己遷移の旧「別線」assertはmain採用の同状態・同線種の束ねへ置換し、各ID/意味/選択が失われない独立期待を維持。旧0.5の直接訂正保存を要求する`003`は後の#348方針に従い、旧版編集拒否と明示変換後の訂正・非破壊保護へ移し、読取保証と旧原本・人間状態は保持する |

GUI共通部分はmainのDrawer・Explorer・タブ・図・状態・概念・Check・選択/復元を維持する。線とそのラベルの集約は図の表示であり、Step明細や#341のInput/Output詳細の情報を削除・統合する指示ではない。#341の自Activity名抑制と、#342の黄色警告・旧形式未決は対象と条件が異なるため、一律に統合・削除しない。旧正本ファイルや人間レビュー状態を今回変更しない。

## 後続Phase案と受入

0. **Chatで契約レビュー**：Activity図形は当該Whoを表し、WhoはRoleに限定しない。Step詳細から図の線・ラベルを方向別にまとめる。Scopeは対象システムの作成に考慮が必要かを表し、Scope外Objectは設計時の参考として保持する。開始パターンの合流、旧Scopeの意味移行、既存Relation IDの移行、一般の通知やObject間通信の表現を引き続き検討する。GUI・形式版・移行後の意味はPoCの成功だけで採用しない。
1. **Schema/Validator・保存器**：合意された版・実例を固定。正式Schemaと既存保存経路に最小実装し、旧0.4/旧0.5の読取、版識別・未知拒否、明示別出力移行、Scope再判定、Step/Result/Data/例外/局所順序、参照と全人間状態・CAS/lock/失敗非書込みを正負・実CLIで確認。構造定義・ガイドは版ごとの意味が分かるよう更新し、Scope外Objectの参考資料としての保持と実装対象にしない扱いを確認する。#348の版ゲートと競合させない。自動保存・rebaseしない。
2. **生成/編集・レビューSkill**：Phase 1の固定契約を入力にcanonical/bundle/provenanceを更新。版別の読取/編集/明示変換、単一Who、表・図の相関、未決、Check合意ゲートを確認。隔離配布copyで実Agentの作成→更新→保存→読戻し、read-onlyレビュー、異常系を検証。
3. **Viewer**：最新mainと#341の採用表示を基準に、#342から旧0.5互換・黄色警告等を選択移植。新契約の表と図を共通モデルから表示。旧0.4/MD/旧0.5・新形式、File/URL/復元、不正時保持、情報と状態、PC/狭幅、固定Preview・最終全体CIと本人GUI操作を確認。
4. **Release/配備/個人Plugin**：Schema・Skill・ViewerのレビューとCI完了後、差分・version・release notesを用意。個別承認後にmerge、Release、Viewer本番、同一ID/PRIVATEの個人Plugin更新を別々に実行し、それぞれ読み戻す。実ChatGPTの作成→保存→読戻し→Viewer閲覧smokeまで区別して記録する。

各Phaseは個別の指示・Draft PRとし、既存PRのmerge/Closeは今回実行しない。正式Schema、Viewer、Plugin、本番Pages、既存JSON・既存Checkの人間状態は今回変更しない。
