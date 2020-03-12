import React, {Component} from "react";

import RoamBotAPI from "../../RoamBotAPI"

import Grid from '@material-ui/core/Grid'

import AIEditorKonva from './AIEditorKonva'
import AIEditorMenu from "./AIEditorMenu";

import '../../css/AIEditor.css'


class AIEditor extends Component {


    componentDidMount() {
        return
    }

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
