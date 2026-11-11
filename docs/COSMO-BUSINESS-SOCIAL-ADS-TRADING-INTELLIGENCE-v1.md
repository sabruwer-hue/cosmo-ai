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


### 6.7 Market Indicator & Scenario Engine — core intelligence component

**Purpose:** continuously evaluate authorised market data, identify meaningful changes and plausible future scenarios, then alert Cosmo's decision system. The engine informs decisions; it does not independently authorise investments or place orders.

#### A. Indicator families

Maintain versioned, instrument-appropriate indicators across several independent families:

1. **Price and trend:** returns across multiple horizons, moving averages, trend strength, momentum, breakouts, support/resistance hypotheses and price gaps.
2. **Volatility and market stress:** realised/implied volatility where licensed, volatility changes, range expansion, drawdown, correlations and stress proxies.
3. **Liquidity and execution:** bid/ask spread, depth where available, traded volume, turnover, market impact estimates, slippage and liquidity deterioration.
4. **Breadth and participation:** advance/decline measures, participation, concentration, sector/asset breadth and volume confirmation where applicable.
5. **Macro and rates:** inflation, policy rates, bond yields, central-bank events, employment/growth releases, commodity drivers and relevant South African/global macro data.
6. **Currency and cross-asset relationships:** USD/ZAR and other permitted FX pairs, dollar strength, rates differentials, commodities, equity indices, crypto correlations and cross-market stress.
7. **Fundamental and instrument-specific context:** earnings, guidance, valuation, corporate actions, dividends, splits, token supply/unlock events and other relevant instrument facts.
8. **Sentiment and positioning:** only from lawful, licensed and quality-assessed sources; distinguish measured positioning from noisy social sentiment.
9. **Calendar and event risk:** scheduled economic releases, earnings, exchange closures, policy decisions and known protocol/market events.
10. **Data quality and operational health:** stale feeds, missing candles, outliers, symbol changes, exchange outages and clock misalignment. Data-quality failure suppresses affected signals.

Do not apply every indicator to every asset. Each indicator declares its applicable instrument classes, horizon, required inputs, data frequency, warm-up period, failure conditions and known limitations.

#### B. Indicator registry and provenance

Every indicator has a stable ID and version, formula/specification, author/source, inputs, transformations, timestamp convention, applicable market/horizon, missing-data behaviour, calibration history, known failure modes, licence and test suite. Store raw input references and computed outputs so any alert can be reproduced. Avoid silent formula changes.

#### C. Regime and scenario classification

The engine maintains a probabilistic, multi-label market-regime view rather than forcing one certain label. Candidate regimes include:
- directional uptrend / downtrend;
- range-bound or low-conviction market;
- volatility expansion / contraction;
- liquidity stress / disorderly market;
- event-driven uncertainty;
- correlation breakdown or contagion;
- trend exhaustion / reversal risk.

For each material market change, create a scenario card with:
- instrument and time horizon;
- current regime estimate and probability/confidence calibration;
- base, upside, downside and relevant tail scenarios;
- evidence supporting each branch and contrary evidence;
- trigger conditions and invalidation conditions;
- estimated move/risk ranges only where statistically defensible;
- upcoming events, liquidity and execution constraints;
- data freshness, missing fields and uncertainty;
- expiry/reassessment time.

Scenario probabilities are estimates, not facts. If evidence is weak or regimes conflict, the correct output is “unclear / no actionable signal.”

#### D. Signal fusion and alert routing

Signals from different families are combined only after testing dependence and overlap; correlated indicators must not be counted as independent votes. Use a transparent, versioned scoring model with calibrated probabilities and confidence intervals. Compare against simple baselines and evaluate false-positive rates.

Alert levels:
- **Informational:** notable change; no action implied.
- **Watch:** conditions are developing; gather more evidence.
- **Opportunity candidate:** pre-defined conditions are met; prepare a research card.
- **Risk warning:** thesis invalidation, volatility/liquidity deterioration, event risk or exposure concentration requires attention.
- **Data/system warning:** data or service health is compromised; suspend affected recommendations.

