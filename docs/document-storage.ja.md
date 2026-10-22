# 型付き文書パッケージの保存契約（候補0.1）

業務設計とCheck Itemを、論理文書を分けた一つの整形JSONに保存する。共通の構造契約は[Schema](../tools/document_storage/schema.json)、文書間制約は[検証器](../tools/document_storage/core.mjs)が定める。正式採用・Plugin配布・Viewer組込は別の判断であり、既存Markdown契約とBusiness Graph v1を変更しない。

## 版と境界

| 項目 | 意味 |
| --- | --- |
| `format: alder-document-package` | Graph JSONや過去の研究PoCと区別する識別子 |
| `formatVersion: 0.1` | パッケージ全体の候補構造版。製品版・内容版・人間合意と独立 |
| `revision` | パッケージの内容版。編集者が新しい値を明示する |
| `documents[].id / kind / schemaVersion / revision` | 文書の同一性・種別・payload互換版・内容版。現在はBD/CheckともschemaVersion `0.1` |
| `sources[]` | import時のdocumentId・原典内容revision・SHA-256・任意のHTTPS URI。ローカルパスや原典全文は保存しない |
| `externalDocuments[]` | 別保存の旧BDを参照するための最小目録。文書ID・版・Activity ID/表示名のみ。旧版本文ではない |
| `diagnostics[]` | 文書に残す補足。実際の検証結果は毎回計算する。空欄でも承認済みとは解釈しない |

`documents`は現在`businessDesign`と`checkItems`を受け入れる。将来の`stateTransition`・`conceptModel`は、このkind/payload版の境界で追加する。今回は具体Schema・業務意味・表示を定めない。未対応kind/版・未知フィールドは拒否し、読み飛ばしやダミー文書の必須化はしない。互換性を変える追加は、対応版と消費側の更新をレビューしてから行う。

候補契約`0.1`は製品の正式v1ではない。研究PR #271の`alder-typed-storage-poc / 0.3-poc`も別形式として拒否する。過去の研究証拠を新契約へ自動書換えしない。

## 型付き業務情報

BDにはObjectの名称・Scope・Icon・Information、ActivityのWhat（name）・Why・When・Who・Where・Procedure・Exception・Result・Problem/Painを保持する。IOと例外関係はID参照の関係として一度保存する。Exception Whenの条件も関係のlabelに保持する。Findingsは元のF01等・Kind・Status・Scope・対象ID・Summary・Contentを保持し、未解決の対象参照は確定JSONとして受け入れない。

Checkには既存Check ID（`checkId`）、内部の安定ID（`id`）、タイトル、人間レビュー状態、条件/期待結果/一般保証・根拠・導出・AI確度・関連業務・Test証拠・未決/選択肢を保持する。内部IDを分けるため、複数Check文書で同じ表示Check IDを使えても文書間で混線しない。同一文書内のCheck ID重複は拒否する。

共通保証のproseと比較表のcolumns/rows、見出しリンクの参照先IDを保持する。例だけでは一般保証を代替できない。共有Checkは一本文・一レビュー状態を複数Activityのindexから参照する。未割当Checkは`sections[].activityId: null`として残し、Activityを推測しない。

Whoは現在の短いロール名の文字列を保持する。ロールIDの導入は、役割の同一性判断や既存文章内の役割抽出を追加するため今回は見送った。Activity/Object/Check/Findings/関係のID化を先に適用し、役割の同義語を自動統合しない。

構造・参照が通ることは、文章の業務意味・完全性・人間合意を証明しない。自由記述内の旧名称や引用の意味は自動改稿しない。

## IDと更新

初回変換は明示的な文書IDを名前空間にして、要素種別と元の識別キーからUUIDv5を付与する。元の並び位置からは生成しない。JSON化後は保存したIDを使い、改名しても再発行しない。Check IDとFinding sourceIdは元の値も保持する。

再変換に`previousPackage`と`expectedRevision`を渡すと、同じ名前・Check ID・Finding ID・関係端点等を照合する。位置や類似名では照合しない。Activity/Objectの改名は`renameBindings: {以前のID: 新しい名前}`で明示する。消える旧IDは`removedIds`で明示し、対応の曖昧さ・衝突・古い期待版・内容変更時の同一revisionは停止する。

新規変換だけを繰り返してMDの改名へ追従する保証はない。改名後も同じ要素として扱う場合は前のJSONと明示対応を必ず渡す。共通保証の見出し変更・同じ列構造の比較表が同一保証内に複数ある等の曖昧な再取り込みは拒否する。正本JSONを直接編集する方が単純な場合は、再変換で迂回しない。

