import React, {Component} from "react";
import {withRouter} from "react-router-dom";

import { withStyles } from '@material-ui/core/styles'

import ReplayCanvas from "../ReplayCanvas";
import ContentBox from '../../layout/ContentBox'
import ReplayControls from '../ReplayControls'
import AIReplayCanvas from "../AIReplayCanvas";

import RoamBotAPI from "../../../RoamBotAPI"

const styles = theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        margin: 'auto',
        width: '90%',
    },
    matchWrapper: {
        display: 'flex',
        flexDirection: 'column',
        width: '70%'
    },
    matchContainer: {

    },
    editorContainer: {
        width: '30%',
        backgroundColor: '#f6f6f6',
        overflow: 'hidden',
    },
})


class BotMatchReplay extends Component {

    constructor(props) {
        super(props)

        this.matchContainer = React.createRef()

        this.gameData = null
        this.state = {
            frame: 0,
            framesLength: 0,
            gameData : null,
        }
        //bind callbackFunctions
        this.handleSlideChange = this.handleSlideChange.bind(this)
        this.handlePlayButtonChange = this.handlePlayButtonChange.bind(this)
    }

    async componentDidMount() {
        // selects the id of the match from the URL
        const match_id = this.props.match.params.matchId;
        const ai_id = this.props.match.params.aiId;

        let {ai, gameData} = await this.fetchMatchInfo(match_id, ai_id)
        this.ai = ai

        let matchContainer = this.matchContainer.current

        let replayCanvas = new ReplayCanvas(matchContainer, gameData)
        let editorCanvas = new AIReplayCanvas('editor-container')

        // TODO: tankId ophalen + meegeven, bij BotMatches ben je altijd tank 0
        this.replayCanvas = replayCanvas
        this.editorCanvas = editorCanvas

        // Fill editor canvas with AI
        editorCanvas.fillCanvas(this.ai)

        //Make sure canvas reacts to responsively
        this.resizeCanvas = this.resizeCanvas.bind(this)

        window.addEventListener('resize', this.resizeCanvas)
        window.addEventListener('load', this.resizeCanvas)
        window.addEventListener('orientationchange', this.resizeCanvas)

        
        replayCanvas.start()

        this.setState({framesLength: replayCanvas.getFramesLength(), gameData: gameData})
    }

    async fetchMatchInfo(match_id, ai_id) {
        /**
         * Fetches both the match and ai 
         */
        const match_response = await RoamBotAPI.getSimulation(match_id)
        let match_data = await match_response.json();

        const ai_response = await RoamBotAPI.getAiDetail(ai_id)
        let ai_data = await ai_response.json();

        return {ai: JSON.parse(ai_data.ai), gameData: JSON.parse(match_data.simulation)}
    }

    componentDidUpdate() {
        // Stop or Start animation
        if(!this.state.playing){
            if(this.interval){
                clearInterval(this.interval)
                this.interval = null
            }
        } else {
            if(!this.interval){
                this.interval = setInterval(() => {
                    this.setState({frame: this.state.frame+1})
                }, 16)
            }
        }

        if(this.state.frame >= this.state.framesLength){
            // Stop playing
            this.setState({frame: this.state.frame-1, playing: false})
        } else {
            // update components
            let gameData = this.state.gameData
            if (gameData) {
                let frame = gameData.frames[this.state.frame]
                if (frame) {
                    let aiPath = gameData.frames[this.state.frame].tanks[0].ai_path
                    this.editorCanvas.setHighlightPath(aiPath.reverse())
                }else {
                    console.log(this.state)
                }
            }

            // Update replay
            this.replayCanvas.setFrame(this.state.frame)
        }
    }

    componentWillUnmount() {
        // Stop interval
        clearInterval(this.interval)
    }


    resizeCanvas() {
        this.replayCanvas.updateSize()
        this.editorCanvas.updateSize()
    }

    handleSlideChange(event, newValue) {
        let progress = newValue
        let frames = this.state.framesLength
        let frame = parseInt((frames / 10000) * progress)
        this.setState({frame: frame})
    }

    handlePlayButtonChange(event) {
        if(!this.state.playing){
            if(this.state.frame === this.state.framesLength - 1){
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

        let props = {
            playing: this.state.playing,
            progress: progress,
            handleSlideChange: this.handleSlideChange,
            handlePlayButtonChange: this.handlePlayButtonChange
        }

        return (
            <ContentBox>
                <div className={classes.wrapper}>
                    <div className={classes.matchWrapper}>
                        <div ref={this.matchContainer} className={classes.matchContainer}></div>
                        <ReplayControls {...props}/>
                    </div>
                    <div id="editor-container" className={classes.editorContainer}></div>
                </div>
            </ContentBox>
        )
    }
}

export default withRouter(withStyles(styles)(BotMatchReplay));
