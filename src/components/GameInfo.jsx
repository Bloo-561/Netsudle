import { useState } from "react";
import { CalendarDays, Infinity as InfinityIcon } from "lucide-react";
import Search from "./Search";
import ZoomImage from "./ZoomImage";
import LoreClues from "./LoreClues";
import Hints from "./Hints";
import ResultPanel from "./ResultPanel";
import { setSetting } from "../lib/store";
import { statsFor, currentStreak } from "../lib/engine";

const LOGOS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/assets/misc/Icon${n}.png`);

export default function GameInfo({ mode, g, answer, candidates, clock, onMode }) {
  const { game, puzzle, play, season1Only, state } = g;
  const [logo] = useState(() => LOGOS[Math.floor(Math.random() * LOGOS.length)]);
  const finished = game.status !== "playing";
  const wrong = game.guesses.filter((id) => !(puzzle.chars || [puzzle.char]).includes(id)).length;
  const stats = statsFor(state, mode.id, season1Only);
  const streak = play === "daily" ? currentStreak(stats, clock.day) : stats.uStreak;
  const best = play === "daily" ? stats.best : stats.uBest;

  // Where the zoom is aimed, stored per image in splash.json / cards.json.
  const focal = puzzle;

  const toggle = (value, label, Icon) => (
    <button
      onClick={() => setSetting("play", value)}
      aria-pressed={play === value}
      className={`flex items-center gap-1 px-3 py-1 rounded cursor-pointer font-semibold ${
        play === value ? "bg-white text-[#93374f]" : "bg-[#6e3343] text-white hover:bg-[#7d3a4c]"
      }`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="flex flex-col w-11/12 sm:w-8/12 max-w-4xl gap-y-5">
      <div className="flex flex-col items-center text-center w-full py-6 px-4 sm:px-12 bg-[#93374f]/95 rounded-md">
        <div className="flex flex-row gap-2 mb-4" role="group" aria-label="Play mode">
          {toggle("daily", "Daily", CalendarDays)}
          {toggle("unlimited", "Unlimited", InfinityIcon)}
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold">
          {mode.name}
          <span className="text-lg sm:text-xl font-semibold ml-3 opacity-90">
            {play === "daily" ? `#${clock.day}` : "Unlimited"}
            {season1Only ? " · Season I" : ""}
          </span>
        </h2>
        <p className="mt-1 mb-4 opacity-90">{mode.blurb}</p>

        <div className="flex flex-row flex-wrap justify-center gap-x-6 gap-y-1 text-lg font-semibold mb-5">
          <span>
            Guesses: {game.guesses.length} / {mode.max}
          </span>
          <span>
            {play === "daily" ? "Daily streak" : "Win streak"}: {streak} 🔥
          </span>
          <span>Best: {best} 🔥</span>
        </div>

        {mode.id === "classic" && (
          <img
            src={finished ? answer.icon : logo}
            alt={finished ? answer.name : ""}
            className="max-w-32 sm:max-w-44 h-auto rounded"
          />
        )}
        {(mode.id === "splash" || mode.id === "card") && (
          <ZoomImage
            key={puzzle.key}
            src={puzzle.src}
            fx={focal.fx}
            fy={focal.fy}
            w={focal.w}
            h={focal.h}
            step={wrong}
            scales={mode.zoom}
            revealed={finished}
            alt={mode.id === "card" ? `${answer.name}'s card` : `Art of ${answer.name}`}
          />
        )}
        {mode.id === "lore" && season1Only && (
          <p className="text-sm bg-neutral-900/70 rounded px-3 py-1 mb-3">
            Heads up: Lore clues can mention Season II events, even with Season I only on.
          </p>
        )}
        {mode.id === "lore" && <LoreClues clues={puzzle.clues} step={wrong} revealed={finished} />}

        <Hints mode={mode} game={game} answer={answer} onHint={g.hint} />

        {!finished && (
          <Search
            onGuess={(c) => g.guess(c.id)}
            candidates={candidates}
            guessed={game.guesses}
            disabled={finished}
          />
        )}
      </div>

      {finished && (
        <ResultPanel mode={mode} g={g} answer={answer} clock={clock} onMode={onMode} />
      )}
    </div>
  );
}
