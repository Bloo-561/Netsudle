import { SEASONS_ENABLED } from "../lib/features";
import Modal from "./Modal";

export default function HelpModal({ onClose }) {
  return (
    <Modal title="How to play" onClose={onClose}>
      <div className="flex flex-col gap-3 text-base">
        <p>
          Guess the Netsu No Kiseki character. Each mode has one daily puzzle that is the same for
          everyone and resets at midnight Eastern time. Switch to <strong>Unlimited</strong> to keep
          playing random rounds.
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>
            <strong>Classic</strong> (10 guesses): every guess shows which attributes match the
            answer. Green is correct, yellow is partly correct, red is wrong, and the age arrow
            points towards the answer.
          </li>
          <li>
            <strong>Splash</strong> (6 guesses): a zoomed-in piece of character art that zooms out
            with each wrong guess.
          </li>
          <li>
            <strong>Card</strong> (6 guesses): a zoomed-in Netsu iF card or Memory Order. Guess who is on it. If two people are on the card, either one counts.
          </li>
          <li>
            <strong>Lore</strong> (6 guesses): wiki clues with the name blanked out. Each wrong
            guess reveals another clue. Contains story spoilers.
          </li>
        </ul>
        <p>
          <strong>Hints</strong> unlock after a few guesses and are optional. Used hints show up in
          your shared result as 💡.
        </p>
        {SEASONS_ENABLED && (
        <p>
          <strong>Season I only</strong> hides Season II characters everywhere and gives you a
          separate, spoiler-safe daily puzzle with its own streak.
        </p>
        )}
        <p className="text-sm text-neutral-400">
          Progress and streaks are saved in this browser only.
        </p>
      </div>
    </Modal>
  );
}
