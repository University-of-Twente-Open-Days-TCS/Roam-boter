import React, { useState, useEffect } from "react";

import { Grid, Typography, Button } from '@material-ui/core'

import ContentBox from '../layout/ContentBox'

import RoamBotAPI from '../../RoamBotAPI'
import TeamInfo from "./TeamInfo";

const Home = (props) => {

    let logoutHandler = props.handleSubmitLogout

    const [team, setTeam] = useState(null)

    useEffect(() => {
        async function updateTeamDetails() {
            let call = await RoamBotAPI.getTeamDetail()
            if (call.ok){
                let json = await call.json()
                setTeam(json)
            }else {
                window.alert("Could not get team details")
            }
        }


        if (team === null) {
            // set team
            updateTeamDetails()
        }
    })

    return (
        <ContentBox>
            {team ? <TeamInfo team={team}></TeamInfo> : null}
            <Grid container justify="center">
                <Button onClick={logoutHandler} variant="contained" color="secondary" style={{margin: '0.5rem'}}>Logout</Button>
            </Grid>
        </ContentBox>
    )
}

export default Home