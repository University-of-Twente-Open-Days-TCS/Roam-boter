import RoamBotAPI from '../../RoamBotAPI'
import React, { Component } from "react";

const AIItem = (props) => {
    return (
        <li>{props.ai.name}</li>
    )
}


class AIList extends Component {

    constructor(props) {
        super(props)
        this.state = {ais: []}
    }

    async componentDidMount() {
        let response = await RoamBotAPI.getAiList()
        let aiList = await response.json()
        this.setState({ais: aiList})
    }

    render() {

        const aiItems = this.state.ais.map((ai, i) => <AIItem key={i} ai={ai}></AIItem>)
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
