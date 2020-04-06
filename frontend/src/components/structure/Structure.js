import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import { HashRouter } from "react-router-dom";

import DrawerMenu from './menu/DrawerMenu'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    menuButton: {
        marginRight: 36,
    },
    content: {
        /* Content Max height */
        backgroundColor: 'white',
        overflowX: 'hidden', 
        flexGrow: 1,
    },
}));

export default function Structure(props) {
    
    const classes = useStyles()
    let {toggleFull, isFull} = props


    const [height, setHeight] = useState(null)

    const adjustHeight = () => {
        let height = window.innerHeight
        setHeight(height)
    }
    
    useEffect(() => {
        if(height === null) {
            window.addEventListener('resize', adjustHeight)
            window.addEventListener('load', adjustHeight)
            window.addEventListener('orientationchange', adjustHeight)
            adjustHeight()
        }
    })

    return (

        <div className={classes.root}>
            <CssBaseline/>
            
            <HashRouter>                
                <DrawerMenu toggleFull={toggleFull} isFull={isFull}/>

                <main className={classes.content} style={{height: height}}>
                    { props.children }
                </main>
            </HashRouter>
        </div>
    )
}