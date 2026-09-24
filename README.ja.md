# Alder

[English](README.md) | 日本語

**ユーザーと、業務設計書で話そう。**

要件は、ユーザーから聞き出し、確かめ、合意して初めて要件になります。  
だから正本は、開発者だけが読める仕様ではなく、**ユーザーと同じ言葉で読めて、指摘できる資料**であるべきです。

Alderでは、その資料を **業務設計（Business Design）** と呼びます。

ただし、ユーザーの発言をそのまま正解にはしません。  
誰が、いつ、何を受け取り、何を結果として渡すのかを自然言語で構造化し、前後業務、入出力、遷移、例外、結果をたどって、漏れや矛盾をレビューします。

さらに、現在の業務で **困っていること（Problem / Pain）** まで記録できれば、その同じ業務設計から改善案も検討できます。

これは新しいBPM理論を作る話ではありません。  
ユーザーと業務を理解し、自然言語の文書で合意し、設計と実装を照合するという古典的な分析・開発の考え方を、**AIが読み、レビューし、改善提案できる形に構造化する**のがAlderです。

**Alderは、業務設計書の定義と、それを使ったレビュー・改善・実装への流れを提供します。**

## Alderは何をしてくれるのか

| やりたいこと | Alder |
| --- | --- |
| ユーザーと業務を決めたい | 業務設計書を共通言語にして、業務上の意味を合意する |
| 要件の漏れやつながりを確かめたい | 業務の入出力・遷移・結果をたどってレビューする |
| 今の業務を改善したい | Problem / PainからOptimization Reviewで改善候補を出す |
| 合意した業務をシステム化したい | Check Itemを導き、AI実装と独立レビューにつなぐ |

```text
ユーザー ↔ Business Design
              ├─ レビュー ─────────────→ Business Design
              ├─ Problem / Pain → 改善提案 ─採用→ Business Design
              └─ Check Item → AI実装 → 独立レビュー
```

Business Designが常に業務上の正本です。  
改善候補や実装結果が、勝手にBusiness Designを上書きすることはありません。業務上の意味を変えるときは、人間が判断し、Business Designを更新・再合意します。

## 基本の使い方

1. ユーザーと話し、現在の業務・要求をBusiness Designに書く。
2. Business Designをレビューし、漏れ・矛盾・未決事項を整理して人間が合意する。
3. システム化するならCheck Itemを作り、人間が確認してAIへ実装を渡す。
4. 実装後は別のAIまたはfresh contextで、Business Designに照らしてレビューする。

現在の業務は成立しているが困りごとがある場合は、Problem / PainをBusiness Designへ記録し、[Optimization Review](docs/optimization-review.md)を使います。AIは候補を出しますが、採否を決めるのは人間です。

詳しい導入方法、Business Designの書き方、コピーして使えるプロンプトは[導入ガイド](docs/adoption.md)にあります。

## 詳しく読む

| 知りたいこと | 文書 |
| --- | --- |
| 導入方法、Business Designの書き方、標準フロー | [Adoption guide](docs/adoption.md) |
| 業務改善提案 | [Optimization Review](docs/optimization-review.md) |
| 実装レビューの観点 | [Review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) |
| Business Design → Check Item → Test の追跡 | [Check Item traceability](docs/check-item-traceability.md) |
| Business Designの可視化・解析用JSON | [Business Graph](docs/business-graph.md) |
| Alderの考え方と境界 | [Philosophy](docs/philosophy.md) |