Alerts routed to Cosmo include a concise reason, evidence, counter-evidence, confidence, horizon, expected costs/risks, invalidation trigger, data freshness and a link to the full research record. Apply severity thresholds, deduplication, cooldowns and escalation rules to avoid alert floods. Never suppress a critical risk warning merely to reduce notification volume.

#### E. Cosmo decision protocol

When an alert arrives, Cosmo follows a controlled decision tree:
1. Verify feed health, timestamp alignment and instrument identity.
2. Retrieve the relevant scenario, strategy rules, current exposure and market calendar.
3. Check contradictory indicators and independent sources.
4. Estimate net expected value only if the model is validated for that instrument and horizon, including costs and uncertainty.
5. Check position, portfolio, liquidity, drawdown and policy limits.
6. Select one outcome: ignore, monitor, request more research, alert the user, recommend a paper trade, or (only at an authorised future tier) prepare a user-approved order.
7. Record why it acted or abstained and schedule outcome verification.

**No-trade is a valid and often preferred decision.** The indicator engine cannot turn an alert into an investment instruction or live order by itself. It cannot override the risk engine, broker permission, legal restrictions or user approval.

#### F. Validation and acceptance tests

Before any signal is used beyond research:
- Test formulas against hand-calculated fixtures and independent implementations.
- Test missing, delayed, duplicated, reordered and corrupted data.
- Verify no look-ahead, survivorship or timestamp leakage.
- Run chronological out-of-sample and walk-forward tests by instrument and horizon.
- Compare signal quality against naive and no-signal baselines.
- Measure precision/recall where labels are appropriate, false-alert rate, calibration, net-of-cost outcomes, drawdown and stability by regime.
- Test alert deduplication, cooldown, escalation and stale-signal expiry.
- Replay known historical stress periods without changing thresholds after seeing outcomes.
- Require independent review and version-bound approval before promoting a signal model.

The first release is a research dashboard and alert feed operating on historical/replay data, then authorised delayed/live market feeds. Paper-trading integration follows only after the alert quality and data pipeline are verified. Real-money execution remains governed by the authority ladder in section 6.5.


## 6.8 Cosmo Strategy Evolution Engine

**Purpose:** generate, evaluate, adapt and select trading-strategy candidates as market conditions change. It is a research and controlled optimisation system, not an unrestricted self-modifying live trader.

### A. Strategy portfolio, not one universal bot

Maintain a versioned library of strategies with explicit instrument coverage, timeframe, market-regime suitability, entry/exit logic, position sizing, stop/invalidation rules, maximum holding period, liquidity requirements, cost assumptions and known failure modes. Candidate families may include trend-following, mean-reversion, breakout, momentum, volatility-aware, event-aware and defensive/no-trade strategies. A strategy must be allowed to declare itself unsuitable for the current regime.

### B. Strategy fitness and selection scale

For each candidate, calculate a transparent, multi-dimensional score. Do not rank strategies by raw profit or win rate alone. The scorecard includes:
- net returns after realistic fees, spreads, slippage, funding, borrow and currency conversion;
- risk-adjusted return and downside risk;
- maximum drawdown, tail loss and recovery time;
- stability across instruments, time periods and market regimes;
- out-of-sample and walk-forward performance;
- trade count and statistical uncertainty;
- capacity, liquidity and market-impact limits;
- exposure, correlation and portfolio diversification;
- operational reliability and data sensitivity;
- complexity and overfitting penalty.

Use hard eligibility gates before any weighted score. A candidate that breaches a risk limit, lacks sufficient out-of-sample evidence, relies on poor-quality data or fails operational tests is ineligible regardless of its return. Weights and thresholds are versioned, justified and independently reviewed; never quietly tune them to favour a desired result.

### C. Adaptive strategy creation loop

