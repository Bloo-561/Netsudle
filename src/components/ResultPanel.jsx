import { useState } from "react";
import { Share2 } from "lucide-react";
import { MODES } from "../lib/modes";
import { dailyDone } from "../lib/engine";
import { shareText, copyText } from "../lib/share";
import Icon from "./Icon";

const pad = (n) => String(n).padStart(2, "0");

export default function ResultPanel({ mode, g, answer, clock, onMode }) {
  const { game, puzzle, play, season1Only, state } = g;
  const [copied, setCopied] = useState(null);
  const won = game.status === "won";

  const share = async () => {
    const ok = await copyText(shareText({ mode, game, puzzle, day: clock.day, play, season1Only }));
    setCopied(ok ? "Copied to clipboard" : "Could not copy");
    setTimeout(() => setCopied(null), 2500);
  };

  const nextMode = MODES.find((m) => m.id !== mode.id && !dailyDone(state, m, season1Only, clock.day));
  const s = clock.seconds;
  const button = "border-2 px-4 py-2 rounded cursor-pointer font-semibold flex items-center gap-2";

  return (
    <div
      role="status"
      className={`w-full py-6 px-4 sm:px-12 flex flex-col gap-4 items-center text-lg sm:text-xl rounded-md ${
        won ? "bg-green-400/95 text-black" : "bg-[#7e1919]/90 text-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon char={answer} className="h-20 w-20 rounded" />
        <p className="text-left">
          {won
            ? `You got it in ${game.guesses.length} ${game.guesses.length === 1 ? "guess" : "guesses"}!`
            : "Out of guesses."}
          <br />
          The character was <strong>{answer.name}</strong>.
        </p>
      </div>

      <div className="flex flex-row flex-wrap justify-center gap-3">
        <button onClick={share} className={`${button} ${won ? "border-black" : "border-white"}`}>
          <Share2 size={18} /> {copied || "Share result"}
        </button>
        {play === "unlimited" && (
          <button
            onClick={g.playAgain}
            className={`${button} ${won ? "border-black bg-black text-white" : "border-white bg-white text-black"}`}
          >
            Play again
          </button>
        )}
        {play === "daily" && nextMode && (
          <button
            onClick={() => onMode(nextMode.id)}
            className={`${button} ${won ? "border-black bg-black text-white" : "border-white bg-white text-black"}`}
          >
            Next: {nextMode.name} →
          </button>
        )}
      </div>

      {play === "daily" && (
        <p className="text-base">
          Next puzzle in{" "}
          <strong className="tabular-nums">
            {pad(Math.floor(s / 3600))}:{pad(Math.floor((s % 3600) / 60))}:{pad(s % 60)}
          </strong>
          {!nextMode && " · All four modes done for today."}
        </p>
      )}
    </div>
  );
}
