import React, { Component } from 'react'

import Box from '@material-ui/core/Box'
import aiCanvas from './AIEditor/ai_editor'

class AIEditorKonva extends Component {


    componentDidMount() {
        // const canvas = new aiCanvas('konva-container')

        // //Add condition
        // document.getElementById('addCondition').addEventListener(
        //     'click',
        //     function () {
        //         //canvas.addCondition()
        //     },
        //     false
        // );

        // //Add action
        // document.getElementById('addActionNode').addEventListener(
        //     'click',
        //     function () {
        //         //canvas.addActionNode()
        //     },
        //     false
        // );
        // //Add condition
        // document.getElementById('saveAI').addEventListener(
        //     'click',
        //     () => {
        //         // Save AI
        //         let ai = canvas.treeToJson()
        //         let data = {}
        //         data.name = "saved-ai"
        //         data.ai = ai
        //         // call API
        //         let response = RoamBotAPI.postAI(data)
        //         response.then((res) => {
        //             //TODO: Proper error handling
        //             if(res.ok) {
        //                 alert("AI Saved")
        //             }else {
        //                 console.error(res)
        //                 alert("An error occurred, see console.")
        //             }
        //         })
        //     },
        //     false
        // );

        const canvas = new aiCanvas('konva-container')
        this.canvas = canvas
        
        /** Bind resize function and resize */
        this.resize = this.resize.bind(this)
        this.resize()

        /** Listen to resize events */
        window.addEventListener('resize', this.resize)
    }

    resize() {
        /** Resizes the Konva Canvas */
        let konvaContainer = document.getElementById('konva-container')
        
        if (konvaContainer !== null){
            let width = konvaContainer.offsetWidth
            let height = konvaContainer.offsetHeight
            this.canvas.resizeStage(width, height)
        }
    }


    render() {
        return (
            <Box id="konva-container" width={1} height={1}></Box>
        )
    }
}


export default AIEditorKonva