1. Detect a possible market-regime change using the Market Indicator & Scenario Engine.
2. Explain which existing strategy assumptions may no longer fit.
3. Generate one or more candidate strategies or parameter variants from approved templates and a constrained strategy specification.
4. Record the hypothesis, intended regime, expected edge, risks, parameters, code/specification version and parent strategy.
5. Run static checks, unit tests, risk-policy checks and reproducible historical replay.
6. Test chronologically using train, validation and untouched test periods; use walk-forward evaluation and regime-specific holdouts.
7. Include realistic transaction costs, slippage, spreads, partial fills, latency, funding, market impact and data outages.
8. Compare candidates against the current champion, simple baselines and a no-trade/cash baseline.
9. Run paper trading in shadow mode and monitor divergence between simulated and observed execution.
10. Promote only through the release gates below. Otherwise reject, revise or archive the candidate with its failure evidence.

### D. Controlled strategy rewriting

The engine may automatically draft revised strategy logic, parameters and candidate code. It must not directly edit a live production bot's active strategy. Prefer a typed, constrained strategy definition or domain-specific language for orders, conditions and risk rules; generated executable code, if needed, runs in a network-restricted sandbox with no broker credentials, secrets, withdrawal capability or production order route.

Every revision receives a new immutable version ID and records:
- parent version and exact diff;
- hypothesis and reason for change;
- market data snapshot IDs and timestamps;
- model/tool versions and generation parameters;
- test results, rejected cases and unresolved limitations;
- reviewer and approval records;
- promotion, rollback and retirement history.

Never overwrite a strategy version or erase losing experiments. Reproducibility and rollback are mandatory.

### E. Champion–challenger and regime switching

Keep the currently approved strategy as the **champion**. New candidates are **challengers** and first operate in offline replay, then shadow/paper mode. Compare them over predeclared windows and regimes. Switch only if the challenger passes all evidence, risk, operational and approval gates. Use hysteresis, minimum observation periods and cooldowns to prevent rapid switching when indicators fluctuate. If no candidate qualifies, retain the safe fallback or do not trade.

A strategy's suitability score is conditional on instrument, horizon and regime. Do not assume a strategy that performs well on Bitcoin also works on USD/ZAR or equities.

### F. Objective: best risk-adjusted outcome, not maximum possible win

The optimisation objective is to seek robust, net-of-cost, risk-adjusted performance within explicit capital and loss constraints. It is not to maximise a backtest's profit, win rate, trade frequency or leverage. The engine must model downside and tail scenarios, capital preservation, concentration, correlation, liquidity and the possibility of losing money. A no-trade decision can be the highest-quality decision.

No strategy can know the maximum it could have won from a future scenario. Optimisation must avoid hindsight and use only information available at the decision time.

### G. Promotion and authority gates

- **E0 — Draft:** generate a candidate specification; no trading.
- **E1 — Offline tested:** reproducible replay and test suite passed; no live orders.
- **E2 — Shadow:** evaluate live signals without sending orders.
- **E3 — Paper champion:** paper-trade with realistic simulated execution and monitoring.
- **E4 — Human-approved limited pilot:** only after independent review, legal/broker clearance, security review and explicit user approval; strict capital, per-trade, daily-loss, drawdown, exposure and instrument limits.
- **E5 — Bounded automation:** disabled by default; requires separate opt-in and review, broker-side controls, revocable scoped credentials, independent kill switch, outage-safe behaviour, alerts and periodic re-authorisation.

No automatic promotion to E4 or E5. A strategy rewrite cannot grant itself greater authority, increase its own limits, disable safeguards or select a broker. Withdrawals, transfers and changes to beneficiaries remain outside the bot's authority.

### H. Monitoring, degradation and rollback

Monitor live/paper performance against expected distributions, execution quality, slippage, drift, calibration, drawdown, feed health and regime suitability. Automatically pause the affected strategy on stale/corrupt data, unexplained behaviour, breached limits, broker errors or material drift. Roll back to the last approved version or stop trading; never automatically increase risk to recover losses. Record incident evidence and require human review before restart.

### I. Required acceptance tests

Test reproducible builds; deterministic replay; strategy version lineage; parameter-boundary enforcement; no-look-ahead and leakage resistance; realistic fees and fills; adversarial and stress periods; multiple-testing and overfitting controls; champion/challenger switching stability; kill-switch operation; broker outage and duplicate-order handling; permission boundaries; and verified rollback. Independent reviewers must be able to reproduce the result from the recorded data and version identifiers.


