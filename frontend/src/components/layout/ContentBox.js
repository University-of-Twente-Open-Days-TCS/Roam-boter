import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

/**
 * ContentBox 
 */


const useStyles = makeStyles(theme => ({
    content: {
        display: 'block',
        height: '100%',
        width: '100%',
        padding: theme.spacing(3)
    }
}))

const ContentBox = (props) => {

    let classes = useStyles()

    return (
        <div className={classes.content}>
            {props.children}
        </div>
    )
}

export default ContentBox;