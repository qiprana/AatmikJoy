# AatmikJoy — Exploring the Joy of Being

AatmikJoy's website source and reflections, intended for GitHub Pages at `aatmikjoy.me`.

## Repository status
- The reflection [What Is Health and Healing?](reflections/what-is-health-and-healing/index.html) is committed.
- `.nojekyll` is committed for static hosting.
- ✅ The modular website, stylesheet, JavaScript, optimized artwork and images have been pushed to `main` and verified in the repository.
- ✅ The root `CNAME` file contains `aatmikjoy.me`.
- ⏳ GitHub Pages deployment and custom-domain DNS/HTTPS are not yet independently verified.

## Refactored website (Version 9)
The original single-file design has been split into maintainable files and optimized assets. The current repository layout is:

```text
index.html
assets/
  styles.css
  app.js
  reflections.js
  images/
    logo.webp
    watercolor.webp
    artwork-1.webp ... artwork-5.webp
  reflections/
    reflection-health.webp
    reflection-ayurveda.webp
    reflection-yoga.webp
    reflection-professionals.webp
    reflection-equanimity.webp
    reflection-women.webp
reflections/
  what-is-health-and-healing/
    index.html
.nojekyll
CNAME
```

The independently committed article lives at `reflections/what-is-health-and-healing/index.html` and has been adjusted to reference `assets/images/logo.webp` and `assets/images/watercolor.webp`. **Do not overwrite or delete the article folder.**

The modular package contains no files over 100 KB. The images have been optimized as WebP. Existing Home, Paths, Reflections, Connect, Products and Join pages share the stylesheet and JavaScript. The current navigation is hash-based; reflections can have their own actual directories and URLs.

## Publish with GitHub Pages
Configure **Settings → Pages → Deploy from a branch → main → / (root)**. The `CNAME` file is already present and specifies `aatmikjoy.me`; verify the Custom domain setting on GitHub Pages and configure DNS with the domain registrar after confirming ownership. Enable HTTPS when GitHub makes it available.

## Future updates
- Styles: `assets/styles.css`
- Interactive navigation/reflection listing: `assets/app.js`
- Article pages: `reflections/<slug>/index.html`
- Artwork: `assets/images/` and `assets/reflections/`

Future reflections can be added as separate HTML pages. A Markdown-based system such as Astro can be introduced later without changing the visual language.

**Privacy:** GitHub Pages provides static hosting. Request to Join and the member preview are demonstration flows, not production authentication or health-data collection.
