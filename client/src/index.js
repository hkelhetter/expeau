import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import Tutoriel from './tutoriel.js'
import Game from './Game/Game.js'
import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Route exact path="/">
                <Game />
            </Route>
            <Route exact path="/tutoriel">
                <Tutoriel />
            </Route>
        </Router>

    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
