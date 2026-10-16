# Check生成後の検出・修復の検証

2026-10-16。PR #235の継続検証。最終採用・マージ・リリースは未承認。旧raw・失敗結果を保持し、生成結果を統括/評価担当が手直しして成功扱いにはしていない。

既存規則に反する元の16 ID出力は、共有導線・一般値の保持・表示名を生成担当が修復した。別に、見本を与えない新規初稿・限定6件更新・相談受付4件更新を既存Skillで実行した。**最終独立評価と元出力の修復後読取は進行中。** 以下はその前の比較記録であり、完了・採用判定ではない。

## 見逃しの調査と方式比較

既存Skill/guidanceは、宣言ActivityName、関連する索引行とActivity節の共有参照、一般保証とサンプルの分離を既に規定していた。旧著者報告の点検はID/状態/本文数、既存リンクの解決などに偏り、必要なのに存在しない参照、主条件と例値の適用範囲、表示文字列の一致を実際に比較できていなかった。「確認した」という文章と、実施証拠のある照合を区別する必要があった。モデル内部の原因は特定していない。

同一の不良出力・公開入力を使った適応的な小規模比較である。統括は既知欠陥を知り、読取担当へ完成見本・既知ID/値・期待指摘は渡さない。後半の検査観点は既知クラスを踏まえて設計しているため、完全盲検や一般的検出率の測定ではない。[事前条件と追補](protocol.md)、各rawの全文promptを参照。

| 方法 | 共有参照漏れ | 主条件の例値限定（理由/金額） | H2接頭辞 | 観察 |
| --- | --- | --- | --- | --- |
| A 作者contextの明示Consistency review | 未検出 | 両方未検出 | 未検出 | [raw](review-a-author.md)。独立化前の比較 |
| B 別Freshの同じ通常レビュー | 未検出 | 両方未検出 | 未検出 | [raw](review-b-fresh.md)。context分離だけでは足りない |
| C 原典起点の2パス | 検出 | 両方検出 | 最初未検出 | [rawと訂正](review-c-source-led.md)。共有の過剰指摘を、単なる前段依存と区別して撤回 |
| C追補 raw名の逐語抽出 | 維持 | 維持 | 検出 | 語を除去しない実比較で初めて検出。新規Freshではない |
| D 逐語比較指示を含む公開Skill | 検出 | 両方検出 | 未検出 | [raw](detection-d.md)。実際にはH2 suffixだけを比較。指示追記だけでは安定しない |
| E 読取専用診断を同梱した公開Skill | 検出 | 両方検出 | 検出（exit 1） | [raw](detection-e.md)。PR-02の仮識別子について追加指摘があり、妥当性は別途判定 |

方法は既存のConsistency review-onlyを別の読取工程にし、原典→表示/共有経路、原典の一般入力→結果と主欄/例を比較する。作者は原典で指摘を検証し、裏付けのある修復のみ行って保存後に再読取する。未決業務や不支持の指摘を自動で政策/人間状態へ昇格させない。名前だけは小さな実行可能診断を同梱した。新しいSkill、DSL、必須の中間成果物、業務意味の変更はない。

診断は明示`# Activity ActivityName`宣言と四列索引・H2 ActivityのMarkdownに限定した文字列抽出である。alias、別形式、共有リンク、入力値の意味、Test対応、状態の妥当性を判定しない。実行不能・対応外を成功にせず、原典との逐語比較または検証限界を報告する。0終了は全体品質の合格ではない。

## 生成・修復の実行

