# PR #141との統合

PR #144はmainから分岐し、0.4.0のSkill実装と、それに必要なREADME提供範囲・操作例だけを変更する。PR #141のbranchは更新していない。

PR #141の固定head `d28b1a1ffa18959e8125a2e842a417d2099073a2` の日本語README向けに、[最小の適用候補patch](pr141-readme-integration.patch)を用意した。草案→自己レビュー→依頼者とのレビュー→結果反映の四段階、図、既存アンカー、業務設計への差し戻し、人間の未決/確認境界を変えない。Plugin内部文書を手渡す説明と依頼例だけを0.4.0へ置き換える。

mainへのmerge順は人間が判断する。どちらを先にmergeしても、後続側ではREADME、adoption、Plugin版/provenance、package testsのcontent conflictを確認する。README全体を片方で置き換えない。PR141の人間レビュー中の構造と図を維持し、その中の操作/提供範囲へPR144の能力を統合する。patchは固定head用なので、PR141が進んだら現在差分へ再適用・再レビューする。

手順:
1. PR141の現行headと人間の修正指示を確認する。
2. 日本語は上記patchを参考に、チェック作成・read-only自己レビュー・同じリストへの更新をAlder自然言語操作へ整合する。英語はPR144の最小差分を同じ意味で反映する。
3. 公開する0.4.0導入固定と旧0.2.8の検証範囲の違い、実クライアント未検証、Python必要範囲を残す。0.4.0の実client検証が完了したと説明しない。
4. authoring同梱adoptionのbytes/provenanceを統合後の原本へ同期し、版を0.3.3へ戻さない。source revisionは実在commitへ固定する。
5. package tests、graph/drift回帰、読み順・リンク・図を再確認する。merge/CIはREADMEの人間受入やPlugin installを意味しない。

公開前に、PR141のPlugin/manual分離のadoption修正はPR144の正式source `0c78a4d1c937174fb52d0668abc85ff0534f80c4`へ取り込み済み。公開後の141同期では旧0.3.3 package/adoption差分を持ち戻さず、公開mainのbundle/provenanceを維持する。patchに残る開発版/旧導入の表現は、公開0.4.0の導入タグへ合わせる。
