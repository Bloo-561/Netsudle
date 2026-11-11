# Netsudle
A daily guessing game for our DnD campaign, Trails Along the Hot Chills / Netsu No Kiseki, in the style of LoLdle, Pokédle and friends.

Built with React, Vite, Tailwind and Framer Motion. Originally based on [Genshindle](https://genshindle.com).

## Game modes

| Mode | Guesses | How it plays |
|---|---|---|
| **Classic** | 10 | Each guess shows which attributes match the answer: gender, region, group, weapon, affiliation, age and debut season. |
| **Splash** | 6 | A zoomed-in piece of character art that zooms out with each wrong guess. |
| **Card** | 6 | A zoomed-in Netsu iF card. Guess whose card it is. |
| **Lore** | 6 | Wiki clues with the name blanked out. Each wrong guess reveals another clue. |

Every mode has:

- **Daily** play: one puzzle a day, the same for everyone, resetting at midnight Eastern time, with a countdown to the next one.
- **Unlimited** play: random rounds, as many as you like, with their own win streak.
- Saved progress, streaks and statistics (in the browser, per mode).
- Optional **hints** that unlock after a few guesses.
- A spoiler-free **share** text and yesterday's answer.
- A **Season I only** switch that hides Season II characters and gives a separate daily puzzle.

## Editing the game

| To change | Edit |
|---|---|
| Characters and their attributes | `src/data/netsu.json` |
| Classic columns (add, remove, reorder) | `COLUMNS` in `src/lib/compare.js` |
| Guess limits, hints, mode text | `src/lib/modes.js` |
| Splash art | `public/assets/splash/` and `src/data/splash.json` |
| Cards | `public/assets/cards/` and `src/data/cards.json` |
| Lore clues | `src/data/lore.json` |
| Daily reset time zone and puzzle #1 date | `src/lib/daily.js` |

Adding a character: add an entry to `netsu.json` with a unique `id`, put the icon in `public/assets/icons/<Group>/`, and set `debut` to `"1"` or `"2"`. The icon's folder name becomes the character's Group in Classic. Optional extras, all keyed by the character's `id`: a small portrait at `public/assets/thumbs/<id>.webp` (the full icon is used if it is missing), an entry in `splash.json`, and clues in `lore.json`.

`weapon` and `affiliation` are comma-separated lists. In Classic a list that matches exactly is green and a list that shares at least one entry is yellow.

Changing the character list reshuffles which puzzle lands on which day, so avoid doing it mid-day once people are playing.

See `NOTES.md` for open questions and characters that still need data.

## Download and run

Needs Node.js 18+ and npm.

```bash
git clone https://github.com/Bloo-561/Netsudle.git
cd netsudle
npm install
npm run dev
```

While running `npm run dev`, add `?day=5` to the address to preview another day's puzzles.

## Contributing

Contributions are welcome! :]

1. Fork the repository and create a new branch from main.
2. For UI changes, screenshots or short clips are encouraged.
3. Make sure the project runs locally with `npm install` and `npm run dev`.
4. Open a Pull Request with a clear description of what you changed and why.

Thanks for helping make Netsudle better! 💜

## License

This is a fan-made project based on Netsu No Kiseki/Trails Along the Hot Chills.
This project is **not affiliated with or endorsed by Falcom**.

This software is licensed under the MIT license.
