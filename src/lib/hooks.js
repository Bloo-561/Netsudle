import { useEffect, useMemo, useState } from "react";
import { dayNumber, secondsToReset } from "./daily";
import { useStore, setState } from "./store";
import { getGame, puzzleOf, applyGuess, applyHint, nextUnlimited } from "./engine";

// In development, add ?day=5 to the address to preview another day's puzzles.
function dayOverride() {
  if (!import.meta.env.DEV) return null;
  const v = Number(new URLSearchParams(location.search).get("day"));
  return Number.isInteger(v) && v > 0 ? v : null;
}

// Current puzzle day and a ticking countdown to the next one.
export function useClock() {
  const read = () => ({ day: dayOverride() ?? dayNumber(), seconds: secondsToReset() });
  const [clock, setClock] = useState(read);
  useEffect(() => {
    const t = setInterval(() => setClock(read()), 1000);
    return () => clearInterval(t);
  }, []);
  return clock;
}

export function useGame(mode, day) {
  const state = useStore();
  const { season1Only, play } = state.settings;
  const resolved = useMemo(
    () => getGame(state, mode, season1Only, play, day),
    [state, mode, season1Only, play, day]
  );
  useEffect(() => {
    if (resolved.state !== state) setState(resolved.state);
  }, [resolved, state]);

  const game = resolved.game;
  const puzzle = puzzleOf(mode, season1Only, game.key);
  return {
    state,
    game,
    puzzle,
    play,
    season1Only,
    guess: (id) => setState((s) => applyGuess(s, mode, season1Only, play, day, id)),
    hint: (kind) => setState((s) => applyHint(s, mode, season1Only, play, day, kind)),
    playAgain: () => setState((s) => nextUnlimited(s, mode, season1Only)),
  };
}

export function useHashMode(valid, fallback) {
  const read = () => {
    const h = location.hash.replace("#", "");
    return valid.includes(h) ? h : fallback;
  };
  const [mode, setMode] = useState(read);
  useEffect(() => {
    const on = () => setMode(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [mode, (m) => (location.hash = m)];
}
