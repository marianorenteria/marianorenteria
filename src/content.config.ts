import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    minutes: z.number().int().positive(),
    cover: z.string(),
    /** Original URL. Imported DEV posts point canonical here. */
    canonical: z.url().optional(),
    draft: z.boolean().optional(),
    /** `es` is the default. English translations live beside the Spanish original. */
    lang: z.enum(["es", "en"]).default("es"),
    /**
     * Shared slug for a post and its translation.
     * Defaults to the filename. Use the same value in both language files.
     */
    translationKey: z.string().optional(),
  }),
});

export const collections = { blog };
