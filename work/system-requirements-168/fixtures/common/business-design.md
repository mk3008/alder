# Support case受付と検索 — agreed synthetic Business Design
# Scope
顧客サポート担当者が顧客のcaseを受付し、担当tenant内のcaseを検索する。採用済みの業務条件は以下。技術方式の選択は本書に含めない。
# Object Case
## Information
- case_id
- tenant_id
- 件名
- 受付日時
# Activity Caseを受け付ける
## Who
サポート担当者
## How
### Input
- 顧客の申告
### Procedure
1. 受付を保存する。
2. case_idと受付済み状態を返す。
### Output
- case_idと受付済み状態
## Result
受付したcaseを後で検索できる。
# Activity Caseを検索する
## Who
サポート担当者
## How
### Input
- 検索対象のcase_id
### Procedure
1. 認証済み担当者が所属するtenantのcaseだけを取得する。
2. 他tenantのcaseにはアクセスを認めない。
### Output
- case_idと件名
## Result
自tenantのcaseの内容を確認できる。
# Exception
計画停止中は既存の紙受付を使い、再開時に転記する。過去の受付記録は維持する。
