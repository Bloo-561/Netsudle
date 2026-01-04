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
          "axe",
          "septian church",
          "khemia corp",
          "sss",
          "spear",
          "informant",
          "eternity",
          "crossbell",
          "crossbell police",
          "maid",
          "prophetic arms",
          "unknown",
          "crossbell government",
          "calvard",
          "epstein foundation",
          "aragon",
          "lance family",
          "celdic",
          "sales",
          "erebonian government",
          "ironbloods",
          "imperial army",
          "rmp",
          "intelligence division",
          "shield",
          "cross family",
          "nord village",
          "fists",
          "gunblade",
          "gauntlet",
          "royal family",
          "gralsritter",
          "leman",
          "witch",
          "rosenberg studio",
          "rapier",
          "verne company",
          "st. astraia",
          "observatorium",
          "richter family",
          "trista",
          "heimdallr",
          "phantom choir",
          "parm",
          "saint-arkh",
          "witch of origin",
          "witch ally",
          "han dynasty",
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
          bgColor = "#transparent";
        } else if (checkField) {
          bgColor = "border-5 border-[#0d7835] bg-green-600";
        } else if (checkBuffs) {
          bgColor = "border-5 border-[#ad8413] bg-yellow-500";
        } else {
          bgColor = "border-5 border-[#6e3343] bg-[#93374f]";
        }

        return (
          <motion.span
            key={key}
            className={`${size} flex items-center justify-center text-white rounded ${bgColor} flex-shrink-0`}
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
