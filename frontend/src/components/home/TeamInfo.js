import React, { useEffect, useState } from 'react'

import { Typography, Button, Grid } from '@material-ui/core'

import SelectAIDialog from '../matches/SelectAIDialog'

const TeamInfo = (props) => {

    const {team, ais, setActiveAI} = props

    const [dialogState, setDialogState] = useState({selectedAI: null, 
                                                    selectAIOpen: false})
    
    const openAIDialog = () => {
        setDialogState({...dialogState, selectAIOpen: true})
    }

    const handleClick = (ai) => {
        setDialogState({selectedAI: ai, selectAIOpen: false})
        setActiveAI(ai)
    }

    return (
        <Grid container align="center" direction="column">
            <Grid item>
                <Typography variant="h5">Team: <b><i>{team.team_name}</i></b></Typography>
            </Grid>
            <Grid item>
                <Button variant="outlined" color={team.active_ai ? "primary" : "secondary"} onClick={openAIDialog}>{team.active_ai ? "Active AI: "+team.active_ai.name : "Select active AI"}</Button>
            </Grid>
            {(ais) ? (<SelectAIDialog ais={ais} open={dialogState.selectAIOpen} handleClick={handleClick} handleClose={() => setDialogState({...dialogState, selectAIOpen: false})} ></SelectAIDialog>) 
                : 
            ("No ais loaded yet")}
        </Grid>
    )

}

export default TeamInfo