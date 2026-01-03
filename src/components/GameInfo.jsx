import Search from "./Search"

export default function GameInfo({limit, streak, prevAnswer, isDisabled, isGuessed, onGuess, onReplay, answer, highScore, artifacts}) {
    return (
        <div className="flex flex-col w-11/12 sm:w-8/12">
            <div className="flex flex-col items-center text-center w-full py-6 sm:py-10 px-4 sm:px-20 bg-blue-900/95 rounded-md">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:p-4 text-center">
                    <div>
                        <img  src="/assets/misc/kokomi.png" alt="Kokomi thinking" className="max-w-32 sm:max-w-64 h-auto"/>
                    </div>
                    <div className="space-y-1 sm:px-15 text-lg sm:text-2xl font-semibold">
                        <h2 className="text-3xl sm:text-5xl font-bold mb-6 sm:mb-10 ">Artifactdle</h2>
                        <h3>Guesses: {limit} / 5</h3>
                        <h3>Win Streak: {streak} 🔥</h3>
                        <h3>High Score: {highScore} 🔥</h3>
                        <h3>Previous Answer: {prevAnswer}</h3>
                    </div>
                </div>
                    <Search onGuess={onGuess} artifacts={artifacts} disabled={isDisabled}/> {/* Search component that calls handleGuess with every entered guess, is disabled when the answer is guessed or the guess limit is exceeded */}
            
            </div>
            {isGuessed && ( // Display a win message and replay button if the answer is guessed
				<div className="bg-green-400/95 w-full py-6 sm:py-10 px-4 sm:px-20 flex flex-col gap-6 sm:gap-10 items-center text-black text-lg sm:text-2xl rounded-md">
					<p>You guessed correctly!</p>
					<button onClick={onReplay} className="border-2 border-black p-4 cursor-pointer"> Play again </button>
				</div>
			)}
			{!isGuessed && limit >= 5 && ( // Display a lose message and replay button if the answer is guessed
				<div className="bg-red-400/95 w-full py-6 sm:py-10 px-4 sm:px-20 flex flex-col gap-6 sm:gap-10 items-center text-black text-lg sm:text-2xl rounded-md">
					<p> You didn't manage to guess the set. The answer was <span className="text-green-300">{answer.name}</span>.{" "} </p>
					<button onClick={onReplay} className="border-2 border-black p-4 cursor-pointer"> Play again </button>
				</div>
			)}
        </div>
    )
}