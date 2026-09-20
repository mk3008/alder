# 設定済み転送の実行に関する探索結果

対象版：history-input-H1 に提示された6ファイルのスナップショット。版識別は read-log.json の各 SHA-256 による。適用範囲は、既存の Transfer Setting と実行引数を受け取り、Dirty Key を固定化して判定・転送・結果記録する Transfer Execution。設定作成、変更検知方式、scheduler の提供、外部業務の成立性は対象外。

**人間レビュー前の考慮候補。以下の未記載論点はすべて「候補・未承認 / 要確認」であり、要件・欠陥・確定アサーションではない。** functional-considerations.md を適用した。入力の参照ラベルは追跡用に記載するだけで、リンク先は読んでいない。網羅性は主張しない。

## 対象機能の把握

入力は対象 Transfer Setting と任意の実行引数。Transfer Run を生成し、設定から Destination Link / Destination をたどる。Dirty Key、Dirty Key Processing、転送元現在値、Active Black から Work Item と判定結果を作り、モデルに応じて黒伝・赤伝・物理削除または no-op を成立させる。成功した黒伝は Active Black となり、immutable の成功した黒伝・赤伝には Lineage が伴う。完了した作業は Dirty Key Processing に結果を記録する。個別操作の成功後の状態は規定されるが、複数操作を含む実行が失敗した場合に、どこまで外部から確定結果として見えるかは明記されていない。

## 文書内の導出・既決事項

| ID | 具体的場面と決まる結果 | 入力内の根拠 | 未決の差分・扱い |
|---|---|---|---|
| D-01 | 同じ設定・リンクの処理済み Dirty Key が次回実行でも見つかる。処理済み記録を参照して除外し、同じ Work Item を再転送しない。別リンクの処理まで完了扱いにしない。 | concepts.json / dirty-key-processing の destination-link-dirty-key-processing-transfer-setting-processed、dirty-key-processing-processed-record-work-item、work-item の dirty-key-processing-processed-state-record に相当する末尾 rationale（ID: dirty-key-processing-transfer-execution-processed-state-record） | 二重転送を許すかは未決ではない。DB制約・ロックの選択はここでは問い直さない。 |
| D-02 | 同一キーの通知が繰り返されても、比較対象外列しか変わらなければ転送不要。同じ転送元状態を再び黒伝として積み増すことは認められない。 | concepts.json / transfer-target-decision: ignored-columns-only-is-no-transfer、black-transfer: black-transfer-destination-link-setting-source-context-state-2 | 比較式・NULL・型変換は本文が具体化対象外としているが、一般的な比較チェックリストを未記載要件として追加しない。 |
| D-03 | immutable の訂正では元黒を直接更新・削除せず、赤伝を経て新黒を追加する。赤伝は元黒を参照し、現在の転送元値の反転ではない。 | transfer-execution-process.md / Transfer Execution Main、concepts.json / red-transfer: red-transfer-black-physical-delete、red-transfer-destination-row-source-black-target-reference、destination: destination-row-red-transfer-produce-not-define-immutable | 成功時の転送表現は既決。失敗時にどの成功部分を残すかだけを H1-01 で分ける。 |
| D-04 | 転送中も Dirty Key が追記され、採番順と登録確定順が逆転する場面でも、番号や時刻を厳密な順序保証に使わない。 | concepts.json / dirty-key: dirty-key-management-transfer、dirty-key-transfer-management-2、responsibility-b2adcf08 | 順序保証の有無は既決。新たに CDC の順序制御を core の責務にしない。 |
| D-05 | 日付下限制御が必要な mutable Destination はエラー。immutable では締め済み日付への新規計上を補正する。 | concepts.json / posting-date-lower-bound: destination-posting-date-lower-bound-mutable-transfer-model、destination-row-closed-period、destination-row-2 | mutable でも締め制御を許すか、締め済みなら常に転送拒否するかは再質問しない。 |
| D-06 | 保存された source_sql_body / 生成SQLを実行する場面では、登録時に bound data として保存できたことだけで任意SQL実行が許可されたとは扱えない。 | common-contract.md 全文、SYSTEM_SCOPE.md / Global Invariants | application-owned の review/approval 境界を確立する必要は既決。未提示の Rules 本文を推測した追加要件にはしない。 |

