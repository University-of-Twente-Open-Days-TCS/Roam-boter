import React from 'react'

import { ButtonListTextLink } from '../layout/ButtonList'

const AIListItem = ({ai}) => {

    return (
        <ButtonListTextLink url={"/AIEditor/"+ai.pk}>
            {ai.name}
        </ButtonListTextLink>
    )
}

export default AIListItem;