import React, { useEffect, useState } from 'react'

import {Typography, Grid, Button, Snackbar} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import ContentBox from '../../layout/ContentBox'
import SelectAIDialog from '../SelectAIDialog'
import ActiveAIDialog from "../ActiveAIDialog"

import RoamBotAPI from '../../../RoamBotAPI'
import Alert from "@material-ui/lab/Alert";


const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
    },
    button: {
        margin: '0.5rem 0',
    }
}))

const NewTeamMatch = props => {

    const classes = useStyles()

    let team = props.team

    let [ais, setAis] = useState(null)
    let [selectAIOpen, setSelectAIOpen] = useState(false)
    let [selectedAI, setSelectedAI] = useState(null)
    let [snackbar, setSnackbar] = useState({
        open: false,
        error: false,
        message: ""
    })
    let [activeAIDialogOpen, setActiveAIDialogOpen] = useState(false)

    useEffect(() => {
        async function updateAis() {
            let call = await RoamBotAPI.getAiList()
            let json = await call.json()
            setAis(json)
        }

        if (ais === null) {
            updateAis()
        }
    })

    const playMatch = async () => {
        if (!team.active_ai) {
            setActiveAIDialogOpen(true)
        }

        let call = await RoamBotAPI.postTeamMatch({gamemode: "DM", ai: selectedAI.pk})
        if (call.ok){
            setSnackbar({
                message: "Simulation successful! Match available under Replays",
                error: false,
                open: true
            })
        }else {
            setSnackbar({
                message: "Something went wrong, perhaps there are no other teams with an active AI yet?",
                error: true,
                open: true
            })
        }
    }

    const handleAIListItemClick = (ai) => {
        setSelectedAI(ai)
        setSelectAIOpen(false)
    }

    const handleSetActiveAI = async () => {
        setActiveAIDialogOpen(false)
        let call = await RoamBotAPI.putActiveAI(selectedAI.pk)
        if(!call.ok){
            setSnackbar({
                message: "Could not set active AI",
                error: true,
                open: true
            })
        }
    }

    return (
         <ContentBox>
            <Typography variant="h4" align="center">New Team Match</Typography>
            <Grid container justify="center" spacing={2}>
                <Grid item xs={12} sm={9} md={6}>
                    <div className={classes.wrapper}>

                        <Button className={classes.button} variant="outlined" color={selectedAI ? "primary" : "secondary"} onClick={() => {
                            setSelectAIOpen(true)
                        }}>
                            {selectedAI ? selectedAI.name : "Select AI"}
                        </Button>

                        <Button className={classes.button} type="submit" variant="contained" disabled={!(selectedAI)} color="secondary" onClick={playMatch}>Play</Button>

                        {(ais) ? (<SelectAIDialog ais={ais} open={selectAIOpen} handleClose={() => setSelectAIOpen(false)} handleClick={handleAIListItemClick} />) : "no AIs found"}

                        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})}>
                            <Alert severity={snackbar.error ? "error" : "success"} elevation={6} variant="filled"> {snackbar.message} </Alert>
                        </Snackbar>

                        <ActiveAIDialog open={activeAIDialogOpen} handleDeny={() => setActiveAIDialogOpen(false)} selectedAI={selectedAI} />
                    </div>
                </Grid>
            </Grid>
        </ContentBox>
    )
}

export default NewTeamMatch