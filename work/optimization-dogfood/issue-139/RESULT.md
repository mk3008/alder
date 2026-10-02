# Alder運用へのOptimization Review適用

2026-10-03。Execution: [#139](https://github.com/mk3008/alder/issues/139)。候補は未採用で、業務設計書は変更していない。

## 対象と現状の境界

入力は公開main `52ddd2b984d7ddfc1e1c7ee08d7d1394711c3198` のAlder利用業務のBusiness Design、READMEのStandard workflow、adoption、現行Optimization Review。Problemは「必要な業務判断の品質を保ち、Alderの実在する設計・開発運用の人間認知負荷を減らす」というprompt-only PoC入力とした。ユーザーは開始後にPainをHighと回答した。Problem / Painを合意済みBusiness Designへ書き込んだ通常運用とは区別する。

`business-design/alder/README.md` は利用業務から検査項目の合意・実装引き渡しまでのモデルである。Alder自体の研究・保守・リリース、実装後レビューは明示的に対象外。README / adoptionには実装・独立レビュー・follow-upがあるが、それらの完全なBusiness Designがあるとは扱わない。ソフトウェアやライブラリ開発がAlder適用外という意味ではない。対象業務を十分に記述する必要がある。

記述済みの責務は事実として読めるが、各地点の頻度、時間、読解量、実際の重複作業は未測定。ユーザーのProblemを、全touchpointに負荷が観測されたという意味へ拡張しない。

## Phase 1 — 現行ガイドを変更せず適用

Fresh agentは既存ガイドを読み、次のHuman touchpointを抽出した。詳細な入力・目的・判断・次行動は[raw](runs/phase1.raw.md)に保持する。

| 現行業務の根拠 | 人間に残る判断 | AIへ委譲できる準備・整合 | 不要化の境界 |
| --- | --- | --- | --- |
| 業務設計 Procedure 1–3 | 元情報の忠実性、相関、条件の意味 | 草案、相関・手順レビューの支援 | 意味の異なるレビュー自体は削らない |
| 業務設計 Procedure 4–6 | 未決業務条件、責任・保証の合意 | 明示された判断の記録・反映準備 | 既決事項の再判断は、新しい意味差分がなければ増やさない |
| 業務改善レビュー Procedure 1–3 | Problem / Painの確認、候補採否 | 候補と根拠の比較 | 候補が0件でも成立。採用を義務化しない |
| 検査項目の設計 Procedure 1–5 | 期待結果、レビュー状態、未決の意味 | 項目の草案・更新、IDと追跡の整合 | 書式・機械的対応を新しい業務承認にしない |
| 隣接するシステム設計 | 既存制約、重大な選択、変更リスク | 技術条件の整理 | 可逆的な内部構成の選択を人間へ毎回返さない |
| 実装 Exception | 未決の業務上の意味 | 合意済み範囲の実装と非破壊的検証 | BDから一意の修正を方針の再承認へ戻さない |
| README / adoptionの実装後レビュー・follow-up | 本当に未決の意味、受入 | 不一致の検証・修正、Check–Test根拠の整備 | 全技術提案を人間の新規判断にしない |
| 任意の同期漏れ検査 | 照合結果の意味、未解消関係 | 確定的な不一致の検出 | 疑いがない全業務に必須診断を増やさない |

Fresh出力は候補を2件返した。候補1は既存のレビュー交換で差分・根拠・未決事項を入口にする提示案、候補2は明示済み判断の転記と引き渡し準備の委譲案。どちらも未承認、期待効果は仮説である。前者は提示変更の差分を比較できるが、後者には既にAIへ委譲されたCheck更新等が混在し、どこが新しい責務変更かが不十分だった。人間の負荷低減を示した結果とは扱わない。

初回はPain未指定で開始したため、比例性の判断やHigh条件のControlとしては使わない。後続の入力変更を隠してControl/Treatmentの優位を主張しない。

## Phase 2 — 手法側のfailure mode

| 検査対象 | 今回の判定 |
| --- | --- |
| 全体を見ず直前成果物へ固定 | 初回Freshは全体touchpointを読んだ。失敗の再現はなし。ただし元ガイドの「関連部分から」には、関連性を決める前の全体定位が明示されていない |
| 架空Activityの生成 | 初回は研究・保守・リリースを捏造せず、モデルの対象外を明示した |
| 研究artifactの改善を業務改善と誤認 | 初回Freshへ先行pilotを渡さず、結果の誘導を避けた。PR #137は別途下記のように再評価した |
| 既存AI委譲を新規候補に数える | 候補2に既存手順との重複と差分不足を観測。完全な重複と断定せず、候補として残すには差分説明が必要と判定 |
| 不要なHuman taskの追加 | 初回の問いには、準備ツールの正確性などAIが検証できる内容が混在。人間の採否・現実確認と技術検証を分ける必要がある |

変更先は正式authority `docs/optimization-review.md`。関連する全体フローの定位、実在Activityへの根拠、現行責務との差分、研究用artifactの扱い、人間の意味判断と一意な修正・技術検証の区別を追加した。既存のProblem限定、最大3件・0件、意味保持、read-only、人間採否、境界分解の停止条件は維持する。別のOptimization仕様は作らない。

修正ガイドは公開commit `3be41c2ee122ccdb0870bf9f39463f80db34a42a` に固定し、公開APIで取得できることを確認した。Highで別Freshを実行した。旧出力・PR #137・研究記録は読ませない。初回とのPain差、詳細prompt差があるため、これは最小の挙動確認であり因果比較ではない。

### 最小回帰の結果

別Freshは候補1件を返した。業務設計と検査項目の既存レビュー交換を、同じ業務原文から追える形に調整する案である。既存のAI草案・更新・可逆的技術選択は新規候補へ数えず、Activityと責務変更を示した。現行モデルが含まない開発工程は、実際の担当・入出力・判断・差し戻しの現状確認へ返した。Business DesignやGitHubの書込み、候補採用、追加の承認工程はない。

この単回出力は、上記の停止・根拠づけが使われたことを確認する範囲で合格。一般的な再発防止、優位性、人間負荷低減を証明しない。Phase 3のSkillはこのread-only境界をpackageする。未記述の開発業務へ適用した成功とは扱わない。

## PR #137の再評価

先行pilotの対象は、Standard workflowの実装後レビュー結果を受けた意味確認・受入の提示に対応する。`staged.md` は研究用の提示代理であり、現運用で人間が保守する中間成果物ではない。

初期表示量削減とAIが原典へ辿れたことは、その限定条件での証跡として残せる。総読解量は増え、人間負荷は未測定。全体フローの不要化・委譲を検討する前に、このartifactやViewerを恒久化する根拠にはしない。

最終扱いの提案は **supersede**。#137のcommitと検証記録は保持し、本研究から参照する。#137単独の採用・mergeや、利用者への再読解テストを追加の必須Human taskにはしない。PRの実際のcloseは管理操作として別途記録する。

## 証跡・限界

Phase 3では開発版Plugin 0.3.0に、正式Optimization Reviewをそのままbundleする独立Skillを追加した。短い改善依頼をdescriptionへ入れ、BD探索、Problem / Pain不足時の確認、read-only、未承認候補、対象外フローの停止を保持した。既存3 Skillの手順は版表記以外を変更しない。listingの既存3 defaultPromptは上限を守って維持する。新Skillは内部文書の選択を利用者へ要求しない。

package検査は7/7成功。新authorityのbyte一致とdigest、4 Skillの同梱、既存bundleの一致を検査した。CIの監視対象にOptimization Reviewのsourceを加えた。static検査は自然言語routingや実際のread-only動作の証明ではない。現在の会話にロードされたPluginは0.2.8の3 Skillであり、0.3.0の実クライアント検証をしたとは報告しない。release・main merge・利用者Plugin更新はしていない。

### 残る受入条件

- 実際の開発運用で負荷が発生するpost-handoff交換の現在業務を確認する。誰が、何を受け、どの判断・修正をし、どこへ返すか。現行利用モデルの外を捏造しない。
- 0.3.0を読み込んだ新しい実クライアントChatで、少なくとも「このProblemについてAlderで改善案を検討して」「Alderでこの業務を改善して」を試し、BD探索・read-only・候補未採用を確認する。
- 別の新しいChatで、Authoring、BD review、Implementation reviewの既存短文回帰と誤routing、Problem / Pain / BD不足の停止を確認する。requestedモデルは6.1-sol、medium。取得元・Plugin版・provenance・入力revision・prompt・結果・対象差分・GitHub書込みの有無を記録する。
- 候補の採否は人間に残し、技術検証や既決修正を新しい承認工程へ増やさない。人間負荷をAI内容保持や文字数だけで代用しない。

未達なのでExecutionと全体TaskはOpenを維持する。今回の振り返り: Pain確認をFresh開始前に済ませるべきだった。初回をHighのControlに見せず、条件差をmanifestへ記録した。全体定位の既存ルールをOptimization authorityへ置き、重複したroot規則は追加しない。

[manifest](manifest.json)にrequestedモデル、effort、fork、入力revision、各入力blobとSHA-256、完全prompt、rawを記録する。指定はすべて`gpt-6.1-sol / medium / fork_turns:none`で、AGENTS既定からのユーザー指定例外。初回rawにある`gpt-6-sol`はagentが読んだ既定値であり、実際のspawn要求と区別して訂正をmanifestに残した。実効設定と完全なツール通信ログの独立監査はない。

入力は公開資料だけで、出力は公開前に確認する。rawは評価を再点検する材料であり、実測の労働時間、人間の認知負荷、一般的な探索優位を表さない。完全な開発運用のBusiness Design、業務上の意味の承認、実クライアントの新Plugin routing確認は別の未達条件として残す。
