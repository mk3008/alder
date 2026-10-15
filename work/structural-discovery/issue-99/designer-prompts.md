# Designer agent instructions and source access

The following three payloads are transcribed as received from `/root`, without additions inside the quoted blocks.

## Initial assignment

```text
Act solely as Fresh Designer Agent for Alder Issue #99. Work in /workspace/scratch/99d5915a6094/alder on research/issue-99-authoring-discovery. Read AGENTS.md, plugins/alder/skills/alder-draft-business-design/SKILL.md and its mandated references; use actual Alder authoring skill for initial draft and both subsequent revisions. Read ONLY work/structural-discovery/issue-99/initial-brief.md as business source at start. Do NOT read scenario.md, oracle.sha256, sealed-99/, prior Discovery/Optimization research, other agents' results. Write only Business Design snapshots in work/structural-discovery/issue-99/design/ as directed, each draft with explicit unconfirmed questions and fidelity; no manual completion outside skill. First produce v1.md from initial brief and report exact questions to root without reading more. Root will send Customer answers, then use same skill to revise into v2.md; later root will send change, then revise into v3.md. Record concise account of actual skill guidance read and files accessed. Do not read new inputs until relayed. Do not commit or push. No oracle disclosure. Requested gpt-6-sol medium fresh context.
```

## First followup: customer answers for v2

```text
Customer answers to your five questions, verbatim; use actual authoring skill to revise existing v1 into v2.md while preserving unconfirmed points. Do not read scenario/oracle/other sources. 1. 対象は登録済みの地域住民です。住民は窓口に工具の種類と利用期間を申し込み、窓口担当が会員登録と貸出条件を確認します。条件の細則は確認が必要です。電動ドリルセットは金曜から翌月曜のように数日間貸すこともあり、貸出期間は受取予定から返却予定までです。窓口はその期間に貸出予定のない備品番号を探し、現物の状態を確認して割り当て、受取予定を本人に伝えます。受取時には番号と付属品を一緒に確認し、住民の受取署名を得て引き渡します。返却時は窓口で番号と付属品を照合して返却日時を記録します。貸出の受渡しは署名と引き渡しの記録、返却の受領は照合と返却日時の記録で確認します。返却された組は整備担当の点検を待ちます。 2. 貸出にも講座にも同じ備品を使います。講座担当は水曜正午の募集締切後に参加人数を確定し、必要な工具の種類と組数を講座予定表に記します。個別の備品番号を記して棚から取りそろえるのは前日金曜の午後です。窓口担当は申込時に貸出台帳の希望期間の予定、棚の現物と整備中の札を確認し、番号を割り当てて受取予定を伝えます。講座予定表の種類と組数は閲覧できますが、貸出台帳に講座用の個別番号としては転記していません。利用希望が重なった場合の優先順位や割当変更の承認者は、統一した規則をまだ決めていません。講座の工具は終了後に全数を受け取って整備担当に回し、整備担当の点検で使用可能となってから次に使います。 3. 講座担当が講師と日時を決めて参加申込を受けます。申込の具体的な方法は確認が必要です。募集は水曜正午に締め切り、その後に参加人数を確定します。講師に必要な工具の種類と組数を確認し、講座予定表に日時、会場、講師、種類、組数を記録します。通常の土曜講座は10時から正午までで、ドリルを使う場合は通常3組です。前日金曜午後に棚から備品を取りそろえ、整備中の札があるものは選びません。番号と付属品を点検票に書き、講師に渡します。講師は使用前にその回に使う組、保護具、作業場所を確認します。終了後は工具を全数受け取り、整備担当の点検へ回します。終了時の全数確認以外の完了基準は確認が必要です。 4. 返却後は、窓口で番号と付属品を照合して返却日時を記録し、整備担当の点検を待ちます。窓口から整備担当への具体的な引渡し方法は確認が必要です。整備担当は備品番号、付属品、動作を点検し、番号、状態、作業、使用可能への復帰日時を整備記録に残します。使えない組には整備中の札を付け、その間は貸出にも講座にも出しません。点検結果を誰へどう伝達するかは確認が必要です。整備担当が点検し、使用可能への復帰を記録した後に次の利用に回します。貸出時と講座前には、それぞれの使用場面での確認も行います。 5. 整備担当は貸出返却後と講座終了後に点検し、使えない組には整備中の札を付けて、状態と作業を整備記録に残します。修理開始の判断基準や修理待ち・修理不能時の詳しい扱いは、まだ確認が必要です。整備担当は備品番号、付属品、動作を点検し、使える状態へ戻った日時を記録します。整備中の組は両サービスに出しません。使用前には、貸出では住民と番号・付属品の状態を相互確認し、講座では講師がその回の組、保護具、作業場所を確認します。修理後の使用を認める手続きの細則は確認が必要です。 Report changed parts and new questions.
```

