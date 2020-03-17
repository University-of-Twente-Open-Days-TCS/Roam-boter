import React from "react";
import { NavLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";

import {Adb, Person} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    padding: {
        padding: '0 0'  //remove list padding
    }
}))

export default function PlayMenuList(text) {
    let classes = useStyles()

    const items = [
        {
            text: "Play versus Bot",
            icon: <Adb/>,
            url: "/PlayvsBot"
        },
        {
            text: "Play versus Player",
            icon: <Person/>,
            url: "/PlayvsPlayer"
        },

    ];

    return (

        <List disablePadding={true}>
            {
                items.map(({text, icon, url}, i) =>
                    <NavLink to={url} key={i}>
                        <ListItem button key={i}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItem>
                    </NavLink>
                )
            }
        </List>
    );
}