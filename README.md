### Hi there 👋

Github, if you read this, please send me some stickers... 

<!--
**marianorenteria/marianorenteria** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->

---

# marianorenteria.com

Personal site for Mariano Rentería. Static HTML, built with [Astro](https://astro.build).

This repository used to be only the GitHub profile README above. There was no framework and no deploy config, so the site is an Astro project: posts are Markdown files, pages compile to plain HTML, and the podcast feed is read when the site builds. Nothing has to stay running after deploy.

## Local development

Requires Node.js 22.

```bash
npm install
npm run dev
```

Open http://localhost:4321. The link page is at http://localhost:4321/links.

```bash
npm run build    # writes the site to dist/
npm run preview  # serve that build
```

`npm run build` needs network access once, to refresh the podcast episodes. If the feed cannot be reached, the build uses `src/data/episodes.json`.

## Write a new post

Add a Markdown file in `src/content/blog/`. The filename becomes the URL: `src/content/blog/mi-nota.md` is published at `/blog/mi-nota`. Spanish is the default. An English translation of the same post goes in `src/content/blog/en/mi-nota.md` with `lang: en` and is published at `/en/blog/mi-nota`. Use the same filename, or set `translationKey` to the shared slug in both files. Posts without a translation stay in their original language; the other blog index links to that original instead of an empty page.

```markdown
---
title: Título del post
description: Una o dos frases para las tarjetas, el RSS y las meta descriptions.
date: 2026-11-23
minutes: 4
cover: /images/post-lenguaje.png
# canonical: https://dev.to/marianorenteria/ejemplo
# draft: true
---

El texto del post, en Markdown.
```

`cover` is a path in `public/`, such as `/images/mi-portada.png` (about 1000×420, the same ratio as the DEV covers). `draft: true` keeps the post out of the site, the home page, and the RSS feed.

On the next build the post shows up on the home page, `/blog`, `/links`, and `/rss.xml`.

The eight posts already in the repo were imported from [dev.to/marianorenteria](https://dev.to/marianorenteria), with the original wording. Each one sets `canonical` to the DEV URL and links back to it at the bottom. Posts written only for this site can omit `canonical`. Older posts that are not imported stay on DEV; `/blog` links to that archive.

## Podcast and products

`/podcast` loads the eight newest episodes from the Chile, Mole & Tech RSS feed at build time:

https://anchor.fm/s/1c448a4c/podcast/rss

Show notes that are only links use a short blurb in `src/lib/podcast.ts`. A failed fetch falls back to `src/data/episodes.json`.

Gumroad products live in `src/data/products.ts`. Prices, ratings, and links for the home page, `/links`, and `/productos` all come from that file.

Newsletter forms post to SendFox (`https://sendfox.com/form/1j2e6e/m8qw26`) with `first_name`, `email`, and the honeypot field `a_password`, plus `https://sendfox.com/js/form.js`. Leave those names as they are.

## Deploy

`npm run build` writes the site to `dist/`. The site is served as static assets by a Cloudflare Worker named `marianorenteria`, built with Workers Builds from this repository. The production branch is `master`.

Workers Builds settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

`wrangler.jsonc` names the worker, publishes `./dist`, and sets HTML handling so `/links`, `/blog`, and the other folder pages resolve to their `index.html` files. `not_found_handling` is `404-page`, which serves Astro's `dist/404.html` for unknown URLs.

Set `NODE_VERSION` to `22` (`.node-version` already says 22). The build should be allowed to fetch `anchor.fm` so podcast episodes stay current. If that request is blocked, the committed snapshot is used instead.

Check the config without publishing:

```bash
npm run build && npx wrangler deploy --dry-run
```

After the first deploy, attach `marianorenteria.com` to the worker. This repo does not log in to Cloudflare for you.
