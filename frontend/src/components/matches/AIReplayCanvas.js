class AIReplayCanvas {

    BLOCK_COLORS = [
        "#FFFFFF",    // 0: EMPTY
        "#000000",    // 1: RESERVED
        "#000000",    // 2: RESERVED
        "#000000",    // 3: RESERVED
        "#000000",    // 4: RESERVED
        "#000000",    // 5: WALL
        "#000000",    // 6: RESERVED
        "#000000",    // 7: RESERVED
        "#00FF00",    // 8: HEAL
        "#FF0000",    // 9: FLAG
        "#FFFF00",    // 10: HILL
        "#0000FF",    // 11: SPAWN
        "#000000",    // 12: RESERVED
        "#000000",    // 13: RESERVED
    ]

    constructor(canvasContainer, gameData) {
        this.frame = 0
        this.draw = this.draw.bind(this)
        this.tankSprite = new Image();
        this.tankSprite.src = "simulation_images/tank_body.png";

        this.tankTurretSprite = new Image();
        this.tankTurretSprite.src = "simulation_images/tank_turret.png"

        this.canvasContainer = canvasContainer
        this.gameData = gameData



        let canvas = document.createElement('canvas')
        this.canvas = canvas
        this.updateSize()
        // append canvas to div
        canvasContainer.appendChild(canvas)

        this.ctx2d = this.canvas.getContext("2d");

        //bind functions
        this.start = this.start.bind(this)
        this.draw = this.draw.bind(this)
    }

    getCanvasSize(){
        /**
         * Calculates the height of the canvas.
         * The canvas fills the width of canvasContainer and scales the height according to the level.
         */

        let width = this.canvasContainer.offsetWidth
        let levelHeight = this.gameData.level.length
        let levelWidth = this.gameData.level[0].length

        let aspectRatio = levelWidth / levelHeight
        let height = width / aspectRatio
        return {width, height}
    }


    updateSize() {
        let {width, height} = this.getCanvasSize()
        this.canvas.width = width
        this.canvas.height = height
    }

    setFrame(frame) {
        this.frame = frame
    }

    getFramesLength() {
        return this.gameData.frames.length
    }

    start() {
        this.draw()
    }

    draw() {
        // draw each frame
    }
}

export default AIReplayCanvas
