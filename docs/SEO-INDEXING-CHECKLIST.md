# Cosmo SEO and Google indexing checklist

## Public crawlable page
- The root `index.html` is the public marketing page and is intended to be indexed.
- It includes a canonical URL, title, description, Open Graph metadata, Twitter metadata, Organization JSON-LD and SoftwareApplication JSON-LD.
- `sitemap.xml` lists the canonical homepage.
- `robots.txt` permits the public page and excludes source/configuration directories.

## Private app routes
The following pages carry `noindex,nofollow` and are not included in the sitemap:
- `app.html`
- `work.html`
- `admin.html`
- `retail.html`
- `product.html`

Do not put authenticated customer dashboards, private workspaces or product-management pages into the public sitemap.

## Google Search Console owner steps
1. Open Google Search Console and add `cosmo-ai.co.za` as a **Domain property**.
2. Google will provide a DNS TXT verification value. Add that exact TXT record at the DNS provider; do not guess or replace other TXT records.
3. Wait for verification, then use URL Inspection on `https://cosmo-ai.co.za/`.
4. Request indexing for the homepage after it returns HTTP 200 over HTTPS.
5. Submit `https://cosmo-ai.co.za/sitemap.xml`.
6. Check Page indexing, HTTPS, Core Web Vitals and Mobile Usability reports over time.

## Important limits
- DNS domain verification is not the same as a successful website deployment.
- A sitemap encourages discovery; it does not guarantee indexing or ranking.
- Google Search Console verification and submission require the domain owner's Google account and the exact DNS TXT token. Those steps cannot be completed by repository code alone.
- Re-check canonical URLs and redirects after the final domain is connected and HTTPS is enforced.
- Keep the private app routes noindex even if Google can crawl them to observe the directive.
