// Daily puzzle clock. Everyone gets the same puzzle; the day rolls over at
// midnight Eastern time. Puzzle #1 is 11 November 2026.
const TZ = "America/New_York";
const EPOCH = Date.UTC(2026, 10, 11);

const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

function parts(date = new Date()) {
  const p = {};
  for (const { type, value } of fmt.formatToParts(date)) p[type] = Number(value);
  return p;
}

export function dayNumber(date = new Date()) {
  const p = parts(date);
  return Math.floor((Date.UTC(p.year, p.month - 1, p.day) - EPOCH) / 86400000) + 1;
}

export function secondsToReset(date = new Date()) {
  const p = parts(date);
  return Math.max(0, 86400 - (p.hour * 3600 + p.minute * 60 + p.second));
}

// Small seeded random number generator (xmur3 hash + mulberry32).
function hash(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

export function seeded(seedText) {
  let a = hash(seedText);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Picks the puzzle for a day. The pool is shuffled once per cycle, so no
// puzzle repeats until every one has been used.
export function pickDaily(puzzles, seedKey, day) {
  const sorted = [...puzzles].sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  const n = sorted.length;
  if (!n) return null;
  const index = day - 1;
  const cycle = Math.floor(index / n);
  const rnd = seeded(`netsudle:${seedKey}:${cycle}`);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
  }
  return sorted[((index % n) + n) % n];
}
