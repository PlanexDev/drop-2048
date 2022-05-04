import { config } from "../config";
import { blockColors } from "./Block";

export default class LetterBlock extends Phaser.GameObjects.Container {
    body: Phaser.Physics.Arcade.Body;
    private static possibleColors = Object.values(blockColors);

    constructor(scene: Phaser.Scene, x: number, y: number, letter: string) {
        super(scene, x, y);

        const color =
            LetterBlock.possibleColors[
                Phaser.Math.Between(0, LetterBlock.possibleColors.length - 1)
            ];

        LetterBlock.possibleColors = LetterBlock.possibleColors.filter(
            (item) => item !== color
        );

        const rectangle = scene.add
            .rectangle(0, 0, 180, 180, color)
            .setOrigin(0);
        const text = scene.add
            .text(90, 90, letter, config.textStyles.titleBlock)
            .setOrigin(0.5);

        this.add(rectangle);
        this.add(text);

        scene.physics.add.existing(this);
        this.body.setSize(180, 180);
    }
}
