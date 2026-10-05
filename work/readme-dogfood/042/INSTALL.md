# 導入の実行結果

2026-10-05 UTC。クラウドLinux上のCodex CLI 0.159.2で実行した。ユーザーのデスクトップ、既存Plugin登録・設定・認証は変更していない。

## READMEのコマンド

新しい書込み可能なCODEX_HOMEを用意し、READMEのコマンド本体を変更せず実行した。

```sh
CODEX_HOME=<isolated-home> codex plugin marketplace add mk3008/alder --ref plugin-v0.4.2
```

成功。marketplace `alder-development` を登録し、取得HEADは `6d30b93abf8ecdc8902fef5c16bfb53fda8617e9` だった。以前の検証で使われたsparseオプションは今回追加していない。

## CLIによる代替install

```sh
CODEX_HOME=<isolated-home> codex plugin add alder@alder-development --json
CODEX_HOME=<isolated-home> codex plugin list --json
```

成功。version 0.4.2、installed/enabledともtrue。公開タグのpackageとcacheの全45ファイルがSHA-256で完全一致し、10 Skillsがある。取得sourceのpackage/Skill/release testsは14/14成功。

これはREADMEが指定するデスクトップのPlugins Directory操作ではない。デスクトップでのmarketplace表示、インストール・有効化、新規チャット読込みは未実施。

## freshモデル起動のblocker

既存環境の `codex login status` は「Logged in using ChatGPT」、隔離homeでは「Not logged in」だった。資格情報の内容は読まず、コピー・symlink・移動も行っていない。

既存認証をそのまま利用する `codex exec --ephemeral --json --skip-git-repo-check -C <scratch-product> -s read-only 'Reply with OK only. Do not use tools.'` はモデル起動前に次のエラーで止まった。

```text
Error: failed to initialize in-process app-server client: Read-only file system (os error 30)
```

stdoutにthread/model応答はなく、process exitが0でも成功とは判定しない。[公式設定リファレンス](https://developers.openai.com/ja-JP/docs/config-file/config-reference)にある `sqlite_home` と `log_dir` をscratchへ向け、history保存をnoneにする一回の限定試行も同じ結果だった。診断用straceはホストのptrace権限で拒否され、実行できていない。権限緩和や回避は行わなかった。

したがって、この環境では実クライアントのインストール済みPluginによるfresh自然文routingは未検証。代替のsource-catalog診断と混同しない。継続に必要なのは、書込み可能な通常のCodex/ChatGPTデスクトップ環境で、上記タグからインストールした新規チャットを使うこと。

## 記録

コマンドのstdout/stderr、exit、package hashは [evidence](evidence/) に保存した。公開用コピーではローカル作業rootを `<dogfood>`、祖先ディレクトリを一般的なプレースホルダーに置き換えた。変換と原本・公開版のSHA-256は [manifest](PUBLICATION-MANIFEST.json) に記録した。認証内容・個人アカウント・非公開会話は含まない。
