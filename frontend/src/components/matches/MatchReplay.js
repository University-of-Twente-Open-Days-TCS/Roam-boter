import React, {Component} from "react";

import { withStyles } from '@material-ui/core/styles'

import RoamBotAPI from "../../RoamBotAPI"
import ReplayCanvas from "./ReplayCanvas";


import ContentBox from '../layout/ContentBox'

const styles = theme => ({
    canvasContainer: {
        width: '100%'
    }
})


class MatchReplay extends Component {

    constructor(props) {
        super(props)
        this.canvas = React.createRef()
        this.canvasContainer = React.createRef()
        this.frame = 0
    }

    async componentDidMount() {
        // selects the id of the match from the URL
        const id = this.props.match.url.split('/').slice(-1)[0]

        const response = await RoamBotAPI.getBotMatchDetails(id)
        let data = await response.json();

        let game_data = JSON.parse(data.simulation);

        let canvas = this.canvas.current
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
        let { classes } = this.props
        console.log(this.canvasContainer.current)

        return (
            <ContentBox>
                <div ref={this.canvasContainer} className={classes.canvasContainer}>
                    <canvas ref={this.canvas} width={610} height={410}/>
                </div>
            </ContentBox>
        )
    }
}

export default withStyles(styles)(MatchReplay);
