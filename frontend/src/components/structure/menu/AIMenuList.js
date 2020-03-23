import React from "react";

import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";

import {Home, Memory} from "@material-ui/icons";

import {
    NavLink
} from "react-router-dom";




export default function AIMenuList(text) {
    const items = [
        {
            text: "Home",
            icon: <Home/>,
            url: "/"
        },
        {
            text: "Edit existing AI",
            icon: <Memory/>,
            url: "/AIList"
        },
    ];

    return (

        <List disablePadding={true}>
            {
                items.map(({text, icon, url}, i) =>
                    <NavLink to={url} key={i} replace>
                        <ListItem button key={i}>

                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text}/>

                        </ListItem>
                    </NavLink>)
            }
        </List>
    );
}
