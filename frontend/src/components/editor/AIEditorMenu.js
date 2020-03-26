import React from 'react'


import { Button, Typography} from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/core/styles'

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
    
    let { addConditionHandler, addActionHandler, handleSave, handleSaveAsNew, handleDelete } = props
    let ai = props.ai

    const theme = useTheme()
    const bigScreen = useMediaQuery(theme.breakpoints.up('md'))


    return (
        <div className={classes.root}>
            <Typography variant={bigScreen ? "h4" : "h6"} align="center">{ai ? ai.name : ""}</Typography>

            <div className={classes.menuSection}>
                <Button variant="contained" color="primary" onClick={addConditionHandler} className={classes.button}>Condition</Button>
                <Button variant="contained" color="primary" onClick={addActionHandler} className={classes.button}>Action</Button>
            </div>

            <div className={classes.menuSection}>
                <Button variant="contained" color="primary" disabled={ai ? false : true}  onClick={handleSave} className={classes.button}>Save</Button>
                <Button variant="contained" color="primary" onClick={handleSaveAsNew} className={classes.button}>Save as new</Button>
            </div>

            <div className={classes.menuSection}>
                <Button variant="contained" color="secondary" onClick={handleDelete} className={classes.button}>Delete</Button>
            </div>
        </div>
    )
}

export default AIEditorMenu