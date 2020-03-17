import React from "react";
import ContentBox from "./layout/ContentBox";

import { NavLink } from "react-router-dom";

import Button from '@material-ui/core/Button'

const PlayvsBot = () => {
    return (
        <ContentBox>
            <h1>Play vs Bots</h1>
            <NavLink to='/BotMatchHistory'><Button variant="outlined">Replays</Button></NavLink>
        </ContentBox>
    );
}

export default PlayvsBot;