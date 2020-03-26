import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React from "react";
import RoamBotAPI from "../../RoamBotAPI";

const ActiveAIDialog = ({ open, handleDeny, selectedAI }) => {
    const handleConfirm = async (selectedAI) => {
        handleDeny()
        console.log(selectedAI)
        let call = await RoamBotAPI.putActiveAI(selectedAI.pk)
        if(!call.ok){
            console.error("Could not set active AI")
            // setSnackbar({
            //     message: "Could not set active AI",
            //     error: true,
            //     open: true
            // })
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleDeny}
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
                <Button onClick={handleDeny} color="primary">
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