export default function Navbar({ onBackgroundChange }) {
  const backgrounds = [
    "/assets/backgrounds/nodkrai.png",
    "/assets/backgrounds/fatui.jpg",
  ];

  const handleChange = (e) => {
    onBackgroundChange(e.target.value);
  };

  return (
    <nav className="w-full bg-neutral-900 sticky z-50 top-0 p-3 sm:p-4 text-gray-200">
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
        <div className="flex flex-row items-center w-full sm:w-auto justify-center sm:justify-start">
          <h2 className="text-xl sm:text-3xl font-semibold">Artifactdle</h2>
        </div>

        <div className="flex flex-row items-center gap-4 sm:ml-auto">
          <div className="flex flex-row items-center gap-2">
            <h2 className="text-sm sm:text-lg">Background:</h2>
            <select onChange={handleChange} className="bg-neutral-800 text-sm sm:text-base px-2 py-1 rounded cursor-pointer">
              <option value={backgrounds[0]}>Nod Krai</option>
              <option value={backgrounds[1]}>Fatui</option>
            </select>
          </div>
        </div>

      </div>
    </nav>
  );
}