import { getCollection, type CollectionEntry } from "astro:content";
import { postHref, type Locale } from "../i18n/routes";

export type BlogPost = CollectionEntry<"blog">;

export type BlogLink = {
  slug: string;
  title: string;
  description: string;
  date: Date;
  minutes: number;
  cover: string;
  href: string;
  /** True when the card points at the original in the other language. */
  untranslated: boolean;
};

function postLang(post: BlogPost): Locale {
  return post.data.lang ?? "es";
}

export function postSlug(post: BlogPost): string {
  if (post.data.translationKey) return post.data.translationKey;
  const id = post.id.replace(/\\/g, "/");
  return id.split("/").pop() ?? id;
}

async function publishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog", ({ data }) => data.draft !== true);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPosts(locale: Locale = "es"): Promise<BlogPost[]> {
  const posts = await publishedPosts();
  return posts.filter((post) => postLang(post) === locale);
}

export async function findTranslation(post: BlogPost, locale: Locale): Promise<BlogPost | undefined> {
  const slug = postSlug(post);
  const posts = await publishedPosts();
  return posts.find((candidate) => postLang(candidate) === locale && postSlug(candidate) === slug);
}

/** Posts for an index. Missing translations stay in the list and link to the original. */
export async function getBlogList(locale: Locale): Promise<BlogLink[]> {
  const posts = await publishedPosts();
  const groups = new Map<string, Partial<Record<Locale, BlogPost>>>();
  for (const post of posts) {
    const slug = postSlug(post);
    const group = groups.get(slug) ?? {};
    group[postLang(post)] = post;
    groups.set(slug, group);
  }

  const items: BlogLink[] = [];
  for (const [slug, group] of groups) {
    const preferred = group[locale];
    const fallback = locale === "en" ? group.es : group.en;
    const post = preferred ?? fallback;
    if (!post) continue;
    const other = locale === "en" ? "es" : "en";
    items.push({
      slug,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
      minutes: post.data.minutes,
      cover: post.data.cover,
      href: postHref(preferred ? locale : other, slug),
      untranslated: !preferred,
    });
  }

  return items.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}
