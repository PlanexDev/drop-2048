import { config } from "../config";
import { blockColors } from "./Block";

export default class LetterBlock extends Phaser.GameObjects.Container {
    body: Phaser.Physics.Arcade.Body;
    constructor(scene: Phaser.Scene, x: number, y: number, letter: string) {
        super(scene, x, y);

        const colors = Object.values(blockColors);

        const rectangle = scene.add
            .rectangle(0, 0, 180, 180, colors[Phaser.Math.Between(0, colors.length-1)])
            .setOrigin(0);
        const text = scene.add
            .text(90, 90, letter, config.textStyles.titleBlock)
            .setOrigin(0.5);

        this.add(rectangle);
        this.add(text);

        scene.physics.add.existing(this);
        this.body.setSize(180, 180)
    }
}
