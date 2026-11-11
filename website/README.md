# www.mortezashafiei.com

Personal academic website of Morteza Shafiei, Ph.D. candidate in geotechnical engineering at UMass Amherst.
It is a plain static site: HTML, one stylesheet, one small script. There is no build step and no framework.

## What's in this folder

| Path | Purpose |
| --- | --- |
| `index.html` | Home page: research, highlight figures, publications, teaching, education, expertise, contact |
| `cv.html` | Online CV (served at `/cv`), print-ready |
| `404.html` | "Page not found" page |
| `assets/css/site.css` | All styling (light + dark mode, print) |
| `assets/js/site.js` | Small enhancements: mobile menu, email links, copy-BibTeX, figure animations |
| `assets/img/` | Portrait (WebP + JPEG, metadata stripped), social preview image, icons, contour background |
| `assets/fonts/` | Self-hosted fonts (Inter, Source Serif 4, JetBrains Mono; SIL Open Font License) |
| `assets/docs/Morteza-Shafiei-CV.pdf` | Downloadable CV (generated from `cv.html`) |
| `vercel.json` | Hosting config: security headers, clean URLs, redirects, caching |
| `robots.txt`, `sitemap.xml` | Search-engine files |
| `.well-known/security.txt` | Standard security-contact file (RFC 9116) |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `site.webmanifest` | Browser and phone icons |

## Editing content

- Edit the text directly in `index.html` / `cv.html`. Publications, education and skills are ordinary HTML lists.
- **Do not add `style="..."` attributes, `<style>` blocks, `onclick=` handlers or new inline `<script>` code.**
  The security policy blocks them on purpose. Put styles in `assets/css/site.css` and scripts in `assets/js/site.js`.
- The single inline script in each page's `<head>` (`document.documentElement.classList.add('js')`) is allowed by
  its SHA-256 hash in `vercel.json`. If you ever change that line, update the hash in the `Content-Security-Policy` header.
- Email addresses are written as `data-u` / `data-d` attributes and assembled by `site.js`, so simple spam bots
  cannot harvest them from the page source.
- When you change the CV, regenerate the PDF: open `/cv` in Chrome → Print → Save as PDF (Letter, default margins),
  and replace `assets/docs/Morteza-Shafiei-CV.pdf`.
- To change the photo, export a 4:5 crop as `portrait-480.(webp|jpg)` and `portrait-320.(webp|jpg)` and strip metadata.

## Content sources (keep figures and numbers verifiable)

Every figure and number on the site comes from one of these documents. Check the source before changing a figure.

| Site content | Source |
| --- | --- |
| Figure 1 (stress zones → 1D compression / ball milling / dispersion cup), Geo-Congress summary, "62–72 Ma", "50 MPa" | Shafiei, Jaffé, Westgate & DeGroot, *Effect of particle degradation mechanisms on glauconite sand behavior*, submitted to ASCE Geo-Congress 2027 (Fig. 1 and text) |
| Figure 2 (CPTu configurations and outcomes), CGJ 2026 summary | Westgate, Senanayake, Shafiei & DeGroot (2026), *Can. Geotech. J.* 63: 1–8, doi:10.1139/cgj-2026-0117 (published abstract) |
| Figure 3 (chamber Ø400 × 1000 mm, 560/300 mm, SG/PTS at 150 mm, 43.2 kPa), CGJ 2023 summary, "1 h–90 d" | Fakharian, Shafiei & Hafezan (2023), *Can. Geotech. J.* 60(4): 488–503, doi:10.1139/cgj-2021-0686 (abstract and Fig. 1) |
| Particle-shape card, "3,000+ particles", Granular Matter summary | Kaviani-Hamedani et al. (2024), *Granular Matter* 26: 13, doi:10.1007/s10035-023-01376-1 |
| About text, ARROW news | ARROW Student Spotlight (arrowosw.org, Nov 10, 2025) and ARROW 2025 Annual Report, Student Highlights |
| Tufts poster | Tufts 4th Annual Symposium in Geotechnical Engineering program, Feb 7, 2026 |

