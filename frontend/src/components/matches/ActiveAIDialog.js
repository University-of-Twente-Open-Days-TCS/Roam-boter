import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React, { useCallback } from "react";
import RoamBotAPI from "../../RoamBotAPI";

const ActiveAIDialog = ({ open, handleClose, selectedAI }) => {
    const handleConfirm = async (selectedAI) => {
        handleClose()
        let call = await RoamBotAPI.putActiveAI(selectedAI.pk)
        if(!call.ok){
            window.alert("Could not set active AI")
        }else {
            // refresh the page to prevent looping of active dialog
            window.location.reload()
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">You do not have an active AI yet. Do you want to set this as your active AI?</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {/*TODO: describe what an active AI is and that it's settable in the home screen.*/}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => handleConfirm(selectedAI)} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ActiveAIDialog