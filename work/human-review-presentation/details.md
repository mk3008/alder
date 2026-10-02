# 根拠と検証範囲

## 上限の不一致

[BD](fixture/business-design.md#bd-01)は1〜20人受入・21人拒否、旧版は1〜10人・11人拒否。[確定条件](fixture/decision.md)で上限20人の判断を仮定する。実ユーザーの承認ではない。キャンセル・本人変更は変更なし。Checkの人間レビューと新BDへの照合は未完了。

[CHECK-01](fixture/checks.md#check-01)は10人受入・11人拒否。[test_limit](fixture/test_product.py)は1と10がTrue、0と11がFalseをassertする。[accepts](fixture/product.py)は上限10。よって11〜20人を拒否し、新BDと確定的不一致。3 tests成功を新BDとの整合や業務承認と扱えない。

実装担当はCheck / Test / Codeを上限20へ整合させる。責任者は修正した期待を確認する。21人拒否と0人拒否を維持する。修正後に期待とassertionを照合し、実行し、照合済み関係だけpinを更新する。

## キャンセル

[BD-02](fixture/business-design.md#bd-02)と[CHECK-02](fixture/checks.md#check-02)は使用中の部屋を空室にする。[test_cancel](fixture/test_product.py)はcancel(True)がFalseをassertし、[cancel](fixture/product.py)はFalseを返す。戻り値は操作後のoccupied状態。Falseは空室で成功可否ではない。この関数契約として整合する。

## 変更権限

[BD-03](fixture/business-design.md#bd-03)と[CHECK-03](fixture/checks.md#check-03)は予約者本人だけ変更可。[test_owner](fixture/test_product.py)はownerとrequesterが同じときTrue、他人のときFalse。[can_change](fixture/product.py)は等値判定。この関数契約として整合する。

## 対応と省略範囲

[trace](fixture/trace.json)にはBD-01→CHECK-01、BD-02→CHECK-02、BD-03→CHECK-03と、それぞれのTest関係とfingerprintがある。BD-01のpinは旧文面で再照合が必要。一致するTest pinはassertionの意味や人間承認を証明しない。

3 tests成功。全件成功だけで受入を承認しない。整合した取消・本人変更も本番全体の確認済みを意味しない。永続化・同時実行・本番認証はこの関数fixtureの範囲外で未検証。追加実装要求へ拡張しない。Codeへの恒久mappingは作らず、リンクは今回の一時診断先としてのみ使う。
