# AatmikJoy — Exploring the Joy of Being

This is the GitHub repository for the AatmikJoy website and its reflections.

## Current status

- ✅ Initial repository created on `main`.
- ✅ [What Is Health and Healing?](reflections/what-is-health-and-healing/index.html) reflection committed as a standalone HTML page.
- ✅ `.nojekyll` is committed for static hosting.
- ⏳ **The main website files have not yet been uploaded.** The repository does not yet have a root `index.html`, logo, or shared watercolor image. Until they are added, the website is not ready to publish.

## One-time upload of the approved website

The approved Version 9 watercolor website and the new Health & Healing article were packaged together. To finish the initial migration without changing the design, **extract `AatmikJoy_upload_to_GitHub.zip`** and upload these three files to the repository root via GitHub's **Add file → Upload files**:

1. `index.html` — the existing complete website with Home, Paths, Reflections, Connect, Products, and the membership demonstration. Its Reflections page links to the locally committed Health & Healing article.
2. `logo.png` — existing horizontal AatmikJoy logo.
3. `assets-watercolor.webp` — the shared watercolor background image.

GitHub doesn't publish the contents of a ZIP automatically: extract the ZIP and upload the **files** (not the ZIP). Do not overwrite `reflections/what-is-health-and-healing/index.html` or this README.

## Publish with GitHub Pages

1. Once the three files are committed to `main`, navigate to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, select `main`, and folder `/ (root)`.
3. Test the resulting GitHub Pages address, typically `https://qiprana.github.io/AatmikJoy/`, including `#/reflections` and the standalone article under `reflections/what-is-health-and-healing/`.
4. In **Settings → Pages**, enter custom domain `aatmikjoy.me`; only then configure its DNS with your registrar. GitHub will create/manage the `CNAME` entry when you save the custom domain.
5. Once available, enable **Enforce HTTPS**.

## Adding reflections

- Create `reflections/<slug>/index.html` using the existing article as a page template.
- Add a matching article entry to the `articles` array in root `index.html` so it appears in the Reflections listing.
- Create changes on a feature branch and review before merging to `main`.

A future Astro migration could simplify this into Markdown files and shared layouts, but it has **not** been performed in this version.

## Security and limitations

GitHub Pages serves static files. Request to Join, member preview, and contact placeholders are **not live backends** or private data collection systems. Do not collect private client data or health records through this static prototype.
