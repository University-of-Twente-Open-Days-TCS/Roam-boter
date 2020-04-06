import React, { useState, useEffect } from "react";

import RoambotAPI from '../../RoamBotAPI'

import { Typography, Grid } from '@material-ui/core'

import { AddCircle } from "@material-ui/icons";

import ContentBox from "../layout/ContentBox.js";
import { ButtonList, ButtonListIconLink } from '../layout/ButtonList'
import AIListItem from './AIListItem'



const AIList = props => {

    const [aiList, setAiList] = useState(null)
    

    useEffect(() => {
        async function updateAiList(){
            let call = await RoambotAPI.getAiList()
            let json = await call.json()
            setAiList(json)
        }

        if(aiList === null){
            updateAiList()
        }
    })



    return (
        <ContentBox>

            <Typography variant="h4" align="center">Your AI's</Typography>
            <Grid container justify="center">
                <Grid item xs={12} sm={9} md={6}>
                    <ButtonList>
                        {
                            aiList ? (
                                aiList.map((ai, i) => <AIListItem key={i} ai={ai}></AIListItem>)
                            )   :
                            (
                                null
                            )
                        }

                        <ButtonListIconLink url="/AIEditor">
                            <AddCircle></AddCircle>
                        </ButtonListIconLink>
                    </ButtonList>
                </Grid>
            </Grid>
        </ContentBox>
    )
}

export default AIList;