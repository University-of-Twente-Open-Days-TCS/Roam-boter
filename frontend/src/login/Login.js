import React, {useState} from "react"

import { makeStyles } from '@material-ui/core/styles'

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";


const useStyles = makeStyles(theme => ({
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
