# 判断事項中心レビュー提示の限定比較 — 事前条件

日付: 2026-10-02。Execution: Alder #136。
元入力revision: 9d3a75442fdd064750c7410e9159ddaff8ca091b。

## 問いと境界

同一情報の提示順序と段階化によって、初期閲覧文字数を減らし、受入可否・不一致・根拠・未検証事項へ辿れるか。人間の認知負荷、所要時間、見落とし率は測定しない。Fresh AI読解は到達可能性の代理観測に限定する。1 arm 1回、平均・検出率・有意差を算出しない。

既存traceability-drift fixtureを安全な合成入力として再利用。BD-01だけ10→20へ変更し、Check / Test / Code / traceを据え置く。decision.mdで変更の確定とoccupiedの戻り値契約を固定。現行meeting-room方針を変更しない。比較対象は同じ一時点の実装であり、製品PRの実差分ではない。

baseline.mdはファイル別に全情報を初期表示する手作業の通常提示代理。現行Skillの実出力や一般的なPRレビューの代表性を主張しない。staged.mdは判断・リスク・不確実性から始め、details.mdへ掘る。同じソースを使い、同じ結論と意味を両armに含める。これにより検証するのは読解と保持であり、欠陥の新規発見能力ではない。

## 実行条件

Alder AGENTS.mdのFresh指定に従い、別agentに requested model gpt-6-sol / effort medium / fork_turns none を設定する。実効モデル・effortの独立証明はできない。各agentには担当提示と共通fixtureのみ許可し、他arm・details以外の研究記録・rubric・結果・このprotocolを禁止する。親agentは両提示と採点条件を知っており、盲検採点ではない。

公開branchに入力とpromptをcommitし、固定SHAで取得できた後に実行する。安全なraw出力を保存する。実行終了時に実際のagent ID・prompt・読んだファイル・返答・遵守違反を保存する。

## 完全な共通promptテンプレート

```text
公開リポジトリ mk3008/alder の INPUT_SHA にある研究入力を読む。今回の提示は PRESENTATION_PATH。これは小さな予約関数の実装受入レビューであり、あなたは人間判断を支援する読解者。最初に提示ファイルだけを読み、その時点の受入可否、必要な判断/対応、未確認事項を仮回答として記録する。その後、必要だと判断した根拠ファイルだけ追加で読む。
許可: PRESENTATION_PATH、STUDY_DIR/fixture/ 内の6ファイル、DETAILS_PERMISSION。禁止: 他armの提示、protocol.md、rubric.md、他研究・Issue/PRコメント、既存結果、親の会話履歴。GitHub fetch_fileで固定SHAを指定して取得する。ファイル編集・GitHub書込み・追加業務ルールの決定は禁止。
最終回答は日本語で、初読仮回答、追加で読んだファイルと理由（順序付き）、最終の受入判断、実装不一致と影響、既決/未決の区別、原典のBD/Check/Testと具体的期待、未検証範囲、テスト成功と人間承認の関係を記載する。cancelの戻り値の解釈も述べる。必要なソースが読めなければその限界を明記し、推測して補完しない。読んだrevisionとpath、requested model/effort、agent IDを記録する。実効設定は独立確認できない。
```

baseline: PRESENTATION_PATH=work/human-review-presentation/baseline.md、DETAILS_PERMISSION=なし。
staged: PRESENTATION_PATH=work/human-review-presentation/staged.md、DETAILS_PERMISSION=work/human-review-presentation/details.md。
STUDY_DIR=work/human-review-presentation。INPUT_SHAはcommit生成後に実行記録へ完全展開して保存する。

## 測定

Unicode文字数・非空行数は再計測可能な表示量であり時間/認知負荷ではない。Markdownリンク記法を含むraw文字数で両armを同じ方法で数える。初期表示・補足込み・実際に読んだファイル累計を分ける。追加ファイル数は原典確認回数の代理であり、クリック数や人間の必要回数ではない。

rubric.mdの8項目は全保持を要求する。段階提示が既決の業務方針を未決へ戻す、Falseを取消失敗と誤る、3 tests成功を受入承認と扱う、原典到達できない、未検証を消す場合は不採用。正常項目を完全に隠す要約を負の対照として親が静的監査し、省略リスクを確認する。追加Fresh実行はしない。

## 変更判断

両armで意味が保持されれば提示構造の候補として記録する。人間の確認を経るまで恒久Skill変更や負荷低減の採用判断をしない。既存BD↔Check↔Testを使い、新しいauthority・恒久Code mapping・UIを作らない。
