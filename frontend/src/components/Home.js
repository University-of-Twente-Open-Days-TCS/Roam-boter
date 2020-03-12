import React from "react";

import Button from '@material-ui/core/Button'

const Home = (props) => {

    let logoutHandler = props.handleSubmitLogout

    return (
        <div>
            <h1>Home</h1>
            <Button color="secondary" variant="contained" onClick={logoutHandler}>Logout</Button>
        </div>
    )
}

export default Home