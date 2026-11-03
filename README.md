# Ítalo Portfolio — hybrid static HTML + Eleventy

This version makes **only project pages from Markdown**. The homepage and About page are ordinary HTML, copied unchanged.

## Run in WebStorm

```bash
npm install
npm run start
```

Open the local URL printed by Eleventy (usually http://localhost:8080). Run `npm run build` for the deployable `_site` folder.

## Edit files

- `src/index.html` — completely plain homepage HTML; edit freely in WebStorm.
- `src/about/index.html` — completely plain About HTML; outputs `/about/`.
- `src/assets/site.css` — shared CSS for home, About, and projects.
- `src/projects/*.md` — 24 project pages; frontmatter holds titles, years, WebP covers, galleries, and URLs.
- `src/projects/20xx/**.webp` — project images, copied through unchanged.
- `src/_includes/project.njk` — reusable layout for individual project pages.
- `src/_includes/base.njk` — project page HTML shell only.

## Important

The homepage project cards are **hand-written HTML**, not regenerated from the Markdown. If you add, delete, or rename a project, update the corresponding homepage link/card in `src/index.html` yourself. Changes to Markdown still automatically regenerate individual project pages.

Eleventy remains an npm build-time dependency, including any transitive dependencies disclosed by `npm audit`; this architecture does **not** remove those packages.

The About content is a placeholder.
