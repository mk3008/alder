# 候補更新の作業記録

## 受領した全プロンプト

> Use the Alder Check drafting Skill at /workspace/scratch/dab003a8ea37/alder/plugins/alder/skills/alder-draft-check-items/SKILL.md and its installed references to update /workspace/scratch/dab003a8ea37/alder/docs/examples/purchase-check-review.ja.md from /workspace/scratch/dab003a8ea37/alder/business-design/purchase-request/README.md. Skill/bundle revision d465c6c0c87740712bba8361b2f24ddde6ad314c; BD unagreed example. Japanese output. This is a presentation-only update: preserve existing Check IDs, conditions/results, review states, all supporting text, source links and evidence; do not add new Checks. Display Activity and Object viewpoints in one GitHub Markdown document so a reader can inspect individual business outcomes and handoff of the same purchase request between Activities. Do not change business meaning or infer missing rules. Write only /workspace/scratch/dab003a8ea37/candidate-update.md and concise /workspace/scratch/dab003a8ea37/candidate-update-report.md. Do not inspect root specimens, work/ directories, baseline or other agent outputs. Record full prompt and input hashes in report. No human approval, merge or release. Do your source-grounded author checks; separate reader review will be run by coordinator.

## 入力と版

- 指定 revision / checkout HEAD: `d465c6c0c87740712bba8361b2f24ddde6ad314c`。Alder Plugin `0.4.8`。バンドルの provenance に記載された原典 revision: `620a728ab04dbca1528527121d1d8db320db5ad2`。
- SHA-256（各パスは `/workspace/scratch/dab003a8ea37/` からの相対パス）:
  - `alder/docs/examples/purchase-check-review.ja.md`: `d2ad07f06cdef93537f6b8b5cca32a5f0f9ebad49ea4ba3f3ffcb1b407cfff55`
  - `alder/business-design/purchase-request/README.md`: `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`
  - `alder/plugins/alder/skills/alder-draft-check-items/SKILL.md`: `2f29d5df6c5f30f872867296a8df58950b9a91d62c75d152932f489bc7a2a744`
  - `alder/plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md`: `fd24530c6d0183e5adf06d08be2afaa34b3737e8d5335711e589c8634e7cf867`
  - `alder/plugins/alder/skills/alder-draft-check-items/references/adoption.md`: `c2d6c77d5ec28c5a20411a234c67bea8f43336c465c2507470b515160546d542`
  - `alder/plugins/alder/skills/alder-draft-check-items/references/provenance.json`: `1e6d027a258729ff542f6b304e0bd0c71a4c25c4a62bdbf4ba946fbe0bedf7c4`
  - `alder/plugins/alder/plugin.json`: `8831bdea6a9fb06aef307f4859f71c1f3699eda32bde3d55a15c936743b1a1e6`
  - `alder/AGENTS.md`: `29b2c0fe7b5da19414f3a274eb8f4780fd2b4b2e89627a8a1bd8e66a3611bf7f`
- インストール済み参考文書の2ファイルは作業ツリーで変更状態（`MM`）だったため、実際に読んだ内容は上の SHA-256 で特定する。入力の既存 Check と業務設計は変更しなかった。

## 更新と著者確認

- 4つの Activity 節から Object 購入申請へリンクし、同じ購入申請の成立・承認・却下・購入の接続を1つの Object 節と状態別の表に示した。各定義済みセルは元の Activity と Check ID にリンクする。`rejected` からの購入は業務相関5および JA-EX-04 による明示的除外のみ `×` とした。その他の未定義の組み合わせは設計レビュー上の「未定義エラー」と明記し、実行時の例外や禁止とはしていない。
- 元の各 Check 本文は行単位で完全一致。JA-EX-01〜05 と JA-EX-Q01 の6 ID、条件、期待結果、人間レビュー状態（未レビュー5、要確認1）、質問・選択肢、根拠、導出分類、AI確度、関連業務、テスト証拠、既存 URL を保持した。新しい Check、判断、レビュー状態、テスト対応は追加していない。
- 4列 Activity 一覧と4つの同階層 Activity 節、各 H3 Check、共有 JA-EX-04 の単一本文と Activity 側の参照、閉じた6件の詳細、全ローカルアンカーの存在を確認した。Object の識別は業務設計20〜21行、状態は116行、表の定義と除外は業務相関27〜31行および Activity の When/Input/Result と照合した。俳優 Object に状態を加えていない。
- 既存の版付き GitHub URL は維持し、新しい参照の行番号は指定ローカル業務設計で照合した。リンク先のリモート revision の実表示と GitHub レンダリングは未確認。業務設計の金額別承認経路は未決定のままで、人間による合意や実装引き渡しを主張しない。NG と断定できる残件はこの範囲で見つからなかった。
- 候補 SHA-256: `6525d2df53894b5b089f06dc96dd03f6859904116d93bda90d48b8b2f33da3a1`。
