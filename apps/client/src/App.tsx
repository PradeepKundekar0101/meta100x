import { useEffect } from "react";
import Preloader from "./scenes/Preloader";
import GardenScene from "./scenes/Scene";
import { Outlet } from "react-router-dom";
function App() {
  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import("phaser");
      new Phaser.Game({
        type: Phaser.AUTO,
        title: "Test",
        parent: "game-content",
        width: 750,
        height: 500,
        pixelArt: true,
        scale: {
          zoom: 1,
        },
        scene: [Preloader, GardenScene],
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0, x: 0 },
            debug: true,
          },
        },
        backgroundColor: "#000",
      });
    }
    initPhaser();
    return () => {};
  }, []);

  return (
    <>
    <Outlet/>
      {/* <button>Add</button>
      <div id="game-content" key={"game-content"}></div> */}
    </>
  );
}

export default App;
