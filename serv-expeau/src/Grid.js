// Module that controls database of the players
// 
// Author: Daniil Kudriashov (daniil.kudriashov@etu.unistra.fr)
// Date: 3 may 2021

const knex = require("knex")

const connectKnex = knex({
    client: "sqlite3",
    connection: {
        filename: "./db/grid.sqlite3"
    }
});


const createGrid = async (room) => {
    const req = 'CREATE TABLE "' + room + '" as SELECT * FROM Grid';
    await connectKnex.schema.raw(req);
}

const getCurrentGrid = async (room) => {
    return await connectKnex(room).select("*");
}

const getPlayersHexes = async (room, playerId) => {
    var res;
    res = await connectKnex(room).select(Id).where({ playerId: playerId });
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
    await connectKnex(room).where({ Id: hex }).update({ market: market, mainCLC1: 1 });
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
    cleanUp
}