import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import { Typography, Button } from '@material-ui/core'

import ContentBox from '../../layout/ContentBox'

import RoamBotAPI from '../../../RoamBotAPI'
import {Refresh} from "@material-ui/icons";


const TeamMatchItem = (props) => {

    let date = new Date(props.match.date)
    let timeString = date.toLocaleTimeString()
    let done = (props.match.simulation.state === "DONE")

    return (
        <li>
            <NavLink to={'/MatchReplay/'+props.match.pk+'/teammatch'} onClick={e => done ? null : e.preventDefault()}>
                <Button variant="outlined" color="primary" size="small" disabled={!done}>{timeString} {(done) ? null : "Simulating.."}</Button>
            </NavLink><span className='spacing'></span>
            <Button variant="outlined" color="secondary" size="small" onClick={() => props.onDelete(props.match)}>Delete</Button>
        </li>
    )
}



class TeamMatchHistory extends Component {

    constructor(props) {
        super(props)
        this.state = {matches: []}
        this.deleteHandler = this.deleteHandler.bind(this)
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
                <Typography variant="h4">Team Match History <Button onClick={() => this.refreshMatchHistory()} variant="outlined" size="small" color="primary"><Refresh/></Button></Typography>
                {this.state.matches.length > 0 ?
                (<ul>{
                        this.state.matches.map((match, i) => {
                            return (
                                <TeamMatchItem key={i} match={match} onDelete={this.deleteHandler}></TeamMatchItem>
                            )
                        })
                    }
                </ul>)
                    :
                (
                    <div>
                        <Typography>You haven't played any matches yet against opponents.</Typography>
                        <NavLink to="/NewTeamMatch">
                            <Button color="primary" variant="contained">Play a match!</Button>
                        </NavLink>
                    </div>
                )
                }
            </ContentBox>
        )
    }
}

export default TeamMatchHistory;