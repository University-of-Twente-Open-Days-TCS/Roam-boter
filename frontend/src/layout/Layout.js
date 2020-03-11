import React, {useState} from 'react';
import {
    HashRouter
} from "react-router-dom";
import AIMenuList from "./menu/AIMenuList";
import PlayMenuList from "./menu/PlayMenuList";
import '../css/Layout.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Layout(props) {
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <div id="mySidenav" className={open ? "sidenav open" : "sidenav closed"}>
                <HashRouter>
                <a href="javascript:void(0)" className="closebtn" onClick={handleDrawerClose}>&times;</a>
                <AIMenuList />
                <hr/>
                <PlayMenuList/>
                </HashRouter>
            </div>




            <div id="main" className={open ? "drawer-open" : "drawer-closed"}>
                <span onClick={handleDrawerOpen} style={open ? {visibility: "hidden"} : {visibility: "visible"}}> <FontAwesomeIcon icon={faBars} /> </span>
                <HashRouter>
                    {props.children}
                </HashRouter>
            </div>
        </div>
    );
}