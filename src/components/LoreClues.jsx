import { Lock } from "lucide-react";

export default function LoreClues({ clues, step, revealed }) {
  const shown = revealed ? clues.length : Math.min(step + 1, clues.length);
  return (
    <ol className="flex flex-col gap-2 w-full text-left">
      {clues.map((clue, i) => (
        <li
          key={i}
          className={`rounded p-3 border-2 ${
            i < shown
              ? "bg-neutral-800 border-[#c24d68]"
              : "bg-neutral-800/50 border-neutral-700 text-neutral-400"
          }`}
        >
          <span className="font-bold mr-2">{i + 1}.</span>
          {i < shown ? (
            clue
          ) : (
            <span className="inline-flex items-center gap-1">
              <Lock size={14} /> Unlocks after {i - shown + 1} more wrong{" "}
              {i - shown + 1 === 1 ? "guess" : "guesses"}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
