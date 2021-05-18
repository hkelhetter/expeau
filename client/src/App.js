import React from "react"
import Tutoriel from './tutoriel.js'
import Game from './Game/Game.js'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { logged: false }
    }
    render() {
        return (

            <Router>
                <Route exact path="/">
                    {!this.state.logged ? <Game /> : <Redirect to="/tutoriel" />}
                </Route>
                <Route exact path="/tutoriel">
                    <Tutoriel />
                </Route>
            </Router>
        );
    }
}