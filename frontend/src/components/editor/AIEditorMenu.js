import React from 'react'

import Button from '@material-ui/core/Button'


const AIEditorMenu = (props) => {
    
    let addConditionHandler = props.addConditionHandler
    let addActionHandler = props.addActionHandler
    let saveHandler = props.saveHandler


    return (
        <div>
            <div id="ai-editor-menu">
                <Button variant="outlined" onClick={addConditionHandler}>Add Condition</Button>
                <Button variant="outlined" onClick={addActionHandler}>Add Action</Button>
                <Button variant="outlined" onClick={saveHandler}>Save</Button>
            </div>
        </div>
    )
}

export default AIEditorMenu;