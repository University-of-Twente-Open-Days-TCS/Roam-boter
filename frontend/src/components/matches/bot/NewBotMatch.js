import React, { useState, useEffect } from 'react'

import RoambotAPI from '../../../RoamBotAPI'

import { Typography, Button, Grid, Snackbar } from '@material-ui/core'

import { makeStyles } from "@material-ui/core/styles";

import ContentBox from '../../layout/ContentBox'

import SelectAIDialog from '../SelectAIDialog'
import SelectBotDialog from '../SelectBotDialog'
import Alert from "@material-ui/lab/Alert";
import { NavLink } from 'react-router-dom'

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

    let [dialogOpen, setDialogOpen] = useState({
        ai: false,
        bot: false
    })
    let [selected, setSelected] = useState({
        ai: null,
        bot: null
    })
    let [snackbar, setSnackbar] = useState({
        open: false,
        error: false,
        message: "",
        url: null
    })

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
            bot: selected.bot.pk,
            ai: selected.ai.pk
        })
        call.then((response) => {
            if (response.ok) {
                setSnackbar({
                    open: true,
                    error: false,
                    message: "Simulation successful, click here to view replays",
                    url: "/BotMatchHistory"
                })
            } else {
                setSnackbar({
                    open: true,
                    error: true,
                    message: "Something went wrong",
                    url: null
                })
            }
        })
    }

    const handleAIListItemClick = (ai) => {
        setSelected({ ...selected, ai: ai })
        setDialogOpen({ ...dialogOpen, ai: false })
    }

    const handleBotListItemClick = (bot) => {
        setSelected({ ...selected, bot: bot })
        setDialogOpen({ ...dialogOpen, bot: false })
    }

    return (
        <ContentBox>
            <Typography variant="h4" align="center">New Bot Match</Typography>
            <Grid container justify="center" spacing={2}>
                <Grid item xs={12} sm={9} md={6}>
                    <div className={classes.wrapper}>
                        <Button className={classes.button} variant="outlined" color={selected.ai ? "primary" : "secondary"} onClick={() => { setDialogOpen({ ...dialogOpen, ai: true }) }}>
                            {selected.ai ? selected.ai.name : "Select AI"}
                        </Button>
                        <Button className={classes.button} variant="outlined" color={selected.bot ? "primary" : "secondary"} onClick={() => { setDialogOpen({ ...dialogOpen, bot: true }) }}>
                            {selected.bot ? selected.bot.name : "Select Bot"}
                        </Button>
                        <Button className={classes.button} type="submit" variant="contained" disabled={!(selected.ai && selected.bot)} color="secondary" onClick={playMatch}>Play</Button>

                        {(ais) ? (<SelectAIDialog ais={ais} open={dialogOpen.ai} handleClose={() => setDialogOpen({ ...dialogOpen, ai: false })} handleClick={handleAIListItemClick} />) : null}
                        {(bots) ? (<SelectBotDialog bots={bots} open={dialogOpen.bot} handleClose={() => setDialogOpen({ ...dialogOpen, bot: false })} handleClick={handleBotListItemClick} />) : null}

                        <NavLink to={snackbar.url ? snackbar.url : '/'} onClick={e => snackbar.url ? null : e.preventDefault()}>
                            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})}>
                                <Alert elevation={6} variant="filled"severity={snackbar.error ? "error" : "success"}> {snackbar.message} </Alert>
                            </Snackbar>
                        </NavLink>
                    </div>
                </Grid>
            </Grid>
        </ContentBox>
    )
}

export default NewBotMatch;