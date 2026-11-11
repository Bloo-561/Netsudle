export const CELL = "w-28 sm:w-32 flex-shrink-0";

export default function GuessHeader({ columns }) {
  return (
    <div className="flex gap-1 font-bold text-white">
      {[{ key: "character", label: "Character" }, ...columns].map((col) => (
        <span
          key={col.key}
          className={`border-4 border-[#974256] flex items-center justify-center bg-[#c24d68] rounded h-12 ${CELL}`}
        >
          {col.label}
        </span>
      ))}
    </div>
  );
}
