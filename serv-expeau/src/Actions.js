// Module that controls database of the actions
// 
// Author: Daniil Kudriashov (daniil.kudriashov@etu.unistra.fr)
// Date: 30 april 2021
const {setPractice} = require("./Grid");

const fs = require("fs");

const knex = require("knex");
const e = require("express");

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
//     actions:       array of objects [ { hexID: , action: } ]
//                      where hexID (int) - ID of the hex, action (int) - ID of the action, typeAction (int) - type of the action
//     tour:          Number of the current tour
//  
const addActions = async (roomName, playerId, actions, tour) => {
    //var actionId = await connectKnex(roomName).count();
    //actionId = actionId[0]['count(*)'] + 1;

    for(const action of actions){
        await connectKnex(roomName).insert({playerId: playerId, hexID: action.hexID, actionID: action.action, tour: tour});
        //actionId++;
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
    //console.log("Looking for player", playerId, "tour", tour);
    const resp = await connectKnex(roomName).select('*').where({playerId: playerId, tour: tour});
    //console.log(resp);
    return resp;
}

const getAllActions = async () => {
    const resp = await connectKnex('ActionCards').select().where('Id', '>', 100);
    return resp;
}

const applyActions = async (room, tour) => {
    //console.log("looking for actions in room", room);
    const actions = await connectKnex(room).select("*").where({tour: tour}).orderBy("hexID", "asc");
    // const file = `./Simulator/Games/${room}/round${tour}.txt`;
    // await new Promise(resolve => {
    //         fs.writeFile(file, "Id   player   practice   infra   localMarket\n", err => {
    //         if (err) {
    //         console.error(err)
    //         }
    //         resolve();
    //     })
    // });
    for(const action of actions){
        await setPractice(room, action.hexID, action.actionID);
        // fs.writeFile(file, `${action.hexID}   ${action.playerId}   ${action.actionID}   0   0   0\n`, {flag: 'a+'}, err => {
        //     if(err){  
        //         console.log(err);
        //     }
        // })
    };
}

const cleanUp = async (callback) => {
    const tables = await connectKnex.schema.raw("SELECT name FROM sqlite_master WHERE type='table';");
    var found = 0;
    for(var i = 0; i < tables.length; i++){
        
        if(tables[i].name === 'sqlite_sequence'){
            tables.splice(i, 1);
            found++;
        }
        if(tables[i].name === 'ActionCards'){
            tables.splice(i, 1);
            found++;
        }
        if(found === 2){
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
    addActions,
    getPlayerActions,
    getAllActions,
    applyActions,
    cleanUp
}

