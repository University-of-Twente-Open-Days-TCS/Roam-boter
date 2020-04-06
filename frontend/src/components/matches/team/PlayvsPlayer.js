import React from "react";

import ContentBox from '../../layout/ContentBox'
import { Typography, Grid } from "@material-ui/core";
import { ButtonList, ButtonListTextLink } from "../../layout/ButtonList";


const PlayvsPlayer = () => {
    return (
        <ContentBox>
            <Grid container justify='center'>
                <Grid item xs={12} sm={9} md={6}>
                    <Typography variant="h4" align="center">Play versus Team</Typography>
                    <ButtonList>
                        <ButtonListTextLink url="/NewTeamMatch">New Match</ButtonListTextLink>
                        <ButtonListTextLink url="/TeamMatchHistory">Replays</ButtonListTextLink>
                    </ButtonList>
                </Grid>
            </Grid>
        </ContentBox>
    );
}

export default PlayvsPlayer;