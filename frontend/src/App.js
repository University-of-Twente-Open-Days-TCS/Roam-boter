import React, {Component} from 'react';
import './css/App.css';
import {getCsrfToken} from './utils.js';
import Fullscreen from "react-full-screen";
import Button from "@material-ui/core/Button";

import {
    Route,
} from "react-router-dom";
import Home from "./components/Home";
import AIEditor from "./components/AIEditor";
import Layout from "./layout/Layout";
import MatchHistory from "./components/MatchHistory";
import ListAIs from "./components/ListAIs";
import PlayvsBot from "./components/PlayvsBot";
import PlayvsPlayer from "./components/PlayvsPlayer";
import MatchReplay from "./components/MatchReplay";
import Login from "./login/Login";

const API_HOST = "http://localhost:8000";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFull: false,
            AIs: [],
            loggedIn: true,
        };
    }

    async testAPI() {
        try {
            //Try the test
            const response = await fetch(`${API_HOST}/test/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': await getCsrfToken()
                }
            });
            let data = await response.json();
            if (data.test === "OK") {
                console.log(data)
            } else {
                throw "API Test unsuccessful"
            }

        } catch (e) {
            console.error(e)
        }

    }

    async componentDidMount() {
        const token = await getCsrfToken()
        this.setState({
            csrfToken: token
        })

        fetch(`${API_HOST}/ai/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': await getCsrfToken()
            }
        })
            .then(res => res.json())
            .then(json => this.setState({AIs: json}))
    }

    handleSaveAI = async (ai) => {
        console.log({ai})
        const response = await fetch(`${API_HOST}/ai/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': await getCsrfToken(),
                'Content-Type': "application/json",
            },
            body: JSON.stringify({name: "first-name", ai})
        });
    }

    handleSubmitLogin = async teamCode => {
        const formData = new FormData()

        formData.append('team_code', teamCode);
        formData.append('csrfmiddlewaretoken', this.state.csrfToken);

        const response = await fetch(`${API_HOST}/dashboard/team/enter/`, {
            method: 'POST',
            credentials: 'include',
            // headers: {
            //     'X-CSRFToken': this.state.csrfToken
            // },
            body: formData
        })
        // let data = await response.json()
        response.ok ? this.setState({loggedIn: true}) : this.setState({loggedIn: false})
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
                                <Route path="/ListAIs" render={(props) => <ListAIs {...props} AIs={this.state.AIs}/>}/>
                                <Route path="/MatchHistory" component={MatchHistory}/>
                                <Route path="/PlayvsBot" component={PlayvsBot}/>
                                <Route path="/PlayvsPlayer" component={PlayvsPlayer}/>
                                <Route path="/MatchReplay" component={MatchReplay}/>
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
