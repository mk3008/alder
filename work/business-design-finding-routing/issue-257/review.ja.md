# Business Designのレビュー指摘と反映境界 — #257

既存の草案レビュー・原資料照合・修復・再レビュー・停止のループを維持し、修正可能性に応じた3分類と処理先を明確にした。単独レビューは、一意に修正できる場合も読み取り専用。人間の採否回答だけでは編集せず、別の明示的な改稿依頼で採用結果を反映する。

## 現行との差分

公開済み0.4.8（`9b4a3cbffe835cfa9c6a8ec7d602d9611a1a0285`、PR217/218を含む）には、原資料の取りこぼし／不足／曖昧さを区別する修復ループと、単独レビューの無書込みが既にある。新しいループやSkill、指摘schema、必須報告書は追加していない。

不足していたのは、検出した問題の正しい修正が一意に確定できるかの判定と、任意提案・未確認事項・Findingsの処理先の区別。草案内部の修復、読み取り専用の報告、人間採否後の明示的な改稿を、既存の経路に沿って明記した。Alder自身の業務設計の「依頼・判断・改稿・合意」と矛盾せず、その原典は変更していない。

| 指摘 | 草案作成・改稿中 | 単独レビュー |
| --- | --- | --- |
| 原資料・既決事項・書式から修正が一意に定まる | 最小修復して再レビュー | 根拠と修正案を報告する |
| 不整合は明確でも正解が未決 | 草案の未確認事項と返答へ具体的な問いを残す | 根拠と判断を要する一点を報告する |
| 原要求から導けない提案・仮説 | 価値がある少数だけ実行結果へ。0件可 | 同じく任意候補として報告する |

未採用提案を本文・未確認事項・Findings・Scope・Decisionへ書かない。形式エラーも、たとえば参照先候補が複数あれば自動修復しない。通常の未確認事項をすべてFindings化しない。

配布workflowの変更に伴いmanifestと必要なrelease noteを0.4.9候補にした。公開タグ・導入案内は0.4.8を維持し、未公開候補を利用可能な正式版とは説明していない。

## 同じ架空例によるBefore / After

[原資料](../../../tools/fixtures/plugin-draft-review-loop/routing/notes.md)と[改稿前](../../../tools/fixtures/plugin-draft-review-loop/routing/draft.md)は、既存の購買BD・相談受付BDとは独立した備品返却の架空例。原資料と期待される答えを分け、初回agentには原資料・草案・Skill・普通の改稿/レビュー依頼だけを渡した。期待する3分類、旧版の観測結果や修正の狙いは渡していない。

| 観点と入力 | 0.4.8で観測した結果 | 改修候補で観測した結果 |
| --- | --- | --- |
| `Whne`の誤記／参照記法の誤り | 正式書式へ修復 | 同様に修復。一意な書式修正として報告 |
| 原資料にある受付控えの交付・受領がProcedure/Output/Resultから欠落 | 原資料から復元 | 同様に復元。修復ループの既存機能であり、新機能とは数えない |
| 点検Whoを受付担当と断定しているが、原資料は担当未決 | 未定として質問 | 未確定として草案と返答へ。設備管理担当等を推測で決めない |
| 点検Whenが「点検済みの確認」、原資料には受領時開始との対立もある | 両案を未決として保持 | 両案を未決として保持。誤りの検出だけで修正先を選ばない |
| 管理番号の確認から故障判断へ飛躍し、材料・基準・受領元が不明 | 根拠のない手順を外し、材料等を質問 | 同様に未決を残し、結果と対象の対応付けも質問。拒否・新しい承認ルールを作らない |
| 部長の追加承認・QR読取という未採用の2案 | 草案冒頭に「決定済み業務には含めない」として両案が残った | 両案とも設計本文・未確認事項・Findingsに入らず、返答で未採用として区別。新しい任意提案は0件 |

[旧版の草案](../../../tools/fixtures/plugin-draft-review-loop/routing/observations/baseline-draft.md) / [旧版の返答](../../../tools/fixtures/plugin-draft-review-loop/routing/observations/baseline-response.md) / [候補の草案](../../../tools/fixtures/plugin-draft-review-loop/routing/observations/candidate-draft.md) / [候補の返答](../../../tools/fixtures/plugin-draft-review-loop/routing/observations/candidate-response.md)。旧版が業務ルールとして2案を採用したという観測ではない。未採用案の記録先に関する限定的な差であり、一般的な品質向上を示す比較ではない。

