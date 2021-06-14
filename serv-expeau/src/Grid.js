// Module that controls database of the players
// 
// Author: Daniil Kudriashov (daniil.kudriashov@etu.unistra.fr)
// Date: 3 may 2021

const knex = require("knex");

const fs = require("fs");

const connectKnex = knex({
    client: "sqlite3",
    connection: {
        filename: "./db/grid.sqlite3"
    }
});

const rempl = async () => {
    await connectKnex("Grid").where({mainCLC1: 2}).update({practice: 201});
}

const createGrid = async (room) => {
    const req = 'CREATE TABLE "' + room + '" as SELECT * FROM Grid';
    await connectKnex.schema.raw(req);
}

const getCurrentGrid = async (room) => {
    var res;
    try {
        res = await connectKnex(room).select("*");
    } catch (error) {
        res = "Partie inexistant"
    }
    return res;
}

const getPlayersHexes = async (room, playerId) => {
    var res;
    try {
        res = await connectKnex(room).select(Id).where({ playerId: playerId });
    } catch (error) {
        res = "Partie inextante";
    }
    return res;
}

const changeOwner = async (room, newOwner, hex) => {
    var pHexId = await connectKnex(room).where({ player: newOwner }).max('cellPlayer');
    pHexId = parseInt(pHexId[0]["max(`cellPlayer`)"]) + 1;
    await connectKnex(room).where({ Id: hex }).update({ player: newOwner, cellPlayer: pHexId });
}

const setPractice = async (room, hex, practice) => {
    await connectKnex(room).where({ Id: hex }).update({ practice: practice });
}

const addInfra = async (room, hex, eco, irrig) => {
    await connectKnex(room).where({ Id: hex }).update({ eco: eco, irrig: irrig });
}

const setMarket = async (room, hex, market) => {
    await connectKnex(room).where({ Id: hex }).update({ market: market });
}

const transformToCity = async (room, hex, market) => {
    await connectKnex(room).where({ Id: hex }).update({ market: market, mainCLC1: 1, player : 0, cellPlayer: 0, practice: 0 });
}

const transformToFarm = async (room, hex, newOwner, irrig, eco) => {
    var pHexId = await connectKnex(room).where({ player: newOwner }).max('cellPlayer');
    pHexId = parseInt(pHexId[0]["max(`cellPlayer`)"]) + 1;
    await connectKnex(room).where({ Id: hex }).update({ player: newOwner, cellPlayer: pHexId, irrig: irrig, eco: eco, mainCLC1: 2});
}

const transformToForest = async (room, hex) => {
    await connectKnex(room).where({Id: hex}).update({ player: 0, cellPlayer: 0, mainCLC1: 3});
}

const genFile = async (room, tour) => {
    const actions = await connectKnex(room).where('practice', '>', 0).orWhere(function () {
        this.where({eco: 1}).orWhere({irrig: 1}).orWhere({market: 1})
    }).select('Id', 'player', 'practice', 'eco', 'irrig', 'market');

    const file = `./Simulator/Games/${room}/round${tour}.txt`;
    await new Promise(resolve => {
            fs.writeFile(file, "Id   player   practice   infraEco   infraIrri   localMarket\n", err => {
            if (err) {
            console.error(err)
            }
            resolve();
        })
    });
    for(const action of actions){
        fs.writeFile(file, `${action.Id}   ${action.player}   ${action.practice}   ${action.eco}   ${action.irrig}   ${action.market}\n`, {flag: 'a+'}, err => {
            if(err){  
                console.log(err);
            }
        });
    };
}

const cleanUp = async (callback) => {
    const tables = await connectKnex.schema.raw("SELECT name FROM sqlite_master WHERE type='table';");
    var found = 0;
    for (var i = 0; i < tables.length; i++) {

        if (tables[i].name === 'sqlite_sequence') {
            tables.splice(i, 1);
            found++;
        }
        if (tables[i].name === 'Grid') {
            tables.splice(i, 1);
            found++;
        }
        if (found === 2) {
            break;
        }
    }
    for (table of tables) {
        await connectKnex.schema.dropTable(table.name);
    }
    callback();
}

module.exports = {
    createGrid,
    getCurrentGrid,
    getPlayersHexes,
    changeOwner,
    setPractice,
    addInfra,
    setMarket,
    transformToCity,
    transformToFarm,
    transformToForest,
    genFile,
    cleanUp,
    rempl
}