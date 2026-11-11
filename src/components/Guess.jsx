import { motion } from "framer-motion";
import { compare } from "../lib/compare";
import { CELL } from "./GuessHeader";
import Icon from "./Icon";

const COLORS = {
  match: "border-[#0d7835] bg-green-600",
  partial: "border-[#ad8413] bg-yellow-500",
  miss: "border-[#6e3343] bg-[#93374f]",
};
const LABEL = { match: "correct", partial: "partly correct", miss: "wrong" };

export default function Guess({ guess, answer, columns, animate }) {
  const flip = (i) =>
    animate
      ? {
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          transition: { delay: i * 0.25, duration: 0.35, ease: "easeOut" },
        }
      : { initial: false };

  return (
    <div className="flex gap-1 mt-1">
      <motion.span
        {...flip(0)}
        className={`h-24 ${CELL} flex flex-col items-center justify-center text-white text-xs leading-tight rounded bg-neutral-900 overflow-hidden`}
      >
        <Icon char={guess} className="h-16 w-16 object-contain" />
        <span className="px-1 truncate w-full">{guess.name}</span>
      </motion.span>
      {columns.map((col, i) => {
        const r = compare(col, guess, answer);
        return (
          <motion.span
            key={col.key}
            {...flip(i + 1)}
            aria-label={`${col.label}: ${r.text}, ${LABEL[r.status]}${
              r.arrow ? `, answer is ${r.arrow === "up" ? "higher" : "lower"}` : ""
            }`}
            className={`h-24 ${CELL} flex items-center justify-center text-center text-white text-sm leading-tight px-1 rounded border-4 break-words ${COLORS[r.status]}`}
            style={{ transformOrigin: "center" }}
          >
            {r.text}
            {r.arrow === "up" && " ⬆️"}
            {r.arrow === "down" && " ⬇️"}
          </motion.span>
        );
      })}
    </div>
  );
}
