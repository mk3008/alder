# Documented decisions and assumptions
D1: 受付APIのstatus=acceptedは保存成功を表す。外部通知の送達は保証しない。
D2: 計画停止中の紙受付は合意済み。具体的な配備と復旧方式は製品の技術担当者が管理する。
D3: このレビューの実装対象は6つの独立した変更候補。case01からcase06を互いの代替や一連のデプロイとして扱わない。
Each candidate uses synthetic identifiers and fake addresses only. No real user data is present.
