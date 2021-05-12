import io from 'socket.io-client'
const socket = io("http://192.168.1.18:4001")
export { socket };
