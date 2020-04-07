import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import { Typography, Button, Grid } from '@material-ui/core'

import ContentBox from '../../layout/ContentBox'

import RoamBotAPI from '../../../RoamBotAPI'
import {Refresh} from "@material-ui/icons";
import MatchHistoryList from '../replay/MatchHistoryList'


class TeamMatchHistory extends Component {

    constructor(props) {
        super(props)
        this.state = {matches: []}
        this.deleteHandler = this.deleteHandler.bind(this)
        this.refreshMatchHistory = this.refreshMatchHistory.bind(this)
    }

    async componentDidMount() {
        this.refreshMatchHistory()
    }

    async refreshMatchHistory() {
        let call = await RoamBotAPI.getTeamMatchHistoryList()
        let json = await call.json()
        this.setState({matches: json})
    }

    async deleteHandler(match) {
        let call = await RoamBotAPI.deleteTeamMatch(match.pk)
        if (call.ok) {
            this.refreshMatchHistory()
        }else {
            window.alert("Something went wrong...")
        }
    }

    render() {
        return(
            <ContentBox>
                <Grid container justify='center'>
                    <Grid item xs={12} sm={9} md={6}>
                        <Typography variant="h4" align='center'>Team Match History <Button onClick={() => this.refreshMatchHistory()} variant="outlined" size="small" color="primary"><Refresh/></Button></Typography>
                        
                            {this.state.matches.length > 0 ?
                            (
                                <MatchHistoryList matches={this.state.matches} refresh={this.refreshMatchHistory}/>
                            )
                                :
                            (
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem'}}>
                                    <Typography>You haven't played any matches yet.</Typography>
                                    <NavLink to="/NewTeamMatch">
                                        <Button color="primary" variant="contained" size='small' style={{marginLeft: '0.5rem'}}>Play a match!</Button>
                                    </NavLink>
                                </div>
                            )}
                    </Grid>
                </Grid>
            </ContentBox>
        )
    }
}

export default TeamMatchHistory;