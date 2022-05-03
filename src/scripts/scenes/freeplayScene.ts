import Block from "../actors/Block";

export default class FreeplayScene extends Phaser.Scene {
    private graphics: Phaser.GameObjects.Graphics;
    private blocks: Phaser.GameObjects.Group;
    private currentBlock: Block | null;
    private highestLevel = 1;
    private currentBlockShadow: Phaser.GameObjects.Rectangle;
    private score = 0;

    constructor() {
        super({ key: "Freeplay" });
    }

    create() {
        this.physics.world.setFPS(1000);

        this.physics.world.setBounds(350, 70, 900, 1080);

        this.graphics = this.add.graphics();

        this.graphics.lineStyle(5, 0xff00ff, 1.0);
        this.graphics.lineBetween(350, 230, 1250, 230);

        this.currentBlockShadow = this.add
            .rectangle(350, 70, 180, 1130, 0x000000, 0.3)
            .setOrigin(0);

        this.blocks = this.add.group();

        this.currentBlock = this.add.existing(
            new Block(this, this.highestLevel, 0)
        );

        this.physics.add.collider(this.blocks, this.blocks, (b1, b2) => {
            const b1Level = (b1 as Block).level;
            const b2Level = (b2 as Block).level;

            if (b1Level === b2Level && !(b1 as Block).willMerge && !(b2 as Block).willMerge) {
                (b1 as Block).glow(this.time);
                (b2 as Block).glow(this.time)
                this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        (b1 as Block).upgradeLevel();
                        b2.destroy();

                        this.score += 2**(b1 as Block).level;

                        this.highestLevel = Math.max((b1 as Block).level, this.highestLevel);
                    }
                })
            }
        });

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
                        new Block(this, this.highestLevel, xIndex)
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
                if (
                    b1 !== b2 &&
                    b1.x + 180 === b2.x &&
                    b1.y === b2.y &&
                    b1.level === b2.level
                ) {
                    if (!b1.willMerge && !b2.willMerge) {
                        b1.glow(this.time);
                        b2.glow(this.time)
                        this.time.addEvent({
                            delay: 500,
                            callback: () => {
                                b1.upgradeLevel();
                                b2.destroy();
        
                                this.score += 2**b1.level;
        
                                this.highestLevel = Math.max(b1.level, this.highestLevel);
                            }
                        })
                    }
                }
            }

            if (b1.y <= 250 && b1.body.velocity.y < 50) {
                this.scene.pause();
                this.scene.launch("Death", { score: this.score });
            }
        }
    }
}
