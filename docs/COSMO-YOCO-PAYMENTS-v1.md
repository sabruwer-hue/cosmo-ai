# Cosmo Yoco Checkout Integration

Last reviewed: 2026-11-11

## Payment direction
Cosmo now uses Yoco Checkout API for once-off package and tool purchases. PayFast is not the active checkout path.

Yoco Checkout is server-side. The browser never receives the Yoco secret key. A checkout is created by the `cosmo-yoco-checkout` Edge Function, the customer is redirected to Yoco's hosted checkout, and paid access is granted only after a signed webhook is verified.

## Important Yoco limitation
Yoco's current Checkout Gateway does not support automatic recurring billing. Therefore:
- Lifetime package licences can be sold as once-off payments through Yoco.
- A once-off lifetime tool unlock can also be sold through Yoco.
- Automatic monthly/annual memberships for ongoing hosted services must not be represented as Yoco recurring subscriptions. Use a separate manual renewal/invoice flow or a provider that explicitly supports recurring billing.
- Cloud hosting, model inference, storage and third-party service costs remain separate from the lifetime software licence.

## Edge Functions
- Authenticated checkout: `cosmo-yoco-checkout`
- Public signed webhook: `cosmo-yoco-webhook`
- Package access gate: `cosmo-access-gate` (v3; recognises lifetime package entitlements)

Webhook URL to register in Yoco:
`https://yevkzktlzxjrlvsxtnez.supabase.co/functions/v1/cosmo-yoco-webhook`

## Supabase Edge Function secrets
Set these in Supabase Dashboard → Edge Function secrets:
- `COSMO_YOCO_SECRET_KEY` — server-side Yoco API key. Use `sk_test_...` for sandbox testing, then `sk_live_...` only after successful testing and Yoco domain approval.
- `COSMO_YOCO_WEBHOOK_SECRET` — signing secret returned when registering the webhook. It is provided only once; copy and store it securely.

Never place either secret in HTML, JavaScript, GitHub, or ChatGPT messages.

## Yoco account setup
1. Complete the Yoco merchant profile and verification.
2. In the Yoco App, open Sales → e-Commerce integrations → Checkout API.
3. Add and verify `cosmo-ai.co.za` under Verified domains.
4. Copy test API keys and configure `COSMO_YOCO_SECRET_KEY`.
5. Register the webhook URL above and store the returned `whsec_...` as `COSMO_YOCO_WEBHOOK_SECRET`.
6. Test checkout and signed webhook delivery in sandbox.
7. Confirm paid invoice, package entitlement and optional tool entitlements are created exactly once.
8. Only after test success and domain approval, switch to the live key and complete a small live test payment.

## Lifetime pricing gate
The database now has:
- `cosmo_subscription_products.lifetime_price_cents`
- `cosmo_subscription_products.lifetime_pricing_approved`
- `cosmo_subscription_tools.lifetime_price_cents`
- `cosmo_subscription_tools.lifetime_pricing_approved`

These fields intentionally remain unapproved until the owner confirms the final price list. The Yoco checkout function refuses to charge a package or tool unless its lifetime price has been approved. No placeholder monthly price is silently converted into a lifetime price.

## Entitlement persistence
- `cosmo_package_entitlements` is the account-level lifetime licence ledger.
- `cosmo_tool_entitlements` records separately purchased tool unlocks.
- `cosmo_yoco_checkouts` links a Yoco checkout to its customer, invoice, package and selected tools.
- `cosmo_payment_events` retains provider event provenance and idempotency.

Uninstalling a package does not delete the entitlement. Reinstall/restore uses the signed-in account's entitlement. A refund or approved revocation must be explicitly reflected in the entitlement status.

## Webhook security
The webhook validates:
- Yoco `webhook-id`, `webhook-timestamp` and `webhook-signature` headers.
- HMAC-SHA256 over the exact raw request body and header values.
- A short timestamp window to reduce replay risk.
- Event type `payment.succeeded`.
- Checkout ID, amount and ZAR currency against the server-side checkout record.
- Unique provider event IDs to prevent duplicate grants.

The success redirect is never treated as proof of payment.

## Current readiness
- Database ledger and checkout mapping deployed.
- Checkout and webhook Edge Functions deployed.
- Access gate updated to recognise lifetime licences.
- Public membership page now references Yoco and does not call PayFast.
- Final prices are not approved.
- Yoco API and webhook secrets have not been configured in this workspace.
- Domain verification and sandbox/live test transactions still require the merchant's Yoco account.
