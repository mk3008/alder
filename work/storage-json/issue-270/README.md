# 型付き単一JSONの保存形式PoC

Activity・Object・関係・Findings・Checkの保証と比較表を明示フィールドにした独立試案です。IDを保持した改名・並び替え・更新、参照と文書版の検査、旧MD／Graph v1への投影を確認できます。

**旧MD全文と旧BD本文を同梱しない0.3試案です。** 原典MDは別ファイル、JSONは型付き業務情報と参照目録・ハッシュを保持します。修正版の実Chrome CIでも13/13ケース、PoC 54件・Graph 52件が成功しました。 Node計測をブラウザー性能と読み替えないでください。形式の正式採用・製品Viewer変更・merge・release・デプロイは行っていません。

- [日本語報告](REPORT.ja.md)
- [型付きJSON](fixtures/purchase.json) / [JSON Schema試案](schema.json)
- [独立ブラウザーハーネス](index.html) / [ブラウザー実行の停止記録](results/browser.json)
- [54 tests](results/tests.txt) / [既存Graph 52 tests](results/graph-regression.txt)
- [Node性能](results/node-performance.json) / [実際のCodex編集比較](results/edits.json) / [初回の適用失敗](edits/first-attempt.json)

## 再現する

RepositoryルートでNode 24とPython 3.12以降を使います。追加依存・APIキー・外部LLM呼出しは不要です。

```sh
python work/storage-json/issue-270/import_fixture.py
node work/storage-json/issue-270/generate.mjs
node work/storage-json/issue-270/build.mjs
node --experimental-strip-types --test work/storage-json/issue-270/test-core.mjs work/storage-json/issue-270/test-paths.mjs
node --experimental-strip-types work/storage-json/issue-270/measure.mjs
node work/storage-json/issue-270/audit-edits.mjs
node work/storage-json/issue-270/audit-revision.mjs
node work/storage-json/issue-270/report-tables.mjs
python -m unittest discover -s tools/business_graph -p 'test_*.py'
```

`import_fixture.py`は固定原典のhashを検査し、保存済みの`identity-map.json`を使います。異なる原典へIDを推測で引き継ぎません。`generate.mjs`は5/100/1,000 Activityと予算超過用の合成ファイルを`.generated/`へ再生成します。容量の大きい生成物はGitへ追加していません。

編集比較の原本とCodexによる実編集は0.2試案当時の証拠として保存し、生成では上書きしません。今回の変更による新しいLLM編集試験は行っていません。`audit-edits.mjs`は結果を採点するだけで、編集を代行しません。[固定指示と条件](edits/protocol.md)を確認してください。初回バッチは未確認のIDをpatch文脈へ含めて適用拒否され、ファイルはすべて未変更でした。保存された6件は、その事実を記録した後の明示的な再試行です。

## ブラウザーで確認する

承認済みのローカル開発環境でHTTPサーバーを起動し、表示されたURLから`work/storage-json/issue-270/index.html`を開きます。製品デプロイは必要ありません。

```sh
python -m http.server 8765 --bind 127.0.0.1
```

1. 「JSONローカルファイル」で`fixtures/purchase.json`、次に`.generated/activities-1000.json`を選びます。Activity・Object・Findings・Check・共通保証・比較例を切り替えて確認します。
2. 「ブラウザー内へ保存」→「保存から復元」、または「JSONを書き出す」→再読込を試します。描画は最大100件のリストと最大5要素の読取見本で、製品Viewerの全体描画性能とは異なります。
3. 許可されたHTTP(S)配信元のJSONをURLから読みます。CORS許可が必要です。製品URL readerはHTTPSのみですが、ハーネスは開発用loopback HTTPも受け付ける設計です。
4. 「現行の2MiB条件を再現」のON/OFF、未知版等の表示保持検査、中止、予算超過ファイルを試し、「検証記録を保存」で実測を残します。

ローカルFileはブラウザー内で処理し、コードにアップロード処理はありません。URLは匿名GET、保存は専用IndexedDBまたはローカルダウンロードという設計です。修正版はPoC専用GitHub Actions内の実Chromeで同じ13ケースを検査済みです。[結果](results/browser-0.3-ci.json)とIssue #270を参照してください。スクリーンショットはrunnerの日本語フォント不足があり、日本語字形の見た目は未確認です。

PoCに置いた16MiB・5,000 Activity/Object・5秒の予算は検査用の仮値です。本番推奨値ではありません。現行Viewerの上限は変更していません。
