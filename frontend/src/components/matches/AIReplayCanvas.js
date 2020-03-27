import AICanvas from '../editor/AIEditor/ai_editor.js'

class AIReplayCanvas {

    constructor(containerId) {
        const canvas = new AICanvas(containerId, true)
        this.canvas = canvas
        this.containerId = containerId
        this.prevPath = null
    }

    fillCanvas(ai) {
        this.canvas.jsonToTree(ai)
    }

    updateSize() {
        /** Get width and height of container */
        let container = document.getElementById(this.containerId)
        if (container !== null) {
            let width  = container.offsetWidth
            let height = container.offsetHeight
            this.canvas.resizeStage(width, height)
        }
    }

    setHighlightPath(path) {
        /**
         * Set highlight path. Defined by a boolean list.
         * Only update if neccesary
         */
        if(this.prevPath) {
            if (!this.prevPath.equals(path)){
                this.canvas.highlightPath(path)
            }
        }else {
            this.canvas.highlightPath(path)
        }
    }
}

export default AIReplayCanvas
