// Module that controls database of the players
// 
// Author: Daniil Kudriashov (daniil.kudriashov@etu.unistra.fr)
// Date: 3 may 2021

const knex = require("knex")

const connectKnex = knex({
    client : "sqlite3",
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
    res = await connectKnex(room).select(Id).where({playerId: playerId});
}

const changeOwner = async (room, newOwner, hex) => {
    await connectKnex(room).where({Id:hex}).update({player: newOwner});
}

module.exports = {
    createGrid,
    getCurrentGrid,
    getPlayersHexes,
    changeOwner
}