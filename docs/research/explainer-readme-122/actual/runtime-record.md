# 検証環境と未適用範囲

- Node: 24.19.0 / Python: 3.12.14
- explainer原実装: `1e393e0b3039a8a38a77d436f387ea58ab48b2fb`。Skill・検証・first-reader scriptsは改変しない
- 正式なAlderの依存・コード・READMEへ変更は加えない

## 依存の準備

原checkoutで `npm ci --ignore-scripts` を実行したが、ERESOLVEで失敗した。root依存のPlaywright 1.56.1に対し、@mizchi/vlmkit 0.22.0がpeer Playwright >=1.61 <2を要求していた。上流lockfileのそのままの再現には失敗している。

続いて、別の検証専用ディレクトリへ次の対応版をインストールし、原checkoutのnode_modulesから参照させた。

```sh
npm install --prefix /tmp/explainer-runtime-122 --ignore-scripts --save-exact @mizchi/vlmkit@0.22.0 @mizchi/vlmkit-anim@0.22.0 marked@18.0.14 playwright@1.63.0
```

これらの取得は成功した。検証実行環境の依存調整であり、上流lockfileや検証ルールは変更していない。原lockfileでの成功とは区別する。

## ブラウザ取得

Playwright 1.63.0の `playwright install chromium` を実行した。Chrome for Testing 153.0.8010.12 / chromium v1243のzip取得が0 MiBとなり、`End of central directory record signature not found` を繰り返して終了code 1となった。システムのChromium/Chromeも見つからなかった。

したがってHTMLの生成と、ブラウザを使ったintegrity / a11y contrastの成功は分けて扱う。後者を未実行のままVERIFIEDとは報告しない。原verify-docの全体実行ログと、明示的に `--skip-html` を指定した部分実行ログを別に保存する。

## first-readerの実行方式

原 `feed.py serve` の既定設定を使う。通常sandboxでの127.0.0.1 listener作成はPermissionErrorだったため、ローカルloopbackへのlistenerと接続だけをsandbox外で実行する。外部サイトへの送信はない。feedの順送り・dwell・moment log条件を変更しない。

## 適用範囲

- 一次資料引用の一致・出力再実行・架空fixtureの状態表示は実行で確認する
- 業務意味の正しさ、AI実装の安全性、人間読者の理解改善はこれらの機械検査では保証できない
- 図の検証は図を生成した場合だけ適用する。文章・表で説明する場合は図がないことを明示し、図検証を通ったとは扱わない
- 初回Cのfirst-reader観測を保存し、都合のよい反応が出るまで読者を取り替えない
