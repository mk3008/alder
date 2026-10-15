# Control / Treatment Diff

The raw run trees are retained under `work/phase2/runs/control` and `work/phase2/runs/treatment`. A `git diff --no-index` comparison found no added or removed files. Both arms changed exactly the same four feature-local files:

- `src/invoices/index.js`
- `src/refunds/index.js`
- `src/catalog-import/index.js`
- `src/orders/http.js`

The only content differences were equivalent local implementations: variable naming/iteration in catalog import, error-message wording for invoice note and cancellation, a named local cancellation-window constant in Treatment, and a different local reduction form in refund summary. Neither arm changed `src/shared/money.js`, `src/orders/store.js`, test files, architecture requirements, or package metadata.

Exact command used after both runs:

```text
git diff --no-index -- <absolute-control-run> <absolute-treatment-run>
```

Its exit code was `1`, meaning content differences were found; it did not indicate a test or command failure.
