import React, {Component} from 'react';
import './css/App.css';
import RoamBotAPI from './RoamBotAPI.js';
import Fullscreen from "react-full-screen";

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
        };

        // Bind handlers
        this.handleSubmitLogout = this.handleSubmitLogout.bind(this)
        this.toggleFull = this.toggleFull.bind(this)
    }

    componentDidMount() {
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
                response.ok ? this.setState({loggedIn: true}) : this.setState({loggedIn: false})
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
        this.state.isFull ? this.setState({isFull: false}) : this.setState({isFull: true})
    };


    render() {

        // Props to send to layout component. Neccesary for fullscreen option.
        let layoutProps = {
            toggleFull: this.toggleFull,
            isFull: this.state.isFull
        }

        return (
            (this.state.loggedIn) ? (
                <div>
                    <Fullscreen
                        enabled={this.state.isFull}
                        onChange={isFull => this.setState({isFull})}
                    >
                        <div className="full-screenable-node">
                            <Layout {...layoutProps}>
                                <Route exact path="/" 
                                    render={(props) => <Home handleSubmitLogout={this.handleSubmitLogout}></Home>}
                                />
                                <Route path="/AIEditor" component={AIEditor} />
                                <Route path="/AIList" component={AIList}/>
                                <Route path="/MatchHistory" component={MatchHistory}/>
                                <Route path="/PlayvsBot" component={PlayvsBot}/>
                                <Route path="/PlayvsPlayer" component={PlayvsPlayer}/>
                                <Route path="/MatchReplay/:matchId" component={MatchReplay}/>
                            </Layout>
                        </div>
                    </Fullscreen>
                </div>) : (<Login handleSubmit={this.handleSubmitLogin.bind(this)}/>)
        );
    }
}

export default App;
