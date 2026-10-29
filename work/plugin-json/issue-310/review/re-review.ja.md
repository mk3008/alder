# 来訪案内 Business Design 再レビュー（読み取り専用）

対象は `review-input/revised-business-design.json`、package `package-4`、Business Design ID `b8a1e7e8-1b0e-4f17-88c8-f89b538d5b13` / revision `bd-4`、`alder-document-package/0.5`、BD schema `0.4`。原資料は `review-input/intake.ja.md` と `review-input/update.ja.md`。比較に限り `review-input/prior-to-rename.json`（`package-2` / `bd-2`）および `review-input/business-design.json`（`package-3` / `bd-3`）を読んだ。人間の業務合意を示す資料ではない。

## 前回指摘の扱い

**解消（記述上）。** 前回、Activity `来訪案内を登録する`（`79289579-0a13-491c-9b9f-c80116a7d821`）の Step 1（`0b08d343-bb58-4c3c-986c-6f818de43f18`）が希望日・連絡先だけを登録すると書き、Step 3 が台帳から来訪日・連絡先を読み、Result が台帳への来訪日の記録を保証していたため、来訪日の出所が手順から追えなかった。`bd-4` の Step 1 は「希望日（この業務で案内する来訪日として、同じ日を用いる）と連絡先を案内台帳に登録する」と明記した。ヒアリングの「来訪日はこの業務では希望日と同じ日」と一致し、Step 1 の台帳記録から、台帳へのOutput `b6ff5b69-0460-4cd6-ba18-a1e8a5d5eb2c` と台帳からのInput `83e5e2d8-2c8f-4f50-8d15-de7f99b1107e` が共有するData `614a6e82-87bf-4248-81a3-c413b8d6e3cb` の来訪日、Step 3 の読み戻し、Result `80d0aec8-c1a0-46b7-b515-c5eeb0236638` まで同じ日として追える。独立した新規業務ルールや追加の順序制約は加わっていない。

## 全体と更新保持

新たな重要な原資料支持の指摘はない。Scopeは案内記録・利用者への通知までで当日応対を除外。Object 4件とInformationの所有者、Role 2件、Activityの二主体（受付スタッフの兼任、Roleなしの案内システム）、Step 3件の担当・必須性・条件付き希望詳細、Step 1→3のみの厳守順、Result 2件、Data 4件、I/O 5件、通知失敗の例外と対象Activityのopen Findingをヒアリングと照合した。通知失敗時の扱いは未決のまま、正常結果を確定しない。文書Scope/Activity名の欄の役割、単一Activity内のInput→Procedure→Output→Result、台帳のOutput→同じDataでのInput、正常・例外の分離に追加の実質的不整合は見いださなかった。

`diff -u prior-to-rename.json business-design.json` では package/document revision `2→3` とRole `eab11053-53fe-40f7-a1e7-ad3e96b206e7` の名前 `連絡担当→案内担当` だけが変化した。色 `#2563eb`、ID、受付スタッフの同一Object `8a8a553f-0021-4741-a529-8568bfc1eb83` によるRole参照、他の主体・Step・Data・I/O・例外・Findingを含む残りの内容はbyte差分上で維持されている。`diff -u business-design.json revised-business-design.json` では revision `3→4` と上述のStep 1本文だけが変化した。従って改名後のRole identity/color/referencesも `bd-4` で維持され、後続修正の範囲は前回の記述指摘に限定された。

## 実行記録・版・限界

- 使用したのはインストール済み Alder Plugin `final-installed/plugins/alder/plugin.json` version `0.4.9` のレビューSkillとJSON管理Skill、その構造・品質・相関・漏れ、JSON 0.5、Findings、操作ガイド、adoption section 1、provenance。bundled source revision は `f2716613a1fb65236ac1c30ec1eab221ef576392`。指定されたPlugin snapshot revision は `47a458cef88bc17c242da23f74d79789566e563a`。指定された公開コミット `47dd52849817b14c013f194694043faf345635a3` および `e3597a9f75660f6c0efa29c82e301a80bb793c2c` のリモートは照合していない。
- `sha256sum review-input/{revised-business-design,prior-to-rename,business-design}.json review-input/{intake,update}.ja.md` の開始時結果は順に `b520831a2869c2bb045bb370b82dd26fb94ec4cbac6f2b29e4e4d4050ac12cfe`、`35f8a538f13832a3ecacecd4903c6ba96ca626fcf33acfb2ef5deedeaf7f38c1`、`741f88eb8ce891451c63c39d4e02b8800b094033314b466aee3a402c0895fc78`、`fa561b97301b763be9a535775f044e66f3b4f89250e30442aa825527c663b506`、`5f3cbbe42fd1a80b1eeccb027e9c31d4df8c50172f68d4d74465f85914630bb6`。前3件は指定hashと一致。
- 同梱 `author-cli.mjs runtime` は Node `v24.22.1`、`directJSON:true`、Python `3.12.14`。3件それぞれ `cli.mjs validate <path>` は `valid:true`、診断なし、32 entities。`author-cli.mjs inspect <path>` はそれぞれ上記hashと package/document revision `2/2`、`3/3`、`4/4`、Checkなし。`diff -u` は前段の差分だけを示した。
- 終了時に同じ5入力のhashを再計算し、開始時と一致した。入力・Business Designは変更していない。単一ActivityのためActivity間の引継ぎや受け側Exception Whenは対象に存在しない。実運用や業務上の承認、Viewer表示、遠い例外条件の網羅は確認していない。機械検証の成功は人間の合意を意味しない。
