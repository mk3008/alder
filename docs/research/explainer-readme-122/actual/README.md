# Alderを試すなら、人間は何を決め、AIへ何を渡すのか？

> 想定読者：AIコーディングと一般的な開発工程を知り、Alderを初めて検討する人。比較用の仮読者を使い、実在人物の経歴は仮定していません。
> 省いたもの：一般的な開発工程の説明、研究Issueの履歴、Business Graphの仕様、設計論の網羅比較。
> 所要時間：本文約10分を想定。要求分析の経験、AIへ任せる範囲、読む時間は未確認です。
> 検証方法：固定した一次資料の引用抽出と架空fixtureの表示を実行済み。意味の妥当性、HTML、verify-doc、読者への伝達は未検証です。

読み終えたら、次の3つを判定できることを目指します。

1. 実装で具体化した業務判断を、合意した要求へ戻して確認する必要が自分の開発にもあるか？
2. 人間が先に合意する業務上の意味と、AIへ任せて後でレビューする技術判断を区別できるか？
3. 公開安定版と未リリースの手順を区別して、小さく試す入口を選べるか？

## 0. 一枚で

| 判断したいこと | Alderでの扱い | 試すときの行動 |
| --- | --- | --- |
| 何を確かめる手法か | 実装・DDL・テストが選んだ業務上の意味を、合意したBusiness Designへ照合する | 「この振る舞いを誰が、どこで決めたか」を確認する |
| 人間が何を先に決めるか | 業務上の意図の正本はBusiness Design。未決をコードやテストで承認しない | 依頼者の言語で草案を読み、結果・責任・引き渡しを合意する |
| 何を実装へ渡すか | この未リリース版では、業務設計と検査項目の人間レビューが必須 | 同じ版の設計と確認済みCheck ItemのIDを渡す |
| 技術詳細はどこまで決めるか | 独立した詳細設計の必須ゲートはない。高コストの変更や既存制約は先に扱う | 現在の技術条件はSystem Designへ、可逆な細部は実装・レビューへ |
| Pluginだけで始められるか | 安定Plugin 0.1.0は実装後レビューのみ。未リリース0.2.7は設計草案も支援 | 利用する版と対象の設計・実装を固定し、対応している工程だけを依頼する |

## 1. 実装を、要求を確かめる材料にする

Alderは、AIが実装し、別のエージェントまたは新しいコンテキストが、その実装をBusiness Design（業務設計書）へ照合する開発の進め方です。合意済み要求との不一致、未決の業務判断、技術的な改善、十分に成立する振る舞いを区別して返します。

たとえば、会議室の重複予約をコードが一律に拒否していたら、「拒否する方針は業務設計で合意されているか」を確認します。設計が未決なら、拒否が正しいとも不具合だとも決めず、責任者へ具体的な問いを戻します。

**実装は要求を確認する観察材料であり、業務上の意図の正本にはなりません。** テストの成功やDecision Record（判断と理由の記録）も、業務上の承認にはなりません。

このループは通常のコード・DBレビューを置き換えず、特定のアーキテクチャも要求しません。実装前と後のレビューをどう配分するのが最善かは、まだ検証されていません。

