import React, {useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear'


import { HashRouter } from "react-router-dom";

import FullscreenMenuItem from './menu/FullscreenMenuItem'
import AIMenuList from "./menu/AIMenuList";
import PlayMenuList from "./menu/PlayMenuList";


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: theme.spacing(1, 1),
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function Layout(props) {
    
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleToggleDrawer = () => {
        open ? setOpen(false) : setOpen(true)
    };


    return (

        <div className={classes.root}>
            <CssBaseline/>
            
            <HashRouter>
                {/** DRAWER */}
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={handleToggleDrawer}>
                            {open ? <ClearIcon/> : <MenuIcon/> }
                        </IconButton>
                    </div>
                    <Divider/>
                    <AIMenuList/>
                    <Divider/>
                    <PlayMenuList/>
                    <FullscreenMenuItem {...props} />
                    
                </Drawer>

                {/** MAIN CONTENT */}
                <main className={classes.content}>
                    { props.children }
                </main>
            </HashRouter>
        </div>
    );
}