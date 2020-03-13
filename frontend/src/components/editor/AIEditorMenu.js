import React from 'react'

import Button from '@material-ui/core/Button'


const AIEditorMenu = (props) => {
    
    let addConditionHandler = props.addConditionHandler
    let addActionHandler = props.addActionHandler
    let saveHandler = props.saveHandler


    return (
        <div>
            <div id="ai-editor-menu">
                <Button variant="contained" color="primary" onClick={addConditionHandler}>Add Condition</Button>
                <Button variant="contained" color="primary" onClick={addActionHandler}>Add Action</Button>
                <Button variant="contained" color="primary" onClick={saveHandler}>Save</Button>
            </div>
        </div>
    )
}

export default AIEditorMenu;