# 備品購入申請の実装（Issue #13）

業務要件の入力は [業務設計](../../business-design/purchase-request/README.md) のみ。SQLiteを使うローカルCLIで、申請、承認、却下、購入結果登録を実行する。

## 実行

Python 3.10以上、SQLite 3.37以上（STRICTテーブル対応）が必要。外部パッケージ不要。リポジトリルートで以下を実行する。DBファイルは初回起動時に作成され、以後保持される。

```sh
python3 implementations/purchase-request/app.py --db /tmp/purchase-demo.db --actor alice --role applicant submit --item モニター --quantity 2 --amount 40000 --reason 業務用
python3 implementations/purchase-request/app.py --db /tmp/purchase-demo.db --actor bob --role approver list
python3 implementations/purchase-request/app.py --db /tmp/purchase-demo.db --actor bob --role approver approve 1
python3 implementations/purchase-request/app.py --db /tmp/purchase-demo.db --actor carol --role buyer list
python3 implementations/purchase-request/app.py --db /tmp/purchase-demo.db --actor carol --role buyer purchase 1 --amount 39000
python3 implementations/purchase-request/app.py --db /tmp/purchase-demo.db --actor alice --role applicant show 1
```

`1` は新規DBの場合の例。実際にはsubmitのJSON出力の`id`を使う。却下経路は別の申請を登録し、`--role approver reject <id> --reason 予算不足` を実行する。却下済み申請は購入できない。

- `list`: 申請者には自身の全申請、承認者にはsubmitted、購買担当者にはapprovedを返す。
- `show <id>`: 全項目を返す。申請者は自身の申請のみ参照可能。
- 成功: JSONを標準出力、終了コード0。業務・DBエラー: JSONを標準エラー、終了コード1。CLI引数不備: argparseの説明と終了コード2。
- 実際の購入は担当者がアプリ外で行う。purchaseは購入結果を記録する操作であり、外部発注や決済を行わない。

## 利用範囲

これは信頼されたローカル操作者による業務検証用アプリ。`--actor`と`--role`は実行コンテキストの明示で、認証やロール付与を証明する仕組みではない。アプリは指定ロールごとの操作権限を検査するが、DBファイルにアクセスできる利用者による改変を防ぐものではない。多人数向けの本番公開には、別途認証された利用者・権限を渡す入口が必要。

## 検証

```sh
python3 -m unittest discover -s implementations/purchase-request -v
```

テストは一時DBを使い、終了時に片付ける。利用者のDBを変更しない。設計判断と結果は [DECISIONS.md](DECISIONS.md) を参照。
