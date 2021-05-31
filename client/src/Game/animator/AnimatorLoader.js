import React from 'react'
import { socket } from '../../socket.js'
import AnimatorUI from './AnimatorUI.js'
import CreateConversation from "../CreateConversation.js"
import PropTypes from 'prop-types';

export default class AnimatorLoader extends React.Component {
    /* 
        Input : props={name}
                name: string : name of the player
        
        Syntax : <AnimatorLoader name="player's name"/>
    */
    constructor(props) {
        console.log(props)
        super(props)
        this.state = { lstPlayer: "", lstTile: "" }
        this.addConvo = this.addConvo.bind(this)
    }
    static propTypes = {
        name: PropTypes.string.isRequired
    }
    /* 
Function : addConvo

Syntax  : boolean=addConvo(data)

Input   : object following the next pattern
            {
                convoName : "name of the conversation",
                player1 : boolean,
                player2 : boolean
                ...
            }
            playerN's represents the player's name and the value represents 
                    whether or not it is part of the conversation

Output  : the success of the function

Description : display the different components of the app

Authore : Hugo KELHETTER
    
*/
    addConvo(data) {

        if (data.convoName.length == 0) {
            alert("vous devez entrer un nom")
            return false
        }
        for (const entry in this.state.lstConvo) {
            if (entry == data.convoName) {
                alert("Nom déjà pris")
                return false
            }
        }
        let newConvo = []
        const name = data.convoName
        for (const entry in data.lstPlayer) {
            if (!(entry == "convoName" || entry == "lstConvo")) {
                if (data.lstPlayer[entry]) newConvo.push(entry)
            }
        }

        if (newConvo.length > 0) {
            this.setState({ lstConvo: { ...this.state.lstConvo, [name]: newConvo } })
            return true
        }
        alert("Vous devez selectionner des joueurs")
        return false
    }
    componentDidMount() {

        socket.emit("getCurrentGrid", (response) => {
            let tiles = {}

            Object.keys(response).map((tile) => {
                if (response[tile].player != null) {
                    tiles[tile] = { player: response[tile].player, id: response[tile].Id, cellPlayer: response[tile].cellPlayer }
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
        return (
            <>
                {(this.state.lstPlayer != "" && this.state.lstTile != "") ?
                    [<AnimatorUI lstPlayer={this.state.lstPlayer} lstTile={this.state.lstTile} />,
                    <CreateConversation lstPlayer={this.state.lstPlayer} addConvo={this.addConvo} name={this.props.name} />] : ""}
            </>);
    }
}