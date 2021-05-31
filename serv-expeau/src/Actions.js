// Module that controls database of the actions
// 
// Author: Daniil Kudriashov (daniil.kudriashov@etu.unistra.fr)
// Date: 30 april 2021


const knex = require("knex")

const connectKnex = knex({
    client : "sqlite3",
    connection: {
        filename: "./db/actions.sqlite3"
    }
});

// Function: called on the start to create table of action at the start of the game
// 
//  Inputs
//     roomName:      Name of the room (string)
// 
const newGame = async (roomName) => {
    await connectKnex.schema.createTable(roomName, table => {
        table.increments('id');
        table.integer('playerId');
        table.integer('hexID');
        table.integer('typeAction');
        table.integer('actionID');
        table.integer('tour');
        table.unique('id');
    })
};

// Function: add list of actions of the player
// 
// 
//  Inputs
//     roomName:      Name of the room (string)
//     playerId:      ID of the player (int)
//     actions:       array of objects [ { hexID: , action: , typeAction: } ]
//                      where hexID (int) - ID of the hex, action (int) - ID of the action, typeAction (int) - type of the action
//     tour:          Number of the current tour
//  
const addActions = async (roomName, playerId, actions, tour) => {
    var actionId = await connectKnex(roomName).count();
    actionId = actionId[0]['count(*)'] + 1;

    for(const action of actions){
        await connectKnex(roomName).insert({id: actionId, playerId: playerId, hexID: action.hexID, typeAction: action.typeAction, actionID: action.action, tour: tour});
        actionId++;
    }
    
    
}

// Function: return array of player's actions
// 
// 
//  Inputs
//     roomName:      Name of the room (string)
//     playerId:      ID of the player (int)
//     tour:          Number of the current tour
//  
//  Output
//     resp:          Array of player's actions
//                      see structure of the database for the format
//
const getPlayerActions = async (roomName, playerId, tour) => {
    console.log("Looking for player", playerId, "tour", tour);
    const resp = await connectKnex(roomName).select('typeAction', 'actionID').where({playerId: playerId, tour: tour});
    console.log(resp);
    return resp;
}

const getAllActions = async () => {
    const resp = await connectKnex('ActionCards').select().where('Id', '>', 100);
    return resp;
}

module.exports = {
    newGame,
    addActions,
    getPlayerActions,
    getAllActions
}

