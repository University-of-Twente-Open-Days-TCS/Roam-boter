import React from "react";

import { Typography } from '@material-ui/core'

import { ButtonList, ButtonListTextLink } from './layout/ButtonList'
import ContentBox from "./layout/ContentBox";


const PlayvsBot = () => {
    return (
        <ContentBox>
            <Typography variant="h4" align="center">Play versus Bots</Typography>
            <ButtonList>
                <ButtonListTextLink url="/todo">New Match</ButtonListTextLink>
                <ButtonListTextLink url="/BotMatchHistory">Replays</ButtonListTextLink>
            </ButtonList>
        </ContentBox>
    );
}

export default PlayvsBot;