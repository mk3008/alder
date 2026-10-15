# 発見に使った一次資料

参照日: 2026-09-20。外部の現象・設計上の例を裏付ける資料であり、会議室の要件・対象範囲を承認する資料ではない。以下は短い要約。製品への適用はoutput.mdの推論として分離する。

| ID | 一次資料・使用箇所 | 確認したこと | この製品について決めないこと |
| --- | --- | --- | --- |
| S01 | [RFC 3339 §4.2 / §4.4](https://www.rfc-editor.org/rfc/rfc3339.html#section-4.4) | ローカル日時の解釈にはUTCとの関係が問題になる。オフセットのない時刻を異なる環境で受け渡すと同じ瞬間を示すとは限らない | 複数時間帯の対応、UTC入力、RFC形式をこの製品に必須としない |
| S02 | [PostgreSQL 18 §9.9.5 Current Date/Time](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT) | transaction_timestamp/CURRENT_TIMESTAMPはトランザクション開始時刻、statement_timestampは文開始時刻、clock_timestampは呼出時の実時刻という違いがある | PostgreSQL採用や関数選択を指示しない。「現在」という語でも観測点が異なるという発見契機だけに使う |
| S03 | [RFC 9110 §13.1.1 If-Match](https://www.rfc-editor.org/rfc/rfc9110.html#name-if-match) | 並行して同じ資源を更新する際の意図しない上書きに、条件付き要求を用いる例が示されている | HTTP、ETag、楽観ロック、古い状態からの操作拒否を製品要件にしない |
| S04 | [AWS Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) の Late arriving requests / Same client request ID, different intent | 再送の遅着後に対象が既に変化・削除されている場合や、要求の同一性と意図の違いが問題になる。扱いはサービスによって異なる | AWSと同じ保持期間、キー方式、API応答を要求しない |

類似機能との比較として使用する共通性は、S01/S02では日時を比較して受理する機能、S03では同じ識別対象を後から変更する機能、S04では状態を作る呼出しと結果喪失が共存する機能。資料に同じ業務名が出ることは必要条件にしない。資料が提案する実現手段と、問いの発見を分ける。
