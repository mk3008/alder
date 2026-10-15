# Business / Interface / Check / Test / Code 対応例

正本は[resolved設計](../../work/behavior-derivation/stage2/inputs/meeting-room.md)、Checkは[同版のc3初稿](../../work/behavior-derivation/stage4/outputs/meeting-room-c3.md)。コードと既存テストはM1/M2承認前の固定版。行番号・版・所属の正本は[mapping.json](../../work/functional-interface/mapping.json)。この文書は同じJSONから生成する。

**24 Checkの所属は整理したが、意味の詳細評価は12条項に限定した。mappedはCheck全文の検証完了を意味しない。**

## Checkの所属

| Check | 主担当 | 接続・共有制約の関連先 |
| --- | --- | --- |
| MR-01 | IF-01 | IF-02 |
| MR-02 | IF-01 | — |
| MR-03 | IF-01 | IF-02, IF-04 |
| MR-04 | IF-01 | IF-02 |
| MR-05 | IF-02 | IF-03, IF-04, IF-05 |
| MR-06 | IF-02 | — |
| MR-07 | IF-02 | IF-04 |
| MR-08 | IF-03 | IF-02, IF-04, IF-05 |
| MR-09 | IF-03 | IF-02 |
| MR-10 | IF-02 | — |
| MR-11 | IF-04 | IF-01 |
| MR-12 | IF-04 | — |
| MR-13 | IF-04 | IF-05 |
| MR-14 | IF-04 | IF-03 |
| MR-15 | IF-04 | IF-05, IF-06 |
| MR-16 | IF-05 | IF-01, IF-02, IF-06 |
| MR-17 | IF-05 | IF-03 |
| MR-18 | IF-04 | IF-05 |
| MR-19 | IF-06 | IF-01, IF-02, IF-04 |
| MR-20 | IF-06 | IF-04, IF-05, IF-07 |
| MR-21 | IF-06 | IF-07 |
| MR-22 | IF-07 | IF-01, IF-02, IF-04 |
| MR-23 | IF-07 | IF-04, IF-05 |
| MR-24 | IF-07 | IF-06 |

## 意味を照合した条項

### M01 — 有効な未来区間で0/1/複数の選択対象を返す

- 対応: IF-01 → MR-01。Business根拠: L29–29, L97–107。
- 判定: **既存検査証拠の不足/部分対応**。
- 実装: [MeetingRooms.availability](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L146-L155)
- 既存テスト: [BookingTests.test_full_lifecycle_persistence_and_released_slots](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L64-L81)
- アサーション/観測: 既存テストは初期3室、予約後2室、取消後3室をassert。P2で0/1/3室を観測。
- 範囲と注意: 既存20件に空一覧/1候補の直接assertは確認できない。P2は研究probeであり製品回帰追加ではない。

### M02 — 開始=検索時点・過去は予約候補にしない

- 対応: IF-01 → MR-02。Business根拠: L97–107, L387–387。
- 判定: **実装対応差**。
- 実装: [MeetingRooms.availability](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L146-L155)
- 既存テスト: [BookingTests.test_interval_validation_and_past_availability](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L121-L133)
- アサーション/観測: 旧テストは過去区間で3室を返すことをassert。P1は過去/同時点で1候補を返した。
- 範囲と注意: コードもテストも存在するが新M1と逆の期待値。存在だけでmappedにしない。旧設計との版差。

### M03 — 同室の重複を除外し隣接・他室を区別する

- 対応: IF-01, IF-02 → MR-03, MR-07。Business根拠: L99–105, L349–355。
- 判定: **mapped（記載条項のみ）**。
- 実装: [MeetingRooms.availability](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L146-L155) / [MeetingRooms.reserve](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L157-L171) / [MeetingRooms.no_overlap](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L139-L144)
- 既存テスト: [BookingTests.test_all_overlap_shapes_and_touching_boundaries](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L83-L96)
- アサーション/観測: 重複の各形状でreserve拒否とavailabilityからの除外、隣接/別室の予約成功を確認。
- 範囲と注意: この行は時間帯/占有条項のみ。MR-07の同時性はM05。未来検索はM02。

### M04 — 予約の同一性・本人・登録日時を後続操作へ渡す

- 対応: IF-02, IF-04, IF-05 → MR-05, MR-11, MR-16。Business根拠: L43–60, L146–155, L193–212, L248–257。
- 判定: **mapped（記載条項のみ）**。
- 実装: [MeetingRooms.reserve](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L157-L171) / [MeetingRooms.change](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L173-L185) / [MeetingRooms.cancel](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L187-L193)
- 既存テスト: [BookingTests.test_full_lifecycle_persistence_and_released_slots](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L64-L81)
- アサーション/観測: 返されたidで再接続後にchange/cancel。booker/registered_us、変更時のid/purpose/state保持、取消日時と枠解放をassert。
- 範囲と注意: 返答を受け取ってID既知の経路。結果喪失後のIF-03の証拠ではない。

