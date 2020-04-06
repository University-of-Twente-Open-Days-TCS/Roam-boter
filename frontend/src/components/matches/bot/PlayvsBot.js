import React from "react";

import { Typography,Grid } from '@material-ui/core'

import { ButtonList, ButtonListTextLink } from '../../layout/ButtonList'
import ContentBox from "../../layout/ContentBox";


const PlayvsBot = () => {
    return (
        <ContentBox>
            <Grid container justify='center'>
                <Grid item xs={12} sm={9} md={6}>
                    <Typography variant="h4" align="center">Play versus Bots</Typography>
                    <ButtonList>
                        <ButtonListTextLink url="/NewBotMatch">New Match</ButtonListTextLink>
                        <ButtonListTextLink url="/BotMatchHistory">Replays</ButtonListTextLink>
                    </ButtonList>
                </Grid>
            </Grid>
        </ContentBox>
    );
}

export default PlayvsBot;