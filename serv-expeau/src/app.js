const express = require("express");
const { callbackify } = require("util");
const Players = require("./Players.js");
const Actions = require("./Actions.js");
const Grid = require("./Grid.js");
const Sim = require("./Sumulator");
const Rooms = require("./Rooms");
const Satisfaction = require("./Satisfaction");


const httpServer = require("http").createServer();
const path = require('path');
const app = express();

console.log("Starting simulator compilation...")
Sim.compile(() => console.log("Simulator compiled successfully"));

//Path to the client build
const root = path.join(__dirname, "../../client")
console.log(root)
app.use(express.static(path.join(root, 'build')));

//Serve client app
app.get('*', function (req, res) {
    res.sendFile(path.join(root, 'build', 'index.html'));
});

const port2 = process.env.PORT - 1 || 4000;
app.listen(port2)

/* Join specified socket to a specified room and assigning additional data to the socket
    Notifies every client in the room about new player by emitting "playersUpdate"
    Input:
        room : lobby name
        name : player name
        role: player role
    Socket's attributes:
        roomName: lobby name
        playerId: player's id
*/
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

//Event that defines new socket on connection
//Contains all the other events socket can interract with
io.on("connection", (socket) => {
    console.log("New client connected");

    /*
    Event that creates a lobby with and make the creator join it
    Callback : room.name : string : lobby name
    */
    socket.on("createRoom", async (playerName, role, callback) => {
        /* 
        Room object keeps all needed information about lobby
        name: lobby Name
        sockets: array of sockets in the lobby
        socketsAgr: array of agriculture sockets in the lobby
        turn: current turn of the game (-1 before start)
        */
        const room = {
            name: Math.random().toString(36).substr(2, 5),
            sockets: [],
            socketsAgr: [],
            turn: -1
        };
        //Array of lobbies
        rooms[room.name] = room;

        await Players.newGame(room.name);
        await joinRoom(socket, room, playerName, role);
        callback(room.name);
    });

    /* 
    Event that make player join the room
    Callback : room.name : string : lobby name
    */
    socket.on("joinRoom", async (roomName, playerName, role, callback) => {
        const room = rooms[roomName];
        if (typeof room === "undefined") {
            callback("Code de lobby incorrect");
        }
        else {
            await joinRoom(socket, room, playerName, role);
            console.log(playerName + " joined room " + room.name);
            callback(room.name);
        }

    });

    /* 
    Event that allows player to reconnect to the game in progress either after server crash,
    client crash or simple disconnect. Fetch all the information needed if socket is new.
    Callback : any function

    */
    socket.on("reconnect", async (roomName, playerName, callback) => {
        var room = rooms[roomName];
        if (typeof room === "undefined") {
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

        if (parseInt(info['Role']) === 1) {
            room.socketsAgr.push(socket);
        }
        console.log("Reconnected");
        callback();

    });


    /* 
    Event creates all needed tables for the game,
    called by the host to notify all the players about the game start
    */
    socket.on("startGame", async () => {
        await Grid.createGrid(socket.roomName);
        await Actions.newGame(socket.roomName);
        await Sim.newGame(socket.roomName);
        await Rooms.newRoom(socket.roomName);
        await Satisfaction.newGame(socket.roomName);
        console.log("Game starts in room", socket.roomName);
        io.sockets.in(socket.roomName).emit("start");
    });


    /* 
    Add multiple actions by player for this turn
    actions : obj : {hexId : actionId}
    callback : any function
    */
    socket.on("addActions", async (actions, callback) => {
        //console.log(actions);
        await Actions.addActions(socket.roomName, socket.playerId, actions, rooms[socket.roomName].turn);
        //callback();
    });

    /* 
    Get all the action of the player for chosen tour
    callback : Array of actions
    */
    socket.on("getActions", async (tour, callback) => {
        const res = await Actions.getPlayerActions(socket.roomName, socket.playerId, tour);
        //console.log(res);
        callback(res);
    });

    /* 
    Get all possible action cards
    callback : array of actions
    Look for the actions db description for more info on this object
    */
    socket.on("getAllActions", async (callback) => {
        callback(await Actions.getAllActions());
    })

    /* 
    Get list of players from the emitter socket's lobby
    Look for the players db description for more info on this object
    */
    socket.on("playersInRoom", async (callback) => {
        console.log("looking for room", socket.roomName);
        callback(await Players.getPlayersFromRoom(socket.roomName));
    });

    /* 
    Get list of players from the chosen lobby
    Look for the players db description for more info on this object
    */
    socket.on("playersFromRoom", async (nRoom, callback) => {
        console.log("looking for room", nRoom);
        callback(await Players.getPlayersFromRoom(nRoom));
    })

    /* 
    Allows get current map
    Look for the grid db description for more info on this object
    */
    socket.on("getCurrentGrid", async (callback) => {
        callback(await Grid.getCurrentGrid(socket.roomName));
    });

    /* 
    Allows to get current player's stats
    callback : {ut: , ub}
    */
    socket.on("updateStats", async (callback) => {
        callback(await Players.getPlayersStats(socket.playerId, socket.roomName));
    });

    /* 
    Transfer hex to another player
    Input:
        obj {selectedReciever: Id of a player who should recieve hex
            selectedTile: Id of a hex to transfer}
    */
    socket.on("changeOwner", async (obj) => {
        console.log(obj)
        await Grid.changeOwner(socket.roomName, obj.selectedReceiver, obj.selectedTile);
    });

    /* 
    Adds infrustracture on selected tile
    Input:
        obj: {selectedTile: Id of a hex to transfer
            eco: structure ecologique (0 or 1)
            irrig: structure irrigation (0 or 1)}
    */
    socket.on("addInfra", async (obj) => {
        await Grid.addInfra(socket.roomName, obj.selectedTile, obj.eco, obj.irrig);
    });

    /* 
    Adds or removes market on selected tile
    Input:
        obj: {selectedTile: Id of a hex to transfer
            market: structure ecologique (0 or 1)}
    */
    socket.on("setMarket", async (obj) => {
        console.log(obj)
        await Grid.setMarket(socket.roomName, obj.selectedTile, obj.market);
    });

    /* 
    Transforms selected tile to city and setting it's market
    Input:
        obj: {selectedTile: Id of a hex to transform
            market: structure ecologique (0 or 1)}
    */
    socket.on("transformToCity", async (obj) => {
        console.log(obj.selectedTile, obj.market)
        await Grid.transformToCity(socket.roomName, obj.selectedTile, obj.market);
    })

    /* 
    Transforms selected tile to farm, assign it to a player and setting it's infrastructure
    Input:
        obj: {selectedTile: Id of a hex to transform
            selectedReciever: Id of a player who should recieve hex
            eco: structure ecologique (0 or 1)
            irrig: structure irrigation (0 or 1)}
    */
    socket.on("transformToFarm", async (obj) => {
        await Grid.transformToFarm(socket.roomName, obj.selectedTile, obj.selectedReceiver, obj.irrig, obj.eco);
    })


    socket.on("transformToForest", async (hex) => {
        await Grid.transformToForest(socket.roomName, hex);
    })

    /* Called by host to notify all players in the lobby that map is ready to start */
    socket.on("mapReady", () => {
        const cRoom = rooms[socket.roomName];
        cRoom.turn = 0;
        io.sockets.in(socket.roomName).emit("mapReady");
    });

    /* 
    Called by the host when everyone submitted their actions for the turn
    Prepare all the files needed for simulator and launch it
    Afterall send their results to farmers
    Callback : any function
    */
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
            else {
                await Players.setPlayerStats(cRoom.name, aSock.playerId, stats);
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

    socket.on("inputPhase", () => {
        io.sockets.in(socket.roomName).emit("inputPhase");

    })

    /* 
    Called by host to end the game
    */
    socket.on("endGame", () => {
        io.sockets.in(socket.roomName).emit("endGame");
    })

    /* 
    Get current turn from the lobby
    */
    socket.on("getTurn", (callback) => {
        const cRoom = rooms[socket.roomName];
        //console.log(cRoom.turn)
        if (typeof cRoom !== "undefined") callback(cRoom.turn);
    })

    /* 
    Event for tests to print any message from the socket on the server
    */
    socket.on("remoteCons", (message) => {
        console.log("RemoteConsole: " ,message);
    })

    /* 
    Save satisfaction score of a player
    */
    socket.on("satisfaction", async (score) => {
        const cRoom = rooms[socket.roomName];
        await Satisfaction.addScore(socket.roomName, socket.playerId, cRoom.turn, score);
    })






    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });


})
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
