import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { useTranslations } from "../../i18n";
import { postHref } from "../../i18n/routes";
import { getPosts, postSlug } from "../../lib/posts";

export async function GET(context: APIContext) {
  const t = useTranslations("en");
  const posts = await getPosts("en");
  return rss({
    title: "Mariano Rentería",
    description: t.blog.rssDescription,
    site: context.site ?? "https://marianorenteria.com",
    trailingSlash: false,
    customData: "<language>en</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postHref("en", postSlug(post)),
    })),
  });
}
