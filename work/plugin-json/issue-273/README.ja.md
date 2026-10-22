# Gate B：PluginでJSONを直接作成・更新する

型付き単一JSONを直接草案・更新する候補Pluginを実装した。人間は業務の説明と変更判断を行い、AgentがID・版・参照の検査と保存を行う。Markdownを生成して変換する手順は直接草案の前提にしていない。正式採用・実配布は未実施であり、Chatレビューへ返す候補である。

## 基準と変更範囲

- Control: [root #144](https://github.com/mk3008/root/issues/144)、Execution: [Alder #273](https://github.com/mk3008/alder/issues/273)。root/Alderの最新AGENTS、Goal/Done、現行PluginのAuthoring/Review/Check、bundle/versioningの契約を確認した。
- Gate A: [PR #277](https://github.com/mk3008/alder/pull/277)の固定commit `98b95f69838cadde9db388da0875b8d588a09faa`、[成功CI #39732928772](https://github.com/mk3008/alder/actions/runs/39732928772)。このcommitから独立branch `feat/273-plugin-json`を作成した。
- canonicalソースを先にGitHubへ公開し、commit `57bd8235bcff6e0f95cb27f0411ceb3bd0f065cb`を読戻してからbundleを生成した。新Skillのprovenanceはこの完全SHAと19ファイルのdigestを持つ。
- Plugin候補版は`0.4.9`。現行公開版`0.4.8`のrelease/tag・インストール先は変更していない。保存SchemaはGate Aの候補`alder-document-package/0.1`をそのまま使用。Graph v1、Viewer、正式BD/Check、研究PR #269/#271/#277を変更していない。

## 目的との対応

| 依頼 | 実装と観測 | 証拠・限界 |
| --- | --- | --- |
| ヒアリングから直接JSON | 新Skill `alder-manage-json-documents`がSchemaに沿う候補を直接作成し、create/validate/inspectする | `inputs/notes.ja.md`→`snapshots/01-direct-bd.json`。別のFresh実行でも成立。業務意味の自動承認ではない |
| 追加・改名・内容更新 | 既存ID/所有元/原典IDを維持。変更文書とpackageだけ版を更新し、全体参照を検査 | `02-add-rename.json`、`04-final-after-replay.json`、authoring 12 tests。削除/ID置換は拒否 |
| Checkの人間ゲート | exact BD id/revisionの合意根拠を操作入力で要求。新規は未レビュー/要確認。意味変更は要確認、未解決の要修正は維持 | 合意なしCheckは停止。共有保証の変更でC02/C03を要確認、変更のないC01の確認済みを維持 |
| 共有保証・根拠・未決 | Checkから参照する一般保証/例の内容も期待hashへ含める。Findings、共有参照、根拠、Test証拠を保持して編集 | `test-authoring.mjs`とreplay。Schemaは業務上の完全性を証明しない。Skillの内容照合も必要 |
| 変換器をPluginから使用 | Gate AのNode/Pythonコードを相対importを保って同梱。明示convertで新JSONへ一方向出力 | repo外のPlugin-only copyでBD変換・検証と元MD不変を確認。未知Medium、Check原典不一致は拒否 |
| 保存・実行環境 | Node24で直接操作。Python3.12はMD変換だけに使用。temp/fsync/再検査/rename、専用lockとbyte hash/版CAS | 実測Node24.19.0/Python3.12.14。Pythonなしでも直接JSON経路可。全外部editorとの完全transactionではない |
| 既存MD経路 | 5つの関連Skillに形式分岐を追加し、MD手順を維持 | Plugin既存回帰94 tests。既存公開Pluginへの実配布・全Skillのホスト自動選択は未検証 |

Check操作の`bdConfirmations`/`humanDecisions`は一時的な操作根拠であり、保存Schemaの承認フィールドを増やしていない。引用の真正性はプログラムが認証できないため、Agentは実際の人間発言を根拠として使う。`basedOn.verification`は`unverified`のまま。人間状態と原典対応の機械検査を混同しない。

## 検証結果

| 検証 | 結果 | 記録 |
| --- | --- | --- |
| Gate A保存/変換 | 46 tests pass | `results/gate-a-tests.txt` |
| Gate B authoring/保存 | 12 tests pass | `results/author-tests.txt` |
| repo外Plugin-only配置 | 3 tests pass | `results/installed-tests.txt`、`tools/test_json_plugin.py` |
| exporter | 10 tests pass、19 bundle files再現一致 | `results/export-tests.txt`、provenance |
| 既存Plugin回帰 | 94 tests pass | `results/plugin-regression.txt`。上記exporter10件を含むため重複加算しない |
| 既存Graph | 52 tests pass | `results/graph-tests.txt` |
| Skill静的検証 | quick_validate pass、UIにliteral `$alder-manage-json-documents` | 新SkillのSKILL.md、agents/openai.yaml |
| 縦断replay | 24コマンドが期待どおり成功/拒否。最終27 entities valid | `replay.mjs`、`results/replay-results.json`、`snapshots/04-final-after-replay.json` |
| Fresh agent 1ケース | 直接草案・IDを保った改名・保存後検証が成立。Checkは人間合意不足で作成せず | `forward-test/`。初回iconエラーを修正して成功、失敗を含め記録 |

初回の既存Plugin回帰は、shallowな履歴に過去の参照commitがなく25 errorsとなった。CIと同じ原典履歴をfetchして再実行し94件pass。検査の削除・弱体化はしていない。

### AI実行とfixtureの区別

Codexが少数の固定ヒアリングから`01`を直接草案し、改名/追加の`02`、Checkの`03`を作った。これらの入力は人工例で、依頼者の実業務の承認ではない。`replay.mjs`は保存済み候補と明示した**模擬の人間発言**で保存器を再現実行するもので、独立LLM試験でも人間の承認証拠でもない。

Fresh実行は別historyなしのagentに、Plugin-only copyと合意を含まないinterviewだけを渡した。要求設定は`gpt-6-sol`/`medium`/`fork_turns:none`で、実効runtime設定の独立確認はできていない。完全promptは`forward-test/prompt.txt`、入力・最終JSON・実行結果は同ディレクトリ。初回validateは`Invalid icon`でexit2、修正後create/改名commit/最終validateはexit0（11 entities）。初回不正候補と独立したterminalログは保存されておらず、`result.json`のコマンド結果はagentの実tool traceを追加実行なしで確認・転記したもの。Checkを作らなかったことを未達ではなく合意ゲートの停止証拠として記録する。これは1ケースの観測であり成功率・業務妥当性の保証ではない。

JSONレビューはread-onlyをSkillで要求し、Checkは別工程で原典→保証/例・共有参照のConsistency reviewを行う。同じAgent文脈での確認は独立意味レビューと称さない。今回、実際の依頼者のBD合意からCheck確認までの本番対話・独立した業務意味レビューは行っていない。

## 再現方法

公開branchを取得し、Node24+/Python3.12+で次を実行する。外部LLM APIや追加支出は不要。

```sh
node --test tools/document_storage/test-storage.mjs tools/document_storage/test-authoring.mjs
python3 -m unittest tools/test_json_plugin.py tools/test_export_plugin_references.py
python3 tools/export_plugin_references.py --check --skill alder-manage-json-documents
python3 -m unittest tools/test_plugin_package.py tools/test_workflow_skills.py tools/test_plugin_release_workflow.py tools/test_export_plugin_references.py tools/test_plugin_references.py
python3 -m unittest discover -s tools/business_graph -p 'test_*.py'
```

Plugin-only検証はtest_json_plugin.pyが一時ディレクトリへPluginのみをcopyし、repo外cwd・空のPYTHONPATHから同梱CLIを実行する。replayは第1引数に同梱`scripts/document_storage`の絶対パス、第2引数に空の出力ディレクトリを指定する。保存済みreplay結果の`/tmp`は元実行の一時パスで、追試では指定先に置き換わる。

## 未対応と判断点

- 候補Pluginの**Agent上の隔離配置**とbundled runtimeは検証した。ChatGPTへ候補Pluginを登録・releaseしての実運用、ホストの自動Skill選択、全対応ホストのNode/Python有無は未検証。runtimeがなければ停止し、無断installを要求しない。
- 直接JSONのCheck編集は同一package内BDを要求する。過去BDの外部目録を参照する変換結果はGate Aのvalidatorで扱えるが、このauthoring経路での変更は別途設計が必要。
- 既存要素削除、ID/所有文書の移動、原典目録の書換え、format/schema移行は拒否する。表示名を変更してもIDは残るが、保証文の業務意味が変わったかは人間の判断が必要。
- BD更新がCheckのbasedOnを古くする場合、合意なしに追従せず候補で止める。適切な版への合意後、依存Checkを含めて検査・保存する。自動版履歴/バックアップUIは今回実装していない。
- 購買BD PR #254のMedium/SR Dependencies未対応、Check原典版不一致を黙って修復していない。旧MD全文/旧BD payloadを同梱せず、JSON→MD同期も行わない。
- 新Skillの必須読取りはlocal bundleで行える。旧authority内の既存outbound navigationまでの再帰閉包は検証していない。
- 概念モデル・状態遷移の未決Schema/業務意味、Viewer JSON対応は対象外。正式JSON v1採用、main merge、Plugin release、デプロイは実施していない。

Chatには、候補の保存・レビュー境界と実配布前の追加検証範囲を確認してもらう。Gate Cへ進む際はJSON正本のままViewerへ渡す縦断検証が残る。正式採否は別の人間判断である。
