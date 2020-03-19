import React from 'react';
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
        height: '100vh',
        flexGrow: 1,
    },
}));

export default function Structure(props) {
    
    const classes = useStyles()

    let {toggleFull, isFull} = props

    return (

        <div className={classes.root}>
            <CssBaseline/>
            
            <HashRouter>                
                <DrawerMenu toggleFull={toggleFull} isFull={isFull}/>

                <main className={classes.content}>
                    { props.children }
                </main>
            </HashRouter>
        </div>
    )
}