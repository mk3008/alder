# 保存形式の独立比較PoC

整形済み単一JSONを次の検証候補に推奨する。要素IDによる参照と、行ごとに読める本文を同居させられるためである。**正式採用は未決**であり、JSONLの優位や人間の保守負担の低減は実証していない。現行Markdownも比較対象として保持する。

固定購買原典と0.4.8形式のCheck見本を、情報を足し引きせず3方式に格納した。3方式すべてから原文をバイト一致で復元できる。構造・参照検査と固定編集は成立した。ただし、この結果は汎用的な保存仕様、全Markdownの変換器、安全な製品編集機能の完成を意味しない。

- [比較報告・実測表](REPORT.ja.md)
- [Markdown](fixtures/purchase.md) / [整形JSON](fixtures/purchase.json) / [要素単位JSONL](fixtures/purchase.jsonl)
- [原典・版](results/sources.json) / [確認した仕様とparser](results/authority.json)
- [PoCテスト](results/tests.txt) / [現行Graph回帰](results/graph-regression.txt) / [Viewer互換性の観測](results/compatibility.json)

## 再現

Repositoryルートから、Python 3.12以降（標準ライブラリのみ）とNode 24の型除去機能で実行する。依存パッケージの追加は不要。

```sh
python work/storage-format/issue-268/poc.py
python -m unittest discover -s work/storage-format/issue-268 -p test_poc.py -v
python work/storage-format/issue-268/measure.py
python work/storage-format/issue-268/report_tables.py
node --experimental-strip-types work/storage-format/issue-268/compatibility.mjs
python -m unittest discover -s tools/business_graph -p 'test_*.py'
```

`measure.py`は合成入力をメモリ上で再生成し、9回の生測定と環境情報を`results/benchmark.json`へ保存する。各候補2回のウォームアップ後に測る。ローカルファイルとloopback HTTPの往復検査も行う。外部サービス、ブラウザー、LLMは起動しない。計測は数分かかり、結果ファイルの測定値を更新する。固定編集とHTTP検査だけなら`measure.py --evidence-only`で再実行できる。

`poc.py`は既存仕様を読むために`tools/business_graph/export.py`を参照する。製品ファイルは書き換えない。変更先は本ディレクトリだけである。正式BD/Check、Plugin/Skill、Viewer、Graph v1、別の状態遷移・概念モデル研究へ変更を加えていない。
