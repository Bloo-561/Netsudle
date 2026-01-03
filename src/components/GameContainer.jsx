import { useState, useEffect } from "react";
import GameInfo from "./GameInfo";
import Guess from "./Guess";
import GuessHeader from "./GuessHeader";
import artifacts from "../data/netsu.json";

export default function GameContainer() {
  const [guesses, setGuesses] = useState([]); // Initialise list of guesses
  const [answer, setAnswer] = useState(
    artifacts[Math.floor(Math.random() * artifacts.length)]
  ); // Generate the answer
  const [prevAnswer, setPrevAnswer] = useState("N/A"); // Initialise previous answer
  const [prevAnswerImage, setPrevAnswerImage] = useState(""); // Initialise the image of the previous answer
  const [limit, setLimit] = useState(0); // Initialise guess limit
  const [streak, setStreak] = useState(0); // Initialise win streak
  const [highScore, setHighScore] = useState(streak); //Initialise high score
  const isGuessed = guesses.some((g) => g.name === answer.name); // Check for if the word has been guessed

  useEffect(() => {
    // Update the high score whenever the streak is updated, and is higher than the current high score
    if (streak > highScore) {
      setHighScore(streak);
    }
  }, [streak, highScore]);

  const handleGuess = (artifact) => {
    if (isGuessed || limit >= 10)
      // Check for if the artifact set has been guessed or the limit of guesses has been exceeded
      return;
    if (guesses.find((g) => g.name === artifact.name))
      // Don't add the new guess to the list of guesses if it's name is already within the list
      return;
    if (artifact.name === answer.name) setStreak((prev) => prev + 1);
    // Increment the win streak if the guess was correct
    else if (limit + 1 >= 10) setStreak(0); // If the artifact set isn't guessed, reset the streak
    setGuesses((prev) => [artifact, ...prev]); // Otherwise, add the new guess to the start of the list
    setLimit((prev) => prev + 1); // Increment the limit counter
  };

  const handleReplay = () => {
    // Resets the guesses, answer and guess limit in order to replay the game
    setGuesses([]);
    setPrevAnswer(answer.name);
    setPrevAnswerImage(answer.icon);
    setAnswer(artifacts[Math.floor(Math.random() * artifacts.length)]);
    setLimit(0);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center gap-y-5">
      <GameInfo
        limit={limit}
        streak={streak}
        prevAnswer={prevAnswer}
        prevAnswerImage={prevAnswerImage}
        isDisabled={isGuessed || limit >= 10}
        isGuessed={isGuessed}
        onGuess={handleGuess}
        onReplay={handleReplay}
        answer={answer}
        highScore={highScore}
        artifacts={artifacts}
      />
      <div className="flex flex-col gap-1 mt-4 p-2 rounded bg-neutral-800 w-11/12 sm:w-auto overflow-x-auto sm:overflow-visible">
        {" "}
        {/* Div containing all the current guesses and the guess headings */}
        <div className="min-w-min">
          <GuessHeader />
          {guesses.map((guess, index) => (
            <Guess key={limit - index} guess={guess} answer={answer} />
          ))}
        </div>
      </div>
    </div>
  );
}
