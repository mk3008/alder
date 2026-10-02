# 判断事項から確認する

**受入を保留する。** 上限20人に変更済みのBDに対し、Check・Test・実装は上限10人のままで、11〜20人を拒否する。

- **必要な対応:** 実装担当はCHECK-01 / test_limit / acceptsを新BDへ揃える。責任者は修正した期待結果を確認する。20人方針の再承認は不要。
- **根拠:** [BD-01](fixture/business-design.md#bd-01) → [CHECK-01](fixture/checks.md#check-01) → [test_limit](fixture/test_product.py)。[理由と実装診断](details.md#上限の不一致)。
- **確認境界:** 3 tests成功は旧期待との一致。Checkの人間確認は未完了。キャンセル・本人変更の関数契約は整合し、永続化・同時実行・本番認証は未検証。[全3項目と検証範囲](details.md)。

研究fixtureでの変更判断を仮定しており、実ユーザーの承認ではない。要約を承認根拠にせず、必要な原典を確認する。
