import { useState } from "react";
import Navbar from "./components/NavBar";
import GameContainer from "./components/GameContainer";
import StatsModal from "./components/StatsModal";
import HelpModal from "./components/HelpModal";
import { MODES, modeById } from "./lib/modes";
import { useStore } from "./lib/store";
import { useClock, useHashMode } from "./lib/hooks";

export default function App() {
  const state = useStore();
  const clock = useClock();
  const [modeId, setModeId] = useHashMode(
    MODES.map((m) => m.id),
    "classic"
  );
  const [modal, setModal] = useState(null);
  const mode = modeById[modeId];

  return (
    <div
      className="flex flex-col h-screen w-screen gap-y-5 overflow-y-auto pb-10"
      style={{
        backgroundImage: `url(${state.settings.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar
        modeId={modeId}
        onMode={setModeId}
        day={clock.day}
        onStats={() => setModal("stats")}
        onHelp={() => setModal("help")}
      />
      <GameContainer key={modeId} mode={mode} clock={clock} onMode={setModeId} />
      {modal === "stats" && (
        <StatsModal mode={mode} day={clock.day} onClose={() => setModal(null)} />
      )}
      {modal === "help" && <HelpModal onClose={() => setModal(null)} />}
    </div>
  );
}
