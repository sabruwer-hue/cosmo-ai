# Cosmo Business, Social, Advertising & Trading Intelligence Extensions v1.0

**Document ID:** COSMO-EXTENSIONS-001  
**Status:** Requirements and architecture proposal; not a deployed financial or business service  
**Relationship:** Extends COSMO-SUBSCRIPTION-PRODUCT-PORTFOLIO-v1.md and COSMO-CORE-BLUEPRINT-v1.md

## 1. Purpose

Extend Cosmo's modular product family with four clearly separated capabilities:
1. **AccountIT AI** — business administration, accounting and operational intelligence.
2. **Social Hub** — connected social account management and content publishing.
3. **Ad Page** — paid classified/listing and advertisement marketplace, distinct from campaign-oriented Ad Studio.
4. **Cosmo Trading Intelligence** — market research, opportunity monitoring, strategy evaluation, paper trading and (only after strict approval gates) broker-connected trading.

These are proposals to validate and stage. A screen or backtest is not proof of a working or profitable service.

## 2. Historical business-tool recovery

The recovered Cosmo/Ecoverse records show a broad business ecosystem, including:
- **EcoverseHQ** as an all-in-one business-services environment.
- **EcoMall / EcoStore** for marketplace, products, orders and seller operations.
- **Tiny Monsters Club** for specialist stock, breeder/dealer/client relationships and listings.
- **Mr Dispatch / Aflewerings** for dispatch, delivery, freight, transport, hire, towing and roadside assistance.
- **HomeCrafter / Homebaker** for service/product business workflows.
- **ForgeCode / ForgeFlippa** for software/product creation and marketplace-related business concepts.
- **Currency Coin / CCToken**, **EVC/Ecoverse token concept**, and **BITKAI Economy / BITKAI PAY** as distinct historical financial/economic concepts. Their relationship is unresolved; do not merge or issue tokens based on names alone.
- **Business Strategy and Research Board**, business performance intelligence, sales/margins/pricing/demand/inventory/subscriptions/cashflow, accounting/commissions/rewards/wallet/economic modelling.
- Reusable patterns from the Elaine's Jewellery Box admin system: business records, enquiries, reviews, products and order management. This is a source-project pattern to inspect and generalise, not proof of a reusable accounting ledger.

The historical portfolio is a first-pass recovery, not a complete source-code inventory. Before reusing anything, create a capability card per source project: exact function, UI/backend status, data model, algorithms, integrations, tests, licences, dependencies, known defects and migration cost. Do not claim accounting, payroll, tax or banking features existed unless source evidence proves it.

## 3. AccountIT AI — standalone subscription candidate

**Working name:** AccountIT AI (name subject to trademark/domain and customer validation).  
**Positioning:** AI-assisted business administration and financial operations for sole traders, small businesses, growing firms and bookkeepers.

### 3.1 Proposed modules
- Business profile, legal entity details, branches, users, roles and permissions.
- Customer and supplier directory (CRM-lite).
- Quotes, estimates, invoices, credit notes, statements and payment status.
- Sales, purchases, expenses, receipts and document capture with human verification.
- Chart of accounts, double-entry general ledger, journals and reconciliation.
- Cashbook, bank statement import and transaction matching; bank connection only through approved providers and scopes.
- VAT/tax-ready records, tax summaries and export packs; tax calculations must be jurisdiction-specific and reviewed by qualified professionals.
- Accounts receivable/payable, ageing, reminders and dispute status.
- Stock, SKU, batches/serials, stock movements, reorder levels and purchase orders.
- Basic payroll records and payroll-provider handoff only after labour/tax/legal requirements are validated; do not imply payroll compliance before certification.
- Projects, job costing, time tracking, cost allocation and profitability.
- Recurring invoices, subscriptions, payment links and reconciliation.
- Budgets, forecasts, cashflow scenarios, break-even and margin analysis.
- Business intelligence dashboards: sales, gross margin, expenses, debtor days, stock turns, customer concentration and cash runway.
- AI assistant for explaining anomalies, drafting quotes, categorising transactions for review, identifying missing records and answering questions with source-linked calculations.
- Export, audit trail, backups, retention and accountant access.

