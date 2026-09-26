# 設備保全CLI

Python 3.11以降と標準ライブラリのSQLiteだけで動作するローカルアプリケーション。リポジトリルートから実行する。追加パッケージのインストールは不要。

## 実行

```sh
python3 -m maintenance --db /tmp/alder-maintenance.db init
python3 -m maintenance --db /tmp/alder-maintenance.db provision pump-1
python3 -m maintenance --db /tmp/alder-maintenance.db report --role reporter pump-1 2026-01-01T09:00:00+09:00 Alice 'ポンプから漏水'
python3 -m maintenance --db /tmp/alder-maintenance.db list
```

`report` のJSON出力の `request_id` を以下の `REQUEST_ID` に置き換える。`schedule` の日時は実行時点より未来を指定する。

```sh
python3 -m maintenance --db /tmp/alder-maintenance.db close --role inspector pump-1
# 閉鎖中は失敗し、依頼はopenのまま
python3 -m maintenance --db /tmp/alder-maintenance.db schedule --role coordinator REQUEST_ID 2099-01-01T09:00:00+09:00
python3 -m maintenance --db /tmp/alder-maintenance.db release --role inspector pump-1
python3 -m maintenance --db /tmp/alder-maintenance.db schedule --role coordinator REQUEST_ID 2099-01-01T09:00:00+09:00
python3 -m maintenance --db /tmp/alder-maintenance.db complete --role technician REQUEST_ID
python3 -m maintenance --db /tmp/alder-maintenance.db list
```

成功時は標準出力にJSONと終了コード0、業務拒否・DBエラーは標準エラーにJSONと終了コード1を返す。引数の構文エラーはargparseの終了コード2。`--help` で各コマンドの入力を確認できる。

`init` は新規DB用で、同じアプリケーションのDBへの再実行では既存データを保持する。別スキーマのDBを移行する機能ではない。`provision` は「設備登録済み」という前提を準備するローカル管理操作。

`--role` はローカル実行者が指定する責任ロールであり、本人認証ではない。共有サーバーとして公開する用途では、信頼できる認証・認可層からロールを渡す必要がある。DBファイルと実行環境を管理できる利用者向け。

日時はタイムゾーン付きISO 8601を受け付け、UTC・マイクロ秒固定形式で保存する。完了日時と日程設定時点はアプリケーションの時計を使用し、CLI入力で指定できない。

## 検証

```sh
python3 -m unittest discover -s tests -v
```

一時SQLiteファイルを使い、5業務の連携、権限、状態遷移、時刻境界、失敗時の不変性、複数接続の競合、再接続後の永続化、CLIの通し実行を確認する。本番データは使用しない。

未決定事項の扱いとDDL差分は [判断記録](../docs/issue-5-decisions.md) を参照。
