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
