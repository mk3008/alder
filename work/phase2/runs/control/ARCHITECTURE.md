# Existing requirements

- Request-facing order code must not import database-driver modules.
- `src/shared/money.js` is the existing money formatting contract. Billing and refunds already rely on it.
- Do not change public behavior outside the requested tasks.
