import { getCsrfToken, API_HOST } from '../RoamBotAPI.js'
import React from "react";

const playBotMatch = async function (ai) {
    const response = await fetch(`${API_HOST}/matches/botmatches/`, {
        credentials : 'include',
        method : 'POST',
        headers : {
            'X-CSRFToken' : await getCsrfToken(),
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            gamemode: "DM",
            bot: 1,
            ai: ai
        })
    })
    let data = await response.json()
    return data
}



const ListAIs = ({AIs}) => {
    

    return (
        <div>
            <h1>List of AIs</h1>
            A list of the team's AIs will be visible here.
            <ul>
                TODO: List AIs
            </ul>
        </div>
    );
}

export default ListAIs;
