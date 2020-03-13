import React, {Component} from 'react';
import './css/App.css';
import RoamBotAPI from './RoamBotAPI.js';

import {
    Route,
} from "react-router-dom";
import Home from "./components/Home";
import AIEditor from "./components/editor/AIEditor.js";
import Layout from "./layout/Layout";
import MatchHistory from "./components/matches/MatchHistory";
import AIList from "./components/editor/AIList";
import PlayvsBot from "./components/PlayvsBot";
import PlayvsPlayer from "./components/PlayvsPlayer";
import MatchReplay from "./components/matches/MatchReplay";
import Login from "./login/Login";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFull: false,
            AIs: [],
            loggedIn: false,
            loginAttemptFailed: false
        };

        // Bind handlers
        this.handleSubmitLogout = this.handleSubmitLogout.bind(this)
        this.toggleFull = this.toggleFull.bind(this)
    }

    componentDidMount() {
        // Fullscreen listener
        document.onfullscreenchange = (event) => {
            console.log(event)
        }

       
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
        // Toggles fullscreen
    }




    render() {

        // Props to send to layout component. Neccesary for fullscreen option.
        let layoutProps = {
            toggleFull: this.toggleFull,
            isFull: this.state.isFull
        }

        return (
            (this.state.loggedIn) ? 
                (<div>

                        <div>
                            <Layout {...layoutProps}>
                                <Route exact path="/" 
                                    render={(props) => <Home handleSubmitLogout={this.handleSubmitLogout}></Home>}
                                />

                                <Route path="/AIEditor/:id?" component={AIEditor} />
                                <Route path="/AIList" component={AIList}/>
                                <Route path="/MatchHistory" component={MatchHistory}/>
                                <Route path="/PlayvsBot" component={PlayvsBot}/>
                                <Route path="/PlayvsPlayer" component={PlayvsPlayer}/>
                                <Route path="/MatchReplay/:matchId" component={MatchReplay}/>
                            </Layout>
                        </div>
                </div>) 
                    : 
                (<Login handleSubmit={this.handleSubmitLogin.bind(this)} attemptFailed={this.state.loginAttemptFailed}/>)
        );
    }
}

export default App;
