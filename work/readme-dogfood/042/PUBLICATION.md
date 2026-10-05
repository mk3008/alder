# 公開用証拠の範囲と加工

このフォルダーは合成の工具返却受付例についての公開用コピーである。集約時点の結論は [RESULT.ja.md](RESULT.ja.md) を参照。

## 原本と公開コピー

- 原本は実行時の保存先に残し、この集約作業では変更していない。原本の非公開作業場所を示すリンクや復元対応表は公開しない。
- [PUBLICATION-MANIFEST.json](PUBLICATION-MANIFEST.json) の `source` は論理的な相対名、`published` はこのフォルダーからの相対名である。`original_sha256` と `published_sha256` が同じならコピーはbyte-identicalである。
- ローカル作業rootを `<dogfood>`、その祖先を `<scratch-root>`、`<scratch-parent>`、`<workspace-root>` に置き換えた。ディレクトリ内の相対名、Skill名、ファイル名、公開commit、事実・エラー・テスト結果は残した。これにより読む資料と結果の関係は保ちつつ、実行環境の固有パスを除いた。
- 選んだ証拠にruntime UUIDは見つからなかった。agent/thread識別子は新たに復元・追加していない。個人名、認証情報、非公開Slackや内部会話へのリンクは含めていない。公開プロジェクトの所有者名は既存のGitHub URLの一部として残した。
- 制御指示に付いていた報告・調整手順の末尾は省略し、該当箇所にsafe abstractionと明記した。実験固有の入力制限、作業条件、要求設定は残した。原本hashはmanifestに保持する。
- 各観測記録や `12-artifacts.sha256` 本文中のhashは、記録当時の原本に対する値である。ローカルパスを置換した公開コピーに対してそのhashを検証しても一致しないことがある。公開コピーの検証にはmanifestの `published_sha256` を使う。
- `INSTALL.md`、`RESULT.ja.md`、この説明とmanifestは集約文書であり、モデルのraw出力ではない。安全な抜粋以外の原文は、機密除去が不要な限り書き換えていない。

## 凍結した実装

`implementation/` は初回20テスト実装のスナップショットである。Business DesignとCheck、判断記録、システム要件は保存済みの工程12以前の証拠からコピーした。コード・テスト・runner・実装メモは `12-artifacts.sha256` と一致することを確認してコピーした。後続作業によって変わるworkspaceの最新版とは区別する。

再実行する場合:

```sh
cd implementation
PYTHONDONTWRITEBYTECODE=1 python run_tests.py
PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tests -v
```

これはテストの再実行であり、READMEの全工程やSkill自動routingの追試ではない。初回実装の検出能力の限界は独立レビューを読むこと。

## プロンプトと設定の欠落

`evidence/prompt-00.txt`〜`prompt-10.txt` の全11件は、保存した固定README本文と完全一致する部分文字列である。実装時だけ例の `meeting-room.md` を `tool-return.md` に置き換えた。prompt-09/10の任意工程は実行していない。

これらの依頼文はworkerへの制御指示全文ではない。たとえば `09-check-draft.md` には受け取った制御指示の保存があるが、全工程に同等の原本は残っていない。観測記録に含まれる依頼文、読んだ資料、禁止資料、出力、要求設定だけを証拠とし、欠けた元handoffやagent識別子を後から創作しない。

独立Freshレビューの要求は `gpt-6-sol` / `medium` / `fork_turns: none`。その他の要求設定は各工程の記録による。実効モデル・effort・履歴条件の独立attestationはない。

配布sourceと模擬条件には公開固定commitを用いたが、実行統括がGitHubからprotocol commit b7971be8とその内容を取得して確認した（commit作成日時2026-10-05 02:11:32 UTC）。本集約担当自身はネットワークによる再取得を実施していない。ローカルに残る元出力・hashと公開コピーの対応は検査できる。agent工程すべての完全な再現可能性や実運用の一般的効果は主張しない。

## 補強後の実装とmutationの再実行

`implementation-revised/` は21テストと更新後のCheck記録を含む。元の20テストとread-onlyレビューは上書きしない。

`14-mutation-probe.py` は元の実行時と同じく、隣の `workspace/` を読む。公開snapshotのディレクトリ名は異なるため、次のスクリプトは一時ディレクトリに `workspace/` と `evidence/` を再構成してから実行する。script自体のbytesは変更しない。

```sh
bash reproduce-product.sh
```

通常suiteは21件成功し、元20件は指定のmutationを見逃す。補強suiteは追加した1件で失敗し、exit 1になることが期待値である。この失敗は改変したコードを検出した結果であり、公開した正常コードのテスト失敗ではない。

公開用の配置からこのスクリプトを実行し、期待どおりの3結果とscript全体のexit 0を確認した。[実行ログ](PUBLIC-REPRODUCTION.log) の一時パスは `<reproduction-root>` に置換し、変換前後のhashをmanifestに記録した。
