import React, {Component} from "react";

import RoamBotAPI from "../../RoamBotAPI"

import aiCanvas from "./AIEditor/ai_editor";

import "../../css/AIEditor.css";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

class AIEditor extends Component {
  
    constructor() {
        super();
        this.state = {
            ai: {},
            openDialogue: false,
            canvas: null,
            formValue: ""
        };
    }

    handleDialogueOpen = () => {
        this.setState({openDialogue: true})
    }

    handleDialogueClose = () => {
        this.setState({openDialogue: false})
    }

    handleSaveButton() {
        // Show dialogue to enter name
        this.handleDialogueOpen()
    }

    saveAI = () => {
        // Save AI
        let ai = this.state.canvas.treeToJson()
        let data = {}
        data.name = this.state.formValue
        data.ai = ai
        // call API
        let response = RoamBotAPI.postAI(data)
        response.then((res) => {
            //TODO: Proper error handling
            if (res.ok) {
                alert("AI Saved")
            } else {
                console.error(res)
                alert("An error occurred, see console.")
            }
        })
        this.handleDialogueClose()

    }

    componentDidMount() {
        const canvas = new aiCanvas('container');

        this.setState({canvas: canvas})

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
                this.handleSaveButton()
            },
            false
        );
    }

    _handleTextFieldChange = e => {
        this.setState({
            formValue: e.target.value
        });
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
                <Dialog open={this.state.openDialogue} onClose={this.handleDialogueClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Enter AI name</DialogTitle>
                    <DialogContent>
                        {/*<DialogContentText>*/}
                        {/*    Please enter*/}
                        {/*</DialogContentText>*/}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="email"
                            fullWidth
                            value={this.state.formValue}
                            onChange={this._handleTextFieldChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogueClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.saveAI} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default AIEditor
