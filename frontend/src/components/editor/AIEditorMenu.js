import React from 'react'

import Button from '@material-ui/core/Button'

let randomFunc = () => {
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
        return
}

const AIEditorMenu = (props) => {
    




    return (
        <div>
            <div id="ai-editor-menu">
                <Button variant="outlined">Add Condition</Button>
                <Button variant="outlined">Add Action</Button>
                <Button variant="outlined">Save</Button>
            </div>
        </div>
    )
}

export default AIEditorMenu;