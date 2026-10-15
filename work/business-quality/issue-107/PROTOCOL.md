# Issue #107 事前登録

基点: Alder main merge commit `d9dba20f5c986f18542031cf9f24a12cfdd4ce57`、tree `2a2b06c1583e4648b0b88b4afa024a2bf8500015`。Plugin 0.2.6 の repo Authoring Skill と同梱ガイドを baseline に用いる。#108 までの記録は変更しない。

4 case × 2 arm の計8 Fresh context を各1回。requested model `gpt-6-sol`, effort `medium`, `fork_turns: none`。Agent には自身の `notes.md` と run の `AGENTS.md`、repo `AGENTS.md`、repo Authoring Skill と同梱参照資料だけを渡す。treatment だけ固定 `guidance.md` を追加する。Issue 本文、評価条件、他 case / arm / raw、root のタスクは読ませない。実効設定・共有 filesystem の隔離は独立に証明できない。

- A 給与: 指定日17時、重複支払禁止、変更者の追跡と期限が source で明示。現状の1件翌朝・約2時間・Medium と Quality の将来条件を区別。一部失敗再実行の処理は未決で、推測で確定しない。Baseline が既存欄で自然に表現できるかが主要論点。
- B 通常予約: 品質水準の根拠なし。業務の重複禁止、変更、取消後の枠だけを扱う。NFR 数値や過剰な問いを生成しないかを観察。
- C 窓口と集計: 受付時間帯の業務継続と翌営業日までの報告という異なる許容条件。情報システム稼働そのものと業務継続を混同しない。未決の紙運用を決めない。現状 Problem を捏造しない。
- D 振込先変更: 承認権限と2年追跡を業務判断として保持し、技術担当の未承認の暗号・コンテナ・DB案を要件化しない。事故や Pain は捏造しない。

初回回答・設計書・read log を各 run で保存。評価は raw と hash 固定後の独立 Fresh evaluator が、(1)既存欄の充足、(2)分離による理解、(3)重複・質問数、(4)Quality/Problem/Pain、(5)業務/技術境界、(6)optional性、(7)Check Item/設計への導出可能性、(8)捏造・一般NFRリスト化を照合。人間による業務意味の承認を主張しない。恒久採否を証拠で決め、grammar は結果前に変更しない。
