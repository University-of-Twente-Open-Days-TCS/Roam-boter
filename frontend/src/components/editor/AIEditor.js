import React, {Component} from "react";

import RoamBotAPI from "../../RoamBotAPI"

import Grid from '@material-ui/core/Grid'


import AIEditorKonva from './AIEditorKonva'
import AIEditorMenu from "./AIEditorMenu";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import '../../css/AIEditor.css'


class AIEditor extends Component {

    render() {
        return (
            <div id="AIEditor">
                <Grid container>

                    <Grid item xs={9}>
                        <AIEditorKonva />
                    </Grid>

                    <Grid item xs={3}>
                        <AIEditorMenu />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default AIEditor
