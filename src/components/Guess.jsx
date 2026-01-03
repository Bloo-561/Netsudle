import { motion } from "framer-motion";

export default function Guess({ guess, answer }) {
  const fields = [
    "icon",
    "name",
    "gender",
    "region",
    "weapon",
    "affiliation",
    "age",
  ];
  return (
    <div className="flex gap-1">
      {fields.map((key, i) => {
        const checkField = guess[key] === answer[key]; // Check to see if the guess field matches the answer field, to determine it's span's background colour below
        let displayVal = guess[key];
        if (key === "age") {
          const guessAge = parseInt(guess[key]); // Convert entire string to number
          const answerAge = parseInt(answer[key]); // Convert entire string to number

          if (guessAge > answerAge) {
            displayVal = `${guess[key]} ⬇️`;
          } else if (guessAge < answerAge) {
            displayVal = `${guess[key]} ⬆️`;
          }
          // If equal, displayVal remains unchanged
        }
        const hasMatchingKeyword = (guess, answer, keywords) => {
          const g = guess.toLowerCase();
          const a = answer.toLowerCase();

          return keywords.some((kw) => {
            const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const pattern = new RegExp(`\\b${escaped}\\b`, "i");
            return pattern.test(g) && pattern.test(a);
          });
        };

        const checkKeywords = [
          "blade",
          "thors",
          "class vii",
          "fools",
          "bracer guild",
          "orbal",
          "gun",
          "bow",
          "magic",
          "jaeger",
          "N/A",
          "halberd",
          "liberl",
          "staff",
          "the world's stage",
          "camera",
          "liberl news",
          "journalist",
        ];
        const checkBuffs =
          (key === "weapon" || key === "affiliation") &&
          hasMatchingKeyword(guess[key], answer[key], checkKeywords);

        let size = "h-25 w-50";
        if (key === "name") {
          size = "h-25 w-75";
        }
        if (key === "icon") {
          size = "h-25 w-25";
        }

        let bgColor;
        if (key === "icon") {
          bgColor = "transparent";
        } else if (checkField) {
          bgColor = "bg-green-600";
        } else if (checkBuffs) {
          bgColor = "bg-yellow-500";
        } else {
          bgColor = "bg-red-800";
        }

        return (
          <motion.span
            key={key}
            className={`${size} border border-gray-400 flex items-center justify-center text-white rounded ${bgColor} flex-shrink-0`}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ delay: i * 0.2, duration: 0.2, ease: "easeOut" }}
            style={{ transformOrigin: "center" }}
          >
            {key === "icon" ? (
              <img
                src={guess.icon}
                alt={guess.name}
                className="w-27 h-26 object-contain"
              />
            ) : (
              displayVal
            )}
          </motion.span>
        );
      })}
    </div>
  );
}
