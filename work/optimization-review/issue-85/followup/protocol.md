# PR #87 追加比較 — 出力を見る前の条件

対象 Alder revision: `d0a5f28fc1bd12472bb001cfc750b91377610f06`。ガイド `docs/optimization-review.md` SHA-256 `1b5951fb2505d98b440ffb022da860dcec61cc2dffab685d9ce6cbab57037096`。どちらも Business Design 本文に Problem や実測値を追記しない。

| Benchmark | Business Design SHA-256 | Experiment-only Problem | Pain |
| --- | --- | --- | --- |
| facilities-maintenance | `1c64a1f71d5f2184077fba74ddfebfa6a4ef78333a0e66163909bd785f1c90bc` | 故障報告を受けた保守依頼が増えると、保守調整担当者が `open` の依頼ごとに予定日時を決める作業の負荷が高い。 | High |
| meeting-room | `31fe2371c81f5ecf560ad5312194865ef8c8ec00b9c33bc2d5b1b199d4b166c9` | 利用者が会議室の空きを確認して予約しても、会議予定の変更や取消が増えると、利用者が予約を変更・取り消して空きを確保し直す作業の負荷が高い。 | High |

両 Problem は今回の比較用追加条件であり、現行設計に記載された実態ではない。件数・所要時間・故障頻度・会議室の混雑・変更頻度・設備の性質は与えない。現行ガイドの通常プロンプトを Control、複数方向の極端な状態を置き現実の制約へ縮退・必要なら合成する探索を Treatment とする。各対象につき両群1回、`gpt-6-sol` / `medium` / `fork_turns: none`、同一設計書とガイドのみを参照。生成者には他 Run、既存評価結果、互いの指示、Issue/PRコメントを見せない。Control と Treatment は独立した Fresh agent とする。

事前の評価基準: Problem に対する因果、提案が Business Design 既定の手順の言い換えか、現行 Activity の有無・開始契機・処理時点・単位・責任・隣接境界の意味差、Control との差、Business 意味の変更を人間判断に戻しているか、未確認事実の捏造、Scope / Difficulty / affected parties、次の確認事項・調査価値。Treatment 固有の frame-breaking な案は、Activity の削除・不要化、時点や単位の根本変更、前段で Problem 自体を消す、業務境界の再構成などが実質的に異なる場合のみ数える。単純な同一 Activity の自動化、束ね、委譲、技術やラベルだけの差は数えない。Control にも同種の前提を覆す案があれば Treatment 固有としない。意味が壊れる案でも、人間が何を変更するか明示した調査仮説なら記録するが採用可能な案とは区別する。

各比較を独立して読んだ後、購入申請を含む3業務を総合評価する。追加 Run は生成揺らぎだけで総合判定が変わりそうな場合に限る。学術的反復・実データでの実効性証明は目的としない。追加実行しない場合はその理由と未実施事項を保存する。採用時は現行ガイドへ軽い探索ヒューリスティックを加え、アルゴリズムや候補数を固定しない。
