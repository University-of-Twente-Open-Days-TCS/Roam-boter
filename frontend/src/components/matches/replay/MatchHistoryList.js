import React from 'react'

import clsx from 'clsx'

import { makeStyles, Typography, IconButton } from '@material-ui/core'

import { Delete } from '@material-ui/icons'
import { NavLink } from 'react-router-dom'

import RoamBotAPI from '../../../RoamBotAPI'

const useStyles = makeStyles(theme => ({
    root: {

    },
    matchList: {
        listStyleType: 'none',
        margin: 0,
        padding: theme.spacing(2),
    },
    matchListItem: {
        display: 'flex',
        alignItems: 'center',

        margin: '4px',
        padding: '4px 0.75rem',

        boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',

        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.02)'
        }
    },
    matchListItemText: {
        lineHeight: 1,
    },
    matchListItemIcon: {
        marginLeft: 'auto',
        zIndex: 10,
    },
    title: {
        fontWeight: 300,
        color: 'rgba(0,0,0,0.7)',
        margin: 0,
        marginBlockStart: 0,
        marginBlockEnd: 0,

        fontSize: '1.25em',
        lineHeight: 1,
    },
    caption: {
        fontSize: '0.8rem',
        color: 'rgba(0,0,0,0.7)',
    },
    red: {
        display: 'inline-block',
        color: 'red',
        minWidth: '1.5rem',
    },
    green: {
        display: 'inline-block',
        color: 'green',
        minWidth: '1.5rem',

    },
}))

const MatchHistoryListItem = props => {
    let { match } = props
    let classes = useStyles()

    let teammatch = Boolean(match.opponent)
    let opponent = teammatch ? match.opponent.team_name : match.bot.name
    let player = teammatch ? match.initiator.team_name : match.team.team_name
    let ai_name = teammatch ? match.initiator_ai.name : match.ai.name

    let won
    if (teammatch) {
        won = (match.initiator.pk === match.winner) ? true : false
    } else {
        won = (match.team.pk === match.winner) ? true : false
    }

    const deleteMatch = () => {
            let call
            if(teammatch){
                call = RoamBotAPI.deleteTeamMatch(props.match.pk)
            }else {
                call = RoamBotAPI.deleteBotMatch(props.match.pk)
            }

            call.then((response) => {

                if(!response.ok){
                    // an error occurred
                    console.error(response)
                    alert("An error occurred see console.")

                }else {
                    // refresh parent component
                    props.refresh()
                }
            })

    }

    return (
        <NavLink to={'/MatchReplay/'+props.match.pk+'/'+(teammatch ? 'teammatch' : 'botmatch')}>
            <li className={classes.matchListItem}>
                    <div className={classes.matchListItemText}>
                        <Typography className={classes.title}>{player} vs {opponent}</Typography>
                        {
                            won ?
                                (<div variant='caption' className={classes.caption}><span className={classes.green}>won</span> (<i>{ai_name}</i>)</div>)
                                :
                                (<div variant='caption' className={classes.caption}><span className={classes.red}>lost</span> (<i>{ai_name}</i>)</div>)
                        }
                    </div>
                    <div className={classes.matchListItemIcon}>
                        <IconButton onClick={(event) => {event.preventDefault(); deleteMatch();}}>
                            <Delete></Delete>
                        </IconButton>
                    </div>
            </li>
        </NavLink>)
}

const MatchHistoryList = props => {
    let { matches } = props
    let classes = useStyles()

    return (
        <div className={classes.root}>
            <ul className={classes.matchList}>
                {matches.map((match, i) => {
                    return <MatchHistoryListItem {...props} key={i} match={match} />
                })}
            </ul>
        </div>)
}

export default MatchHistoryList;