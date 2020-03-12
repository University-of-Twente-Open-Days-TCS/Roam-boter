import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import React from "react";
import List from "@material-ui/core/List";
import {Add, Create, History, Home} from "@material-ui/icons";
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
            text: "Create new AI",
            icon: <Add/>,
            url: "/AIEditor"
        },
        {
            text: "Edit existing AI",
            icon: <Create/>,
            url: "/AIList"
        },
        {
            text: "View match history",
            icon: <History/>,
            url: "/MatchHistory"
        }
    ];

    return (

        <List>
            {
                items.map(({text, icon, url}, i) =>
                    <NavLink to={url} key={i}>
                        <ListItem button key={i}>

                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text}/>

                        </ListItem>
                    </NavLink>)
            }
        </List>
    );
}
