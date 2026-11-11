# Cosmo AI — SEO and Google indexing checklist

Last reviewed: 2026-11-11

## Canonical public website
- Preferred host: https://cosmo-ai.co.za/
- Homepage canonical: https://cosmo-ai.co.za/
- Language: English (South Africa), en-ZA.
- Keep the public marketing pages indexable. Keep account, sign-in, admin, work portals, API endpoints, internal docs, prototypes and private records out of the public sitemap.

## Public indexable pages
1. https://cosmo-ai.co.za/
2. https://cosmo-ai.co.za/about.html
3. https://cosmo-ai.co.za/cosmo-core.html
4. https://cosmo-ai.co.za/cosmo-work.html
5. https://cosmo-ai.co.za/cosmo-qr-retail.html

Each public page has a unique title, description, canonical URL, social metadata, crawlable text and contextual internal links. Product pages include SoftwareApplication structured data. Homepage includes Organization, WebSite and SoftwareApplication structured data.

## Search themes
Use naturally in headings and useful page copy, not as keyword stuffing:
- Cosmo AI South Africa
- personal AI workspace / AI assistant
- work management and project workflow software
- QR product information pages
- QR shelf labels and retail product information
- QR retail software and stock management tools

Do not claim features are generally available until they have been tested and released. The pages currently distinguish the product purpose from capabilities still in development.

## Crawl controls
- `robots.txt` allows general crawling and points to the root sitemap.
- Sitemap includes only the five public marketing pages.
- Membership page remains `noindex,nofollow`.
- Do not add admin, work, customer, checkout, auth callback or private pages to the sitemap.
- Keep canonical URLs consistent with the preferred HTTPS domain.

## Required owner action — Google Search Console
1. Open https://search.google.com/search-console/
2. Add a **Domain** property for `cosmo-ai.co.za`.
3. Google will provide a DNS TXT verification value. Add that exact TXT record at the domain DNS provider; do not invent or alter the value.
4. After verification, open the property and submit `https://cosmo-ai.co.za/sitemap.xml`.
5. Use URL Inspection to request indexing for the homepage and the four public product/about pages.
6. Check Page indexing and Sitemaps reports for fetch errors, blocked pages, canonical mismatches and indexing status.

Google's sitemap submission is a discovery hint, not a guarantee. Google chooses when to crawl and index pages. An indexed page is eligible to appear; it is not guaranteed a particular ranking or search placement.

## Deployment gate
Before requesting indexing, confirm:
- GitHub Pages workflow has completed successfully.
- Custom domain serves the latest commit over HTTPS.
- `/robots.txt` and `/sitemap.xml` return HTTP 200.
- All five sitemap URLs return HTTP 200 and have the intended canonical tags.
- No accidental `noindex` header or tag is applied to public pages.

## Ongoing SEO work
- Publish genuinely useful, original product guides and use cases.
- Add screenshots and a suitable social preview image when final product UI is ready.
- Add customer case studies only with permission and verifiable results.
- Monitor Search Console queries, impressions, clicks and page indexing.
- Keep page copy aligned with the real release status.
