import React from 'react';

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";

import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'

const FullscreenMenuItem = (props) => {
    
    let isFull = props.isFull
    let toggleFull = props.toggleFull

    let body = document.querySelector('body')
    let fullscreenCapability = (body.requestFullscreen || body.mozRequestFullscreen || body.webkitRequestFullscreen || body.msRequestFullscreen )

    if (!fullscreenCapability) {
        return null
    }
    
    return isFull ?  
        (
            <ListItem button onClick={toggleFull}>
                <ListItemIcon><FullscreenExitIcon/></ListItemIcon>
                <ListItemText primary="Exit fullscreen"/>
            </ListItem>
        )
    : 
        (
            <ListItem button onClick={toggleFull}>
                <ListItemIcon><FullscreenIcon/></ListItemIcon>
                <ListItemText primary="Go fullscreen"/>
            </ListItem>
        )
       
}

export default FullscreenMenuItem;