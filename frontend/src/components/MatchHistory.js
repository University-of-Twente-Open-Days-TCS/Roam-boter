import React, { Component } from "react";
import { render } from "@testing-library/react";

import RoamBotAPI from '../RoamBotAPI.js'
import {NavLink} from "react-router-dom";



class MatchHistory extends Component {


    constructor(props) {
        super(props)
        this.state = {matches: []}
    }

    async componentDidMount() {
        //TODO: Get match history
        let response = await RoamBotAPI.getMatchHistoryList()
        let data = await response.json()
        this.setState({matches: data})
    }

    async getMatchHistory() {
       
    }

    render() {
        return(
        <div>
            <h1>Match History</h1>
            { 
                this.state.matches.map((match, i) => {
                    return (<NavLink to={'/MatchReplay/' + match.pk}><div key={i}>AI {match.ai} : DATE {match.date}</div></NavLink>)
                })
            }
        </div>
        )
    }
}

export default MatchHistory;
