import React from "react";

import Button from '@material-ui/core/Button'

import ContentBox from './layout/ContentBox'

const Home = (props) => {

    let logoutHandler = props.handleSubmitLogout

    return (
        <ContentBox>
            <h1>Home</h1>
            <Button color="secondary" variant="contained" onClick={logoutHandler}>Logout</Button>
        </ContentBox>
    )
}

export default Home