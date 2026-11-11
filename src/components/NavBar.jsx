import { BarChart3, CircleHelp, Check } from "lucide-react";
import { MODES } from "../lib/modes";
import { useStore, setSetting } from "../lib/store";
import { dailyDone } from "../lib/engine";

const backgrounds = [{ name: "Thors", src: "/assets/backgrounds/thors.png" }];

export default function Navbar({ modeId, onMode, day, onStats, onHelp }) {
  const state = useStore();
  const { season1Only, background } = state.settings;

  return (
    <nav className="w-full bg-neutral-900 sticky z-50 top-0 p-3 sm:px-4 text-gray-200">
      <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">Netsudle</h2>

        <div className="flex flex-row flex-wrap justify-center gap-2" role="tablist">
          {MODES.map((m) => {
            const done = dailyDone(state, m, season1Only, day);
            const active = m.id === modeId;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={active}
                onClick={() => onMode(m.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded cursor-pointer text-sm sm:text-base font-semibold border-2 ${
                  active
                    ? "bg-[#93374f] border-[#c24d68] text-white"
                    : "bg-neutral-800 border-neutral-700 hover:border-[#c24d68]"
                }`}
              >
                {m.name}
                {done && (
                  <Check
                    size={16}
                    className={done === "won" ? "text-green-400" : "text-neutral-400"}
                    aria-label={done === "won" ? "solved today" : "played today"}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-row flex-wrap items-center justify-center gap-3 lg:ml-auto text-sm sm:text-base">
          <label
            className="flex items-center gap-2 cursor-pointer"
            title="Hide Season II characters from every mode"
          >
            <input
              type="checkbox"
              checked={season1Only}
              onChange={(e) => setSetting("season1Only", e.target.checked)}
              className="h-4 w-4 accent-[#c24d68] cursor-pointer"
            />
            Season I only
          </label>
          {backgrounds.length > 1 && (
            <select
              value={background}
              onChange={(e) => setSetting("background", e.target.value)}
              className="bg-neutral-800 px-2 py-1 rounded cursor-pointer"
              aria-label="Background"
            >
              {backgrounds.map((b) => (
                <option key={b.src} value={b.src}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={onStats}
            className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded cursor-pointer hover:bg-neutral-700"
          >
            <BarChart3 size={18} /> Stats
          </button>
          <button
            onClick={onHelp}
            className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded cursor-pointer hover:bg-neutral-700"
          >
            <CircleHelp size={18} /> How to play
          </button>
        </div>
      </div>
    </nav>
  );
}