| 対象 | 一次出力→保存版 | 読取による検出と処置 |
| --- | --- | --- |
| 元の不良16 ID | 旧[runs/candidate-v3-initial.md](../runs/candidate-v3-initial.md)→[original-repaired.md](original-repaired.md) | 実際の人間フィードバックを元作者contextへ渡し、名前/リンク・理由/金額を一般形へ修復。16 IDと状態を維持。読取再レビュー中 |
| 新規初稿 | [initial-raw.md](initial-raw.md)→[initial-repaired.md](initial-repaired.md)→[initial-granular.md](initial-granular.md)→[initial-final.md](initial-final.md) | readerが共有導線を検出。統括の追加点検が複合結果の粒度を指摘し、14 IDへ保証を保存して分離。分離で生じた成功先取り条件をreaderが検出し作者が修復。最終readerはNGなしと報告 |
| 限定購買更新 | 原典snapshot [update-raw.md](update-raw.md)→[candidate1](update-candidate-1.md)→[candidate2](update-candidate-2.md)→[candidate3](update-candidate-3.md) | readerが状態のみの旧4項目への別保証の追加を検出。作者が限定範囲へ修復。名前診断がActivity以外の余分なH2を検出し、作者が見出し/リンクを修復。最終readerはNGなしと報告 |
| 小規模相談受付更新 | [regression-raw.md](regression-raw.md)→[regression-repair-1.md](regression-repair-1.md) | readerがC-04の受付後という時点欠落を検出し作者が修復。最終readerは表示NGなしと報告 |

完全prompt・readerの所見・採否・実行と限界は[初稿](initial-report.md)、[更新](update-report.md)、[相談受付](regression-report.md)、[元出力修復](original-repair-report.md)に残す。rawと修復は別ファイル。修復者は各生成担当で、統括は生成結果を編集していない。

原典の金額別承認は未決・今回対象外という注記を残し、新初稿では独立候補を生成していない。既存更新Q01と元16件中の未決IDは維持。readerは「範囲注記は独立候補ではない」と判定した。この処置と採用済み書式との整合は最終評価で確認する。通常保証まで要確認へ一括変更せず、欠落時応答・値域・差額の扱いを創作しない。

相談受付はAND、両立可能OR、否定、同じ暦の日付差0–30日両端、31日/停止中等の未決、表に強制しない説明文を保持。C-01確認済み、C-02要確認/保留済みで再質問しない、C-03未レビュー、C-04要修正と既存Test名/結果未収集を維持した。旧リストの限定範囲にない「相談対応の対象として扱える」は勝手に追加せず、残存する原典coverage gapとして区別した。

## 再現・逸脱・限界

公開入力/出力hashは[manifest](manifest.json)。公開canonical a4642727→bundle8853a631を取得確認してから生成開始。診断source0986ae5c→bundlebe8d23aaも公開取得確認後に適用。公式exporterで4 Skillの参照を同期。初稿/更新/回帰の一次生成は8853版であり、be8d版は最終検証から適用した。最新版から最初の生成をしたという比較ではない。

AGENTS指定のFreshはgpt-6-sol/medium/fork none要求。実効runtimeは独立に証明していない。元出力の修復とAは作者context継続、C追補と再レビューは同じ読取context継続である。隔離はpacket/禁止指示で、OS制御ではない。生成者に完成見本を与えていない。外部rendering、インストール先の自動routing、テストと業務意味の人間合意、完全網羅、誤読率/時間改善、一般的な自律生成成功率は未検証。

更新担当は出力用ファイルのほかpacket内の入力を上書きし、読取専用packetの指示に違反した。上書き前のsnapshotが公開原典とbyte一致することを統括が確認し、元入力へ復旧。各reviewはsnapshotをbaselineに用い、保存されたcandidate3を最終出力にする。中途で作ったv2packetの例はcandidate2だったため公開原典へ復旧し、これを新しい元入力として使用したrunはない。この逸脱を隠して完全なimmutable隔離とは主張しない。

原則2回の修復という比較方針に対し、新初稿は統括追加指摘とその修復で生じた新NGを直すため3回になった。途中結果を捨てず保持し、統括介入を独立readerの自動検出成功へ数えない。注意文/別contextだけで安定するとは示せず、意味比較の見逃し・誤検出は依然残る。

関連テストは[記録](tests.md)。既存テストは弱めていない。最終CI・採否は独立評価後に追記する。マージ・tag・dispatch・releaseは実施しない。
