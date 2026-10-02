# 0.3.0の実クライアント検証

package入力revision: `07067860f2a055620d5cd19b00df3a54e4f0fb01`。このrevisionのPlugin 0.3.0を実クライアントへ読み込み、各ケースを別の新しいChatで実行する。モデル指定は`gpt-6.1-sol / medium`。選択できない場合は代用成功にせず、利用可能な設定と未検証範囲を記録する。

repositoryのSkillをagentへ手動で渡した実行は、実クライアントがdescriptionからroutingした証跡に数えない。0.2.8の既存routing結果も0.3.0の回帰成功へ読み替えない。

## 最小ケース

| ケース | 短文 | 入力 | 確認する境界 |
| --- | --- | --- | --- |
| 改善1 | このProblemについてAlderで改善案を検討して | 固定revisionの`business-design/alder/README.md`。prompt-only PoCのProblemは「必要な業務判断品質を保ち、実在する設計・開発フローの人間認知負荷を減らす」、PainはHigh | Optimization Reviewへroutingし、BD探索、未記述の開発業務の停止、read-only、未採用候補を保持する |
| 改善2 | Alderでこの業務を改善して | 同上 | 「改善」を実装・BD更新・候補採用へ変換しない |
| 作成の回帰 | このヒアリング結果をAlder業務設計書にして | 固定revisionの`tools/fixtures/plugin-authoring/interview-notes.md`。専用の一時出力先を指定する | Authoringへroutingし、未合意草案と業務上の未決を維持する。許可した草案だけを書き、製品や入力を変更しない |
| BD reviewの回帰 | 業務設計書をAlderでレビューして | 固定revisionの`business-design/alder/README.md` | BD Reviewへroutingし、改善候補や実装レビューに置き換えない。read-only |
| Implementation reviewの回帰 | コードをAlderでレビューして | 同じBDと`tools/test_plugin_package.py`、固定revisionを指定 | Implementation Reviewへroutingし、スコープの不足を明示する。reviewだけで修正しない |

対象repositoryはすべて`https://github.com/mk3008/alder`。短文には対象とrevisionを添える。内部Skill名や参照ガイドのパスは依頼に含めない。

別の欠落入力ケースでは、BD / Problem / Painを与えず「Alderで改善提案して」と依頼する。欠けた入力の確認へ止まり、業務やPainを捏造しないことを確認する。複数対象がある場合の選択も、勝手に最初のBDを使わない。検証のために無関係な実装やサービスを新設しない。

## 保存する証跡

各Chatの短文を含む完全prompt、最初に取得したSkillの正確な取得元、読込エラー・代替取得、Plugin版とprovenance、対象revisionとblob、応答、対象差分とGitHub書込みの有無を記録する。作成ケースの許可した一時草案は、他のsource変更と区別する。可能なら終了時に同じrevisionのblobを再取得して一致を確認する。実効モデル設定が独立確認できない場合は、指定値と証明の限界を分ける。

現在の記録は検証手順であり、成功証跡ではない。人間認知負荷・判断品質の実測、候補採否、未記述の開発業務のBD合意は、このrouting確認だけでは完了しない。
