import { characters, byId, splash, cards, lore } from "./characters";

// Lore clues: wiki lines first, then plain facts so every puzzle has
// enough clues to last the whole game.
function loreClues(char) {
  const facts = [
    `Gender: ${char.gender}. Region: ${char.region}.`,
    `Weapon: ${char.weapons.join(", ")}.`,
    `Affiliation: ${char.affiliations.join(", ")}.`,
    `Group: ${char.group}.`,
    `Age: ${char.age}.`,
  ];
  return [...(lore[char.id] || []), ...facts].slice(0, 6);
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
    blurb: "Whose Netsu iF card is this?",
    max: 6,
    ownersOnly: true,
    hints: [
      { after: 2, kind: "weapon", label: "Weapon" },
      { after: 4, kind: "letter", label: "First letter" },
    ],
    build: () =>
      cards
        .filter((c) => byId[c.char])
        .map((c) => ({ ...c, chars: (c.chars || [c.char]).filter((id) => byId[id]) })),
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

// Characters that count as a correct guess (pair cards accept either person).
export const answersOf = (puzzle) => puzzle.chars || [puzzle.char];

const cache = {};
// Puzzles a mode can pick as the answer. "Season I only" removes Season II characters.
export function puzzlesFor(mode, season1Only) {
  const k = `${mode.id}:${season1Only ? 1 : 0}`;
  if (!cache[k]) {
    const all = mode.build();
    cache[k] = season1Only
      ? all.filter((p) => answersOf(p).every((id) => byId[id].debut === 1))
      : all;
  }
  return cache[k];
}

// Characters offered in the search box.
export function candidatesFor(mode, season1Only) {
  if (mode.ownersOnly) {
    const owners = new Set(puzzlesFor(mode, season1Only).flatMap((p) => answersOf(p)));
    return characters.filter((c) => owners.has(c.id));
  }
  return season1Only ? characters.filter((c) => c.debut === 1) : characters;
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
