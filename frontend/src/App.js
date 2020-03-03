import React from 'react';
import logo from './logo.svg';
import './App.css';
import {getCsrfToken} from './utils.js'

const API_HOST = "http://localhost:8000"

async function testAPI() {
    let csrfToken = await getCsrfToken()
    try {
        //Try the test
        const response = await fetch(`${API_HOST}/test/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken' : csrfToken
            }
        })
        let data = await response.json()
        if (data.test == "OK"){
            console.log(data)
        }else {
            throw "API Test unsuccessful"
        }

    }catch (e) {
        console.error(e)
    }
    
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <button
            onClick={testAPI}
        >
            Test API
        </button>
      </header>
    </div>
  );
}

export default App;
