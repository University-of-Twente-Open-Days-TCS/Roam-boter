import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
    AIMenu: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        padding: '0.5rem'
    },
    Button: {
        width: '70%',
        margin: '0.5rem 0',

        fontSize: '0.6rem',
        [theme.breakpoints.up('md')]: {
            fontSize: '1rem'
        }
    }
    
}))

const AIEditorMenu = (props) => {
    const classes = useStyles()
    
    let addConditionHandler = props.addConditionHandler
    let addActionHandler = props.addActionHandler
    let saveHandler = props.saveHandler


    return (
        <div>
            <div className={classes.AIMenu}>
                <Button variant="contained" color="primary" onClick={addConditionHandler} className={classes.Button}>Condition</Button>
                <Button variant="contained" color="primary" onClick={addActionHandler} className={classes.Button}>Action</Button>
                <Button variant="contained" color="primary" onClick={saveHandler} className={classes.Button}>Save</Button>
            </div>
        </div>
    )
}

export default AIEditorMenu