import Block from "../actors/Block";
import { config } from "../config";
import FreeplayScene from "./freeplayScene";

export default class DeathScene extends Phaser.Scene {
    private score: number;

    constructor() {
        super({ key: "Death" });
    }

    init(data: { score: number }) {
        this.score = data.score;
    }

    create() {
        this.add
            .rectangle(
                0,
                0,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000,
                0.4
            )
            .setOrigin(0);

        this.add
            .text(800, 400, "Game Over!", config.textStyles.gameoverText)
            .setOrigin(0.5);
        this.add
            .text(800, 525, "Your Score:", config.textStyles.gameoverText)
            .setOrigin(0.5);
        this.add
            .text(800, 675, `${this.score}`, config.textStyles.gameoverScore)
            .setOrigin(0.5);
    }
}
