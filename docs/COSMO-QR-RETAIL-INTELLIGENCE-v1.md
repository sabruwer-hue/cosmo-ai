# Cosmo QR Retail Intelligence & Product Information Hub v1.0

**Document ID:** COSMO-QR-RETAIL-001  
**Status:** Product specification for implementation planning; not yet deployed.

## 1. Product concept

A retail business creates a digital information hub for each product, product variant or shelf location. Cosmo generates a QR code and printable shelf label. A shopper scans the code using an ordinary phone camera and opens a fast, mobile-friendly, public product page—no app installation or account required.

The same QR can lead to a live product hub whose authorised information can be updated without reprinting the sticker. The QR should identify a stable public product-hub URL, not encode a price or private inventory data directly.

The tool should be useful for small independent shops as well as larger retailers.

## 2. Core customer journeys

### Retailer / staff

1. Create a store and choose a location/branch.
2. Add a product manually, by barcode/SKU, CSV import or approved catalogue integration.
3. Upload one or more product images.
4. Enter description, price, unit/size, product options and relevant details.
5. Add batch/expiry information where applicable.
6. Set promotion price, start/end time and terms.
7. Enter stock level, low-stock threshold, supplier and expected replenishment details.
8. Generate QR code and shelf-label PDF with product name, optional image, price and QR.
9. Print and place the label on the shelf.
10. Update product/price/stock/order information from the dashboard or staff mobile scanner.
11. Review scan analytics, customer interest and product information freshness.

### Shopper

1. Scan the QR with a normal phone camera.
2. Open the product page instantly.
3. See current price, product image, description, size/variant and promotion status.
4. See expiry information where relevant and appropriate.
5. See stock availability and a carefully worded replenishment estimate when verified.
6. View product specifications, ingredients, allergens, usage, care, warranty, manuals or other category-specific details.
7. Optionally compare variants, save/share the product page or contact the store.
8. See a clear last-updated time and store/branch identity.

## 3. Product information fields

### Standard product record

- Product name, brand, SKU, barcode/GTIN and category.
- Product images, alt text and image rights/provenance.
- Description and key features.
- Variant, size, colour, model, pack quantity and unit price.
- Store-specific current selling price and currency.
- Promotion price, start/end timestamps, eligibility and terms.
- Store/branch and shelf/location reference.
- Public product URL and QR identity.
- Language and accessibility settings.
- Published/unpublished state and last-updated timestamp.

### Batch and expiry

- Batch/lot identifier.
- Expiry or best-before date.
- Quantity associated with the batch.
- Stock rotation/FEFO reminders for authorised staff.
- Multiple batches per SKU.
- Public expiry disclosure rules configurable by product category and local law.

Do not show a single expiry date as if it applies to every unit when multiple batches exist. Public pages may say “short-dated stock available” or show a specific batch expiry only when the retailer confirms that the shopper can identify/select that batch.

### Inventory and replenishment

Internal staff view:
- On-hand stock, reserved stock and available-to-sell quantity.
- Reorder threshold and target stock.
- Supplier, purchase order, expected delivery date and order status.
- Last stock count, adjustment reason and responsible staff member.
- Stock movement history and low-stock alerts.
- Sales velocity and estimated days of cover, only when enough reliable history exists.

Public shopper view:
- In stock / limited stock / out of stock, according to a retailer-defined policy.
- Optional expected restock date only when supported by a confirmed or clearly labelled estimated supplier delivery.
- Never expose supplier prices, exact sensitive stock quantities, internal purchase orders or security-sensitive inventory details by default.
- Show timestamp or freshness status to avoid stale availability claims.

## 4. Additional useful features

- Shelf-label designer: printable QR + product image + current price + unit price + promotion dates.
- Batch expiry alerts and FEFO stock rotation for staff.
- Automatic promotion start/end and scheduled price changes.
- Price-change approval and audit history.
- Barcode scanner for rapid product lookup and stock counts.
- Bulk import/export and template-based product upload.
- Duplicate SKU/barcode detection.
- Product variants and bundles.
- Multilingual product descriptions.
- Accessibility-friendly text, large print and optional audio description.
- Manuals, warranty documents, safety sheets and product demonstration videos.
- Customer FAQ and store contact/availability enquiry.
- Optional customer feedback or product-interest analytics with privacy-safe aggregation.
- Scan analytics by product, branch, campaign and time, avoiding unnecessary personal tracking.
- Optional click-and-collect or order link in a later phase.
- Multi-branch catalogue and central product templates with branch-specific pricing/stock.
- Role-based permissions for staff, managers and owners.
- Offline staff draft queue with safe conflict resolution; public product pages should show when cached information may be stale.

