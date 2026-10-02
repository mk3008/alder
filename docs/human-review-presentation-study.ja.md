# 判断事項中心の実装レビュー提示 — 限定比較

日付: 2026-10-02。Execution: [Alder #136](https://github.com/mk3008/alder/issues/136)、[PR #137](https://github.com/mk3008/alder/pull/137)。

## 結論

**判断事項から始める提示は、初期表示を小さくしつつ原典へ到達できる候補として残す。人間の認知負荷低減は未確認であり、恒久Skill・Viewer変更は保留する。**

通常提示1,529文字に対し、段階提示の初期表示は503文字で67.1%少なかった。別Fresh読解者は両armとも初読で受入を保留し、原典確認後も上限の不一致と未確認事項を保持した。親による事前8項目の採点は両方8/8。

一方、段階提示の補足まで読むと1,818文字で、通常提示より18.9%多い。両読解者は共通fixture6ファイルをすべて読み、段階提示側は補足も読んだ。実際の報告閲覧量は3,942対4,231文字で増えた。**初期情報量の削減は観測したが、総読解量・原典確認回数の削減は観測していない。**

## 既存知識と責務境界

入力の方法基準はAlder `9d3a75442fdd064750c7410e9159ddaff8ca091b` の [Review Skill](../plugins/alder/skills/alder-review-implementation/SKILL.md)、[review knowledge v0.3](phase2/review-knowledge-v0.3.md)、[Check Item traceability](check-item-traceability.md)、[adoption](adoption.md)。installed Skillを実行した研究ではなく、repository版を研究の基準として読んだ。

既存のhuman-facing CheckにはID・Title・Expected result・Review stateがあり、詳細には条件、BD、代表Test/assertion、evidence gapを保持できる。Test成功と人間確認を分け、永久の追跡はBD↔Check↔Testで止める。今回の主な追加候補は情報項目ではなく、**どの問いから提示し、何を後段に置くか**である。

| 情報・仕事 | 人間に残すもの | AIが圧縮・提示できるもの |
| --- | --- | --- |
| 業務上の意味 | 方針・期待・権限・許容リスクの確認、未決事項の決定 | 原典からの候補抽出、既決と未決の分離、矛盾の説明 |
| 実装の適合 | 修正した期待結果と受入境界の確認 | 現revisionの差分、Test実行結果、assertionと期待の照合結果 |
| 正常項目 | 必要に応じた根拠確認、理解できない箇所の質問 | 対象件数・範囲・根拠入口を残した詳細への折り畳み |
| 検証不足 | 不足を許容できるか、追加確認の要否 | 未実行・欠落・未照合の抽出。未検証を確認済みに変えない |
| リポジトリ外の現実 | 最近の障害、関係者の事情、運用変更などの判断材料 | 提供された文脈の整理。未提供の事情を承認済みと推定しない |

ここで「AIが検証済み」は、何をどのrevision・条件で検証したかを付けた局所事実に限る。新BDとの意味の一致、人間承認、全業務の安全性へ拡張しない。

きっかけの [John Allspawの記事（2026-08-24）](https://www.adaptivecapacitylabs.com/2026/08/24/there-is-more-to-code-review-than-automatable-detection/) は、コードレビューの役割として共同理解、変更の妥当性、組織外部の文脈、責任を論じる。これは提示設計で何を残すかの背景であり、段階提示の効果を実証する資料ではない。この研究のAI読解で、人間の困惑や共同理解を代替できたとは主張しない。

## 対象と比較条件

[既存traceability-drift fixture](../work/traceability-drift/fixture/)を研究用コピーとして再利用。BD-01だけ参加者上限10→20へ変更し、Check / Test / Code / traceを旧版のまま残した。これは[既存のdrift研究](traceability-drift/study.md)にもある変更形で、現行meeting-room方針を変えるものではない。

上限変更は研究内の確定条件と仮定し、実ユーザーの承認と扱わない。cancelのFalseは操作後のoccupied=False、つまり空室と明示し、成功可否の解釈を混ぜない。範囲はメモリ上の予約関数で、本番認証・永続化・同時実行は評価しない。

両armへ同じ原典・同じ不一致結論・同じ制約を渡す。

- [通常提示](../work/human-review-presentation/baseline.md): ファイル・テスト結果・結論を初期表示する手作業の代理。現行Skillの実出力ではない。
- [段階提示](../work/human-review-presentation/staged.md): 判断とリスクを初期表示し、[補足](../work/human-review-presentation/details.md)とBD / Check / Testへ掘れる。

公開入力SHA `2687ebe816d21f534f81822058b2eabde7b7797f` を取得確認してから実行。requested `gpt-6-sol` / effort `medium` / `fork_turns:none`、各arm1回。Alder AGENTS.mdのFresh指定に従う。実効設定は独立確認できない。指定はspawn引数で行い、タスク文へ再掲していないため、両raw返答は「タスク文にはrequested設定がない」と報告した。この差は[manifest](../work/human-review-presentation/runs/manifest.json)へ明記し、rawを改変しない。

独立agentは親の履歴・他arm・protocol・rubric・既存結果を読まない条件。読解者の自己報告に禁止入力の取得はないが、完全な通信ログによる独立監査はしていない。親は双方の出力を知る採点者で盲検ではない。

## 観測

| 指標 | 通常 | 段階 | 解釈 |
| --- | ---: | ---: | --- |
| 初期提示文字数 | 1,529 | 503 | 67.1%削減 |
| 初期非空行 | 17 | 6 | 内容密度・時間は測定しない |
| 補足込み提示文字数 | 1,529 | 1,818 | 段階側が18.9%増加 |
| 原典の追加取得ファイル数 | 6 | 6 | 減少を観測せず |
| 補足の追加取得 | 0 | 1 | 段階側の説明取得が追加 |
| 読んだファイルの累計文字数 | 3,942 | 4,231 | 段階側で総量増加 |
| 内容保持チェック | 8/8 | 8/8 | 親採点。検出率ではない |
| 実ユーザーの判断・所要時間 | 未測定 | 未測定 | 認知負荷低減は未確認 |

文字数はMarkdown記法を含むUnicode文字数。同じファイルの再読回数、クリック数、モデルの処理時間を測っていない。追加ファイル数を人間の必要確認回数と同一視しない。[計測値と読み順](../work/human-review-presentation/observations.json)は[measure.py](../work/human-review-presentation/measure.py)で再計測できる。

| 事前保持項目 | 通常 | 段階 |
| --- | --- | --- |
| 修正前の受入を保留 | 保持 | 保持 |
| 新上限20・旧上限10・11〜20人拒否という影響 | 保持 | 保持 |
| BD-01 / CHECK-01 / test_limitのassertionへ到達 | 保持 | 保持 |
| 方針20は研究上既決、Check人間確認は未完了 | 保持 | 保持 |
| 3 tests成功と新BDへの一致・業務承認を分離 | 保持 | 保持 |
| cancel Falseを空室と解釈 | 保持 | 保持 |
| 永続化・同時実行・本番認証の未検証境界 | 保持 | 保持 |
| 正常項目への根拠とfingerprintの証明限界 | 保持 | 保持 |

親のPython 3.12.14実行では既存3 testsが成功した。追加診断でaccepts(11)とaccepts(20)はFalse、accepts(1)はTrue、accepts(0)とaccepts(21)はFalse。両agentの意味照合と整合する。テストを変更・弱化したり、fixtureの不一致を修正して結果を隠したりしていない。

## 圧縮と見落とし耐性

正常項目の詳細を初期表示から後段へ置くと、未決・矛盾へ注意を向けられる。ただし「表示していない＝検証済み」にならないよう、全3項目の一覧・対象revision・検証範囲・原典入口を残す必要がある。未検証、高リスク、意味が未決の事項を折り畳みの奥へ押し込まない。

事前rubricの負の対照「3 tests成功、変更権限とキャンセルに問題なし。受入可能。」は、上限変更・旧期待・Check未確認を消し、誤った受入へ誘導する。これは親の静的監査で欠落を指摘しただけで、Fresh読解者が不完全な要約を自発的に見抜いた実験ではない。

両有効armは不一致を明示済みであり、新規の欠陥発見能力を測っていない。AI自体が発見しなかった欠陥、要約から消した重要事項、誤った原典リンクを人間が見抜けるかも未検証。将来の人間読解では、問いだけでなく一覧と原典から異議を出せるかを確認する必要がある。

Codeは今回のTest経路から辿った一時的な診断先。BD / Check / Testと同格の意味authorityにせず、恒久Code mappingを追加しない。

## 変更要否

| 対象 | 今回の判断 | 根拠 |
| --- | --- | --- |
| Review Skill | 恒久変更を保留。判断・影響・責任者・根拠・未検証を先に示す例を候補として残す | 既存Skillがすでに根拠、影響、分類、最小判断、責任者を求める。情報の追加より順序の問題 |
| BD / Check / Test traceability | 新しい関係やauthorityは不要 | 既存のhuman-facing Checkと詳細で今回の導線を構成できた |
| Viewer | 実装しない | Markdownで到達性を試せる。UIの追加価値は今回未検証 |
| 利用者向け文書 | 今回は変更しない | 人間読解未実測の段階で、負担が減ると案内できない |

採用判断は「候補を保存し、人間で確認してから判断」。全件成功の通常レビューを捨てたり、既存の独立レビューを短い要約で置き換えたりする根拠はない。

## 残る完了条件と次の確認

研究Executionは比較・根拠・限界・変更要否を記録するところまで完了。人間が必要な判断へ到達できるかという全体条件は未達。人間による比較レビューが残る。

同じ人へ通常提示と段階提示を続けて見せると学習が混ざるため、この1ケースの後読み時間を優劣の実測としない。まず利用者は段階提示だけで「なぜ保留か、誰が何を直すか、何が未確認か」を述べ、必要な根拠に辿れるかを確認できる。通常との所要時間比較を一般化するには別途試験設計が必要であり、今回追加しない。

最小の未確認事項は、(1)初期表示で受入判断が分かるか、(2)正常項目の折り畳みに不安がないか、(3)BD / Check / Testへ自分で辿れるか。人間の確認前に研究TaskをCloseしない。

## 再現・評価用記録

[実行前protocol](../work/human-review-presentation/protocol.md)、[rubric](../work/human-review-presentation/rubric.md)、[manifest](../work/human-review-presentation/runs/manifest.json)、[通常prompt](../work/human-review-presentation/runs/baseline.prompt.txt)、[段階prompt](../work/human-review-presentation/runs/staged.prompt.txt)、[通常raw最終返答](../work/human-review-presentation/runs/baseline.raw.md)、[段階raw最終返答](../work/human-review-presentation/runs/staged.raw.md)、[計測](../work/human-review-presentation/observations.json)。

入力と完全promptは公開固定SHAで再取得できる。raw最終返答は第三者が採点できる。完全なツール通信ログ・独立実効設定・人間読解の証跡はない。再実行が同一返答になる保証はない。手作業の提示と単一合成ケース、1回ずつのAI読解、結論を含むpromptであるため、業務一般の判断品質・欠陥検出・認知負荷の改善を立証しない。
