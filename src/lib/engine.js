// Game rules as plain functions over the saved state, so they are easy to test.
import { puzzlesFor } from "./modes";
import { pickDaily } from "./daily";

export const variantKey = (modeId, season1Only) => (season1Only ? `${modeId}:s1` : modeId);
const slotKey = (mode, s1, play) => `${variantKey(mode.id, s1)}:${play}`;

export const emptyStats = () => ({
  played: 0,
  wins: 0,
  streak: 0,
  best: 0,
  lastWin: 0,
  dist: {},
  uPlayed: 0,
  uWins: 0,
  uStreak: 0,
  uBest: 0,
});

export const statsFor = (state, modeId, s1) => ({
  ...emptyStats(),
  ...(state.stats?.[variantKey(modeId, s1)] || {}),
});

// A daily streak only counts if yesterday or today was won.
export const currentStreak = (stats, day) => (stats.lastWin >= day - 1 ? stats.streak : 0);

export function puzzleOf(mode, s1, key) {
  return puzzlesFor(mode, s1).find((p) => p.key === key) || null;
}

// Returns the game in progress, starting a new one when needed.
export function getGame(state, mode, s1, play, day, rnd = Math.random) {
  const slot = slotKey(mode, s1, play);
  const saved = state.games?.[slot];
  const puzzles = puzzlesFor(mode, s1);
  let fresh;
  if (play === "daily") {
    const p = pickDaily(puzzles, variantKey(mode.id, s1), day);
    if (saved && saved.day === day && saved.key === p.key) return { state, game: saved };
    fresh = { day, key: p.key, guesses: [], hints: [], status: "playing" };
  } else {
    if (saved && saved.key && puzzles.some((p) => p.key === saved.key)) return { state, game: saved };
    const avoid = saved?.prevKey;
    const pool = puzzles.length > 1 ? puzzles.filter((p) => p.key !== avoid) : puzzles;
    const p = pool[Math.floor(rnd() * pool.length)];
    fresh = { key: p.key, guesses: [], hints: [], status: "playing" };
  }
  return { state: { ...state, games: { ...state.games, [slot]: fresh } }, game: fresh };
}

function finish(stats, play, day, won, guessCount) {
  const s = { ...stats, dist: { ...stats.dist } };
  if (play === "daily") {
    s.played += 1;
    if (won) {
      s.wins += 1;
      s.streak = (s.lastWin === day - 1 ? s.streak : 0) + 1;
      s.lastWin = day;
      s.best = Math.max(s.best, s.streak);
      s.dist[guessCount] = (s.dist[guessCount] || 0) + 1;
    } else {
      s.streak = 0;
    }
  } else {
    s.uPlayed += 1;
    if (won) {
      s.uWins += 1;
      s.uStreak += 1;
      s.uBest = Math.max(s.uBest, s.uStreak);
    } else {
      s.uStreak = 0;
    }
  }
  return s;
}

export function applyGuess(state, mode, s1, play, day, charId) {
  const { state: st, game } = getGame(state, mode, s1, play, day);
  if (game.status !== "playing" || game.guesses.includes(charId)) return st;
  const puzzle = puzzleOf(mode, s1, game.key);
  const guesses = [...game.guesses, charId];
  const won = charId === puzzle.char;
  const lost = !won && guesses.length >= mode.max;
  const next = { ...game, guesses, status: won ? "won" : lost ? "lost" : "playing" };
  const vk = variantKey(mode.id, s1);
  let stats = statsFor(st, mode.id, s1);
  if (won || lost) stats = finish(stats, play, day, won, guesses.length);
  return {
    ...st,
    games: { ...st.games, [slotKey(mode, s1, play)]: next },
    stats: { ...st.stats, [vk]: stats },
  };
}

export const hintUnlocked = (game, hint) =>
  game.status !== "playing" || game.guesses.length >= hint.after;

export function applyHint(state, mode, s1, play, day, kind) {
  const { state: st, game } = getGame(state, mode, s1, play, day);
  const hint = mode.hints.find((h) => h.kind === kind);
  if (!hint || game.hints.includes(kind) || !hintUnlocked(game, hint)) return st;
  return {
    ...st,
    games: { ...st.games, [slotKey(mode, s1, play)]: { ...game, hints: [...game.hints, kind] } },
  };
}

// Unlimited mode: throw the finished game away so the next read deals a new one.
export function nextUnlimited(state, mode, s1) {
  const slot = slotKey(mode, s1, "unlimited");
  const saved = state.games?.[slot];
  return { ...state, games: { ...state.games, [slot]: { key: null, prevKey: saved?.key || null } } };
}

export function dailyDone(state, mode, s1, day) {
  const g = state.games?.[slotKey(mode, s1, "daily")];
  return g && g.day === day && g.status !== "playing" ? g.status : null;
}
