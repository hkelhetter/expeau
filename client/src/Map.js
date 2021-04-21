import React, { useState, useEffect, Component } from 'react'
import io from "socket.io-client";
import { HexGrid } from 'react-hexgrid';
import TilesLayout from "./TilesLayout"
const ENDPOINT = "http://127.0.0.1:3001";

class Map extends Component {
    /*const socket = io(ENDPOINT); const[map, setMap] = useState('')

    useEffect(() => {
        socket.emit('load settings')

    }, [])
socket.on('settings is here', data => {

    setMap(data)
})
componentDidMount() {

}*/
    render() {
        return (
            <>
                <HexGrid width={1600} height={1000} viewBox="-50 -50 100 100">
                    <TilesLayout />
                </HexGrid>
            </>
        );
    }
}
export default Map