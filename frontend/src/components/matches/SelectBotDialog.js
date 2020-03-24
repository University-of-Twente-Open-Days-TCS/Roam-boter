import React from 'react'

import {Dialog, DialogTitle, List, ListItem, ListItemText} from '@material-ui/core'



const SelectBotDialog = ({bots, handleClose, open, handleClick}) => {
    return (
        <Dialog fullWidth={true} maxWidth="sm" onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Select Bot</DialogTitle>
            <List>
                {bots.map(bot => (
                    <ListItem button onClick={() => handleClick(bot)} key={bot.pk}>
                        <ListItemText primary={bot.name}/>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    )
}

export default SelectBotDialog;