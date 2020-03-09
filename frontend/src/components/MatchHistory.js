import React, { Component } from "react";
import { render } from "@testing-library/react";

import { getCsrfToken } from '../utils.js'



class MatchHistory extends Component {


    constructor(props) {
        super(props)
        this.state = {matches: []}
    }

    async componentDidMount() {
        let data = await this.getMatchHistory()
        let new_state = {matches: data}
        this.setState(new_state)
    }

    async getMatchHistory() {
        let csrfToken = await getCsrfToken()
        const response = await fetch('http://localhost:8000/matches/botmatches/',
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
                    return (<div key={i}>AI {match.ai} : DATE {match.date} <button>Watch Simulation</button></div>)
                })
            }
        </div>
        )
    }
}

export default MatchHistory;