### 3.2 Accounting integrity requirements
- The ledger is deterministic and double-entry; AI may suggest classifications but cannot silently post or alter balances.
- Every posted transaction has immutable source references, actor, timestamp, period, currency, tax treatment and reversal/correction path.
- Never delete posted financial records; use reversals and adjustments.
- Reconciliation must show matched, unmatched and uncertain items; no fabricated balances.
- Preserve original receipt/invoice files and extracted values separately.
- Multi-currency FX rate source, timestamp and conversion method must be recorded.
- Period close, audit export, role separation and accountant review are required.
- Separate business entities and client books by tenant and permissions.
- AI explanations and forecasts show formulas, assumptions, confidence and data coverage.
- Integrations with banks, tax authorities, payment gateways and payroll systems require current local legal/provider review.

### 3.3 Suggested release sequence
1. Quotes, invoices, expenses, customer/supplier records and basic sales/expense dashboard.
2. Controlled double-entry ledger, reconciliation and accounting exports.
3. Inventory, purchase orders, receivables/payables and project costing.
4. Cashflow forecasting, anomaly detection and accountant collaboration.
5. Jurisdiction-specific tax/payroll integrations only after expert review and compliance validation.

Start South African requirements discovery, but do not assume SARS, VAT, PAYE, UIF, Companies Act or POPIA compliance merely because fields are present. Obtain qualified review and maintain effective-date/versioned rules.

## 4. Social Hub — standalone or add-on subscription

**Purpose:** a single creator/business workspace to plan, produce, approve, schedule and publish content across connected social accounts.

### Features
- Connect social accounts through official OAuth/API flows and user-granted scopes.
- Account and page switcher; permissions and connected-account health.
- Unified content calendar, drafts, campaigns and media library.
- AI ideation, captions, hashtags, scripts, alt text, translations and content variants.
- Image/video resizing and platform-specific formatting.
- Cross-post composer with per-platform previews and user approval.
- Scheduling and queue management where official APIs permit.
- Publishing status, failed-post retry, edit history and audit log.
- Comment/mention inbox only where APIs permit; human approval for replies.
- Analytics from authorised platform metrics; disclose unavailable metrics and API restrictions.
- Brand voice, content pillars, reusable templates and collaboration.
- Rights/consent records for music, images, faces, logos and creator contributions.

### Platform rules
Do not promise publishing to every network. Each platform has its own API, account type, review, rate limits, content and commercial rules. Build connector adapters and a capability matrix; unsupported actions must fall back to user-guided export/manual posting. Never collect social passwords; use official delegated authorisation. No mass unsolicited messaging, fake engagement, bot followers or deceptive automation.

### Commercial model
Offer Social Hub as a standalone subscription or add-on to Creator Studio/Team Up AI. Validate demand and API maintenance costs before finalising bundles.

## 5. Ad Page — subscription listing marketplace

**Purpose:** a paid listing/classified advertising surface similar in spirit to the advertising/listing pages discussed for Tiny Monsters Club, but designed as a reusable Cosmo product.

### Distinction from Ad Studio
- **Ad Page:** individual listings/ads, classified-style discovery, category pages, listing duration, renewals, boosts and seller enquiries.
- **Ad Studio:** campaign strategy, paid distribution, placements, creative variants, audience and campaign performance.
- **Creator Studio:** creates the creative assets.
- **Social Hub:** publishes approved content to connected social channels.

### Features
- Advertiser/seller account, verified profile options and business identity status.
- Categories, locations, listing templates, attributes and search filters.
- Free/paid listing tiers if commercially viable; paid featured/boosted listings.
- Listing creation, media upload, preview, moderation and approval.
- Subscription plans for listing allowances, renewal tools, bulk listing and analytics.
- One-off listing fees and optional promoted placement, each clearly itemised.
- Enquiries, lead inbox, response tracking and anti-spam controls.
- Expiry, renewal, archive, edit history and dispute process.
- Reporting, fraud signals, prohibited-items policy and moderation appeals.
- Optional product/order/booking handoff to approved marketplaces or seller sites.

For specialist marketplaces such as Tiny Monsters Club, create a configurable vertical/category experience with its own eligibility, animal welfare, legal and seller-verification policies. Do not assume every category or regulated product may be listed. Paid placement must be visibly labelled; ranking cannot secretly favour payment while claiming organic relevance.

## 6. Cosmo Trading Intelligence — high-risk financial product

