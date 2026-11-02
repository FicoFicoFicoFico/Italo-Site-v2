# Ítalo Carajá — Eleventy portfolio

Rebuilt from the uploaded *exported HTML* and WebP project images (not original Astro Markdown sources).

## Run locally

Requires Node.js 20.11+.

```bash
npm install
npm run start
```

Open the URL printed by Eleventy (normally http://localhost:8080).

Production build: `npm run build`. Output: `_site/`.

## Edit content

- Each work is an editable Markdown file in `src/projects/`.
- Frontmatter defines `title`, `year`, `slug`, `permalink`, `cover`, and `images`.
- Image assets are under `src/projects/YYYY/...` (original files retained).
- Portfolio grid is in `src/index.njk`; individual project layout is `src/_includes/project.njk`.
- CSS: `src/assets/site.css`.
- Replace placeholder biography in `src/about.njk`.

## Migration notes

- Existing page text was extracted from the HTML exports. Formatting was simplified to Markdown.
- Invalid `.png` image references were mapped to provided `.webp` files where possible.
- Project URLs use `/work/<year>-<project-folder>/`; add redirects if you need to preserve legacy URLs.
- Original homepage, artist biography, fonts, favicon, and SEO settings were not included in the upload.
- Design is an initial editorial layout, not intended as a final sign-off.
