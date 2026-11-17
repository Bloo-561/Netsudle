import { characters, byId, splash, cards, lore } from "./characters";

// Lore clues: six hand-written lines from lore.json, most obscure first.
// The character's group fills in only if a character has fewer than six.
function loreClues(char) {
  return [...(lore[char.id] || []), `Group: ${char.group}.`].slice(0, 6);
}

// ----- Card mode: guess the card's name -----
const slug = (t) =>
  t
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
export const cardId = (name) => `card-${slug(name)}`;

const isLetter = (ch) => /[a-z0-9]/i.test(ch);
// "Echo Flash" -> "_ _ _ _   _ _ _ _ _"; punctuation stays visible.
function pattern(name, reveal) {
  return name
    .split(" ")
    .map((word) => {
      let shown = false;
      return [...word]
        .map((ch) => {
          if (!isLetter(ch)) return ch;
          const keep = !shown && reveal(word);
          shown = true;
          return keep ? ch.toUpperCase() : "_";
        })
        .join(" ");
    })
    .join("   ");
}

// NPC cards: the blue Skill cards plus burdens, enemy and special cards.
// Everything else belongs to a party member's own deck.
const NPC_TYPES = new Set(["Skill", "Burden", "Enemy", "Special"]);

// Clues shown one per wrong guess, vaguest first.
function cardClues(card, chars) {
  const firstWord = card.name.split(" ").find((w) => [...w].some(isLetter));
  return [
    { label: "Character or NPC card", value: NPC_TYPES.has(card.type) ? "NPC" : "Character" },
    { label: "Card type", value: card.type },
    { label: "Used by", value: chars.map((id) => byId[id].name).join(" & ") },
    { label: "The name", value: pattern(card.name, (w) => w === firstWord), mono: true },
    { label: "Every word's first letter", value: pattern(card.name, () => true), mono: true },
  ];
}

export const MODES = [
  {
    id: "classic",
    name: "Classic",
    blurb: "Guess the character from attribute clues.",
    max: 10,
    hints: [
      { after: 4, kind: "clue", label: "Clue" },
      { after: 7, kind: "portrait", label: "Blurred portrait" },
    ],
    build: () => characters.map((c) => ({ key: c.id, char: c.id })),
  },
  {
    id: "splash",
    name: "Splash",
    blurb: "Guess the character from a zoomed-in piece of their art.",
    max: 6,
    zoom: [11, 8, 5.5, 3.8, 2.5, 1.6],
    hints: [
      { after: 2, kind: "region", label: "Region" },
      { after: 4, kind: "group", label: "Group" },
    ],
    build: () =>
      Object.entries(splash)
        .filter(([id]) => byId[id])
        .map(([id, s]) => ({ key: id, char: id, ...s })),
  },
  {
    id: "card",
    name: "Card",
    blurb: "Name the Netsu iF card from a piece of its art.",
    max: 6,
    // The image is the art only (no title or text box), so it can open all the way up.
    zoom: [5, 3.6, 2.6, 1.9, 1.35, 1],
    answerKind: "card",
    hints: [],
    build: () =>
      cards
        .filter((c) => byId[c.char])
        .map((c) => {
          const chars = (c.chars || [c.char]).filter((id) => byId[id]);
          return { ...c, chars, answers: [cardId(c.name)], clues: cardClues(c, chars) };
        }),
  },
  {
    id: "lore",
    name: "Lore",
    blurb: "Guess the character from wiki clues. Spoilers ahead.",
    max: 6,
    hints: [
      { after: 2, kind: "letter", label: "First letter" },
      { after: 4, kind: "portrait", label: "Blurred portrait" },
    ],
    build: () =>
      Object.keys(lore)
        .filter((id) => byId[id])
        .map((id) => ({ key: id, char: id, clues: loreClues(byId[id]) })),
  },
];

export const modeById = Object.fromEntries(MODES.map((m) => [m.id, m]));

// Ids that count as a correct guess: card names in Card mode, otherwise
// characters (pair cards in other modes accept either person).
export const answersOf = (puzzle) => puzzle.answers || puzzle.chars || [puzzle.char];
const peopleOf = (puzzle) => puzzle.chars || [puzzle.char];

const cache = {};
// Puzzles a mode can pick as the answer. "Season I only" removes Season II characters.
export function puzzlesFor(mode, season1Only) {
  const k = `${mode.id}:${season1Only ? 1 : 0}`;
  if (!cache[k]) {
    const all = mode.build();
    cache[k] = season1Only
      ? all.filter((p) => peopleOf(p).every((id) => byId[id].debut === 1))
      : all;
  }
  return cache[k];
}

// Options offered in the search box: card names in Card mode, otherwise characters.
const cardCache = {};
export function candidatesFor(mode, season1Only) {
  if (mode.answerKind === "card") {
    const k = season1Only ? 1 : 0;
    if (!cardCache[k]) {
      const names = new Map();
      for (const p of puzzlesFor(mode, season1Only)) names.set(p.answers[0], p.name);
      cardCache[k] = [...names]
        .map(([id, name]) => ({ id, name }))
        .sort((x, y) => x.name.replace(/\W/g, "").localeCompare(y.name.replace(/\W/g, "")));
    }
    return cardCache[k];
  }
  return season1Only ? characters.filter((c) => c.debut === 1) : characters;
}

// Look up a guess id (a character, or a card name in Card mode).
export function lookupFor(mode, season1Only) {
  if (mode.answerKind !== "card") return byId;
  return Object.fromEntries(candidatesFor(mode, season1Only).map((o) => [o.id, o]));
}

export function hintText(kind, char) {
  switch (kind) {
    case "region":
      return `Region: ${char.region}`;
    case "group":
      return `Group: ${char.group}`;
    case "weapon":
      return `Weapon: ${char.weapons.join(", ")}`;
    case "letter":
      return `The name starts with "${char.name[0]}"`;
    case "clue":
      return lore[char.id]?.[0] || `The name starts with "${char.name[0]}"`;
    default:
      return "";
  }
}
