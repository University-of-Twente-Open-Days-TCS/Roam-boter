import React, { useState, useEffect } from "react";

import { Grid, Typography, Button } from '@material-ui/core'

import ContentBox from '../layout/ContentBox'

import RoamBotAPI from '../../RoamBotAPI'
import TeamInfo from "./TeamInfo";

const Home = (props) => {

    let logoutHandler = props.handleSubmitLogout

    const [team, setTeam] = useState(null)
    const [ais, setAis] = useState(null)

    useEffect(() => {
        async function updateTeamDetails() {
            let call = await RoamBotAPI.getTeamDetail()
            if (call.ok){
                let json = await call.json()
                setTeam(json)
            }else {
                //TODO: proper handling
                window.alert("Could not get team details")
            }
        }

        async function updateAiList() {
            let call = await RoamBotAPI.getAiList()
            if (call.ok){
                let json = await call.json()
                setAis(json)
            }else {
                //TODO: proper handling
                window.alert("Could not get AI list")
            }
        }

        if (team === null) {
            updateTeamDetails()
        }
        if (ais === null){
            updateAiList()
        }
    })

    const setActiveAI = ai => {
        let call = RoamBotAPI.putActiveAI(ai.pk)
        call.then((response) => {
            // reset states
            if(response.ok){
                setTeam(null)
                setAis(null)
            }else {
                window.alert("Something went wrong...")
            }
        })
    }

    return (
        <ContentBox>
            {team ? <TeamInfo team={team} ais={ais} setActiveAI={setActiveAI}></TeamInfo> : null}
            <Grid container justify="center" style={{marginTop: '1rem'}}>
                <Button onClick={logoutHandler} variant="contained" color="secondary" style={{margin: '0.5rem'}}>Logout</Button>
            </Grid>
        </ContentBox>
    )
}

export default Home