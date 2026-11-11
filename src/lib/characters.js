// Loads the character list and the per-mode data files.
// netsu.json stays the single place to edit characters: comma-separated
// "weapon" and "affiliation" strings are split into lists here.
import raw from "../data/netsu.json";
import splashData from "../data/splash.json";
import cardData from "../data/cards.json";
import loreData from "../data/lore.json";

const list = (s) =>
  String(s ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const characters = raw.map((c) => {
  const name = c.name.trim().replace(/''/g, '"');
  return {
    ...c,
    name,
    id: c.id || slug(name),
    thumb: `/assets/thumbs/${c.id || slug(name)}.webp`,
    // "Group" is the tier-list folder the icon lives in, unless set by hand.
    group: c.group || c.icon.split("/").slice(-2, -1)[0] || "Unknown",
    weapons: list(c.weapon),
    affiliations: list(c.affiliation),
    debut: Number(c.debut) === 1 ? 1 : 2,
  };
});

export const byId = Object.fromEntries(characters.map((c) => [c.id, c]));

export const splash = splashData;
export const cards = cardData;
export const lore = loreData;
