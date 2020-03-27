import AICanvas from '../editor/AIEditor/ai_editor.js'

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

    componentDidMount() {
        console.log('mount')
    }

    constructor(canvasContainer, gameData, tankId) {
        this.frame = 0
        this.draw = this.draw.bind(this)

        this.canvasContainer = canvasContainer
        this.gameData = gameData

        this.tankId = tankId

        this.prev_path = []

        console.log(this.gameData)
        console.log(this.gameData.frames[this.frame].tanks[tankId].ai_path)


        const canvas = new AICanvas(canvasContainer, true)
        this.canvas = canvas

        this.updateSize()

        //bind functions
        this.start = this.start.bind(this)
        this.draw = this.draw.bind(this)
    }

    fillCanvas(ai) {
        this.canvas.jsonToTree(ai)
    }

    updateSize() {
        this.canvas.resizeStage(this.canvasContainer.offsetWidth, this.canvasContainer.offsetHeight)
    }

    setFrame(frame) {
        this.frame = frame
        if (this.gameData.frames[this.frame]) {
            this.ai_path = this.gameData.frames[this.frame].tanks[this.tankId].ai_path.reverse()
            // console.log(this.ai_path)
        }
        if (this.canvas.startNode._trueArrow && this.prev_path != this.ai_path.toString()) {
            // console.log('difference: redraw          ', this.ai_path.toString(), this.prev_path)
            // console.log('prev_path', this.prev_path)

            // this.draw()
        }
        this.prev_path = this.ai_path.toString()
    }

    start() {
        this.draw()
    }

    draw() {
        // console.log('frame', this.frame)
        // console.log(this.ai_path)
        // console.log('draw')
        // this.canvas.highlightPath(this.ai_path)

        // requestAnimationFrame(this.draw)
    }

    setPath(path) {
        this.canvas.highlightPath(path)
    }
}

export default AIReplayCanvas
