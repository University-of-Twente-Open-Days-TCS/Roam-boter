import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton'

import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'

const sliderMax = 10000

const useStyles = makeStyles(theme =>({
    root: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-around',
    },
    sliderWrapper: {
        display: 'flex',
        alignItems: 'center',
        width: '80%'
    },
}))


const ReplayControls = props => {
    let classes = useStyles()

    let { handleSlideChange, handlePlayButtonChange, playing, progress} = props

    const handleChange = (event, newValue) => {
        handleSlideChange(event, newValue)
    }
    
    let playButton = (playing ? 
            <PauseIcon fontSize='default'/>
        : 
            <PlayArrowIcon fontSize='default'/> 
            )

    
    return (
        <div className={classes.root}>
            <div className={classes.sliderWrapper}>
                <Slider value={progress} onChange={handleChange} min={0} max={sliderMax} aria-labelledby="continuous-slider" className={classes.slider}/>
            </div>
            <span style={{marginLeft: '0.5rem'}}></span>
            <IconButton onClick={handlePlayButtonChange} color="primary">
                {playButton}
            </IconButton>
        </div>
    )
}


export default ReplayControls