import React, {Component} from 'react';
import './App.css';
import {getCsrfToken} from './utils.js';

import FullScreenContainer from "./components/FullScreenContainer";
import Fullscreen from "react-full-screen";
import Button from "@material-ui/core/Button";

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
                <h1>This app only works fullscreen, please click below to enter the app!</h1>
                <Button onClick={this.goFull} margin-left="auto" margin-right="auto">
                    Go Fullscreen
                </Button>
                <Button onClick={this.testAPI}>Test API</Button>
                <Fullscreen
                    enabled={this.state.isFull}
                    onChange={isFull => this.setState({isFull})}
                >
                    <div className="full-screenable-node">
                        {this.state.isFull ? <FullScreenContainer/> : null}
                    </div>
                </Fullscreen>
            </div>
        );
    }
}

export default App;
