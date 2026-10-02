# 通常提示: ファイルと検査結果から確認する

研究用予約fixtureをレビューする。業務判断として参加者上限20人が確定したと仮定したケースであり、実ユーザーによる承認ではない。キャンセルと変更権限は変更なし。Checkの人間レビュー状態と新BDへの照合は未完了。

## 設計差分

[現在のBusiness Design](fixture/business-design.md) のBD-01は1〜20人を受け付け、21人を拒否する。旧版は1〜10人、11人拒否。[確定条件](fixture/decision.md)に変更判断と対象境界がある。BD-02はキャンセル時に使用中の部屋を空室にする。BD-03は予約者本人だけが変更できる。

## Checkファイル

[checks.md](fixture/checks.md)のCHECK-01は10人受入・11人拒否の旧期待。CHECK-02は使用中の部屋をキャンセルすると空室になる期待。CHECK-03は他人による変更を拒否する期待。traceのBD-01→CHECK-01、BD-02→CHECK-02、BD-03→CHECK-03は診断対象の関係であって意味の正しさや承認を証明しない。

## テストファイルと実行

[test_product.py](fixture/test_product.py)で3 testsが成功する。

- test_limit: accepts(1)とaccepts(10)がTrue、accepts(0)とaccepts(11)がFalse。
- test_cancel: cancel(True)がFalse。戻り値は操作後のoccupied状態で、Falseは空室。成功可否ではない。
- test_owner: 同じowner/requesterでTrue、異なるowner/requesterでFalse。

[実装](fixture/product.py)はacceptsの上限10、cancelはFalseを返す、can_changeはownerとrequesterの等値を返す。旧Testと実装は一致するが、test_limitは新しい上限20を検証していない。実行成功を新BDとの一致や業務承認と扱えない。取消後の永続化・同時実行・本番認証はこの関数fixtureの範囲外で未検証。

## 保存された対応

[trace.json](fixture/trace.json)にはCheckとBD、TestとCheckのfingerprintがある。BD-01のpinは旧文面で、CHECK-01側の再照合が必要。Test pinが一致してもassertionの意味がBDを満たすとは限らない。Codeへの恒久mappingは作らない。上記実装参照は今回の一時診断先である。

## レビュー結論

確定的不一致はBD-01とCHECK-01 / test_limit / acceptsの上限。11〜20人が旧実装では拒否される。業務方針20人の再承認ではなく、実装担当がCheck / Test / 実装を新BDに揃え、責任者が期待結果を確認する必要がある。21人拒否と0人拒否を含む境界を維持する。

BD-02とCHECK-02 / test_cancelは関数のoccupied状態として一致し、BD-03とCHECK-03 / test_ownerも一致する。これらは本番要件全体の確認済みを意味しない。全件成功だけで受入を承認しない。修正後に期待とassertionを照合して実行し、照合済み関係だけpinを更新する。
