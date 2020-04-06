import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles'

import ReplayCanvas from "./ReplayCanvas";
import ContentBox from '../../layout/ContentBox'
import ReplayControls from './ReplayControls'
import AIReplayCanvas from "../AIReplayCanvas";
import MatchReplayHeader from './MatchReplayHeader'

import RoamBotAPI from "../../../RoamBotAPI"


const styles = theme => ({
    wrapper: {
        display: 'flex',
        minHeight: '100%',
        height: 'auto',

        borderBottom: 'solid 1px rgba(0,0,0,0.2)',
    },
    matchWrapper: {
        position: 'relative',

        display: 'flex',
        flexDirection: 'column',
        width: '70%',
        height: 'auto',

        padding: theme.spacing(1),

        borderRight: 'solid 1px rgba(0,0,0,0.2)',
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
        overflow: 'hidden',

        backgroundImage: 'url("/ai_editor_images/Seamless-Circuit-Board-Pattern.svg")',
        backgroundRepeat: 'repeat',
        backgroundSize: '4000px',
    },
})


class MatchReplay extends Component {

    SLIDER_MAX = 10000

    MATCH_TYPES = {
        BOTMATCH: 'botmatch',
        TEAMMATCH: 'teammatch'
    }

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
            match: null,
            matchKind: null,

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
        const kind = this.props.match.params.matchKind;

        let matchKind
        switch(kind){
            case "botmatch":
                matchKind = this.MATCH_TYPES.BOTMATCH
                break
            case "teammatch":
                matchKind = this.MATCH_TYPES.TEAMMATCH
                break
            default:
                matchKind = null
                console.error('Not an appropriate matchkind')
                break
        }

        let fetchedMatchInfo = await this.fetchMatchInfo(matchKind, match_id)

        if (!fetchedMatchInfo) {
            // go to home if something went wrong.
            console.alert("Something went wrong. Could not get match data")
            this.props.history.push('/')
        }

        let {match, ai} = fetchedMatchInfo

        let matchContainer = this.replayContainerRef.current

        let replayCanvas = new ReplayCanvas(matchContainer, match.simulation.simulation)
        let editorCanvas = new AIReplayCanvas('editor-container')

        // TODO: tankId ophalen + meegeven, bij BotMatches ben je altijd tank 0
        this.replayCanvas = replayCanvas
        this.editorCanvas = editorCanvas

        // Fill editor canvas with AI
        editorCanvas.fillCanvas(ai)
        
        window.addEventListener('resize', this.resizeCanvas)
        window.addEventListener('load', this.resizeCanvas)
        window.addEventListener('orientationchange', this.resizeCanvas)


        this.frameData = {
            ...this.frameData,
            framesLength: this.replayCanvas.getFramesLength()
        }

        // Finally set the state of everything

        this.setState({ match: match, matchKind: matchKind }, () => {
            this.resizeCanvas()
            replayCanvas.draw()
        })
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

    async fetchMatchInfo(matchKind, matchPk) {
        /**
         * Fetches all relevant match info.
         * @param matchKind MATCH_TYPE to get data from
         * @param matchPk id of the match to get.
         * @returns dictionary with match, ai and simulation data.
         */
        
        let types = this.MATCH_TYPES
        try {
            let match
            let aiPk

            switch (matchKind){
                case types.BOTMATCH:
                    let botmatchCall = await RoamBotAPI.getBotMatchDetails(matchPk)
                    let botmatchJson = await botmatchCall.json()
                    match = botmatchJson

                    // inject some extra data into the json.
                    match.generalInfo = {
                        player: botmatchJson.team.team_name,
                        opponent: botmatchJson.bot.name
                    }

                    aiPk = botmatchJson.ai.pk
                    break
                case types.TEAMMATCH:
                    let teammatchCall = await RoamBotAPI.getTeamMatchDetail(matchPk)
                    let teammatchJson = await teammatchCall.json()
                    match = teammatchJson

                    // inject some extra data into the json.
                    match.generalInfo = {
                        player: teammatchJson.initiator.team_name,
                        opponent: teammatchJson.opponent.team_name
                    }

                    aiPk = teammatchJson.initiator_ai.pk
                    break
                default:
                    throw new Error("INVALID MATCH TYPE")
            }

            // convert simulation data to actual object
            match.simulation.simulation = JSON.parse(match.simulation.simulation)

            let aiCall = await RoamBotAPI.getAiDetail(aiPk)
            let aiJson = await aiCall.json()
            let ai = await JSON.parse(aiJson.ai)

            return {match, ai}


        } catch(err){
            window.alert("Something went wrong")
            console.error(err)
            return null
        }
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
        if (this.state.match.simulation.simulation) {
            let gameData = this.state.match.simulation.simulation

            let curFrame = gameData.frames[frame]
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
            <ContentBox noPadding>

                <div className={classes.wrapper}>

                    <div className={classes.matchWrapper}>
                        <MatchReplayHeader match={this.state.match}></MatchReplayHeader>
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

export default withRouter(withStyles(styles)(MatchReplay));
