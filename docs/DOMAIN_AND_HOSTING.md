# Cosmo AI — Domain and Hosting

## Intended public address
- Apex domain: `cosmo-ai.co.za`
- Optional www address: `www.cosmo-ai.co.za`
- Registrar/DNS manager: GoDaddy
- Initial static hosting target: GitHub Pages from this public repository

GoDaddy can remain the domain registrar and DNS manager. The website files are hosted by GitHub Pages; GoDaddy DNS simply points the domain to that host. The domain does not need to be transferred.

## Deployment setup in GitHub
1. Open this repository: https://github.com/sabruwer-hue/cosmo-ai
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Confirm the workflow named **Deploy Cosmo AI to GitHub Pages** completes successfully.
5. Under **Custom domain**, enter `cosmo-ai.co.za` and save. If GitHub reports a conflict, stop and resolve it before changing DNS.
6. Enable **Enforce HTTPS** once GitHub makes it available.

This repository includes a root `CNAME` file for the intended domain. With a custom GitHub Actions workflow, GitHub's Pages configuration is still managed in Settings → Pages.

## GoDaddy DNS records
In GoDaddy, open **Domain Portfolio → cosmo-ai.co.za → DNS → Add New Record**.

For the root/apex domain, add these four A records. If there are existing conflicting A records for `@`, review them before replacing anything. Do not delete unrelated MX, TXT, email, or verification records.

| Type | Name | Value | TTL |
|---|---|---|---|
| A | @ | 185.199.108.153 | 1 hour |
| A | @ | 185.199.109.153 | 1 hour |
| A | @ | 185.199.110.153 | 1 hour |
| A | @ | 185.199.111.153 | 1 hour |
| CNAME | www | sabruwer-hue.github.io | 1 hour |

If an existing `www` CNAME points somewhere else, edit that record rather than creating a duplicate. Do not change nameservers. Do not remove email-related records.

DNS propagation can take up to 24 hours. GitHub recommends adding the custom domain in Pages settings before configuring DNS, to reduce the risk of domain takeover. HTTPS may take additional time after DNS is correct.

## Current limitations
- This deploys the **static front-end prototype only**.
- A real AI backend, accounts, server-side memory, secure file storage, and database are not yet connected.
- Never put model-provider API keys, database passwords, private records, or access tokens in HTML, CSS, browser JavaScript, or this public repository.
- The front-end must call a secured server-side API when a backend is commissioned.

## Rollback
If the new site is not ready, remove the custom domain from GitHub Pages settings and restore the previous GoDaddy DNS records from a screenshot/export taken before making changes. Do not delete the existing GoDaddy website or hosting plan until the new deployment has been tested.
