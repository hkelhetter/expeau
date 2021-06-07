const cwd = './Simulator/Games';
const { exec } = require("child_process");
const { stdout, stderr } = require("process");
const fs = require("fs");

async function calculate(room, tour){
    const file = `./Simulator/Games/${room}/simul.in`;

    var lines  = await new Promise(resolve => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            resolve(data);
            
        })
    });

    lines = tour + lines.slice(1);


    await new Promise(resolve => {
        
        fs.writeFile(file, lines, err => {
            if(err){  
                console.log(err);
            }
            resolve();
        });
        
    });

    const res = await new Promise((resolve) => {
            const comm = `../../xsimul.out < ./simul.in > ./res`;
            exec(comm, {cwd: cwd + `/${room}`} ,(error, stdout, stderr) => {
            if (error) {
                resolve(`error : ${error}`)
            }
            if (stderr) {
                resolve(`stderr : ${stderr}`)
            }
            resolve("ok");
        });
    });
    return(res);
}

async function newGame(room){
    var comm = "mkdir " + room;
    await new Promise((resolve) => {
            exec(comm, {cwd: cwd}, (error, stdout, stderr) => {
            if(error){
                console.log(error);
            }
            if(stderr) {
                console.log(stderr);
            }
            resolve();
        });
    });
    comm = "cp -p ../Orig/* ./" + room;
    await new Promise((resolve) => {
        exec(comm, {cwd: cwd}, (error, stdout, stderr) => {
            if(error){
                console.log(error);
            }
            if(stderr) {
                console.log(stderr);
            }
            resolve();
        });
    });
}
 
async function getLastPlayerStats(room, playerId){
    const file = `./Simulator/Games/${room}/newUtUbP${playerId}.txt`

    console.log("Reading file", file);

    const res = await new Promise(resolve => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
            console.error(err)
            resolve(-1);
            }
            resolve(data)
        });
    });

    if(res === -1){
        return -1;
    }

    const lines = res.split("\n");
    const stats = {
        ut: parseInt(lines[1].split("         ")[1]),
        ub: parseInt(lines[1].split("         ")[2])
    }
    return stats;
}

async function getPlayerGraph(room, playerId){
    const file = `./Simulator/Games/${room}/imgP${playerId}.png`;

    var res = await new Promise(resolve => {
        fs.readFile(file, 'utf8', (err, data) => {
            if(err) {
                console.error(err);
                return
            }
            resolve(data)
        })
    });
    res = "data:image/png;base64,"+ res.toString("base64");
    return res;
}



async function cleanUp(callback){
    const comm = 'rm -r ./Simulator/Games/*';
    await new Promise((resolve) => {
        exec(comm,  (error, stdout, stderr) => {
            if(error){
                console.log(error);
            }
            if(stderr) {
                console.log(stderr);
            }
            resolve();
        });
    });
    callback();
}

module.exports = {
    calculate,
    newGame,
    getLastPlayerStats,
    getPlayerGraph,
    cleanUp,
}