import React, {Component} from "react";

import { withStyles } from '@material-ui/core/styles'

import RoamBotAPI from "../../RoamBotAPI"
import ReplayCanvas from "./ReplayCanvas";

import ContentBox from '../layout/ContentBox'
import ReplayControls from './ReplayControls'

const styles = theme => ({
    wrapper: {
        margin: 'auto',
        width: '70%',
    },
    canvasContainer: {
        display: 'block',
        width: '100%'
    }
})


class MatchReplay extends Component {

    constructor(props) {
        super(props)
        this.canvasContainer = React.createRef()
        this.state = {
            frame: 0,
            framesLength: 0,
            playing: false
        }
        //bind callbackFunctions
        this.handleSlideChange = this.handleSlideChange.bind(this)
        this.handlePlayButtonChange = this.handlePlayButtonChange.bind(this)
        // not sure whether this is appropriate
        this.render = this.render.bind(this)
    }

    async componentDidMount() {
        // selects the id of the match from the URL
        const id = this.props.match.url.split('/').slice(-1)[0]

        const response = await RoamBotAPI.getBotMatchDetails(id)
        let data = await response.json();

        let gameData = JSON.parse(data.simulation);

        let canvasContainer = this.canvasContainer.current
        let replayCanvas = new ReplayCanvas(canvasContainer, gameData)
        this.replayCanvas = replayCanvas

        this.setState({framesLength: replayCanvas.getFramesLength()})

        //Make sure canvas reacts to responsively
        this.resizeCanvas = this.resizeCanvas.bind(this)
        window.addEventListener('resize', this.resizeCanvas)
        window.addEventListener('load', this.resizeCanvas)
        window.addEventListener('orientationchange', this.resizeCanvas)
        replayCanvas.start()

    }

    componentDidUpdate() {
        // Stop or Start animation
        if(!this.state.playing){
            if(this.interval){
                clearInterval(this.interval)
                this.interval = null
            }
        }else {
            if(!this.interval){
                this.interval = setInterval(() => {
                    this.setState({frame: this.state.frame+1})
                }, 16)
            }
        }

        // Stop animation if at the end
        if(this.state.frame >= this.state.framesLength){
            // stop playing
            this.setState({frame: this.state.frame-1, playing: false})
        }
        this.replayCanvas.setFrame(this.state.frame)
    }

    componentWillUnmount() {
        // Stop interval
        clearInterval(this.interval)
    }
    

    resizeCanvas() {
        this.replayCanvas.updateSize()
    }
    
    handleSlideChange(event, newValue) {
        let progress = newValue
        let frames = this.state.framesLength
        let frame = parseInt((frames / 10000) * progress)
        this.setState({frame: frame})
    }

    handlePlayButtonChange(event) {
        if(!this.state.playing){
            if(this.state.frame == this.state.framesLength - 1){
                // reset to start position
                this.setState({frame: 0})   
            }
            this.setState({playing: true})
        }else {
            this.setState({playing: false})
        }
    }



    render() {
        let { classes } = this.props
        // calculate progress
        let frame = this.state.frame
        let frames = this.state.framesLength
        let progress = parseInt((frame / frames) * 10000)
        console.log(progress)

        let props = {
            playing: this.state.playing,
            progress: progress,
            handleSlideChange: this.handleSlideChange,
            handlePlayButtonChange: this.handlePlayButtonChange
        }

        return (
            <ContentBox>
                <div className={classes.wrapper}>
                    <div ref={this.canvasContainer} className={classes.canvasContainer}></div>
                    <ReplayControls {...props}/>
                </div>
            </ContentBox>
        )
    }
}

export default withStyles(styles)(MatchReplay);
