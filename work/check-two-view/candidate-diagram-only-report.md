# 図のみ表示の回帰ケース：著者確認

## 受領した全プロンプト

> 任意表示の回帰ケースを1件追加。candidate-update-diagram.mdを、状態表を省略し状態遷移図と既存Checkリンクだけで接続を確認する表示に更新してください。保存はcandidate-diagram-only.md、元は保持。未決事項・全Check本文・状態・根拠・Object/Activityリンクを保持し、表を省略したことで新ルールを追加しないでください。著者確認をcandidate-diagram-only-report.mdへ、full prompt/hashes込みで記録。これは表の一律強制がないことの確認用で、正式な主見本の置き換えではありません。

## 入力と版

- 入力 `/workspace/scratch/dab003a8ea37/candidate-update-diagram.md` SHA-256: `c24958236c52bd03bdda3fbba2a53974b6f75df2d197856e23ddb686c645d57b`。
- 照合した業務設計 `/workspace/scratch/dab003a8ea37/alder/business-design/purchase-request/README.md` SHA-256: `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`。
- 指定 Alder bundle revision: `d465c6c0c87740712bba8361b2f24ddde6ad314c`。`alder/plugins/alder/skills/alder-draft-check-items/SKILL.md` SHA-256: `2f29d5df6c5f30f872867296a8df58950b9a91d62c75d152932f489bc7a2a744`。同梱 `references/check-item-traceability.md` SHA-256: `fd24530c6d0183e5adf06d08be2afaa34b3737e8d5335711e589c8634e7cf867`。
- 出力 `/workspace/scratch/dab003a8ea37/candidate-diagram-only.md` SHA-256: `c230ad64fa8a630bda910ef5760df0c8a30137a9955c3f98e83486adddd072ea`。元ファイルは変更していない。

## 差分と確認

- Object 購入申請の現在状態×後続 Activity 表、および表記号の説明を外し、Mermaid 図と JA-EX-01/02/03/05 の条件・結果へのリンク案内を保持した。`rejected` の購買対象からの除外は既存の Object 説明と JA-EX-04 へのリンクに残る。図にない組み合わせの結果は決めていない。
- 差分を行単位で検査し、変更箇所は Object 節の表・凡例を置き換えた箇所だけ。図の4辺は元のままで、業務相関1〜4と各 Check の条件・結果に対応する。新状態・遷移・禁止を加えていない。
- 全6 Check の本文（ID、条件、期待結果、人間レビュー状態、根拠、補足とテスト証拠）は元と完全一致。JA-EX-Q01 の未決事項と要確認状態も一致。Object 節から4 Activity と全6 Check へのリンク、Activity 節から Object 節へのリンク、ローカルアンカーの存在を確認した。
- これは表を置かない任意の表示ケースであり、主見本の採用判断ではない。GitHub の実レンダリングと別読者レビューは未実施。人間の業務合意は行っていない。
