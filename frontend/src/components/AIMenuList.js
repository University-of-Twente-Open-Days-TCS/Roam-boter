import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import React from "react";
import List from "@material-ui/core/List";
import {Add, Create, History} from "@material-ui/icons";


export default function AIMenuList(text) {
    const items = [
        {
            text: "Create new AI",
            icon: <Add/>
        },
        {
            text: "Edit existing AI",
            icon: <Create/>
        },
        {
            text: "View match history",
            icon: <History/>
        }
    ];

    return (
        <List>
            {
                items.map(({text, icon}) =>
                    <ListItem button key={text}>
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={text}/>
                    </ListItem>)
            }
        </List>
    );
}
