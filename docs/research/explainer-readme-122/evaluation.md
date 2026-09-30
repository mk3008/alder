# README理解度 A/B 評価プロトコル

Issue: #122

## 目的

現行READMEとexplainer方式の比較用READMEについて、文章の好みではなく、初見読者が正しく判断・行動できるかを比較する。

## A/B

- A: repository rootの現行 `README.ja.md`
- B: `docs/research/explainer-readme-122/prototype.ja.md`

評価者には片方だけを渡し、もう片方を見せない。
順序効果を避けるため、別のfresh contextを使う。

## 読者条件

`persona.md` を共通条件として使う。
README以外のAlder資料は評価中に参照させない。

## 質問

### Gist

1. Alderは何を解決するためのものか。2文以内で説明する。
2. Alderで人間が保持する責任は何か。
3. AIへ委譲される責任は何か。

### Boundary

4. Business DesignとSystem Designをどう区別するか。
5. テストが成功したとき、それだけで業務上の判断が承認されたと言えるか。
6. Alderは特定のアーキテクチャを要求するか。

### Actionability

7. 新しい小規模プロジェクトでAlderを試す最初の3〜5手を挙げる。
8. 実装中に未決の業務ルールが見つかった場合、どう扱うか。

### Noise / prioritization

9. READMEの内容から「Alderを理解するうえで最重要」と思った事項を3つ挙げる。
10. 読まなくても最初の試行には困らないと思った事項を挙げる。

## 導入タスク

次の架空タスクを与える。

> 会議室予約システムをAIに実装させたい。予約、変更、キャンセル、管理者による停止が必要だが、細かなルールは一部未決である。Alderを使うなら、実装開始までに何を準備し、未決事項をどう扱うか。

評価者に手順を書かせる。

## 判定観点

点数による総合優劣は付けない。各回答について次を記録する。

- source-supported: Alder一次資料と矛盾しない
- boundary-correct: 人間 / AI、Business / System、Design / Testの境界を取り違えない
- actionable: 実際の次行動に変換できる
- overclaim: READMEにない保証を推測していない
- noise: 補助情報を主要概念として取り違えていない

A/Bそれぞれで誤読箇所と離脱しやすい箇所を記録し、差分を説明する。

## 研究上の注意

- explainer方式が良いという前提で評価しない
- Bが短いこと自体を品質とみなさない
- 現行READMEが担うリリース情報・参照索引の役割は、理解教材としての評価と分ける
- fresh-readerの回答は人間読者の実測ではなく代理指標である
- README改善と、Business Design / 要件定義書への一般化は別の結論として扱う

## 次段階

A/Bで意味のある差が出た場合だけ、次を研究候補とする。

1. Business Designの読者ペルソナを明示するとレビュー品質が変わるか
2. Business Designの各主張を実物・検査項目と結びつけると誤読が減るか
3. 要件定義書に「読後に何を判断できるべきか」という検証可能な目的を置けるか
4. fresh-readerを要件レビューの補助ゲートとして使えるか
