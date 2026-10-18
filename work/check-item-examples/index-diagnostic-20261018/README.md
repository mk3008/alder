# Activity索引を起点にする名前診断とSkill実行記録

2026-10-18。PR #235の診断器偽陽性への対応。Draftのまま最終レビューへ返し、マージ・tag・releaseは行わない。

## 診断器の変更と正例・反例

旧診断はすべてのH2をActivity名と比較し、正常な説明節もNGにした。修正は四列Activity索引のリンクから対象H2を解決する。通常の見出しfragmentと、H2直前の明示的`<a id="..."></a>`を扱い、リンク表示名・解決先の生見出し・原典宣言名を比較する。説明見出しの許可リストは使わない。宣言名と異なる索引順も許し、索引と対象Activity節の順序を照合する。

| 検査 | 結果 |
| --- | --- |
| mainの購買Check見本（説明H2「業務一覧」「使い方」あり） | 修正前mismatch（H2 6件）、修正後match（対象Activity 4件） |
| 依頼者の承認済み見本（説明H2がさらに1件） | 原文を非公開のままローカル検査。修正前mismatch（H2 7件）、修正後match（対象Activity 4件） |
| 任意の説明H2・自然fragment・percent encoded fragment | 正常。説明の具体的な名前に依存しない |
| 原典名自体にある`Activity`、原典と異なる正当なnavigation順 | 正常。名前を正規化せず、原典の宣言順も強制しない |
| 誤名称、余分な`Activity `接頭辞、重複、欠落、索引と本文の名称不一致 | mismatch |
| 存在しない遷移先、同じ遷移先の再利用、H3への誤遷移、重複anchorによる曖昧な遷移先、索引/本文の順序差 | mismatch |
| 索引なし、複数の対象索引、原典宣言不明、外部/別ファイルへのActivityリンク | not-verified。合格にしない |

[両正例の修正前結果・同梱CLIのstdout/exit](diagnostic-results.json)も保存した。

