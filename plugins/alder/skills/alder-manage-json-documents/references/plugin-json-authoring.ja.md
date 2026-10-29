# JSON正本の草案・更新

候補保存契約`alder-document-package / 0.4`（旧0.1〜0.3は互換入力adapterで読込）を使い、ヒアリングから直接JSONを作る。Markdownを中間正本にせず、人間には業務上の文章と判断点を説明する。既存Markdownは明示変換しない限りそのまま扱う。状態遷移は明示された部分定義だけを扱い、概念モデルは対象外とする。

新規JSONは[候補0.4の構造契約](json-native-contract.ja.md)を使う。例外はID付き要素として作成し、状態からexceptionIdで参照する。MD形式の例外文を作る必要はない。旧候補の読込・保存移行は明示された互換境界に限定する。

## 読む根拠

Business Designの業務意味・合意はadoption、欄の役割はbusiness-design-structure、レビューはquality/correlation/omission、Checkはcheck-item-traceabilityを使う。JSONのフィールドと型は同梱schema.json、構造・参照・版はcore.mjsが検査する。Markdownの見出しはJSONの型付き欄へ対応させ、MD書式そのものを新しい業務条件にしない。

## 直接草案

1. 対象ProjectのAGENTSと既存正本、依頼、既知の判断・未決を読む。新規で形式指定がなければJSONを既定とし、選択済み正本がJSONの場合もこの経路へ進む。既存MDを指名した更新はMD互換経路を維持し、明示依頼なしに移行しない。新規JSON Checkの原典がMDだけの場合は、原典の一方向変換を明示確認し、正確なBD版への人間合意を得てから作成する。
2. `author-cli.mjs runtime`を実行する。直接JSONの作成/更新/検査はNode 24以上、MD変換はPython 3.12以上も必要。利用不能なら実際の制約を報告し、ランタイムを無断導入しない。
3. `ids N`で必要なIDを一度割り当て、Schemaに沿うJSON候補を直接書く。初回はpackageと文書のrevisionを付け、BDをdraftとする前提・未決をpreface/Findingsへ残す。Why/When/Procedure等はヒアリングに根拠を持つ文章とし、回答のない業務規則を補完しない。
4. 新規直接草案の`sources`は空でよい。原典のないMD digestや架空のURLを作らない。既存JSONのID・原典metadataを再発行・再計算しない。
5. 候補全体をvalidateし、author-cliのcreateで新しい正本へ保存する。保存後にinspect/validateして原要求と内容を照合する。候補ファイルは作業用であり別の正本ではない。

## 更新とレビュー

既存正本をvalidate/inspectし、byte hashとpackage revisionを取得する。全体を読んでから依頼された要素だけを候補で変更する。Activity/Object追加には新IDを割り当て、既存の改名・並べ替え・内容更新ではIDを維持する。変更文書とpackageのrevisionだけ更新する。既存IDの無申告の削除/置換、原典目録の書換え、外部目録の改変は保存器が拒否する。保存前後で未決、Findings、文章内の引用、関係と共有Checkを比較する。

状態遷移の訂正で不要な遷移を除く場合に限り、commit操作の`removedTransitions`に対象ID、理由、依頼や根拠の出所を明記する。候補で実際に削除した遷移と操作の申告は一致させ、操作記録を保存する。同じsourceIdの新IDへの置換はできない。他の種類の要素の削除には対応しない。削除による業務の意味を保存器が判定したり、削除したIDの将来の再利用を検知したりするわけではない。

JSONレビューはread-only。authoring/commitや人間状態の変更を行わない。必要なレビュー観点をBusiness Designへ適用し、観測箇所の文書ID/revisionと要素IDを示す。会話では業務名と意味を説明する。Schema成功を意味レビュー成功として扱わない。

BD版を変えたとき、依存CheckのbasedOnを黙って追従させない。新BDの人間合意がない間は、最終正本への不整合保存を止め、候補と診断を残す。人間の合意を得てから、影響するCheckを点検し、BDとCheckの新しいrevisionを同じ候補に反映する。期待が変わる場合は再レビューへ戻す。

## Checkの合意ゲート

Checkの新規草案・更新・確認は、対象BDの正確なID/revisionについて人間が業務内容を合意した後に行う。依頼が単に「実装して」「JSONを作って」であること、閲覧、無回答、テスト成功は合意の証拠にならない。既存の明示合意が今の版に有効なら再度尋ねる必要はない。なければその業務判断を求め、独立して進められる作業だけ続ける。

操作入力`bdConfirmations`は文書ID/revisionと、実際の人間発言の出所・引用を持つ。JSON本文の承認属性ではなく、その操作に必要な証拠である。プログラムは引用の真正性や業務意味を認証できない。Agentは発言を創作しない。`basedOn.verification`は候補契約どおり`unverified`を維持し、人間レビュー状態とは混同しない。

