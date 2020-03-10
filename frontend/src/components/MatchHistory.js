import React, { Component } from "react";
import { render } from "@testing-library/react";

import { getCsrfToken, API_HOST } from '../RoamBotAPI.js'
import {NavLink} from "react-router-dom";



class MatchHistory extends Component {


    constructor(props) {
        super(props)
        this.state = {matches: []}
    }

    async componentDidMount() {
        let data = this.getMatchHistory().then((data) => {
            let new_state = {matches: data}
            console.log(new_state)
            this.setState(new_state)
        }).catch((e) =>
            console.log(e)
        )
    }

    async getMatchHistory() {
        let csrfToken = await getCsrfToken()
        const response = await fetch(`${API_HOST}/matches/botmatches/`,
        {
            'method' : 'GET',
            'credentials': 'include'
        })
        let data = await response.json()
        return data
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
