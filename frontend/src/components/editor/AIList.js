import RoamBotAPI from '../../RoamBotAPI'

import React, { Component } from "react";

import { Button } from '@material-ui/core'
import './AIEditor.css'

const AIItem = (props) => {
    /**
     * Props includes ai and refreshFunction
     */
    let ai = props.ai
    console.log(props)

    const playVsBot = () => {
        /**
         * Runs an simulation.
         */
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

    const deleteAI = () => {
        /**
         * Prompts user and deletes AI.
         */
        let confirmed = window.confirm("Are you sure you want to delete the AI?")
        if (confirmed) {
            let call = RoamBotAPI.deleteAI(ai.pk)
            call.then(() => {
                props.refreshList()
            })
        }
    }

    
    return (
        <li>
            <div className='ai-name'>{props.ai.name}</div> 
            <Button onClick={playVsBot} variant="outlined" color="primary" size="small">Play vs Bot</Button>
            <Button className='delete-button' onClick={deleteAI} variant="outlined" color="secondary" size="small">Delete</Button>

        </li>
    )
}


class AIList extends Component {

    constructor(props) {
        super(props)
        this.state = {ais: []}

        this.refreshList = this.refreshList.bind(this)
    }

    componentDidMount() {
        // Get list of AI's
        this.refreshList()
    }

    async refreshList() {
        /**
         * Calls API for a new list of AI's and updates the state.
         */
        let response = await RoamBotAPI.getAiList()
        let aiList = await response.json()
        this.setState({ais: aiList})
    }

    render() {

        const aiItems = this.state.ais.map((ai, i) => <AIItem key={ai.pk} ai={ai} refreshList={this.refreshList}></AIItem>)
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