## 6.9 Strategy Analysis & Allocation Engine

**Purpose:** independently analyse market conditions, the available strategy library and each strategy's current fitness, then recommend the most suitable eligible strategy (or no strategy) for a particular instrument, timeframe, portfolio and risk mandate.

This is a distinct decision-support layer between the Market Indicator & Scenario Engine, Strategy Evolution Engine and Trading Engine. It does not itself create market facts, bypass risk controls or authorise orders.

### A. Three-sided analysis

The analyzer evaluates three connected evidence sets:

1. **Market suitability:** current regime probabilities, trend, volatility, liquidity, breadth, event calendar, macro/cross-asset context, data quality and scenario triggers/invalidation.
2. **Strategy fitness:** each strategy's declared purpose, instrument/timeframe compatibility, historical and out-of-sample performance, recent paper/live performance, drawdown, tail risk, costs, slippage sensitivity, stability and known failure conditions.
3. **Portfolio and execution suitability:** existing positions, correlated exposure, available capital, concentration, liquidity/capacity, risk budget, trading hours, broker/instrument constraints and operational health.

### B. Strategy compatibility matrix

Maintain a versioned compatibility matrix for each strategy × instrument × timeframe × market regime. Record:
- eligible, conditional or ineligible status;
- evidence period and sample size;
- expected performance range and uncertainty;
- drawdown/tail-risk profile;
- cost and liquidity sensitivity;
- regime transitions in which it tends to fail;
- minimum data and execution requirements;
- last review and expiry/reassessment date.

A strategy that is not validated for a particular instrument or timeframe cannot be assumed suitable merely because it worked elsewhere.

### C. Comparative strategy scorecard

First apply non-negotiable eligibility gates: data quality, legal/instrument availability, tested compatibility, operational status, drawdown and exposure limits, and required approval tier. Only eligible candidates are ranked.

Compare candidates using a transparent scorecard that includes:
- market-regime fit;
- net-of-cost, out-of-sample risk-adjusted performance;
- downside/tail risk and drawdown;
- stability across rolling windows and similar historical regimes;
- execution quality, liquidity and capacity;
- portfolio diversification and incremental risk;
- model uncertainty, sample size and complexity penalty;
- recent degradation and drift.

Display component scores and evidence, not only one opaque overall number. Weights are versioned and cannot be altered by a strategy to improve its own ranking. The analyzer must not optimize solely for maximum projected profit or win rate.

### D. Analyzer outputs

For each instrument and decision horizon, return one of:
- **Preferred candidate:** best eligible fit, with evidence and limitations;
- **Conditional candidate:** potentially suitable if stated conditions are met;
- **Monitor:** regime or evidence is not sufficiently clear;
- **No suitable strategy:** none passes the gates;
- **Pause:** data, execution, risk or operational conditions require suspension.

Each recommendation includes alternatives, reasons for rejection, confidence/calibration, contrary evidence, expected cost assumptions, risk contribution, triggers for reassessment and a validity/expiry time. Explain why the next-best candidate ranked lower.

### E. Continuous re-analysis

Re-evaluate on material market-regime changes, indicator alerts, scheduled review intervals, strategy performance drift, execution-cost changes, portfolio changes, instrument events and data-quality warnings. Use minimum dwell times, hysteresis and switching-cost analysis to avoid unnecessary strategy churn. A strategy switch is not triggered by a single noisy indicator.

Before switching, compare the incumbent and candidate under the same current data, constraints and cost assumptions. If no candidate is clearly eligible, keep the approved incumbent only if its safety conditions still hold; otherwise reduce exposure or stop trading.

### F. Human-readable strategy decision card

Every decision card records:
- instrument, venue, timeframe and timestamp;
- detected market regime and scenario references;
- current strategy and candidate alternatives;
- compatibility and scorecard breakdown;
- evidence window, sample size and test versions;
- portfolio/risk constraints checked;
- recommended action: retain, switch candidate, monitor, pause or no trade;
- exact conditions that would change the recommendation;
- approval tier and who/what authorised any subsequent action.

### G. Learning and feedback

