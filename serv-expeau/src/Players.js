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


/* 
Function is called during the start of a new game
Creates table to stock information about the players that is needed to reconnect them in case of a crash
*/
const newGame = async (roomName) => {
    await connectKnex.schema.createTable(roomName, table => {
        table.integer('Id');
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
    var playerId;

    if(role === 1){
        const agrId = await connectKnex(roomName).where({Role: 1}).count();
        playerId = agrId[0]['count(*)'] + 1;
    }

    else{
        playerId = await connectKnex(roomName).whereNot({Role: 1}).count();
        playerId = playerId[0]['count(*)'] + 11;
    }
    const ut = 30;  //Init values
    const ub = 30;
    await connectKnex(roomName).insert({Id : playerId, Name: name, Role: role, ut: ut, ub: ub});
    return playerId;
}

/* 
Gets all available information for the player requested
For more information about returned object check Players data base structure
*/
const getPlayerInfo = async (roomName, playerName) => {
    const playerId = await connectKnex(roomName).where({Name: playerName}).select(`*`);
    return playerId[0];
}

// Function: remove existing player
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
    var res;
    try {
        res = await connectKnex(roomname).select("*");
    } catch (error) {
        res = "Partie inexistante"
    }
    return res;
}

// Function: Return array of players with all their info
// 
//  Inputs
//     playerId:      Id of the player (int)
//  Output
//     stats:      return array of objects {ut: (int), ub: (int)}
//
const getPlayersStats = async (playerId, roomName) => {
    var res;
    try {
        res = await connectKnex(roomName).select("ut", "ub").where({Id : playerId});
    } catch (error) {
        res = error;
    }
    return res;
}

/* 
Sets player's ut and ub
*/
const setPlayerStats = async (roomName, playerId, stats) => {
    try {
    await connectKnex(roomName).where({Id : playerId}).update({ut: stats.ut, ub: stats.ub});
    }
    catch (error) {

    }
}

/* 
Function is used by the cleanUp util
Deletes all the tables generated during gaming sessions
*/
const cleanUp = async (callback) => {
    const tables = await connectKnex.schema.raw("SELECT name FROM sqlite_master WHERE type='table';");
    for(var i = 0; i < tables.length; i++){
        if(tables[i].name === 'sqlite_sequence'){
            tables.splice(i, 1);
            break;
        }
    }
    for(table of tables){
        await connectKnex.schema.dropTable(table.name);
    }
    callback();

}

module.exports = {
    newGame,
    addPlayer,
    removePlayer,
    getPlayersFromRoom,
    getPlayersStats,
    getPlayerInfo,
    cleanUp,
    setPlayerStats
}

