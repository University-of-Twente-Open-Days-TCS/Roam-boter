import React, {Component} from 'react';

import RoamBotAPI from './RoamBotAPI.js';

import {
    Route,
} from "react-router-dom";


import Home from "./components/Home";
import AIEditor from "./components/editor/AIEditor.js";
import MatchHistory from "./components/matches/MatchHistory";
import AIList from "./components/editor/AIList";
import PlayvsBot from "./components/PlayvsBot";
import PlayvsPlayer from "./components/PlayvsPlayer";
import MatchReplay from "./components/matches/MatchReplay";
import Login from "./components/login/Login";

import Structure from "./components/structure/Structure";



class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            AIs: [],
            loggedIn: false,
            loginAttemptFailed: false
        };

        // Bind handlers
        this.handleSubmitLogout = this.handleSubmitLogout.bind(this)
        this.toggleFull = this.toggleFull.bind(this)
    }

    componentDidMount() {
        document.addEventListener('fullscreenchange', () => this.forceUpdate())
       
        // Check whether the session is logged in
        RoamBotAPI.getTeamDetail()
            .then((response) => {
                if (response.ok) {
                    this.setState({loggedIn: true})
                } else {
                    this.setState({loggedIn: false})
                }
            })

    }

    
    handleSubmitLogin = (teamCode) => {
        let response = RoamBotAPI.loginUser(teamCode)
        response
            .then((response) => {
                response.ok ? this.setState({loggedIn: true, loginAttemptFailed: false}) : this.setState({loggedIn: false, loginAttemptFailed: true})
            })
    }

    handleSubmitLogout = () => {
        let response = RoamBotAPI.logoutUser()
        response
            .then((response) => {
                response.ok ? this.setState({loggedIn: false}) : this.setState({loggedIn: true})
            })
    }

    toggleFull = () => {
        let fullscreenElement = document.fullscreenElement

        if (fullscreenElement) {
            //exit fullscreen
            document.exitFullscreen()
                .then(() => {
                    this.forceUpdate()
                })

        }else {
            //enter fullscreen
            let body = document.querySelector('body')
            if (body.requestFullscreen) {
                let promise = body.requestFullscreen();
                if(promise) {
                    promise.then(() => this.forceUpdate())
                }
            } else if (body.mozRequestFullScreen) { /* Firefox */
                let promise = body.mozRequestFullScreen();
                if(promise) {
                    promise.then(() => this.forceUpdate())
                }
            } else if (body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                let promise = body.webkitRequestFullscreen();
                if(promise) {
                    promise.then(() => this.forceUpdate())
                }
            } else if (body.msRequestFullscreen) { /* IE/Edge */
                let promise = body.msRequestFullscreen();
                if(promise) {
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
                            render={(props) => <Home handleSubmitLogout={this.handleSubmitLogout}></Home>}
                        />

                        <Route path="/AIEditor/:id?" component={AIEditor} />
                        <Route path="/AIList" component={AIList}/>
                        <Route path="/MatchHistory" component={MatchHistory}/>
                        <Route path="/PlayvsBot" component={PlayvsBot}/>
                        <Route path="/PlayvsPlayer" component={PlayvsPlayer}/>
                        <Route path="/MatchReplay/:matchId" component={MatchReplay}/>
                    </Structure>
                </div>) 
                    : 
                (<Login handleSubmit={this.handleSubmitLogin.bind(this)} attemptFailed={this.state.loginAttemptFailed}/>)
        );
    }
}

export default App;
