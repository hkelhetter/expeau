const knex = require("knex")

const connectKnex = knex({
    client : "sqlite3",
    connection: {
        filename: "./db/rooms.sqlite3"
    }
});

async function newRoom(roomname){
    await connectKnex("rooms").insert({Name: roomname, Turn: 0});
}

async function endGame(roomName){
    await connectKnex("rooms").where({Name: roomName}).del();
}

async function getRoomsList(){
    const res = await connectKnex("rooms").select('Name');
    return res;
}

async function setTurn(roomName ,turn){
    await connectKnex("rooms").where({Name: roomName}).update({Turn: turn});
}

async function getTurn(roomName){
    const res = await connectKnex("rooms").where({Name: roomName}).select('Turn');
    return res[0]['Turn'];
}

module.exports = {
    newRoom,
    endGame,
    getRoomsList,
    setTurn,
    getTurn
}