条件分岐と具体例には[共通の意味保持圧縮指針](check-item-traceability.md#meaning-preserving-condition-compression)を適用し、草案・更新後のConsistency reviewでも圧縮前後の対応を検査する。一般保証・具体例・共有本文・根拠・Test証拠を保持する。新規Checkは未レビュー、未決の意味なら要確認。変更のない確認済みの期待は維持する。一般保証や参照先の意味を変えた場合は要確認（未対応の人間修正要求は要修正）に戻し、確認済みを持ち越さない。Test証拠不足だけで合意状態を下げない。

人間レビュー状態を変更する操作には`humanDecisions`で対象内部ID・変更先状態・候補のmeaningSha256・発言の出所と引用を明示する。タイトル/条件/期待に対する人間の確認を、正確な候補へ結び付ける。曖昧な承認を複数Checkへ拡大しない。新規草案を同じ作成操作で確認済みにしない。表示上の改名でも保証文自体を変える場合は差を人間へ説明する。

## 実行方法

以下のSCRIPT_DIRをインストール済みSkillの`scripts/document_storage`へ解決する。保存操作は成功0、失敗2。ファイル名は引用する。

```sh
node "$SCRIPT_DIR/author-cli.mjs" runtime
node "$SCRIPT_DIR/author-cli.mjs" ids 10
node "$SCRIPT_DIR/cli.mjs" validate "/path/to/candidate.json"
node "$SCRIPT_DIR/author-cli.mjs" create "/path/to/candidate.json" "/path/to/design.json" "/path/to/operation.json"
node "$SCRIPT_DIR/author-cli.mjs" inspect "/path/to/design.json"
node "$SCRIPT_DIR/author-cli.mjs" commit "/path/to/design.json" "/path/to/candidate.json" "/path/to/operation.json"
```

新規BDのみならoperationは`{}`。更新時はinspectで得た`expectedSha256`と`expectedRevision`を渡す。必要な版のBD合意とCheck判断を同じ操作入力へ追加する。変更のない文書のrevisionを無意味に変えない。

```json
{
  "expectedSha256": "inspectで得たファイルhash",
  "expectedRevision": "package-1",
  "bdConfirmations": [{
    "documentId": "対象BDのID",
    "revision": "今回合意したBD版",
    "evidence": {"source": "実際の発言への参照", "quote": "対象業務内容への明示的な合意の原文"}
  }],
  "humanDecisions": []
}
```

commitは専用lock、期待byte hashと版の再照合、全体検査、一時ファイルの検査、同一ディレクトリ内のrenameで保存する。既存lock・競合・不正候補は停止する。最後の正本を直接エディタで上書きして回避しない。読み手/外部エディタはlockを守るとは限らず、全外部プロセスとの完全なトランザクションを保証しない。書込み権限・ロック・競合に問題があれば出所と実際のエラーを返す。

## Markdownの明示変換

変換だけを依頼された場合、BDの業務条件やCheck状態を新たに承認せず、既存MDの値を保持する。runtimeのmarkdownConversionがtrueであることを確認し、cli.mjs convertを明示起動する。直接JSON草案の代わりにMDを生成してconverterへ通さない。

```sh
node "$SCRIPT_DIR/cli.mjs" convert "/path/to/request.json" "/path/to/new-package.json"
```

要求ファイルはdocumentId/kind/revision/path、CheckにはbasedOnを持つ。pathは要求ファイル基準。現在の対応profileに限定し、購買研究草案のMedium/SR Dependenciesや原典不一致は診断して停止する。見出しを削ったり出所を書換えて通さない。旧MD全文をJSONへ入れず、JSON→MD書戻し・同期は行わない。

## 返却

実際に保存したpackage/document revision、変更要素、保持した人間状態・未決、実行した検証、未達を簡潔に返す。生JSONを人間に手直しさせる運用に戻さない。人間には業務意味と採否を問い、技術修正と再検査はAgentが行う。Viewerでの表示は別Gateであり、実際に未対応のJSONを現行Viewerで閲覧済みとは言わない。

## 明示された状態遷移

[部分定義の状態遷移](json-state-transitions.ja.md)の契約に従う。形式0.4のstateTransition文書（payload 0.2）に、対象Object・明示状態・操作Activity・条件・例外ID・根拠・未決を直接草案化できる。通常のcreate/commit/inspectと同じruntime・競合防止・参照検査を使う。状態と操作の既存IDを保持し、BD更新に伴うbasedOnと各文書revisionを明示する。Checkの人間確認とは独立で、状態遷移の業務承認を推定しない。

MD宣言の変換はrequestのstateDocumentsに文書ID/版/BD ID/Object名を指定する。明示表だけを変換し、未知のMedium/SR Dependenciesや無宣言の自然文は補正しない。元MDは残す。再変換での状態名改名bindingは未対応のため、改名はJSON正本のIDを維持したcommitで行う。

## ロールの同一性と保存色

[ロール契約](json-roles.ja.md)を読み、候補0.4ではBD schemaVersion 0.3のrolesとActivity.roleIdを直接草案・更新する。改名時にID/色を再発行せず、複合Whoを統合しない。旧0.1〜0.3の読取りは互換境界で行う。旧0.1/0.2からRoleだけを構造化するprepare-role-upgradeは従来の候補0.3を作る。候補0.4への明示移行はprepare-exception-upgradeで新しい候補だけを作り、検査後にmigration操作と期待版/hashを伴うcommitを行う。Checkがある場合の新BD版の人間合意を推定しない。
