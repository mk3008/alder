# Check Item 修復記録

- 作業者ID：`/root/candidate_v3_initial`。これは元の作成者コンテキストを引き継ぐ修復であり、独立した Fresh review ではない。
- モデル設定：この継続タスクには個別のモデル・推論effort指定は記載されていない。AGENTS.md の Fresh review 既定 `gpt-6-sol` / `medium` はこの作成者修復の実効設定を証明しない。実効設定は独立検証していない。
- 入力パケットの公開基線：`525a39db6ec43c196c5b927dbc1b9c3cf32f08c6`（依頼による指定）。更新Skillの公開bundle：`be8d23aa331d61ffe10934f86190172726a5db78`、同梱provenance authority：`0986ae5c67efeed0797f3f78083f81ac12dbe047`、plugin：`0.4.8`。Git/公開URLへの独立照合は行っていない。
- 出力：`/workspace/scratch/0261bb5be107/quality-loop-runs/original-repaired.md`。業務設計も元の欠陥入力も変更していない。人間の意味承認・実装引渡しは行っていない。

## 修復と意味の保持

- 四つのH2から余分な `Activity ` を除き、四列索引のActivityリンクを新しい見出しに合わせた。業務設計の四つの `# Activity` 宣言と表示名が文字列として一致する。
- PR-09を「承認済み備品を購入する」行の索引にも直接リンクし、同Activity本文から既存の単一主項目へ参照を追加した。「購入申請を却下する」側の既存索引・主項目・未レビュー状態はそのまま。業務設計L31、L265の `rejected` は購買対象外という不変条件が両業務に関係するためで、承認済みのすべての申請を禁止する意味ではない。
- PR-08の主条件から却下理由の仮値「不要」を外した。主期待結果の「入力された却下理由と却下日時」は元から一般形なので保持し、サンプルの「不要」、PR-U03の理由欠落・空白の未決も残した。根拠は業務設計L242–265。
- PR-11の主条件・期待結果から実額11000への限定を外し、「入力された実購入金額と購入日時」の一般保証へ戻した。元の希望額12000／実額11000という具体例は比較表に残し、差額時の成立可否は未決と明記した。比較用の同額例は仮値で、一般的な有効範囲を定めない。根拠は業務設計L291–314。PR-U04の金額差・値域の未決は保留した。
- 追加の源泉照合で、PR-02の「成立させる」という結果前提の行為を登録行為へ分けた。PR-U02は業務設計L33–48で金額別経路が今回対象外と定められているため、今回の採否を再質問する文を将来の条件を決める保留事項へ直した。いずれもID・レビュー状態・一般保証を変更していない。
- 元の16 IDと順序（通常12、未決4）、全レビュー状態、各IDの根拠行・導出/確度・接続・Test証拠の記述、元のソースパスと `b7de3bf013e9133d72384ec5ffb26f66d4fdbfe9` というpinを保持した。パケットは元ソースの一時コピーで、pinを無根拠に付け替えない。元pinと今回の公開基線の対応をGitから検証していない。差額や必須入力の失敗結果、新たな承認policyは決めていない。

## 実施確認と残る範囲

- 元ファイルに対する同梱診断 `python3 scripts/check_activity_names.py --design ... --checks ...` はexit 1（raw宣言名と `Activity `付きH2の不一致）。保存した修復版への同じ診断はexit 0で、raw宣言・H2・索引は四件とも一致した。スクリプトは共有参照や保証を検証しない。
- 保存版と元の差分を読み、全16 IDと状態列が同一、全根拠ブロックと先頭ソースpinが同一、内部フラグメントリンクの欠落が0、PR-09の索引リンクが却下・購買の両行にあり購買H2直下にも主項目への参照があることを局所スクリプトで確認した。設計の相関L23–31、却下L218–265、購買L267–314と主条件・期待結果・サンプルを再照合した。
- 保留：PR-U01（申請入力値・欠落）、PR-U02（金額別承認の中身は今回対象外）、PR-U03（理由の有効値・欠落）、PR-U04（実額の値域・希望額との差）。表現上の修復は人間レビュー状態の変更を意味しない。
- 作成者自身の点検と診断は独立したConsistency reviewではない。依頼に従い、保存版について別の読み取り専用readerによる再レビューが未実施のまま待機している。したがってquality gate通過とは主張しない。Git改訂上の根拠行、元ソースpin、以前のTest/assertion対応、実装結果は検証していない。

## 読んだパス

- `/workspace/scratch/0261bb5be107/quality-loop-packet-v2/AGENTS.md`
- `/workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/SKILL.md`
- `/workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md`
- `/workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/references/adoption.md`（Check作成・レビューと任意Functional Interface節まで）
- `/workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/references/provenance.json`
- `/workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/plugin.json`
- `/workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/scripts/check_activity_names.py`（実行。スクリプト本文は未読）
- `/workspace/scratch/0261bb5be107/quality-loop-packet-v2/business-design/purchase-request/README.md`
- `/workspace/scratch/0261bb5be107/quality-loop-packet-v2/product/defective-checks.md`
- 自分の保存版 `/workspace/scratch/0261bb5be107/quality-loop-runs/original-repaired.md`

## 完全な依頼文

> Use updated existingSkill /workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/SKILL.md and whole packet business-design/purchase-request/README.md to repair your original saved defective draft packet product/defective-checks.md (public baseline525a39db6ec43c196c5b927dbc1b9c3cf32f08c6). UpdatedSkill publicbundlebe8d23aa331d61ffe10934f86190172726a5db78 authority0986ae5c67efeed0797f3f78083f81ac12dbe047 plugin0.4.8. Humanactualfeedback: PR-09 missing purchaseActivity index andsection sharedreferences; PR-08 reason不要 andPR-11 actualamount11000 narrowprimarygeneralguarantees; H2 undesiredActivityprefix. Preserve all existing16IDs, reviewstates, generalguarantees, undecideditems/sourcepins/supportingdetail/examples; don't settlepolicy. Read no acceptedanswer/specimen/othergeneration/oldanalysis; only your own earlier history unavoidable plus packetAGENTS/guidance/BD/defectiveinput. Execute bundleddiagnostic; sourcevalidatefeedback/relatedconnections and repair yourself into /workspace/scratch/0261bb5be107/quality-loop-runs/original-repaired.md without editingpacket or input. No evaluatorrewrites. You needn't spawn: root will request actual read-only re-review of savedrepair, so report pendingreader and do not claim gatepassed. Save original-repair-report.md incl fulltaskverbatim, ownID/contextcontinuation/requestedsettings, source/version/readpaths, what changed/retained/checks/limits. No network/externalmessages/otheragents/otherfiles.
