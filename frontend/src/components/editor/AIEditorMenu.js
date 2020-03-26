import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(2, 0),
    },
    menuSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.25rem',
        margin: '0.5rem 0'
    },

    button: {
        width: '80%',
        margin: '0.5rem 0',

        fontSize: '0.5rem',
        [theme.breakpoints.up('md')]: {
            width: '70%',
            fontSize: '1rem'
        }
    }
    
}))

const AIEditorMenu = (props) => {
    const classes = useStyles()
    
    let {addConditionHandler, addActionHandler, saveHandler, deleteHandler } = props
    let ai = props.ai


    return (
        <div className={classes.root}>
            <Typography variant="h4" align="center">{ai ? ai.name : ""}</Typography>
            <div className={classes.menuSection}>
                <Button variant="contained" color="primary" onClick={addConditionHandler} className={classes.button}>Condition</Button>
                <Button variant="contained" color="primary" onClick={addActionHandler} className={classes.button}>Action</Button>
                <Button variant="contained" color="primary" onClick={saveHandler} className={classes.button}>Save</Button>
            </div>
            <div className={classes.menuSection}>
                <Button variant="contained" color="secondary" onClick={deleteHandler} className={classes.button}>Delete</Button>
            </div>
        </div>
    )
}

export default AIEditorMenu