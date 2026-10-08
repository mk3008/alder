# 条件Cの実行記録

日付: 2026-09-30。予備A/Bの実行記録を置換せず、実際のSkill適用を別条件Cとして追加した。

## 固定入力と独立コンテキスト

| 段階 | 許可入力・公開revision | 実行設定 |
| --- | --- | --- |
| 著者 | explainer Skillとreferences `1e393e0b3039a8a38a77d436f387ea58ab48b2fb`、Alder一次資料 `90890e1c209af1b7f88f14e64bb27a7a0d2edbee`、仮persona | fork none、親のmodel/effortを継承。A/B本文・出力は禁止 |
| skim / K / S / 共通質問C | 候補Cとpersonaを公開固定 `1a00b593b43b81a9b97b886d690d91ec215d81a8` | gpt-6-sol / medium / fork noneを要求、他条件・親履歴は禁止 |
| recall K / S | 各自の原recall-inputのみ、公開固定 `3e193e2e0b8f8fba95eb2ee2da84ab2392b09359` | gpt-6-sol / medium / fork noneを要求、本文・他ログは禁止 |

実効model/effortの独立証明はない。著者の完全指示と工程は[authoring-record](authoring-record.md)、読者の完全指示は[reader-prompts](reader-prompts.md)。親は順送り読書が終わるまで原ログ全文を読まず、読者役にもならなかった。上記公開revisionは各段階の開始前に固定した。

候補C SHA256: `0e237ca72e2a32340fdbfb34f0c96df7d57dbf1c87bb35e778d757ece9d2b3fe`

checks.json SHA256: `e89292cd2f3ba5a909e892edf19025422f05f111f3dbb65b1f72f2e2a57aeeb5`

## 生成と機械検証

著者は一次資料8引用と架空fixtureを先に作り、2つのPython scriptsを実行してstdoutを貼付した。候補を凍結してから原verify-docで再実行・貼付照合した。原scriptsは改変していない。図は権限・版の対応表に代えた。

次の変数は再現時に自分のcheckout絶対パスへ設定する。

```sh
alder_checkout=/absolute/path/alder
explainer_checkout=/absolute/path/explainer
actual_dir="$alder_checkout/docs/research/explainer-readme-122/actual"
runtime_dir="$actual_dir/runtime"
```

explainerの固定revisionをcheckoutする。Alderの現在の研究branchには凍結Cと、検査対象になる同一の一次資料が含まれる。

```sh
git -C "$explainer_checkout" checkout 1e393e0b3039a8a38a77d436f387ea58ab48b2fb
npm ci --prefix "$runtime_dir" --ignore-scripts
```

これは検証専用lockfileの再現であり、上流lockfileでの成功ではない。実行時は `/tmp/explainer-runtime-122` に依存を用意し、explainer/node_modulesからsymlink参照させた。既存node_modulesがある場合は無断で置換しない。原HTML builderのimport解決にはexplainer側から同じ依存を参照できる状態が必要になる。

```sh
cd "$runtime_dir"
node "$explainer_checkout/skills/explainer/scripts/verify-doc.mjs" "$actual_dir"
node "$explainer_checkout/skills/explainer/scripts/verify-doc.mjs" "$actual_dir" --skip-html
```

全体検査はHTMLの3 gatesで失敗。HTMLを省いた検査だけVERIFIED。ブラウザ取得は対応版Playwrightの `playwright install chromium` がzip不正で失敗し、system Chromiumもなかった。HTML生成自体は成功。正確な依存と失敗理由は[runtime-record](runtime-record.md)、原stdoutは[evidence](evidence/verify-full.txt)。全体成功と見た目のQAは主張しない。

## first-reader

以下は原script呼出しの再現形。live feedの一時URL/tokenはその実行で取得し、公開しない。仮personaファイルは `personas/explainer-readme-122.md`。

```sh
python3 "$explainer_checkout/skills/first-reader/scripts/skim.py" "$actual_dir/README.md"
python3 "$explainer_checkout/skills/first-reader/scripts/feed.py" serve "$actual_dir/README.md" --run "$actual_dir/.first-reader/run-01" --readers keen,skeptic --persona "$alder_checkout/personas/explainer-readme-122.md" --ready-file "$actual_dir/.first-reader/run-01/feed.json"
```

原dwell 0.08、26passage。通常sandboxではloopback listenerを作れず、許可されたsandbox外実行で起動・読者接続した。読者は専用feedのstart/next/quitのみで順送りし、各passageのmoment logとFINALを記録。退出や正の反応を強制していない。K/Sとも完読し、各27ログentryを保存した。

原recall.pyから各sessionのログと6問を出力し、先に公開commitへ保存してから別agentへ渡した。原signals.pyの出力も保存した。読書ログからの再構成であり、実際の翌日を待った人間記憶測定ではない。

```sh
python3 "$explainer_checkout/skills/first-reader/scripts/recall.py" "$actual_dir/evidence/first-reader/keen"
python3 "$explainer_checkout/skills/first-reader/scripts/recall.py" "$actual_dir/evidence/first-reader/skeptic"
python3 "$explainer_checkout/skills/first-reader/scripts/signals.py" "$actual_dir/README.md"
python3 "$explainer_checkout/skills/first-reader/scripts/room.py" "$actual_dir/evidence/first-reader" --out "$actual_dir/evidence/first-reader/room.html" --annotations "$actual_dir/evidence/first-reader/room-annotations.json"
```

原sessionの安全なコピー、transcript、recall-input/outputを[evidence/first-reader](evidence/first-reader)へ保存した。.first-reader作業状態やfeed.jsonは保存対象にしない。注釈の抜粋は原entryから採り、流し読みの日本語表現はflagsへ明示した。原roomの英語skimタグ判定は変更していない。

原skimは日本語段落の省略が弱い。signalsの英語word/sentence計数はCJK対応feedと異なり、信頼度や読む時間へ変換しない。注釈HTMLには一般向け原templateの表現が含まれるが、ここでのreaderはすべてAI代理である。

## 公開確認と評価

本文とchecksのhash、JSON構文、報告の相対リンク、公開対象にfeed tokenや未許可資料がないことを確認した。原stdoutに含まれる末尾空白は原出力として保持した。Cを観察後に改稿していない。

[結果](results.md)は予備A/Bとの情報差・条件差を分けて説明する。優位の因果効果は示さず、現行README置換と正式文書一般化は保留。追加C実行は終了し、部分検証と環境制約を含めPRレビューへ返す。
