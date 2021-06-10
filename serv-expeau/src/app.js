const express = require("express");
const { callbackify } = require("util");
const Players = require("./Players.js");
const Actions = require("./Actions.js");
const Grid = require("./Grid.js");
const Sim = require("./Sumulator");
const Rooms = require("./Rooms");


const httpServer = require("http").createServer();
const path = require('path');
const app = express();
const root = path.join(__dirname, "../../client")
console.log(root)
app.use(express.static(path.join(root, 'build')));

app.get('*', function (req, res) {
    res.sendFile(path.join(root, 'build', 'index.html'));
});

const port2 = process.env.PORT - 1 || 4000;
app.listen(port2)

const joinRoom = async (socket, room, name, role) => {
    room.sockets.push(socket);
    if (role === 1) {
        room.socketsAgr.push(socket);
    }

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
            sockets: [],
            socketsAgr: [],
            turn: 0
        };
        rooms[room.name] = room;

        await Players.newGame(room.name);
        await joinRoom(socket, room, playerName, role);
        callback(room.name);
    });

    socket.on("joinRoom", async (roomName, playerName, role, callback) => {
        const room = rooms[roomName];
        if (typeof room === "undefined"){
            callback("Code de lobby incorrect");
        }
        else{
            await joinRoom(socket, room, playerName, role);
            console.log(playerName + " joined room " + room.name);
            callback(room.name);
        }

    });

    socket.on("reconnect", async (roomName, playerName, callback) => {
        var room = rooms[roomName];
        if(typeof room === "undefined"){
            const cTurn = await Rooms.getTurn(roomName);
            room = {
                name: roomName,
                sockets: [],
                socketsAgr: [],
                turn: cTurn
            }
            rooms[roomName] = room;
        }
        socket.join(room.name);
        socket.roomName = roomName;
        const info = await Players.getPlayerInfo(roomName, playerName);
        socket.playerId = info['Id'];
        room.sockets.push(socket);

        if(parseInt(info['Role']) === 1){
            room.socketsAgr.push(socket);
        }
        callback();

    });



    socket.on("startGame", async () => {
        await Grid.createGrid(socket.roomName);
        await Actions.newGame(socket.roomName);
        await Sim.newGame(socket.roomName);
        await Rooms.newRoom(socket.roomName);
        console.log("Game starts in room", socket.roomName);
        io.sockets.in(socket.roomName).emit("start");
    });

    socket.on("addActions", async (actions, callback) => {

        await Actions.addActions(socket.roomName, socket.playerId, actions, rooms[socket.roomName].turn);
        callback();
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

    socket.on("playersFromRoom", async (nRoom, callback) => {
        console.log("looking for room", nRoom);
        callback(await Players.getPlayersFromRoom(nRoom));
    })

    socket.on("getCurrentGrid", async (callback) => {
        callback(await Grid.getCurrentGrid(socket.roomName));
    });

    socket.on("updateStats", async (callback) => {
        callback(await Players.getPlayersStats(socket.playerId, socket.roomName));
    });

    socket.on("changeOwner", async (obj) => {
        console.log(obj)
        await Grid.changeOwner(socket.roomName, obj.selectedReceiver, obj.selectedTile);
    });

    socket.on("addInfra", async (obj) => {
        await Grid.addInfra(socket.roomName, obj.selectedTile, obj.eco, obj.irrig);
    });

    socket.on("setMarket", async (obj) => {
        console.log(obj)
        await Grid.setMarket(socket.roomName, obj.selectedTile, obj.market);
    });

    socket.on("transformToCity", async (obj) => {
        console.log(obj.selectedTile, obj.market)
        await Grid.transformToCity(socket.roomName, obj.selectedTile, obj.market);
    })

    socket.on("transformToFarm", async (obj) => {
        await Grid.transformToFarm(socket.roomName, obj.selectedTile, obj.selectedReceiver, obj.irrig, obj.eco);
    })

    socket.on("transformToForest", async (hex) => {
        await Grid.transformToForest(socket.roomName, hex);
    })

    socket.on("mapReady", () => {
        io.sockets.in(socket.roomName).emit("mapReady");
    });

    //Called by the coach when everyone submitted their actions for the turn
    socket.on("nextTurn", async (callback) => {
        const cRoom = rooms[socket.roomName];
        await Actions.applyActions(cRoom.name, cRoom.turn);
        await Grid.genFile(cRoom.name, cRoom.turn);
        await Sim.calculate(cRoom.name, cRoom.turn);

        cRoom.turn++;
        await Rooms.setTurn(cRoom.name, cRoom.turn);

        for (const aSock of cRoom.socketsAgr) {
            const stats = await Sim.getLastPlayerStats(cRoom.name, aSock.playerId);
            if (stats === -1) {
                console.log("No UTUB file for turn", cRoom.turn - 1);
            }
            const graph = await Sim.getPlayerGraph(cRoom.name, aSock.playerId);
            const res = {
                stats: stats,
                graph: graph
            }
            // res : { 
            // stats: obj {ut , ub} - new ut and ub values of the player after the round
            // grapg: png image with graphs of the player generated by simulator
            aSock.emit("results", res);
        }

        callback();

    });

    // socket.on("testImage", async (callback) => {
    //     const res = await Sim.testImage();
    //     callback(res);
    // })





    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });


})
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
