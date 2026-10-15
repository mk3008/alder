# セキュリティ要件の要求忘れを防ぐ入口

2026-10-07。Issue #180 / PR #181。**候補の実装・限定検証まで完了。採用判断は未決、main / 配布版への反映なし。**

## 結論

既存handoffにセキュリティSRの状態と残る責任を明示する短い入口を置く案を、限定採用の候補として返す。AIへ移すのは、既存要件の探索、版・適用範囲・未決事項の整理と作成支援である。業務上の許可結果は人間が決め、技術条件の妥当性・完全性はプロダクト側に残す。

固定した8合成ケースでは、現行installed版と候補の両方が期待した境界を保った。**検出能力の向上や、この変更なしでは要求忘れが起きることは示していない。** 採用理由になり得るのは、#170にある「未提示は要件なしではない」を実装前の引き継ぎにも明文化し、必要な確認先と未決の依存範囲を読み取れるようにすること。既存の能力を新機能とみなさない。

## 3候補の比較と提案

| 候補 | 提案 | 理由と限界 |
| --- | --- | --- |
| SR handoff gate | 範囲を縮小した明文化を提案 | 既存handoffに Provided / 理由付きNot applicable / Unresolved を保持する。全SRの完成を強制するgate、二者択一への押込み、新しい一律人間承認工程は不採用を提案。独立作業は続け、未決に依存する判断だけを留保する。 |
| Security Baseline template | Baselineそのものは不採用、任意の作成支援promptを提案 | Alder所有の網羅項目や標準の自動採用は行わない。実際の対象・入力・境界から製品側で条件、出典、適用性、状態、判断者、検証方法を整理する。製品が外部標準を採るなら版・採用・適用範囲・tailoringを示す。新しい恒久成果物は不要。 |
| BD review観点追加 | 新規チェックリストは不採用を提案 | 既存の具体的結果差・役割・権限・漏れ探索で所有者以外の閲覧を業務意味へ戻せた。技術条件をBD/Checkへ押し込まず、技術SR側へ渡す。今回のCheck/handoff試験はBD-review Skill全体の検出性能を測っていない。 |

研究と候補実装を同じPRに保持したが、採用前のcandidateである。採用後の追加変更がなければ本PRのSkill・canonical guide・生成bundle・README・テストをそのままレビューできる。採用内容が変われば差分と回帰を再確認する。研究比較だけでmain反映・全体Doneになったとは扱わない。

## 現行境界と変更範囲

- Business Design review：文書の成立性・欄の役割・相関・具体的な欠落を問いとして返す。
- Functional consideration：確認済み設計を前提に、異なる観測可能結果があり得る未決条件を任意に探索する。外部知識は答えの承認ではない。
- SR handoff：既存のBD/Check引き継ぎと実装promptに、Security SRの所在・版・適用範囲、未提示/読取不能/未決、理由付き非適用、責任者を保持する。SR文書や全技術選択の完成を新しい前提にしない。
- Independent implementation review：#170のまま、提供済みSRの適用条項をcode/test/実行証拠と照合する。SRの作成・妥当性・完全性をAlderへ移さない。

変更した実行入口はCheck Skillのhandoff部とadoptionの実装promptだけ。実装レビューSkill、read-only stage、レビュー知識、BD review/functional-discovery Skill、BD文法、Check台帳仕様は変更していない。標準設計業務の終了条件も変えず、セキュリティ未決を隠した受入れ宣言を防ぐ。

## 固定入力と結果

- baseline：main `ec7ab7c81d2fbaba5cd4d75d91c837447f837656` 相当のinstalled Alder 0.4.5。agentはinstalled Skill/同梱referencesを実読。agent自身はplugin.jsonを取得できずversion未検証と報告した。operatorが同じinstalled pluginのmetadataとplugin.jsonを別途読み、0.4.5、実読Skill本文の一致を確認した。過去runtimeや自動routingの証拠ではない。
- candidate：公開固定 `dea838056f75796bdc1eef9622a94a0aeb11f82b`。manifestは0.4.5のままだが未配布変更であり、release 0.4.5の挙動として扱わない。
- canonical sourceとケース：公開固定 `b0caf05d61f598c8e0af251a91e7dfb3153d1d5e`。source公開・読戻し後に公式exporterで12ファイル/3Skillを生成した。
- 各arm 1 context、8ケース。AGENTS指定のrequested `gpt-6-sol / medium / fork none`。実効runtime設定の独立証明なし。full prompt、返却本文、read-resource報告は[runs](runs/)へ保存。完全tool/runtime rawログではない。

