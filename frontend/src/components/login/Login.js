import React, {useState} from "react"

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from '@material-ui/core/Icon'

import '@fortawesome/fontawesome-free/css/all.css'

const useStyles = makeStyles(theme => ({
    title: {
        textAlign: 'center'
    },
    titleIcon: {
        display: 'inline',
        position: 'relative',
        top: '-4px',
    },
    loginForm: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        padding: '1rem',
    },
    formInput: {
        margin: '1rem',
        width: '100%'
    }
    
}))

const Login = ({handleSubmit, attemptFailed}) => {
    const classes = useStyles()
    const [teamCode, setTeamCode] = useState("")

    return (
        <div>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >

                <Grid item sm={9} md={3}>
                    <form className={classes.loginForm} noValidate autoComplete="off" onSubmit={(event) => {
                        event.preventDefault()
                        handleSubmit(teamCode)
                    }
                    }>
                        <Typography variant="h3" className={classes.title} >RoamB<Icon className={clsx("fa", "fa-robot", classes.titleIcon)}></Icon>t-er</Typography>
                        <TextField className={classes.formInput}
                                   id="outlined-basic"
                                   label="Team code"
                                   variant="outlined"
                                   value={teamCode} onChange={e => setTeamCode(e.target.value)}
                                   helperText={attemptFailed ? "This team code doesn't exist" : ""}
                                   error={attemptFailed} />
                        <Button className={classes.formInput} variant="contained" color="primary" type="submit">
                            Log In
                        </Button>
                    </form>
                </Grid>

            </Grid>

        </div>
    )
}

export default Login
