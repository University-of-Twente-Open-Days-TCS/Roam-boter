import React, {Component} from "react";
import aiCanvas from "./AIEditor/ai_editor";

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
                this.props.handleSaveAI(canvas.treeToJson());
            },
            false
        );
    }

    render() {
        return (
            <div>
                <div id="container"></div>
                <div id="buttons">
                    <input type="button" id="addCondition" value="Add Condition"/>
                    <input type="button" id="addActionNode" value="Add ActionNode"/>
                    <input type="button" id="saveAI" value="Print JSON"/>
                </div>
            </div>
        );
    }
}

export default AIEditor