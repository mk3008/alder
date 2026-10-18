# Check Items 整合性レビュー（読み取り専用）

レビュー担当：`/root/quality_source_review`。依頼された設定：`gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`（実効設定を独立に検証していない）。指定された公開ソース改訂：`525a39db6ec43c196c5b927dbc1b9c3cf32f08c6`。実際に読んだ対象はこのパケットの作業ツリーにある `product/design.md`（314行）と `product/checks.md`（359行）であり、公開改訂の内容との同一性は検証できない。Check 冒頭に記載された入力は `generation-candidate-v3/business-design/purchase-request/README.md`、改訂 `b7de3bf013e9133d72384ec5ffb26f66d4fdbfe9` である。これを指定改訂に黙って置き換える根拠もない。

読了した指示：`AGENTS.md`、`plugins/alder/skills/alder-draft-check-items/SKILL.md`、同 `references/check-item-traceability.md` 全文、`references/adoption.md` の Check 導出・レビューと任意 Functional Interface 節まで（併せて全文を読み、適用箇所を確認）、`references/candidate-c3.md`、`references/prompt.md`、`references/provenance.json`、`plugins/alder/plugin.json`。Alder plugin 版 `0.4.8`、provenance の authority revision `a3821d3d14dabd568a0d6da93b706dc251e24d0b`。このパケットは Git checkout ではなく、plugin commit と両 product 入力の Git revision は確定できない。実装、Test、過去レビュー、公開 URL は開いていない。Consistency review-only として対象を編集せず、人間レビュー状態を変更していない。

## 照合した対応

第1パスでは、設計の `# Activity ActivityName` から `備品購入を申請する`（L123）、`購入申請を承認する`（L170）、`購入申請を却下する`（L218）、`承認済み備品を購入する`（L267）を抽出した。`# Activity` は見出し構文であり、表示名ではない。業務相関の番号 1–5（L27–31）は ActivityName の一部ではない。Check の索引 L7–10、H2 L14/100/190/274 と本文・参照情報の Activity 表記をこれらと照合し、名前の短縮・別名は見つからなかった。四列索引、索引と H2 の順序、H3 にある16の一意な ID、索引の各直リンク先の見出しも確認した。リンクが解決することと、関連先の索引行・節にリンクが存在することは別々に判定した。

設計の相関と Activity Input/Output を照合した具体的な対応は、申請の `submitted` 出力（L160–168）→承認・却下の `submitted` 入力（L194–197、L242–245）に対する PR-01/03、承認の `approved` 出力・購買可能な結果（L208–216）→購入の `approved` 入力（L291–294）に対する PR-04/06、却下の `rejected` と購買除外（L257–265、L31）→購入の対象境界（L277–294）に対する PR-07/09 である。PR-02 は申請時の情報保持（L162–167）、PR-05 は承認日時（L205–215）、PR-08 は理由・日時（L253–264）、PR-10/11/12 は購入状態・金額・日時・購入済み扱い（L298–314）と照合した。PR-U01/U03/U04 は各必須入力に由来する未承認候補、PR-U02 は設計 L37 の明示的未決事項として照合した。単なる時系列や `接続` メモだけからすべての Check の共有先を機械的に増やす判断はしていない。

第2パスでは、設計の一般形を「申請者が必須の品名・数量・希望購入金額・購入理由を入力して登録→その入力と申請日時を同一の新しい `submitted` 申請に保持」（L147–168）、「承認者が `submitted` の対象を選択し購入可と判断して承認→当該対象が `approved`、承認日時を記録」（L180–216）、「承認者が `submitted` の対象と却下理由を入力・選択して却下→**入力された理由**と日時を当該 `rejected` 対象に記録」（L228–265）、「購買担当者が `approved` の対象を選択・購入し**入力された実購入金額**を登録→当該対象が `purchased`、金額と日時を記録」（L277–314）として取り出した。PR-01～12 と PR-U01～U04 の主表示の条件・行為・期待結果をそれぞれ照合し、次にサンプルの具体値を別に評価した。`submitted` / `approved` / `rejected` / `purchased` は設計 L27–31、L116、各 Activity に必要な定数であり、サンプル値 12000、11000、理由「不要」は設計の固定値ではない。R1/R2 と申請者Aは照合用仮識別子として読み、これだけをもって特定人物・レコードへの業務制限とは判定しない。

