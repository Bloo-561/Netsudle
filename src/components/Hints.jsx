import { Lightbulb } from "lucide-react";
import { hintUnlocked } from "../lib/engine";
import { hintText } from "../lib/modes";
import Icon from "./Icon";

export default function Hints({ mode, game, answer, onHint }) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 w-full mt-4 text-base">
      {mode.hints.map((h) => {
        const used = game.hints.includes(h.kind);
        const unlocked = hintUnlocked(game, h);
        if (used) {
          return (
            <div
              key={h.kind}
              className="flex items-center gap-2 bg-neutral-800 border-2 border-yellow-500 rounded px-3 py-2 text-left"
            >
              <Lightbulb size={18} className="text-yellow-400 flex-shrink-0" />
              {h.kind === "portrait" ? (
                <span className="block h-20 w-20 overflow-hidden rounded">
                  <Icon
                    char={answer}
                    alt="Blurred portrait of the answer"
                    className="h-20 w-20"
                    style={{ filter: game.status === "playing" ? "blur(7px)" : "none" }}
                  />
                </span>
              ) : (
                <span>{hintText(h.kind, answer)}</span>
              )}
            </div>
          );
        }
        if (game.status !== "playing") return null;
        const left = h.after - game.guesses.length;
        return (
          <button
            key={h.kind}
            disabled={!unlocked}
            onClick={() => onHint(h.kind)}
            className="flex items-center justify-center gap-2 bg-neutral-800 border-2 border-neutral-600 rounded px-3 py-2 cursor-pointer enabled:hover:border-yellow-500 disabled:cursor-default disabled:opacity-60"
          >
            <Lightbulb size={18} />
            {unlocked
              ? `Show hint: ${h.label}`
              : `${h.label} hint in ${left} ${left === 1 ? "guess" : "guesses"}`}
          </button>
        );
      })}
    </div>
  );
}