**Purpose:** an independent research and monitoring system that evaluates markets, tests strategies and may eventually place tightly controlled trades through an authorised broker. Its primary first release is **market intelligence and alerts**, not autonomous money management.

### 6.1 Supported research universes (subject to licensed data and broker availability)
- Listed shares and exchange-traded funds.
- Foreign exchange pairs, including USD/ZAR.
- Crypto assets such as Bitcoin, subject to exchange, custody and regulatory controls.
- Other instruments only after separate legal, liquidity, data and risk review.

No assumption that all instruments are legally or technically available to every user in South Africa.

### 6.2 Architecture
1. **Market Data Gateway:** licensed historical and streaming data; source, timestamp, exchange, currency, corporate actions, survivorship and quality metadata.
2. **Market Scanner:** configurable watchlists, volatility/liquidity/spread filters, event/calendar monitoring and candidate detection.
3. **Research Workbench:** technical, fundamental, macroeconomic, sentiment and cross-asset research, with evidence provenance.
4. **Strategy Registry:** versioned strategy code/configuration, author, rationale, instrument scope, time horizon, dependencies and risk profile.
5. **Backtest Engine:** event-driven simulations with realistic fees, spreads, slippage, latency, partial fills, funding/borrow costs, FX conversion, corporate actions and market closures.
6. **Experiment Lab:** parameter search with strict separation of training, validation and untouched test periods; walk-forward and regime-specific evaluation.
7. **Paper Trading Engine:** live/simulated quotes and simulated execution before any live broker connection.
8. **Portfolio & Risk Engine:** exposure, concentration, leverage, drawdown, liquidity, correlation, position sizing and stop/kill rules.
9. **Decision & Alert Engine:** opportunity cards with thesis, contrary evidence, probability calibration, expected value ranges, costs, invalidation condition and expiry.
10. **Broker Adapter:** read-only account/market access first; trade placement disabled by default; broker allow-list, explicit user authorisation, two-step approval and auditable order lifecycle.
11. **Outcome Ledger:** prediction, strategy version, data snapshot, decision, order/fill, fees, exit, realised result, benchmark and post-trade review.
12. **Independent Audit:** CC/CC-SIM challenge, strategy risk review and policy engine; no strategy or agent may approve its own live deployment.

### 6.3 The "million previous trades" research idea — how to do it correctly
A million trade records can help stress-test systems, but quantity alone does not create accuracy. One million correlated or poorly labelled examples can produce misleading confidence.

Build a reproducible trade-research dataset:
- Use licensed, point-in-time market data and preserve raw snapshots.
- Include realistic order-book/spread/fee/slippage assumptions where available.
- Keep instruments, dates, sessions, corporate actions and delisted assets correctly represented.
- Label entry signal, available information at decision time, position sizing, exit rules, costs and outcome.
- Prevent look-ahead bias, survivorship bias, data leakage and repeated-sample leakage.
- Split chronologically into training, validation and untouched out-of-sample test periods.
- Use rolling walk-forward tests across bull, bear, sideways, high-volatility and crisis regimes.
- Compare against simple baselines (buy-and-hold, cash, index/benchmark, naive rules) and risk-adjusted measures.
- Evaluate net return, volatility, maximum drawdown, Sharpe/Sortino where appropriate, win rate, payoff ratio, turnover, capacity, tail loss, calibration and stability.
- Track strategy decay and regime dependence; retire strategies when evidence deteriorates.
- Include negative and failed strategies in the registry; do not cherry-pick winners.
- Publish a reproducible report and preserve dataset, code, parameters and environment versions.

### 6.4 Accuracy and profitability doctrine
- Never optimise only for win rate; a high win rate can still lose money.
- Do not use in-sample accuracy as evidence of future profitability.
- Require out-of-sample, walk-forward and paper-trading evidence before live consideration.
- Include all trading costs and realistic execution constraints.
- Use probability calibration and confidence intervals; allow "no trade" as a valid best decision.
- Detect overfitting, regime shifts, data quality failures and strategy drift.
- A backtest is a model of the past, not a guarantee about the future.
- Never promise "best", guaranteed returns, passive income or a target profit.
- The user's project-funding goal is a motivation, not a reason to increase risk or bypass limits.

