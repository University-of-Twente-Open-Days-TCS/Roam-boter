import React from 'react'

import ContentBox from '../../layout/ContentBox'
import { Typography } from '@material-ui/core'

const NewBotMatch = props => {
    return (
        <ContentBox>
            <Typography variant="h4" align="center">New Bot Match</Typography>
            <Typography variant="h5" align="center">Select AI</Typography>
            <Typography variant="h5" align="center">Select Bot</Typography>
            <Typography variant="h5" align="center">Play</Typography>


        </ContentBox>
    )
}

export default NewBotMatch;