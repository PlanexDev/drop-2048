import "phaser";
import DeathScene from "./scenes/deathScene";
import FreeplayScene from "./scenes/freeplayScene";
import PreloadScene from "./scenes/preloadScene";
import TitleScene from "./scenes/titleScene";

const DEFAULT_WIDTH = 1600;
const DEFAULT_HEIGHT = 1200;

const config = {
    type: Phaser.AUTO,
    backgroundColor: "#1f1f1f",
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    },
    scene: [PreloadScene, FreeplayScene, DeathScene, TitleScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 5000 },
        },
    },
};

window.addEventListener("load", () => {
    const game = new Phaser.Game(config);
});

window.addEventListener("error", (ev) => {
    document.write("Error : " + ev.message + "<br><br>");
    document.write("Line number : " + ev.lineno + "<br><br>");
    document.write("File : " + ev.filename);
});
