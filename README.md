# Nikoline Porse — Portfolio Site

Plain HTML/CSS/JS. No build step, no framework — open `index.html` directly in a
browser to preview, or deploy as-is.

## Before you publish

Open `contact.html` and replace the bracketed placeholders with real info:
- `[ your email here ]`
- `[ optional — add or remove ]` (phone — delete the whole `<li>` if you don't want it public)
- `[ linkedin.com/in/... ]`
- `[ optional — add or remove ]` (Instagram — delete if not wanted)

The résumé PDF (`assets/nikoline-porse-resume.pdf`) is already built from her current
experience — swap it out if anything changes.

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `nikoline-porse.github.io` for a root
   domain, or any name for a project site).
2. Push these files to the repo:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Source → Deploy from branch → main → / (root)**.
4. The site will be live at `https://<username>.github.io/<repo>/` within a few minutes.

## Structure

```
index.html        Home
about.html        About
experience.html   Career timeline, skills, education
contact.html      Contact + résumé download
css/style.css     Design system (colors, type, components)
js/main.js        Mobile nav + scroll reveal
assets/           Résumé PDF
```

## Adding a Portfolio/Press page later

Once there are real writing samples, press clips, or event photos to show, a
`portfolio.html` page following the same pattern (masthead + `.credential` cards
or a simple grid) slots in cleanly — just add it to the nav in each page's
`<nav class="masthead-nav">` block.
