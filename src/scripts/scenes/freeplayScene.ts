import Block from "../actors/Block";
import { config } from "../config";

export default class FreeplayScene extends Phaser.Scene {
    private blocks: Phaser.GameObjects.Group;
    private currentBlock: Block | null;
    private highestValue = 1;
    private currentBlockShadow: Phaser.GameObjects.Rectangle;
    private score = 0;
    private scoreboard: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "Freeplay" });
    }

    create() {
        this.initPhysics();

        this.initGraphics();

        this.currentBlockShadow = this.add
            .rectangle(350, 250, 180, 980, 0x000000, 0.3)
            .setOrigin(0);

        this.blocks = this.add.group();

        this.scoreboard = this.add.text(
            800,
            50,
            "0",
            config.textStyles.scoreboard
        );

        this.physics.add.collider(this.blocks, this.blocks);

        this.currentBlock = this.add.existing(
            new Block(this, this.highestValue, 0)
        );

        this.input.on("pointerup", (pointer) => {
            const { x, y } = pointer;
            if (
                x < 350 ||
                x > 1250 ||
                y < 250 ||
                y > 1150 ||
                !this.currentBlock
            )
                return;

            const xIndex = Math.floor((x - 350) / 180);

            this.currentBlock.body.setAllowGravity();
            this.currentBlock.x = xIndex * 180 + 350;

            this.currentBlockShadow.x = this.currentBlock.x;

            this.blocks.add(this.currentBlock);
            this.currentBlock = null;

            this.time.addEvent({
                delay: 250,
                callback: () => {
                    this.currentBlock = this.add.existing(
                        new Block(this, this.highestValue, xIndex)
                    );

                    this.currentBlockShadow.x = this.currentBlock.x;
                },
            });
        });

        this.input.on("pointermove", (pointer) => {
            const { x, y } = pointer;
            if (
                x < 350 ||
                x > 1250 ||
                y < 250 ||
                y > 1150 ||
                !this.currentBlock
            )
                return;

            const xPos = Math.floor((x - 350) / 180) * 180 + 350;

            this.currentBlock.x = xPos;
            this.currentBlockShadow.x = xPos;
        });
    }

    update() {
        for (const b1 of this.blocks.getChildren() as Block[]) {
            for (const b2 of this.blocks.getChildren() as Block[]) {
                if (b1.canMergeWith(b2)) {
                    b1.mergeWith(b2, this.time, this.incrementScore.bind(this));
                }
            }

            if (b1.value > this.highestValue) {
                this.highestValue = b1.value;
            }

            if (b1.y <= 250 && b1.body.velocity.y < 25) {
                this.scene.pause();
                this.scene.launch("Death", { score: this.score });
            }
        }
    }

    private incrementScore(score: number) {
        this.score += score;

        this.scoreboard.text = `${this.score}`;
    }

    private initPhysics() {
        this.physics.world.setFPS(1000);

        this.physics.world.setBounds(350, 70, 900, 1080);
    }

    private initGraphics() {
        const graphics = this.add.graphics();

        graphics.lineStyle(5, 0xff00ff, 1.0);
        graphics.lineBetween(350, 430, 1250, 430);
    }
}
