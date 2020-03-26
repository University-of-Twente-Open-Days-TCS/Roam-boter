import React from 'react'

import {Dialog, DialogTitle, List, ListItem, ListItemText } from '@material-ui/core'


const SelectAIDialog = ({ais, handleClose, open, handleClick}) => {

    return (
        <Dialog fullWidth={true} maxWidth="sm" onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Select AI</DialogTitle>
            <List>
                {ais.map(ai => (
                    <ListItem button onClick={() => handleClick(ai)} key={ai.pk}>
                        <ListItemText primary={ai.name}/>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    )
} 

export default SelectAIDialog;