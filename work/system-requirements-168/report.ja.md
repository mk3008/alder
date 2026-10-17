# 提供済みSystem Requirementsを実装レビューへ引き継ぐ

2026-10-06 / [Issue #168](https://github.com/mk3008/alder/issues/168) / 研究・設計案。未採用。本番Skill・README・Business Designは変更していない。

## 結論

**現行Alderに「System Requirements（SR）を検証する能力・経路がない」とは言えない。提供されたSRの引き継ぎを明示する最小の文言変更を提案する。** SRの作成・妥当性・完全性はプロダクト側に残し、Alderは今回の変更に関係する提供済み制約と実装・テスト・実行証拠の対応を確認する。この採否は人間に残す。

現行Skillはproject instructionsとdocumented assumptionsを読むため、そこからSRを確認できる。今回、その経路を持つ現行条件Bと、SRを明示的に固定・照合する候補Cは、同じ5件の違反を報告し、無害な1件を十分とした。候補による検出率向上は示されなかった。BD/Checkのみの条件Aも、認可と移行の2件は既存の業務条件・配備情報から検出し、残りは確認事項として残した。

確認できた不足は、**実装へ渡したSRを独立レビューへ確実に引き継ぐことが、READMEのレビュー入力列挙とSkillの固定入力で明示されていない点**である。レビュー手法の新設や一般的NFRチェックリストを支持する結果ではない。

## 現行文書の責任境界

基準は [main `f716c1a`](https://github.com/mk3008/alder/tree/f716c1a1ea8fa8b3adebb9001d9762eee89eadb0)。未マージのREADME変更や過去研究の候補は基準へ混ぜていない。

| 現行の根拠 | 読み取れる責務 | 残る曖昧さ |
| --- | --- | --- |
| [README.ja.md 224–246](https://github.com/mk3008/alder/blob/f716c1a1ea8fa8b3adebb9001d9762eee89eadb0/README.ja.md#L224-L246) | SR作成はAlderの担当外。人間が整理済み条件の不足を確認し、BD・Check・SRを実装担当へ渡す | SRの完全性をAlderが保証するとは書かれていない。責任者の具体名は各プロダクトで決める |
| [README.ja.md 256–266](https://github.com/mk3008/alder/blob/f716c1a1ea8fa8b3adebb9001d9762eee89eadb0/README.ja.md#L256-L266) / [英語README](https://github.com/mk3008/alder/blob/f716c1a1ea8fa8b3adebb9001d9762eee89eadb0/README.md#L147-L160) | BD・Checkを照合し、判断記録・実装・テスト・実行結果を独立AIへ渡す | レビュー入力にSRを明示しない。会話履歴を除外する際の受け渡し漏れを否定できない |
| [実装レビューSkill](https://github.com/mk3008/alder/blob/f716c1a1ea8fa8b3adebb9001d9762eee89eadb0/plugins/alder/skills/alder-review-implementation/SKILL.md) / [read-only stage](https://github.com/mk3008/alder/blob/f716c1a1ea8fa8b3adebb9001d9762eee89eadb0/plugins/alder/skills/alder-review-implementation/references/read-only-review.md) | project instructionsを確認。BD、confirmed Checks、documented decisions、実装、testsを固定し、documented assumptionsも読む | SRは名前付き固定入力でないが、project instructions/assumptionsを通る既存経路はある |
| [Alder利用業務のScope](https://github.com/mk3008/alder/blob/f716c1a1ea8fa8b3adebb9001d9762eee89eadb0/business-design/alder/README.md#L15-L17) / システム設計・実装Activity | システム設計と実装は隣接業務。SRをシステム開発者が整理して実装へ渡す | このBD自体が実装後レビューを対象外と宣言している。そのActivityがないことを、製品全体のレビュー欠落の証拠にはできない |
| [philosophy](https://github.com/mk3008/alder/blob/f716c1a1ea8fa8b3adebb9001d9762eee89eadb0/docs/philosophy.md) / [adoptionの業務品質](https://github.com/mk3008/alder/blob/f716c1a1ea8fa8b3adebb9001d9762eee89eadb0/docs/adoption.md#business-quality-requirements-belong-where-they-constrain-the-work) | 期限・業務継続・認可など業務成立に必要な条件は既存BDフィールドへ。技術方式・既存基盤等は技術側へ | security/availabilityという語だけでは配置先を決められない |

英語READMEと日本語READMEの構成は異なるが、SRを実装へ渡し、レビュー入力では明示しない点は共通。外部の専門レビューやセキュリティ診断をAlderで代替する根拠はない。

## 比較方法

安全な合成フィクスチャと候補を [公開入力commit `d9653ee`](https://github.com/mk3008/alder/tree/d9653eee429bf341840af5e7ea56cd2195a3dd12/work/system-requirements-168) に保存・再取得してから実行した。[protocol](protocol.md) と [入力hash](input-hashes.json) を参照。

| 条件 | 読める製品入力 | 手順 |
| --- | --- | --- |
| A: 入力欠落の対照 | 共通BD・confirmed Check・decisions・scope・実装・テスト。SRは未提供 | 現行Skill |
| B: 現行の公平な基準 | Aと同じ共通入力＋project instructionsから読めるSR | 現行Skill。SRは実験内では固定されているが、追加のSR専用照合指示は与えない |
| C: 明示固定案 | Bと同じ入力 | 現行Skill＋[candidate](candidate.md)だけ追加 |

3つの実際に分離したcontextをforkなしで作成した。リポジトリ指定のgpt-6-sol / mediumを要求したが、実効runtime設定の独立証明はない。共有filesystemの許可範囲は指示で限定し、OS隔離ではない。各reviewerにはIssueの仮説、評価基準、他条件の出力を見せていない。完全なdispatch promptと結果は [runs](runs/) にある。rawは公開安全性を確認済みで、架空データ以外の顧客情報・認証情報・private URLを含まない。

評価者の結論だけを入力する代わりに、Pythonコード・SQLite migration・既存5テストを渡した。全条件で5テストは成功したが、別の入力で実際の不一致を再現できた。コーディネーターの再現用 [observe_contracts.py](observe_contracts.py) と [observations.json](observations.json) はレビュー完了後の証拠側に置き、reviewerの許可入力から除外した。

## 結果と評価

| 対象 | 実装・要求の照合根拠 | A: SRなし | B: 現行＋SR可読 | C: SR明示 |
| --- | --- | --- | --- | --- |
| ログprivacy | email由来hashを永続collectorへ渡す。SR1はcustomer由来識別子を禁止 | 保持の目的・許可・条件をBusiness確認。禁止とは断定せず | SR1との確定的不一致 | 同左 |
| 既存認証・認可 | resolverはtenant-a。偽装header tenant-bで他tenantのcaseをHTTP 200取得 | BDのtenant境界違反を検出 | BD＋SR2の不一致。既存resolverを呼ぶだけでは不十分 | 同左 |
| API互換性 | 旧応答のidを削除。SR3は今releaseでid/case_id併存を要求 | API ownerへ既存consumer契約の確認。BD出力は満たす | SR3との確定的不一致 | 同左 |
| migration/rollback | forward後、旧readerが実際にno such column。downは旧値を復元できても併存を満たさない | 両readerが配備済みというscopeから互換性不一致を検出 | SR4の24時間併存違反 | 同左 |
| availability/restore | 停止12分、復旧27分、snapshot間隔1440分。SR5は15分/30分/10分 | 紙受付は成立。履歴保全と復旧経路の確認を残す | 停止・復旧所要時間は計画上範囲内、RPOは計画不一致。実運用未検証 | 同左 |
| 無害な局所変更 | inline strip()を関数へ移すだけ | 十分 | 十分 | 十分 |

Aの2件とB/Cの5件を単純に「検出率改善」と比較してはいけない。入力が違い、Aでは見えない禁止条件・consumer契約・数値を確定できない。Aが必要な確認を残したのは適切な結果である。B/Cの検出対象と分類は同じだった。CはSR単独のhashを報告したが、Bもパケットのpublic pinを報告しており、単発の出力差から再現性向上を断言しない。

全条件でcase06への余分な要件・必須NFR一覧・重複Checkは観測されなかった。B/Cでは合意済み制約への修正を新しい業務承認に変えなかった。ここでいう「判断不要」は新しい意味判断が不要という意味であり、実装変更・配備・mergeへの操作承認ではない。

Aのcase05にはBDの「過去の受付記録は維持する」からも復旧への懸念が出る。したがってavailabilityはSRだけで検出できる事例ではない。また、そのBD文言と許容データ損失10分の整合は完全に確定できない。B/Cはこの曖昧さを明示的には報告しなかったため、候補のsource conflict処理の有効性を検証済みとはしない。凍結入力は後付け修正していない。

## 責任の分け方

1. **SRの作成・妥当性・完全性確認:** プロダクトが指定する技術責任者が担う。業務上の保証を決める必要があるときは依頼者・業務責任者へ戻す。AIは整理・調査を支援できるが、Alderが全NFRの生成・網羅・安全を保証するとはしない。
2. **提供済みSRへの実装適合確認:** 独立Alderレビューで、今回の範囲に適用される既知の制約を実装・DDL・テスト・実行結果と照合する案。source・revision・対象範囲を既存の入力/結果説明に含める。独立した新レポート、SR様式、SR用Check台帳は必須にしない。
3. **技術修正と運用実証:** 実装・運用担当者が修正と試験を行う。コードの読解、テスト成功、設定値だけでは実測停止時間や復旧能力を保証しない。
4. **SR不明・不足:** 「要件なし」とせず、その部分を未確認とする。具体的な照合に必要なら所在・適用範囲を問う。独立して確認できるBD/Checkを止めず、無関係な小変更に新たな全件NFR作成を要求しない。
5. **source間の矛盾:** BDの業務意味をSRで黙って変更しない。技術制約も一般論やコードの都合で撤回しない。衝突する箇所と影響を示し、それぞれの責任者に最小の判断を求める。

業務上の認可、受付継続、履歴保全等はBDの既存フィールドに残す。既存認証基盤の利用方法、公開API契約、移行の併存条件等は技術制約として照合できる。分類ラベルではなく、その要求が定める意味・制約と責任で区別する。

## 採用する場合の最小差分

以下は設計案であり、このPRでは適用していない。

- 実装レビューSkillのfixed inputsとread-only stageの入力に、**提供済みSRおよび関連project constraintsの版・範囲**を追加する。既存project instructions/decisions経路を置き換えず明示する。
- read-only stageへ、今回の変更に適用される制約との適合・不足証拠・source衝突を短く照合する一文を追加する。Q1–Q3/P1–P2/Sの新設・改変は不要。
- READMEの実装→レビュー引き継ぎ箇所（日英）にSRを含める。完全性と実装適合の責務差は既存adoption/detailed-designの該当箇所へ短く記述し、Skillを手順のSSOTにする。philosophyに新章を増やす必要は現時点でない。
- 既存のCheck-to-Test追跡構造へSRを機械的に追加しない。SRの根拠箇所とテスト/運用証拠への参照をreview findingに残せば本パイロットは成立した。別のSR台帳や新ID体系は今回の証拠から正当化できない。
- 採用後の実装Taskで、package内reference・sourceの同期と通常のpackageテストを実施する。曖昧/矛盾するSR、未提供SR、適用外SR、stale revision、業務意味と技術制約の混同、実行証拠なしの適合断言を回帰対象に加える。この比較では未検証である。

利用者向けの短文候補:

> 実装時に使ったシステム要件もレビューへ渡してください。Alderは、今回の変更に関係する提供済みの制約を、実装・テスト・実行結果に照らして確認します。システム要件の作成と妥当性・完全性の確認はプロダクト側の責任です。要件や検証根拠が読めない部分は未確認として示します。

採用しない選択も可能。その場合はレビュー境界を曖昧にせず、次の趣旨をREADMEの引き継ぎ箇所とSkillで揃える:

> Alderの実装レビューは業務設計書とチェック項目を対象とします。システム要件への適合確認はプロダクト側で別途行ってください。project instructions等から気づいた技術上の指摘は、システム要件全体の適合確認を意味しません。

除外案は別の確認担当・引き継ぎを必要とする。すでにSRを渡して実装するフローとの一貫性と、Bで既存の照合が成立したことから、今回は最小明文化案を推す。除外案の運用負担は実測していない。

## 証拠の強さと限界

- 公開取得可能な固定入力、実際の3独立context、完全prompt、原文のreview結果、実装と実行可能な5テスト、観測harnessを保存した。stochasticな同一出力は保証しない。
- 各条件1回、合成の小規模6ケース。現実の大規模repoでの探索、暗黙契約、複数ファイルに分散するSR、脆弱性診断、実測RTO/RPO、要件完全性は検証していない。
- 同じモデル系の単発比較であり、候補の優越や一般的な検出率を証明しない。特にBへSRの所在を分かりやすく与えているため、実際の引き継ぎ漏れ頻度は測っていない。
- 指示による閲覧制約であり、OS強制隔離ではない。A/Bは既存__pycache__名を目視またはglob展開したが内容を読んでいないと報告。禁止資料の本文閲覧は報告されなかった。
- local gitのmain復元履歴はpublic commitと異なる。比較元commit間の変更がREADME2ファイルのみであることをconnectorで確認し、それらを取得し直した。公開側の入力commitは実mainを親に作成した。local-only SHAを証拠のpinに使っていない。
- 採用、本番反映、利用負担の改善は未実施。新たな必須成果物や人間ゲートを追加する根拠は得られていない。

## 返却する採否の問い

「SRの作成・妥当性・完全性はプロダクト側に残し、提供済みSRの版と適用範囲を独立Alder実装レビューへ明示的に引き継ぐ」という最小変更を採用するか。採用なら別Taskで文言・package・回帰テストを変更する。研究上の検出率向上は採用理由にしない。
