import React, {useState, useEffect} from 'react'

import RoambotAPI from '../../../RoamBotAPI'

import {Typography, Button, Grid} from '@material-ui/core'

import {makeStyles} from "@material-ui/core/styles";

import ContentBox from '../../layout/ContentBox'

import SelectAIDialog from '../SelectAIDialog'
import SelectBotDialog from '../SelectBotDialog'

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

const NewBotMatch = props => {
    const classes = useStyles()

    let [ais, setAis] = useState(null)
    let [bots, setBots] = useState(null)
    let [selectAIOpen, setSelectAIOpen] = useState(false)
    let [selectBotOpen, setSelectBotOpen] = useState(false)
    let [selectedAI, setSelectedAI] = useState(null)
    let [selectedBot, setSelectedBot] = useState(null)

    useEffect(() => {
        async function updateAis() {
            let call = await RoambotAPI.getAiList()
            let json = await call.json()
            setAis(json)
        }

        async function updateBots() {
            let call = await RoambotAPI.getBotList()
            let json = await call.json()
            setBots(json)
        }

        // only update if ai list is unset
        if (ais === null) {
            updateAis()
        }
        if (bots === null) {
            updateBots()
        }
    })

    const playMatch = async () => {
        let call = RoambotAPI.postBotMatch({
            gamemode: 'DM',
            bot: selectedBot.pk,
            ai: selectedAI.pk
        })
        call.then((response) => {
            if (response.ok) {
                alert("Simulation Successfull")
            } else {
                alert("Error See Console")
            }
        })
    }

    const handleAIListItemClick = (ai) => {
        setSelectedAI(ai)
        setSelectAIOpen(false)
    }

    const handleBotListItemClick = (bot) => {
        setSelectedBot(bot)
        setSelectBotOpen(false)
    }


    return (
        <ContentBox>
            <Typography variant="h4" align="center">New Bot Match</Typography>
            <Grid container justify="center" spacing={2}>
                <Grid item xs={12} sm={9} md={6}>
                    <div className={classes.wrapper}>
                        <Button className={classes.button} variant="outlined" color={selectedAI ? "primary" : "secondary"} onClick={() => {
                            setSelectAIOpen(true)
                        }}>
                            {selectedAI ? selectedAI.name : "Select AI"}
                        </Button>
                        <Button className={classes.button} variant="outlined" color={selectedBot ? "primary" : "secondary"} onClick={() => {
                            setSelectBotOpen(true)
                        }}>
                            {selectedBot ? selectedBot.name : "Select Bot"}
                        </Button>
                        <Button className={classes.button} type="submit" variant="contained" disabled={!(selectedAI && selectedBot)} color="secondary" onClick={playMatch}>Play</Button>

                        {(ais) ? (<SelectAIDialog ais={ais} open={selectAIOpen} handleClose={() => setSelectAIOpen(false)} handleClick={handleAIListItemClick} />) : "no AIs found"}
                        {(bots) ? (<SelectBotDialog bots = {bots} open={selectBotOpen} handleClose={() => setSelectBotOpen(false)} handleClick={handleBotListItemClick} />) : ("no bots found")}
                    </div>
                </Grid>
            </Grid>
        </ContentBox>
    )
}

export default NewBotMatch;