## NG：記述ルールへの明確な不適合

1. **関連 Activity からの Check 参照が欠ける。** 場所：`checks.md` の索引 L7–10、Activity 節 L100–189、L190–273、L274–359。根拠とルール：設計 L27–31 と上記の出力→入力・購買除外の対応に対し、`check-item-traceability.md`「GitHub Markdown document layout」は共有 Check を関連する**各索引行と他の Activity 節の両方**から同じ一次項目へ直接リンクするよう求める。少なくとも PR-01/03 は承認・却下の節と索引行、PR-04/06 は購入の節と索引行、PR-07/09 は購入の節と索引行から到達するべき関係が設計と各 Check 本文に明示される。現状は各 ID が配置元の索引行にだけあり、他節にある PR-09 の本文内リンク（L158）も逆方向の関連節参照の代用にはならない。効果：関連業務を選んだ読者が前段保証・購買除外をその場で辿れず、同じ ID と状態の共有関係が索引に現れない。新しい Check の複製や状態変更は不要。

2. **PR-08 の主条件が理由を例示値に限定する。** 場所：`checks.md` L217–219、サンプル L223。根拠：設計 L244、L253、L259、L264 は却下理由を必須の入力値として、その**入力された理由**の記録を要求し、「不要」という固定値は規定しない。`check-item-traceability.md`「Conditions, expressions and examples」は一般条件・期待結果と具体例を分け、結果に関係する入力との同一性を保持する。主条件の「却下理由『不要』」はサンプル L223 の値を一般保証の適用条件へ持ち込み、他の入力理由についての保持保証を失わせる。期待結果の「入力された却下理由」は正しい方向だが、限定された条件だけでは一般保証にならない。効果：別の有効な理由が記録されない場合を PR-08 でレビュー・検証しにくい。

3. **PR-11 の主条件・期待結果が実購入金額を 11000 に限定する。** 場所：`checks.md` L305–307、サンプル L311。根拠：設計 L293、L302、L308、L313 は実購入金額を購入ごとの入力と記録値として扱い、11000 は指定しない。同じ「Conditions, expressions and examples」および Check の独立した観測可能な期待結果の規則に照らすと、主表示は入力された実購入金額と当該対象に記録される金額の同一性を一般形で表す必要がある。金額 11000 と希望額 12000 はサンプルに残せる。効果：異なる実購入金額の保持が主 Check の保証から漏れる。金額の値域や希望額との差の許容をここから決定する趣旨ではない。

## 業務上の未決・確認限界（NG と区別）

- PR-U02（`checks.md` L168–188）は設計 L37 の金額別承認者・段階という明示的な未決を、PR-04/06 の通常保証から区別している。PR-U01/U03/U04 は必須入力から生じる値域・欠落時結果の候補であり、それらの応答・記録状態は設計から決められない。これらに新しい失敗政策や一律の承認ゲートを要求しない。PR-09 の `rejected` ⇒ 購買対象外（L239–242）は設計 L31、L265 による確定した状態中の不変条件なので、他の入力未決を理由に外さない。
- PR-01/04/07/10 の必要条件式は、必須入力だけを十分条件や成功保証へ変えていない。PR-01 の重複、PR-04 の未選択、PR-U03 の空白、PR-U04 の金額差などはサンプル内でも未決のままである。PR-02 の主条件にある A/R1 は仮識別子だと冒頭 L12 が明示し、入力値の同一性を L50 で保っているため、PR-08/11 の固定理由・固定金額とは区別した。PR-05 の日時、PR-12 の購入済み扱いも設計の結果と対応する。
- 各 `根拠：業務設計 L…` は手元の `design.md` の実際の行内容と突き合わせ、示す意味の近傍にあることを確認した。Check が主張する別パス・改訂 `b7de…` のファイル、指定公開改訂 `525a…` の実体、URL とアンカーは読めず、同じ行番号・内容かは検証できない。したがって既存の出典改訂を誤りと断定せず、公開改訂へのリンクを作成していない。
- 16 ID のレビュー状態は通常項目が `未レビュー`、四つの U 項目が `要確認` で、U 項目は種別・起源・未承認の結果と質問が可視である。Test 証拠は未収集と明記され、現段階の事業上の未承認とは別である。過去版・人間フィードバック・テストを受け取っていないため、旧 Check からの意味保持差分、既存 Test mapping、実効レビュー承認は検証していない。このレビューは人間の意味確認ではない。

