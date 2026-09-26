# Issue #106 事前登録（実行前固定）

基点: PR #100 head `02b0b0f7b79bbc9f4850572ac55def577056a38b` と同内容の local tree `dd293e489268b794542932547b7626377eba2463`。Plugin 0.2.6、同梱 authoring reference の pinned revision は provenance を参照。Issue #106 の A〜F を同一の最小限の共通業務に置いた。発言時刻≠施行時刻を全ケースに明示し、C のみ変更対象の予約範囲も明示する。これにより余計な時間解釈の曖昧さを抑える。結果は一般性能の推定に使わない。

- 6 ケース × 2 arm = 12 独立 Fresh context。baseline は現行 Authoring Skill のみ、treatment は同じ Skill に `guidance.md` を足す。各一回、成功するまでやり直さない。requested model `gpt-6-sol`、effort `medium`、`fork_turns: none`。実効設定と共有 filesystem の隔離は独立に証明できない。
- Agent には自身の `notes.md`、その run の `AGENTS.md` と repo の Authoring Skill / 同梱 references だけを読ませる。Issue 本文、protocol、他 arm・他ケースの notes / outputs、過去 raw、期待判定は読ませない。treatment のみ固定 `guidance.md` を読む。
- 依頼文は「このヒアリング結果をAlder業務設計書にして」。対象 run 内の `docs/business-design/meeting-room.md` と `response.md`、`read-log.md` を保存する。書き込み前に読めないときは報告。agent の自然な質問を実際の response に含める。会話で回答は供給しない。比較時は質問の有無と数を記録する。
- 評価は raw の確定後、入力と両 arm の出力を別 Fresh evaluator が比較し、誤 latest-wins、根拠保持、条件精緻化、適用時間、人間判断、ノイズを A〜F ごとに確認する。初回評価原文を保存。誤判定やノイズも削らず、再実行で隠さない。
- 期待: A は明示訂正、B は条件付き精緻化、C は変更・適用境界、D/E は未解決・人間質問、F は意味に関わらない言い換え・感想の無用 conflict を避ける。A の旧発言を現在方針として残し続けず訂正の根拠は示す。D/E はどちらを採るか推測しない。違いの定義は Issue #106 に準拠。
- 恒久 Skill は実験中に変更しない。全結果を見て最小差分を提案するか、追加検証 / 不採用を選ぶ。Benchmark のための結果からデータ形式を固定しない。
