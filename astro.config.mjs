import { existsSync, readdirSync } from "node:fs";
import { copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { sitemapLinks } from "./src/i18n/routes.ts";

/** Cloudflare looks for a file named 404.html, walking up from the missing URL. */
function englishNotFound() {
  return {
    name: "english-not-found",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const base = fileURLToPath(dir);
        await copyFile(`${base}/en/404/index.html`, `${base}/en/404.html`);
      },
    },
  };
}

function englishPostSlugs() {
  const dir = "src/content/blog/en";
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir)
      .filter((name) => name.endsWith(".md"))
      .map((name) => name.replace(/\.md$/, "")),
  );
}

const translatedSlugs = englishPostSlugs();

export default defineConfig({
  site: "https://marianorenteria.com",
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    englishNotFound(),
    sitemap({
      filter: (page) => !page.includes("/404"),
      namespaces: { xhtml: true },
      serialize(item) {
        const links = sitemapLinks(item.url, translatedSlugs);
        return links ? { ...item, links } : item;
      },
    }),
  ],
});
