# Exio Sample Seller Report

Single-page landing site. Shows a full composite sample of an Exio research report and asks the reader to send one acquisition target.

Used as the link in step 2 of the buyer email sequence.

---

## Deploy to Railway

**1. Push to GitHub**

```bash
git init
git add .
git commit -m "Exio sample report landing page"
git branch -M main
git remote add origin https://github.com/YOUR-ORG/exio-report-sample.git
git push -u origin main
```

**2. Create the Railway service**

- New Project, then Deploy from GitHub repo
- Pick this repo. No environment variables needed.
- Nixpacks detects Node from `package.json` and runs `npm start`.

**3. Generate a domain**

Settings, then Networking, then Generate Domain. Railway sets `PORT` automatically and `server.js` reads it.

**4. Replace the placeholder URL**

Four spots in `public/index.html` contain `REPLACE-ME.up.railway.app`. Swap them for the real domain and push again.

```bash
sed -i '' 's|REPLACE-ME.up.railway.app|your-real-domain.com|g' public/index.html
```

Those four are the canonical tag and the link preview image. Get them wrong and the card breaks when someone pastes the link into Slack or forwards the email.

**5. Paste the live URL into the sequence**

Email 2 of `exio_buyer_sequence.md` has a `[SAMPLE_PAGE_URL]` placeholder.

---

## What is in here

```
public/
  index.html      the page, self-contained, logo embedded as base64
  og.png          1200x630 link preview card
  favicon.png     180x180
  favicon-32.png  32x32
server.js         zero-dependency static server
package.json      start script and Node engine
railway.json      builder, start command, health check at /healthz
```

No build step and no npm dependencies. `npm start` is the whole thing.

---

## Editing after launch

**The CTA button** is a `mailto:` near the bottom of `index.html`. It opens a prefilled email to `tera.michaelson@goexio.com` with the seven intake fields. Both the recipient and the field list live inside that one `href`, URL-encoded. Decode it before editing or the body will break.

**The monthly cap** reads "We take 25 requests a month across all clients." Search for `cta-foot`.

**Brand tokens** are the canonical Exio set in the `:root` block. Do not introduce `#12233B`, `#1B3A5C`, `#2E86C1`, `#E8A33D` or the other superseded values.

**The logo baseline** uses `align-items: last baseline` with two deliberate offsets: `translateY(4.76px)` on the logo and `translateY(7.5px)` on the divider. Both were set from rendered pixels, not arithmetic. Leave them alone unless the logo height changes.

---

## Before it goes live

- [ ] Replace the four `REPLACE-ME` placeholders
- [ ] Confirm the mailto opens correctly on iOS Mail, Gmail web, and Outlook
- [ ] Check the link preview with Slack and LinkedIn's post inspector
- [ ] Confirm the composite disclaimer is visible without scrolling on mobile

## Notes

The sample company is a composite. It is not a real business and the disclaimer says so twice, at the top of the page and in the report footer. Do not swap in a real target without removing those notices and getting sign-off, since the page is public.

The page is currently indexable. Add `<meta name="robots" content="noindex">` if you would rather it only be reachable from the email.
