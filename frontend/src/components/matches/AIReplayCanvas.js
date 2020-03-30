import AICanvas from '../editor/AIEditor/ai_editor.js'

function arraysMatch (arr1, arr2) {
    if(arr1.length !== arr2.length) {
        return false
    }

    for (var i = 0; i < arr1.length; i++){
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }

    return true
}


class AIReplayCanvas {

    constructor(containerId) {
        const canvas = new AICanvas(containerId, true)
        this.canvas = canvas
        this.containerId = containerId

        this.prevPath = []

        this.setHighlightPath = this.setHighlightPath.bind(this)
        this.fillCanvas = this.fillCanvas.bind(this)
        this.updateSize = this.updateSize.bind(this)
    }

    fillCanvas(ai) {
        this.canvas.jsonToTree(ai)
    }

    updateSize(width, height) {
        /** set width and height of canvas */
        this.canvas.resizeStage(width, height)
    }

    setHighlightPath(path) {
        /**
         * Set highlight path. Defined by a boolean list.
         * Only update if neccesary
         */

        if(arraysMatch(path, this.prevPath)){
            return // no need to redraw paths
        }

        this.prevPath = path
        this.canvas.highlightPath([...path])
    }
}

export default AIReplayCanvas
