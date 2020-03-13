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
        height: '100vh',
        flexGrow: 1,
    },
}));

export default function Layout(props) {
    
    const classes = useStyles()

    return (

        <div className={classes.root}>
            <CssBaseline/>
            
            <HashRouter>                
                <DrawerMenu />

                <main className={classes.content}>
                    { props.children }
                </main>
            </HashRouter>
        </div>
    )
}