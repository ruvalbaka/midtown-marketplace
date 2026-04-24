# Midtown Marketplace

Static landing page for Midtown Marketplace — a 24,000 sq ft indoor flea market in Hot Springs, AR.

**Live site:** _(deploy URL goes here once Vercel is connected)_

## Project structure

```
midtown/
├── site/                      # Deployable static site (this is what Vercel serves)
│   ├── index.html
│   ├── css/styles.css
│   ├── js/main.js
│   ├── images/                # Web-ready photos
│   ├── schema/                # Standalone JSON-LD (also embedded in index.html)
│   ├── robots.txt
│   ├── llms.txt
│   └── sitemap.xml
├── assets/
│   ├── photos/                # Original HEIC/JPG from owner (not deployed)
│   └── photos-web/            # Converted JPGs (not deployed)
├── research/                  # Competitor analysis, build brief
└── README.md
```

## Tech

- Vanilla HTML / CSS / JS — no build step
- GSAP + ScrollTrigger via CDN for scroll animations
- Google Fonts: Instrument Serif, Allura, Inter
- LocalBusiness JSON-LD schema embedded in `<head>`
- `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot for AI search visibility
- `llms.txt` provides a structured site summary for AI crawlers

## Local preview

No build step. Just serve the `site/` folder:

```bash
cd site
python -m http.server 8000
# Visit http://localhost:8000
```

Or open `site/index.html` directly in a browser (some features may be limited).

## Deploy to Vercel

1. **Create a GitHub repo** and push this directory.
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
3. Import the GitHub repo.
4. **Framework Preset:** Other.
5. **Root Directory:** `site` _(important — only deploy the `site/` subfolder)_
6. **Build Command:** _(leave blank)_
7. **Output Directory:** _(leave blank — Vercel will serve `site/` directly)_
8. Click **Deploy**.

That's it. Subsequent pushes to `main` auto-deploy.

### Custom domain

When you have a domain, add it in **Vercel → Project Settings → Domains**. Update the canonical URL in:
- `site/index.html` (canonical link, OG URL, schema `url` field)
- `site/sitemap.xml` (the `<loc>` tag)
- `site/robots.txt` (sitemap line)
- `site/llms.txt` (no URLs to update there directly, but add a header line if desired)

## Editing content

### Update hours

Hours appear in **3 places**:
1. `site/index.html` — `<table class="hours-table">` rows
2. `site/index.html` — JSON-LD schema `openingHoursSpecification`
3. `site/js/main.js` — the `HOURS` array (used for the "Today" badge logic)
4. `site/llms.txt`

All four must match.

### Add new photos

1. Drop the JPG into `site/images/`.
2. Reference it in `site/index.html` (gallery section).
3. Replace placeholder tiles by removing the `gal-item--placeholder` class and adding an `<img>`.

### Replace category placeholders with photos

In `site/index.html`, find the `<li class="cat-tile cat-tile--placeholder ...">` items and convert them to photo tiles:
```html
<li class="cat-tile cat-tile--photo" style="--bg: url('images/your-photo.jpg')">
  <span class="cat-tile__num">04</span>
  <h3 class="cat-tile__name">Mid-Century</h3>
  <p class="cat-tile__hint">...</p>
</li>
```

## Schema validation

After deployment, validate the LocalBusiness schema:
- https://search.google.com/test/rich-results — paste live URL
- https://validator.schema.org — paste live URL

This is what links the site to Google Business Profile and helps it surface in local AI search ("flea markets in Hot Springs, AR").

## Outstanding

- [ ] Replace placeholder favicon with real logo when received from owner
- [ ] Add new interior photos when owner provides fresh batch (see `research/competitor-brief.md` for the shot list)
- [ ] Pick and connect a custom domain
- [ ] Submit sitemap.xml to Google Search Console + Bing Webmaster Tools
- [ ] (Optional) Join AntiqueTrail.com directory for a free niche backlink
