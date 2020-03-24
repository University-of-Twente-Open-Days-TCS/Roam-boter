import React from "react";

import ContentBox from '../../layout/ContentBox'
import { Typography } from "@material-ui/core";
import { ButtonList, ButtonListTextLink } from "../../layout/ButtonList";


const PlayvsPlayer = () => {
    return (
        <ContentBox>
            <Typography variant="h4" align="center">Play versus Team</Typography>
            <ButtonList>
                <ButtonListTextLink url="/NewTeamMatch">New Match</ButtonListTextLink>
                <ButtonListTextLink url="/TeamMatchHistory">Replays</ButtonListTextLink>
            </ButtonList>
        </ContentBox>
    );
}

export default PlayvsPlayer;