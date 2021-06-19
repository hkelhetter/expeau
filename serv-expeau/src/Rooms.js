/* 
This database is needed for the reconnection in case of a server crash to not lose all the data
*/

const knex = require("knex")

const connectKnex = knex({
    client : "sqlite3",
    connection: {
        filename: "./db/rooms.sqlite3"
    }
});

/* 
Function is called on the game start. 
Iserts new line in the rooms table for the new one
*/
async function newRoom(roomname){
    await connectKnex("rooms").insert({Name: roomname, Turn: -1});
}

/* 
Deletes requested room
*/
async function endGame(roomName){
    await connectKnex("rooms").where({Name: roomName}).del();
}

/* 
Gets list of all the rooms
*/
async function getRoomsList(){
    const res = await connectKnex("rooms").select('Name');
    return res;
}

/* 
Sets round number for selected room
*/
async function setTurn(roomName ,turn){
    await connectKnex("rooms").where({Name: roomName}).update({Turn: turn});
}

/* 
Get current turn in the room
*/
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