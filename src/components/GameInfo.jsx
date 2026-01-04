import { useState, useEffect } from "react";
import Search from "./Search";

export default function GameInfo({
  limit,
  streak,
  prevAnswer,
  prevAnswerImage,
  isDisabled,
  isGuessed,
  onGuess,
  onReplay,
  answer,
  highScore,
  artifacts,
}) {
  const [randomLogo, setRandomLogo] = useState("/assets/misc/kokomi.png");
  const [logoKey, setLogoKey] = useState(0); // Key to force re-render

  const generateRandomLogo = () => {
    const logos = [
      "Icon1.png",
      "Icon2.png",
      "Icon3.png",
      "Icon4.png",
      "Icon5.png",
      "Icon6.png",
      "Icon7.png",
      "Icon8.png",
    ];

    const randomIndex = Math.floor(Math.random() * logos.length);
    const selectedLogo = logos[randomIndex];
    return `/assets/misc/${selectedLogo}`;
  };

  useEffect(() => {
    const logoPath = generateRandomLogo();

    // Preload the image
    const img = new Image();
    img.src = logoPath;

    img.onload = () => {
      setRandomLogo(logoPath);
    };

    img.onerror = () => {
      console.log("Random logo failed to load, using fallback");
    };
  }, [logoKey]); // Re-run when logoKey changes

  const handleReplay = () => {
    // Change the key to trigger a new random logo
    setLogoKey((prev) => prev + 1);
    // Call the original onReplay function
    onReplay();
  };

  return (
    <div className="flex flex-col w-11/12 sm:w-8/12">
      <div className="flex flex-col items-center text-center w-full py-6 sm:py-10 px-4 sm:px-20 bg-[#93374f]/95 rounded-md">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:p-4 text-center">
          {/* Random logo */}
          <img
            key={logoKey}
            src={randomLogo}
            alt="Random logo"
            className="max-w-32 sm:max-w-64 h-auto"
          />

          <div className="space-y-1 sm:px-15 text-lg sm:text-2xl font-semibold">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 sm:mb-10 ">
              Netsudle
            </h2>
            <h3>Guesses: {limit} / 10</h3>
            <h3>Win Streak: {streak} 🔥</h3>
            <h3>High Score: {highScore} 🔥</h3>
            <h3 className="flex items-center gap-2">
              Previous Answer: {prevAnswer}
              {/* Show image icon next to previous answer */}
              <img
                src={prevAnswerImage}
                alt={`${prevAnswer}`}
                className="h-6 w-6"
              />
            </h3>
          </div>
        </div>
        <Search onGuess={onGuess} artifacts={artifacts} disabled={isDisabled} />
      </div>
      {isGuessed && (
        <div className="bg-green-400/95 w-full py-6 sm:py-10 px-4 sm:px-20 flex flex-col gap-6 sm:gap-10 items-center text-black text-lg sm:text-2xl rounded-md">
          <p>You guessed correctly!</p>
          <button
            onClick={handleReplay}
            className="border-2 border-black p-4 cursor-pointer"
          >
            {" "}
            Play again{" "}
          </button>
        </div>
      )}
      {!isGuessed && limit >= 10 && (
        <div className="bg-[#7e1919]/60 w-full py-6 sm:py-10 px-4 sm:px-20 flex flex-col gap-6 sm:gap-10 items-center text-white text-lg sm:text-2xl rounded-md">
          <p> Game Over! The character was {answer.name} </p>
          <button onClick={handleReplay} className="bg-[#3a3a3a] w-125 p-4 cursor-pointer rounded-md text-white [text-shadow:2px_2px_black]">Restart</button>
        </div>
      )}
    </div>
  );
}
