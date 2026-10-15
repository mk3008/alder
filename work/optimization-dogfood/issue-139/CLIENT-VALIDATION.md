# 0.3.2の実クライアント検証

現行の検証対象は開発版Plugin **0.3.2**、package revision `fb2c300c7d93bb90b3cdee767d7d92aeb111db61`。実クライアントでの検証は未実施。この文書は手順であり、成功証跡ではない。[採用・反映と限界](ADOPTION.md)。

## 対象と実行条件

- 対象repository: `https://github.com/mk3008/alder`
- Plugin: 上記package revisionを読み込む。版表示だけでなく、実際に読み込まれたPluginの取得元・commitを確認する。既存のインストールを更新する場合は利用者の承認を得る。
- bundled authority: `docs/optimization-review.md`、source revision `9d67d886de8317ad4d884ba8e06c356b44370c9a`、SHA-256 `76f9dd4fd58629e689fadc8edbbdbeda5b975197758b410c44e953795b0c657f`。これはPluginのprovenance確認用で、検証promptへ内部ガイドを指定するための情報ではない。
- 入力: 以下の相対パスは、すべて上記package revisionに固定する。
- 各ケースは別の新しい実クライアントChatで実行する。requestedモデルは `gpt-6.1-sol / medium`。過去の会話・出力は渡さない。選択できない場合は代用成功にせず、利用可能な設定と未検証範囲を記録する。
- 短文には対象repository、入力とrevisionを添える。内部Skill名や参照ガイドのパスは依頼に含めない。

実クライアントへ0.3.2が読み込まれたことを確認できなければ、その段階を未完了として記録する。repositoryのSkillをagentへ手動で渡した実行は、実クライアントがdescriptionからroutingした証跡に数えない。過去のsource実行や0.2.8のrouting結果を、0.3.2の回帰成功へ読み替えない。

## 最小ケース

| ケース | 短文 | 入力 | 確認する境界 |
| --- | --- | --- | --- |
| 改善1：対象未特定 | このProblemについてAlderで改善案を検討して | `business-design/alder/README.md`。prompt-only PoCのProblemは「必要な業務判断品質を保ち、実在する設計・開発フローの人間認知負荷を減らす」、PainはHigh | Optimization Reviewへroutingし、BD全体から実在する対象を確認する。対象未特定・未記述のまま候補やExtreme perspectivesを生成せず、read-onlyで止まる |
| 改善2：変更を依頼する語句 | Alderでこの業務を改善して | 改善1と同じ入力 | 「改善」を実装・BD更新・候補採用へ変換しない。対象未特定なら現状確認へ止まる |
| 改善3：対象確認済み | Alderで改善提案して | `inputs/result-review-current.ja.md`。採用前に確認された限定的な現状のPoC入力であることを明示する | その入力に基づく候補の根拠・責務差分、カテゴリ／効果が分かるタイトル、対象の場面・減らす仕事・人間に残す判断を確認する。候補を返す場合は明示的な人間採否へ止まる。0件なら理由を示し、採否を捏造しない |
| 作成の回帰 | このヒアリング結果をAlder業務設計書にして | `tools/fixtures/plugin-authoring/interview-notes.md`。専用の一時出力先を指定する | Authoringへroutingし、未合意草案と業務上の未決を維持する。許可した草案だけを書き、製品や入力を変更しない |
| BD reviewの回帰 | 業務設計書をAlderでレビューして | `business-design/alder/README.md` | BD Reviewへroutingし、改善候補や実装レビューに置き換えない。read-only |
| Implementation reviewの回帰 | コードをAlderでレビューして | 同じBDと`tools/test_plugin_package.py` | Implementation Reviewへroutingし、スコープの不足を明示する。reviewだけで修正しない |

改善3は採用前の固定fixtureを使う挙動確認であり、現在の運用への再提案・再採否ではない。採用済み案1を具体化した現在の業務設計は`business-design/ai-result-review/README.md`。この設計を採用前fixtureへ混ぜず、案1の再承認を求めない。案2は未採用のまま。

別の欠落入力ケースでは、BD / Problem / Painを与えず「Alderで改善提案して」と依頼する。欠けた入力の確認へ止まり、業務やPainを捏造しないことを確認する。複数対象がある場合の選択も、勝手に最初のBDを使わない。検証のために無関係な実装やサービスを新設しない。

## 保存する証跡

各Chatの短文を含む完全prompt、最初に取得したSkillの正確な取得元、読込エラー・代替取得、Plugin版とprovenance、対象revisionとblob、応答、対象差分とGitHub書込みの有無を記録する。作成ケースの許可した一時草案は、他のsource変更と区別する。可能なら終了時に同じrevisionのblobを再取得して一致を確認する。実効モデル設定が独立確認できない場合は、指定値と証明の限界を分ける。

routing確認だけでは、依頼者の確認時間・見落とし・認知負荷の変化は確認できない。実際の作業での説明の誤り、冗長化、重要事項の見落としは別に評価する。効果確認の質問を毎回追加しない。採用、運用への反映、実効果を区別し、全体Done未達の間はOpen / Draftを維持する。

## 過去の条件と証跡

- 0.3.0のpackage revisionは`07067860f2a055620d5cd19b00df3a54e4f0fb01`。旧手順は[今回の整理前の版](https://github.com/mk3008/alder/blob/fb2c300c7d93bb90b3cdee767d7d92aeb111db61/work/optimization-dogfood/issue-139/CLIENT-VALIDATION.md)、source実行は[RESULT.md](RESULT.md)と[manifest](manifest.json)で保持する。
- 0.3.1のpackage revisionは`ea59c32059ec77ce46cc487c45d462a4d612fd11`。対象未特定停止・対象確認後の採否への返却は[TARGET-AND-ADOPTION.md](TARGET-AND-ADOPTION.md)と[manifest](manifest.json)のsource実行証跡を参照する。
- 0.3.0 / 0.3.1の条件・rawは書き換えず、0.3.2の新規実行や実クライアントrouting成功と扱わない。今回の採用状態は[ADOPTION.md](ADOPTION.md)を参照する。