## Second followup: later addition for v3

```text
Customer's later addition verbatim. Use actual Alder authoring Skill to revise existing v2 into v3.md. Preserve existing business meaning, mark unknown handoffs/policy explicitly, do not access scenario/oracle/research. 「来月から月1回、近隣の学校へ出向く土曜午後の出張修理講座を始めます。講師と講座担当が金曜の正午に道具室でドリルセット4組と保護具を箱詰めし、学校に運びます。講座は土曜13時から15時で、道具は土曜夕方に戻します。学校への開催通知は前週の金曜までに出します。今の在庫を使い、新たな専用備品は購入しません。これを既存の業務設計にも反映してください。」 Report exact changed elements and unconfirmed questions, no commit/push.
```

## Third followup: fidelity correction for v4

```text
Customer clarification verbatim, prompted by fidelity review: 「窓口担当は講座予定表に載った工具の種類と必要数を閲覧できます。ただ、住民の申込を受けたときの確認は貸出台帳の予定と整備中の札で、講座予定表の種類と組数を毎回照合する定例手順があるとは決めていません。講座の種類と組数は、個別番号の貸出予定として貸出台帳へ転記していません。」 Use the same actual authoring Skill to revise v3 into v4.md with only necessary fidelity correction, retaining all uncertainties and existing meaning. Do not read evaluation, scenario, oracle, or research. Report diff summary and questions. Save this exact prompt in designer-prompts.md and do not commit/push.
```

## Files actually read and guidance applied

| Stage | Read files or text | Other file access |
| --- | --- | --- |
| v1 | `AGENTS.md`; `plugins/alder/skills/alder-draft-business-design/SKILL.md`; `plugins/alder/skills/alder-draft-business-design/references/adoption.md` (including §1 through §2); `plugins/alder/skills/alder-draft-business-design/references/business-graph.md` (including the opt-in profile through its minimal example); `plugins/alder/skills/alder-draft-business-design/references/provenance.json`; `work/structural-discovery/issue-99/initial-brief.md`. | Listed paths matching `AGENTS.md`, `SKILL.md`, and `initial-brief.md` with `rg --files`. Wrote `design/v1.md`. |
| v2 | The first followup text above and selected lines of the newly written `design/v2.md` to verify an edit. No additional business source file. | Wrote `design/v2.md`; ran `tools/business_graph/export.py` against v2 with output discarded. |
| v3 | The second followup text above and the tail of the newly written `design/v3.md` to verify an edit. No additional business source file. | Copied v2 to `design/v3.md`, revised v3; ran `tools/business_graph/export.py` against v3 with output discarded. |
| v4 | The third followup text above; searched selected lines of the copied `design/v4.md` to locate the claim. No additional business source file. | Copied v3 to `design/v4.md`, revised v4; ran `tools/business_graph/export.py` against v4 with output discarded. Updated this prompt record. |

Applied Alder plugin `0.2.1`; bundled authoring source revision from provenance: `af733229c7f20c5a9fc1c4f094a8fb8c548fe544`. The exporter checks the optional profile's structure, not business agreement. No restricted business sources were read, and no commits or pushes were made.
