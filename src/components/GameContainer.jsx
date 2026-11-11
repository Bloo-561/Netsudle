import { useRef } from "react";
import GameInfo from "./GameInfo";
import Guess from "./Guess";
import GuessHeader from "./GuessHeader";
import { byId } from "../lib/characters";
import { columnsFor } from "../lib/compare";
import { candidatesFor, puzzlesFor } from "../lib/modes";
import { pickDaily } from "../lib/daily";
import { variantKey } from "../lib/engine";
import { useGame } from "../lib/hooks";
import Icon from "./Icon";

export default function GameContainer({ mode, clock, onMode }) {
  const g = useGame(mode, clock.day);
  const { game, puzzle, play, season1Only } = g;
  const answer = byId[puzzle.char];
  const candidates = candidatesFor(mode, season1Only);
  const columns = columnsFor(season1Only);
  const guesses = [...game.guesses].reverse().map((id) => byId[id]); // newest first

  // Only the guess that was just made flips in; restored guesses appear at once.
  const seen = useRef({ key: `${play}:${game.key}`, count: game.guesses.length });
  if (seen.current.key !== `${play}:${game.key}`) {
    seen.current = { key: `${play}:${game.key}`, count: game.guesses.length };
  }
  const isNew = (index) => game.guesses.length - index > seen.current.count;

  const yesterday =
    play === "daily" && clock.day > 1
      ? pickDaily(puzzlesFor(mode, season1Only), variantKey(mode.id, season1Only), clock.day - 1)
      : null;

  return (
    <div className="flex flex-col items-center justify-center text-center gap-y-5 text-white">
      <GameInfo
        mode={mode}
        g={g}
        answer={answer}
        candidates={candidates}
        clock={clock}
        onMode={onMode}
      />

      {guesses.length > 0 && mode.id === "classic" && (
        <div className="flex flex-col p-2 rounded bg-neutral-800 w-11/12 sm:w-auto max-w-[95vw] overflow-x-auto">
          <div className="min-w-min">
            <GuessHeader columns={columns} />
            {guesses.map((guess, index) => (
              <Guess
                key={guess.id}
                guess={guess}
                answer={answer}
                columns={columns}
                animate={isNew(index)}
              />
            ))}
          </div>
          <p className="text-sm text-neutral-300 mt-2 text-left">
            <span className="text-green-400">Green</span> is correct,{" "}
            <span className="text-yellow-400">yellow</span> is partly correct,{" "}
            <span className="text-[#e58aa0]">red</span> is wrong. Arrows point towards the
            answer&apos;s age.
          </p>
        </div>
      )}

      {guesses.length > 0 && mode.id !== "classic" && (
        <ul className="flex flex-row flex-wrap justify-center gap-2 w-11/12 sm:w-8/12">
          {guesses.map((guess) => {
            const right = guess.id === answer.id;
            return (
              <li
                key={guess.id}
                className={`flex items-center gap-2 rounded border-4 pr-3 ${
                  right ? "border-[#0d7835] bg-green-600" : "border-[#6e3343] bg-[#93374f]"
                }`}
              >
                <Icon char={guess} className="h-12 w-12 rounded-l-sm" />
                <span>{guess.name}</span>
                <span aria-label={right ? "correct" : "wrong"}>{right ? "✓" : "✗"}</span>
              </li>
            );
          })}
        </ul>
      )}

      {yesterday && (
        <p className="flex items-center gap-2 bg-neutral-900/90 rounded px-4 py-2 text-sm sm:text-base">
          Yesterday&apos;s {mode.name} answer (#{clock.day - 1}) was
          <Icon char={byId[yesterday.char]} className="h-8 w-8 rounded" />
          <strong>{byId[yesterday.char].name}</strong>
        </p>
      )}
    </div>
  );
}
