# RDRAAgent 0.8とAlderの比較準備

2026-10-02 / Execution Issue: [#133](https://github.com/mk3008/alder/issues/133)

**初回Primary run前の記録。比較結果・scoreはまだない。** この記録は配布物の取得確認、実行前点検と、第三者が点検できる試験材料を保存する。正式Alder仕様は変更しない。

## 取得と起動確認

- 公式ページからRDRAAgent_v0.8.zipを取得した。archive SHA-256は `528b17deb76ac70050620b82118a6140f070f9e7b6282fc8b26d2a43420e074b`。取得先・全ファイルのhashは `source-manifest.json` に記録した。
- Alder比較対象は `eb591bfbc1b077b0e93d62253cb1e7f3e392e462`。Plugin 0.2.8のAuthoring Skill、同梱参照、provenanceをpinする。provenance内のauthoring source revisionは `e9726b4c84608db42c5286d072b5ec762d31596a`。
- 公式Web説明はClaude Haiku 4.5をPrompt構築の基準としている。しかし取得ZIPの `モデル設定.json` は `default.provider=cursor`、`model=gemini-3-flash`。Webの説明と配布物の実値を区別する。
- Node v24.19.0は利用可能。`agent` / `claude` / `codex` はPATH上に存在しない。
- 未改変の配布物で `node RDRA_Knowledge/helper_tools/parallelRun/dag-runner.js --menu7` を実行すると、最初のPhase1呼出しで `write EPIPE`、exit 1となった。生成された業務成果物は0件。サンプル初期要望で行った起動点検であり、C1–C4のbenchmark runではない。
- CLI不在とEPIPEを観測した。認証・モデルアクセスの疎通には到達しておらず、それらが使用可能とは主張しない。

## 試験材料の状態

後続の[PROTOCOL.md](PROTOCOL.md)で、5ケースとPrimary条件を最終固定した。旧preflight候補の内容は以下に履歴として残す。`cases.json` は最終版の同一入力・固定回答・oracleを収める。`rubric.md` は採点候補、`run-manifest-template.json` は各runの記録様式、`downstream-prompt.txt` は中立probeの候補である。生成結果を見てから材料を変えていない。

**材料候補の保存と実行protocolの最終freezeは別である。** 次の未解決事項を確定してから、変更履歴を残して最終freeze commitを公開し、初回runを行う。

1. 同一モデル・effortを使えるCLIまたは同等の隔離された実行経路を確保する。Fresh reviewのRepository既定値 `gpt-6-sol / medium / fork_turns:none` を予定値に置くが、benchmarkで実際に使用したモデルはまだない。実効設定を独立に確認できない場合はその限界を書く。
2. RDRAZeroOneの18本の公式生成Promptには「質問や確認は不要」が含まれる。質問coverageは公式生成経路の観測値として報告し、対話能力全般の優劣と解釈しない。QA Skillによる追加対話を比較するなら別armとして事前登録し、原armへ混ぜない。
3. Stage2は新しい実行ディレクトリ・Fresh contextを使用し、Stage1成果物と同一回答packetを渡す。既存成果物を置くとDAGが生成をskipし得るため、公式Promptを改変せず両者を読ませる入力配置と更新操作を、出力を見ないrouting点検で先に固定する。Stage1出力を渡さない再生成へ勝手に置き換えない。
4. C1の「3日未満/7日未満」はIssueの記述に基づく。取得した通常ZIPの図書館初期要望と生成例ZIPでは、この文字列の出典を確認できなかった。現段階ではC1を**合成fixture候補**と明記する。歴史的公開例との対応が必要なら、その出典を別途確認してからfreezeする。
5. oracleと回答packetは同じRepositoryに保存するが、generatorから物理的に分離した入力だけを用意する。アクセス可能な全Repositoryを渡し「読まないで」と言うだけでは隔離を保証しない。

## 第三者が確認できること

公式ZIPを再取得しarchive/file hashを照合できる。hashが違う場合は同じ0.8表記でも別配布物として停止する。公式配布物のコピーはこのPRへ再配布せず、取得先とhashを保存する。

fixtures、固定回答、oracle、採点定義、予定metadata、起動失敗logをこのcommitで閲覧できる。実測raw・scoreはまだ存在しないので、差別化、同等性、勝敗、停止性を結論できない。後続実測ではrawから第三者が再採点できる行番号付き根拠、盲検ID対応表、全失敗runも保存する。

## 再開条件

実行経路と上記protocol上の未決を解消し、最終freeze SHAを公開する。4 cases × 2 arms × 2 replicatesの16 Stage1 run、対応する16 Fresh Stage2 run、16 Fresh probeを行う。RDRAの各DAG node呼出しも個別にmodel・prompt・read-log・rawを記録し、16 runを16 model callと誤記しない。

Secondary/native comparisonはPrimaryと別集計にする。取得ZIPの既定Cursor/GeminiとWebで説明されるClaude/Haikuのどちらをnativeとするかも事前に明示する。CLIのインストール、外部認証、費用の発生をこの起動点検では行っていない。

## 07:32 UTCレビュー後の決定

同一モデルPrimaryはWork Fresh agentsへのAI呼出し置換で再開する。Stage2はresolved sourceから両armをFresh再生成する。C1はtango238/rdraのpinned公開sampleを照合済み、C5を追加した。旧READMEの未決・16 run計画は履歴であり、現在の固定条件はPROTOCOL.md・cases.json・20 run計画を優先する。Nativeは未実施。
