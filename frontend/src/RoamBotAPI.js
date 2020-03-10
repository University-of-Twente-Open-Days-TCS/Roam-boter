const API_HOST = "http://localhost:8000"

let _csrfToken = null

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


    async function getCsrfToken() {
    
        /** Returns the csrftoken cookie. If the cookie is not present it will ping the server to set the cookie. **/
    
        if (_csrfToken === null) {
            let csrfCookie = getCookie('csrftoken')
            if (csrfCookie === null){
                // Cookie is not set. Ping the server to set the cookie.
                const response = await fetch(`${API_HOST}/csrf/`, {
                    credentials: 'include'
                })
                let data = await response.json()
                // Get the newly set cookie.
                csrfCookie = getCookie('csrftoken')
                if (csrfCookie === null){
                    // Something went wrong.
                    throw "No csrf Cookie"
                }
            }
            _csrfToken = csrfCookie
        }
        return _csrfToken
    }


class RoamBotAPI {
    /*
     * This class handles interaction with the backend API
     */

    constructor() {
        // get csrf token
        this._csrfToken = null
    }


}

export {getCsrfToken, API_HOST}
