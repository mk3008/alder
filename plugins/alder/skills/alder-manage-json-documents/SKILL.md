---
name: alder-manage-json-documents
description: Create, update or review Alder typed JSON Business Design/Check/explicit partial State Transition package, manage named plans in one JSON, link existing concept examples to Checks, or explicitly convert existing Markdown to JSON. Use for 「Alderで業務設計をJSONで草案にして」「このJSONの業務を追加・改名して」「複数の業務案を一つのJSONにして」「JSON正本からCheckを作って」「AlderのMDをJSONへ変換して」. Preserve human agreement gates and existing Markdown workflows. Not general lifecycle/concept model specification, Viewer implementation, or business approval.
license: MIT
---

# AlderのJSON文書を作成・更新する

新規作成で形式が未指定ならJSONを既定とする。この候補runtimeでは、新規草案は[手順と判定表の候補契約](references/business-design-decisions-v07.ja.md)のpackage 0.7で作成する。既存0.4の読み書きも維持する。例外をID付き要素として定義し、状態操作はexceptionIdで参照する。説明文の装飾から例外を認定しない。旧JSON／MDは互換入力または明示移行だけに使い、JSONから仮MDを生成しない。

[JSON操作ガイド](references/plugin-json-authoring.ja.md)を読み、操作を選ぶ。実際の導入版は`../../plugin.json`、同梱ソースの版/hashは[provenance](references/provenance.json)で確認する。候補契約は`alder-document-package/0.1（BD/Check）、0.2（部分定義の状態遷移）、0.3（Role ID/名称/保存色）、0.4（構造化した例外とID参照）、0.7（手順と判定表の候補）`。0.5・0.6は旧候補として読み、直接編集しない。Plugin版やGraph v1と混同しない。

複数の業務案を扱うときは、操作ガイドの「複数の業務案」に従い、同梱`named-plans-cli.mjs`で案を作成・検査・抽出・更新する。`inspect`の案IDと名前を依頼に照合し、更新・レビュー対象を一意に特定できないときは対象を確認する。先頭案を自動選択して編集しない。案IDと文書revisionを区別し、対象以外の案・元の単一ファイル・人間判断を保持する。レビューだけなら対象案を読み取って検査し、正本を変更しない。

JSONの編集前に正規CLIの`inspect`で`format`・`formatVersion`と`compatibility`を確認する。複数案は対象案を一意に選び、その案のpackage版を確認する。直接編集できるのは`alder-document-package/0.4`と候補`0.7`で、Plugin版・外側bundle版・文書revisionとは区別する。旧版や未知版はそのまま編集せず、対象・検出版・対応版を示して止める。旧版の編集には別ファイルへの明示変換が必要であり、未知版は形式の対応可否を確認する。0.4・旧0.5から0.6、0.6から0.7の準備は同梱CLIの明示的な別ファイル生成として扱う。利用者の明示依頼なしに変換せず、依存Check・State・概念文書を自動追従させない。閲覧・レビューでは旧版を原本不変で読める場合がある。

聞き取り時は、認可・入力の可否と正常系の処理ルールを業務設計の手順に結び付く判定として構造化し、テスト仕様から同じ判断を参照する。モデル設計は業務設計を整理した後に行う。現行Schema・保存器が未対応の場合は別のレビュー用候補に保持し、正式保存ガードと人間確認を伴う実装引き渡しを維持する。

