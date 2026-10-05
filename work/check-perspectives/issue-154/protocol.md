# Check探索視点pilot — preregistration

## 目的と固定範囲

Alder #154。BDの意味を変えず現行c3に独立した破綻視点を補助する増分を調べる。正式Skill・仕様・BD・利用者向け文書は変更しない。
Source: a58c970f3a78ac9a0ba91be3c6bfb05e4e2b1168。全入力は既存公開ファイルのbyte-identical copy。備品購入申請は状態分岐・権限、設備保全は時間境界・複数経路・独立状態を含むため選定。新規架空BDを作らない。会議室はDraft表記のため選ばない。既存fixtureであり実運用caseの効果を主張しない。両BDの人間合意/相関レビューの実行証拠は独立確認できず、通常handoff-ready条件を満たしたと主張しない。この制約は両arm共通であり、凍結された記述からの導出比較として評価する。

## 試行

2ケース×2arm×1run=4生成。fork_turns none、requested model gpt-6-sol / effort medium（AGENTS.md指定）。runtime actualは独立attestationがない限り未確認。各generatorは自prompt、当該BDと凍結guidanceだけ読む。他arm、他case、実装、Test、過去Check、#125/#132結果、採点rubricを見せない。1ケースのpairを順にlaunchし、待機中は他caseをlaunchできる。比較可能なら繰返さない。破損/証跡欠落で比較不能な場合だけ理由を記録してreplacementを許す。低件数・期待と違う結果は再試行理由ではない。
生成前にこのprotocol・完全prompt・input・rubric・hashを公開branchへcommitし、immutable SHAのfetchを確認する。各launch messageはruntime pathとprecommit SHAを加え記録する。安全な公開入力の出力だけであることをpublish前に確認する。

## 評価と判定（生成前固定）

単位は出力の独立したCheckまたは質問。各IDを分類する:
- direct: 明示期待または新しい業務決定なしに直接導出できる期待。
- same-meaning-view: 同じ成立条件を別の境界・状態・経路で確認し、既存Checkの抽象的言換えを超える有用な観測例。
- business-question: 新しい業務判断が必要。正しく質問に留めたか、Checkへ誤昇格したか別記。
- implementation-detail: 特定技術・方式に依存するだけ。
- duplicate/noise: 同一出力内重複、遠い仮説、結果差のない細分化。
- unsupported: 入力に根拠なく確定された期待。

cross-arm overlapはカテゴリと別の軸にする。同じ期待が両armにあることだけでvalidなdirectをノイズにしない。same-meaning-viewも相手armに同等条件があれば固有増分に数えない。質問とCheckで同じ意味が出たときは安全な分類差を記録する。

一次評価者へarmを隠して各ケース2出力をX/Yとして渡す。protocol/rubric、BDとraw以外の他研究・生成prompt・arm keyは渡さない。内容からarmを推測できる可能性があるため完全盲検とは主張しない。全IDに分類・根拠・意味逸脱/誤昇格flagを付け、case内対応表で片側固有の有用視点と逆方向損失を示す。生成者の視点申告だけでは由来を確証しない。後でarm開示し、集計・根拠誤りのみ訂正、元評価は残す。

出力量はUnicode文字数、Check ID数、質問数、詳細のレビュー対象数を併記。時間負荷は未測定。禁止視点の一律展開・固定チェックリスト化・未決値の無断決定・技術手段の持込・既決/保留事項の再質問を記録する。件数増を成功指標にしない。

採用: 両caseで意味保存された独立の確認価値があり、逸脱/負荷が見合う場合でもこのpilotを超える優位は主張しない。限定採用: 特定業務性質/状況だけに根拠があり、その境界を示せる。正式採用しない: 増分が不明/重複だけ/安全性かレビュー負荷に見合わない。差が小さい場合も現在のpilotを終了し、一般化しない。正式guidance変更は本taskで行わず、必要なら別taskの最小案にする。

Check Item = Oracleは、BD由来で人間レビューされた期待値の定義という限定なら説明可能かを検討する。Checkだけで実装完了/正しさを証明するとはしない。Test assertion・実行証拠・未解決意味を別に扱い恒久traceabilityはTestまで。

## 背景境界

#74/#76は意味追跡と同期、#125/#132は未決事項探索。今回の確定記述からCheckを導出する比較とは工程が異なり、過去rawをgeneratorへ渡さない。
起点記事 https://zenn.dev/mizchi/articles/ai-coding-loop-formal は2026-10-05のweb取得がInternal Errorで本文未確認。Issueに書かれた動機以上の内容を記事の主張として断定しない。記事は要件の根拠ではない。
