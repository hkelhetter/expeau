import React from 'react'
import { socket } from '../../socket.js'
import PropTypes from 'prop-types';
import { generateHexes, generateRivers } from "../map/MapUtil.js"
import Bassin from "../map/Bassin.js"
import handleClickTile from '../controls/handleClickTileFarmer.js'
import ChangeTile from './ChangeTile.js'
import Menu from '../controls/Menu.js'
import { Button } from '@material-ui/core'
//import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
//import CheckBoxIcon from '@material-ui/icons/CheckBox';


export default class AnimatorLoader extends React.Component {
    /* 
        Input : props={name}
                name: string : name of the player
        
        Syntax : <AnimatorLoader name="player's name"/>
    */
    constructor(props) {
        super(props)
        this.state = { lstPlayer: "", lstTile: "", map: { moreHexas: "", moreRivers: null }, mapReady: true }
        //this.addConvo = this.addConvo.bind(this)
        this.handleClickTile = handleClickTile.bind(this)

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

Author : Hugo KELHETTER
    
*/
    addConvo = (data) => {

        if (data.convoName.length === 0) {
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
            const newHexas = generateHexes(response)
            let lstTile = newHexas[1]
            const newRivers = generateRivers(newHexas[0])
            //const tampon = this.createTampon(newHexas, this.state.map.player)
            this.setState({ map: { ...this.state.map, moreHexas: newHexas[0], moreRivers: newRivers, selectedTile: null }, lstTile })
        })
        socket.emit("playersInRoom", (response) => {
            this.setState({ lstPlayer: response })
            //})
        })
    }
    updateObject(source, newData) {
        for (const key in newData) {
            source[key] = newData[key]
        }
        console.log(source.eco)
        return source
    }
    updateMap = (tileChange) => {
        /* socket.emit("getCurrentGrid", (response) => {
            const newHexas = generateHexes(response)
            let lstTile = newHexas[1]
            const newRivers = generateRivers(newHexas[0])
            //const tampon = this.createTampon(newHexas, this.state.map.player)
            this.setState({ map: { ...this.state.map, moreHexas: newHexas[0], moreRivers: newRivers, selectedTile: null }, lstTile })
        }) */
        let tile = this.state.map.moreHexas[tileChange.selectedTile - 1]
        console.log(tile)
        delete tileChange.selectedTile
        tile = this.updateObject(tile, tileChange)
        this.setState({ selectedTile: "" })

    }

    handleSubmit = () => {
        if (this.state.mapReady) {
            this.setState({ mapReady: false })
            socket.emit("mapReady")
        }
        else {
            socket.emit("nextTurn", () => {
            })
        }
    }
    render() {

        return (<>
            {this.state.mapReady && "Vous pouvez modifier la carte avant le début de la partie. "}
            Cliquez sur une case pour apporter des modifications
            <div className="App">
                {
                    < Menu >
                        <Button variant="contained" color="primary" data-testid="submit" onClick={this.handleSubmit}>
                            {this.state.mapReady ? "Commencer la partie" : "Terminer le tour"}
                        </Button>
                        {(this.state.lstPlayer !== "" && this.state.lstTile !== "" && this.state.selectedTile) &&
                            <div id="changeTile"><ChangeTile lstPlayer={this.state.lstPlayer} lstTile={this.state.map.moreHexas} updateMap={this.updateMap}
                                selectedTile={this.state.selectedTile} type={this.state.selectedTile.className} id={this.state.selectedTile.id} />
                            </div>
                        }


                    </Menu>
                }
                {
                    this.state.map.moreHexas !== "" && <Bassin handleClick={this.handleClickTile} selectedId={this.state.selectedTile?.id}
                        map={this.state.map} role={this.props.role} id={this.state.id} />
                }


            </div >
        </>);
    }
}