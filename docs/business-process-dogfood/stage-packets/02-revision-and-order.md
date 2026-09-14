# Stage 2 — Quotation revision and Order creation

Sales searches and corrects an existing Quotation. Sales may create an Order from one Quotation or create an Order directly without a Quotation. An Order created from a Quotation copies its then-current header and lines. The Quotation/Order 0..1:0..1 relation in frozen DDL must hold. Later Quotation changes do not alter an existing Order.
