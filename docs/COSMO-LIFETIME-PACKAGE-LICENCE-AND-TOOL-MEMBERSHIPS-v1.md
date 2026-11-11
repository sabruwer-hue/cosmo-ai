# Cosmo Lifetime Package Licence & Optional Tool Membership Model v1.0

**Document ID:** COSMO-BILLING-LICENCE-001  
**Status:** Commercial model proposal; amounts below are examples, not approved final prices.  
**Market baseline:** South Africa; ZAR.

## 1. Core commercial decision

Cosmo separates a customer's **lifetime package entitlement** from the **installed package instance** and from optional recurring services.

A customer pays a once-off package licence/activation fee. The licence is attached to the customer's Cosmo account and remains in their owned package library for the lifetime of the account entitlement, subject to the published licence terms. Removing, uninstalling, hiding, archiving or deleting a local package installation must not erase the paid entitlement. The customer can reinstall or re-upload a compatible package later without paying the package licence again.

This is not a monthly rental of the package. The customer is purchasing a persistent entitlement.

## 2. Three separate billing layers

### A. Package licence — once-off

- Each package has a transparent once-off acquisition/activation price.
- Illustrative entry point: **R50 once-off** for a simple package. This is a pricing hypothesis, not a confirmed price.
- The customer owns a licence entitlement, not a perpetual guarantee that every future third-party service will be free.
- The package remains in the customer's Purchased Packages library after uninstall/deactivation.
- Reinstalling, re-uploading or restoring a package checks the existing entitlement and does not charge again.
- The entitlement ledger is separate from package deployment records, uploaded files, versions and installations.
- A package may be hidden, uninstalled, deactivated or archived without deleting its entitlement or purchase history.
- Refund, fraud, chargeback, legal suspension or account closure rules must be explicit, logged and appealable where appropriate.

### B. Tool entitlements — choose the right billing type per tool

Each tool must be classified by its actual cost and service obligations. Do not force every tool into the same subscription model.

| Tool billing class | Customer payment | Appropriate for |
|---|---|---|
| Lifetime tool unlock | Once-off | Stable software features with low ongoing marginal cost |
| Tool membership | Optional monthly or annual payment | Hosted AI, live synchronisation, ongoing cloud processing, live data, team collaboration or maintained external integrations |
| Usage-based | Pay for measured use | High-variance AI inference, media generation, SMS/WhatsApp, API calls or other metered provider costs |
| Included allowance | Included up to a disclosed limit | Starter usage that is economically safe inside a package |
| Hybrid | Lifetime unlock plus optional service membership/usage | A customer owns the interface/tool but pays only when using costly hosted services |

The customer must see the tool's billing class, price, limits, renewal date if recurring, usage balance and cancellation method before activation.

### C. Optional service upgrades

Optional upgrades may add capacity or service levels, for example:
- More AI usage or higher model capability.
- Additional storage and file processing.
- More team seats and shared workspaces.
- Higher workflow/task limits.
- Priority processing/support where actually staffed.
- Advanced analytics, integrations or automation quotas.

Upgrades must be optional, clearly priced and easy to downgrade. They must not silently convert a lifetime licence into a compulsory subscription.

## 3. Illustrative affordable structure

These are modelling examples only and must pass provider-cost, payment-fee, support-cost, tax and gross-margin analysis before publication.

| Item | Illustrative charge | Billing |
|---|---:|---|
| Simple package licence | R50 | Once-off, lifetime entitlement |
| Simple lifetime tool unlock | R20–R50 | Once-off |
| Hosted AI tool membership | From R29–R50 | Monthly, optional |
| Small extra usage pack | Usage-priced | Once-off / metered |
| Higher-capacity upgrade | From R49 | Monthly, optional |

A possible customer basket might be a R50 lifetime package licence plus two R30 lifetime tool unlocks: R110 once-off. If that customer later activates a hosted AI membership at R39/month, only that hosted service recurs. The example is illustrative, not an approved tariff.

Do not promise unlimited AI use at a low fixed lifetime price. Provider model costs, cloud storage, bandwidth, media generation, messaging and external APIs can continue for years.

## 4. Entitlement and package lifecycle

