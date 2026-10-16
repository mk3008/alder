# Mermaid 図追加の作業記録

## 受領した全プロンプト

> 追加の表示更新を実行してください。candidate-update.mdを入力として、購入申請のObject節に、同じBDが定義する接続を簡単なMermaid状態遷移図で表示してください。既存状態表と全Check本文・ID・状態・根拠・未決は保ち、業務意味を増やさないでください。保存先candidate-update-diagram.md（scratch親）、レポートcandidate-diagram-report.md。旧出力は保持。図が表と条件・結果について整合することを著者確認してください。正解見本、他の生成結果・レビュー結果は読まないでください。Full prompt/input hashesを記録。別の読者がレビューします。

## 入力と確認

- SHA-256: `/workspace/scratch/dab003a8ea37/candidate-update.md` = `6525d2df53894b5b089f06dc96dd03f6859904116d93bda90d48b8b2f33da3a1`。
- SHA-256: `/workspace/scratch/dab003a8ea37/alder/business-design/purchase-request/README.md` = `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`。
- 適用した Skill: Alder Check drafting、指定 bundle revision `d465c6c0c87740712bba8361b2f24ddde6ad314c`。`SKILL.md` SHA-256 = `2f29d5df6c5f30f872867296a8df58950b9a91d62c75d152932f489bc7a2a744`。Object 表示の参照 `references/check-item-traceability.md` SHA-256 = `fd24530c6d0183e5adf06d08be2afaa34b3737e8d5335711e589c8634e7cf867`。
- 出力 `/workspace/scratch/dab003a8ea37/candidate-update-diagram.md` SHA-256 = `c24958236c52bd03bdda3fbba2a53974b6f75df2d197856e23ddb686c645d57b`。
- Object 節に説明と `stateDiagram-v2` を挿入した以外、旧出力とは行単位で一致することを差分で確認。状態表、6つの Check 本文・ID・レビュー状態・根拠、JA-EX-Q01 の未決事項は一致したまま。
- 図の4辺は、業務設計の業務相関1〜4、JA-EX-01/02/03/05 の成立条件・結果、および状態表の定義済みセルと照合した。`rejected` の購買除外は表と JA-EX-04 に残し、図に禁止遷移を作っていない。承認経路の未決定は説明・表・JA-EX-Q01 に残した。開始点は新規申請の成立を表し、追加状態を意味しない。図は後続業務の自動実行を意味しない。
- Mermaid のコードブロック構造と4辺のテキストは検査した。GitHub 上の実レンダリングは未確認。人間の業務合意・別読者レビューは行っていない。
