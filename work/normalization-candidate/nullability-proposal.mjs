// Conceptual proposals, not a replacement for the current storage contract.
// A null decision is an open design question, not a guessed permission.
const specific={
 'businessDesigns.title':[false,'業務設計書を識別し、確認相手が何の設計か分かる名前が必要。'],
 'businessDesigns.preface':[true,'前提や補足が未記載の設計書もある。nullは未記録を表し、前提が存在しないと断定しない。'],
 'businessDesigns.scope':[true,'対象範囲を検討中は未決として保持する。合意済みの設計書では範囲を明らかにする。'],
 'actors.name':[false,'主体を他の主体と区別して業務に結び付けるため、名前を持つ。'],
 'actors.kind':[false,'役割か自動主体かを区別する。未決のWhoは主体を仮作成せず、業務の参照を未決にする。'],
 'actors.color':[null,'色はRoleにのみ関係する。非該当と未設定を区別し、主体の種類との持たせ方を検討する。'],
 'activities.name':[false,'業務を区別し、他の資料から参照できる名前を持つ。'],
 'activities.scope':[true,'システム化対象の判定が未決の業務を保持し、対象外のfalseと区別する。合意時には判定を求める。'],
 'activities.why':[true,'目的が未決の草案を保持できるようにする。合意済みの業務では目的を明らかにする。'],
 'activities.when':[true,'開始条件が未決の草案を保持できるようにする。合意済みの業務では開始条件を明らかにする。'],
 'activities.where':[null,'場所が決まっていない場合と、場所を限定しない場合を区別する必要がある。'],
 'activities.problem':[true,'課題が未確認・課題なしの場合は内容を持たない。両者は課題の確認状態で区別し、課題ありなら内容が必要。'],
 'activities.painLevel':[true,'課題なしの場合は非該当、課題ありで程度が未評価なら未決。課題の確認状態と併せて区別する。'],
 'objects.name':[false,'対象を業務上区別し、入出力から参照できる名前を持つ。'],
 'objects.scope':[true,'システム化対象の判定が未決の対象を保持し、対象外のfalseと区別する。合意時には判定を求める。'],
 'objects.icon':[null,'表示上の指定がないことと、対象の分類が未決であることは別。表示情報の扱いを検討する。'],
 'information.name':[false,'対象が持つ情報項目を他の項目と区別できる名前を持つ。'],
 'information.description':[true,'説明が未記録の項目を保持する。説明が不要と確定したこととは区別する。'],
 'data.name':[false,'受渡しや業務フローで参照する情報項目のまとまりに名前を付ける。'],
 'dataItems.condition':[true,'無条件・条件未決は条件の確定状態で区別する。条件ありの場合は条件の内容が必要。'],
 'steps.action':[true,'手順の操作が未決の草案を保持できるようにする。合意済みの手順では操作を明らかにする。'],
 'steps.method':[true,'方法が未決の手順を保持する。方法が不要・該当しない場合との区別は別途必要。'],
 'steps.exchangeKind':[true,'手順のやり取りの有無・種類が未決の場合を保持し、やり取りなしの確定と区別する。'],
 'steps.legacyText':[null,'旧形式の記述を保持する用途と、新しい手順に旧記述が存在しない状態を分けて検討する。'],
 'steps.obligation':[null,'既存の必須・任意の記録を移行時に照合する。新しい手順の独立した属性とはしない。'],
 'steps.appliesWhen':[true,'旧形式の条件文を保持する。nullから無条件や未決を推測しない。'],
 'steps.effect':[null,'効果を記録しない手順と効果が未決の手順を区別する。'],
 'stepInteractions.direction':[true,'受渡しの向きが未決の草案を保持し、合意時に方向を確認する。'],
 'stepInteractions.phase':[true,'要求か応答かが未決の受渡しを保持し、応答がない場合と混同しない。'],
 'stepParties.side':[false,'手順上の当事者がFromとToのどちらかを区別する。'],
 'stepParties.kind':[true,'当事者の種類が未決の場合を保持する。主体が存在しないと確定した意味にはしない。'],
 'results.text':[true,'結果が未決の草案を保持する。合意済み業務では成立する結果を明らかにする。'],
 'decisions.note':[true,'注記が未記録でも判定表を表せる。業務上の重要な条件は注記の有無とは別に保持する。'],
 'axes.unit':[null,'単位が不要な判定軸と、単位が未決の判定軸を区別する。'],
 'axes.trueLabel':[null,'真偽値の表示名が非該当か未決かを、判定軸の種類と合わせて検討する。'],
 'axes.falseLabel':[null,'真偽値の表示名が非該当か未決かを、判定軸の種類と合わせて検討する。'],
 'rows.resultText':[null,'結果の種類によって説明が不要な場合と、結果が未決の場合を区別する。'],
 'conditions.operator':[null,'条件の種類によって比較が非該当の場合と、比較方法が未決の場合を区別する。'],
 'conditions.value':[null,'条件の種類によって値が非該当の場合と、比較値が未決の場合を区別する。'],
 'relations.label':[true,'関係の補足名が未記録でも、関係の種類と両端の参照は保持する。'],
 'rowChecks.coverage':[true,'チェックとの対応範囲を調査中の状態を保持し、合意時に何を保証する対応かを確認する。'],
 'findings.kind':[false,'未決事項や確認事項の種類を区別し、内容の扱いを判断するために必要。'],
 'findings.scope':[true,'確認対象の範囲がまだ特定できない指摘も残せるようにする。'],
 'findings.sourceId':[true,'元になる既存指摘がない新規の確認事項も扱う。'],
 'retained Check.items.checkId':[false,'検査項目を人が特定し、業務設計やテストとの対応を追跡するために必要。'],
 'State.start':[true,'開始状態が未決の状態遷移を保持する。合意時には開始条件を確認する。'],
 'State.completeness':[false,'状態遷移を網羅済みか確認中かを明示し、無記録を網羅済みと扱わない。'],
 'State.source':[true,'出所がまだ確認できない状態遷移を保持し、根拠を補う必要を残す。'],
 'Package.sources[].sha256':[true,'原典のハッシュが未取得でも原典の識別と改訂は保持する。'],
 'Package.sources[].uri':[true,'リンク先を持たない原典もあるため、所在情報の未記録を許容する。'],
 'Check.intro[].value':[false,'文章要素として使う場合は文章を持つ。別の種類ではその種類に合う項目を使う。'],
 'Check.intro[].label':[false,'参照・リンクに表示名が必要な種類では名前を持つ。別の種類では非該当を区別する。'],
 'Check.intro[].uri':[false,'外部リンクの要素ではリンク先を持つ。文章や内部参照には適用しない。'],
 'State.transitions[].path':[true,'正常・例外などの経路が未決の遷移を保持し、合意時に分類する。'],
 'State.transitions[].sourceId':[true,'元資料の個別識別子がない場合も、状態遷移自体の識別と内容は保持する。'],
 'State.transitions[].evidence':[true,'根拠が未記録の遷移も保持し、必要な確認を残す。'],
 'State.transitions[].note':[true,'注記がなくても遷移の条件・結果・出所を別々に保持する。'],
 'Concept.concepts[].sourceRefs[].targetType':[false,'根拠としてどの種類の対象を参照するかを識別するために必要。'],
 'Concept.concepts[].sourceRefs[].targetId':[false,'根拠として参照する対象を特定するために必要。'],
 'Concept.concepts[].sourceRefs[].section':[true,'資料内の特定箇所が未記録でも、文書・改訂・対象の参照は保持する。'],
 'Concept.handoffs[].flowDirection':[true,'受渡しの向きが未確認の草案を保持し、合意時には方向を確認する。'],
 'Concept.presentation.subsystemViews':[false,'表示定義の存在と未指定を区別するための明示的な状態。'],
 'Concept.reviewGroups[].graph.subsystemViews':[false,'レビュー内の表示定義の存在と未指定を区別するための明示的な状態。'],
 'Concept.reviewGroups[].capabilities[].testSpecification':[false,'機能とチェックの対応を定義したかどうかを明示する状態。'],
 'Concept.reviewGroups[].capabilities[].samples[].meaning':[true,'例から何を確認するかが未決の草案を保持し、レビュー時に意味を明らかにする。'],
 'Concept.reviewGroups[].capabilities[].samples[].note':[true,'補足注記がなくてもサンプル本体と条件を保持する。'],
 'Concept.reviewGroups[].capabilities[].samples[].blocks[].rows[].cells[].value':[false,'サンプルのセルとして作成した値は、空文字や0も含めて値そのものを保持する。'],
 'Concept.reviewGroups[].capabilities[].samples[].blocks[].rows[].cells[].linkId':[true,'他の要素へのリンクを持たないセルもある。'],
 'Concept.presentation.reviewBoundaries[].promise':[true,'境界での受渡し条件が未決の候補を保持し、合意時に確認する。'],
 'State.transitions[].event':[null,'発生事象が記録不要な遷移と、事象が未決の遷移を区別する。'],
 'State.transitions[].condition':[null,'無条件の遷移と、条件未決の遷移を区別する。'],
 'State.transitions[].effect':[true,'状態への影響が未決の遷移を保持し、合意時に結果を確認する。']
};

