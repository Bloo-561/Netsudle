// Saved progress (this browser only). Falls back to memory if storage is blocked.
import { useSyncExternalStore } from "react";

const KEY = "netsudle:v2";
const DEFAULTS = {
  settings: { season1Only: false, play: "daily", background: "/assets/backgrounds/thors.png" },
  games: {},
  stats: {},
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && typeof saved === "object") {
      return { ...DEFAULTS, ...saved, settings: { ...DEFAULTS.settings, ...saved.settings } };
    }
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

let state = load();
const listeners = new Set();

export function setState(update) {
  const next = typeof update === "function" ? update(state) : update;
  if (next === state) return;
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useStore = () => useSyncExternalStore(subscribe, () => state);

export const setSetting = (name, value) =>
  setState((s) => ({ ...s, settings: { ...s.settings, [name]: value } }));
