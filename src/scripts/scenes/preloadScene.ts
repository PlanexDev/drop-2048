export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {}

    create() {
        this.scene.start("Freeplay");

        /**
         * This is how you would dynamically import the FreeplayScene class (with code splitting),
         * add the FreeplayScene to the Scene Manager
         * and start the scene.
         * The name of the chunk would be "FreeplayScene.chunk.js
         * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
         */
        // let someCondition = true
        // if (someCondition)
        //   import(/* webpackChunkName: "FreeplayScene" */ "./FreeplayScene").then(FreeplayScene => {
        //     this.scene.add("FreeplayScene", FreeplayScene.default, true)
        //   })
        // else console.log("The FreeplayScene class will not even be loaded by the browser")
    }
}
