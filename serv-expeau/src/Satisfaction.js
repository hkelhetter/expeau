const knex = require("knex")

const connectKnex = knex({
    client : "sqlite3",
    connection: {
        filename: "./db/satisfaction.sqlite3"
    }
});

const newGame = async (roomName) => {
    await connectKnex.schema.createTable(roomName, table => {
        table.increments('id');
        table.integer('playerId');
        table.integer('tour')
        table.integer('score');
    })
}

const addScore = async (roomName, playerId, tour, score) => {
    await connectKnex(roomName).insert({playerId: playerId, tour: tour, score: score});
}

module.exports = {
    newGame,
    addScore
}