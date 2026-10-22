# 整形済み単一JSON Phase 2

## 今回の修正と結論

本人の2026-10-22の追加判断に従い、JSON内の旧Markdown全文を削除した。型付きの現在BDとCheckを`documents`に保持し、旧BDの本文・Object・関係・Findingsは同梱しない。旧MDは検証用の別ファイル`inputs/*.md`として保持する。Why・Procedure・共通保証など現在の業務情報として必要な文章は残した。

保存契約は実験用`formatVersion: 0.3-poc`へ更新した。正式採用ではない。旧`0.2-poc`のJSONはこのreaderでは明示拒否する。製品の旧Markdown読込とBusiness Graph v1は維持している。

[前回head b9c5d7e4](https://github.com/mk3008/alder/commit/b9c5d7e4a738bfa4b363fa4246129abef76a99b6)との機械照合により、現在BD・CheckのpayloadとbasedOnが完全一致することを確認した。[修正証拠](results/archive-removal.json)。代表fixtureは153,435→82,613 bytes、70,822 bytes（約46.2%）減った。1,000 Activity合成入力は4,960,149→4,889,327 bytesであり、大容量入力の読込・表示の安全策は引き続き必要である。

## 原典と保持範囲

| 入力 | 固定原典と扱い |
| --- | --- |
| 現在の購買BD | PR #254 `6e55d98710a1d8757937ea268176929abcf49b2e`。7 Object、5 Activity、4 Findings。未合意の草案 |
| Checkの旧BD snapshot | Plugin 0.4.8 `9b4a3cbffe835cfa9c6a8ec7d602d9611a1a0285`。本文は別MD、JSON内は参照目録のみ |
| Check見本 | 同tagの`meaning-validation-20261018/purchase/final.md`。6 Check、4共通保証、4比較表。主張する原典`c2852531…`とsnapshotの意味対応は未確認 |

Phase 1 PR #269の固定headは`a2e841d049fa45a795e99b16ff4a053805474180`。原典hashは`inputs/manifest.json`、仕様確認の証拠は`results/authority.json`・`results/capacity-audit.json`にある。今回もroot/Alder両AGENTSとIssueのGoal/Doneを確認し、既存製品や別モデル研究へ変更を広げていない。

| 部分 | JSON内の保持 | 検査・限界 |
| --- | --- | --- |
| 現在BD | 型付きActivity 5W1H/Procedure/Exception/Result、Object情報、ID参照の関係、Findings | Medium/SR Dependenciesは草案注記。Graph v1へ追加しない |
| Check | ID・人間レビュー状態・条件/期待結果/保証/根拠/導出/関連/証拠、共通保証、比較表、rich参照 | JA-EX-04は単一本文を2業務から参照。5件未レビュー・1件要確認・Test証拠未収集を保持 |
| 原典証拠 | `sources[]`: documentId・revision・sha256のみ | 本文なし。実際のhash照合には別の原典ファイルが必要 |
| 旧BD参照 | `externalDocuments[]`: id・kind・revision、Activityのid/nameのみ | Checkの業務一覧・見出し・fragment解決の表示名とIDに限定。旧BDの業務条件を正しいと認定しない |
| 元Markdown全文 | JSONへ同梱しない。`archives`フィールド自体を拒否 | `inputs/*.md`を別ファイルで保存。新JSON単独から原典MD全文を復元する方式は採用しない |

旧BDを型付き文書として同梱する候補は、今回の目的に不要なため取り下げた。Checkは依然として旧BDのID・snapshot版を参照し、`sourceClaimRevision`と`verification: unverified`を保持する。現在BDへ付け替えたり、合意済みに変更したりしていない。参照目録は業務文書として表示・編集できず、検証用メタデータである。

文字列中のMarkdownや自由記述は残る。文章を形式言語へ変換したものではない。未知のMD欄を黙って捨てる汎用移行は実装しておらず、固定原典以外は停止・診断して原本を別に保持する。

## ID・参照・版

初回UUIDと既存Check IDは保持する。`identity-map.json`は固定import対応表であり、改名後の名前から再生成する規則ではない。異なる原典hashでの再importは停止する。package revision、document revision、formatVersion、Alder製品版、Graph `version:1`は別概念である。

`core.mjs`は構造と参照先の型・所属文書・版を検査する。旧BD参照のActivity欠落、別文書への参照、source descriptorの版不一致、未知版、重複JSONキー/ID、不正型、欠落欄、旧archive再混入を拒否する。外部参照目録のpayload追加や更新APIでの改変も拒否する。

改名・並び替え・serialize/reload・部分更新でもID、関係先、Findings対象、Check共有を維持する。更新APIは期待文書版を照合して競合を拒否する。ただし、単一ファイルに一貫して改ざんされたIDやハッシュを外部履歴なしで識別する機能はない。検証成功は業務上の合意や原典の意味対応を保証しない。

## 検証結果

- [PoC 54試験](results/tests.txt)成功。既存46試験を新構造へ対応させ、8件の拒否・外部参照検査を追加した。
- [既存Graph 52試験](results/graph-regression.txt)成功。現在BDの互換MD投影とGraph v1が一致し、別保存した旧MDが未変更の製品parserで読める。
- [変更前後の照合](results/archive-removal.json)で現在BD・Check本文、basedOn、原典ハッシュの保持を確認した。
- 修正版のブラウザーCIはPR更新後に実行し、そのrunとartifactをIssue #270へ記録する。旧版の成功を新構造の成功として扱わない。

### Node測定

2 warmup＋5回の中央値。生値、min/max、Node/V8、実装hashは[保存ログ](results/node-performance.json)にある。現在BDの文章を反復して5/100/1,000 Activityを作り、Objectを共有した。旧MD全文と旧BD本文は含まない。

<!-- NODE_TABLE_START -->

| Activity数 | UTF-8 bytes | ディスク読込 ms | JSON解析 ms | 型・参照 ms | 索引 ms | Graph投影 ms | JSON化 ms | ディスク保存 ms |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 5 | 82,584 | 0.234 | 1.161 | 1.395 | 0.025 | 0.168 | 0.258 | 0.159 |
| 100 | 540,526 | 2.019 | 4.089 | 4.244 | 0.112 | 1.353 | 1.051 | 0.600 |
| 1000 | 4,889,327 | 18.657 | 35.612 | 34.766 | 1.470 | 20.292 | 21.710 | 5.478 |

<!-- NODE_TABLE_END -->

重複キー走査＋native JSON.parse、型/参照、索引、Graph投影、保存を分けて計測した。Node workerでも2MiB超の処理・要素数予算拒否・期限による終了を確認した。これらはブラウザーFile/paint/IndexedDBの代用ではなく、実機速度の一般化にも使わない。

### 実ブラウザー

前回の承認済み[Chrome CI #39698727051](https://github.com/mk3008/alder/actions/runs/39698727051)では旧0.2構造の13/13ケースが成功した。[前回artifact](https://github.com/mk3008/alder/actions/runs/39698727051/artifacts/12392470083)。初回のCloud Chrome file:拒否等は`results/browser.json`に当時の停止証拠として残す。拒否された経路は再試行せず、今回は既に承認された独立GitHub Actions HTTP環境を使う。

修正版でも同じ13ケースを使い、File/URL/2MiB超、現行制限の再現、CORS、IndexedDB保存→reload→復元、download、未知版・破損の表示保持、中止、旧MD/Check parserを検査する。downloadはIDだけでなく元JSON全体の一致、archive不存在、2業務文書と外部目録のみであることも確認する。

描画は一覧100件・SVG5要素に限定している。本番Viewerの1,000 Activity全体の配置・配線、メモリピーク、実Android/iOS、低メモリ端末、外部HTTPS・認証URL、OSネイティブFile pickerの権限挙動は未検証。

## 容量・通信と移行案

現行ViewerのローカルBDは`File.text()`でブラウザー内処理し、Alderサーバーへのアップロードはない。ローカルBDには明示2MiB検査がなく、URL取得は宣言長とstream bytes、テキストはUTF-8 bytes、ローカルCheckはFile.sizeとparserで2MiBを検査する。これらは取得/入力経路別のクライアント制限であり、アップロード容量制限ではない。

PoCは仮の16MiB・5,000 Activity/Object・worker5秒・GET30秒・限定表示を組み合わせる。File読込前の容量検査、URLの宣言長/stream検査、中止、古い結果の破棄、最後の表示保持で失敗を扱う。仮値は本番推奨値ではない。不要な全文を削減できても、上限を無条件撤廃する根拠にはならない。

移行時は旧MD readerを維持し、新JSONを識別・版検査するadapterを別経路にする。未知JSONをMDへ自動fallbackしない。新JSONは従来Graph v1へ投影し、Procedure/Findings/CheckをGraphへ混入しない。MD変換は別出力とし原本を保持する。任意MDの改名後の同一性対応やbyte完全一致往復は未実装。

将来のBD／Check／状態遷移／概念モデルは`documents`のkindとpayload契約版を分ける案に留める。後二者の業務意味や正式Schemaを本研究で決めない。

## 過去のCodex編集比較

`edits/*`は0.2試案時の固定3課題×MD/JSONの実編集証拠で、今回書き換えていない。初回batch適用失敗と明示再試行6件を区別する。[指示と条件](edits/protocol.md)、[初回失敗](edits/first-attempt.json)。今回の変更により新しいLLM試験を行ったとは扱わない。

<!-- EDIT_TABLE_START -->

| 課題 | 方式 | 追加/削除行 | 変更行bytes | 構文・参照・目的 | 指示外変更 |
| --- | --- | ---: | ---: | --- | ---: |
| why | md | +1/-1 | 263 | 合致（再試行） | 0 |
| why | json | +1/-1 | 303 | 合致（再試行） | 0 |
| rename | md | +4/-4 | 378 | 合致（再試行） | 0 |
| rename | json | +2/-2 | 151 | 合致（再試行） | 0 |
| review | md | +1/-1 | 84 | 合致（再試行） | 0 |
| review | json | +1/-1 | 82 | 合致（再試行） | 0 |

<!-- EDIT_TABLE_END -->

再試行6件は指定内容に合致、構文/参照破損と指示外変更0。改名はMD4行・JSON2行の変更だった。同一セッション・非blind・少数であり、一般的なAI編集成功率は未実証。`audit-edits.mjs`は歴史的JSONをメモリ内で0.3構造へ投影して再検査し、原本の全ID集合と指定外変更も照合する。旧試験ファイル内の旧BDは過去の検証入力であり、新保存形式の同梱仕様ではない。

## 推奨と未決

整形済み単一JSONは引き続き次候補とする。旧MD全文同梱と旧BD本文同梱は今回取り下げ、原典は別保存・値による参照へ変更した。現在の業務文章・Check保証は型付きフィールドで保持する。

正式採用、製品Viewer対応、容量予算、原子的保存/同時更新、任意MDからのID対応、Check原典主張の意味確認、4成果物の正式契約は未決。既存Viewer・Plugin/Skill・正式BD/Check・Graph v1・PR #254/#266/#269・状態/概念モデルは変更していない。merge・release・デプロイは行わない。
