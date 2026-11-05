# AatmikJoy — Exploring the Joy of Being

AatmikJoy's website source and reflections, intended for GitHub Pages at `aatmikjoy.me`.

## Repository status
- The reflection [What Is Health and Healing?](reflections/what-is-health-and-healing/index.html) is committed.
- `.nojekyll` is committed for static hosting.
- **The main website has been refactored but has not been pushed to GitHub yet.** There is no root `index.html` in this repository until the modular bundle is added.

## Refactored website (Version 9)
The standalone 1.36 MB HTML page was split into small, editable files. Use the prepared **AatmikJoy_modular_site_files.zip** package and extract it; upload its **contents**, preserving the directory structure:

```
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
```

The independently committed article lives at `reflections/what-is-health-and-healing/index.html` and has been adjusted to reference `assets/images/logo.webp` and `assets/images/watercolor.webp`. **Do not overwrite or delete the article folder.**

The modular package contains no files over 100 KB. The images have been optimized as WebP. Existing Home, Paths, Reflections, Connect, Products and Join pages share the stylesheet and JavaScript. The current navigation is hash-based; reflections can have their own actual directories and URLs.

### Upload with GitHub Desktop
1. Clone `qiprana/AatmikJoy`.
2. Extract `AatmikJoy_modular_site_files.zip` and copy `index.html` and the `assets/` folder into the root of the cloned repository.
3. Verify that `reflections/what-is-health-and-healing/index.html` is still present.
4. Commit as **Modularize AatmikJoy website and optimize assets**, then push to `main`.
5. Test Home and Reflections locally or through the Pages URL.

## Publish with GitHub Pages
Configure **Settings → Pages → Deploy from a branch → main → / (root)**. Once the site is deployed and tested, configure the custom domain `aatmikjoy.me` and the DNS settings with your registrar. Enable HTTPS when GitHub makes it available.

## Future updates
- Styles: `assets/styles.css`
- Interactive navigation/reflection listing: `assets/app.js`
- Article pages: `reflections/<slug>/index.html`
- Artwork: `assets/images/` and `assets/reflections/`

Future reflections can be added as separate HTML pages. A Markdown-based system such as Astro can be introduced later without changing the visual language.

**Privacy:** GitHub Pages provides static hosting. Request to Join and the member preview are demonstration flows, not production authentication or health-data collection.
