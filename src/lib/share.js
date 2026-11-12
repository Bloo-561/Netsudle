import { byId } from "./characters";
import { columnsFor, compare } from "./compare";
import { answersOf } from "./modes";

const SQUARE = { match: "🟩", partial: "🟨", miss: "🟥" };

// Spoiler-free result text for pasting into chat.
export function shareText({ mode, game, puzzle, day, play, season1Only }) {
  const answer = byId[puzzle.char];
  const score = game.status === "won" ? game.guesses.length : "X";
  const title = play === "daily" ? `Netsudle #${day}` : "Netsudle Unlimited";
  const tags = [season1Only ? "Season I" : null, game.hints.length ? `💡${game.hints.length}` : null]
    .filter(Boolean)
    .join(" ");
  const lines = [`${title} · ${mode.name} ${score}/${mode.max}${tags ? " · " + tags : ""}`];
  if (mode.id === "classic") {
    const cols = columnsFor(season1Only);
    for (const id of game.guesses) {
      lines.push(
        cols
          .map((c) => {
            const r = compare(c, byId[id], answer);
            return r.arrow === "up" ? "⬆️" : r.arrow === "down" ? "⬇️" : SQUARE[r.status];
          })
          .join("")
      );
    }
  } else {
    lines.push(game.guesses.map((id) => (answersOf(puzzle).includes(id) ? "🟩" : "🟥")).join(""));
  }
  if (typeof location !== "undefined") lines.push(location.origin + location.pathname);
  return lines.join("\n");
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      el.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
