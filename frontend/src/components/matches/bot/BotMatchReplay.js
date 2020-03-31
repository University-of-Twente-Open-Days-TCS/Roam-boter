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
        height: 'auto',
    },
    matchWrapper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '70%',
        height: 'auto',
    },
    matchContainer: {
        display: 'block',
        position: 'relative',
    },
    editorWrapper: {
        display: 'block',
        minHeight: '100%',
        maxHeigth: '100%',
        flexGrow: 1,
    },
    editorContainer: {
        backgroundColor: '#f6f6f6',
        overflow: 'hidden',
    },
})


class BotMatchReplay extends Component {

    SLIDER_MAX = 10000

    constructor(props) {
        super(props)

        this.replayContainerRef = React.createRef()
        this.controlsRef = React.createRef();
        this.editorWrapperRef = React.createRef()


        //For optimization reasons. The frameData is outside of the Component's State.
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
        this.resizeCanvas = this.resizeCanvas.bind(this)
        this.update = this.update.bind(this)
    }

    async componentDidMount() {
        // selects the id of the match from the URL
        const match_id = this.props.match.params.matchId;
        const ai_id = this.props.match.params.aiId;

        let { ai, gameData } = await this.fetchMatchInfo(match_id, ai_id)
        this.ai = ai

        let matchContainer = this.replayContainerRef.current

        let replayCanvas = new ReplayCanvas(matchContainer, gameData)
        let editorCanvas = new AIReplayCanvas('editor-container')

        // TODO: tankId ophalen + meegeven, bij BotMatches ben je altijd tank 0
        this.replayCanvas = replayCanvas
        this.editorCanvas = editorCanvas

        // Fill editor canvas with AI
        editorCanvas.fillCanvas(this.ai)
        
        window.addEventListener('resize', this.resizeCanvas)
        window.addEventListener('load', this.resizeCanvas)
        window.addEventListener('orientationchange', this.resizeCanvas)


        this.frameData = {
            ...this.frameData,
            framesLength: this.replayCanvas.getFramesLength()
        }

        this.setState({ gameData: gameData })

        this.resizeCanvas()
        replayCanvas.draw()
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
        if(this.animRequestId) window.cancelAnimationFrame(this.animRequestId)
        // Remove listeners
        window.removeEventListener('resize', this.resizeCanvas)
        window.removeEventListener('load', this.resizeCanvas)
        window.removeEventListener('orientationchange', this.resizeCanvas)
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
            this.controlsRef.current.setSliderProgress(this.calculateProgressFromFrame(newFrame))
            this.redrawCanvases(newFrame)
            // animation callback
            this.animRequestId = window.requestAnimationFrame(this.update)
        }
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
        let editorWrapper = this.editorWrapperRef.current
        // Reset size. We need to do this, to make sure the flexbox takes the size of the replayContainer.
        this.editorCanvas.updateSize(1,1)

        let height = editorWrapper.offsetHeight
        let width = editorWrapper.offsetWidth
        this.editorCanvas.updateSize(width, height)    
    }

    handleSlideChange(event, newValue) {
        let progress = newValue
        let frame = this.calculateFrameFromProgress(progress)
        this.frameData = { ...this.frameData, frame: frame }

        if (!this.state.playing) {
            // only redraw if not playing. Otherwise the update function will take care of drawing.
            this.redrawCanvases(frame)
        }

        // change position of slider imperatively (This is done for performance reasons)
        this.controlsRef.current.setSliderProgress(progress)
    }

    handlePlayButtonChange(event) {
        if (!this.state.playing) {
            this.setState({ playing: true })
        } else {
            this.setState({ playing: false })
        }
    }

    calculateFrameFromProgress = progress   => parseInt((this.frameData.framesLength / this.SLIDER_MAX) * progress)
    calculateProgressFromFrame = frame      => parseInt((frame / this.frameData.framesLength) * this.SLIDER_MAX)

    render() {
        let { classes } = this.props
        // calculate progress

        let props = {
            playing: this.state.playing,
            handleSlideChange: this.handleSlideChange,
            handlePlayButtonChange: this.handlePlayButtonChange,
            sliderMax: this.SLIDER_MAX,
        }

        return (
            <ContentBox>
                <div className={classes.wrapper}>
                    <div className={classes.matchWrapper}>
                        <div ref={this.replayContainerRef} className={classes.matchContainer}></div>
                        <ReplayControls ref={this.controlsRef} {...props} />
                    </div>
                    <div ref={this.editorWrapperRef} className={classes.editorWrapper}>
                        <div id="editor-container" className={classes.editorContainer}></div>
                    </div>
                </div>
            </ContentBox>
        )
    }
}

export default withRouter(withStyles(styles)(BotMatchReplay));