After each review period or completed trade, compare expected conditions and strategy behaviour with observed outcomes. Attribute performance to market regime, signal, sizing, execution, costs and operational factors where possible. Update strategy evidence only through reproducible evaluation; preserve losing periods and rejected candidates. Do not allow a single profitable trade to validate a strategy or a short losing streak alone to invalidate it.

### H. Required tests and boundaries

Test compatibility decisions against historical regime transitions, conflicting indicators, low sample sizes, stale data, correlated strategies, changing spreads, portfolio concentration, sudden volatility, missing broker data and repeated switching. Confirm that hard eligibility gates override rankings and that the analyzer can return no suitable strategy. The analyzer may recommend or request a switch; the execution gateway enforces authority, approvals and risk limits independently.


## 6.10 Cosmo Trading Wallet & Capital Management

**Purpose:** provide a dedicated, auditable view and control layer for capital the user deliberately allocates to trading. The wallet separates trading funds from personal spending, other businesses and project budgets. It is not automatically a bank, payment service, broker, exchange or custodian.

### A. Initial custody model

For the first releases, use a **non-custodial capital ledger and broker-account connection**:
- Actual funds remain in a regulated/appropriately authorised bank, broker or exchange account in the user's name, subject to jurisdiction and instrument.
- Cosmo records the user's declared trading allocation, approved funding events and reconciled broker balances.
- The wallet may display balances and positions through authorised broker integrations, initially read-only.
- Funding or withdrawal transfers are initiated and confirmed by the user through the provider's own secure interface; Cosmo must not collect bank passwords, card details, broker passwords, seed phrases or private keys in chat or ordinary memory.
- Never imply that a displayed ledger balance is independently held cash. Clearly distinguish user-allocated capital, broker cash, reserved margin, open-position exposure, unrealised P&L, realised P&L, fees and unsettled funds.

Do not accept public deposits, pool funds for other people, hold third-party assets, or operate an internal crypto custody/payment rail without specialist legal, regulatory, security and licensing assessment and explicit approval.

### B. Wallet accounts and sub-ledgers

Provide separate, clearly labelled ledgers:
1. **Trading Allocation:** amount the user has designated for trading; not proof of funds held.
2. **Broker Cash:** reconciled available cash at each connected provider, currency by currency.
3. **Reserved / Margin:** funds committed or unavailable for new trades.
4. **Open Exposure:** market value/notional and risk exposure of open positions, without double-counting as cash.
5. **Realised Results:** closed-trade gains/losses after costs.
6. **Unrealised Results:** marked-to-market estimates with price timestamp and source.
7. **Fees & Funding Costs:** commissions, spreads where measurable, financing, borrow, funding and conversion charges.
8. **Tax & Reporting Reserve:** optional user-defined planning reserve, clearly not a tax calculation or payment.
9. **Available Risk Budget:** amount permitted for new risk under user-approved limits, not simply the displayed cash balance.

Every balance is labelled by currency, provider, timestamp, source, reconciliation status and whether it is live, delayed, estimated or manually entered. Support ZAR and other permitted currencies without silently netting unlike currencies.

### C. Funding and transfer workflow

1. User chooses the trading allocation and target provider/account.
2. Cosmo displays provider, account identity (masked), currency, amount, fees if known, expected settlement and any provider restrictions.
3. Cosmo explains that the transfer is into the user's own provider account, not into an unregulated Cosmo-held pool.
4. User completes and authenticates the transfer directly with the provider/bank.
5. Cosmo imports or receives a provider-confirmed transaction record and reconciles it against the ledger.
6. Until confirmed, mark the amount **pending / unverified** and exclude it from available trading capital.
7. Reconcile broker cash, reserved margin, positions, fees and unsettled transactions regularly; surface discrepancies rather than silently adjusting balances.

No transfer is initiated by an indicator, strategy, bot or AI recommendation. Any future payment initiation requires a specifically authorised provider integration, jurisdictional review, explicit transaction confirmation and strong authentication.

### D. Capital allocation and protection

