import { Lock } from "lucide-react";

// Card mode clues: one more unlocks with each wrong guess.
export default function CardClues({ clues, step, revealed }) {
  const shown = revealed ? clues.length : Math.min(step, clues.length);
  return (
    <ol className="flex flex-col gap-2 w-full text-left mt-3 sm:mt-4">
      {clues.map((clue, i) => (
        <li
          key={clue.label}
          className={`rounded p-2 sm:p-3 border-2 text-sm sm:text-base ${
            i < shown
              ? "bg-neutral-800 border-[#c24d68]"
              : "bg-neutral-800/50 border-neutral-700 text-neutral-400"
          }`}
        >
          <span className="font-bold mr-2">{clue.label}:</span>
          {i < shown ? (
            <span className={clue.mono ? "font-mono whitespace-pre-wrap tracking-wide" : ""}>
              {clue.value}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Lock size={14} /> after {i + 1 - shown} more wrong{" "}
              {i + 1 - shown === 1 ? "guess" : "guesses"}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
