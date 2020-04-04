import React from 'react'
import { useHistory } from 'react-router-dom'

import { ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, makeStyles, IconButton } from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'
import RoamBotAPI from '../../RoamBotAPI'

const useStyles = makeStyles(theme => ({
    listItem: {
        justifyContent: 'center',
        textAlign: 'center',
        margin: '0.75rem 0',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '0.2rem',
    },
}))
const AIListItem = ({ai}) => {

    const history = useHistory()
    const classes = useStyles()

    const deleteHandler = () => {
        let confirmed = window.confirm("Are you sure you want to delete this AI?")
        if (confirmed) {
            let call = RoamBotAPI.deleteAI(ai.pk)
            call.then((response) => {
                if (response.ok){
                    window.location.reload()
                }
            })
        }
    }

    const openAIEditor = () => {
        history.push('/AIEditor/'+ai.pk)
    }

    return (
        <ListItem className={classes.listItem} button onClick={openAIEditor}>
            <ListItemText>
                {ai.name}
            </ListItemText> 

            <ListItemSecondaryAction onClick={deleteHandler}>
                <IconButton aria-label="delete-ai">
                    <DeleteIcon></DeleteIcon>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default AIListItem;