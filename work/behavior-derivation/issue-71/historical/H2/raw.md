# 設定済み転送の実行 — 独立探索 H2

対象版は、このディレクトリに提示された6ファイルの内容（厳密な版識別は read-log.json の SHA-256）である。適用範囲は、設定済みの Transfer Setting を実行し、Dirty Key から Work Item を作成、転送対象判定、転送先への反映、処理結果記録までを行う機能。以下は **人間レビュー前の考慮候補** であり、要件、欠陥認定、承認済み Check ではない。網羅性は主張しない。

## 機能の把握

外部入力は一つの Transfer Setting と実行引数。設定から Destination Link / Destination をたどり、Dirty Key、処理済み記録、転送元現在値、Active Black を読む。Work Item を固定化して判定結果を持たせ、モデルに応じて転送先行、Active Black、必要な Lineage を変え、終了した作業を Dirty Key Processing に記録する。個別転送の成功後に満たす状態は記載されているが、複数作業の結果をいつ外部へ確定するかは明示されていない。

根拠は transfer-execution-process.md の Main / 各 detail、change-detection-dirty-key-registration.md の Transfer Execution、concepts.json の transfer-execution / work-item / transfer-run。common-contract.md により PostgreSQL が対象。参照された adoption 等の本文は入力ではなく、参照していない。

## 文書内の導出・既決事項

- H2-D01：同じ Setting・Link・source key の同じ状態を二重に転送しない。Active Black はその文脈で最大一つ。根拠：concepts.json / black-transfer / black-transfer-destination-link-setting-source-context-state-2、active-black / unique-per-context。並行実行でも二重黒伝を許すか、という問いは新規候補にしない。ロックや制約の選択もここでは要求しない。
- H2-D02：immutable と insert_only で転送元と Active Black が共にない Dirty Key は no-op として処理済みにし、再出現は新しい Dirty Key で評価する。根拠：transfer-target-decision / immutable-no-source-no-active-black-is-no-op、insert-only-no-source-no-active-black-is-no-op。イベント逐次再生や、古いキーを無期限に再評価する案は既決に反する。
- H2-D03：比較は補正後に Destination へ保持する値を対象とし、補正前日付だけの変更は転送差分にしない。根拠：transfer-target-decision / ignored-columns-only-is-no-transfer。補正前後のどちらを比較するかは再質問しない。
- H2-D04：同一転送元スナップショットを複数 Destination へ一貫して流す関係は既決。根拠：destination-link / destination-link-source、destination-link-transfer-setting-source-reference-produce-distinguish。宛先ごとに転送元を別時点で読み、同じ元行の金額が宛先間で変わることを無条件で許す案は出さない。
- H2-D05：処理済み除外は Setting / Link 文脈で行い、Run 引数を変えただけで同じ Dirty Key の処理済みを取り消す根拠はない。根拠：dirty-key-processing / dirty-key-processing-processed-record-work-item、destination-link-dirty-key-processing-transfer-setting-processed、transfer-run / transfer-run-setting-base-sql-optional-arguments。引数別再転送を新しい機能として追加する案は見送る。

## 文書外の一般知識を使った未記載論点

### H2-C01：一部の転送だけ成功した実行が、どこまで確定結果を残すか

- 対象機能：Transfer Execution の結果確定と失敗後の再実行。
- 具体的場面：一つの Run に source key A と B があり、それぞれ同じ二つの Destination Link L1、L2 へ転送する。A の両宛先への転送が済み、B の L1 が済んだところで L2 の列制約違反により継続できなくなる。
- 結果差：実行全体を未反映に戻すなら、利用者からは A も B も今回の反映なしとなる。source key と全 Link を単位に確定するなら A の両宛先だけ残る。Link 単位で確定するなら A 全体と B の L1 が残る。成功済み単位の転送先行、Active Black、必要な Lineage、Dirty Key Processing が整合していれば、それぞれの個別成功時規則を守りながら、見えるデータと再実行時に残る作業が異なる。
- 入力内の根拠（適用性）：transfer-execution-process.md / Main は Red、Black、Record Processing Result の順序を示すがトランザクション実装を定義しない。concepts.json / destination-link / destination-link-reference は Link を独立した転送単位とする。dirty-key-processing / destination-link-dirty-key-processing-transfer-run-setting は一 Run が複数 Link を処理し得ることを説明する。transfer-run / destination-transfer-run-lifecycle-state は Run 状態と個別宛先成否を区別する。
- 未決の差分：独立した転送単位であることや同じスナップショットを流すことから、失敗時の確定範囲、部分反映の外部可視性までは決まらない。具体的な DB トランザクション方式ではなく、利用者が結果として受け入れる途中成功の境界を確認する論点。
- 一般知識と推論：複数の DB 書込みの途中でデータ制約違反などが起き得る、確定単位によって残る成功結果が異なるという一般知識を使った。外部資料は参照していない。上記の境界がこの製品で必要かは適用推論であり、入力から導いた期待結果ではない。
- 選択肢・影響：Run 全体なら部分反映を避けられるが成功済み分もやり直す。source key と全 Link 単位なら元行の宛先一式を保ちつつ他キーの成功を残せる。Link 単位なら成功範囲を細かく残せるが宛先間の部分反映があり得る。どれを選んでも二重転送防止、個別成功結果の追跡、同じ元スナップショットを一貫して流す既決保証は維持する。再実行で別スナップショットを無造作に混ぜてよいという提案ではない。
- 追加仮定：一 Run に複数キー・複数 Link が入り、一方の書込みだけ失敗し得る設定。複数 Link 自体は入力で許可される。具体的な列制約の存在は例示上の未提示前提。
- 未承認状態：**候補・未承認 / 要確認**。結果確定の意味を選ぶ場合は Business Design に戻す。原子性を特定の粒度で要件化していない。
- 既決／見送り理由：二重転送防止そのものは H2-D01 で閉じた。ここではそれを守る複数の失敗結果の違いだけを残す。SQL の実行方式や状態値の命名は候補から除外した。