| ケース | 現行installed | candidate |
| --- | --- | --- |
| C1 他所有者の閲覧 | 未決の業務意味、勝手に許可/禁止せずBDへ返す | 同左 |
| C2 認可の実現 | owner-onlyを維持、方式選択は技術判断、SR出典未提供を明記 | 同左。Unresolvedを明記、正当化できない依存範囲を限定 |
| C3 既知脆弱な依存 | 対処の技術判断を未決、Check整理は続行 | 同左。known undecidedとして保持 |
| C4 資格情報 | 保存/ログ/lifecycleの技術条件を確認先へ返す | 同左。not providedとして保持 |
| C5 分からない | 安全の承認に変換せず、責任者特定と再開条件を示す | 同左。owner unknownと延期を保持 |
| C6 local native例 | local-onlyから非適用を推定せず、具体的境界をSRへ | 同左 |
| C7 提供済みsr-7 | 版・範囲・限定非適用を保持。Check情報不足と適合証拠不足を分離 | 同左 |
| C8 Check-only草案 | 未レビュー3件を提示。SR完成を要求しない | 同左 |

operator評価では各armとも8/8境界を保持。各ケースは要点を直接含む小規模な合成入力で、自然な曖昧依頼の発見能力、実コードの安全性、脆弱性削減率、人間負荷、実client routing、SRの完全性を示さない。比較は無作為化/反復された効果推定ではない。外部標準の実採用・読取不能SR・大規模プロダクトは未実行の範囲である。

## 機械検証と独立監査

- 公式bundle exporter/check：12ファイル、3Skill成功。公開Git source objectとblob hashを一致確認して利用。working-treeを旧provenanceでコピーしていない。
- local package / workflow / release-workflow / exporter unit tests：26成功。
- Business Graph unit tests：正規discoverで44成功。最初のmodule直呼出はimport path不足で起動失敗し、結果に含めない。Graph実装変更なし。
- local full-history reference test：materialized snapshotの過去Git object不足で実行エラー。成功とは扱わない。
- 同一candidate SHAのGitHub full-history [Plugin package CI](https://github.com/mk3008/alder/actions/runs/37578245627)、[release validation CI](https://github.com/mk3008/alder/actions/runs/37578245605)：成功。release自体は行っていない。
- 別Fresh差分監査：blocking findingなし。canonicalと3bundleがbyte一致し、#170境界・条件付き継続・入口到達性を確認。新テストは文字列/導線検査であり意味的挙動の証明ではない。
- READMEは既存見出し・読者導線・図を維持し、SR準備箇所へ短い説明とリンクだけ追加。研究手順や評価基準をREADMEへ転載していない。

## きっかけの研究との関係

[原研究v4](https://arxiv.org/html/2606.23130v4)は、公開アプリにおける明示されないsecurity条件や利用者任せの運用義務を失敗原因として分析している。これは今回の問いを調べる動機であり、Alderの入口案を採用する直接証拠ではない。調査対象・検出方法・モデルに一般化上の限界があり、どの介入も脆弱性を完全にはなくしていない。native/local用途への効果をこの研究から断定しない。ITmediaの指定URLは取得できなかったため記事本文を根拠にしていない。

## 次の判断と振り返り

採用候補は「要求の存在・所在・未決を引き継ぐ明文化」であり、security approval gateでも安全性保証でもない。レビュー側がこの限定変更の必要性と運用負担を評価する。mainへのmerge、release、installed plugin更新は別承認。

比較で現行版の既存能力を確認し、新しい検出改善を主張しなかった。公開固定入力を先に保存し、合成例だけで検証した。人間の不明回答を解決扱いにする失敗、一般checklistの押込み、無関係作業の全面停止を回帰条件にした。新しい恒久実験機構や追加台帳は不要。採用・配布・実効果を混同せず返却する。
