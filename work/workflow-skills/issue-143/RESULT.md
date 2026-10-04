# 不足するAlder workflow Skillsの実装・検証

## 結論

既存4 Skillsを保持し、6 Skillsを追加した。チェック項目の草案・レビュー結果反映を含む現行の公式AI workflowを、固定版の知識を同梱した自然言語の依頼へ接続した。[coverage](COVERAGE.md)に各workflowと除外理由を記録した。Plugin版は0.4.0。追加の明示承認により、最終検証後のmain mergeと固定tag/Release公開まで進める。公開の実行結果はPR #144 / Issue #143で確認する。

人間の業務判断・合意・候補採否・実装受入は残る。既存研究の採否やレビュー知識v0.3は変更しない。汎用drift parser、Code位置の恒久mapping、bulk pin承認を追加しない。

## 実行条件と安全な再現

- Skills/合成入力を実行前に公開commit `5ca4ae84f2d1266dac445fcec27cb7319562bc29`へ保存した。GitHub connectorで固定revisionのSkillを再取得し、第三者が取得可能な公開sourceとして確認した。
- Fresh実行はrepository AGENTS.mdに従い `gpt-6-sol` / `medium` / `fork_turns: none` を明示指定。toolはtask生成を確認したが、実効model/effortの独立attestationは提供しない。設定済みruntimeを独立検証したとは主張しない。
- ローカルsnapshotにGit metadataはない。評価者はその限界を記録した。[source identity](evidence/source-identity.json)はGitHubの固定commitにあるblob SHAとローカルbytesを53ファイルで照合した。機能条件Skillへの候補ID明記だけが評価後の変更として記録される。
- 入力は公開する合成備品貸出例のみ。個人・顧客・秘密情報は含めない。公開する実験用依頼と業務生成物を安全確認し、[evidence](evidence/)へ保存した。非公開の割当全文・実行調整は掲載せず、絶対checkout/output pathは中立化した。公開記録はprivate orchestrationの完全transcriptではないが、業務応答の意味・公開input・要求設定・検証条件は保持する。

## 観測結果

| 評価 | 観測 | 限界 |
| --- | --- | --- |
| 独立初稿生成 | 全10項目を未レビューとし、貸出・拒否/保持・返却・次の貸出を区別。対象外予約を要件化せず、対象なしの未記載期待結果を補わない | 合成1例。網羅性・最適粒度・実務効果を証明しない |
| Check更新 | CK-02の指定タイトルだけを変更。CK-03の点検待ち案は現行意味と衝突するため要確認、Business Design差戻し | 変更/未決の1例 |
| Evidence follow-up | CK-02のassertion対応を追加し、CK-01/03の根拠不足を確認状態と分離。Test実行合格を捏造しない | 静的assertion読取のみ。製品Test実行は未実施 |
| frontmatter routing | 15依頼で既存/新規Skillを区別。任意driftは入力互換性を確認、一般JSON整形は対象外 | Fresh agentへcatalogを明示した選択。インストール済みclient routingではない |
| 構造・機能探索 | 前者はProblem/Painを断定せず構造上の問い、後者は既決の不存在と対象外予約を閉じ、条件付き途中失敗論点を未承認で提示 | 同一合成例、効果や発見率は未証明 |
| Graph失敗 | 公式同梱CLIが不足Scope/Iconをexit2で拒否、入力編集も架空JSONもなし | Python利用可能なこの実行環境のみ |
| package独立review | blockingなし。候補ID明示の軽微指摘を反映。follow-upの実装修正は明示scopeがある場合に保持されると確認 | 評価後はID明記とREADME最小修正のみ。全client保証ではない |

証跡:
- [独立初稿](evidence/initial-check-draft-raw.md)
- [Check更新/follow-up](evidence/check-followup-raw.md)
- [routing/構造探索/機能探索/Graph失敗](evidence/routing-discovery-raw.md)
- [独立package review](evidence/package-review.md)
- [決定的tool検証](evidence/tool-validation.md)

