import Button from '@material-ui/core/Button'

import React, { Component } from "react";
import {NavLink} from "react-router-dom";

import RoamBotAPI from "../../../RoamBotAPI"

import ContentBox from '../../layout/ContentBox';
import {Refresh} from "@material-ui/icons";


const MatchItem = (props) => {
    let date = new Date(props.match.date)
    let timeString = date.toLocaleTimeString()
    let done = (props.match.simulation.state === "DONE")

    const deleteMatch = () => {
        let call = RoamBotAPI.deleteBotMatch(props.match.pk)
        call.then((response) => {

            if(!response.ok){
                // an error occurred
                console.error(response)
                alert("An error occurred see console.")

            }else {
                // refresh parent component
                props.refresh()
            }
        })
    }

    return (
        <li>
            <NavLink to={'/BotMatchReplay/'+props.match.simulation.pk+'/'+props.match.ai} onClick={e => done ? null : e.preventDefault()}>
                <Button variant="outlined" color="primary" size="small" disabled={!done}>{timeString} {(done) ? null : "Simulating.."}</Button>
            </NavLink><span className='spacing'></span>
            <Button variant="outlined" color="secondary" size="small" onClick={deleteMatch}>Delete</Button>
        </li>
    )
}

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
            <h1>Match History <Button onClick={() => this.refreshMatchHistory()} variant="contained" color="primary"><Refresh/></Button></h1>
            <ul>{
                this.state.matches.map((match, i) => {
                    return (
                        <MatchItem key={i} match={match} refresh={this.refreshMatchHistory}></MatchItem>
                    )
                })
                }
            </ul>
          
        </ContentBox>
        )
    }
}

export default BotMatchHistory;
