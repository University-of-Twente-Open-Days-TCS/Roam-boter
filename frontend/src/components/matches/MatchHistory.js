import React, { Component } from "react";
import { render } from "@testing-library/react";

import RoamBotAPI from "../../RoamBotAPI"
import {NavLink} from "react-router-dom";


class MatchHistory extends Component {

    constructor(props) {
        super(props)
        this.state = {matches: []}
    }

    async componentDidMount() {
        let response = await RoamBotAPI.getBotMatchHistoryList()
        let data = await response.json()
        this.setState({matches: data})
    }

    render() {
        return(
        <div>
            <h1>Match History</h1>
            { 
                this.state.matches.map((match, i) => {
                    return (<NavLink key={i} to={'/MatchReplay/' + match.pk}><div>AI {match.ai} : DATE {match.date}</div></NavLink>)
                })
            }
        </div>
        )
    }
}

export default MatchHistory;
