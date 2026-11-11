# Cosmo Android packages

The web application is being prepared as three separately installable Android Trusted Web Activity (TWA) packages. The web pages remain the shared product surfaces; each APK has its own Android application identity and launch route.

## Package map

| App | Web manifest | Start URL | Android application ID |
|---|---|---|---|
| Cosmo AI | `/manifest.webmanifest` | `/` | `za.co.cosmoai.app` |
| Cosmo Work | `/work.webmanifest` | `/work.html` | `za.co.cosmoai.work` |
| Cosmo Admin Portal | `/admin.webmanifest` | `/admin.html` | `za.co.cosmoai.admin` |

## What must happen before APK builds

1. Enable GitHub Pages and verify the live HTTPS site.
2. Attach `cosmo-ai.co.za` to the Pages site and wait for HTTPS certificate provisioning.
3. Confirm that all three manifests and launch URLs load from the final HTTPS origin.
4. Prepare 512×512 PNG launcher icons from the source SVG artwork in `assets/`.
5. Install a supported JDK, Android SDK / Android Studio, Node.js and Bubblewrap CLI on the build machine.
6. Generate and safely back up the Android signing key material. Never commit keystores, passwords or signing credentials to this repository.
7. Generate one TWA wrapper per manifest with its application ID from the table above.
8. Build, install and test each APK on a physical Android device.
9. Publish the Digital Asset Links file at `https://cosmo-ai.co.za/.well-known/assetlinks.json` with each package ID and the SHA-256 fingerprint of its actual signing certificate.
10. Verify each installed TWA opens in verified full-screen mode. A missing or incorrect Digital Asset Links association can cause browser fallback.
11. Publish the APK artifacts to a release host and register each HTTPS artifact URL plus SHA-256 checksum in Cosmo Work → Package Registry → Package release & APK register.

## Build approach

Use Bubblewrap to initialise each Android wrapper from the corresponding live manifest after the domain is online. Run the initialisation separately for each manifest and set the matching application ID. Build and test each package independently.

Do not generate final APKs against a temporary GitHub Pages URL and then assume they are production-ready. The final verified HTTPS origin, signing certificate fingerprint and Digital Asset Links association are part of the TWA trust chain.

## Distribution and updates

- Keep APK binaries out of Git source history.
- Publish versioned APK files through a release host with HTTPS.
- Record package, version, build number, channel, publication status, artifact URL and SHA-256 in the Cosmo package release registry.
- Never mark a release as published until the APK link and checksum have been verified.
- Future updates for a given Android application ID must use the matching signing identity.

## Current status

The three web manifests, SVG app icons, service-worker shell and separate app pages are committed. **No APK has been generated or signed yet.** Domain setup, HTTPS verification, PNG launcher assets, Android build environment and owner-controlled signing remain outstanding.
