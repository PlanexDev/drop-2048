import Block from "../actors/Block";
import LetterBlock from "../actors/LetterBlock";
import { config } from "../config";
import FreeplayScene from "./freeplayScene";

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: "Title" });
    }

    create() {
        // const title = this.add.text(800, 250, "Drop 2048", config.textStyles.title).setOrigin(0.5)
        // this.add.tween({
        //     targets: title,
        //     rotation: {from: Phaser.Math.DegToRad(-15), to: Phaser.Math.DegToRad(15)},
        //     ease: Phaser.Math.Easing.Sine.InOut,
        //     duration: 1000,
        //     repeat: -1,
        //     yoyo: true,
        // })
        const layer1 = this.add.group();
        const layer1Platform = this.add.rectangle(0, 300, 1600, 5, 0xffffff).setOrigin(0)
        this.physics.add.existing(layer1Platform, true)

        const layer1Text = "DROP"
        for (let i = 0; i < 4; i++) {
            layer1.add(new LetterBlock(this, 400+200*i, -200, layer1Text[i], 0xcc0033), true)
        }

        this.physics.add.collider(layer1, layer1Platform)

        const layer2 = this.add.group();
        const layer2Platform = this.add.rectangle(0, 600, 1600, 5, 0xffffff).setOrigin(0)
        this.physics.add.existing(layer2Platform, true)

        const layer2Text = "2048"
        for (let i = 0; i < 4; i++) {
            layer2.add(new LetterBlock(this, 300+250*i, -1600, layer2Text[i], 0xcc0033), true)
        }

        this.physics.add.collider(layer2, layer2Platform)

        const button = this.add.text(800, 800, "Play!", {fontSize: "100px"}).setOrigin(0.5).setPadding(50).setBackgroundColor("#cc6624")

        button.setInteractive().on('pointerdown', () => {
            this.scene.stop()
            this.scene.launch("Freeplay")
        })
    }
}
