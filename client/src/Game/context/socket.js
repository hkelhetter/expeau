import io from 'socket.io-client'
//socket used to communicate with nodejs server
const socket = io("http://192.168.1.18:4001")
export { socket };
