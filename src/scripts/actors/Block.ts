import { config } from "../config";
import FreeplayScene from "../scenes/freeplayScene";

export const blockColors = {
    2: 0xe72900,
    4: 0xc56fe5,
    8: 0x626997,
    16: 0x0c9c19,
    32: 0x8066ff,
    64: 0x554466,
    128: 0x3399ff,
    256: 0x1aab7a,
    512: 0x468499,
    1024: 0x0e2f44,
    2048: 0x794044,
    4096: 0x523944,
    8192: 0x7c12db,
    16284: 0xa45acb,
    32768: 0x023514,
};

export default class Block extends Phaser.GameObjects.Container {
    body: Phaser.Physics.Arcade.Body;
    /**
     * Exponent of 2
     * For example, if value is 3, actual value would be 2^3 = 8.
     */
    private _value: number;
    public willMerge = false;

    private static blockWeights = [0, 75, 20, 10, 7.5, 5, 2.5, 1, 0.5, 0.25, 0.1]

    private rectangle: Phaser.GameObjects.Rectangle;
    private text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, highestValue: number, xIndex?: number) {
        const xPos =
            xIndex !== undefined
                ? xIndex * 180 + 350
                : 350 + Phaser.Math.Between(0, 4) * 180;

        super(scene, xPos, 250);

        const totalWeight = Block.blockWeights.slice(0, Math.log2(highestValue)).reduce((a, b) => a+b);
        const number = Phaser.Math.Between(1, totalWeight)
        let currentTotal = 0;
        let i: number;

        for (i = 1; i < Block.blockWeights.length; i++) {
            currentTotal += Block.blockWeights[i]
            if (currentTotal > number) {
                break;
            }
        }

        this._value = i;

        this.rectangle = scene.add
            .rectangle(0, 0, 180, 180, Block.blockToColor(this.value))
            .setOrigin(0);
        this.text = scene.add
            .text(90, 90, `${this.value}`, config.textStyles.block)
            .setOrigin(0.5);

        this.add(this.rectangle);
        this.add(this.text);

        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.body.setSize(180, 180);

        this.body.setCollideWorldBounds();
    }

    public canMergeWith(other: Block) {
        const sameValue = other.value === this.value;
        const blocksAreStationary =
            this.body.velocity.y < 25 && other.body.velocity.y < 25;
        const willMerge = this.willMerge || other.willMerge;

        const nextToOther = Math.abs(this.x + 180 - other.x) < 5;
        const sameY = Math.abs(this.y - other.y) < 5;
        const nextTo = nextToOther && sameY;

        const aboveOther = Math.abs(this.y + 180 - other.y) < 5;
        const sameX = Math.abs(this.x - other.x) < 5;
        const above = aboveOther && sameX;

        return (
            sameValue && blocksAreStationary && !willMerge && (nextTo || above)
        );
    }

    public mergeWith(
        other: Block,
        clock: Phaser.Time.Clock,
        incrementScore: (number) => void
    ) {
        this.glow(clock);
        other.glow(clock);

        clock.addEvent({
            delay: 500,
            callback: () => {
                this.upgradeValue();

                other.destroy();

                incrementScore(this.value);
            },
        });
    }

    private upgradeValue() {
        this._value += 1;

        this.text.text = `${this.value}`;

        this.rectangle.fillColor = Block.blockToColor(this.value);
        this.willMerge = false;
    }

    private glow(clock: Phaser.Time.Clock) {
        clock.addEvent({
            repeat: 25,
            delay: 5,
            callback: () => {
                this.rectangle.fillColor = Phaser.Display.Color.IntegerToColor(
                    this.rectangle.fillColor
                ).brighten(1).color;
            },
        });
        this.willMerge = true;
    }

    public get value() {
        return 2 ** this._value;
    }

    public static blockToColor(value: number) {
        return blockColors[value] ?? 0x000000;
    }
}
