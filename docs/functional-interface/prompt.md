# Functional Interface導出・対応付けの候補prompt f1

完成済みで業務相関レビューを通過したBusiness Design全文から、人間がレビュー・修正・追加する操作契約の初稿を作る。**業務意味のSSOTはBusiness Design**であり、コード・テスト・Decisionに合わせて契約を弱めたり、既存実装を逆輸入して仕様化したりしない。Interfaceは観測可能な操作の責務であり、1関数・1API・1ファイルではない。

## 1. 操作契約の導出

全文のWhat/Why/When/Who/Where/How、Dataの意味・同一性・件数、Role、Rule、業務相関、Scopeを読む。主体が何を与え、何を観測し、次にどの対象を扱えるかから契約を区切る。1 Activity=1 Interfaceとせず、独立に始められる/結果を観測できる能力を分ける。内部検証・SQL・方式の違いだけで分割しない。逆方向の操作でも前提・結果・検査責務が異なるなら契約を分けてよい。

最小のカード: ID/名前、Business根拠と主体、入力/前提、成功/不成立/保持する事実（該当する0件・対象なしを含む）、前後の接続、Check IDs。Business Designの全文を複製せず、契約境界と根拠を短く示す。分類/確度が必要な推定はc3の区別を使い、人間レビュー前であることを明記する。

## 2. 検査項目との関係

同じ入力版の[c3](../behavior-derivation/candidate-c3.md)を用い、InterfaceとBusiness Design全文からCheck Itemを作る。既存の同版の初稿があるなら再生成せず関係を整理してよい。各Checkに主担当Interfaceを一つ付け、他Interfaceとの接続・共有制約は関連先として示す。全項目を一つのInterfaceの正常系へ押し込まない。0/1/複数件、対象なし、成功後の開始条件、不成立後の終了/継続、中断後の再特定、保持する事実を必要な範囲で維持する。

人間向けの主表示はID・タイトル・期待結果・レビュー状態を中心にし、正確な条件・Business根拠・導出分類/確度は同じIDの詳細へ保持する。レビュー状態はAI確度やテスト証拠と別軸とする。

## 3. コード・テストとの意味対応

設計・項目書・実装・テストの版を別々に固定する。既存コードへの対応付けでは、名前の一致でなく前提・観測結果・副作用・保証を照合する。複数の関数・ファイル・SQLや共有処理へ対応してよい。テストはそのアサーションが証明する条件だけを記す。一つのテストが通ったことをCheck全体の証拠としない。

代表的な契約条項ごとに、Activity/Business根拠→Interface→Check Item→既存テストのアサーション→実装箇所を残す。判定はmapped、implementation gap（経路なし/意味不一致）、partial/missing test evidence、ambiguous mappingを基本とする。コードから逆にもたどり、根拠のない業務能力はorphan implementation候補、初期化・変換・認証アダプター等は技術支援として別扱いにする。候補対応は曖昧なまま確定扱いしない。

traceabilityは双方向に使うが、意味authorityは一方向である。Test/Code→Check→Interface→Business Designへ逆引きして理由や漏れを調べてよいが、既存実装をBusiness Designへ自動昇格させない。人間レビューで意味の相違・未定義が見つかったら、まずBusiness Designへ戻して確定し、その後に下流を更新する。

旧版の仕様どおりのコードが新契約と一致しないときは版差と明記する。未承認の検査候補を実装欠陥の根拠にしない。実装を修正せず、検索範囲、確定した対応、不足する証拠を報告する。

## 4. 人間による完成と維持

人間は契約の分割/統合、期待結果、候補、対応先が本当に保証を満たすかを確認する。業務意味が変わる判断は先にBusiness Designへ反映する。完成前のInterface/Checkは承認済み仕様ではない。

変更時は影響するBusiness根拠・契約・Check・テスト・コードの対応だけを更新する。Checkの分割・改名・表示変更・再生成時は、旧Checkの独立保証が新Checkまたは明示補足へ移っているか意味保持auditを行う。旧Checkは変換回帰のoracleには使えるが、正本はBusiness Designである。直結で十分ならInterface文書を増やさない。全コード行の表や特定の内部構造を要求せず、中間索引の利益が重複更新の負担に見合うかを判断する。

詳細な二層表示、review state、順方向/逆方向traceability、意味保持auditは [Check Item traceability](../check-item-traceability.md) に従う。
