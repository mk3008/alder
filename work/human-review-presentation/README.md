# 判断事項中心のレビュー提示比較

[Alder #136](https://github.com/mk3008/alder/issues/136) の限定研究。既存の合成予約fixtureで、業務上限だけ10→20へ変わった時点を比較する。実製品の方針は変更しない。

- [研究結果と採否](../../docs/human-review-presentation-study.ja.md)
- [通常提示](baseline.md) / [判断事項からの段階提示](staged.md)
- [実行前の条件](protocol.md) / [事前採点条件](rubric.md)
- [requested設定・完全prompt・raw最終返答](runs/manifest.json)
- [計測値と採点](observations.json)

入力固定SHA: `2687ebe816d21f534f81822058b2eabde7b7797f`。各arm1回。gpt-6-sol / medium / fork noneを指定。実効設定の独立確認はできない。raw最終返答は公開するが、完全なツール通信ログではない。

再計測:

```sh
python3 work/human-review-presentation/measure.py
python3 -m unittest discover -s work/human-review-presentation/fixture -p 'test_product.py' -v
```

3 tests成功は旧実装と旧期待の一致で、新BDへの整合ではない。Fresh読解はAIによる到達可能性の代理観測であり、人間の所要時間や認知負荷を測定していない。
