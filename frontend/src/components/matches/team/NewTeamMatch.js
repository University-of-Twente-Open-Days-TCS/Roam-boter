import React, { useEffect, useState } from 'react'

import {Typography, Grid, Button, Snackbar} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import ContentBox from '../../layout/ContentBox'
import SelectAIDialog from '../SelectAIDialog'
import ActiveAIDialog from "../ActiveAIDialog"

import RoamBotAPI from '../../../RoamBotAPI'
import Alert from "@material-ui/lab/Alert";
import {NavLink, useParams} from "react-router-dom";

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
    let { preSelectedAI } = useParams()

    let [ais, setAis] = useState(null)
    let [team, setTeam] = useState(null)


    let [selectAIOpen, setSelectAIOpen] = useState(false)
    let [selectedAI, setSelectedAI] = useState(null)
    let [snackbar, setSnackbar] = useState({
        open: false,
        error: false,
        message: "",
        url: null
    })
    let [activeAIDialogOpen, setActiveAIDialogOpen] = useState(false)


    async function updateTeam() {
        let call = await RoamBotAPI.getTeamDetail()
        let json = await call.json()
        setTeam(json)
    }

    async function updateAis(aiPk) {
        let call = await RoamBotAPI.getAiList()
        let json = await call.json()

        //find ai and set as selected
        if(aiPk){
            let ai = null
            for (let i = 0; i < json.length; i++){
                let curAi = json[i]
                if(curAi.pk === aiPk){
                    ai = curAi
                }
            }
            setSelectedAI(ai)
        }

        setAis(json)
    }

    useEffect(() => {
        // If ai list not set get ai's
        if (ais === null) {
            if(preSelectedAI){
                let aiPk = parseInt(preSelectedAI)
                updateAis(aiPk)
            }else {
                updateAis()
            }
        }

        // If team not set get team details
        if (team === null){
            updateTeam()
        }
    })

    const playMatch = async () => {
        if (!team.active_ai) {
            setActiveAIDialogOpen(true)
        }

        let call = await RoamBotAPI.postTeamMatch({gamemode: "DM", ai: selectedAI.pk})
        if (call.ok){
            setSnackbar({
                message: "Simulation successful, click here to view replays",
                error: false,
                open: true,
                url: "/TeamMatchHistory"
            })
        }else {
            let error = await call.json()
            let message = (call.status === 423) ? error.error : "Something went wrong, please contact the supervisors"

            setSnackbar({
                message: message,
                error: true,
                open: true,
                url: null
            })
        }
    }

    const handleAIListItemClick = (ai) => {
        setSelectedAI(ai)
        setSelectAIOpen(false)
    }

    return (
         <ContentBox>
            <Typography variant="h4" align="center">Play vs Peers</Typography>
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

                        <NavLink to={snackbar.url ? snackbar.url : '/'} onClick={e => snackbar.url ? null : e.preventDefault()}>
                            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})}>
                                <Alert severity={snackbar.error ? "error" : "success"} elevation={6} variant="filled"> {snackbar.message} </Alert>
                            </Snackbar>
                        </NavLink>

                        <ActiveAIDialog open={activeAIDialogOpen} handleClose={() => setActiveAIDialogOpen(false)} selectedAI={selectedAI} activeAISetCallback={() => updateTeam()}/>
                    </div>
                </Grid>
            </Grid>
        </ContentBox>
    )
}

export default NewTeamMatch