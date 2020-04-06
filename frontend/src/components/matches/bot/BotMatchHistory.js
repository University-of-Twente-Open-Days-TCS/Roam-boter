import React, { Component } from "react";
import {NavLink} from "react-router-dom";

import { Button, Typography, Grid } from '@material-ui/core'
import {Refresh} from "@material-ui/icons";

import ContentBox from '../../layout/ContentBox';
import MatchHistoryList from "../replay/MatchHistoryList";

import RoamBotAPI from '../../../RoamBotAPI'

class BotMatchHistory extends Component {

    constructor(props) {
        super(props)
        this.state = {matches: []}

        this.refreshMatchHistory = this.refreshMatchHistory.bind(this)
    }

    async componentDidMount() {
        this.refreshMatchHistory()
    }

    async refreshMatchHistory() {
        let response = await RoamBotAPI.getBotMatchHistoryList()
        let data = await response.json()
        this.setState({matches: data})
    }

    render() {
        return(
        <ContentBox>
            <Grid container justify='center'>
                <Grid item xs={12} ms={9} md={6}>
                    <Typography variant="h4" align='center'>Bot Match History <Button onClick={() => this.refreshMatchHistory()} variant="outlined" size="small" color="primary"><Refresh/></Button></Typography>
                        {this.state.matches.length > 0 ?
                            (<MatchHistoryList matches={this.state.matches} refresh={this.refreshMatchHistory}/>)
                            :
                            (<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem'}}>
                                <Typography>You haven't played any matches yet.</Typography>
                                <NavLink to="/NewBotMatch">
                                    <Button color="primary" variant="contained" size='small' style={{marginLeft: '0.5rem'}}>Play a match!</Button>
                                </NavLink>
                            </div>)
                        }
                </Grid>

                
            </Grid>
          
        </ContentBox>
        )
    }
}

export default BotMatchHistory;