根拠：[実装から要求を確認する理由](https://github.com/mk3008/alder/blob/90890e1c209af1b7f88f14e64bb27a7a0d2edbee/docs/philosophy.md#why-not-settle-every-decision-before-implementing)、[実装後レビューの入口と範囲](https://github.com/mk3008/alder/blob/90890e1c209af1b7f88f14e64bb27a7a0d2edbee/docs/adoption.md#4-run-a-separate-alder-review-after-implementation-outside-the-standard-design-business)。

## 2. Business Designは、業務のつながりを読める自然言語で書く

Business Designは、人間が単独でも読み書き・保守でき、依頼者自身が理解して合意する文書です。AIは草案や更新を支援しますが、本文は依頼者が実際に使う言語で書きます。

**自由作文に任せず、5W1H + Input / Procedure / Output / Resultの構造を推奨します。** 必須の入力仕様ではありませんが、任意の仕様形式でも同じレビューができることは確立されていません。

| 欄 | 書く内容 |
| --- | --- |
| What / Why | Activity見出しで業務名、その目的は短い句で |
| When / Who / Where | 通常の開始契機、安定した役割名、業務に影響する環境やチャネル |
| Input / Procedure / Output | どのObjectから何を受け取り、誰が何を行い、どこへ何を渡すか |
| Exception / Exception When | 中断や差し戻し、その再開条件。通常の成功手順と区別する |
| Result | 正常終了で成立する業務状態と、次に可能になる仕事 |

例として、架空ヒアリングを「利用者の希望を受け、空きがあれば登録して結果を伝える。重複時の扱いはまだ決めていない」と置きました。次は、この草案fixtureを読み取った実際の出力です。

<!-- output: meeting-room -->
```text
架空fixture: 未合意の草案（製品の実装・テストではない）
構造: Activity / Why / When / Who / Where / Input / Procedure / Exception / Output / Result
業務名: 会議室の予約
Output: 登録した予約
Result: 空きがある場合の予約が登録され、利用者が利用予定を把握できる。
未決 Q1: 重複する予約希望は拒否するか、調整するか。 decision=null
ROOM-01: 未レビュー / Test根拠=未作成
ROOM-02: 要確認 / Test根拠=未作成
System Design: DB=未選定
Code永続mapping: false
```

Outputは受け渡す情報、Resultは終了後に成立する状態です。`decision=null`は未決を保持しており、重複を拒否する規則をこの例は追加していません。

fixtureの未決箇所は、次のデータに対応します。

<!-- source: examples/meeting-room.json -->
```json
  "open": [{"id":"Q1","question":"重複する予約希望は拒否するか、調整するか。","decision":null}],
```

この実行は、説明用データの表示です。予約機能の実装、業務設計の合意、業務上の正しさの検証ではありません。

根拠：[形式と各欄の意味](https://github.com/mk3008/alder/blob/90890e1c209af1b7f88f14e64bb27a7a0d2edbee/docs/adoption.md#recommended-business-design-format)、[人間とAIの共同保守](https://github.com/mk3008/alder/blob/90890e1c209af1b7f88f14e64bb27a7a0d2edbee/docs/adoption.md#human-and-ai-co-maintenance)、[Alderを使う設計業務の一次記述](https://github.com/mk3008/alder/blob/90890e1c209af1b7f88f14e64bb27a7a0d2edbee/business-design/alder/README.md)。

## 3. 未決を解消したら、期待結果を人間がレビューして引き渡す

この資料が対象にする未リリース版では、業務設計と業務相関を確認した後、AIがCheck Item（独立にレビューできる観察可能な期待結果）を草案・更新し、人間が期待結果をレビューします。業務設計と検査項目の合意が、実装への引き渡し条件です。

会議室fixtureの`ROOM-01`は草案なので「未レビュー」、重複時の`ROOM-02`は「要確認」です。AIの確信が高くても、人間の確認なしに「確認済み」へ進める理由にはなりません。

**期待結果の人間レビューと、テストによる根拠は別です。** 引き渡し時点に新規Testはまだ存在せず、Testとの対応が全部そろうことを設計完了の条件にはしません。

実装後はTest実行に続く別のAlderレビューとフォローアップで、テストの期待値を確認済みCheckへ照合し、同じCheck IDの詳細に代表的なTest/assertionとの対応と根拠不足を保守します。独立したレビュー自体は読み取り専用で、その後の更新作業と分けます。

| 成果物 | 権限と追跡の境界 |
| --- | --- |
| Business Design | 業務上の意味の正本 |
| Check Item | 設計を参照し、期待結果・レビュー状態・後続のTest根拠を同じIDに保持 |
| Automated Test | Checkへ前後に追跡し、実行によってCodeを検証 |
| Code | 調査時に読む実装。Checkとの永続的なファイル・行・symbol mappingは作らない |

Checkレビューで業務上の意味が変わるなら、先にBusiness Designへ戻し、人間が合意してからCheck・テスト・コードへ反映します。Functional Interfaceによる責任の索引と同期漏れの診断は、必要な場合の任意の補助です。

根拠：[必須の検査項目作成・人間レビュー](https://github.com/mk3008/alder/blob/90890e1c209af1b7f88f14e64bb27a7a0d2edbee/docs/adoption.md#draft-and-review-check-items-required)、[追跡関係と根拠不足の扱い](https://github.com/mk3008/alder/blob/90890e1c209af1b7f88f14e64bb27a7a0d2edbee/docs/check-item-traceability.md)。

## 4. 技術条件と、先に固定する価値のある判断を渡す

System Design（システム設計）は、業務上の意図を実現する現在の技術条件を整理する隣接業務です。Alderはその技術検討の方法を規定せず、独立した詳細設計工程を実装前の必須条件にもしていません。

たとえば「既存予約DBとの互換性が必要」なら先に渡し、DB製品や接続条件は技術条件としてまとめます。会議室fixtureではDBは未選定、内部関数の分割は実装時に検討する状態で残しています。

| 先に明示する価値 | 例 |
| --- | --- |
| 高い | 既存schemaとの互換性、公開API、移行条件、外部契約、法令・セキュリティ上の制約 |
| 理由があれば明示する | 保守体制・既存資産・希望による言語やDB製品の選択 |
| 通常は実装で具体化してレビューできる | 関数・クラスの分割、内部構成、命名など可逆な細部 |

**先に決める基準は、変更コストと実際の制約です。** AIでコードを直しやすくなっても、永続データや外部契約まで可逆になるわけではありません。

独自の詳細設計を置くことは可能です。アーキテクチャの名前だけを要求にするより、守りたい性質や具体的なリスクを実装者へ渡します。

根拠：[詳細設計をどこに置くか](https://github.com/mk3008/alder/blob/90890e1c209af1b7f88f14e64bb27a7a0d2edbee/docs/detailed-design.ja.md)、[System Designの責任境界](https://github.com/mk3008/alder/blob/90890e1c209af1b7f88f14e64bb27a7a0d2edbee/business-design/alder/README.md#activity-システム設計)。

## 5. 小さく試す入口は、採用する版で選ぶ

Alderの手法、レビュー知識、Pluginの版は別です。この根拠revisionでは手法のリリースはv0.6、レビュー知識はv0.3で、v0.6で任意だったCheck Itemの作成・追跡を遡って必須にしたとは説明していません。

| 選ぶ入口 | できることと注意 |
| --- | --- |
| 安定Plugin `plugin-v0.1.0` | 完了した実装を読み取り専用でレビューする。設計草案のskillは含まない |
| 未リリースPlugin 0.2.7のcommit/branch | ヒアリングからBusiness Designの草案・改訂と、実装後レビューを支援する。移動するbranchなら解決したcommitを記録する |
| 未リリースの手法を手動/referenceで試す | 合意したBusiness Design、必須のCheck Item人間レビュー、実装後レビューとフォローアップを行う。Pluginに未収録の工程もある |

すでに実装があるなら、狭い変更と対応するBusiness Designを選び、安定Pluginでレビューを試せます。新しい設計から始めるなら、未リリース版の工程を使うことを明示し、読める設計ファイルを用意してください。

安定版の導入では、利用者が次のコマンドを実行し、対応クライアントでPluginを有効にします。これは資料作成中に実行したコマンドではありません。

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.1.0
codex plugin marketplace list
```

標準の設計置き場は`docs/business-design/`で、別の場所ならプロジェクトの`AGENTS.md`にそのパスを書きます。対象を読める状態にして、実装後には「実装が終わったのでAlderレビューして」と依頼します。

未リリースの設計草案skillを使う場合は、読み取れるヒアリングを渡して「このヒアリング結果をAlder業務設計書にして」と依頼します。このskillは未決を保って草案を作り、Check Itemや製品の実装までは生成しません。

**Pluginは全工程を自動実行しません。** 0.2.7でも設計品質・業務相関・漏れのレビュー、Optimization Review、Check Item草案、Graph export、フォローアップはskillとして収録されていません。

根拠：[手法の版とアクセス](https://github.com/mk3008/alder/blob/90890e1c209af1b7f88f14e64bb27a7a0d2edbee/docs/adoption.md#versions-and-access)、[Plugin導入と提供範囲](https://github.com/mk3008/alder/blob/90890e1c209af1b7f88f14e64bb27a7a0d2edbee/docs/plugin-adoption.md)。導入や新しい草案skillのクライアント動作は、本資料では未実行・未検証です。

## 6. 試す前のチェックリスト

- 業務判断の責任者がBusiness Designを理解し、誤りを指摘できる言語で書いたか。
- 開始条件、入出力、成立する結果が次の業務につながり、未決と合意済みを区別したか。
- 選んだ手法の版で必要なCheck Itemレビューを行い、設計の版とCheck IDを渡すか。
- 既存制約と変更コストの高い判断を渡し、未決の業務方針をAIへ決めさせないか。
- 実装後に別の文脈でレビューし、必要な人間判断と記録更新をフォローアップするか。

## 7. 理解度チェック

1. 重複予約を拒否するテストが通った。未決だった拒否方針も承認できるか？

<details>
<summary>答え</summary>

承認できません。2節のfixtureではQ1が未決で、テストは選んだ振る舞いの材料にすぎないため、責任者へ拒否か調整かを確認しBusiness Designへ反映します。

</details>

2. 「登録した予約」をOutputにもResultにもそのまま書けば足りるか？

<details>
<summary>答え</summary>

足りません。2節の出力のようにOutputは移動する情報、Resultは登録後に成立する業務状態と次に可能な仕事を書き分けます。

</details>

3. 人間が確認済みにしたCheckに新規Testがないと、設計は引き渡せないか？

<details>
<summary>答え</summary>

新規Testの完全な根拠を一律の引き渡しゲートにはしません。3節のように期待結果の人間確認とTest根拠は別で、実装後のレビュー・フォローアップでCheckとTest/assertionを照合して根拠不足を保守します。

</details>

4. 詳細設計が任意なら、既存DBとの互換性もAIが自由に変更してよいか？

<details>
<summary>答え</summary>

よくありません。4節の区分では互換性は先に渡す実際の制約であり、変更コストが高い判断は必要な範囲で先に設計します。

</details>

5. 安定Plugin 0.1.0を入れれば、設計草案と必須Checkレビューまで自動で終わるか？

<details>
<summary>答え</summary>

終わりません。5節の版表では0.1.0は実装後の読み取り専用レビューのみで、未リリース0.2.7でもCheck Item草案やフォローアップは収録されていません。

</details>

## 付録：再現

以下はこの資料ディレクトリを作業ディレクトリとするコマンドです。3行目は親工程での実行予定であり、本資料の著者は実行していません。

```sh
python3 examples/extract-evidence.py
python3 examples/inspect-meeting-room.py
node <explainer-skill>/scripts/verify-doc.mjs .
```

| ファイル | 用途 |
| --- | --- |
| `examples/source-evidence.json` / `extract-evidence.py` | 許可された一次資料から文字列を抽出。不一致なら終了する |
| `examples/meeting-room.json` / `inspect-meeting-room.py` | 架空の未合意草案と、その表示 |
| `checks.json` | 上記の再実行コマンドと期待行 |
| `authoring-record.md` | 入力条件、工程、一次資料の対応、未適用点 |

<details>
<summary>一次資料から抽出した出力</summary>

<!-- output: source-evidence -->
```text
method-version: The current release is **Alder v0.6**, containing **research review knowledge v0.3**.
required-checks: After humans have completed Business Design and its business-correlation review, Alder requires Check Item design and human review before test implementation.
stable-plugin: The previous stable tag `plugin-v0.1.0` still provides only read-only review; version 0.2.7 is available from this change's commit/branch until separately released.
plugin-limit: Plugin 0.2.7 packages design authoring and implementation review; design-quality/correlation/omission review, Optimization Review, Check Item drafting, graph export and follow-up are not packaged skills.
structure: The current research recommends **5W1H, with How written as Input → Procedure → Output and an optional Exception section**, to make relationships between activities traceable.
result: The business state established when Procedure finishes normally and the subsequent business it enables. Keep it separate from Output's transferred information and Why's purpose.
no-detail-gate: Alder does not require a separate detailed-design gate before implementation.
trace-boundary: Do not maintain a permanent Check Item ↔ Code, file, symbol, SQL-entry-point, or line mapping.
```

</details>

抽出は引用文字列の存在、fixture表示は格納データとの一致を確かめます。自作スクリプトは解説の意味や業務の正しさを保証せず、HTML・verify-doc・first-readerの結果もこの実行からは得られません。
