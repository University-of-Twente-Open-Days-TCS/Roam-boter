// frontend/src/App.js

import React, {Component} from "react";
import AppContent from "./components/AppContent";
import Fullscreen from "react-full-screen";
import Button from "@material-ui/core/Button";

class App extends Component {
    constructor(props) {
        super();

        this.state = {
            isFull: false,
        };
    }

    goFull = () => {
        this.setState({isFull: true});
    }

    render() {
        return (
            <div>
                <h1>This app only works fullscreen, please click below to enter the app!</h1>
                <Button onClick={this.goFull} margin-left="auto" margin-right="auto">
                    Go Fullscreen
                </Button>
                <Fullscreen
                    enabled={this.state.isFull}
                    onChange={isFull => this.setState({isFull})}
                >
                    <div className="full-screenable-node">
                        {this.state.isFull ? <AppContent/> : null}
                    </div>
                </Fullscreen>
            </div>
        );
    }
}

export default App;