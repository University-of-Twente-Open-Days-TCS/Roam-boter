import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, useMediaQuery, useTheme } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    wrapper: {
        display: 'inline-flex',
        justifyContent: 'center',
        margin: 'auto',
        '& h4, h5, h6, p': {
            margin: '2px',
            [theme.breakpoints.up('md')]: {
                margin: theme.spacing(0, 2),
            }
        }
    },
    player: {
        color: 'green',
        fontWeight: 700,
    },
    opponent: {
        color: 'red',
        fontWeight: 700,
    },
    small: {

    },
    big: {
        
    }
})) 


const MatchReplayHeader = props => {
    const theme = useTheme()
    const classes = useStyles()

    let { match } = props

    let fontSize = useMediaQuery(theme.breakpoints.up('md')) ? "h4" : "body1"

    if(match){
        let generalInfo = match.generalInfo
        return (
            <div className={classes.root}>
                <div className={classes.wrapper}>
                    <Typography variant={fontSize} className={classes.player}>{generalInfo.player}</Typography>
                    <Typography variant={fontSize}>V.S.</Typography>
                    <Typography variant={fontSize} className={classes.opponent}>{generalInfo.opponent}</Typography>
                </div>
            </div>)
    }else {
        return null
    }
}

export default MatchReplayHeader;