### M05 — 同時要求でも占有が重複せず変更の敗者の元予約を保つ

- 対応: IF-02, IF-04 → MR-07, MR-13。Business根拠: L200–206, L350–355。
- 判定: **mapped（記載条項のみ）**。
- 実装: [MeetingRooms.transaction](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L94-L116) / [MeetingRooms.reserve](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L157-L171) / [MeetingRooms.change](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L173-L185) / [MeetingRooms.no_overlap](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L139-L144) / [reservation_insert_guard / reservation_update_guard / cancelled_is_terminal](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/schema.sql#L28-L52)
- 既存テスト: [BookingTests.test_concurrent_reservations_have_one_winner](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L243-L245) / [BookingTests.test_concurrent_changes_keep_loser_original](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L247-L254) / [BookingTests.test_concurrent_reserve_and_change](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L256-L263)
- アサーション/観測: 4予約要求で1成功、2変更で1成功かつ敗者の全元情報保持、予約対変更で重複なしをassert。
- 範囲と注意: Python検査/transaction/SQLの複数箇所へ対応。公平性・無限再試行等の保証は含まない。

### M06 — 保存結果を失いIDを知らなくても本人が保存確認・対象特定して継続する

- 対応: IF-03 → MR-08。Business根拠: L43–56, L159–161, L387–387。
- 判定: **実装対応差**。
- 実装: 満たす利用者経路を確認できない。
- 既存テスト: 対応する確定検査なし。
- アサーション/観測: 旧CLIは予約照合操作なし。P4は保存済み1件に対する再予約がoverlapとなるだけと確認。
- 範囲と注意: owned(db,id)はID既知を前提とする内部検査。評価者SQLは利用者の経路ではない。旧実装の明示されたPython/CLI契約の範囲でmissing。
- 不採用の対応候補: [MeetingRooms.owned](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L127-L136) / [parser](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/cli.py#L13-L33) / [main](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/cli.py#L52-L77)

### M07 — 未保存での中断確認・再試行を照合契約に含める候補

- 対応: IF-03 → MR-09。Business根拠: L159–161。
- 判定: **人間確認が必要**。
- 実装: 未承認候補のため確定した実装対応を評価しない。
- 既存テスト: 対応する確定検査なし。
- アサーション/観測: c3が候補・未承認と明記。M2の起点は保存後の結果喪失。
- 範囲と注意: 未保存までの適用を人間が採用/修正/除外するまで実装gapに数えない。人間の承認待ちで研究を止めない。

### M08 — 変更拒否後に元予約を確認し同じ対象の取消へ続行する

- 対応: IF-04, IF-05 → MR-13, MR-15, MR-16。Business根拠: L200–208, L248–253。
- 判定: **既存検査証拠の不足/部分対応**。
- 実装: [MeetingRooms.change](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L173-L185) / [MeetingRooms.cancel](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L187-L193) / [MeetingRooms.owned](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L127-L136) / [MeetingRooms.transaction](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L94-L116)
- 既存テスト: [BookingTests.test_change_excludes_self_and_failed_change_preserves_original](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L98-L106) / [BookingTests.test_cancel_while_unavailable_remains_cancelled_after_resume](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L189-L201)
- アサーション/観測: 各既存テストは拒否時保持と取消を別々にassert。P5は変更先不可→保持→同じID取消→枠解放を連続観測。
- 範囲と注意: 元のテストにこの連続シナリオの直接証拠はない。部分証拠は存在する。1Check=1Testを要求せず、人間が合成証拠の十分性を判断する。

### M09 — 対象なしで他対象を代用せず操作不成立とする

- 対応: IF-02, IF-04, IF-05, IF-06, IF-07 → MR-10, MR-14, MR-17, MR-21。Business根拠: L29–29, L43–43, L146–146, L193–206, L244–251, L289–301, L333–343。
- 判定: **mapped（記載条項のみ）**。
- 実装: [MeetingRooms.room](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L119-L125) / [MeetingRooms.owned](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L127-L136) / [MeetingRooms.reserve](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L157-L171) / [MeetingRooms.change](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L173-L185) / [MeetingRooms.cancel](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L187-L193) / [MeetingRooms.set_available](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L195-L204)
- 既存テスト: [BookingTests.test_missing_inputs_and_records](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L135-L140) / [BookingTests.test_change_excludes_self_and_failed_change_preserves_original](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L98-L106)
- アサーション/観測: room_not_found / reservation_not_foundと予約全行の保持をassert。P3はresume側も観測。
- 範囲と注意: この行は対象不在の拒否だけ。正しい対象の再選択や中断時の発見経路全体をmappedにはしない。

### M10 — 利用不可中でも取消でき、再開しても取消事実と非占有を保つ

- 対応: IF-05, IF-07 → MR-16, MR-17。Business根拠: L248–257, L339–339, L349–356。
- 判定: **mapped（記載条項のみ）**。
- 実装: [MeetingRooms.cancel](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L187-L193) / [MeetingRooms.owned](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L127-L136) / [MeetingRooms.set_available](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L195-L204) / [MeetingRooms.availability](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L146-L155)
- 既存テスト: [BookingTests.test_cancel_while_unavailable_remains_cancelled_after_resume](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L189-L201) / [BookingTests.test_authority_and_cancelled_terminal_state](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L108-L119)
- アサーション/観測: 取消状態/時刻、再開後の保存行と候補復帰、再取消/変更拒否をassert。
- 範囲と注意: 取消の通信再試行方式や表示は保証しない。

### M11 — 不可化/再開で維持予約の事実・占有を保持し、変更済み予約は新しい枠を占有する

- 対応: IF-06, IF-07, IF-04 → MR-20, MR-22, MR-23。Business根拠: L293–301, L337–339, L356–357。
- 判定: **mapped（記載条項のみ）**。
- 実装: [MeetingRooms.set_available](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L195-L204) / [MeetingRooms.change](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L173-L185) / [MeetingRooms.availability](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L146-L155)
- 既存テスト: [BookingTests.test_unavailable_preserves_all_reservations_and_resume_occupancy](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L152-L171) / [BookingTests.test_move_from_unavailable_room_preserves_facts_and_checks_destination](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L173-L187) / [BookingTests.test_cancel_while_unavailable_remains_cancelled_after_resume](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L189-L201)
- アサーション/観測: 複数予約保持・再開後の占有、別室への移動後の旧枠解放/新枠占有、取消後の非占有を別テストでassert。
- 範囲と注意: MR-23のA移動/B取消/C維持が同一室で混在する具体例そのものは未実行。mappedは列挙した条項と別々の証拠の範囲。

### M12 — 予約者の操作と管理担当者の判断を区別する

- 対応: IF-04, IF-05, IF-06, IF-07 → MR-18, MR-19。Business根拠: L17–21, L181–181, L232–232, L277–277, L321–321。
- 判定: **mapped（記載条項のみ）**。
- 実装: [MeetingRooms.owned](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L127-L136) / [MeetingRooms.set_available](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L195-L204) / [Actor.require](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L22-L24) / [identity](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/cli.py#L36-L49)
- 既存テスト: [BookingTests.test_authority_and_cancelled_terminal_state](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L108-L119) / [BookingTests.test_cli_real_process_flow_and_identity](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/tests/test_meeting_room.py#L305-L324)
- アサーション/観測: 他者/manager-onlyの取消/変更、user-onlyの管理、空のCLI identity mappingを拒否。
- 範囲と注意: 信頼されたローカルActor/CLIの境界。未信頼環境の認証安全性まで検証していない。

## コードからの逆引き

| コード | 扱い | 根拠・対応先 |
| --- | --- | --- |
| [initialize](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L68-L86) | technical_support | 設計の識別可能な既存会議室という前提、READMEのoffline provisioning、DR-5。カタログ登録という新しいBusiness Interfaceではない。 |
| [instant](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L30-L40) | technical_support | 日時の表現選択DR-3。入力区間/未来/占有の比較を支える。 |
| [identity](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/cli.py#L36-L49) | technical_support | RoleへのローカルOS UID適合。DR-2。新しい利用者登録業務ではない。 |
| [MeetingRooms.transaction](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L94-L116) | technical_support | 重複禁止/変更失敗時保持の実現手段。DR-6。 |
| [MeetingRooms.set_available](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L195-L204) | mapped | 一つの物理関数のFalse/Trueが二つの操作契約に対応。 |
| [MeetingRooms.owned](https://github.com/mk3008/alder/blob/94f6f639b850a92ce5ad55812a4899e7a2c7bc33/apps/meeting-room/meeting_room.py#L127-L136) | technical_support | 既知IDの所有者/状態検査。IF-03の対象発見とは異なる。 |

確認した入口・支援処理では、根拠不明の独立した業務能力（orphan implementation）は確定しなかった。全行の網羅を主張せず、技術支援を業務Interfaceへ無理に昇格させない。
