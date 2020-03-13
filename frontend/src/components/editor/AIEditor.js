import React, {Component} from "react";

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import RoamBotAPI from '../../RoamBotAPI'

import AIEditorMenu from "./AIEditorMenu";
import AICanvas from './AIEditor/ai_editor.js'

import '../../css/AIEditor.css'


class AIEditor extends Component {

    constructor(props) {
        super(props)

        /** Bind functions and resize */
        this.resize = this.resize.bind(this)
        this.handleAddCondition = this.handleAddCondition.bind(this)
        this.handleAddAction = this.handleAddAction.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount() {
        /** Konva Canvas */
        const canvas = new AICanvas('konva-container')
        this.canvas = canvas
        
        /** add resize listeners */
        window.addEventListener('resize', this.resize)
        window.addEventListener('load', this.resize)
        window.addEventListener('orientationchange', this.resize)
    }


    resize() {
        /** Resizes the Konva Canvas */
        let konvaContainer = document.getElementById('konva-container')
        
        if (konvaContainer !== null){
            let width = konvaContainer.offsetWidth
            console.log(width)
            let height = konvaContainer.offsetHeight
            this.canvas.resizeStage(width, height)
        }
    }

    handleAddCondition() {
        this.canvas.addCondition()
    }

    handleAddAction() {
        this.canvas.addActionNode()
    }

    handleSave() {
        // Save an AI
        let canvas = this.canvas
        let ai = canvas.treeToJson()
        let data = {}
        data.name = "saved-ai"
        data.ai = ai

        // call API
        let response = RoamBotAPI.postAI(data)
        response.then((res) => {
            if(res.ok) {
                alert("AI Saved")
            }else {
                console.error(res)
                alert("An error occurred, see console.")
            }
        })
    }

   
    render() {

        let menuProps = {
            addConditionHandler: this.handleAddCondition,
            addActionHandler: this.handleAddAction,
            saveHandler: this.handleSave
        }


        return (
            <div id="AIEditor">
                <Grid container className="ai-editor-grid">

                    <Grid item xs={9}>
                        <Box id="konva-container" width={1} height={1}></Box>
                    </Grid>

                    <Grid item xs={3}>
                        <AIEditorMenu {...menuProps} />
                    </Grid>
                </Grid>
            </div>
        )
    }
}


export default AIEditor