Numbers from the earlier site that could not be checked against these sources were removed (14 m → 23.5 m penetration,
50–80 % thrust reduction, 48 mm reducer, 4 × 3 mm jets at 6–7 L/min, +287 % / +28.8 % setup, 21 load tests). Add them
back only after confirming them in the full papers.

## Deploying (Vercel)

The site is deployed as a Vercel project with this folder as its root. Any of these works:

1. **Vercel dashboard:** create a project, import the Git repository, set **Root Directory** to `website`,
   Framework preset **Other**, no build command. Every push then redeploys automatically.
2. **Vercel CLI:** from this folder run `npx vercel --prod`.

`vercel.json` is picked up automatically; no other settings are needed.

3. **Without a Git connection (API deployment):** upload only `vercel.json` and set the project's build command to fetch an
   exact, already-reviewed commit, so nothing unreviewed can be published:
   `git init -q s&&git -C s fetch -q --depth 1 https://github.com/mortezaashafiei/exit-slips <COMMIT_SHA>&&git -C s checkout -q FETCH_HEAD&&mv s/website dist&&rm dist/README.md dist/.vercelignore dist/vercel.json`
   with output directory `dist` and framework "Other".

## Connecting the domain

In Vercel → Project → Settings → Domains, add **both** `www.mortezashafiei.com` (primary) and `mortezashafiei.com`
(set to redirect to `www`). Vercel then shows the exact DNS records to create at your domain registrar, typically:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | the IPv4 address Vercel shows for your project |
| CNAME | `www` | the target Vercel shows (e.g. `….vercel-dns-0xx.com`) |

Remove any old A/CNAME records for `@` and `www` that point elsewhere (for example GitHub Pages). HTTPS
certificates are issued automatically within minutes.

## Security

### Built into the site

- **Strict Content-Security-Policy**: only this site's own files can load or run. No third-party scripts, fonts,
  analytics, trackers or cookies. Inline scripts/styles are blocked (except one hashed line), and Trusted Types
  blocks DOM-based script injection.
- **Clickjacking protection** (`frame-ancestors 'none'`, `X-Frame-Options: DENY`): the site cannot be embedded in other sites.
- **HTTPS only** with HSTS (2 years, subdomains, preload-ready).
- **Cross-origin isolation** (COOP/COEP/CORP), `nosniff`, `Referrer-Policy: no-referrer`, and a `Permissions-Policy`
  that turns off camera, microphone, location, payments, USB and other browser features.
- **No forms, logins, databases or server code**, so there is nothing to inject into or break into.
- **Privacy**: photo metadata removed; email addresses hidden from harvesters; all external links use `noopener noreferrer`.

Check the live headers any time at <https://securityheaders.com> and <https://developer.mozilla.org/en-US/observatory>.

### Things only you can do (most important)

A static site is almost always compromised through the **accounts** around it, not the code. Please:

1. Turn on **two-factor authentication** (an authenticator app or passkey, not SMS) for **Gmail, GitHub, Vercel and your
   domain registrar**.
2. At your registrar: enable **auto-renew**, **registrar/transfer lock**, **WHOIS privacy**, and **DNSSEC**.
3. Add these DNS records so nobody can send fake email "from" `@mortezashafiei.com` (the domain does not send email):

   | Type | Name | Value |
   | --- | --- | --- |
   | TXT | `@` | `v=spf1 -all` |
   | TXT | `_dmarc` | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s` |
   | MX | `@` | `0 .` (a "null MX": the domain accepts no mail; skip this if your registrar does not support it) |
   | CAA | `@` | `0 issue "letsencrypt.org"` (only Vercel's certificate authority may issue certificates) |

   If you later start using email on this domain (for example Google Workspace), replace the SPF/MX records with
   the provider's values first.
4. Never leave DNS records pointing at services you no longer use (that allows "subdomain takeover").
5. Optional, once the domain works over HTTPS: submit `mortezashafiei.com` at <https://hstspreload.org>.
   This is hard to undo, so only do it if every subdomain will always use HTTPS.

If the site is ever under attack, Vercel → Project → Firewall → **Attack Challenge Mode** can be switched on instantly.
