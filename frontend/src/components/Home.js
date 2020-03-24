import React, { useState, useEffect } from "react";

import { Grid, Typography } from '@material-ui/core'

import ContentBox from './layout/ContentBox'

import RoamBotAPI from '../RoamBotAPI'

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
            <Grid>
                <Typography>{team ? team.team_name : null}</Typography>
            </Grid>
        </ContentBox>
    )
}

export default Home