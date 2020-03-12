import React, {useState} from "react"
import '../css/Login.css';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

const Login = ({handleSubmit, attemptFailed}) => {
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

                <Grid item xs={3}>
                    <form className="login-form" noValidate autoComplete="off" onSubmit={(event) => {
                        event.preventDefault()
                        handleSubmit(teamCode)
                    }
                    }>
                        <TextField className="form-input"
                                   id="outlined-basic"
                                   label="Team code"
                                   variant="outlined"
                                   value={teamCode} onChange={e => setTeamCode(e.target.value)}
                                   helperText={attemptFailed ? "This team code doesn't exist" : ""}
                                   error={attemptFailed} />
                        <Button className="form-input" variant="contained" color="primary" type="submit">
                            Log In
                        </Button>
                    </form>
                </Grid>

            </Grid>

        </div>
    )
}

export default Login
