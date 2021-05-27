import React, { useEffect, useState, useContext } from 'react';
import { Button, TextField } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { socket } from '../socket.js';
import Typography from '@material-ui/core/Typography';
import AnimatorLoader from '../Game/AnimatorLoader.js'
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
                            <MenuItem value={0}>Agriculteur</MenuItem>
                            <MenuItem value={1}>Elu</MenuItem>
                            <MenuItem value={2}>Responsable</MenuItem>
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
                {console.log(socket.io.engine)}
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
                            <MenuItem value={0}>Agriculteur</MenuItem>
                            <MenuItem value={1}>Elu</MenuItem>
                            <MenuItem value={2}>Responsable</MenuItem>
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
                {playerCtx.role < "3" ? <AnimatorLoader /> : <Game name={playerCtx.name} role={playerCtx.role} />}
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
                <p>
                    <Button variant="contained" color="primary" onClick={() => { MenuCtx.updateLocation("create") }}>Creer la partie</Button>
                </p>
                <p>
                    <Button variant="contained" color="primary" onClick={() => { MenuCtx.updateLocation("join") }}>Rejoindre la partie</Button>
                </p>
            </div>
        );
    }

    return (
        <div>
            {MenuCtx.loc === "menu" && MainMenu()}

            {MenuCtx.loc === "create" && CreateForm()}

            {MenuCtx.loc === "join" && JoinForm()}

            {MenuCtx.loc === "lobbyCreated" && LobbyCreated()}

            {MenuCtx.loc === "lobbyJoined" && LobbyJoined()}

            {MenuCtx.loc === "started" && GameStarted()}
        </div>
    )

}

export default Menu;
