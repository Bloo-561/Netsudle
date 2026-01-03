import { useState } from 'react';
import Navbar from './components/NavBar'
import GameContainer from './components/GameContainer'

export default function App() {
  const [background, setBackground] = useState("/assets/backgrounds/nodkrai.png");

  const changeBackground = (chosenBG) => {
    setBackground(chosenBG);
  };

  return (
    <div className="flex flex-col h-screen w-screen gap-y-5 overflow-y-auto" style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}> {/* Main container */}
    <Navbar onBackgroundChange={changeBackground} />
    <GameContainer />
     </div>
  )
}