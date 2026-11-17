import { motion } from "framer-motion";
import { compare } from "../lib/compare";
import Icon from "./Icon";

const COLORS = {
  match: "border-[#0d7835] bg-green-600",
  partial: "border-[#ad8413] bg-yellow-500",
  miss: "border-[#6e3343] bg-[#93374f]",
};
const LABEL = { match: "correct", partial: "partly correct", miss: "wrong" };

// Phone layout for a Classic guess: the character on top, then one labelled
// tile per column in a grid, so nothing needs sideways scrolling.
export default function GuessCard({ guess, answer, columns, animate }) {
  const flip = (i) =>
    animate
      ? {
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          transition: { delay: i * 0.2, duration: 0.3, ease: "easeOut" },
        }
      : { initial: false };

  return (
    <li className="bg-neutral-800 rounded p-2 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Icon char={guess} className="h-10 w-10 rounded object-contain bg-neutral-900" />
        <span className="font-semibold text-left">{guess.name}</span>
      </div>
      <div className={`grid gap-1 ${columns.length % 3 === 0 ? "grid-cols-3" : "grid-cols-4"}`}>
        {columns.map((col, i) => {
          const r = compare(col, guess, answer);
          return (
            <motion.div
              key={col.key}
              {...flip(i)}
              aria-label={`${col.label}: ${r.text}, ${LABEL[r.status]}${
                r.arrow ? `, answer is ${r.arrow === "up" ? "higher" : "lower"}` : ""
              }`}
              className={`min-h-16 flex flex-col items-center justify-center text-center rounded border-2 px-0.5 py-1 ${COLORS[r.status]}`}
              style={{ transformOrigin: "center" }}
            >
              <span className="text-[10px] uppercase tracking-wide opacity-80 leading-none mb-1">
                {col.label}
              </span>
              <span className="text-xs leading-tight break-words w-full">
                {r.text}
                {r.arrow === "up" && " ⬆️"}
                {r.arrow === "down" && " ⬇️"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </li>
  );
}
