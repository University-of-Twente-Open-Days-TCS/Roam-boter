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
     * API endpoint for RoamBot-er
     */

    API_HOST = "http://localhost:8000"

    constructor() {
        this._csrfToken = null
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
            // Add data to the body of the request
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

    loginUser(teamCode) {
        /**
         * Calls the api to login a session.
         */
        let body = {
            'team_code' : teamCode
        }
        let response = this.callApi('dashboard/enter/', 'POST', body)
        return response
    }

    logoutUser() {
        /**
         * Calls te api to logout a session.
         */
        let response = this.callApi('dashboard/enter/', 'DELETE')
        return response
    }

    getTeamDetail() {
        /**
         * Calls the team detail. If a user is in a team this returns team information.
         */
        let response = this.callApi('dashboard/team/detail/', 'GET')
        return response
    }

    getAiList() {
        /**
         * Gets a list from ai's associated with this request.
         */
        let response = this.callApi('ai/', 'GET')
        return response
    }

    postAI({name, ai}) {
        /**
         * Save AI to the server
         * @param name Name of the ai
         * @param ai JSON representation of AI nodes
         */
        let data = {name, ai}
        let response = this.callApi('ai/', 'POST', data)
        return response
    }

    deleteAI(pk) {
        /**
         * Delete AI from the server
         * @param pk Primary Key of the AI that needs to be deleted.
         */
        let response = this.callApi('ai/'+pk, 'DELETE')
        return response
    }
    

    getAiDetail(pk) {
        /**
         * Gets a specific an AI.
         * @param pk Primary key of the AI to get. 
         * Note that the api will give a 403 response if you do not own the AI object.
         */
        let response = this.callApi('ai/'+pk+'/', 'GET')
        return response
    }

    getMatchHistoryList() {
        /**
         * Gets the match history of a team
         */
        let response = this.callApi('matches/botmatches/', 'GET')
        return response
    }

    playBotMatch({gamemode, bot, ai}) {
        /**
         * Play a match against a bot.
         * @param gamemode Gamemode to play.
         * @param bot Bot's pk to play against.
         * @param ai Ai's pk to play with.
         */
        let data = {gamemode, bot, ai}
        let response = this.callApi('matches/botmatches/', 'POST', data)
        return response
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

}


export default new RoamBotAPI()
