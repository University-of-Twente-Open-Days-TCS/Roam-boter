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


    constructor() {
        this._csrfToken = null
        this.API_HOST = 'http://'+window.location.hostname + ":8000"
    }

    async callApi(url, method, data) {
        /**
         * @param url: url to call API
         * @param method: http method to use
         * @param data: optional data to include. Currenlty only supports JSON
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

    putActiveAI(aiPk){
        /**
         * Sets the active AI of a team.
         * @param aiPk Primary Key of AI to set active
         */
        let response = this.callApi('dashboard/team/detail/', 'PUT', {active_ai_pk: aiPk})
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

    putAI(pk, {name, ai}) {
        /**
         * Update and save AI to the server
         * @param pk Primary Key of the ai
         * @param name Name of the ai
         * @param ai JSON representation of AI nodes
         */
        let data = {name, ai}
        let response = this.callApi('ai/' + pk + '/', 'PUT', data)
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

    getSimulation(pk) {
        /**
         * Gets a simulation.
         * @param pk Primary key of the Simulation to get
         */
        let response = this.callApi('matches/simulation/'+pk+'/', 'GET')
        return response
    }

    getTeamMatchHistoryList() {
        /**
         * Get list team matches played by team associated with this session.
         */
        let response = this.callApi('matches/teammatches/', 'GET')
        return response
    }

    postTeamMatch({gamemode, ai}) {
        /**
         * @param gamemode Gamemode
         * @param ai Primary key of AI to play with
         * Plays a team match. The server selects an opponent.
         * Returns a 423 if no suitable opponent can be found.
         */
        let data = {gamemode: gamemode, initiator_ai: ai}
        let response = this.callApi('matches/teammatches/', 'POST', data)
        return response
    }

    deleteTeamMatch(pk) {
        /**
         * Deletes a team match
         * @param pk primary key of the match to delete
         */
        let response = this.callApi('matches/teammatches/'+pk, 'DELETE')
        return response
    }

    getBotList() {
        /**
         * Gets all bots
         */
        let response = this.callApi('matches/bots/', 'GET')
        return response
    }

    getBotMatchHistoryList() {
        /**
         * Gets the match history of a team
         */
        let response = this.callApi('matches/botmatches/', 'GET')
        return response
    }

    postBotMatch({gamemode, bot, ai}) {
        /**
         * Play a match against a bot.
         * @param gamemode Gamemode to play.
         * @param bot Bot's pk to play against.
         * @param ai AI's primary key to play with.
         */
        let data = {gamemode, bot, ai}
        let response = this.callApi('matches/botmatches/', 'POST', data)
        return response
    }

    getBotMatchDetails(pk) {
        /**
         * Gets details of a bot match including the simulation.
         * @param pk Primary key of the match. 
         * Only returns if you own the bot match.
         */
        let response = this.callApi('matches/botmatches/'+pk+'/', 'GET')
        return response
    }

    deleteBotMatch(pk) {
        /**
         * Deletes a bot match.
         * @param pk Primary Key of the bot match to delete.
         */
        let response = this.callApi('matches/botmatches/'+pk, 'DELETE')
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
                await response.json()
                // Get the newly set cookie.
                csrfCookie = getCookie('csrftoken')
                if (csrfCookie === null){
                    // Something went wrong.
                    throw Error("No csrf Cookie")
                }
            }
            this._csrfToken = csrfCookie
        }
        return this._csrfToken
    }

}


export default new RoamBotAPI()