/** The value, reason and review status are authored design candidates. */
export function nullabilityProposal(concept,info,mapping){
 let decision=specific[mapping.physicalName];
 if(!decision&&concept.id==='n-exception'&&info.name==='発生条件')decision=[true,'条件が未決の草案や、判定行を条件として参照する例外を保持する。合意時には発生条件を明らかにする。'];
 if(!decision&&concept.id==='n-exception'&&info.name==='例外時の結果')decision=[true,'結果が未決の草案を保持する。後続に影響する結果は合意時に明らかにする。'];
 if(!decision&&concept.id==='n-exception'&&info.name==='発生箇所')decision=[false,'発生箇所は未決、業務全体、手順を区別する。元の記録だけで確定しない場合は未決とする。'];
 if(!decision&&info.name==='識別子')decision=[false,'設計上の対象を同一のものとして追跡・参照するため、識別子を持つ。採番方法は決めない。'];
 if(!decision&&['名前','項目名','グループ名','表題','判定軸の名前'].includes(info.name))decision=[false,'この項目を他と区別し、業務の言葉で確認するための名前を持つ。'];
 if(!decision&&['改訂','原典の改訂','文書の版','形式の版','文書の種類','形式'].includes(info.name))decision=[false,'文書とその改訂・解釈を区別し、参照元との対応を確認するために必要。'];
 if(!decision&&['確認状態','原典の確認状態','責任の状態','必須・任意'].includes(info.name))decision=[true,'判断が未決の状態を記録できるようにし、未決を承認や非該当と混同しない。'];
 if(!decision&&['対象項目の確定状態','前提手順の確定状態','受渡し項目の確定状態','保持項目の確定状態','変更前の状態の種類','変更後の状態の種類','条件の確定状態','課題の確認状態','手順の順序'].includes(info.name))decision=[false,'未決・なし・あり等の業務上の区別、または手順の順序そのものを明示する項目。'];
 if(!decision&&/^(?:種類|関係の種類|規則の種類|結果の種類|条件の種類|当事者の種類|From／To|入出力の向き|要求／応答)$/.test(info.name))decision=[true,'種類や方向が未決の草案を保持する。合意時には必要な区別を確認する。'];
 if(!decision&&/^(?:説明|理由|目的|概要|内容)$/.test(info.name))decision=[true,'未記録・未確定の草案を保持できるようにする。合意時に必要な内容は別途確認し、非該当と混同しない。'];
 if(!decision&&/\[\]$/.test(mapping.valueType??''))decision=[true,'未確認を許容し、確認して0件だった空の一覧と区別する。'];
 if(!decision&&/^(?:注記|条件|根拠|対象範囲|表示名|リンク先)/.test(info.name))decision=[null,'未記録、未決、該当なしのどれを区別する必要があるか、この項目の意味に照らして確認する。'];
 if(!decision)decision=[null,'この情報が未決・非該当・空のときの違いと、合意時に必要かを確認する。'];
 return {nullable:decision[0],nullableReason:decision[1],nullableStatus:'proposal'};
}
