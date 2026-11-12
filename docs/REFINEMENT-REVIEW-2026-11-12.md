# Refinement Review — 12 November 2026

## Scope

This change set is deliberately limited to source-controlled safeguards. It does not deploy functions, change Supabase configuration, apply migrations, merge branches, or touch production records.

## Confirmed defect addressed in source

The Yoco checkout creator persists the internal invoice ID in checkout metadata (`metadata.invoiceId`) and only receives Yoco's checkout ID after the create-checkout request returns. The webhook handler previously required `payload.metadata.checkoutId` to find the local checkout. The application does not send that key when creating the checkout, so the handler could reject a valid payment event as missing payment details.

The webhook now:
1. Accepts a provider checkout ID when one is present.
2. Otherwise resolves the pending local checkout using the persisted `invoiceId` metadata.
3. Verifies the echoed owner and invoice metadata against the stored checkout before continuing.
4. Keeps the existing signature, timestamp, amount, currency, status and idempotency checks.

Yoco's Checkout API flow requires server-side checkout creation and webhook confirmation; the customer redirect is not sufficient evidence of payment. See [Yoco Checkout API setup](https://support.yoco.help/en/articles/739322-yoco-checkout-api) and the [Yoco webhook handling implementation notes](https://github.com/sonnenglas/yoco-php-sdk/blob/master/docs/guides/webhook-handling.md).

## CI transparency improvement

The chat and Yoco checkout type-checks were previously allowed to fail silently via `continue-on-error`. They remain non-blocking to avoid falsely converting known legacy diagnostics into a broken pipeline without first fixing them, but the workflow now names them as non-blocking diagnostics and writes explicit warnings to the GitHub Actions run summary. They remain release blockers until passing.

## Regression guards

The application validation script now checks that:
- The checkout function persists `invoiceId` in provider metadata.
- The webhook has a fallback lookup by the persisted invoice ID.
- The webhook validates the owner and invoice metadata against the stored checkout.

## Still requires separate work / explicit setup

- Run the branch CI and resolve any Deno/type errors it exposes.
- Execute Yoco sandbox success, failure, duplicate-delivery, stale-timestamp, wrong-amount, wrong-currency and metadata-mismatch tests.
- Confirm the live webhook event shape against a real Yoco sandbox delivery before deployment.
- Verify that each local invoice maps to at most one intended checkout, and add a database uniqueness constraint only after confirming the existing data model and pending-checkout retry behaviour.
- Verify the GitHub Pages publishing source in repository settings; workflow code cannot enable that repository setting by itself.
- Test owner sign-in, Academy authorization, learner progress and chat/model inference in a real browser.

## Safety boundary

No secrets or private user data are included. No production database or Edge Function was modified. This branch must be reviewed and tested before any merge or deployment.
