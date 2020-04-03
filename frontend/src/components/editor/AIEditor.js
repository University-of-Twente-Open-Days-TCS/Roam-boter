import React, {Component} from "react"

import {withStyles} from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import RoamBotAPI from '../../RoamBotAPI'

import AIEditorMenu from "./AIEditorMenu";
import AICanvas from './AIEditor/AIeditor.js'

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
        this.handleSaveAsNew = this.handleSaveAsNew.bind(this)
        this.handleDelete = this.handleDelete.bind(this)

        this.state = {
            id: null,
            ai: null,
            dialog: {
                aiName: "",
                open: false,
            },
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
        // update current AI
        if (this.state.ai) {

            try {
                let aiJson = this.canvas.treeToJson()
                let call = RoamBotAPI.putAI(this.state.ai.pk, {name: this.state.ai.name, ai: aiJson})
                call.then((response) => {
                    if (response.ok){
                        this.setState({successAlertOpen: true})
                    }else {
                        this.setState({errorAlertOpen: true, errorMessage: response.body})
                    }
                })
            } catch (error) {
                this.setState({errorAlertOpen: true, errorMessage: error.message})
            }

        }else {
            this.handleSaveAsNew()
        }   
    }

    handleSaveAsNew() {
        // Open dialog
        this.setState({dialog: {...this.state.dialog, open: true}})
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
                        this.props.history.push('/AIList')
                    }else{
                        window.alert(response.json)
                    }
                })
            }else {
                this.props.history.push('/AIList')
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
        this.setState({ai: json, dialog: {...this.state.dialog, aiName: json.name}})
    }

    handleCancelDialog = () => {
        /**
         * User cancels dialog
         */
        this.setState({
            dialog: {...this.state.dialog, open: false}
        })
        
    }

    handleConfirmDialog = () => {
        /**
         * Called when user confirms dialog
         * Save the AI as a new AI.
         */

        //TODO: Proper error handling when the server returns a 400 status


        this.setState({
            dialog: {...this.state.dialog, open: false}
        })

        let name = this.state.dialog.aiName
        try {
            let ai = this.canvas.treeToJson()
            let call = RoamBotAPI.postAI({name: name, ai: ai})

            call.then((response) => {
                    if(response.ok){
                        //Successfully saved the ai.
                        let json = response.json()
                        json.then((ai) => {
                                this.props.history.push('/AIEditor/'+ai.pk)
                                // update state
                                this.setState({id: ai.pk, ai: ai, dialog: {...this.state.dialog, aiName: ai.name}})
                                this.setState({successAlertOpen: true})
                            }).catch((error) => {
                                console.error(error)
                                window.alert("Something went wrong1...")
                            })

                    } else {
                        response.json().then((data) => {
                            this.setState({errorAlertOpen: true, errorMessage: RoamBotAPI.stringifyError(data)});
                        })
                    }
            }).catch((err) => {console.error(err); window.alert("Something went wrong2...")})
        } catch (error) {
            this.setState({errorAlertOpen: true, errorMessage: error.message})
        }
        
    }

    handleChangeName = (e) => {
        let dialog = {...this.state.dialog, aiName: e.target.value}
        this.setState({dialog: dialog})
    }

    render() {
        // Get classes
        const {classes} = this.props

        let menuProps = {
            addConditionHandler: this.handleAddCondition,
            addActionHandler: this.handleAddAction,
            handleSave: this.handleSave,
            handleSaveAsNew: this.handleSaveAsNew,
            handleDelete: this.handleDelete,
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
                <Dialog open={this.state.dialog.open} onClose={this.handleCancelDialog}
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
                            value={this.state.dialog.aiName ? this.state.dialog.aiName : ""}
                            onChange={this.handleChangeName}
                            required={true}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancelDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleConfirmDialog} color="primary" disabled={!this.state.dialog.aiName}>
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
