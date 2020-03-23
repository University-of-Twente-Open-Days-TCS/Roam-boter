import React from "react";

import { Typography, Button, Grid } from '@material-ui/core'

import ContentBox from './layout/ContentBox'

const Home = (props) => {

    let logoutHandler = props.handleSubmitLogout

    return (
        <ContentBox>
            <Typography variant="h4" align="center">Home</Typography>
            <Grid container justify="center" style={{marginTop: '1rem'}}>
                <Button color="secondary" variant="contained" onClick={logoutHandler}>Logout</Button>
            </Grid>
        </ContentBox>
    )
}

export default Home