# DFD内のProcedureを表す候補と関連手法

## 位置付け

Alderの業務設計グラフは、ActivityとObject間の情報の流れを示すDFDである。今回の候補はその図を別の図法に置き換えず、**一つのActivity内部のStepを表として明示し、必要な情報の流れを同じ定義から図に対応付ける**。各Stepを別の図の線にする必要はなく、同一Activity／Object／方向の線は表示上集約する。業務上の事実と未決は推測で補わない。

## 表の候補

通常表示の中心は`From | To | Data | Action`とし、Step ID／番号を保つ。読み方、例外、条件、必須・任意、局所順序、対応するやり取り、CRUD的効果は、必要な場合に表示・参照できるよう保持する。表示列を減らすことはこれらの情報の削除を意味しない。読み方は例としてActionの補足に表示できるが、独立した方法欄とするかは候補段階。

| Step | From | To | Data | Action |
| --- | --- | --- | --- | --- |
| 1 | 作業者 | 紙 | 記載内容（読む対象） | 読み取る。方法は未決 |
| 2 | 紙 | 作業者 | 記載内容 | 読み取り結果を返す |
| 3 | 作業者 | メモ | 記載内容 | 書き込む |
| 4 | メモ | 作業者 | 記載成功 | 結果を返す |

紙やメモが実際に人と通信するという主張ではなく、本人が示した読み書きと結果の論理的な表現である。紙は、対象システムのOCRによる読取ならScope内、人が目視しシステムに生成責任もアクセスもなければScope外。方法が未確認ならScopeを勝手に確定せず、ヒアリングを続ける。Step 4の応答は本人が示した例であり、応答がない業務には付け加えない。

### 図との対応で区別が必要なこと

Step 1の「記載内容」は**読む対象**であり、その内容自体が作業者から紙へ流れたことを意味しない。Step 2と3では同じDataが実際の受渡しに使われる。表のData欄を常に送信済みのDataと解釈して図の矢印を自動生成すると、Dataの向きを誤るおそれがある。限定PoCでは対象Dataと送るDataを別の参照として区別し、Step 1は後者を未決のままにした。Dataを伴わない要求の線の表示や、既存DFDとの対応は、正負例と実際の図を照合して決める。架空の送信内容やObjectを作らない。

Request／Responseは通信上の位置付け、Input／OutputはActivityから見た方向、Actionは業務上の動作、CRUDは操作効果として区別する。矢印の向きや動詞だけからそれぞれを推測しない。内部判断は相手がないStepとして表し、条件・分岐・複数Resultは失わない。

## 関連する知見

- [米国連邦道路局のDFD説明](https://highways.fhwa.dot.gov/safety/data-analysis-tools/rsdp/development-structure-mire-management-information-system/appendix)は、手作業と自動処理の双方を対象にし、矢印を情報の流れとして扱う。Alderの既存図との整合を考える際の参考になる。
- [ISO/IEC版UMLの表記規定 Annex E](https://www.omg.org/spec/UML/ISO/19505-2/PDF)は、シーケンス図の別表現としてInteraction Tableを示し、送信側・受信側・メッセージ・引数・返却値・順序等を記述する。Alderの4列がこの規格と同一という意味ではないが、**図とやり取りの表を対応付ける**という発想に近い。
- [Training Within Industryの作業分解](https://www.govinfo.gov/content/pkg/GOVPUB-PR32_5200-37b0142a95143132c21c96799c3b56e5/html/GOVPUB-PR32_5200-37b0142a95143132c21c96799c3b56e5.htm)は、作業の主要Stepと、方法や注意点を表すKey Pointを分ける。[英国HSEの作業分析](https://www.hse.gov.uk/humanfactors/assets/docs/understanding-the-task.pdf)は、目標・作業・実施順序・前提条件を区別する。手作業の方法や条件を手順に残す観点で参考になる。
- [W3C WSDLのMessage Exchange Patterns](https://www.w3.org/TR/wsdl20-adjuncts/#_message_exchange_patterns)は、片方向と要求／応答を異なる交換パターンとして扱う。Alderへ通信規約を持ち込むという意味ではなく、実際にない応答を作らない根拠となる。
- [OMGのDMN](https://www.omg.org/dmn/)は、条件と結果の複雑な対応をDecision Tableで記述する。手順の流れを示す今回の表と、複数条件から結果を決める表は用途が異なる。必要な場合は後者も参照できるようにし、Procedure表だけで判断条件を消さない。

これらから、4列は業務上のやり取りを整理する中心表示として有力である。一方、表で参照・方向・必須欄の検査ができても、業務意味、条件の十分性、未記載のStep、方法やScopeの妥当性を自動で保証するわけではない。実際のサンプルと旧版で意味を確認して採用する。