`applyEdits`はパッケージ期待版・文書期待版・新しい版・対象IDと変更値を受け取り、コピー上で全体検証して返す。ID、所属、型、Check ID、Finding sourceIdを置換できない。既存要素の削除を含む編集はこのAPIでは受け入れない。BDの版を変えたとき、Check参照を自動更新しない。必要なCheckの原典版変更は同じ操作で明示する。この明示操作も業務上の再承認を意味しない。

## MD→JSON API / CLI

[使用開始](../tools/document_storage/README.md)。Node APIの`convertMarkdown(request)`は次を受け取る。

- `sources[]`: `documentId / kind / revision / text`。Checkには`basedOn: {documentId, revision}`。原典URIを持つ場合は`uri`。
- パッケージ`revision`。
- 再変換時は`previousPackage / expectedRevision`、必要な`renameBindings / removedIds`。
- 旧BD本文を含めない場合は明示した`externalDocuments / externalSources`。

戻り値は`{package, diagnostics, approval: 'not-evaluated'}`。失敗時は`ConversionError.diagnostics`のcode・documentId・messageを使う。成功したCheckでも意味対応の検証は`unverified`で、元の人間レビュー状態とは分離する。

CLI要求ファイルは`text`の代わりに`path`を持つ。`previousPackagePath`も使える。入出力はUTF-8、出力は2スペースと末尾改行。CLIは入力をすべて読み検証した後、新規ファイルだけを同一ディレクトリ内で確定する。既存ファイル・symlink・hardlinkを上書きしない。stdoutの診断と出力パス、stderrの失敗診断を区別し、成功0/失敗2で返す。ライブラリAPIはファイルを書かない。

## 対応Markdownと停止条件

BDは現在のBusiness Graph opt-in Markdown profile v1を未変更の公式parserで検査した上で、Procedure・Exception・Findingsも取り出す。未知見出し・重複欄・不明参照を削って通さない。購買研究草案のMedium/SR Dependenciesは正式profile外であり、今回は拒否する。元Markdownはそのまま残る。

Checkは4列表とH2 Activity/H3 `ID — title`の日本語欄形式を対象とする。Plugin 0.4.8の共通保証・比較表形式、現行見本の明示HTML anchorとdetails形式を検証している。旧detailsのsummaryは`detailSummary`として残す。未割当見出しは`未割当 / Unassigned`を認識する。未知欄、曖昧な見出し、壊れたfragment、列の欠落、不正な一般保証を拒否する。

全Markdown方言のコンバーターではない。英語のCheck欄名、任意HTML、reference-style link、画像、escaped pipe等の表記は未対応で、対応を推測しない。JSON→MD逆変換、二重正本の同期機構は提供しない。

Checkの原典を示す行にGitHub commit固定リンクがある場合、入力BDのURIと文書パス/commitが一致するか検査する。URIがない・別原典・別commitなら停止する。この変換器自体はURIを取得しないため、URIの文字列一致だけでは取得元や本文hashの真正性を証明できない。利用側が原典バイト列と出所を確認する。意味対応と人間の承認も別に確認する。

## 後続工程との契約

| 工程 | このGateから渡すもの | 後続で確認すること |
| --- | --- | --- |
| Plugin（Gate B） | Schema、validate、applyEdits、Node変換API/CLI、診断、BD/Check見本 | ランタイムとbundle/provenance、自然言語→直接JSON草案/部分編集、レビュー状態維持、失敗時の保存、縦断ケース。今回Skill変更・配布はしない |
| Viewer（Gate C） | ブラウザーでも使えるcore/schema、Graph v1投影、Check/Findingsの独立payload | JSON識別/版拒否、既存全体図・詳細・Checkへの投影、旧MD互換、File/URL/保存復元、最後の描画保持。今回は実Viewerを変更しない |
| 状態遷移等（後続Gate） | kind/schemaVersion/revisionと文書間ID参照の境界 | 合意済みの業務意味を確認してpayloadを追加。概念モデルSchema/表示は未定義 |

Graph v1投影は従来どおりID＝表示名で、Procedure・Findings・Checkは含めない。保存JSONのUUIDとGraphのIDを混同しない。Gate Bの配布ではPython adapterと公式BD parserの実行依存も収容する必要があり、現在のPluginがこの新APIを搭載したとは扱わない。