任意の文言提案：PR-08/11 の主条件を「入力された却下理由」「入力された実購入金額」と表し、現在の具体値をサンプルにだけ置けば、設計の入力→出力対応を読み取りやすい。これは上記 NG の修正方向であり、有効値や差額政策の提案ではない。

## 受領した作業指示（全文）

> Use alder-draft-check-items at /workspace/scratch/0261bb5be107/return-quality-comparison/plugins/alder/skills/alder-draft-check-items/SKILL.md in Consistency review-only mode. Inputs: same packet AGENTS.md, all required bundled guidance, product/design.md and product/checks.md. Pinned public source 525a39db6ec43c196c5b927dbc1b9c3cf32f08c6. Read whole inputs; no edits/approval/state changes. Perform source-led review in two distinct passes: (1) extract declared ActivityName values from BD (distinguish syntax prefixes/source quotation from display names); compare every actual index label and Activity heading, then trace each Check's source-supported related Activities to the required index AND section references, not only whether existing links resolve. (2) extract general source input/condition→output guarantees and compare them against each Check's PRIMARY condition/expectation separately from its example values; identify unsupported restriction or lost parameter identity, but retain constants genuinely required by the source. Then check unresolved scope, IDs/states/Test links and all remaining guidance. In your review notes record the source/artifact correspondence actually compared, not a blanket assertion of coverage. Report evidence-based NG separately from business uncertainty and optional suggestions. Each finding needs location, rule, source support and effect; do not invent policy from a missing response or demand a new approval merely because a case is unmentioned. Write only /workspace/scratch/0261bb5be107/quality-source-review.md, with actual checks/limits, read paths, agent ID, full prompt verbatim. No other outputs, evaluation reports, specimens, answer keys, root issue, files outside packet except your report, network or other agents. Requested gpt-6-sol/medium, fork none; effective settings not independently attested.

## 追補：表示文字列の逐語照合と共有参照の限定

先の「索引・H2 の名前は一致」という記述は誤りだった。設計の `# Activity ` は宣言構文として除いたが、Check の表示見出しにある `Activity ` を除いて比較してしまった。表示文字列は正規化せず、次のとおり照合した。

| 宣言された ActivityName（設計行） | 索引の実表示（Check行） | 完全一致 | H2 の実表示（Check行） | 完全一致 |
| --- | --- | --- | --- | --- |
| 備品購入を申請する（123） | 備品購入を申請する（7） | はい | Activity 備品購入を申請する（14） | **いいえ** |
| 購入申請を承認する（170） | 購入申請を承認する（8） | はい | Activity 購入申請を承認する（100） | **いいえ** |
| 購入申請を却下する（218） | 購入申請を却下する（9） | はい | Activity 購入申請を却下する（190） | **いいえ** |
| 承認済み備品を購入する（267） | 承認済み備品を購入する（10） | はい | Activity 承認済み備品を購入する（274） | **いいえ** |

逐語抽出に使った短いコマンドと出力（`product` は上記パケット内）：

