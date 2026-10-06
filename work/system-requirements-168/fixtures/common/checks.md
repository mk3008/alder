# confirmed Check Items
- C1 / confirmed: 受付成功時にcase_idとstatus=acceptedを返す。test_accept
- C2 / confirmed: 同じtenantのcaseを検索できる。test_read_own
- C3 / confirmed: 他tenantのcaseを読み取れない。test_read_foreign
- C4 / confirmed: 表示する件名の前後の空白を除去しても内容を保つ。test_subject
- C5 / confirmed: 移行後も既存caseのidと件名を保持する。test_migration_forward
Tests are evidence, not approval of new business meaning.
