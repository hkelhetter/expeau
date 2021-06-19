const knex = require("knex")

const connectKnex = knex({
    client : "sqlite3",
    connection: {
        filename: "./db/satisfaction.sqlite3"
    }
});

/* 
Called with a start of a new game
Creates table to stock player's satisfaction score
*/
const newGame = async (roomName) => {
    await connectKnex.schema.createTable(roomName, table => {
        table.increments('id');
        table.integer('playerId');
        table.integer('tour')
        table.integer('score');
    })
}

/* 
Inserts player's satisfaction score for the round
*/
const addScore = async (roomName, playerId, tour, score) => {
    await connectKnex(roomName).insert({playerId: playerId, tour: tour, score: score});
}

/* 
Function is used by the cleanUp util
Deletes all the tables generated during gaming sessions
*/
const cleanUp = async (callback) => {
    const tables = await connectKnex.schema.raw("SELECT name FROM sqlite_master WHERE type='table';");
    var found = 0;
    for (var i = 0; i < tables.length; i++) {

        if (tables[i].name === 'sqlite_sequence') {
            tables.splice(i, 1);
            found++;
        }
        if (found === 1) {
            break;
        }
    }
    for (table of tables) {
        await connectKnex.schema.dropTable(table.name);
    }
    callback();
}

module.exports = {
    newGame,
    addScore,
    cleanUp
}