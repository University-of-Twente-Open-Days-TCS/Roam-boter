import React, { useState } from "react";

import SwipeableViews  from 'react-swipeable-views'

import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Tabs, Tab, Typography } from '@material-ui/core'

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
    tabPanel: {
        padding: theme.spacing(2)
    },
    spacer: {
        margin: '1rem 0'
    }
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

const Spacer = props => {
    const classes = useStyles()
    return (
        <div className={classes.spacer}>

        </div>
    )
}

const Help = (props) => {
    const classes = useStyles()

    const [tabIndex, setTabIndex] = useState(0)

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
                    scrollButtons="auto"
                    variant="scrollable"
                    aria-label="tutorial tabs">
                        <Tab label="Introduction" />
                        <Tab label="Decision Tree" />
                        <Tab label="Map" />
                        <Tab label="Replay" />
                        <Tab label="Advanced" />
                </Tabs>
            </AppBar>

            <SwipeableViews 
                axis="x"
                index={tabIndex}
                onChangeIndex={handleTabChangeIndex}
                className={classes.swipeAbleViews}
            >
                <TabPanel value={tabIndex} index={0}>
                    <Typography variant="h5">Welcome to RoamBot-er!</Typography>
                    <Typography className={classes.panelText}>
                                In this workshop you will write Artificial Intelligence for a tank, together with your teammates. 
                                Via a <i>decision tree</i> you will instruct the tank what to do in which situation. 
                                Once you have created an AI you can run it against a bot, a battle which will take place on a <i>map</i>.
                    </Typography>
                    <Spacer />
                    <Typography className={classes.panelText}>
                                Once you have created a nice AI, you can save it and select it as your <i>active AI</i>, 
                                which makes it possible for other teams to play against it. In turn, in the <i>Team vs Team</i> menu you can compete against other teams.
                    </Typography>
                    <Spacer />
                    <Typography>
                    Try to improve your AI through trial and error, discuss with your teammates and feel free to<br></br>
                    <i><b>ask any questions about the workshop, the study of TCS or the student life at the Super Future Guides!</b></i>
                    </Typography>
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

export default Help