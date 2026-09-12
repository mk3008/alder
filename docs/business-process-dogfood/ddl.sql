CREATE TABLE quotation (
  quotation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'ordered', 'expired'))
);

CREATE TABLE quotation_line (
  quotation_line_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quotation_id BIGINT NOT NULL REFERENCES quotation(quotation_id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  quantity NUMERIC(14, 2) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(14, 2) NOT NULL CHECK (unit_price >= 0)
);

CREATE TABLE customer_order (
  order_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  quotation_id BIGINT UNIQUE REFERENCES quotation(quotation_id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'confirmed', 'cancelled')),
  total_amount NUMERIC NOT NULL DEFAULT 0 CHECK (total_amount >= 0 AND total_amount = round(total_amount, 2)),
  shipment_at TIMESTAMPTZ
);

CREATE TABLE order_line (
  order_line_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES customer_order(order_id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  quantity NUMERIC(14, 2) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(14, 2) NOT NULL CHECK (unit_price >= 0)
);

CREATE TABLE order_approval (
  order_approval_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES customer_order(order_id) ON DELETE CASCADE,
  manager_id TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected')),
  decided_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_reservation (
  inventory_reservation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id BIGINT NOT NULL UNIQUE REFERENCES customer_order(order_id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('requested', 'reserved', 'failed', 'release_requested', 'released')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
