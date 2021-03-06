import React, {useContext} from "react"
import Tutoriel from './tutoriel.js'
import Menu from './Menu/Menu.js';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import GameOver from './GameOver.js'
import CreateAndJoinGame from "./tutorials/CreateAndJoinGame.js";
import PlayAsAnimator from "./tutorials/PlayAsAnimator.js";
import PlayAsFarmer from "./tutorials/PlayAsFarmer.js";
import NotExistingTuto from "./tutorials/NotExistingTuto.js";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { socket } from "./socket.js";
import PlayerContext from './Menu/player-context';
export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = { tuto: "1" }
    }
    displayTuto = () => {
        switch (this.state.tuto) {
            case "0": window.location = "/"; break
            case "1": return <CreateAndJoinGame />
            case "2": return <PlayAsAnimator />
            case "3": return <PlayAsFarmer />
            default: return <NotExistingTuto />
        }
    }
    handleClick = (value, newValue) => {
        this.setState({ tuto: newValue })
    }
    componentDidMount() {
        socket.on("endGame", () => {
            window.location = "/gameOver"
        })
        const tuto = new URLSearchParams(window.location.search).get('tuto') || ""
        if (tuto != "") this.setState({ tuto })
    }
    render() {
        console.log(this.state.actions)
        return (

            <Router>
                <Route exact path="/">
                    <Menu />
                </Route>
                <Route exact path="/tutoriel">
                    <Tutoriel />
                </Route>
                <Route exact path="/gameOver">
                    <GameOver />
                </Route>
                <Route path="/tutorial">
                    <Paper >
                        <Tabs
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                            onChange={this.handleClick}
                            value={this.state.tuto}
                        >
                            <Tab label="Accueil" value="0" />
                            <Tab label="Cr??er et rejoindre une partie " value="1" />
                            <Tab label="Le r??le d'animateur " value="2" />
                            <Tab label="Le r??le d'agriculteur" value="3" />

                        </Tabs>
                    </Paper>
                    {this.displayTuto()}
                </Route>

            </Router>
        );
    }
}