## 単独レビューと回答後の反映

[単独レビュー結果](../../../tools/fixtures/plugin-draft-review-loop/routing/observations/review-only-response.md)は修正可能な3件と未決3件を報告。元の草案と原資料のSHA256はレビュー前後で一致した。

次に[試験用の採否回答](../../../tools/fixtures/plugin-draft-review-loop/routing/human-decisions.md)を入力した。担当・開始・記録対応付けは確定、判断材料・基準・受領方法は未決、追加承認は不採用、QRは保留という入力である。実在業務の人間合意ではない。

- 読み取り専用側へは採否の回答と返答保存だけを依頼。[受領結果](../../../tools/fixtures/plugin-draft-review-loop/routing/observations/decision-only-response.md)は「別途明示的な改稿依頼が必要」とし、元資料・草案の両方が不変だった。
- 草案作成側へは、別途明示的な改稿と再レビューを依頼。[回答反映後の草案](../../../tools/fixtures/plugin-draft-review-loop/routing/observations/after-decision-draft.md)でWhoが設備管理担当となり、When、台帳Input、Procedure、Output/Resultが入力判断へ追従。[返答](../../../tools/fixtures/plugin-draft-review-loop/routing/observations/after-decision-response.md)に再レビュー範囲を記録。故障判断の材料・基準・受領方法だけは未決として保持し、不採用・保留の案を要件やFindingsへ追加しなかった。

## 実行条件と証拠の強さ

試験対象Pluginは `9aa60f8e22a850f8b5360c6f12c88dd9a387eddd`、canonical guidanceは公開commit `dcecce7e1f65e810df105ffd3801315c0ef2a785`。後続の証拠保存commitでこのPlugin本体を変えていない。旧版・候補のauthor、単独review、採否回答だけの受け手は履歴forkなしの別agent。author内のレビュー/再レビューは同じagent内の別工程という自己報告であり、その独立性は主張しない。指定モデルは`gpt-6-sol`、effortは`medium`。実効設定は独立検証していない。

単独reviewerはfinalize後のfollow-upを実行できない旨を返したため、その継続を成功扱いせず、保存したレビューと同じ採否回答をfreshな受け手へ渡した。author側の明示的な改稿follow-upは実行できた。[全promptとこの制限](../../../tools/fixtures/plugin-draft-review-loop/routing/observations/prompts.json)、[原資料・出力SHA256と実行条件](../../../tools/fixtures/plugin-draft-review-loop/routing/observations/manifest.json)を保存した。原資料・改稿前の本文はすべての実行後も同一だった。

## 検証

- 指示・配布の既存契約に3分類・処理先・無書込み境界の回帰を追加。保存した実例のSHA256と重要な観測を監査する検査を追加した。これらはLLMを再実行するテストではない。既存fixture/期待値/assertを弱めていない。
- package・workflow・release・exporter・provenanceの関連テストを実行。初回は履歴fixture2件のローカル未取得で失敗し、既存CIどおり固定commitをfetchした後に成功。fixtureや検査内容は変更していない。
- 公開canonical commitを確認してから既存exporterで4 Skillsの同梱19ファイルを再現・照合。差分があるのはコピーとprovenanceの8ファイル。Check作成とfollow-upの共有adoptionコピーは同一性維持の同期のみであり、Check Item固有Skill・仕様・原典は変更していない。
- 改修したSkillのYAMLをparseし、manifest・名前・説明・サイズを検査。旧版・候補・回答後の3草案は既存Graph parserを通過した（形式互換の確認であり業務合意ではない）。
- Plugin packageとAlder releaseの候補検証CIが成功。release jobはskipで、公開処理を実行していない。最終headとCIへのリンクはPRに記録する。ViewerとCheck Itemの本体・既存Business Design原典・相談受付fixtureは不変。

## 未実証・次の判断

架空の1業務・各条件1実行の限定観測。一般的な意味検出率、分類精度、ノイズ削減、人間の読解負荷、実クライアントでの自動Skill routing/インストール更新、独立agentによる内部再レビュー、参照先が複数ある構文エラーの実挙動は未実証。参照曖昧性は今回は指示契約までの検証である。

root #95のループを再実装せず、#130の自発検出実験・相談受付原典と#133の購買BD合意も変更していない。Chatで差分と証拠を独立レビューし、採否と修正点を判断する段階。未merge・未release。統合方法がsquash等なら、公開前にsource provenanceの到達性を既存の同梱手順で再確認する。
