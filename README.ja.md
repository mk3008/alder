# Alder

[English](README.md) | 日本語

**ユーザーと、業務設計書で話そう。**

Alderは、ユーザーとの業務合意を開発工程の外部資料にしません。  
合意した**業務設計（Business Design）**を正本に、業務改善、Check Item、AI実装、レビューまでをつなぎます。

専用フレームワークやruntime packageは不要です。業務設計書を置き、AIに読ませます。

## 30秒でわかるAlder

| 今どういう状態？ | Alderでやること |
| --- | --- |
| 業務の意味が不足・未決 | ユーザーと業務設計書を作り、レビュー・合意する |
| 今の業務は成立しているが、困っている | Problem / Painを業務設計書に記録し、Optimization Reviewで改善案を出す |
| 業務設計は合意済みで、システムとして実現したい | Check Itemを作って人間が確認し、AIに実装させる |
| 実装が業務設計どおりか確かめたい | 別のAIがレビューし、未決の業務判断だけを人間に戻す |

改善案は、出ただけでは仕様になりません。人間が採用したときだけ業務設計書を更新し、そこからもう一度実装へ進みます。

```text
ユーザー ↔ Business Design
              ├─ Problem / Pain → Optimization Review ──採用→ Business Design
              └─ Check Item → AI実装 → 独立レビュー
```

## 始める

新規プロジェクトでは、まずこの程度で十分です。

```text
product/
  docs/
    business-design/
    decisions/
    alder/
      review-knowledge.md
  src/
  tests/
```

1. 現在の業務を `docs/business-design/` に書く。
2. ユーザーと内容をレビューし、業務上の意味を合意する。
3. AIにCheck Itemを作らせ、人間が確認する。
4. AIに実装させ、別のAIまたはfresh contextでレビューする。

詳しい導入方法とコピーして使えるプロンプトは[導入ガイド](docs/adoption.md)にあります。

## 業務を改善したいとき

現在の業務は成立しているが、具体的な困りごとがあるなら、まず業務設計書に **Problem / Pain** を記録します。

そこから[Optimization Review](docs/optimization-review.md)を実行すると、AIが少数の代替業務案を出します。採否は人間が決めます。

## Business Graph（任意）

Business DesignはJSONへ投影し、外部ツールで可視化・解析できます。  
JSONは中間形式であり、正本は常にBusiness Designです。

[Business Graph JSON v1とexporter](docs/business-graph.md)

## 詳しく読む

| 知りたいこと | 文書 |
| --- | --- |
| 導入方法、Business Designの書き方、標準フロー | [Adoption guide](docs/adoption.md) |
| 業務改善提案 | [Optimization Review](docs/optimization-review.md) |
| 実装レビューの観点 | [Review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) |
| Business Design → Check Item → Test の追跡 | [Check Item traceability](docs/check-item-traceability.md) |
| Business Graph JSON / exporter | [Business Graph](docs/business-graph.md) |
| Alderの考え方と境界 | [Philosophy](docs/philosophy.md) |
