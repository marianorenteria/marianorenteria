export const siteUrl = "https://marianorenteria.com";

export const nav = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/podcast", label: "Podcast" },
  { href: "/blog", label: "Blog" },
  { href: "/productos", label: "Productos" },
  { href: "/links", label: "Links" },
];

export type Social = { label: string; href: string; icon: string };

const x: Social = { label: "X", href: "https://x.com/marianorenteria", icon: "x" };
const instagram: Social = {
  label: "Instagram",
  href: "https://instagram.com/marianorenteria",
  icon: "instagram",
};
const tiktok: Social = {
  label: "TikTok",
  href: "https://www.tiktok.com/@marianorenteria",
  icon: "tiktok",
};
const linkedin: Social = {
  label: "LinkedIn",
  href: "https://www.linkedin.com/in/marianorenteria/",
  icon: "linkedin",
};
const youtube: Social = {
  label: "YouTube",
  href: "https://www.youtube.com/@marianorenteria",
  icon: "youtube",
};
const dev: Social = {
  label: "DEV Community",
  href: "https://dev.to/marianorenteria",
  icon: "dev",
};

export const linksHeroSocials: Social[] = [
  { ...x, label: "X (Twitter)" },
  instagram,
  tiktok,
  linkedin,
  youtube,
  { ...dev, label: "Blog en DEV Community" },
];

export const linksFooterSocials: Social[] = [x, instagram, linkedin, youtube];

export const siteFooterSocials: Social[] = [x, instagram, tiktok, linkedin, youtube];

export const podcastLinks = {
  spotify: "https://open.spotify.com/show/1yIHS7vArQVkdbn56JNloA",
  apple: "https://podcasts.apple.com/podcast/chile-mole-tech/id1507919535",
  youtube: "https://youtube.com/playlist?list=PLBAFbEF2slgkRd4G0eUWo3lHOBDY9AgZa",
  all: "https://linktr.ee/chilemoleytech",
  feed: "https://anchor.fm/s/1c448a4c/podcast/rss",
};

export const sameAs = [
  x.href,
  instagram.href,
  tiktok.href,
  linkedin.href,
  youtube.href,
  dev.href,
  podcastLinks.spotify,
];

export function isCurrent(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}