- User sets a total trading-capital ceiling and may allocate sub-budgets by instrument, strategy or risk mandate.
- Maintain a protected reserve that strategies cannot consume.
- Define maximum position size, leverage (default none unless separately approved), per-trade risk, daily/weekly loss, total drawdown, concentration and correlated exposure limits.
- Keep paper-trading balances entirely separate from real funds.
- Strategies cannot move funds between accounts, increase their own budgets, borrow, use margin or leverage, or change loss limits.
- On limit breach, block new risk and alert the user; apply the configured safe position-management policy.
- The wallet cannot be used to fund other Cosmo projects automatically. Any cross-project transfer requires a separate, explicit user-authorised transaction and appropriate accounting.

### E. Withdrawals and access security

- Withdrawal destination changes, external transfers, crypto withdrawals and beneficiary changes always require direct user action and provider authentication.
- No strategy or AI agent has withdrawal permission.
- Use least-privilege broker API scopes; begin read-only, then order permissions only if separately approved. Never request withdrawal scope for trading bots.
- Store integration secrets in a dedicated secrets manager, not in prompts, memory records, source code or logs.
- Support provider disconnection, credential revocation, session expiry, audit trails, alerts for account changes and incident response.
- Apply strong authentication and transaction confirmation to any future permitted funding/payment action.

### F. Wallet dashboard and reconciliation

Show total user-allocated capital, provider cash by currency, reserved funds, open exposure, realised/unrealised results, fees, available risk budget, deposits/withdrawals and reconciliation exceptions. Provide dated statements, transaction references, export and audit history. Avoid presenting estimates as guaranteed liquidation value or spendable cash.

### G. Release stages and gates

- **W0 — Design/demo:** simulated balances only, visibly labelled.
- **W1 — Manual capital ledger:** user records allocations and provider transfers; no live connection or movement.
- **W2 — Read-only broker connection:** balances, orders and positions imported with timestamp and reconciliation.
- **W3 — User-directed provider funding:** only through a supported, legally reviewed provider flow with explicit confirmation; no AI-initiated movement.
- **W4 — Trading integration:** separate approval for narrowly scoped order permissions; no withdrawal rights, with independent risk gateway and kill switch.

Before any live funding or execution, verify provider legitimacy and permissions, jurisdictional availability, account ownership, data/API terms, legal obligations, security and reconciliation behaviour. In South Africa, obtain qualified advice on the applicable financial-services, exchange, payment, crypto-asset and data-protection requirements before offering custody, payment initiation or third-party services.


## 6.11 Trading Intelligence Learning & Confidence Framework

**Purpose:** make historical evidence, scenario replay, calibrated confidence and verified outcomes the foundation of Cosmo's trading intelligence. The system learns from successful, unsuccessful, neutral and missed/no-trade scenarios without treating past results as guarantees of future performance.

### A. Historical Trade & Scenario Knowledge Base

Preserve a queryable, versioned record of:
- completed winning, losing and breakeven trades;
- rejected, cancelled, expired and partially filled orders;
- paper trades and shadow signals, clearly separated from real executions;
- no-trade decisions and missed opportunities, with the information available at the time;
- historical market scenarios and regime transitions;
- strategy versions, parameters, indicator snapshots and decision cards;
- entry/exit rationale, position sizing, risk limits and intended holding period;
- actual fills, timestamps, fees, spreads, slippage, funding/borrow costs and currency conversion;
- maximum favourable/adverse excursion where reliably calculable;
- realised outcome, drawdown contribution and portfolio context;
- expected versus actual behaviour, post-trade review and lessons;
- source provenance, data quality, licence, corrections and immutable version lineage.

A trade record must distinguish decision-time knowledge from later information. Historical records are never rewritten with hindsight. Corrected data creates a linked corrected version and preserves the original.

### B. Scenario Replay & Comparative Learning

For each candidate strategy, replay many historical market situations using only data available at each simulated decision time. Group outcomes by instrument, timeframe, volatility, trend, liquidity, macro/event context and regime transition. Compare:
- what the strategy expected;
- what actually happened;
- how alternative eligible strategies behaved under the same conditions;
- what a simple baseline and no-trade/cash alternative would have done;
- whether losses came from signal quality, sizing, execution, costs, data errors or regime change.

