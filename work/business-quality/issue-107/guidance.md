# 実験用の最小 optional Quality guidance

Business Design に、実際の依頼者が示した「業務が成立したとみなすための許容条件・必要な性質」があり、通常の Why / When / Procedure / Result / Exception だけに埋めると成立の判断が読み取りにくい場合に限り、草案内で暫定的に **Quality（業務品質要求）** と分けてよい。根拠となる発言と対象業務、確認できる条件を短く書く。既存の欄でも自然かつ明瞭なら新しい見出しを作らず重複を避ける。全 Activity に必須化しない。

Quality は望ましい成立条件。Problem は現在確認された未達や不都合、Pain はその程度・現場負担として別に書く。未達の実績がない Quality から Problem を捏造しない。明示された事実や数値を保持し、不明な閾値や例外の判断は人間へ質問する。可用性・性能・セキュリティ等のカテゴリ一覧を埋めない。技術構成、暗号方式、DB、クラウド、冗長方式は Business Design の品質条件に採用せず、システム設計の候補として分ける。この guidance は実験用であり、Alder の正式 grammar や exporter を変更しない。
