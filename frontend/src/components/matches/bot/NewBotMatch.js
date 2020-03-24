import React, { useState, useEffect } from 'react'

import RoambotAPI from '../../../RoamBotAPI'

import ContentBox from '../../layout/ContentBox'
import { Typography, Button } from '@material-ui/core'

const NewBotMatch = props => {

    // TODO: Remove this code and make a proper selection screen for the AI and the Bot
    let [aiList, setAiList] = useState(null)

    useEffect(() => {
        async function updateAiList(){
            let call = await RoambotAPI.getAiList()
            let json = await call.json()
            setAiList(json)
        }
        // only update if ai list is unset
        if(aiList === null){
            updateAiList()
        }
    })

    const playMatch = async pk => {
        let call = RoambotAPI.postBotMatch({
            gamemode: 'DM',
            bot: 1,
            ai: pk
        })
        call.then((response) => {
            if (response.ok){
                alert("Simulation Successfull")
            }else {
                alert("Error See Console")
            }
        })
    }

    let aiItems = aiList ? // will be removed
                    aiList.map((ai, i) => {
                        return  (<div key={ai.pk}>
                                    <Button variant="contained" onClick={() => playMatch(ai.pk)}>{ai.name}</Button><br></br><br></br>
                                </div>)
                    })
                    :
                    null

    
    return (
        <ContentBox>
            <Typography variant="h4" align="center">New Bot Match</Typography>
            <div style={{ // This needs to be changed
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {aiItems}
            </div>
        </ContentBox>
    )
}

export default NewBotMatch;