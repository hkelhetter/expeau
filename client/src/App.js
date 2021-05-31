import React from "react"
import Tutoriel from './tutoriel.js'
import Menu from './Menu/Menu.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export default class App extends React.Component {

    render() {
        return (

            <Router>
                <Route exact path="/">
                    <Menu />
                </Route>
                <Route exact path="/tutoriel">
                    <Tutoriel />
                </Route>
            </Router>
        );
    }
}