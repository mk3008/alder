# Primaryの実行時系列と成果物面積

既存Primaryの保存metadataを再集計したpost-hocの運用観測。新しい生成・再採点は行っていない。再計算は`observe-timeline.py`、全360 nodeと20 authoringのpath・timestampは`execution-timeline.json`に保存する。

| 観測 | Alder | RDRA |
| --- | --- | --- |
| 最初のAI開始（UTC） | 2026-10-02 07:38:43.794772 | 2026-10-02 07:39:20.690590 |
| 最後のAI終了（UTC） | 2026-10-02 08:14:10.818414 | 2026-10-02 10:29:42.925349 |
| 最初の開始〜最後の終了 | 35分27秒 | 2時間50分22秒 |
| 保存timestampによる最大同時実行 | 1 | 3 |
| AI dispatch完了枠 | 20 authoring | 360 node（18×20 workflow） |
| 各Stage1/2 runの永続業務成果物 | 1 Business Design | 27ファイル（0_RDRAZeroOneと1_RDRA） |
| 全Stage1/2業務成果物 | 20ファイル / 94,537 bytes | 540ファイル / 1,489,712 bytes |

Alder最終終了時点でRDRAは50 node開始・49 node終了、最終nodeまで終わったworkflowは2/20。310 nodeはその後に開始された。nodeの終了時刻でworkflowを数えており、後続scriptの終了までを表す値ではない。

今回の同一共有実行ではAlderが先に完了した。Alderは少ない永続成果物と短い生成経路で完了し、C1–C4の固定Stage3下流必要期待結果の保持は両手法とも全件だった。今回のこの指標にRDRAの追加的な中間成果物が必要だったとは確認できない。これは全体の最終品質が同じという結論ではなく、C2/C3の未決発見差、C4の停止性、C5の契約詳細欠落は別の品質軸として残る。

RDRAの横断関係構造の利用価値は別に存在しうる。生成・同期・要件変更時の維持コストを上回る価値があるかは、この時系列からは確定しない。成果物が少ないことを速さの原因と断定しない。

時刻は保存済みoperator metadataで、providerの独立attestationではない。共有実行資源、scheduler、DAG依存、script処理は統制していない。wall spanは方法固有のlatency、開発速度、人間作業時間、credit/token/課金の値ではない。保存agent実働時間合計も同様。倍率を一般的な速度優位へ換算しない。

利用者からbenchmarkでCodex残creditの大量消費が実感されたとの報告があった。正確な消費量のlogはないため数値化しない。dispatch数・artifact surface・wall spanを、異なる側面の運用コストproxyとして扱う。
