# Netsudle
A Wordle/Genshindle like game for our DnD Campaign, Trails Along the Hot Chills / Netsu No Kiseki

As they say

Old README.md from Artificatdle

# Artifactdle
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)

Artifactdle is a Wordle-style game for guessing artifact sets from Genshin Impact. You pick an artifact set from the list of sets, and get guess feedback based on the set's region, 2pc and 4pc buffs and release version, with the aim of guessing the randomly selected artifact set within five guesses. Built with React, Tailwind and Framer Motion, the project is heavily inspired by the already exisitng [Genshindle](https://genshindle.com), but for artifact sets.

## Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
  <img width="500" height="auto" alt="Base screen" src="https://github.com/user-attachments/assets/4293d2d4-10fd-4b31-bbb8-2c5aa8b85a7d" />
  <img width="500" height="auto" alt="Guesses" src="https://github.com/user-attachments/assets/518f4829-e679-425e-a209-db874016856d" />
  <img width="500" height="auto" alt="Correct guess" src="https://github.com/user-attachments/assets/9ea6bf31-1123-4e25-972c-a2403931ee1d" />
</div>

## How To Play

1. A random, unknown artifact set is selected.
2. Type and select an artifact set from the given list.
3. The game compares your guess and tells you which attributes (name, region, 2pc buff, 4pc buff & release version) are a match or close match to the answer.
4. Keep guessing until either you guess the correct artifact set or hit 5 guesses.
5. Try to build up a streak of wins and aim for a high score.

## Upcoming Features

- [ ] Daily challenges
- [ ] Honkai Star Rail Relic support
- [ ] Zenless Zone Zero Disc Drive support
- [ ] More Backgrounds


## Download and Run

### Prerequisites

- **Node.js** 18+ and npm
  
### Run Locally
```bash
git clone https://github.com/ThomasFraserDev/artifactdle.git
cd artifactdle
npm install
npm run dev
```

## Contributing

Contributions are welcome! :]

If you’d like to help improve Artifactdle, please follow these steps:
1. Fork the repository and create a new branch from main.
2. For UI changes, screenshots or short clips are encouraged.
3. Make sure the project runs locally:
```bash
npm install
npm run dev
```
4. Open a Pull Request with:
- A clear description of what you changed or added 
- The reasoning behind it

If you’re unsure about an idea or want feedback before starting, feel free to open an issue to discuss it first.

Thanks for helping make Artifactdle better! 💜

## License

This is a fan-made project based on Genshin Impact.  
All game assets and names are property of HoYoverse.  
This project is **not affiliated with or endorsed by HoYoverse**.

This software is licensed under the MIT license.