### 6.5 Live-trading authority ladder
- **T0 — Observe:** read authorised data, scan markets, produce reports.
- **T1 — Alert:** notify user of candidates and risk conditions.
- **T2 — Simulate:** paper trades only.
- **T3 — Recommend:** draft a proposed order for user review; no order submitted.
- **T4 — User-approved execution:** only after broker/legal checks, explicit instrument/account/size/price/expiry approval, hard limits and verified order confirmation.
- **T5 — Bounded automation:** disabled by default; only considered after sustained independent evidence, explicit opt-in, revocable permissions, per-trade and daily loss caps, exposure/leverage caps, kill switch, outage handling and broker-side controls. No open-ended discretionary authority.

Default: Cosmo may scan and alert, but may not move funds, transfer crypto, withdraw assets, change beneficiary details or trade without the required approval. Never store broker passwords or private keys in prompts or model memory. Use broker OAuth/API keys with minimum permissions, ideally no withdrawal permission, isolated secret storage and immediate revocation.

### 6.6 South African launch gates
Before any customer-facing signal, advisory, brokerage, copy-trading or execution service:
- Obtain South African financial-services legal advice on the exact activity and instruments.
- Verify whether the service requires FSCA authorisation/licensing, an authorised intermediary, exchange membership, or other permissions.
- Review exchange/broker market-data redistribution and automated-trading terms.
- Verify crypto asset service provider requirements and custody arrangements if applicable.
- Define suitability, disclosures, conflicts, complaints, recordkeeping, privacy, cyber-security and client-money boundaries.
- Keep the first product personal/research-only unless and until qualified counsel confirms the permitted scope.

This document is an engineering/product design, not investment advice or legal advice.

## 7. Shared product platform and boundaries

- AccountIT AI owns business books, financial records, invoices, stock and business reporting.
- Social Hub owns connected social accounts, content calendars, publishing jobs and social analytics.
- Ad Page owns classified listings, listing subscriptions, enquiries and listing placement.
- Ad Studio owns advertising campaigns, paid distribution and campaign performance.
- Creator Studio owns creative asset production.
- Team Up AI owns shared human/agent workspaces.
- Cosmo Trading Intelligence owns market data, strategies, backtests, paper portfolios, risk and broker orders.

Products can share identity, billing, file storage, model routing and audit infrastructure. They must not share private customer/business/financial data by default. Every cross-product handoff is explicit, permissioned and logged.

## 8. Prioritisation and analytical build plan

### P0 — recover and verify
- Audit source repositories and prototype exports for EcoverseHQ, Ecoverse modules, TMC, Mr Dispatch, HomeCrafter/Homebaker, ForgeCode/ForgeFlippa, currency/token concepts and Elaine's admin patterns.
- Produce a source-backed capability inventory; mark each item idea/UI-only/partial/tested/deployed.
- Separate accounting/ledger functions from dashboards and wallet/token concepts.
- Define product boundaries and canonical names.

### P1 — low-risk business product validation
- AccountIT AI discovery and basic quote/invoice/expense/customer prototype.
- Ad Page listing workflow and monetisation tests.
- Social Hub official API capability matrix and draft/schedule prototype.
- Shared subscription/entitlement/usage foundation.

### P2 — financial correctness and platform integrations
- AccountIT double-entry ledger and reconciliation proof with accountant review.
- Social publishing connectors with approved scopes and audit.
- Ad Page moderation, renewals, fraud and payment reconciliation.

### P3 — trading research only
- Data licensing and instrument coverage.
- Research schema and strategy registry.
- Historical backtest engine and baselines.
- Walk-forward/out-of-sample test harness.
- Paper trading and risk dashboard.
- Independent review of performance claims.

### P4 — gated live trading research
Only after P3 evidence, legal clearance, broker permissions, independent security review and explicit user approval. Start with one instrument, small predefined limits and no withdrawal authority. Reassess before expanding.

## 9. Definition of done

Every feature carries status: Proposed, Researched, Specified, Prototyped, Implemented, Deployed, Verified or Production-ready. Each status requires evidence. A simulated market scanner, generated bookkeeping demo, mock social post or sample listing is not a live service.

Maintain a living decision register for assumptions, counter-evidence, costs, risks, dependencies, acceptance tests and approval history. Reassess continuously rather than postponing analysis until launch.
