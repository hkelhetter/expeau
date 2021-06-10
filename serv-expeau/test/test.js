//const Players = require("../src/Players.js");
//const Actions = require("../src/Actions.js");
//const Grid = require("../src/Grid.js");

const socketIOClient = require("socket.io-client");
const ENDPOINT = "http://127.0.0.1:4001";

const assert = require('assert');


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
    this.timeout(5000);
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
        
        await new Promise(r => setTimeout(r, 1000));

        await new Promise(resolve => {
            sockP2.emit("joinRoom", roomName, "player2", 1, (response) => {
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
            sockP3.emit("joinRoom", roomName, "player3", 1, (response) => {
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
        await new Promise(r => setTimeout(r, 2000));

        assert.strictEqual(status.p1, true);
        assert.strictEqual(status.p1, true);
        assert.strictEqual(status.p1, true);
        
    });

});

describe('Game itself', function() {
    this.timeout(10000);
    it('Player should be able to send and recieve his actions', async function() {
        await new Promise(resolve => {
            sockP1.emit("addActions", {1:230, 2:230, 4:230}, () => resolve());
        });

        

        await new Promise(r => setTimeout(r, 1000));

        actions = await new Promise(resolve => {
            sockP1.emit("getActions", 0, (response) => {
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
        assert.strictEqual(stats[0].ut, 30);
        assert.strictEqual(stats[0].ub, 30);
    });
    it('Player should be able to get the grid', async function() {
        const grid = await new Promise(resolve => {
            sockP3.emit("getCurrentGrid", (response) => resolve(response));
        })
        //console.log(grid);
    });
    it('Player should be able to get list of all actions', async function() {
        const actions = await new Promise(resolve => {
            sockP3.emit("getAllActions", (response) => resolve(response));
        })
        //console.log(actions);
    })
    

});

describe('Game master :', function() {
    it('Players should be able to transfer ownership of the hexes', async function() {
        await sockP1.emit("changeOwner", {
            selectedTile: 1,
            selectedReceiver: 3
        });
        await new Promise(r => setTimeout(r, 1000));
        const grid = await new Promise(resolve => {
            sockP3.emit("getCurrentGrid", (response) => resolve(response));
        })
        assert.strictEqual(parseInt(grid[0].player), 3);
        console.log("CellPlayer: ", grid[0].cellPlayer);
        assert.strictEqual(parseInt(grid[0].cellPlayer), 38);
    });

    it('Set infrastructure', async function() {
        await sockP1.emit("addInfra", {
            selectedTile: 4,
            eco: 1,
            irrig: 1
        });
        await new Promise(r => setTimeout(r, 1000));
        const grid = await new Promise(resolve => {
            sockP3.emit("getCurrentGrid", (response) => resolve(response));
        });
        assert.strictEqual(parseInt(grid[3].eco), 1);
        assert.strictEqual(parseInt(grid[3].irrig), 1);
    });

    it('Set market', async function() {
        await sockP1.emit("setMarket", {
            selectedTile: 3,
            market: 1
        });
        await new Promise(r => setTimeout(r, 1000));
        const grid = await new Promise(resolve => {
            sockP3.emit("getCurrentGrid", (response) => resolve(response));
        });
        assert.strictEqual(parseInt(grid[2].market), 1);
    });

    it('Transform forest to city', async function() {
        await sockP1.emit("transformToCity", {
            selectedTile: 5,
            market: 1,
            newActivity: "1"
        });
        await new Promise(r => setTimeout(r, 1000));
        const grid = await new Promise(resolve => {
            sockP3.emit("getCurrentGrid", (response) => resolve(response));
        });
        assert.strictEqual(parseInt(grid[4].mainCLC1), 1);
        assert.strictEqual(parseInt(grid[4].market), 1);
        //assert.strictEqual(parseInt(grid[4].mainCLC3), 1);
    });

})

describe("Simaulator", function() {
    this.timeout(20000);
    // const sim = require("../src/Sumulator");
    
    // it("Creates all the folders", function() {
    //     sim.newGame("testRoom");
    // })
    

    // it("Updates grid after the tour", async function(){
    //     const grid = require("../src/Grid");
    //     const actions = require("../src/Actions");
    //     //await grid.createGrid("testRoom");
    //     //await actions.newGame("testRoom");

    //     await actions.applyActions("testRoom", 1);
    // });

    // it('Execute simulation', async function() {
        
    //     const res = await sim.calculate("testRoom");
    //     console.log(res);
    // });

    // it('Reads stats', async function() {
    //     const res = await sim.getLastPlayerStats("testRoom", 1);
    //     console.log(res);
    // });

    // it("Get graphs", async function() {
    //     const res = await sim.getPlayerGraph("testRoom", 1);
    // })

    it("Round 0", async function(){
        await new Promise(resolve => {
            sockP1.emit("nextTurn", () => resolve());
        });
    })

    it("Round 1", async function() {
        await new Promise(resolve => {
            sockP2.emit("addActions", {23:230, 24:230, 25:230}, () => resolve());
        });
        
        await new Promise(resolve => {
            sockP3.emit("addActions", {73:230, 74:230}, () => resolve());
        });
        
        await new Promise(resolve => {
            sockP1.emit("nextTurn", () => resolve());
        });
    })

    // it("Actions", async function(){
    //     const act = require("../src/Actions");
    //     const testAct = {5 : 200, 8 : 900, 2 : 250};
    //     await act.addActions("test", 1, testAct, 3);
    // })

})

