import RoamBotAPI from '../../RoamBotAPI'

import React, { Component } from "react";

import { Button } from '@material-ui/core'
import './AIEditor.css'

const AIItem = (props) => {
    let ai = props.ai

    let playVsBot = () => {
        let data = {}
        data.bot = 1
        data.ai = ai.pk
        data.gamemode = "DM"

        let call = RoamBotAPI.playBotMatch(data)

        call.then((response) => {
            if (response.ok) {
                alert("Simulation successful")
            }else {
                console.log(response)
                alert("An error occurred. See console")
            }
        })

    }
    
    return (
        <li><div className='ai-name'>{props.ai.name}</div> <Button onClick={playVsBot} variant="outlined" color="primary" size="small">Play vs Bot</Button></li>
    )
}


class AIList extends Component {

    constructor(props) {
        super(props)
        this.state = {ais: []}
    }

    async componentDidMount() {
        // Get list of AI's
        let response = await RoamBotAPI.getAiList()
        let aiList = await response.json()
        this.setState({ais: aiList})
    }

    render() {

        const aiItems = this.state.ais.map((ai, i) => <AIItem key={ai.pk} ai={ai}></AIItem>)
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