正例のpublic原典はmain `fb13c2fbc0f1bf0d702a4b4bccd3de303c80d7f2` の[購買Check見本](https://github.com/mk3008/alder/blob/fb13c2fbc0f1bf0d702a4b4bccd3de303c80d7f2/docs/examples/purchase-check-review.ja.md)。SHA-256は`d2ad07f06cdef93537f6b8b5cca32a5f0f9ebad49ea4ba3f3ffcb1b407cfff55`で、このPRの既存文書とbyte一致するため複製fixtureは追加していない。承認済み見本はSHA-256 `06ed28580299d119d824f725929080c4d1e4bf224f8f989afa984c116f4b1e72`を実際に検査した。原文は公開しない。CIではpublic見本に任意の説明H2を加える構造的な正例も検査し、非公開原文の実行と区別する。

診断は狭いMarkdown profileの補助である。四列セルのescaped pipe/multiline、別形式の索引や高度なMarkdown/HTMLは未対応。未対応を合格とせず、必要なら原典との手動照合・検査限界を報告する。未参照でも宣言Activity名と同じH2（およびその余分な接頭辞付き）は、重複/未参照のActivity候補として検査する。任意の未参照H2の業務上の意味、共有Checkの要否、式・例の一般性、人間状態、テスト対応を診断器が保証するわけではない。

canonical source `0a050bc442788cee8310256bee20f1e776614f63`を公開・取得確認後、公式exporterで既存Check Skillのscript/provenanceを同期した。bundle `be7fffb67e7e9052b5718d1d7f0a86ccdad2b453`を公開・取得確認してから下記の追加実行を始めた。Skill本文と業務規約は変更していない。他Skillの同一guidanceを不要に再同期していない。

```sh
python3 -m unittest tools/test_plugin_package.py tools/test_workflow_skills.py tools/test_plugin_release_workflow.py tools/test_export_plugin_references.py tools/test_plugin_references.py
python3 tools/export_plugin_references.py --check --skill alder-draft-check-items
```

sourceだけを先に公開した中間commit0a050bc4の [Package CI](https://github.com/mk3008/alder/actions/runs/39127515112) / [release validation](https://github.com/mk3008/alder/actions/runs/39127515119) はfailureだった。この時点のcanonical scriptと同梱scriptは未同期。公式export後bundlebe7fffb6では [Package CI](https://github.com/mk3008/alder/actions/runs/39127596804) / [release validation](https://github.com/mk3008/alder/actions/runs/39127596815) が成功した。中間版を配布可能な完成版とは扱わない。

89 tests OK、6 exported filesの再現一致。診断テストは既存の3件を具体的な索引/遷移先つきに更新し、正例と反例を追加して8件。従来の接頭辞、未対応、コード例の無視、repositoryなしでの単独実行の検査を残した。既存の他のテストは変更していない。既存の最終サンプル4件（初稿・購買更新・別BD・旧不良例修復）は新診断でもmatchである。CIはPRの最終Checkpointで同headを照合する。

## 既存サンプルから一連の処理をたどる

既存raw/reportは過去の証拠として書き換えない。初稿の流れは次の直接リンクで確認できる。

| 工程 | 証拠 | 実行版・担当の区別 |
| --- | --- | --- |
| 入力BD | [購買BD](../../../business-design/purchase-request/README.md) | 公開bundle8853a631の全体入力。生成担当へ完成見本を渡していない |
| Skillによる一次生成 | [initial-raw.md](../quality-loop/initial-raw.md) | bundle8853a631、別contextの作者 |
| 作者による点検記録 | [初稿report・作者の全範囲チェック](../quality-loop/initial-report.md#著者の最終全範囲チェックと停止点) | 作者点検の報告。後述の別context読取と区別。全段階の独立した自己点検ログが保存されたという意味ではない |
| 別読取Consistency review | [初回所見](../quality-loop/initial-report.md#初回読取専用レビュー全文) | bundle8853a631、Fresh reader。読取専用で修復しない |
| 指摘・作者修復 | [判断](../quality-loop/initial-report.md#修復判断) → [initial-repaired.md](../quality-loop/initial-repaired.md) | 作者が原典で検証して共有導線を修復 |
| 保存後の再レビュー | [再レビュー](../quality-loop/initial-report.md#再レビュー全文)、[追加の粒度修復](../quality-loop/initial-report.md#粒度修復と再レビュー)、[最終再レビュー](../quality-loop/initial-report.md#最終再レビュー報告全文) | 最終検証からbundlebe8d23aa。統括が追加点検し、作者が粒度を修復。同じreaderの継続再読取 |
| 最終Markdown | [initial-final.md](../quality-loop/initial-final.md) | 14項目。[独立最終再評価](../quality-loop/final-reassessment.md)はbundle01278802入力で実施 |

他の既存例も重複せず維持する：[購買更新6件](../quality-loop/update-candidate-3.md)と[report](../quality-loop/update-report.md)、[別BD更新4件](../quality-loop/regression-repair-1.md)と[report](../quality-loop/regression-report.md)、[旧不良例修復19件](../quality-loop/original-granular.md)と[report](../quality-loop/original-repair-report.md)。最終サンプルの診断用bundleは後から切り替わっており、これらを「最終版Skillへの一回依頼で完全自律成功」とはしない。元の[比較と介入・失敗の記録](../quality-loop/RESULT.md)も残す。

## 修正後の最終版での最小通し実行

既存証拠は版が途中で変わっているため、この不足に限り、既存の相談受付BD・旧4 IDの更新を1例だけ追加する。原典・旧Check・Skillを固定したbundlebe7fffb6で、一次生成、作者点検、別context読取、必要な修復、保存後の再レビューまで同じ版を使う。期待する指摘や正解見本は与えない。意図的な不良生成を仕込まず、実際に見つかった修正だけ行い、何もなければその事実を記録する。[実行記録](run/execution-record.md)に全prompt・版・担当・判断・限界、[manifest](manifest.json)に入力/出力hashを保存した。

| 工程 | 直接たどるファイル | 担当・結果 |
| --- | --- | --- |
| 原文 | [BD](../fixtures/README.md) / [旧Checkと実際のフィードバック](../fixtures/checks.md) | 同じbundleの公開入力。正解見本は渡していない |
| 一次生成 | [candidate01](run/checks-candidate-01.md) | 作者context。点検前のrawを別保存 |
| 作者点検 | [author-check01](run/author-check-01.md) | 初回は修復不要と判断。後続の指摘で一部を見直した |
| 別読取Consistency review | [prompt01](run/reader-prompt-01.txt) / [所見01](run/reader-report-01.md) | Fresh reader、編集禁止。初回のみ履歴なし、その後は同readerの継続再読取 |
| 作者修復と再読取 | [判断01](run/disposition-01.md) → [candidate02](run/checks-candidate-02.md) → [所見02](run/reader-report-02.md) → [candidate03](run/checks-candidate-03.md) → [所見03](run/reader-report-03.md) | 作者が修復、readerが実際に保存版を再読 |
| 統括の追加点検・復元 | [指摘と採否](run/root-intervention-and-disposition.md) → [candidate04](run/checks-candidate-04.md) | 過剰指摘を撤回し、修復中に狭めたC-03のTest方法の未決を復元 |
| 最終再レビュー | [prompt04](run/reader-prompt-04.txt) / [所見04](run/reader-report-04-corrected.md) | 保存版の全4 ID/一般保証/未決/参照/状態/補足を再読。対象表示範囲に根拠付きNGなし |
| 最終Markdown | [checks-final.md](run/checks-final.md) | 実際に再読したcandidate04とbyte一致。名前診断exit 0、全4 ID/状態を保持 |

全工程のSkill/bundleはbe7fffb6、authority0a050bc4で固定し、途中で切り替えていない。本Workの統括が作者を明示起動し、作者が許可されたFresh reader（gpt-6-sol/medium/fork none要求）を明示起動した。実効runtimeの独立証明や実クライアントの自動routingを確認したわけではない。

この実行でも、readerは受付という行為を成功前提と過剰に判定し、C-03の既存Test方法の未決と原典の自動理解判定を混同した。作者の修復で旧補足が狭まり、統括が原典と旧リストで再点検して復元を指示した。初回の2回上限に対し、この具体的な保持欠陥の修復/再読取を1回だけ明示追加した。過去の判断や出力を消さず、最終版Skillなら一回依頼で完全自律成功とはしない。

C-01確認済み・C-02要確認/保留済み・C-03未レビュー・C-04要修正と、既存Test名/未実行の証拠を保持した。旧リストにない原典の「担当者が相談対応の対象として扱える」は別のcoverage検討事項として報告し、限定更新へ勝手に追加していない。未決の応答・記録・再申請・希望日変更を確定していない。

rawは実行時の表記のまま保存している。raw内のsandbox/一時相対パスが公開先で解決しない場合は、この表の公開入力/保存版リンクを用いる。reader04の引用内SHA-256転記誤りは原文を残した別の訂正記録に注記し、実ファイルとmanifestのhashを正とする。

## 依存PRへの引き継ぎと最終判断

PR #240は本作業で変更していない。2026-10-18のmetadata再取得では、依存PRのbase記録は旧7ff23617、head94795a8a、Draft/Openであった。#235修正後の#240側の再統合・診断器差分と回帰の確認は、そのPR側で必要となる。二視点や他課題の実装をここへ取り込まない。

本作業は診断器の偽陽性と証拠導線の修正であり、業務意味・既存レビュー状態の変更や、一般的な自律生成精度の実証ではない。merge/releaseは最終レビュー・必要な本人承認の対象であり、今回行わない。
