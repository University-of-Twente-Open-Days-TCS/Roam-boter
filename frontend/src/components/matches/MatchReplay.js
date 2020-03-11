import React, {Component} from "react";

import RoamBotAPI from "../../RoamBotAPI"
import ReplayCanvas from "./ReplayCanvas";


class MatchReplay extends Component {

    constructor(props) {
        super(props);
        
        this.frame = 0
    }

    async componentDidMount() {
        // selects the id of the match from the URL
        const id = this.props.match.url.split('/').slice(-1)[0]

        const response = await RoamBotAPI.getBotMatchDetails(id)
        let data = await response.json();

        let game_data = JSON.parse(data.simulation);
        let canvas = this.refs.canvas
        let replayCanvas = new ReplayCanvas(canvas, game_data)

        
        this.interval = setInterval(() => {
            replayCanvas.drawFrame(this.frame)
            this.frame = this.frame + 1
        }, 16);
    }

    componentWillUnmount() {
        // Stop interval
        clearInterval(this.interval)
    }

    render() {
        return (
            <div>
                <h1>Match Replay</h1>
                <canvas ref="canvas" width={610} height={410}/>
            </div>
        )
    }
}

export default MatchReplay;