最初のCheck評価runは初期読取で他のraw fixturesも見たため、Case Aを入力隔離の根拠から除外した。証跡を修正・隠蔽せず限界を記し、別Fresh agentでBusiness Designと選択Skillだけを許可した上記独立初稿を再実行した。Case B/Cの観測はそのまま限定証拠として残す。

## 決定的検証

- `python -m unittest tools.test_plugin_package tools.test_workflow_skills -q`: 10/10。
- `python -m unittest discover -s tools/business_graph -p 'test_*.py' -q`: 44/44。
- `python -m unittest discover -s work/traceability-drift -p 'test_*.py' -q`: 12/12。
- `python work/traceability-drift/evaluate.py --output /tmp/alder-final-drift-observations.json`: 26 scenarios passed。
- 全10 Skillsのquick_validate成功。bundle/reference/script bytes、hash、versionを確認。
- 同梱CLI: 正常exportの原本/fixture一致、invalid input時のoutput保持、source上書き拒否、実runner discoveryで得た3 Test IDsを使うdrift検出と全input不変を確認。
- 検証中にevaluatorへ未対応の`--check`を渡した呼出しはexit2で失敗した。上記の正式`--output`へ訂正して26件を再実行済み。失敗した呼出しを成功に含めない。

これらの静的/CLIテストは自然言語client routingを証明しない。実クライアントrouting・script実行は未検証で、登録済みPluginの更新も未実施。

## READMEと統合

英日READMEは現行mainの構造を保ち、0.4.0の提供範囲・Check/follow-up操作例だけを修正した。見出し順、既存サンプルは維持する。導入例は今回公開する固定tag plugin-v0.4.0へ更新し、旧0.2.8で確認したclient挙動と0.4.0の未検証client挙動を区別する。本文に研究手順・評価者への指示を混入しない清書ゲートを確認した。

別PR #141は未変更。[統合手順と固定head向けpatch](INTEGRATION.md)は、同PRの四段階・図・差戻し・人間確認を保ちながら旧手動案内を置換する候補である。どちらを先にmergeしても文書/版/provenanceのcontent conflictを確認する必要がある。この文書の保存時点ではmain統合とreleaseは実行前。追加の明示承認により最終検証後に進める。ユーザーaccountのPlugin自動更新は行わない。

## 振り返り

workflowが文書化されていてもSkill提供範囲から抜け落ち得る。今回のcoverage表と実装先の照合を維持し、内部知識を利用者に手渡しさせる導線を必要なものと誤認しない。全作業の自動化へ広げず、人間判断・隣接開発・未採用研究を明示分離した。新たな業務policyや汎用global ruleは追加しない。

## 公開前の統合差分

PR141から既に依頼されていたadoptionのPlugin/manual分離だけを取り込み、公開source `0c78a4d1c937174fb52d0668abc85ff0534f80c4`へ保存した。標準配置でAGENTS router/知識コピー不要、manual側だけ読める固定知識を渡す、Business Design→Decision→implementationの読順を維持する。旧0.3.3版差分やREADME再構成は取り込まない。影響するauthoring/Check/follow-upの同梱bytes/provenanceをこのsourceへ再同期した。業務意味、Check状態、Test境界は変更しない。

既存Plugin release workflowを限定的に更新し、PRではread-only検証のみ、mainで0.4.0を検証して固定tagとReleaseを単一API呼出しで作る。既存tagは動かさず、異なるrevisionなら停止する。Alder method v0.7やPR142研究は公開しない。

公開workflowの追加検証: package/CLI/release-workflow unittest計12件が成功。mock GitHub APIで新規作成、既存Release保持、別revision tag拒否、同revision tag、annotated tag解決、版不一致拒否、API失敗、既存releaseのtag/公開状態不整合を含む10状態を検査。PRはreleaseを実行せず、mainのvalidate成功にのみ依存する。GitHub本番公開の成功は後続runで別途検証する。

[隔離CLI install smoke](evidence/cli-install-smoke.md)も成功。Codex CLI0.159.2のlocal marketplaceから0.4.0を一時cacheへインストールし、10 Skills/44 files一致とcached exporterを確認。ユーザーのaccount/desktop設定は変更していない。GitHub tag取得・desktop/chat routing・agentによるscript選択実行の証拠とは区別する。
