const express = require("express");
const { callbackify } = require("util");
const Players = require("./Players.js");
const Actions = require("./Actions.js");
const Grid = require("./Grid.js");


const httpServer = require("http").createServer();
const path = require('path');
const app = express();
const reactAppPath = "/home/hugo-ubuntu/Documents/expeau/client"
app.use(express.static(path.join(reactAppPath, 'build')));
console.log(__dirname, "aa")

app.get('*', function (req, res) {
    res.sendFile('../../client/build/index.html', { root: __dirname });
});
const port2 = process.env.PORT - 1 || 4000;
app.listen(port2)

const joinRoom = async (socket, room, name, role) => {
    room.sockets.push(socket);

    socket.join(room.name);
    socket.roomName = room.name;
    console.log(socket.id, " Joined ", room.name);
    socket.playerId = await Players.addPlayer(name, role, room.name);
    const playerList = await Players.getPlayersFromRoom(room.name);
    io.sockets.in(socket.roomName).emit("playersUpdate", playerList);
};

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

const port = process.env.PORT || 4001;
const rooms = {};


io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("createRoom", async (playerName, role, callback) => {
        const room = {
            name: Math.random().toString(36).substr(2, 5),
            sockets: []
        };
        rooms[room.name] = room;

        await Players.newGame(room.name);
        await joinRoom(socket, room, playerName, role);
        callback(room.name);
    });

    socket.on("joinRoom", async (roomName, playerName, role, callback) => {
        const room = rooms[roomName];
        await joinRoom(socket, room, playerName, role);
        console.log(playerName + " joined room " + room.name);
        callback(room.name);

    });

    socket.on("startGame", async () => {
        await Grid.createGrid(socket.roomName);
        await Actions.newGame(socket.roomName);
        console.log("Game starts in room", socket.roomName);
        io.sockets.in(socket.roomName).emit("start");
    });

    socket.on("addActions", async (actions, tour) => {

        await Actions.addActions(socket.roomName, socket.playerId, actions, tour);
    });

    socket.on("getActions", async (tour, callback) => {
        const res = await Actions.getPlayerActions(socket.roomName, socket.playerId, tour);
        //console.log(res);
        callback(res);
    });

    socket.on("getAllActions", async (callback) => {
        callback(await Actions.getAllActions());
    })


    socket.on("playersInRoom", async (callback) => {
        console.log("looking for room", socket.roomName);
        callback(await Players.getPlayersFromRoom(socket.roomName));
    });

    socket.on("getCurrentGrid", async (callback) => {
        callback(await Grid.getCurrentGrid(socket.roomName));
    });

    socket.on("updateStats", async (callback) => {
        callback(await Players.getPlayersStats(socket.playerId, socket.roomName));
    });

    socket.on("changeOwner", async (obj) => {
        await Grid.changeOwner(socket.roomName, obj.selectedReceiver, obj.selectedTile);
    });



    socket.on("disconnect", () => {
        console.log("Client disconnected");
    })


})
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
