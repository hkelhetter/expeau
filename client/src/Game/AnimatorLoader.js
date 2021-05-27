import React from 'react'
import { socket } from '../socket.js'
import AnimatorUI from './AnimatorUI.js'
export default class AnimatorLoader extends React.Component {
    constructor(props) {
        super(props)
        this.state = { lstPlayer: "", lstTile: "" }
    }
    componentDidMount() {
        socket.emit("getCurrentGrid", (response) => {
            let tiles = {}
            Object.keys(response).map((tile) => {
                if (response[tile].player != null) {
                    tiles[tile] = { player: response[tile].player, id: response[tile].Id, cellPlayer: response[tile].cellPlayer, role: response[tile].role }
                }
            })
            this.setState({ lstTile: tiles })
        })
        socket.emit("playersInRoom", (response) => {
            this.setState({ lstPlayer: response })
            //})
        })
    }
    render() {
        console.log(this.state)
        return (
            (this.state.lstPlayer != "" && this.state.lstTile != "") ? <AnimatorUI lstPlayer={this.state.lstPlayer} lstTile={this.state.lstTile} /> : ""
        );
    }
}