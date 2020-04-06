import React from 'react'
import { NavLink } from 'react-router-dom'

import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core'

/**
 * Custom Button List components.
 */

const useStyles = makeStyles(theme => ({
    list: {
        padding: theme.spacing(2),
    },
    listItem: {
        justifyContent: 'center',
        textAlign: 'center',
        margin: '0.75rem 0',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '0.2rem',
    },
    listItemText: {
        margin: '0',
    },
    noIconPadding: {
        minWidth: '0',
    }
}))

// General List component
const ButtonList = props => {
    let classes = useStyles()

    return (
        <List className={classes.list}>
            {props.children}
        </List>
    )
}

// Text button navlink
const ButtonListTextLink = ({ url, children }) => {
    let classes = useStyles()

    return (
        <NavLink to={url}>
            <ListItem button className={classes.listItem}>
                <ListItemText className={classes.listItemText}>
                    {children}
                </ListItemText>
            </ListItem>
        </NavLink>
    )

}

// Icon button navlink
const ButtonListIconLink = (props) => {
    let classes = useStyles()

    let noIconPadding = props.noIconPadding ? classes.noIconPadding : false


    return (
        <NavLink to={props.url}>
            <ListItem button className={classes.listItem}>
                <ListItemIcon className={clsx(noIconPadding)}>
                    {props.children}
                </ListItemIcon>
            </ListItem>
        </NavLink>
    )
}

const ButtonListLink = ({url, children}) => {
    let classes = useStyles()

    return (
        <NavLink to={url}>
            <ListItem button className={classes.listItem}>
                {children}
            </ListItem>
        </NavLink>
    )

}


export {ButtonList, ButtonListTextLink, ButtonListIconLink, ButtonListLink}
