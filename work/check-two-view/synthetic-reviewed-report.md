# 生成回帰の実行報告

## 全依頼文

> 別の生成回帰を実行。現在のstack-sourceのSkillとbundle（source20ae45a46517c3812706fb94dfc7e6faa15a83f6/bundle8be11c2785ba3f53e9e725d3fb8a2d377fab544f）を使い、stack-source/business-design/purchase-request/README.mdとstack-source/work/check-two-view/synthetic-reviewed-input.mdから、Activity/Object二視点への表示のみ更新を行ってください。後者はテスト専用のsynthetic inputで一部確認済み状態と架空Test/assertion識別子が設定されています。この入力の全Check意味/ID/人間状態/根拠/Test対応と証拠状態・実行結果を保持。テストを実在・実行済みと扱わない。新Check追加なし。scratch親synthetic-reviewed-output.md と synthetic-reviewed-report.mdへ保存。full prompt/hashes/author checksを記録し、Skillの名前診断実行。別読者reviewはcoordinatorが行うためnested agentなし。他work/資料・過去candidate・レビュー答案は読まず、今回のinputファイルだけ例外として読む。承認・repo編集なし。

## 入力と版

`stack-source` の HEAD は `20ae45a46517c3812706fb94dfc7e6faa15a83f6`。指定された bundle 識別子は `8be11c2785ba3f53e9e725d3fb8a2d377fab544f`。Skill bundle は作業ツリーに変更があるため、下記の実際に読んだファイルの SHA-256 で範囲を固定した。Plugin 版は `0.4.8`、provenance の Alder source revision は `20ae45a46517c3812706fb94dfc7e6faa15a83f6`。

| 入力（stack-source 内） | SHA-256 |
| --- | --- |
| `business-design/purchase-request/README.md` | `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7` |
| `work/check-two-view/synthetic-reviewed-input.md` | `2328fc056aa1b894d90309dc1b767c2992a38a88d25fe4f943129e2fa57191f4` |
| `plugins/alder/skills/alder-draft-check-items/SKILL.md` | `65be6ef8989662599739584b61bbefc7b0058e1cf955e09ce971119436907ea7` |
| `references/check-item-traceability.md` | `bcac07de5da861fb6535c48fc122246ef90402b992706316a312fb24204a63f7` |
| `references/adoption.md` | `2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3` |
| `references/provenance.json` | `fdcace6b7f76ce6c3bce657684d6af3510cac6dcf14a112a11977addcd0abb34` |
| `scripts/check_activity_names.py` | `bc6768c30fa5e2608eaaec0cac1f100a0ed10134ef3d38f03d9b9988ee7ff677` |
| `plugins/alder/plugin.json` | `8831bdea6a9fb06aef307f4859f71c1f3699eda32bde3d55a15c936743b1a1e6` |

## 実施・著者点検

`synthetic-reviewed-output.md` に Object 購入申請の引継ぎ索引を置き、既存 Check を H3/H4 の通常 Markdown に移した。HTML anchor と折りたたみの内部リンクは同じ見出しのリンクに更新した。JA-EX-01〜05 と JA-EX-Q01 の六つの ID、タイトル、条件、期待結果、人間レビュー状態、質問、選択肢、根拠、導出分類、AI確度、関連業務、Test 記述は行単位で保持した。JA-EX-01 の状態「確認済み」、架空の `test_request_submitted::assert_status_submitted`、証拠状態 `mapped`、実行結果 `未収集` はそのまま残した。`mapped` を実際のテスト存在・実行成功と解釈していない。新 Check、状態判断、境界値や未定義時のルールは追加しなかった。

四列の Activity 索引、四つの Activity 見出しの順序、共有 JA-EX-04 の単一本体と両 Activity からの参照、Object 索引の全 Check リンク、未決 JA-EX-Q01 の表示を確認した。既存の根拠 URL と版は変更していない。新しい Object 索引の参照も同じ既存 URL 版の業務設計箇所を指す。元のリンク先 `c2852531...` の内容自体はこのローカル checkout にないため再取得・検証していない。元のカスタム fragment に対する外部からのリンクは調査範囲外であり、文書内リンクのみ見出しへ修復した。追加サンプルや式は、表示のみの範囲で入力にない境界・十分条件を決めないため設けなかった。

名前診断 `python3 plugins/alder/skills/alder-draft-check-items/scripts/check_activity_names.py --design business-design/purchase-request/README.md --checks /workspace/scratch/dab003a8ea37/synthetic-reviewed-output.md` を実行した。初回は Object を H2 として Activity 見出しに含めたため mismatch。Object を索引内 H3 に修正した後の再実行は `status: match` で、宣言・索引・Activity 見出しの四名が一致した。これは名前以外の保証を検証する診断ではない。別読者による独立した Consistency review は coordinator が担当するため、この実行では未実施。人間承認、repo 編集、実装・テスト実行は行っていない。

成果物 SHA-256：`e508495ef0a403efb37ba785e347c9c3347536f1475a199c5a03764b2aee2f0a`。
