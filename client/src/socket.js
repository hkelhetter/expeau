import io from 'socket.io-client'
//socket used to communicate with nodejs server

function setIp(event) {
    const ip = event.target.value
    socket = io(`http://${ip}:4001`)
    console.log(socket.connected)
}
let socket = io()
export { socket, setIp };
