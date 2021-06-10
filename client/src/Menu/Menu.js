import React, { useEffect, useState, useContext } from 'react';
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



    const [playerList, setPlayerList] = useState([]);

    socket.on("playersUpdate", (resp) => {
        setPlayerList(resp);
    });

    socket.on("start", () => {
        MenuCtx.updateLocation("started");
    });

    async function handleCreate() {
        const room = await new Promise(resolve => {
            socket.emit("createRoom", playerCtx.name, playerCtx.role, (response) => {
                resolve(response);
            });
        });
        playerCtx.updateRoom(room);
        MenuCtx.updateLocation("lobbyCreated");

    }

    async function handleJoin() {
        const room = await new Promise(resolve => {
            socket.emit("joinRoom", playerCtx.room, playerCtx.name, playerCtx.role, (response) => {
                resolve(response);
            });
        });
        playerCtx.updateRoom(room);
        MenuCtx.updateLocation("lobbyJoined");
    }

    function handleStart() {
        socket.emit("startGame");
    }

    async function getNewPlayerList() {
        const newLst = await new Promise(resolve => {
            socket.emit("playersFromRoom", playerCtx.room, (resp) => {
                resolve(resp);
            })
        });
        setPlayerList(newLst);
    }

    async function handleReconnectChange(event){
        const lngth = event.target.value.length;
        const pName = event.target.value.substring(0, lngth - 1);
        const pRole = event.target.value.substring(lngth - 1);
        playerCtx.updateName(pName);
        playerCtx.updateRole(pRole);
        
    }

    async function handleReconnect() {
        socket.emit("reconnect", playerCtx.room, playerCtx.name, () => {MenuCtx.updateLocation("started")});
    }



    function CreateForm() {
        return (
            <div>
                <p>
                    <TextField key="name" label="Pseudo" value={playerCtx.name} onChange={handleName}></TextField>
                </p>
                <p>
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
                            <MenuItem value={3}>Responsable</MenuItem>
                        </Select>
                    </FormControl>
                </p>
                <p>
                    <Button variant="contained" color="primary" style={marg} onClick={() => { MenuCtx.updateLocation("menu") }}>Menu</Button>
                    <Button variant="contained" color="primary" onClick={handleCreate}>Create</Button>
                </p>
            </div>
        )
    }

    function JoinForm() {
        return (
            <div>
                <p>
                    <TextField key="roomName" label="Code Partie" value={playerCtx.room} onChange={handleRoomName}></TextField>
                </p>
                <p>
                    <TextField key="nameJoin" label="Pseudo" value={playerCtx.name} onChange={handleName}></TextField>
                </p>
                <p>
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
                            <MenuItem value={3}>Responsable</MenuItem>
                        </Select>
                    </FormControl>
                </p>
                <p>
                    <Button variant="contained" color="primary" style={marg} onClick={() => { MenuCtx.updateLocation("menu") }}>Menu</Button>
                    <Button variant="contained" color="primary" onClick={handleJoin}>Rejoindre la partie</Button>
                </p>
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
            </div>
        );
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
                {playerCtx.role >= 2 ? <AnimatorLoader name={playerCtx.name} /> : <Game name={playerCtx.name} role={playerCtx.role} />}
            </div>
        )
    }

    //TODO
    function RejoinGame() {
        return (
            <div>
                <p>
                    <TextField key="roomRejoin" label="Code Partie" value={playerCtx.room} onChange={handleRoomName}></TextField>
                </p>
                <p>
                    <Button variant="contained" color="primary" onClick={getNewPlayerList}>Chercher les joueurs</Button>
                </p>
                <InputLabel id="nameLabel">Votre nom dans la partie</InputLabel>
                <FormControl>
                
                <Select
                    labelId="nameLabel"
                    id="playerSelect"
                    value={playerCtx.name + playerCtx.role}
                    onChange={handleReconnectChange}
                >
                    {playerList.map(item => (
                        <MenuItem value={item.Name + item.Role}>{item.Name + ` (role : ` + item.Role + `)`}</MenuItem>
                    ))}
                </Select>
                </FormControl>
                <p>
                    <Button variant="contained" color="primary" onClick={handleReconnect}>Rejoindre</Button>
                </p>

            </div>
        )
    }


    function MainMenu() {

        return (
            <div>
                <p>
                    <Button variant="contained" color="primary" onClick={() => { MenuCtx.updateLocation("create") }}>Creer la partie</Button>
                </p>
                <p>
                    <Button variant="contained" color="primary" onClick={() => { MenuCtx.updateLocation("join") }}>Rejoindre la partie</Button>
                </p>
                <p>
                    <Button variant="contained" color="primary" onClick={() => { MenuCtx.updateLocation("reconnect") }}>Reconnexion a la partie en cours</Button>
                </p>
            </div>
        );
    }

    return (<>
        {MenuCtx.loc === "started" ? GameStarted() :
            <div class="App-header">
                {MenuCtx.loc === "menu" && MainMenu()}

                {MenuCtx.loc === "create" && CreateForm()}

                {MenuCtx.loc === "join" && JoinForm()}

                {MenuCtx.loc === "lobbyCreated" && LobbyCreated()}

                {MenuCtx.loc === "lobbyJoined" && LobbyJoined()}

                {MenuCtx.loc === "reconnect" && RejoinGame()}

            </div>}
    </>
    )

}

export default Menu;
