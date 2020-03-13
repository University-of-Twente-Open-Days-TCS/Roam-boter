import React from 'react';

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";

import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'

const FullscreenMenuItem = (props) => {
    
    let isFull = props.isFull
    console.log(isFull)
    let toggleFull = props.toggleFull


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