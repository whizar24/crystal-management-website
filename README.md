# Crystal Management Consulting — Website

Professional multi-page website for Crystal Management Consulting (care business consultancy & training).

## Pages
- `index.html` — Home
- `consultancy.html`
- `training.html`
- `about.html`
- `contact.html` — discovery call + lead form
- `privacy.html`

## Preview locally
Open `index.html` in your browser, or from this folder run:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy to her hosting (cPanel)
1. Backup the current WordPress site first.
2. Upload these files into `public_html` (or a staging folder first).
3. If replacing WordPress completely, you may need to move/rename the old WP files, then upload this static site.
4. Point the domain to the new files and test forms/links.

## Before launch checklist
- [ ] Replace placeholder testimonials with real client quotes
- [ ] Add Calendly/Cal.com embed on Contact (`#book`) and wire all “Book” buttons to it
- [ ] Connect form to HubSpot / Brevo / Formspree (currently mailto fallback to `schola@cteprojects.org.uk`)
- [ ] Add Google Analytics ID in `index.html` (and other pages if desired)
- [ ] Confirm logo (replace CMS mark if she has a brand file)
- [ ] Submit sitemap to Google Search Console

## Contact used in build
- Phone: 07949 547251
- Email: schola@cteprojects.org.uk
- Domain: www.crystalmgmt.co.uk