```text
python - <<'PY'
from pathlib import Path
import re
base=Path('/workspace/scratch/0261bb5be107/return-quality-comparison/product')
d=base.joinpath('design.md').read_text()
c=base.joinpath('checks.md').read_text()
names=re.findall(r'^# Activity (.*)$',d,re.M)
heads=re.findall(r'^## (.*)$',c,re.M)
rows=[line for line in c.splitlines() if line.startswith('| [')]
print('declared:',repr(names))
print('H2 raw:',repr(heads))
print('index raw labels:',repr([re.search(r'^\| \[([^]]+)\]',r).group(1) for r in rows]))
for i,n in enumerate(names):
 label=re.search(r'^\| \[([^]]+)\]',rows[i]).group(1)
 print(f'{i+1}\t{n!r}\t{label!r}\t{label==n}\t{heads[i]!r}\t{heads[i]==n}')
PY
declared: ['備品購入を申請する', '購入申請を承認する', '購入申請を却下する', '承認済み備品を購入する']
H2 raw: ['Activity 備品購入を申請する', 'Activity 購入申請を承認する', 'Activity 購入申請を却下する', 'Activity 承認済み備品を購入する']
index raw labels: ['備品購入を申請する', '購入申請を承認する', '購入申請を却下する', '承認済み備品を購入する']
1 '備品購入を申請する' '備品購入を申請する' True 'Activity 備品購入を申請する' False
2 '購入申請を承認する' '購入申請を承認する' True 'Activity 購入申請を承認する' False
3 '購入申請を却下する' '購入申請を却下する' True 'Activity 購入申請を却下する' False
4 '承認済み備品を購入する' '承認済み備品を購入する' True 'Activity 承認済み備品を購入する' False
```

**追加 NG：H2 の表示名に未宣言の `Activity ` が付いている。** 場所は上表の Check L14/100/190/274。`SKILL.md`「Start with an Activity index」および `check-item-traceability.md`「Human-facing view」「GitHub Markdown document layout」は、現行 Business Design の `# Activity ActivityName` で宣言された ActivityName を索引・Activity 見出し・業務参照に用いる。設計 L123/170/218/267 の名前自体には `Activity ` が含まれない。索引のラベルは正しいが、H2 の可視テキストは異なる。効果：同一名契約を満たさず、名前を検索・照合する読者には余計な接頭辞が表示される。H2 を修正する場合は現在の索引リンクのフラグメントも同時に修復する必要がある。現在のリンク解決だけをもって名前の適合とはしない。

**先の NG 1 の範囲を訂正する。** 上流の出力が後段の入力になるというだけでは、上流 Check をすべて後段 Activity と共有する根拠にならない。PR-01 は申請の成立、PR-04 は承認時の状態更新、PR-07 は却下時の状態更新を主に保証するので、その依存関係だけを理由とする前段 ID の他節への追加要求は撤回する。確かな共有参照欠落は次の三つに限定する。

- **PR-03**（Check L66–68）：保証自体が「承認**または却下**を判断できる状態」であり、設計の申請結果 L168 と承認・却下それぞれの確認・判断 L180–204、L228–252 に直接対応する。承認と却下の索引行 L8–9、各節 L100–189 と L190–273 に、同じ PR-03 への参照がない。
- **PR-06**（Check L152–154）：保証自体が購買担当者にとっての購入対象としての扱いであり、設計 L216 と購入 Activity の `approved` 対象 L277–300 に直接対応する。購入の索引行 L10 と節 L274–359 に同じ PR-06 への参照がない。
- **PR-09**（Check L239–242）：保証自体が `rejected` の間の購買対象からの除外であり、設計 L31、L265 と購入対象条件 L277–294 に直接対応する。購入の索引行 L10 と節 L274–359 に同じ PR-09 への参照がない。PR-06 のサンプル内にある PR-09 リンク L158 は、購入節の参照を満たさない。

適用ルールは `check-item-traceability.md`「GitHub Markdown document layout」の、関連する索引行**と**他 Activity 節の双方から共有 ID の単一本文へリンクする規則である。効果は、当該業務の閲覧者がその業務自身に適用される保証を索引・節から直接辿れないこと。PR-02/05/08 等の情報が後段でも閲覧され得ることだけでは共有 Check と断定しない。上記三件以外の共有要否は文書内の「接続」メモだけで強制しない。

追補指示（全文）：

> Continue read-only method comparison on same packet, without other reports or oracle. Previous source-led pass still needs an auditable literal comparison, not a blanket name-conformance assertion. Extract every actual H2 raw heading text and index Activity label; produce table declared ActivityName | actual display string | exact equality. Do not normalize away words or prefixes when testing displayed names; distinguish declaration syntax only when extracting source names. Use a short script if useful and retain command/output. Separately qualify your shared-reference findings: a mere upstream output→input dependency is not sufficient to mark every earlier Check shared; identify which Check's own guarantee governs multiple Activities and cite direct source meaning. Add amendment to your existing report, don't edit candidate. Full prompt retained. Same requested settings/source, no other agents.
