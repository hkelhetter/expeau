import React, { useState, useContext } from 'react';
import { Button, TextField } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { socket } from '../socket.js';
import Typography from '@material-ui/core/Typography';
import AnimatorLoader from '../Game/animator/AnimatorLoader.js'
import PlayerContext from './player-context';

import MenuContext from './menu-context';

import Game from '../Game/Game.js'
import warningText from '../Game/controls/warningText.js'



function Menu() {
    const playerCtx = useContext(PlayerContext);
    const MenuCtx = useContext(MenuContext);


    const marg = {
        marginRight: 5
    }



    const handleName = (event) => {
        playerCtx.updateName(event.target.value);
    }

    const handleChange = (event) => {
        playerCtx.updateRole(event.target.value);
    };

    const handleRoomName = (event) => {
        playerCtx.updateRoom(event.target.value);
    }

    const [loading, setLoading] = useState(false)

    const [playerList, setPlayerList] = useState([]);
    const [warningMessage, setWarningMessage] = useState("");
    socket.on("playersUpdate", (resp) => {
        setPlayerList(resp);
        console.log(resp)
    });

    const [playerGameStarted, setPlayerGameStarted] = useState(true);

    socket.on("mapReady", () => {
        setPlayerGameStarted(true)
    })
    socket.on("start", () => {
        MenuCtx.updateLocation("started");
    });

    async function handleCreate() {
        if (playerCtx.name === "" || playerCtx.role === "") {
            setWarningMessage("Veuillez remplir les champs")
        }
        else {
            const room = await new Promise(resolve => {
                socket.emit("createRoom", playerCtx.name, playerCtx.role, (response) => {
                    resolve(response);
                });
            });
            playerCtx.updateRoom(room);
            MenuCtx.updateLocation("lobbyCreated");
        }


    }

    async function handleJoin() {
        if (playerCtx === "" || playerCtx.name === "" || playerCtx.role === "") {
            setWarningMessage("Veuillez remplir les champs")
        }
        else {


            const room = await new Promise(resolve => {
                socket.emit("joinRoom", playerCtx.room, playerCtx.name, playerCtx.role, (response) => {
                    resolve(response);
                });
            });
            playerCtx.updateRoom(room);
            MenuCtx.updateLocation("lobbyJoined");
        }
    }

    function handleStart() {
        setLoading(true)
        socket.emit("startGame");
    }
    function CreateForm() {
        return (
            <div>
                <TextField key="name" label="Pseudo" value={playerCtx.name} onChange={handleName}></TextField>
                <FormControl>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        value={playerCtx.role}
                        onChange={handleChange}
                    >
                        <MenuItem value={1}>Agriculteur</MenuItem>
                        <MenuItem value={2}>Elu</MenuItem>
                        <MenuItem value={3}>Animateur</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleCreate}>Créer</Button>
                {warningText(warningMessage)}
                <Button variant="contained" color="primary" style={marg} onClick={() => { MenuCtx.updateLocation("menu") }}>Menu</Button>

            </div>
        )
    }

    function JoinForm() {
        return (
            <div>
                <TextField key="roomName" label="Code Partie" value={playerCtx.room} onChange={handleRoomName}></TextField>
                <TextField key="nameJoin" label="Pseudo" value={playerCtx.name} onChange={handleName}></TextField>
                <FormControl>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        value={playerCtx.role}
                        onChange={handleChange}
                    >
                        <MenuItem key={1} value={1}>Agriculteur</MenuItem>
                        <MenuItem key={2} value={2}>Elu</MenuItem>
                        <MenuItem key={3} value={3}>Responsable</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleJoin}>Rejoindre la partie</Button>
                {warningText(warningMessage)}

                <Button variant="contained" color="primary" style={marg} onClick={() => { MenuCtx.updateLocation("menu") }}>Menu</Button>

            </div>
        )
    }

    function LobbyCreated() {
        return (
            <div>
                <Typography variant="h3">
                    {playerCtx.room}
                </Typography>
                <List>
                    {playerList.map(item => (
                        <ListItem
                            key={item.Id}
                        >
                            <ListItemText primary={item.Name} />
                        </ListItem>
                    ))}
                </List>
                <Button variant="contained" color="primary" onClick={handleStart} >Commencer la partie</Button>
                {loading && <Typography>Chargement...</Typography>}
            </div>
        );
    }
    function PlayersWaitingLobby() {
        return (
            <div>
                <Typography>
                    L'animateur est en train de préparer la carte. Veuillez patienter
                </Typography>
            </div>
        )
    }
    function LobbyJoined() {
        return (
            <div>
                <Typography variant="h3">
                    {playerCtx.room}
                </Typography>
                <List>
                    {playerList.map(item => (
                        <ListItem
                            key={item.Id}
                        >
                            <ListItemText primary={item.Name} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }

    function GameStarted() {
        return (
            <div>
                {playerCtx.role >= 2 ? <AnimatorLoader name={playerCtx.name} /> :
                    playerGameStarted ? <Game name={playerCtx.name} role={playerCtx.role} /> :
                        <div className="App-header">{PlayersWaitingLobby()}</div>}
            </div>
        )
    }

    //TODO
    function RejoinGame() {
        return (
            <div>
                <TextField key="roomRejoin" label="Code Partie" value={playerCtx.room} onChange={handleRoomName}></TextField>
                <List>
                    {playerList.map(item => (
                        <ListItem
                            key={item.Id}
                        >
                            <ListItemText primary={item.Name} />
                        </ListItem>
                    ))}
                </List>

            </div>
        )
    }


    function MainMenu() {

        return (
            <div>
                <Button variant="contained" color="primary" onClick={() => { MenuCtx.updateLocation("create") }}>Creer la partie</Button>
                <Button variant="contained" color="primary" onClick={() => { MenuCtx.updateLocation("join") }}>Rejoindre la partie</Button>
            </div>
        );
    }

    return (
        <>

            {
                MenuCtx.loc === "started" ? GameStarted() :
                    <div className="App-header">
                        {MenuCtx.loc === "menu" && MainMenu()}

                        {MenuCtx.loc === "create" && CreateForm()}

                        {MenuCtx.loc === "join" && JoinForm()}

                        {MenuCtx.loc === "lobbyCreated" && LobbyCreated()}

                        {MenuCtx.loc === "lobbyJoined" && LobbyJoined()}


                    </div>
            }
        </>
    )

}

export default Menu;

/* réseau zone atelier employeur
eredejeu prestataire des zone atelier
ozcar tereno strasbourg */