## 5. QR and label design

- Stable opaque QR ID mapped to a product-hub record.
- QR destination remains stable when price, image or stock changes.
- Support QR per SKU, variant, shelf position or selected batch where justified.
- Printable A4 sheets and common shelf-label sizes.
- Optional logo, product image, price, unit price, promotion badge and human-readable short URL.
- High contrast, adequate quiet zone, error correction and minimum physical size tests.
- Never include customer data, supplier credentials, internal stock data or raw payment data inside a QR code.
- Revocable/redirectable QR identifiers to handle product discontinuation or malicious sticker replacement.

## 6. Data architecture

Proposed domain entities:
- `retail_tenants`, `retail_stores`, `retail_memberships`
- `retail_products`, `retail_variants`, `retail_product_media`
- `retail_prices`, `retail_promotions`, `retail_promotion_rules`
- `retail_batches`, `retail_stock_levels`, `retail_stock_movements`
- `retail_suppliers`, `retail_purchase_orders`, `retail_purchase_order_lines`
- `retail_replenishment_events`
- `retail_product_hubs`, `retail_qr_codes`, `retail_shelf_labels`
- `retail_scans`, `retail_analytics_events`
- `retail_audit_events`

All business data must be tenant- and store-scoped. Public product hubs expose only explicitly published fields. Internal stock, suppliers, purchase orders, cost prices and staff details require authenticated role checks. Public QR endpoints must be read-only, rate-limited and resistant to enumeration and scraping.

## 7. Integrations and boundaries

Phase 1 should work without a POS integration: retailer maintains products, price, batch and stock through the Cosmo interface or CSV import.

Later connectors can synchronise with supported POS, inventory, accounting, e-commerce and supplier systems. Never claim a connector is live until credentials, permissions, data mapping, sync direction, error handling and reconciliation have been tested.

A POS should remain the source of truth when configured as such. Define conflict resolution before two-way sync. Prevent a QR page edit from silently overwriting the POS price.

## 8. Security, privacy and compliance

- Tenant isolation and row-level access policies.
- Staff role and branch scope.
- Audit trail for price, promotion, batch and stock changes.
- Manager approval for sensitive price changes where configured.
- Signed/verified integrations and secrets stored server-side.
- Public pages expose only approved fields.
- Rate limits, abuse monitoring, QR revocation and anti-tamper guidance.
- Privacy-safe analytics; avoid collecting identifiable shopper data unless necessary, disclosed and lawfully consented.
- Food, medicine, cosmetics, electrical and other regulated categories need category-specific disclosure and legal review. The app must not invent expiry, allergen, safety or compliance claims.

## 9. Delivery phases

1. **MVP catalogue:** tenant/store, product CRUD, image upload, SKU/barcode, price, public product hub, QR creation and shelf-label PDF.
2. **Retail operations:** promotions, expiry batches, low-stock threshold, stock movements, supplier and expected delivery tracking.
3. **Staff mobile workflow:** camera scanning, stock count, product lookup, price/label refresh and role controls.
4. **Insights:** scan analytics, sales/stock trends and reorder suggestions based on real history.
5. **Integrations:** POS and inventory connectors, then optional click-and-collect.

## 10. Acceptance criteria

- QR scan opens the correct published product hub on common mobile browsers without login.
- Price and promotion windows reflect current branch data and timezone.
- Unpublished/private fields never appear in the public response.
- Changing a price/image does not require reprinting the QR.
- Expiry information is batch-aware and cannot falsely represent all units.
- Low-stock and restock messages are based on recorded stock/order events and show uncertainty where appropriate.
- Public pages identify store and last-updated time.
- Staff can create, download and print a valid QR shelf label.
- Tenant isolation, role permissions, audit events and rate limits pass tests.
- POS sync, if enabled, is reconciled and cannot silently overwrite conflicting records.

## 11. Monetisation fit

The QR Retail Intelligence tool can be sold as:
- A once-off lifetime software unlock for the basic QR/product-hub creator, subject to disclosed version and support terms.
- Optional recurring memberships for hosted product pages, image/file storage, multi-branch sync, inventory alerts, analytics, staff seats and POS integrations.
- Usage-based charges only for genuinely variable external services such as SMS notifications or unusually high media processing.

The customer keeps the lifetime tool entitlement if they remove the package; hosted services and stored data remain subject to the chosen service membership, retention policy and export terms. Make that distinction clear before purchase.
