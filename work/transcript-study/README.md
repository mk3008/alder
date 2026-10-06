# 発言録からBusiness Designの初回草案を起こす

[Execution #172](https://github.com/mk3008/alder/issues/172) · [Draft PR #173](https://github.com/mk3008/alder/pull/173)

## 結果

**この一件では、業務名や数を先に教えずに、発言録から主要な業務境界を持つ初回草案を作れた。ただし、発言にない記録先を補う誤りが残った。**

72発言の架空相談に、公開済みAlder 0.4.4の作成Skillを一度だけ使った。出力は11のActivityで、評価側の四つの主業務とは違う分解だったが、予約、準備・受渡し、返却受領・検収、料金確認の意味とつながりは概ね保持された。とくに次が発言に沿って残った。

- 店が返却を受け取ることと、倉庫が検収して再貸出し可能にすることの区別
- 同じ予約でも、検収済みの機材だけ料金計算へ進める部分完了
- 利用者が内訳を確認した分だけ経理へ請求依頼を渡す条件
- 「前日」から「前営業日」への訂正と、故障費用・代理受取り・取消メール時刻等の保留

別コンテキストの評価では、中核工程の丸ごとの欠落や重大な境界逆転は見つからなかった。一方、予約番号と請求先を「予約表に記録する」と断定した箇所は、必要な情報が語られたことから保存先まで補っている。発言録にはその保存先がない。通知範囲などの小さな補完、説明の配置や細部の省略も[評価報告](evaluation/report.md)で区別した。

保留事項の多くは、発言録ですでに「確認待ち」とされた内容を保持したもので、新しい要件不足を発見した実績とは分ける。

これは「人が発言と照合して直せる草案になった」という観測であり、業務承認済み・完全な仕様になったという結論ではない。未加工の草案は修正していない。質問への回答や二回目の草案化も行っていない。

## 何を使い、どう分けたか

- 入力はAIが一つの対話として作った架空相談。実在顧客の録音・逐語録ではない。運用を知る依頼者と、通常の力量を想定した設計者による相談とした。
- 話題の行き来、訂正、提案の不採用、受け入れられた言い換え、未決を保持した。Alderの欄や業務ごとに事前整理した入力ではない。
- 評価側は、完全な期待BDと118要素の観測可能性を出力前に固定した。未発言の設定は回収・質問義務から除外し、偶然言い当てても加点しない。
- 草案化は履歴forkなしの新規context。中立名の入力ディレクトリに発言録と標準Skillだけを置き、研究Issue、期待する業務数・名称、オラクルを参照対象にしなかった。
- OSで強制した隔離ではない。実行前の隔離CLI起動検査は失敗したため、native実行の明示的な読込制限とhelperのログを使った。記録された読込は許可入力だけだったが、他経路の不存在を証明するものではない。
- 初回草案、途中の返答二件、最終返答、参照申告と読込ログを別々に保存し、評価前にhash固定した。その後に別評価を行った。

役割・規模・題材はこの一回の実行上の仮定であり、依頼者や設計者の能力比較ではない。[実行前protocol](protocol.md)と[自然さの留保](preparation/realism-review.md)に詳細がある。

## 証跡の入口

| 確認したいこと | 原本 |
| --- | --- |
| 実際に投入した発言録 | [inputs/transcript.txt](inputs/transcript.txt) |
| 草案化へ渡した完全な依頼・アクセス案内 | [author-dispatch.txt](provenance/author-dispatch.txt) |
| 実行前の全ファイルhash | [input-freeze.json](provenance/input-freeze.json) |
| 使用Skill・標準資料のバイトと版 | [package](inputs/package/) / [package-manifest.json](provenance/package-manifest.json) |
| 未加工の初回草案 | [raw/draft.md](raw/draft.md) |
| 草案作成者の途中の返答と最終返答 | [progress](raw/author-progress-messages.txt) / [final](raw/author-final-reply.txt) |
| 出力固定の時刻・hash・指定設定 | [output-freeze.json](raw/output-freeze.json) |
| 実際のhelper読込と参照申告 | [reads.jsonl](raw/reads.jsonl) / [access-report.json](raw/access-report.json) |
| 評価側の完全な期待BD・発言との対応 | [expected-business-design.md](preparation/expected-business-design.md) / [observability.json](preparation/observability.json) |
| 評価側だけの設定 | [scenario.md](preparation/scenario.md) |
| 118要素の出力対応・根拠・判定 | [mapping.json](evaluation/mapping.json) / [report.md](evaluation/report.md) |
| 評価者へ渡したprompt・追加連絡・実効値の限界 | [evaluation/provenance.md](evaluation/provenance.md) |
| 凍結・参照先・項目対応の機械検証 | [verify_evidence.py](verify_evidence.py) / [integrity-check.json](provenance/integrity-check.json) |

元オラクルにも根拠を強めすぎた行が二つ見つかった。発言の方を優先し、元ファイルを上書きせず、評価で `oracle_error` として残している。評価表の行数には同じ意味の反復があるため、判定比率を精度や回収率として扱わない。

## 固定revisionと再確認

- 実行前の公開固定: [`3f4895a9a672ab74c887ae2841506b29a2b3bf53`](https://github.com/mk3008/alder/tree/3f4895a9a672ab74c887ae2841506b29a2b3bf53/work/transcript-study)
- 初回rawの公開固定: [`ccfced7780b9c67ad51efa1bc015889f573b9e2f`](https://github.com/mk3008/alder/tree/ccfced7780b9c67ad51efa1bc015889f573b9e2f/work/transcript-study/raw)。評価前のローカルhash固定の後、評価者の起動後に公開した。
- 対象release: [`plugin-v0.4.4`](https://github.com/mk3008/alder/releases/tag/plugin-v0.4.4)、commit `eb177dab8d30383f0a5e084ad22a8eca59455d27`
- Authoring資料のsource revision: `02093f4d4e957ae851f7812e958aab3827190f31`。構造資料のsource revision: `9cf192c5bced1eeb872795eec8ced21b7bcbf492`
- 証跡ブランチの起点はmain `9cd3d9a3de9a19973af32412e281841fab9f246c`。このmainを実行Skillとして使用したわけではない。

このディレクトリで `python verify_evidence.py` を実行すると、入力・出力のhash、発言番号、オラクルIDと評価の全対応、記録された読込を確認できる。意味の正しさは証明しない。再評価は発言録、raw、対応表を一緒に読み、必要なら元オラクルにも異議を示せる。

再実行する場合は、input配下の同一バイトとopen.pyを中立的な新規作業領域へ置き、オラクルを渡さず、保存したdispatchを同じ設定で新しいcontextへ渡す。絶対パスを変える場合はその差分を残す。これは第三者が行う再現手順であり、今回追加実行したという意味ではない。出力は確率的で、元の全ランタイム設定も独立証明されていないため、同じ結果を保証しない。

## 言えないことと終了範囲

この一回は比較的整ったAI対話である。実際の長時間相談、雑談、割込み、ASR誤りへの性能、実顧客での成功率、工数削減、手法やモデルの優劣は示さない。草案化と評価の指定はともに `gpt-6-sol / medium / fork none` で、実効model/reasoningはunknown。同系モデル・合成者の偏り、指示ベース隔離の限界も残る。

実施したのは入力準備、単一初回草案化、全BD要素の別評価、証跡の固定と振り返りまで。Skill変更、Check生成、記事の構成・執筆・公開、merge、releaseは行っていない。次の実験や草案修正をこの結果から自動的に始めることはしない。
