import { config } from "../config";

export default class Block extends Phaser.GameObjects.Container {
    body: Phaser.Physics.Arcade.Body;
    /**
     * Exponent of 2
     * For example, if level is 3, value would be 2^3 = 8.
     */
    public level: number;
    public willMerge = false;

    private rectangle: Phaser.GameObjects.Rectangle;
    private text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, highestLevel: number, xIndex?: number) {
        const xPos =
            xIndex !== undefined
                ? xIndex * 180 + 350
                : 350 + Phaser.Math.Between(0, 4) * 180;

        super(scene, xPos, 0);

        this.level = Phaser.Math.Between(1, highestLevel);

        this.rectangle = scene.add
            .rectangle(0, 0, 180, 180, Block.blockToColor(this.level))
            .setOrigin(0);
        this.text = scene.add
            .text(90, 90, `${2 ** this.level}`, config.textStyles.block)
            .setOrigin(0.5);

        this.add(this.rectangle);
        this.add(this.text);

        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.body.setSize(180, 180);

        this.body.setCollideWorldBounds();
    }

    public upgradeLevel() {
        this.level += 1;

        this.text.text = `${2 ** this.level}`;

        this.rectangle.fillColor = Block.blockToColor(this.level);
        this.willMerge = false;
    }

    public glow() {
        this.rectangle.fillColor = Phaser.Display.Color.IntegerToColor(this.rectangle.fillColor).brighten(15).color;
        this.willMerge = true;
    }

    public static blockToColor(level: number) {
        switch (level) {
            case 1:
                return 0xe72900;
            case 2:
                return 0xc56fe5;
            case 3:
                return 0x626997;
            case 4:
                return 0x0c9c19;
            case 5:
                return 0x8066ff;
            case 6:
                return 0x554466;
            case 7:
                return 0x3399ff;
            case 8:
                return 0x1aab7a;
            default:
                return 0x000000;
        }
    }
}
