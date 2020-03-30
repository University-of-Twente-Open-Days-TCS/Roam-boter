import React, { Component } from 'react';

import RoamBotAPI from './RoamBotAPI.js';

import {
    Route,
} from "react-router-dom";


import Home from "./components/home/Home";
import AIEditor from "./components/editor/AIEditor.js";
import AIList from "./components/editor/AIList";
import Login from "./components/login/Login";
import Structure from "./components/structure/Structure";

import PlayvsBot from "./components/matches/bot/PlayvsBot";
import NewBotMatch from "./components/matches/bot/NewBotMatch";
import BotMatchHistory from './components/matches/bot/BotMatchHistory.js';
import BotMatchReplay from './components/matches/bot/BotMatchReplay.js';

import PlayvsPlayer from "./components/matches/team/PlayvsPlayer";
import NewTeamMatch from "./components/matches/team/NewTeamMatch";
import TeamMatchHistory from './components/matches/team/TeamMatchHistory.js';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            loginAttemptFailed: false,
        };

        // Bind handlers
        this.handleSubmitLogout = this.handleSubmitLogout.bind(this)
        this.toggleFull = this.toggleFull.bind(this)
    }

    componentDidMount() { //TODO: Make async
        document.addEventListener('fullscreenchange', () => this.forceUpdate())

        // Check whether the session is logged in
        RoamBotAPI.getTeamDetail()
            .then((response) => {
                if (response.ok) {
                   this.setState({ loggedIn: true})
                } else {
                    this.setState({ loggedIn: false })
                }
            })
    }

    handleSubmitLogin = async (teamCode) => {
        try {
            let response = await RoamBotAPI.loginUser(teamCode)
            if (response.ok) {
                // get new team details
                this.setState({ loggedIn: true, loginAttemptFailed: false })
            } else {
                this.setState({ loggedIn: false, loginAttemptFailed: true })
            }

        } catch (error) {
            this.setState({ loggedIn: false })
            console.error(error)
        }
    }

    handleSubmitLogout = async () => {
        let response = await RoamBotAPI.logoutUser()
        if (response.ok) {
            this.setState({ loggedIn: false })
        } else {
            window.alert("Something went wrong...")
        }
    }


    toggleFull = () => {
        let fullscreenElement = document.fullscreenElement

        if (fullscreenElement) {
            //exit fullscreen
            document.exitFullscreen()
                .then(() => {
                    this.forceUpdate()
                })

        } else {
            //enter fullscreen
            let body = document.querySelector('body')
            if (body.requestFullscreen) {
                let promise = body.requestFullscreen();
                if (promise) {
                    promise.then(() => this.forceUpdate())
                }
            } else if (body.mozRequestFullScreen) { /* Firefox */
                let promise = body.mozRequestFullScreen();
                if (promise) {
                    promise.then(() => this.forceUpdate())
                }
            } else if (body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                let promise = body.webkitRequestFullscreen();
                if (promise) {
                    promise.then(() => this.forceUpdate())
                }
            } else if (body.msRequestFullscreen) { /* IE/Edge */
                let promise = body.msRequestFullscreen();
                if (promise) {
                    promise.then(() => this.forceUpdate())
                }
            }
        }
    }




    render() {

        // Props to send to layout component. Neccesary for fullscreen option.
        let fullscreen = document.fullscreenElement

        let layoutProps = {
            toggleFull: this.toggleFull,
            isFull: fullscreen
        }

        return (
            (this.state.loggedIn) ?
                (<div>
                    <Structure {...layoutProps}>
                        <Route exact path="/"
                            render={() => <Home handleSubmitLogout={this.handleSubmitLogout}></Home>}
                        />

                        <Route path="/AIEditor/:id?" component={AIEditor} />
                        <Route path="/AIList" component={AIList} />
                        <Route path="/PlayvsBot" component={PlayvsBot} />
                        <Route path="/BotMatchHistory" component={BotMatchHistory} />
                        <Route path="/BotMatchReplay/:matchId/:aiId" component={BotMatchReplay} />
                        <Route path="/NewBotMatch" component={NewBotMatch} />
                        <Route path="/PlayvsPlayer" component={PlayvsPlayer} />
                        <Route path="/NewTeamMatch" component={NewTeamMatch} />
                        <Route path="/TeamMatchHistory" component={TeamMatchHistory} />
                    </Structure>
                </div>)
                :
                (<Login handleSubmit={this.handleSubmitLogin.bind(this)} attemptFailed={this.state.loginAttemptFailed} />)
        );
    }
}

export default App;