Include difficult, rare and adverse periods, not just favourable examples. Preserve negative results and failed hypotheses as first-class evidence. Prevent look-ahead, survivorship, leakage, duplicate/correlated sample contamination and selection bias. Use chronological train/validation/test partitions and walk-forward evaluation. A large trade count does not remove bias or guarantee statistical power.

### C. Confidence & Forecast Quality Analyzer

Every forecast, scenario and strategy recommendation receives a confidence assessment that is separate from the estimated return.

The analyzer evaluates:
- historical calibration of comparable predictions;
- sample size and statistical uncertainty;
- similarity between the current regime and the evidence set;
- agreement and dependence among independent evidence families;
- contradictory indicators and alternative explanations;
- data freshness, completeness, source reliability and feed health;
- model/strategy drift and recent degradation;
- out-of-sample performance and robustness;
- forecast horizon and instrument-specific limitations.

Display calibrated probability where supported, uncertainty interval, evidence coverage, sample size, calibration history and reasons confidence is reduced. If the evidence does not support a reliable probability, display **insufficient evidence** rather than inventing a percentage. Confidence is not a promise and must never be confused with profit probability or expected return.

### D. Expected Outcome & Risk Analyzer

Before any candidate trade, estimate distributions or ranges rather than one certain result:
- potential gain/loss scenarios and probability estimates where validated;
- expected net outcome after fees, spread, slippage, funding and conversion;
- downside, tail loss, drawdown and adverse excursion;
- stop/invalidation behaviour and gap/market-liquidity risk;
- holding-period and exit uncertainty;
- impact on portfolio concentration, correlation and available risk budget;
- comparison with alternative strategies and no trade.

Report assumptions, source timestamp, confidence and limitations. Do not present a target price or backtest expectation as a guaranteed result. Expected value alone is insufficient if tail risk, uncertainty or capital constraints are unacceptable.

### E. Continuous Training & Model Governance

Maintain a controlled learning cycle:
1. Capture new market, decision, execution and outcome records.
2. Verify and reconcile data; label provenance and quality.
3. Attribute outcomes to the relevant strategy version, market regime, sizing, execution and costs.
4. Identify recurring success patterns, failure patterns, drift and unexplained residuals.
5. Propose new features, strategy parameters or candidate models.
6. Train candidates in isolated, reproducible datasets and environments.
7. Evaluate chronologically out-of-sample, across regimes and adverse scenarios.
8. Compare against current approved champion, baselines and no-trade.
9. Run shadow/paper evaluation and independent review.
10. Promote only through versioned approval gates; monitor, pause and roll back on degradation.

Do not continuously train or mutate a live strategy on each new trade. Use controlled batches, minimum evidence thresholds, drift monitoring, reproducible datasets and approval-bound releases. Preserve datasets, code, model, feature, parameter, policy and evaluation versions.

### F. Intelligence Quality Dashboard

Provide separate measures rather than one misleading "accuracy" number:
- forecast calibration and Brier/log scores where appropriate;
- directional accuracy with class balance and baseline comparison;
- strategy net return and risk-adjusted performance;
- win/loss size distribution and payoff ratio;
- maximum drawdown and tail-risk measures;
- performance by regime, instrument and horizon;
- out-of-sample stability and sample size;
- false alerts, missed events and alert usefulness;
- slippage and execution shortfall;
- drift, data quality and unresolved reconciliation;
- abstention/no-trade rate and whether abstentions avoided risk;
- model and strategy version comparisons.

A high win rate may still lose money if losses are larger than wins. Metrics must be interpreted together and after realistic costs.

### G. Decision-Time Confidence Contract

Every actionable strategy decision must include:
- what Cosmo believes may happen and over what horizon;
- probability/range only where calibrated;
- what evidence supports and contradicts the view;
- how many comparable observations support it;
- expected net outcome and downside range;
- why the selected strategy fits better than alternatives;
- what conditions invalidate the thesis;
- what would cause Cosmo to wait, reduce risk or abstain;
- when the analysis expires and must be refreshed.

No confidence score can override hard risk controls, user authority, legal restrictions or a no-trade condition.
