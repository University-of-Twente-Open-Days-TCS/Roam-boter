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

const API_HOST = "http://localhost:8000";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFull: false,
        };
    }

    async testAPI() {
        let csrfToken = await getCsrfToken();
        try {
            //Try the test
            const response = await fetch(`${API_HOST}/test/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrfToken
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

    goFull = () => {
        this.setState({isFull: true});
    };

    render() {
        return (
            <div>
                <Fullscreen
                    enabled={this.state.isFull}
                    onChange={isFull => this.setState({isFull})}
                >
                    <div className="full-screenable-node">
                        {/*<h1>This app only works fullscreen, please click below to enter the app!</h1>*/}

                        {/*<Button onClick={this.testAPI}>Test API</Button>*/}


                        <Layout>
                            {/*<AIMenuList/>*/}
                            <Route exact path="/" component={Home}/>
                            <Route path="/AIEditor" component={AIEditor}/>
                            <Route path="/ListAIs" component={ListAIs}/>
                            <Route path="/MatchHistory" component={MatchHistory}/>
                            <Route path="/PlayvsBot" component={PlayvsBot}/>
                            <Route path="/PlayvsPlayer" component={PlayvsPlayer}/>
                            <hr/>
                            <Button onClick={this.testAPI}>Test API</Button>
                            <Button onClick={this.goFull} margin={"200px"}>Go Fullscreen</Button>
                        </Layout>
                    </div>
                </Fullscreen>
            </div>
        );
    }
}

export default App;
