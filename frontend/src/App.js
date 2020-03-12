import React, {Component} from 'react';
import './css/App.css';
import RoamBotAPI from './RoamBotAPI.js';
import Fullscreen from "react-full-screen";
import Button from "@material-ui/core/Button";

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

    goFull = () => {
        this.setState({isFull: true});
    };


    render() {
        let fullscreenButton = this.state.isFull ? null : <Button variant="outlined" onClick={this.goFull}>Go Fullscreen</Button>

        return (
            (this.state.loggedIn) ? (
                <div>
                    <Fullscreen
                        enabled={this.state.isFull}
                        onChange={isFull => this.setState({isFull})}
                    >
                        <div className="full-screenable-node">
                            <Layout>
                                <Route exact path="/" 
                                    render={(props) => <Home handleSubmitLogout={this.handleSubmitLogout}></Home>}
                                />
                                <Route path="/AIEditor" component={AIEditor} />
                                <Route path="/AIList" component={AIList}/>
                                <Route path="/MatchHistory" component={MatchHistory}/>
                                <Route path="/PlayvsBot" component={PlayvsBot}/>
                                <Route path="/PlayvsPlayer" component={PlayvsPlayer}/>
                                <Route path="/MatchReplay/:matchId" component={MatchReplay}/>
                                <hr/>
                                {fullscreenButton}
                            </Layout>
                        </div>
                    </Fullscreen>
                </div>) : (<Login handleSubmit={this.handleSubmitLogin.bind(this)}/>)
        );
    }
}

export default App;
