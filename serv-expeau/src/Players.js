// Module that controls database of the players
// 
// Author: Daniil Kudriashov (daniil.kudriashov@etu.unistra.fr)
// Date: 29 april 2021


const knex = require("knex")

const connectKnex = knex({
    client : "sqlite3",
    connection: {
        filename: "./db/players.sqlite3"
    }
});

const newGame = async (roomName) => {
    await connectKnex.schema.createTable(roomName, table => {
        table.increments('Id');
        table.integer('Role');
        table.text('Name');
        table.integer('ut');
        table.integer('ub');
        table.unique('Id');
    })
}


// Function: add new player
// 
//  Inputs
//     roomName:      Name of the room (string)
//     name:          Nickname of the player (string)
//     role:          Role of the player (int)
//                      0: coach
//                      1: agriculteur
//                      2: 
//  Output
//     playerId:      Id given to this player
//
const addPlayer = async (name, role, roomName) => {
    console.log("adding player", name, role, roomName);
    var playerId = await connectKnex(roomName).count();
    playerId = playerId[0]['count(*)'] + 1;
    const ut = 12;
    const ub = 12;
    await connectKnex(roomName).insert({Id : playerId, Name: name, Role: role, ut: ut, ub: ub});
    return playerId;
}

// Function: remove existing player
// 
//  Inputs
//     
//     
//
const removePlayer = (playerId, roomName) => {
    try {
        connectKnex(roomName).where({ Id : playerId }).del();
    } catch (error) {
        console.log("Player does not exist");
    }
    
}

// Function: Return array of players with all their info
// 
//  Inputs
//     roomName:      Name of the room (string)
//  Output
//     players:      array of players in the room 
//                      for structure see Players database
//
const getPlayersFromRoom = async (roomname) => {
    return await connectKnex(roomname).select("*");
}

// Function: Return array of players with all their info
// 
//  Inputs
//     playerId:      Id of the player (int)
//  Output
//     stats:      return array of objects {ut: (int), ub: (int)}
//
const getPlayersStats = async (playerId, roomName) => {
    return await connectKnex(roomName).select("ut", "ub").where({ID : playerId});
}

module.exports = {
    newGame,
    addPlayer,
    removePlayer,
    getPlayersFromRoom,
    getPlayersStats
}