上記は既存記述から決まる結果であり、必要なら既存要件の確認へ渡せる。以下はこの表と異なり、文書だけでは期待結果を選べない問いである。

## 文書外の一般知識を使った未記載論点

### H1-01 — 訂正の途中で失敗した場合、既に成立した赤伝を確定結果として残すか

- **対象機能**：immutable model の Transfer Execution、特に Red Transfer → Black Transfer → Record Processing Result。
- **具体的場面**：現在の黒伝は +100。今回の現在値 +150 に対し訂正と判定される。赤伝 -100 の書込みとそれに対応する Lineage・Active Black の更新は成立可能だが、続く新黒 +150 が転送先制約違反などで失敗する。
- **人間から見た結果差**：訂正全体を未確定として戻すなら、失敗後も +100 が有効である。赤伝まで確定して残すなら、失敗後は +100 と -100 の履歴があり Active Black はなく、+150 はまだ存在しない。どちらも「成功した赤伝の後は元黒を Active Black としない」「新黒が成功すれば新黒が Active Black」という既存規則を守れる。前者では赤伝を含む訂正全体が未成立であり、後者では赤伝部分だけが成立している。
- **入力内の根拠（適用性）**：transfer-execution-process.md / Transfer Execution Main は赤伝、新黒、結果記録の順。concepts.json / active-black: red-transfer-removes-active-black、new-black-becomes-active。red-transfer: lineage-red-transfer-destination-row-source-target-produce。transfer-run: destination-transfer-run-lifecycle-state は Run 状態とキー別結果を区別する。duplicate-control: not-define-db はトランザクション・リトライ方式を規定しない。
- **未決の差分**：問うのはSQLやロック方式ではなく、途中失敗時に利用者が見る訂正結果の確定単位である。順序だけでは一括確定と途中確定を区別できない。Run を failed にするだけでもこの差は埋まらない。
- **一般知識と適用推論**：複数のDB書込みでは後段だけが制約違反等で失敗し得る。また、複数操作の確定範囲により失敗後の可視結果が変わる、という一般知識から作った問い。外部資料は参照していない。この製品が現に部分確定するという観測ではない。
- **選択肢・影響**：①少なくとも一つの訂正（赤伝＋新黒）を一体で確定する。失敗中も前回の有効値を保ちやすい。②赤伝などの完了部分を残して復旧する。失敗中は取消だけが反映された状態となり、新黒を成立させるまでの見え方と再開時の扱いを決める必要がある。どちらでも、確定した操作の Lineage / Active Black の保証と二重転送防止は守る。未完了の訂正を最終処理済みとして除外する案は選択肢に含めない。
- **追加仮定**：訂正を行う設定があり、新黒の作成が失敗し得ること。どの制約があるか、外部利用者がどの頻度で読むかは未提示。一括確定を Run 全体にまで広げることは提案していない。
- **未承認状態**：候補・未承認 / 要確認。期待する失敗後の結果を選ぶ場合は Business Design へ戻して人間が確定する。
- **既決／見送り照合**：成功時の赤黒の意味と処理済み記録は既決として維持。個別のトランザクション実装、retry 回数、監視機構の提案は見送り。

### H1-02 — 実行引数の検索条件から外れたキーを、その実行での取消対象に含めるか

