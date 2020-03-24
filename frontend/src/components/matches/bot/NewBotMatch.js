import React, {useState, useEffect} from 'react'

import RoambotAPI from '../../../RoamBotAPI'

import ContentBox from '../../layout/ContentBox'
import {Typography, Button} from '@material-ui/core'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {makeStyles} from "@material-ui/core/styles";

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
        </ContentBox>
    )
}

const SelectAIDialog = ({ais, handleClose, open, handleClick}) => {
    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Select AI</DialogTitle>
            <List>
                {ais.map(ai => (
                    <ListItem button onClick={() => handleClick(ai)} key={ai.pk}>
                        <ListItemText primary={ai.name}/>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    )
}

const SelectBotDialog = ({bots, handleClose, open, handleClick}) => {
    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Select Bot</DialogTitle>
            <List>
                {bots.map(bot => (
                    <ListItem button onClick={() => handleClick(bot)} key={bot.pk}>
                        <ListItemText primary={bot.name}/>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    )
}

export default NewBotMatch;