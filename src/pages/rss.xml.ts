import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "Mariano Rentería",
    description:
      "Carrera, liderazgo y tecnología. El blog y el newsletter de Mariano Rentería son lo mismo.",
    site: context.site ?? "https://marianorenteria.com",
    trailingSlash: false,
    customData: "<language>es-mx</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}`,
    })),
  });
}
