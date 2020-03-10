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


class RoamBotAPI {
    /*
     * This class handles interaction with the backend API
     */


    constructor() {
        this.API_HOST = "http://localhost:8000"
        this._csrfToken = null
    }

    async _getCsrfToken() {
        /** Returns the csrftoken cookie. If the cookie is not present it will ping the server to set the cookie. **/
        if (this._csrfToken === null) {
            let csrfCookie = getCookie('csrftoken')

            if (csrfCookie === null){
                // Cookie is not set. Ping the server to set the cookie.
                const response = await fetch(`${this.API_HOST}/csrf/`, {
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
            this._csrfToken = csrfCookie
        }
        return this._csrfToken
    }

    async callApi(url, method, data) {
        /**
         * url: url to call API
         * method: http method to use
         * data: optional data to include. Currenlty only supports JSON
         */
        let headers = {}
        headers['Content-Type'] = 'application/json'

        if(method === "POST" || method === "PUT" || method === "DELETE"){
            // Set csrf token
            let csrfToken = await this._getCsrfToken()    
            headers['X-CSRFToken'] = csrfToken
        }

        let options = {}
        options.method = method
        options.credentials = 'include'
        options.headers = headers


        if (data !== null) {
            options.body = JSON.stringify(data)
        }

        let response = await fetch(`${this.API_HOST}/`+url, options)

        return response
    }

    testAPI() {
        /**
         * Returns a promise that if resolves if successful
         */
        let response = this.callApi('test/', 'POST')
        return response
    }

    async loginUser(teamCode) {
        /**
         * Calls the api to login a session.
         */
        let body = {
            'team_code' : teamCode
        }
        let response = await this.callApi('dashboard/enter/', 'POST', body)
        return response
    }

    async logoutUser() {
        /**
         * Calls te api to logout a session.
         */
        let response = await this.callApi('dashboard/enter/', 'DELETE')
        return response
    }

    async checkLogin(handler) {
        /**
         * Calls the team detail
         */
    }


    


}


let roamBotAPI = new RoamBotAPI()

export default roamBotAPI 
