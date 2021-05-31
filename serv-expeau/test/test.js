//const Players = require("../src/Players.js");
//const Actions = require("../src/Actions.js");
//const Grid = require("../src/Grid.js");

const socketIOClient = require("socket.io-client");
const ENDPOINT = "http://127.0.0.1:4001";

const assert = require('assert');
const { resolve } = require("path");
const { response } = require("express");
const { SSL_OP_EPHEMERAL_RSA } = require("constants");

const sockP1 = socketIOClient(ENDPOINT);
const sockP2 = socketIOClient(ENDPOINT);
const sockP3 = socketIOClient(ENDPOINT);

var status = {
    p1: false,
    p2: false,
    p3: false
};
sockP1.on("start", () => {
    status.p1 = true;
});
sockP2.on("start", () => {
    status.p2 = true;
});
sockP3.on("start", () => {
    status.p3 = true;
});

var actions;



describe('Lobby tests', function() {
    var roomName;
    it('Player should create and join his lobby', async function() {
        
        await new Promise(resolve => {
            sockP1.emit("createRoom", "player1-host", 1, (response) => {
                roomName = response;
                resolve(response);
            });
        });
        var playersCount = 0;
        playersCount = await new Promise(resolve => {
            sockP1.emit("playersInRoom", (response) => {
                playersCount = response.length;
                resolve(playersCount);
            });
        });
        assert.strictEqual(playersCount, 1);
    })

    it('Players should be able to join lobby and get correct number of players in lobby', async function() {
        
        await new Promise(resolve => {
            sockP2.emit("joinRoom", roomName, "player2", 2, (response) => {
                assert.strictEqual(response, roomName);
                resolve(response);
            })
        });
        var playersCount = 0;
        playersCount = await new Promise(resolve => {
            sockP2.emit("playersInRoom", (response) => {
                playersCount = response.length;
                resolve(playersCount);
            });
        });
        assert.strictEqual(playersCount, 2);

        
        await new Promise(resolve => {
            sockP3.emit("joinRoom", roomName, "player3", 0, (response) => {
                assert.strictEqual(response, roomName);
                resolve(response);
            })
        });
        playersCount = await new Promise(resolve => {
            sockP3.emit("playersInRoom", (response) => {
                playersCount = response.length;
                console.log(response);
                resolve(playersCount);
            });
        });
        assert.strictEqual(playersCount, 3);
    });

    it('Host starts the game and everyone in the room receives it', async function() {
        
        
        sockP1.emit("startGame");
        await new Promise(r => setTimeout(r, 500));

        assert.strictEqual(status.p1, true);
        assert.strictEqual(status.p1, true);
        assert.strictEqual(status.p1, true);
        
    });

});

describe('Game itself', function() {
    it('Player should be able to send and recieve his actions', async function() {
        sockP1.emit("addActions", [
            {hexID: 15, action: 11, typeAction: 1},
            {hexID: 16, action: 12, typeAction: 1},
            {hexID: 17, action: 13, typeAction: 1},
        ], 1);
        actions = await new Promise(resolve => {
            sockP1.emit("getActions", 1, (response) => {
                resolve(response);
            });
        });
    });
    it('Player should be able to get his UT/UB', async function() {
        const stats = await new Promise(resolve => {
            sockP2.emit("updateStats", async (response) => {
                resolve(response);
            });

        });
        assert.strictEqual(stats[0].ut, 12);
        assert.strictEqual(stats[0].ub, 12);
    });
    it('Player should be able to get the grid', async function() {
        const grid = await new Promise(resolve => {
            sockP3.emit("getCurrentGrid", (response) => resolve(response));
        })
        console.log(grid);
    });
    it('Player should be able to get list of all actions', async function() {
        const actions = await new Promise(resolve => {
            sockP3.emit("getAllActions", (response) => resolve(response));
        })
        //console.log(actions);
    })
    it('Players should be able to transfer ownership of the hexes', async function() {
        await sockP1.emit("changeOwner", {
            selectedGifter: 5,
            selectedTile: 1,
            selectedReceiver: 3
        });
        const grid = await new Promise(resolve => {
            sockP3.emit("getCurrentGrid", (response) => resolve(response));
        })
        assert.strictEqual(parseInt(grid[0].player), 3);
    })

});