1. 対象ProjectのAGENTSと既存正本、今回の依頼を読む。既存正本の形式・版を確認し、新規作成はJSON、編集対応版の既存JSONは同じJSONを更新する。既存MDを指名した改稿は元のMD Skillの互換経路へ戻り、明示依頼なしに移行しない。MD原典から新規JSON Checkを作る場合も、一方向変換の明示依頼と対象BD版への人間合意を先に確認する。
2. BDの作成・改稿には[adoption](references/adoption.md)のsection 1と[文書構造](references/business-design-structure.ja.md)を読む。JSONでは見出しを[Schema](scripts/document_storage/schema.json)の型付きフィールドへ対応させ、Markdown中間正本を作らない。既知の入力・IO・条件・役割・Procedure/Resultを保持し、未決を推測補完しない。
3. [同梱runtime](scripts/document_storage/author-cli.mjs)のruntimeを実行する。直接JSONはNode24以上、MD変換はPython3.12以上も必要。利用不能なら報告してその操作を止める。repo clone・外部API・ランタイムの無断導入を要求しない。
4. 作成はIDを割り当ててJSON候補を直接書き、validate→create→保存後inspect/validateを行う。更新は既存IDを維持し、文書/package版とファイルhashを照合するcommitを使う。参照・版ずれ、既存lock、競合、未対応欄を修正したふりで通さない。
5. BDレビューでは[品質](references/business-design-quality-check.ja.md)、[相関](references/business-design-correlation-check.ja.md)、[漏れ](references/business-design-omission-check.ja.md)、[Findings](references/design-findings.ja.md)を適用する。未完了の作業を保存して後から続けると明記されていれば、誰が対象を特定・選択し、どの業務で再開し、提出・終了まで何をするかを文書全体からたどる。最後の状態遷移があるだけで再開経路を補完せず、業務の継続を妨げる欠落は根拠付きで指摘する。特定の画面や未記載の権限を推測しない。review-onlyは読取り・検査・指摘だけにし、保存・状態変更しない。
6. Check操作では[Check契約](references/check-item-traceability.md)を読み、聞き取った条件と期待結果は、BD全体の合意を待たず、業務設計に手順と結び付く構造化された判断として記録する。Check草案は同じ判断を参照し、業務上の条件を別々に保守しない。対象・条件・比較方法・値・期待結果・出所・関連Activity／Step・確認状態を、分かる範囲で区別し、未決を推測しない。候補0.7では未レビュー・要確認のCheck草案を業務設計と同じ候補に保存できる。0.4では合意前の正式Check保存に対応しないため、独立したレビュー用の構造化候補に保持する。正式Checkの保存では正確なBD版への人間合意を確認し、既存ガードと確認状態を維持する。[共通の意味保持圧縮指針](references/check-item-traceability.md#meaning-preserving-condition-compression)を条件組合せの検討・草案・更新・Consistency reviewに適用する。共有保証・例・根拠・Test証拠・既存ID/人間状態を保持する。確認済みへの変更は該当期待への実際の人間発言と候補hashを明示し、テストや無回答から推定しない。basedOn.verificationはunverifiedのままにする。
7. Roleを含むJSONは[ロール契約](references/json-roles.ja.md)を読み、rolesの安定ID/名称/基本5色を保持する。候補0.7のWhoはActivityごとに単一で、直接参照するRoleまたはシステム／スケジューラーである。改名でID/色を変えず、複合Whoは原文と未確定診断を残す。旧JSONは原本へのmigration commitをせず、別ファイルへの明示変換の対応可否を確認する。人間Checkゲートを保持する。
8. 返却前に全体Schema/参照/版と要求・業務意味の対応を別々に点検する。Checkは保存候補とBD全体を使って、原典→保証/例・全index/共有参照を確認するread-onlyのConsistency reviewを別工程で行う。独立readerがない場合は同じ文脈で行ったと開示する。根拠のある範囲だけ修正し、再検査する。人間にJSONの手修正を委ねない。

既存の概念データ例をCheckの具体例として使う依頼では、[JSON操作ガイド](references/plugin-json-authoring.ja.md)のCheck参照・明示移行に従う。対応先を名前やデータ値から推測せず、参照検査と意味の整合レビューを分ける。例をCheckに結び付ける操作も、Check新規作成や内容変更の合意ゲートを免除しない。

ディシジョンテーブルは上から順に見て最初に該当する行を用いる。‐ はその行の条件を問わない意味であり、同上ではない。同じ先行条件の分岐で扱っていない値は、適用範囲と結果の根拠が明確なら「それ以外」で示す。条件の組数を減らすことより、IF／elseが上から自然に読めることを優先する。不問・それ以外・未決を区別する。同じ行に複数のCheck IDを置いても独立した保証を保持し、すべてが同時に成立すると扱わない。列の順序を変えても業務上の結論を保ち、表の読み順を実装の評価順として強制しない。未決の条件に結果を補わない。

可否判定は対象操作の入力・引数または操作前にシステムが観測できる状態を条件とし、操作後に観測できる結果を示す。利用者が操作を行う理由、システム外でのファイル紛失、操作後の失敗を、明示的な入力や記録済み状態なしに条件にしない。例えばCSVの紛失は再出力のきっかけであり、条件は対象の購入準備番号や確定状態から確認する。失敗の注入や同時操作は、準備・操作・観測する保証を再現可能なシナリオとして記述する。未定義のエラー応答や業務ルールは推測しない。

業務設計の各Resultと例外・別ルートについて、対応するCheck／テスト仕様の根拠を照合する。複数の対応先があれば保持し、名称だけで対応を推測しない。仕様が存在しない場合と、既存仕様との対応が未確認の場合を区別し、不足と未決を人間が確認できるようにする。Checkの存在をテストや人間合意の完了とは扱わない。

Viewerの参考案で項目別の対応を示す場合は、既存の`presentation.activityViews[].testSpecificationFunctions[]`に`businessSections`を追加し、`kind: "result"`、または`kind: "exception"`と同じActivityの`exceptionId`、実際に対応する`pages`（`decision`／`result`）を記録する。実際に未作成と確認した項目のみ、同じActivity viewの`uncreatedTestSections`に`result`または例外IDを記録する。参照の妥当性と意味対応は別々に確認し、名前の一致だけでは追加しない。別ルートと不成立が明示されている場合は、同じActivity viewの `businessVariations` に同じActivityの `exceptionId` と `kind: "alternative"` または `"exception"` を記録できる。名前やテストの存在から種別を推測しない。これは既存の自由形式presentationを使う試作上の表現であり、正式なJSON標準の採用や人間合意を意味しない。

明示的なMD変換は[同梱converter](scripts/document_storage/cli.mjs)のconvertを使う。元MDを保持し、旧MD全文の同梱・JSON→MD同期を行わない。購買研究草案の未知見出しやCheck原典版の不一致は診断して止める。

明示された部分定義の状態遷移は[状態文書契約](references/json-state-transitions.ja.md)を読み、既存ID・未決・例外名・根拠を保持して直接草案/更新する。一般の状態遷移や概念モデルの業務意味、JSONの正式v1採用、Viewer対応、配布/releaseはここで決めない。保存した版・実際に使ったランタイムと検査結果、残る未決と人間判断を短く返す。
