window.onload = initializeDashboard()

var csrfToken

function initializeDashboard() {
    // Get CSRF token for API calls
    csrfToken = getCsrfToken()

    // Add event listeners to the buttons
    let closeWorkshopButton = document.getElementById("close-workshop-button")
    if (closeWorkshopButton) closeWorkshopButton.addEventListener("click", closeWorkshop)

    let openWorkshopButton = document.getElementById("open-workshop-button")
    if (openWorkshopButton) openWorkshopButton.addEventListener("click", openWorkshop)

    let generateTeamCodesButton = document.getElementById("generate-team-codes-button")
    if (generateTeamCodesButton) generateTeamCodesButton.addEventListener("click", generateTeamCodes)

}

// First confirms with user and then closes the current workshop
function closeWorkshop() {
    if(window.confirm("Are you sure you want to close the workshop?")){
        closeWorkshopCall().then((response) => {
            console.log(response)
            location.reload()
        })
    }
}

async function closeWorkshopCall() {

    const response = await fetch("/dashboard/close/", {
        method: "POST",
        headers: {
            'X_CSRFTOKEN' : csrfToken
        }
    })

    let data = await response.json()
    return data
}


// Requests the server to open a new workshop
function openWorkshop() {
    openWorkshopCall().then(() => location.reload())
}


async function openWorkshopCall() {

    const response = await fetch("/dashboard/open/", {
        method: "POST",
        headers: {
            'X_CSRFTOKEN' : csrfToken
        }
    })
    
    let data = await response.json()
    return data
}

function generateTeamCodes(event) {
    event.preventDefault()
    
    // Get amount from form
    amount = document.querySelector('#generate-form input[name="amount"]').value
    generateTeamCodesCall(amount).then(response => {
        location.reload()
    })  
}

/* 
 * Calls the api to generate new team codes.
 */
async function generateTeamCodesCall(amount){
    // Prepare form data for proper POST request
    let formData = new FormData()
    formData.append("amount", amount)

    const response = await fetch("/dashboard/generate/", {
        method: "POST",
        headers: {
            'X_CSRFTOKEN' : csrfToken
        },
        body: formData 
    })

    let data = await response.json()
    return data
}



