import React from 'react'

import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles'

/**
 * ContentBox 
 */


const useStyles = makeStyles(theme => ({
    content: {
        display: 'block',
        position: 'relative',
        height: '100%',
        width: '100%',
    },
    padding: {
        padding: theme.spacing(3)
    }
}))

const ContentBox = (props) => {

    let classes = useStyles()

    if(props.noPadding) {
        return (
            <div className={classes.content}>
                {props.children}
            </div>
        )
    }

    return (
        <div className={clsx(classes.content, classes.padding)}>
            {props.children}
        </div>
    )
}

export default ContentBox;