Recommended records:

- `billing_customers`: link the Cosmo identity to a payment-provider customer reference.
- `product_catalogue`: product/package/tool identity, version policy, public status and billing classification.
- `package_licence_offers`: once-off price, currency, tax treatment, licence terms/version and effective dates.
- `package_entitlements`: customer, package, entitlement code, purchase reference, grant date, status and licence terms version.
- `tool_catalogue`: tool identity, package compatibility, cost class, dependencies and billing class.
- `tool_entitlements`: lifetime unlock or recurring service entitlement, source purchase/subscription, status and scope.
- `subscriptions`: provider subscription ID, status, billing period, renewal/cancel dates and plan.
- `usage_ledger`: append-only usage events, quantity, unit, provider cost, customer charge and idempotency key.
- `payment_events`: verified provider webhook events and reconciliation state.
- `package_installations`: installation/deployment ID, package version, device/workspace, state and timestamps.
- `entitlement_events`: append-only purchase, restore, uninstall, reinstall, suspend, refund and revocation history.

A package installation is not the licence. Deleting an installation must never cascade-delete the entitlement.

## 5. Payment and webhook safety

- Use a South African payment provider selected after fees, recurring-payment support, settlement, refunds, chargebacks, webhook reliability and developer API review.
- Candidate providers for evaluation include PayFast, Yoco and Ozow; do not claim integration until implemented and verified.
- Never trust a browser success redirect as proof of payment.
- Verify signed webhooks server-side, enforce idempotency, reconcile provider transaction references and record immutable payment events.
- Grant paid entitlements only after a verified successful payment event.
- Handle pending, failed, reversed, refunded, disputed and chargeback states explicitly.
- Keep provider secrets server-side only.
- Display ZAR pricing and any applicable taxes/fees transparently.

## 6. Free access and trials

Recommended acquisition path:
- Permanent free Cosmo account with a genuinely useful but bounded core experience.
- Optional 14-day trial of selected paid tool memberships or upgrades, not an automatic free lifetime licence for every package.
- Trial limits and end date shown before activation.
- Explicit consent before any paid recurring conversion; no hidden automatic charge.
- If payment details are not collected, the trial ends into the free tier rather than creating debt.
- Prevent trial abuse through proportionate account controls without invasive fingerprinting.

## 7. Customer experience

The account should contain:
1. Purchased Packages — lifetime licences.
2. Installed Packages — currently active installations.
3. Available to Restore — owned packages not currently installed.
4. My Tools — lifetime unlocks and recurring tool memberships.
5. Subscriptions — renewal, cancellation, invoices and status.
6. Usage & Credits — consumption, allowances and estimated cost.
7. Purchase History — receipts, refunds and entitlement events.

For every package, show: once-off licence price, what is included, required paid tools, optional tools, recurring charges (if any), usage limits, compatibility and support terms.

## 8. Acceptance criteria

- Paying once grants exactly one persistent lifetime entitlement for the purchased package.
- Uninstalling/deleting the package installation does not remove the entitlement.
- Re-uploading/restoring a previously purchased package does not charge again.
- A second package purchase is charged separately.
- Duplicate webhook delivery cannot create duplicate charges or duplicate entitlements.
- Failed/pending payments cannot grant paid access.
- Refund/reversal/chargeback changes entitlement state through a traceable policy.
- Lifetime tool unlocks do not silently become recurring.
- Hosted service memberships can be cancelled without removing separately owned package licences.
- Usage-based services stop or warn at configured limits; no unbounded surprise bills.
- Customer can export receipts and view a clear entitlement/subscription history.

## 9. Decisions still required before public pricing

- Final package names, contents and one-off price points.
- Whether each tool is lifetime, recurring, metered or hybrid.
- Exact free-tier limits and 14-day trial eligibility.
- Which South African payment provider is selected.
- Tax, invoicing, refund, consumer-law and privacy review.
- Provider-level cost ceilings and gross-margin floors.
- Whether package updates are included for life, limited to a major version, or governed by a separate maintenance policy. The licence must say so plainly.

**Do not publish illustrative prices as final prices until the commercial and technical gates pass.**
