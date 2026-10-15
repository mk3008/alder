# C2 change-cost probe — post-hoc exploratory supplement

Primary revision: 9098b43276f40e3c8adf62e6c8cb6194c4a528f3。baselineはC2/r1/s2のAlder P058、RDRA P002。各arm1回のみ。反復・平均・統計比較なし。生成済み資料をコピーし、利用停止時の既存予約維持を取消・利用不可へ変更する。他の条件・未決は不変。Primary raw/score/freezeは変更しない。

要求設定はgpt-6-sol / medium / fork_turns:none。同一共有FSで手順上のread guardを置き、security isolationと実効modelの独立attestationはない。

Alderはpin済み0.2.8 Authoring Skillの既存設計修正。RDRAAgent 0.8 ZIPは記録済みSHA256 528b17deb76ac70050620b82118a6140f070f9e7b6282fc8b26d2a43420e074bと再取得一致。公式のrdra-impact-analysis Skillは存在するが、専用incremental editorは確認できない。メニューは全削除再生成・未生成node生成で、既存fileの要件変更を自動検出する更新手順ではない。

最新コメントはゼロからの再生成を禁じるため、今回は公式影響分析＋既存TSVの直接編集＋必要な公式派生scriptという探索経路を選ぶ。これは公式のincremental更新性能の測定ではない。専用更新経路不在の限界を残し、公式再生成が必須と断定しない。通常RDRA利用全体へ一般化しない。手法間で更新の制御が完全対称ではない点も限界。

観測は更新対象・実変更・整合確認の成果物path数、AI実行数、補助script数、開始/終了UTC、旧要件drift、新しい変更意味の最終handoff保持、全artifact bytes/file数、差分added/deleted linesとbytes。input source変更とevidence/metadataは業務artifact数から分離。driftは機械候補の原文確認で確定し、単語だけの判定をしない。

handoff評価はcoordinatorによる原文確認。追加の独立probe callは使わず、下流への意味伝達可能性を文面から評価する。実装動作・人間レビュー時間・実課金・token・creditは測らない。条件が揃わない場合は二択へ強制せず判定不能とする。

全promptはarm別envelope.txt。baselineのbeforeコピー・input manifestを保存。公式配布物本文は再配布しない。意味修正にprogram生成は不可。やり直しは出力不成立のtransport failureだけ、証跡を保持。
