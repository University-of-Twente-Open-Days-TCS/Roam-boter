import React, { useState, useEffect } from "react";

import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'



import TeamInfo from './TeamInfo'
import ContentBox from '../layout/ContentBox'
import RoamBotAPI from '../../RoamBotAPI'
import { NavLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '164px',
        margin: 'auto',
    },
    buttonContainerItem: {
        margin: theme.spacing(1, 0),
        width: '100%',
    }
}))


const Home = (props) => {
    const classes = useStyles()

    let logoutHandler = props.handleSubmitLogout

    const [team, setTeam] = useState(null)
    const [ais, setAis] = useState(null)

    useEffect(() => {
        async function updateTeamDetails() {
            let call = await RoamBotAPI.getTeamDetail()
            if (call.ok) {
                let json = await call.json()
                setTeam(json)
            } else {
                //TODO: proper handling
                window.alert("Could not get team details")
            }
        }

        async function updateAiList() {
            let call = await RoamBotAPI.getAiList()
            if (call.ok) {
                let json = await call.json()
                setAis(json)
            } else {
                //TODO: proper handling
                window.alert("Could not get AI list")
            }
        }

        if (team === null) {
            updateTeamDetails()
        }
        if (ais === null) {
            updateAiList()
        }
    })

    const setActiveAI = ai => {
        let call = RoamBotAPI.putActiveAI(ai.pk)
        call.then((response) => {
            // reset states
            if (response.ok) {
                setTeam(null)
                setAis(null)
            } else {
                window.alert(response.body)
                window.alert("Something went wrong...")
            }
        })
    }

    return (
        <div className={classes.root}>

            <ContentBox>
                {team ? <TeamInfo team={team} ais={ais} setActiveAI={setActiveAI} /> : null}

                <div className={classes.buttonContainer}>

                    <NavLink to="/Help" className={classes.buttonContainerItem}>
                        <Button variant="contained" color="primary" style={{width: '100%'}}>Help</Button>
                    </NavLink>

                    <div className={classes.buttonContainerItem}>
                        <Button onClick={logoutHandler} variant="contained" color="secondary" style={{width: '100%'}}>Logout</Button>
                    </div>

                </div>
            </ContentBox>
        </div>
    )
}

export default Home