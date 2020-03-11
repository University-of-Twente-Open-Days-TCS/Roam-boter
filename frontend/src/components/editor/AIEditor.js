import React, {Component} from "react";

import RoamBotAPI from "../../RoamBotAPI"

import aiCanvas from "./AIEditor/ai_editor";
import "./../css/AIEditor.css";

class AIEditor extends Component {
    constructor(props) {
        super(props);
        this.setState({
            ai: {},
            handleSaveAI: this.props.handleSaveAI
        })
    }

    componentDidMount() {
        const canvas = new aiCanvas('container')

        //Add condition
        document.getElementById('addCondition').addEventListener(
            'click',
            function () {
                canvas.addCondition()
            },
            false
        );

        //Add action
        document.getElementById('addActionNode').addEventListener(
            'click',
            function () {
                canvas.addActionNode()
            },
            false
        );
        //Add condition
        document.getElementById('saveAI').addEventListener(
            'click',
            () => {
                // Save AI
                let ai = canvas.treeToJson()
                let data = {}
                data.name = "saved-ai"
                data.ai = ai
                // call API
                let response = RoamBotAPI.postAI(data)
                response.then((res) => {
                    //TODO: Proper error handling
                    if(res.ok) {
                        alert("AI Saved")
                    }else {
                        console.error(res)
                        alert("An error occurred, see console.")
                    }
                })
            },
            false
        );
    }

    render() {
        return (
            <div id="AIEditor">
                <div id="buttons">
                    <input type="button" id="addCondition" value="Add Condition"/>
                    <input type="button" id="addActionNode" value="Add ActionNode"/>
                    <input type="button" id="saveAI" value="Save"/>
                </div>
                <div id="container"></div>
            </div>
        );
    }
}

export default AIEditor
