import React, { useImperativeHandle, useRef, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton'

import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'

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


const ReplayControls = React.forwardRef((props, ref) => {
    let classes = useStyles()

    const sliderRef = useRef()
    const [progress, setProgress] = useState(0)

    let { handleSlideChange, handlePlayButtonChange, playing, sliderMax} = props

    useImperativeHandle(ref, () => ({
        setSliderProgress: progress => {
            /**
             * Sets the progress sliders' position
             * @param progress position to set slider
             * This imperative handle allows for parents to control when this component rerenders.
             */
            setProgress(progress)
        }
    }))
    
    let playButton = (playing ? 
            <PauseIcon fontSize='default'/>
        : 
            <PlayArrowIcon fontSize='default'/> 
            )
    
    return (
        <div className={classes.root}>
            <div className={classes.sliderWrapper}>
                <Slider ref={sliderRef} value={progress} onChange={handleSlideChange} min={0} max={sliderMax} aria-labelledby="continuous-slider" className={classes.slider}/>
            </div>
            <span style={{marginLeft: '0.5rem'}}></span>
            <IconButton onClick={handlePlayButtonChange} color="primary">
                {playButton}
            </IconButton>
        </div>
    )
})


export default ReplayControls