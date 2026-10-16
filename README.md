# Markham Web Studio

Responsive, dependency-free HTML/CSS/JavaScript website for a web design business in Markham, Ontario.

## Local development

From the repository root, run `python3 -m http.server 8000`. Open the local server in a browser. There is no build step or package installation.

## Content and publication checklist

- Pricing is CA$299 / CA$599 / CA$999. Confirm the published package scopes and pricing notes match the business's intended offer.
- Homedeer and THE CUT STUDIO are explicitly labelled independent demo projects, never paying clients. Set their verified HTTPS URLs in `SITE_CONFIG.portfolio` in `script.js`. Until supplied, portfolio links open honest project-detail dialogs rather than invented destinations.
- The contact form is **not connected**. Create a Formspree form, verify its destination inbox, and set `SITE_CONFIG.formspreeEndpoint` in `script.js` to its public `https://formspree.io/f/FORM_ID` endpoint. No secret key belongs in frontend code. Submit a real enquiry and confirm delivery in the inbox before describing the form as functional. Test errors as well as success. Mocked responses do not establish real delivery.
- No customer reviews, client claims, business address, email address, or credentials have been invented.
- Page title, description, semantic sections, language, and social metadata target Markham, Ontario. Once the public domain is confirmed, add its canonical URL and a domain-specific sitemap. Search ranking is not guaranteed.
- The hero and portfolio artwork are original CSS illustrations, not screenshots of verified live projects. No external fonts, stock images, or tracking are loaded.

## GitHub Pages

The workflow `.github/workflows/pages.yml` deploys only the public site files on pushes to `main`, or manually from Actions. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**. If Pages is not enabled, the workflow may fail at Configure Pages until this setting is saved. Run **Deploy static site to GitHub Pages** after enabling it and verify the resulting HTTPS site on desktop and mobile. No custom domain is assumed.

Publication is separate from a successful Git push. Review the outstanding contact and portfolio configuration before public launch. After publication, check anchors, project URLs, assets, and a real Formspree delivery at the final Pages URL.

## Browser validation

With the local server running on port 8000, run `node tests/browser.cjs` in an environment with Playwright available and Chromium at `/usr/bin/chromium` (or set `CHROMIUM_PATH`). To keep test dependencies outside the site repository, install them with `npm install --prefix /tmp/markham-browser-check playwright` and run `NODE_PATH=/tmp/markham-browser-check/node_modules node tests/browser.cjs`.

The checks cover 1440px, 768px, 390px, and 320px viewports; horizontal overflow; anchor targets; mobile navigation; package preselection; both portfolio dialogs; disabled submission before configuration; asset responses; JavaScript errors; and configured form success/error handling with intercepted responses. Real Formspree delivery and the published GitHub Pages deployment still require separate verification.
