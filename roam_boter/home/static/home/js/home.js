/*
 * This is an example for using javascript to call the back-end API. 
 */
$(document).ready(function () {
    $('#save-ai-button').on("click", saveAI)
})

// sends the ai to the server.
function saveAI() {
    postAI().then((data) => {
        console.log({data})
    })
}

async function postAI() {
    const response = await fetch("/ai/save", {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json',
            'X_CSRFTOKEN' : getCsrfToken()
        },
        body: JSON.stringify({ data : "data-to-send" })
    })
    return await response.json()
}



