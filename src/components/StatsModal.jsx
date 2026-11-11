import { useState } from "react";
import Modal from "./Modal";
import { MODES, modeById } from "../lib/modes";
import { useStore } from "../lib/store";
import { statsFor, currentStreak } from "../lib/engine";

export default function StatsModal({ mode, day, onClose }) {
  const state = useStore();
  const { season1Only } = state.settings;
  const [id, setId] = useState(mode.id);
  const m = modeById[id];
  const s = statsFor(state, id, season1Only);
  const most = Math.max(1, ...Object.values(s.dist));
  const tiles = [
    ["Played", s.played],
    ["Win %", s.played ? Math.round((s.wins / s.played) * 100) : 0],
    ["Streak", currentStreak(s, day)],
    ["Best streak", s.best],
  ];

  return (
    <Modal title="Statistics" onClose={onClose}>
      <div className="flex flex-wrap gap-2 mb-4">
        {MODES.map((x) => (
          <button
            key={x.id}
            onClick={() => setId(x.id)}
            aria-pressed={x.id === id}
            className={`px-3 py-1 rounded cursor-pointer font-semibold ${
              x.id === id ? "bg-[#93374f]" : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>
      {season1Only && <p className="text-sm text-neutral-400 mb-3">Showing Season I only results.</p>}

      <h3 className="font-bold mb-2">Daily</h3>
      <div className="grid grid-cols-4 gap-2 text-center mb-5">
        {tiles.map(([label, value]) => (
          <div key={label} className="bg-neutral-800 rounded p-2">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-neutral-300">{label}</div>
          </div>
        ))}
      </div>

      <h3 className="font-bold mb-2">Guesses needed to win</h3>
      <div className="flex flex-col gap-1 mb-5">
        {Array.from({ length: m.max }, (_, i) => i + 1).map((n) => {
          const count = s.dist[n] || 0;
          return (
            <div key={n} className="flex items-center gap-2 text-sm">
              <span className="w-5 text-right">{n}</span>
              <div className="flex-1 bg-neutral-800 rounded h-5">
                <div
                  className="bg-[#c24d68] h-5 rounded text-right pr-1 text-xs leading-5 min-w-5"
                  style={{ width: `${(count / most) * 100}%`, opacity: count ? 1 : 0.35 }}
                >
                  {count}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="font-bold mb-2">Unlimited</h3>
      <p className="text-sm">
        {s.uPlayed} played · {s.uWins} won · current streak {s.uStreak} · best streak {s.uBest}
      </p>
    </Modal>
  );
}
