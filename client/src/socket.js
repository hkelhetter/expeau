import io from 'socket.io-client'
//socket used to communicate with nodejs server

/* 
    the URL should look something like that : http://ip-address:some-port
    the url is the same as the server which means all we have to do is changing the port using substring 
*/
const port = 4001
let url = window.location.href
let socket = io(`${url.substring(0, url.lastIndexOf(":") + 1)}${port}`)
export { socket };
