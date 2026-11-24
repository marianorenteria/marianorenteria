import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FEED_URL = "https://anchor.fm/s/1c448a4c/podcast/rss";

export type Episode = {
  title: string;
  /** Display date, e.g. `3 dic 2025`. */
  date: string;
  isoDate: string;
  /** Display length, e.g. `50 min` or `1 h 16 min`. */
  duration: string;
  link: string;
  summary: string;
};

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/**
 * Short blurbs for episodes whose show notes are only links and a guest name.
 * Keyed by the episode id at the end of the Spotify for Podcasters URL.
 * Newer episodes fall back to cleaned show-note text.
 */
const BLURBS: Record<string, string> = {
  e3br8sb:
    "Una conversación con Eduardo Aguirre sobre agentes de IA y cómo se están usando en la industria.",
  e386147:
    "El primer episodio-newsletter: contratar personas a las que les importe su trabajo, y reflexiones sobre el momento de la IA.",
  e31q5pk:
    "Con Jesús Cisneros, un recuento de cómo las empresas están adoptando inteligencia artificial en 2025.",
  e30ibn3: "Emilio Sosa nos explica el mundo de las criptomonedas, de Bitcoin a las memecoins.",
  e2t3g7s: "Con Eduardo Ismael García (@eduardo_gpg), una mirada a por qué Python se comió el 2024.",
  e2rrr7v: "Cynthia Castillo nos platica de ciencia de datos, matemáticas y su trabajo como La Matemaga.",
  e2qn3lr:
    "Ismael Medina sobre el rol del DBA y el DB Developer, con un bonus sobre FKs, JOINs y su polémica.",
  e2q5d25: "Miguel Teheran comparte lo que ha aprendido creando y vendiendo cursos en línea.",
};

const BOILERPLATE = [
  /todos los links del podcast/i,
  /patrocinio/i,
  /una producción de mariano/i,
  /linktr\.ee/i,
  /gumroad\.com/i,
];

function decode(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
}

function tag(block: string, name: string): string {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return match ? decode(match[1]) : "";
}

function formatFeedDate(pubDate: string): { date: string; isoDate: string } {
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.valueOf())) return { date: pubDate, isoDate: "" };
  return {
    date: `${parsed.getUTCDate()} ${MONTHS[parsed.getUTCMonth()]} ${parsed.getUTCFullYear()}`,
    isoDate: parsed.toISOString(),
  };
}

function formatDuration(raw: string): string {
  const parts = raw.trim().split(":").map((part) => Number.parseInt(part, 10));
  if (!parts.length || parts.some((part) => Number.isNaN(part))) return raw;
  let seconds = parts[0] ?? 0;
  if (parts.length === 3) seconds = parts[0]! * 3600 + parts[1]! * 60 + parts[2]!;
  else if (parts.length === 2) seconds = parts[0]! * 60 + parts[1]!;
  const minutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours > 0) return rest ? `${hours} h ${rest} min` : `${hours} h`;
  return `${minutes} min`;
}

function episodeId(link: string): string {
  const match = link.match(/-(e[a-z0-9]+)$/i);
  return match?.[1]?.toLowerCase() ?? "";
}

function truncate(text: string, max = 220): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim();
  return `${base}…`;
}

function cleanDescription(html: string): string {
  const text = decode(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  const lines = text
    .split(/\n+/)
    .map((line) => line.replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 12)
    .filter((line) => !BOILERPLATE.some((pattern) => pattern.test(line)))
    .filter((line) => !/^(invitado|mariano|eduardo|jesús|jesus)\s*:/i.test(line))
    .filter((line) => !/^[#*]/.test(line));
  return truncate(lines.join(" "));
}

function summaryFor(link: string, descriptionHtml: string): string {
  const blurb = BLURBS[episodeId(link)];
  if (blurb) return blurb;
  return cleanDescription(descriptionHtml);
}

export function parseFeed(xml: string): Episode[] {
  return xml
    .split(/<item\b[^>]*>/i)
    .slice(1)
    .map((chunk) => chunk.split(/<\/item>/i)[0] ?? "")
    .map((block) => {
      const link = tag(block, "link");
      const { date, isoDate } = formatFeedDate(tag(block, "pubDate"));
      const title = tag(block, "title")
        .replace(/\s+-\s+(S\d+\s+E\d+)\s*$/i, " — $1")
        .replace(/\s+/g, " ")
        .trim();
      return {
        title,
        date,
        isoDate,
        duration: formatDuration(tag(block, "itunes:duration")),
        link,
        summary: summaryFor(link, tag(block, "description")),
      };
    })
    .filter((episode) => episode.title && episode.link);
}

function loadFallback(): Episode[] {
  try {
    const path = resolve(process.cwd(), "src/data/episodes.json");
    const parsed = JSON.parse(readFileSync(path, "utf8")) as Episode[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("[podcast] could not read src/data/episodes.json", error);
    return [];
  }
}

/** Latest episodes from the Chile, Mole & Tech RSS feed, with a committed snapshot as fallback. */
export async function getEpisodes(limit = 8): Promise<Episode[]> {
  try {
    const response = await fetch(FEED_URL, {
      headers: {
        "user-agent": "marianorenteria.com (podcast feed at build; +https://marianorenteria.com)",
        accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const episodes = parseFeed(await response.text()).slice(0, limit);
    if (!episodes.length) throw new Error("feed had no episodes");
    console.log(`[podcast] ${episodes.length} episodes from the RSS feed`);
    return episodes;
  } catch (error) {
    console.warn("[podcast] feed unavailable, using src/data/episodes.json", error);
    return loadFallback().slice(0, limit);
  }
}
