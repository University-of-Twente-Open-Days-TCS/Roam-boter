import React, {Component} from "react";

import {withStyles} from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import RoamBotAPI from '../../RoamBotAPI'

import AIEditorMenu from "./AIEditorMenu";
import AICanvas from './AIEditor/ai_editor.js'

import {withRouter} from "react-router-dom"
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';


//Component Styling
const styles = theme => ({
    AIEditor: {
        display: 'block',

        height: '100%',
        width: '100%',
        backgroundImage: 'url("/ai_editor_images/Seamless-Circuit-Board-Pattern.svg")',
        backgroundRepeat: 'repeat',
        backgroundSize: '4000px',
    },
    AIEditorGrid: {
        height: '100%'
    },
    AIEditorKonvaGridItem: {
        height: '100%',

        overflow: 'hidden'
    },
    AIEditorMenuGridItem: {
        height: '100%',

        backgroundColor: 'white',
        borderLeft: '1px solid rgba(0, 0, 0, 0.12)'
    }
})

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class AIEditor extends Component {

    constructor(props) {
        super(props)

        /** Bind functions and resize */
        this.resize = this.resize.bind(this)
        this.handleAddCondition = this.handleAddCondition.bind(this)
        this.handleAddAction = this.handleAddAction.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleDelete = this.handleDelete.bind(this)

        this.state = {
            id: null,
            dialogOpen: false,
            ai: null,
            errorAlertOpen: false,
            errorMessage: "",
            successAlertOpen: false
        }
    }


    componentDidMount() {
        /** Konva Canvas */
        const canvas = new AICanvas('konva-container', false)
        this.canvas = canvas

        /** add resize listeners */
        window.addEventListener('resize', this.resize)
        window.addEventListener('load', this.resize)
        window.addEventListener('orientationchange', this.resize)
        this.resize()

        /** Add tree to the canvas if there's a parameter in the URL */
        const id = this.props.match.params.id;
        if (id) {
            this.fetchData(id)
                .then(() => this.setState({id: id}))
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    componentDidUpdate() {
        this.resize()
    }


    resize() {
        /** Resizes the Konva Canvas */
        let konvaContainer = document.getElementById('konva-container')

        if (konvaContainer !== null) {
            let width = konvaContainer.offsetWidth
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
        try {
            let canvas = this.canvas
            canvas.treeToJson()
            
            this.setState({
                dialogOpen: true
            })
        } catch(e) {
            this.setState({
                errorMessage: e.message,
                errorAlertOpen: true,
            })
        }
    }

    saveAI = () => {
        // Save an AI
        let canvas = this.canvas

        try{
            let ai = canvas.treeToJson()
            let data = {}
            data.name = this.state.ai.name
            data.ai = ai

            const response = (this.state.id) ? (RoamBotAPI.putAI(this.state.id, data)) : (RoamBotAPI.postAI(data))

            response.then((res) => {
                if (res.ok) {
                    this.setState({successAlertOpen: true})
                } else {
                    if(res.status === 400){
                        // Bad Request. 
                        let json = res.json()
                        json.then((json) => {
                            this.setState({
                                errorMessage: JSON.stringify(json),
                                errorAlertOpen: true,
                            })
                        })
                    }else {
                        alert("An error occurred")
                    }
                }
            })
        } catch (error) {
            this.setState({
                errorMessage: error.message,
                errorAlertOpen: true,
            })
        }
      
        this.setState({dialogOpen: false})
    }

    handleDelete = () => {
        /** Prompts user and deletes AI if user confirms. */
        let confirmation = window.confirm("Are you sure you want to delete this AI?")
        if(confirmation){
            // check if ai exists
            if (this.state.ai) {
                let call = RoamBotAPI.deleteAI(this.state.ai.pk)
                call.then((response) => {
                    if(response.ok){
                        window.location = "/#/AIList"
                    }else{
                        window.alert(response.json)
                    }
                })
            }else {
                window.location = "/#/AIList"
            }
        }
    }


    handleErrorSnackbarClose = () => {
        this.setState({
            errorAlertOpen: false
        })
    }

    handleSuccessSnackbarClose = () => {
        this.setState({
            successAlertOpen: false
        })
    }

    fetchData = async (id) => {
        // gets AI
        let response = await RoamBotAPI.getAiDetail(id)
        let json = await response.json()
        this.canvas.jsonToTree(JSON.parse(json.ai))
        this.setState({ai: json})
    }

    handleCloseDialog = () => {
        this.setState({
            dialogOpen: false
        })
    }

    handleChangeName = (e) => {
        let ai = {...this.state.ai, name: e.target.value}
        this.setState({ai: ai})
    }

    render() {
        // Get classes
        const {classes} = this.props

        let menuProps = {
            addConditionHandler: this.handleAddCondition,
            addActionHandler: this.handleAddAction,
            saveHandler: this.handleSave,
            deleteHandler: this.handleDelete,
            ai: this.state.ai
        }

        return (
            <div id="AIEditor" className={classes.AIEditor}>
                <Grid container className={classes.AIEditorGrid}>

                    <Grid item xs={9} className={classes.AIEditorKonvaGridItem}>
                        <Box id="konva-container" width={1} height={1}></Box>
                    </Grid>

                    <Grid item xs={3} className={classes.AIEditorMenuGridItem}>
                        <AIEditorMenu {...menuProps} />
                    </Grid>
                </Grid>


                {/** DIALOG */}
                <Dialog open={this.state.dialogOpen} onClose={this.handleCloseDialog}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Enter AI name</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="AI name"
                            type="text"
                            fullWidth
                            value={this.state.ai ? this.state.ai.name : ""}
                            onChange={this.handleChangeName}
                            required={true}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.saveAI} color="primary" disabled={!this.state.ai}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={this.state.errorAlertOpen} autoHideDuration={6000} onClose={this.handleErrorSnackbarClose}>
                    <Alert onClose={this.handleErrorSnackbarClose} severity="error">
                        {this.state.errorMessage}
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.successAlertOpen} autoHideDuration={6000} onClose={this.handleSuccessSnackbarClose}>
                    <Alert onClose={this.handleSuccessSnackbarClose} severity="success">
                        AI saved!
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

/**
 * The component is exported with two hooks.
 * withRouter to allow accessing of url parameters in props
 * withStyles to allow for material-ui's makeStyles to work
 */
export default withRouter(withStyles(styles)(AIEditor))
