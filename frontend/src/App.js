import React, {Component} from 'react';
import './css/App.css';
import RoamBotAPI from './RoamBotAPI.js';
import Fullscreen from "react-full-screen";
import Button from "@material-ui/core/Button";

import {
    Route,
} from "react-router-dom";
import Home from "./components/Home";
import AIEditor from "./components/AIEditor";
import Layout from "./layout/Layout";
import MatchHistory from "./components/MatchHistory";
import AIList from "./components/AIList";
import PlayvsBot from "./components/PlayvsBot";
import PlayvsPlayer from "./components/PlayvsPlayer";
import MatchReplay from "./components/MatchReplay";
import Login from "./login/Login";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFull: false,
            AIs: [],
            loggedIn: false,
        };
    }

    handleSubmitLogin = (teamCode) => {
        let response = RoamBotAPI.loginUser(teamCode)
        response
            .then((response) => {
                response.ok ? this.setState({loggedIn: true}) : this.setState({loggedIn: false})
            })
    }

    goFull = () => {
        this.setState({isFull: true});
    };

    render() {
        return (
            (this.state.loggedIn) ? (
                <div>
                    <Fullscreen
                        enabled={this.state.isFull}
                        onChange={isFull => this.setState({isFull})}
                    >
                        <div className="full-screenable-node">
                            <Layout>
                                <Route exact path="/" component={Home}/>
                                <Route path="/AIEditor"
                                       render={(props) => <AIEditor {...props} handleSaveAI={this.handleSaveAI}/>}/>
                                <Route path="/AIList" component={AIList}/>
                                <Route path="/MatchHistory" component={MatchHistory}/>
                                <Route path="/PlayvsBot" component={PlayvsBot}/>
                                <Route path="/PlayvsPlayer" component={PlayvsPlayer}/>
                                <Route path="/MatchReplay/:matchId" component={MatchReplay}/>
                                <hr/>
                                <Button onClick={this.testAPI}>Test API</Button>
                                <Button onClick={this.goFull} margin={"200px"}>Go Fullscreen</Button>
                            </Layout>
                        </div>
                    </Fullscreen>
                </div>) : (<Login handleSubmit={this.handleSubmitLogin.bind(this)}/>)
        );
    }
}

export default App;
