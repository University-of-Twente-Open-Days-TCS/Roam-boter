import React from 'react'
import { Typography } from '@material-ui/core'

const TeamInfo = (props) => {
    let team = props.team

    return (
        <div>
            <Typography variant="h4" align="center">Team: <i><b>{team.team_name}</b></i></Typography>
        </div>
    )

}

export default TeamInfo