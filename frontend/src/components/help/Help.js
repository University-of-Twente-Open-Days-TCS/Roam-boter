import React, { useState } from "react";

import SwipeableViews  from 'react-swipeable-views'

import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Tabs, Tab, Typography, Grid } from '@material-ui/core'
import { Spa } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    swipeAbleViews: {
        height: 'auto',
        flexGrow: 1,
    },
    tabPanel: {
        padding: theme.spacing(2),
    },
    spacer: {
        margin: '1rem 0'
    },
    panelText: {
        margin: theme.spacing(1, 0),
        wordWrap: 'break-word',
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
            <Grid container justify="center">
                <Grid item xs={12} md={6}>
                    {props.children}
                </Grid>
            </Grid>
        </div>
    )
}

const PanelText = props => {
    const classes = useStyles()
    return (
        <Typography className={classes.panelText} {...props}>
        </Typography>
    )
}

const PanelImage = props => {
    const classes = useStyles()
    return (
        <div>TO BE IMAGE</div>
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
                    <PanelText variant="h5">Welcome to RoamBot-er!</PanelText>
                    <PanelText>
                                In this workshop you will write Artificial Intelligence for a tank, together with your teammates. 
                                Via a <i>decision tree</i> you will instruct the tank what to do in which situation. 
                                Once you have created an AI you can run it against a bot, a battle which will take place on a <i>map</i>.
                    </PanelText>
                    <PanelText>
                                Once you have created a nice AI, you can save it and select it as your <i>active AI</i>, 
                                which makes it possible for other teams to play against it. In turn, in the <i>Team vs Team</i> menu you can compete against other teams.
                    </PanelText>
                    <PanelText>
                                Try to improve your AI through trial and error, discuss with your teammates and feel free to<br></br>
                                <i><b>ask any questions about the workshop, the study of TCS or the student life at the Super Future Guides!</b></i>
                    </PanelText>
                </TabPanel>


                <TabPanel value={tabIndex} index={1}>
                    <PanelText variant="h5">Decision Trees</PanelText>
                    <PanelText>
                                The AI you write for the tank is in the format of a decision tree. Your tools for this are <i>conditions</i> and <i>actions</i>. 
                                Every game tick, the tank will evaluate the decision tree, starting from the top. If the encountered condition is true, 
                                it will follow the path from the green circle, otherwise it will follow the false-path, from the red circle. 
                                Eventually it will end up at an action-node, and perform the action(s) that it contains.
                    </PanelText>
                    <PanelImage>

                    </PanelImage>
                    <PanelText>
                                <i>Conditions</i>: You can tap on a condition-node to edit it
                    </PanelText>
                    
                    <PanelText>
                                <i>Actions</i>: You can tap on an action-node to add another action to it, you may only use one movement, 
                                aim and shoot/self-destruct action per node.
                    </PanelText>

                </TabPanel>


                <TabPanel value={tabIndex} index={2}>
                    <PanelText variant="h5">The Map</PanelText>
                    <PanelText>
                                Below you can see the map where your tank will play. Your own tank is always the top left one, the enemy the bottom right. 
                                The blue dots are the spawn point objects, the yellow dot in the middle is the center and the red cross packets are health packets, 
                                which you can navigate to to heal.
                    </PanelText>
                    <PanelImage></PanelImage>
                    <PanelText>
                                From the tank two grey lines sprout, those are its vision-lines. The tank is aware of the location of everything on the map, 
                                except enemy bullets and the enemy tank itself, since those move around. 
                                Only if such an object is between those two (infinite) lines and not blocked by a wall, your tank can see them.
                    </PanelText>
                </TabPanel>


                <TabPanel value={tabIndex} index={3}>
                    <PanelText variant="h5">The Replay</PanelText>
                    <PanelText>
                                This picture is from a replay, you can watch it frame by frame via the slider and to the right you see your AI and the current state it is in. 
                                This means that when your tank is not behaving like you want it to, you can exactly pinpoint the problem and adjust your AI accordingly.
                    </PanelText>
                    <PanelImage></PanelImage>
                </TabPanel>

                <TabPanel value={tabIndex} index={4}>
                    <PanelText variant="h5">Advanced Topics</PanelText>
                    <PanelText variant="h6">Strategies:</PanelText>
                    <PanelText>
                                Once you are familiar with how the AI works, you can think about different strategies. 
                                Will you create an aggressive AI continuously looking for the enemy tank, 
                                or will you try to stay as safe as possible and dodge enemy bullets? 
                                The choice is up to you! Try to be smart and creative.
                    </PanelText>
                    <PanelText variant="h6">Labels:</PanelText>
                    <PanelText>
                                One way you can program or change such behaviour is through <i>labels</i>. You can set and unset labels as an action, 
                                and check via a condition whether a certain label is set. This way, you can make sure that performing a certain action, 
                                such as navigating to a health pack, is not interrupted by another part of your decision tree, until you unset that certain label. 
                                Next to that you can set timers to activate a label in <i>X</i> seconds, 
                                to for example scout for only a maximum amount of time and then switch to another strategy.
                    </PanelText>

                </TabPanel>

            </SwipeableViews>

        </div>
    )
}

export default Help