### H2-C02：一つの実行に含まれる異なる source key の現在値を、同じ時点でそろえるか

- 対象機能：Prepare Work Item と転送元現在値の取得。
- 具体的場面：同じ Setting で A、B の Dirty Key が既に固定化されている。元テーブル上の A=100、B=200 が一つの更新で A=90、B=210 になる。Run が A を読んだ後、B を読む前にその更新が確定する。
- 結果差：全作業に共通の参照時点なら、今回の結果は A=100、B=200、または A=90、B=210 のいずれかになる。キー別の参照時点なら A=100、B=210 という組も残り得る。後続の新しい Dirty Key で再評価できても、今回の Run が示す転送先の組合せと履歴は違う。
- 入力内の根拠（適用性）：concepts.json / black-transfer / black-transfer-source-destination-reference は転送時点で参照した値のスナップショットとする。work-item / dirty-key-transfer-execution-change-detection-history-target は作業対象の固定化を要求する。transfer-run / transfer-run-source-hold はスナップショットの時点を説明する情報を任意で持てる。destination-link / destination-link-source は複数宛先へ同じスナップショットを流す。
- 未決の差分：どの Dirty Key を処理するかの固定化と、一 Run に含まれる全 source key の読取り時点の統一は別である。複数宛先への一貫性は既決だが、異なる source key 間まで同じ参照時点を要求するかは明記されていない。「同じスナップショット」が Run 全体を指す既承認の意図なら、この候補はその根拠を明示して閉じられる。
- 一般知識と推論：実行中の元データ更新と複数回読取りでは、読取りの境界によって同時点には存在しなかった値の組合せが得られ得る、という一般知識からの問い。特定 PostgreSQL 分離レベルの挙動を引用・検証したものではない。
- 選択肢・影響：Run 内の元データを共通の参照時点にそろえるなら、複数キーにまたがる一時点の結果として説明できる。キーごとに時点を決めるなら、全体の同時点性を保証せず、各キーの参照値を反映した結果として説明する。後者を「今回は不問」とする場合も、各キーから複数 Link への一貫性、二重転送防止、処理済み記録は維持する。必要な意味が決まった後の分離レベルや固定化方式は技術選択でよい。
- 追加仮定：Run に複数キーが含まれ、その間に元データが更新される。A と B の合計などの業務制約を transfer の責務に追加する仮定は置かない。例示の 100/200/90/210 は読取り結果差を可視化するための値。
- 未承認状態：**候補・未承認 / 要確認**。Run 全体の同時点性を新たな保証とする場合だけ Business Design で意味を確定する。
- 既決／見送り理由：将来の元データとの永続的一致は black-transfer / black-transfer-source-destination-reference-not-guarantee-match により保証しないことが既決。宛先別の同一元行不整合は H2-D04 で閉じ、本候補とは区別した。

## その他の見送り

- CDC の取こぼし防止、登録と元テーブル更新の連携方式：外部 producer の実装・業務相関を再設計する話であり、SYSTEM_SCOPE.md / Out of Scope と DFD / Boundary に従い対象外。
- Dirty Key の連番や時刻だけを厳密な順序とする案：dirty-key / dirty-key-transfer-management-2、responsibility-b2adcf08 が明示的に禁止。新規判断ではない。
- mutable での日付下限制御：posting-date-lower-bound / destination-posting-date-lower-bound-mutable-transfer-model によりエラーが既決。
- insert_only の更新・削除反映：transfer-target-decision / insert-only-active-black-is-no-op が作成済みなら値や存在にかかわらず no-op と決めている。destination の古い二値の説明を根拠に第三モデルを削除しない。
- 外部アプリが転送先を直接改変した後の自動修復：転送先が外部所有であることは分かるが、通常運用で同じ行を別主体が直接改変する前提は提示されていない。新しい修復機能を持ち込まず今回見送り。自動修復は保証せず、個別転送が成功した場合の既存不変条件は緩めない。
- 保存期間、性能目標、監視機能、一般的な権限一覧：具体的な結果差を持つ本入力に即した追加条件へ絞れていないため候補化しない。

候補の意味・保証を人間が採用する場合は、まず Business Design に反映して確定し、そこから Interface / Check を導出する。未承認候補をテスト期待値や実装要件に変換していない。
