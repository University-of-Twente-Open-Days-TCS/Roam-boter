import RoamBotAPI from '../RoamBotAPI.js'
import React, { Component } from "react";



class AIList extends Component {

    constructor(props) {
        super(props)
        this.state = {ais: []}
    }

    async componentDidMount() {
        let response = await RoamBotAPI.aiList()
        let aiList = await response.json()
        this.setState({ais: aiList})
    }

    render() {

        const aiItems = this.state.ais.map((ai, i) => <li key={i}>{ai.name}</li>)
        console.log(aiItems)
        return (
            <div>
                <h1>AI List</h1>
                <ul>
                    {aiItems}
                </ul>
            </div>
        )
    }
}

export default AIList;
