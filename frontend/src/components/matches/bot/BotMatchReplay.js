import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles'

import ReplayCanvas from "../ReplayCanvas";
import ContentBox from '../../layout/ContentBox'
import ReplayControls from '../ReplayControls'
import AIReplayCanvas from "../AIReplayCanvas";

import RoamBotAPI from "../../../RoamBotAPI"


const styles = theme => ({
    wrapper: {
        display: 'flex',
        width: '100%',
    },
    matchWrapper: {
        display: 'flex',
        flexDirection: 'column',
        width: '70%'
    },
    matchContainer: {
        display: 'block',
        position: 'relative',
    },
    editorContainer: {
        display: 'block',
        flexGrow: 1,
        backgroundColor: '#f6f6f6',
        overflow: 'hidden',
    },
})


class BotMatchReplay extends Component {

    constructor(props) {
        super(props)

        this.replayContainer = React.createRef()

        //For optimization reasons. The frameData is not in the Components State.
        const frameData = {
            frame: 0,
            framesLength: 0,
        }
        this.frameData = frameData

        this.state = {
            gameData: null,
            playing: false,
        }
        //bind callbackFunctions
        this.handleSlideChange = this.handleSlideChange.bind(this)
        this.handlePlayButtonChange = this.handlePlayButtonChange.bind(this)
        this.update = this.update.bind(this)
    }

    async componentDidMount() {
        // selects the id of the match from the URL
        const match_id = this.props.match.params.matchId;
        const ai_id = this.props.match.params.aiId;

        let { ai, gameData } = await this.fetchMatchInfo(match_id, ai_id)
        this.ai = ai

        let matchContainer = this.replayContainer.current

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


        this.frameData = {
            ...this.frameData,
            framesLength: this.replayCanvas.getFramesLength()
        }

        this.setState({ gameData: gameData })

        replayCanvas.draw()
    }

    async fetchMatchInfo(match_id, ai_id) {
        /**
         * Fetches both the match and ai 
         */
        const match_response = await RoamBotAPI.getSimulation(match_id)
        let match_data = await match_response.json();

        const ai_response = await RoamBotAPI.getAiDetail(ai_id)
        let ai_data = await ai_response.json();

        let ai = JSON.parse(ai_data.ai)
        let gameData = JSON.parse(match_data.simulation)

        return { ai: ai, gameData: gameData }
    }

    componentDidUpdate() {
        // Stop or Start animation
        if (!this.state.playing) {
            if (this.animRequestId) {
                window.cancelAnimationFrame(this.animRequestId)
                this.animRequestId = null
            }
        } else {
            if (!this.animRequestId) {
                this.animRequestId = window.requestAnimationFrame(this.update)
            }
        }
    }

    componentWillUnmount() {
        // Stop interval
        clearInterval(this.interval)
    }

    update() {
        let { frame, framesLength } = this.frameData
        if (frame >= framesLength - 1) {
            // reset and stop playing
            this.frameData = { ...this.frameData, frame: 0 }
            this.setState({ playing: false })
        } else {
            // Increment frames and draw
            let newFrame = frame + 1
            this.frameData = { ...this.frameData, frame: newFrame }
            this.redrawCanvases(newFrame)
        }

        //this.forceUpdate()
        this.animRequestId = window.requestAnimationFrame(this.update)
    }

    redrawCanvases(frame) {
        // only redraw state if data available
        if (this.state.gameData) {

            let curFrame = this.state.gameData.frames[frame]
            if (!curFrame) return;
            let aiPath = curFrame.tanks[0].ai_path

            const reverse = (array) => {
                return array.map((item, i) => array[array.length-1-i])
            }

            this.editorCanvas.setHighlightPath(reverse(aiPath))

            this.replayCanvas.setFrame(frame)
            this.replayCanvas.draw()
        }
    }


    resizeCanvas() {
        this.replayCanvas.updateSize()
        this.editorCanvas.updateSize()
    }

    handleSlideChange(event, newValue) {
        let progress = newValue
        let { framesLength } = this.frameData

        let newFrame = parseInt((framesLength / 10000) * progress)
        this.frameData = { ...this.frameData, frame: newFrame }

        if (!this.state.playing) {
            this.redrawCanvases(newFrame)
        }

        this.forceUpdate()
    }

    handlePlayButtonChange(event) {
        if (!this.state.playing) {
            this.setState({ playing: true })
        } else {
            this.setState({ playing: false })
        }
    }



    render() {
        let { classes } = this.props
        // calculate progress
        let { frame, framesLength } = this.frameData
        let progress = parseInt((frame / framesLength) * 10000)

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
                        <div ref={this.replayContainer} className={classes.matchContainer}></div>
                        <ReplayControls {...props} />
                    </div>
                    <div id="editor-container" className={classes.editorContainer}></div>
                </div>
            </ContentBox>
        )
    }
}

export default withRouter(withStyles(styles)(BotMatchReplay));
