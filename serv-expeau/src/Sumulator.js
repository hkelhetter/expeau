async function Calculate(){
    const { exec } = require("child_process");

    const res = await new Promise((resolve) => {
            exec("./Simulator/xsimul.out < xsimul.in", (error, stdout, stderr) => {
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

module.exports = {
    Calculate
}