import io from 'socket.io-client'
//socket used to communicate with nodejs server
/* 
    Function : setIp

    Syntax  : setIp()
        
    Input   : event : the event calling the function   

    Description : set the socket ip address on the value of the event's target.
                    the reconnectionAttempts is here to prevent socket to try to connect forever to the new
                    address each time the function is called with a wrong one
    
    Authore : Hugo KELHETTER        
*/
function setIp(event) {
    const ip = event.target.value
    socket = io(`http://${ip}:4001`, { reconnectionAttempts: 3 })
    console.log(socket.connected)
}
const port = 4001
let url = window.location.href

const a = `${url.substring(0, url.lastIndexOf(":") + 1)}${port}`
let socket = io(`${url.substring(0, url.lastIndexOf(":") + 1)}${port}`)
console.log(socket)
export { socket, setIp };
