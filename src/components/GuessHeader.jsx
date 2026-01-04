export default function GuessHeader() {
  const headers = ["Icon", "Name", "Gender", "Region", "Weapon", "Affiliation", "Age"];

  return (
    <div className="flex gap-1 font-bold text-white">
      {headers.map((header) => {
        let size = "h-12 w-50";
        if (header === "Name") {
          size = "h-12 w-75";
        }
        if (header === "Icon") {
          size = "h-12 w-25";
        }
        return (
          <span key={header} className={`border-5 border-[#974256] flex items-center justify-center bg-[#c24d68] rounded ${size} flex-shrink-0`}>
            {header}
          </span>
        );
      })}
    </div>
  );
}
