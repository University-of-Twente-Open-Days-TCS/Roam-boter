import React, {Component} from "react";

import Grid from '@material-ui/core/Grid'


import AIEditorKonva from './AIEditorKonva'
import AIEditorMenu from "./AIEditorMenu";

import '../../css/AIEditor.css'


const AIEditor = (props) => {



   
    return (
        <div id="AIEditor">
            <Grid container className="ai-editor-grid">

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


export default AIEditor
