import React, { useState } from "react";

import SwipeableViews  from 'react-swipeable-views'

import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Tabs, Tab } from '@material-ui/core'
import ContentBox from "../layout/ContentBox";

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
        <ContentBox
            className={classes.tabPanel}
            role="tabpanel"
            hidden={props.value !== props.index}    
        >
            {props.children}
        </ContentBox>
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
                    Item 1
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