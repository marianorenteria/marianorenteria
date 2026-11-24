export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export type RouteKey = "home" | "about" | "blog" | "podcast" | "products" | "links";

export const routes: Record<Locale, Record<RouteKey, string>> = {
  es: {
    home: "/",
    about: "/sobre-mi",
    blog: "/blog",
    podcast: "/podcast",
    products: "/productos",
    links: "/links",
  },
  en: {
    home: "/en/",
    about: "/en/about",
    blog: "/en/blog",
    podcast: "/en/podcast",
    products: "/en/products",
    links: "/en/links",
  },
};

const routeKeys = Object.keys(routes.es) as RouteKey[];

export function normalizePath(pathname: string): string {
  const path = pathname.split("?")[0]?.split("#")[0] ?? "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
}

export function localeFromPath(pathname: string): Locale {
  const path = normalizePath(pathname);
  return path === "/en" || path.startsWith("/en/") ? "en" : "es";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

export function routeKeyFromPath(pathname: string): RouteKey | null {
  const path = normalizePath(pathname);
  for (const locale of locales) {
    for (const key of routeKeys) {
      if (normalizePath(routes[locale][key]) === path) return key;
    }
  }
  return null;
}

export function postSlugFromPath(pathname: string): string | null {
  const path = normalizePath(pathname);
  const match = path.match(/^\/(?:en\/)?blog\/([^/]+)$/);
  return match?.[1] ?? null;
}

/** Where the language switcher should go when the page is not a translated post. */
export function sectionSwitchHref(pathname: string, target: Locale): string {
  const key = routeKeyFromPath(pathname);
  if (key) return routes[target][key];
  if (postSlugFromPath(pathname)) return routes[target].blog;
  return routes[target].home;
}

export function postHref(locale: Locale, slug: string): string {
  return locale === "en" ? `/en/blog/${slug}` : `/blog/${slug}`;
}

export function isCurrent(pathname: string, href: string): boolean {
  const path = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === "/" || target === "/en") return path === target;
  return path === target || path.startsWith(`${target}/`);
}

export type Alternate = { hreflang: string; href: string };

export function absoluteUrl(path: string, site = "https://marianorenteria.com"): string {
  return new URL(path, site).href;
}

export function staticAlternates(pathname: string, site = "https://marianorenteria.com"): Alternate[] | undefined {
  const key = routeKeyFromPath(pathname);
  if (!key) return undefined;
  const es = absoluteUrl(routes.es[key], site);
  const en = absoluteUrl(routes.en[key], site);
  return [
    { hreflang: "es-MX", href: es },
    { hreflang: "en", href: en },
    { hreflang: "x-default", href: es },
  ];
}

/** xhtml:link entries for the sitemap. Pairs translated static pages, and blog posts that share a filename. */
export function sitemapLinks(
  pageUrl: string,
  translatedSlugs?: Set<string>,
): { lang: string; url: string }[] | undefined {
  let pathname = "/";
  try {
    pathname = new URL(pageUrl).pathname;
  } catch {
    return undefined;
  }
  const staticLinks = staticAlternates(pathname);
  if (staticLinks) return staticLinks.map((link) => ({ lang: link.hreflang, url: link.href }));

  const slug = postSlugFromPath(pathname);
  if (!slug) return undefined;
  const esUrl = absoluteUrl(postHref("es", slug));
  const enUrl = absoluteUrl(postHref("en", slug));
  const translated = translatedSlugs?.has(slug) ?? false;
  if (!translated) {
    const only = localeFromPath(pathname) === "en" ? enUrl : esUrl;
    return [
      { lang: localeFromPath(pathname) === "en" ? "en" : "es-MX", url: only },
      { lang: "x-default", url: only },
    ];
  }
  return [
    { lang: "es-MX", url: esUrl },
    { lang: "en", url: enUrl },
    { lang: "x-default", url: esUrl },
  ];
}
