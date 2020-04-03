import React, { useState, useEffect } from "react";

import SwipeableViews  from 'react-swipeable-views'

import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Tabs, Tab, Button } from '@material-ui/core'



import TeamInfo from './TeamInfo'
import ContentBox from '../layout/ContentBox'
import RoamBotAPI from '../../RoamBotAPI'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    swipeAbleViews: {
        height: 'auto',
        flexGrow: 1
    },
}))

const TabPanel = props => {
    const classes = useStyles()

    return (
        <div
            className={classes.tabPanel}
            role="tabpanel"
            hidden={props.value !== props.index}
        >
            {props.children}
        </div>
    )
}

const Home = (props) => {
    const classes = useStyles()

    let logoutHandler = props.handleSubmitLogout

    const [tabIndex, setTabIndex] = useState(0)
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
                window.alert(response.body)
                window.alert("Something went wrong...")
            }
        })
    }

    const handleTabChange = (event, newValue) => setTabIndex(newValue)
    const handleTabChangeIndex = index => setTabIndex(index)

    return (
        <div className={classes.root}>
            <AppBar position='static' color="transparent">
                <Tabs 
                    value={tabIndex}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    aria-label="tutorial tabs">
                        <Tab label="Home" />
                        <Tab label="Tab 2" />
                        <Tab label="Tab 3" />
                </Tabs>
            </AppBar>

            <SwipeableViews 
                axis="x"
                index={tabIndex}
                onChangeIndex={handleTabChangeIndex}
                className={classes.swipeAbleViews}
            >
                <TabPanel value={tabIndex} index={0}>
                    <ContentBox>
                        {team ? <TeamInfo team={team} ais={ais} setActiveAI={setActiveAI}/> : null}
                        <div style={{margin: '0.5rem auto', textAlign: 'center'}}>
                            <Button onClick={logoutHandler} variant="contained" color="secondary">Logout</Button>
                        </div>
                    </ContentBox>
                </TabPanel>

                <TabPanel value={tabIndex} index={1}>
                    Item 2
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    Item 3
                </TabPanel>


            </SwipeableViews>
        </div>
    )
}

export default Home