- **対象機能**：任意実行引数を利用する基礎SQLと Prepare Work Item / Transfer Target Decision の接続。
- **具体的場面**：支店Aの source key K は以前に転送済みで Active Black がある。K の未処理 Dirty Key がある時、同じ Transfer Setting を支店Bという実行引数で起動する。基礎SQLが明示した支店条件により K は結果に現れないが、元テーブル上では支店Aの行が存続している。
- **人間から見た結果差**：K も今回の再評価対象に固定化し、条件適用後のデータソース不存在と扱うなら、モデルに応じて赤伝／物理削除へ進み得る。一方、支店Bを今回実行する範囲として扱い、K は今回の Work Item に入れず未処理のまま残すなら、支店Aの既存転送先行は維持される。
- **入力内の根拠（適用性）**：concepts.json / transfer-run: transfer-execution-run-setting-base-sql-optional-arguments は支店・対象年月等を引数例とし、基礎SQLの条件に利用可能とする。transfer-setting: base-sql-produce-sssql-guide-overview-where は任意検索条件を基礎SQLの SSSQL notation とし、暗黙WHERE追加を禁止する。work-item: dirty-key-target-work-item は Dirty Key から対象を固定化する。physical-delete-transfer: physical-delete-transfer-source-exists-active-black-2 は現在値不存在かつ Active Black ありで削除相当が成立する。dirty-key の dirty-key-decide-management はクエリから取得されなくなることが削除相当となる例を示す。
- **未決の差分**：いったん「今回評価する K の現在値は不存在」と確定した後の削除表現を問い直していない。その前に、実行条件の範囲外の K まで不存在判定に渡すのかが問題である。提示入力には、実行範囲の限定とデータソースの構成条件を区別する規則が見当たらない。基礎SQLの正本性を維持したままでも、今回固定化するキーの範囲は別に選び得る。
- **一般知識と適用推論**：抽出結果に行がない理由には、元データの不存在と検索範囲外の両方があり得る、という一般知識から作った問い。引数の具体解釈は設定側に依存するので、全設定で事故が生じるという主張ではない。外部資料は参照していない。
- **選択肢・影響**：①明示された実行範囲外のキーは今回対象外とする契約を置く。範囲外の転送先は維持され、当該 Dirty Key の処理は残る。その範囲を入力・設定からどう明示できるかは別途具体化が必要であり、engine が検索条件を推測して足すことはしない。②条件適用後の基礎SQL結果を今回の全再評価候補についての現在状態として扱う。条件外になった既存黒伝の取消も実行結果に含む。両者を区別できない設定・引数では実行を受け付けない、と契約を限定する選択もあるが、拒否を必須要件と提案しているのではない。
- **追加仮定**：基礎SQLに実行引数による絞込みがあり、同じ設定で複数の支店などを扱い、今回の条件外にも未処理 Dirty Key と Active Black がある場合に限る。SSSQL notation の未提示の詳細は仮定しない。そもそも引数が再評価範囲を限定しない設定では適用しない。
- **未承認状態**：条件付きの候補・未承認 / 要確認。引数で絞った実行の意味を人間が選ぶ必要があれば Business Design へ戻す。
- **既決／見送り照合**：実行引数に転送対象行を直接渡す案、基礎SQLへの暗黙検索条件追加、Dirty Key 自体への処理済み書戻しは既決の禁止に反するので採用しない。変更検知方式の再設計も求めない。

## 閉じた論点・今回見送った論点

- 同時起動を理由に二重転送禁止や Active Black 最大1件を選択制にする案は閉じた。既存不変条件が答えを持つ。同時実行の制御方式だけでは新たな人間向け結果差にならない。
- 異なる Destination Link が元データの異なる時点の値を使ってよいか、という案は閉じた。destination-link の destination-link-source および destination-link-transfer-setting-source-reference-produce-distinguish は同一スナップショットからの一貫した生成を述べる。
- 日付補正や採番式の再評価だけで、同じ転送元状態の通知ごとに黒伝を増やす案は閉じた。既存の二重転送禁止を弱める選択肢にはできない。比較の技術的具体化だけを追加機能要件とは扱わない。
- 中間イベントを全件再現する、転送先を将来も常に転送元現在値と一致させる、といった保証は追加しない。Dirty Key は操作指示ではなく、black-transfer の black-transfer-source-destination-reference-not-guarantee-match は将来の値一致を保証しない。
- scheduler、CDC、外部adapter の実装方式、転送先業務そのものの変更は scope 外として見送った。
- 他の設定と同じ転送先行を取り合う場面や外部アプリが転送済み黒伝を書き換える場面は、今回の入力にない利用契約の追加仮定が大きく、上記2候補に絞るため見送った。不問と確定したものではない。既存の行対応・由来追跡・有効黒伝の保証はそのまま残る。

未承認候補を確定要件へ変換していない。人間が意味・保証を追加する場合は先に Business Design に反映し、確定後に Interface / Check 等へ導出する。
