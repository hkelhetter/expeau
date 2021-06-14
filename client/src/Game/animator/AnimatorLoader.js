import React from 'react'
import { socket } from '../../socket.js'
import PropTypes from 'prop-types';
import { generateHexes, generateRivers } from "../map/MapUtil.js"
import Bassin from "../map/Bassin.js"
import handleClickTile from '../controls/handleClickTileFarmer.js'
import ChangeTile from './ChangeTile.js'
import Menu from '../controls/Menu.js'
import { Button, Typography } from '@material-ui/core'
//import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
//import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ConfirmDialog from "../controls/ConfirmDialog.js"

export default class AnimatorLoader extends React.Component {
    /* 
        Input : props={name}
                name: string : name of the player
        
        Syntax : <AnimatorLoader name="player's name"/>
    */
    constructor(props) {
        super(props)
        this.state = { lstPlayer: "", lstTile: "", map: { moreHexas: "", moreRivers: null }, mapReady: true, tour: 0, action: "" }
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
    /* 
        Function : componentDidMount

        Description : retrieve the map and players's data

        Author : Hugo KELHETTER
 
    */
    componentDidMount() {

        socket.emit("getCurrentGrid", (response) => {
            const newHexas = generateHexes(response)
            let lstTile = newHexas[1]
            const newRivers = generateRivers(newHexas[0])
            //const tampon = this.createTampon(newHexas, this.state.map.player)
            console.log(response)

            this.setState({ map: { ...this.state.map, moreHexas: newHexas[0], moreRivers: newRivers, selectedTile: null }, lstTile })

        })
        socket.emit("playersInRoom", (response) => {
            this.setState({ lstPlayer: response })
            //})
        })
    }
    /* 
        Function : updateObject

        Syntax  : obj=updateObject(source,newData)

        Input   : source : object : the object to update
                  newData : object : the object containing new data

        Output  : obj : object : an updated object

        Description : update source with the subset of data contained in newData
                        let source = {firstname:hugo,name:kelhetter} and newData={firstname:jhon}
                        let newObject=updateObject(source,newData)
                        newObject = {firstname:jhon,name:kelhetter}

        Author : Hugo KELHETTER
    
    */
    updateObject(source, newData) {
        for (const key in newData) {
            source[key] = newData[key]
        }
        return source
    }
    /* 
        Function : updateMap

        Syntax  : updateMap(tileChange)

        Input   : tileChange : object : new set of data for a tile of the map

        Description : update the map with new data

        Author : Hugo KELHETTER
    
    */

    updateMap = (tileChange) => {
        let tile = this.state.map.moreHexas[tileChange.selectedTile - 1]
        delete tileChange.selectedTile
        tile = this.updateObject(tile, tileChange)
        this.setState({ selectedTile: "" })
    }
    /* 
        Function : handleSubmit

        Syntax  : handleSubmit()

        Description : if mapReady == false then it starts the game for other players
                      else it ends the turn

        Author : Hugo KELHETTER
    
    */
    handleSubmit = () => {
        console.log(this.state.action)
        switch (this.state.action) {
            case "Commencer la partie":
                this.setState({ mapReady: false })
                socket.emit("mapReady")
                break;
            case "Terminer la partie":
                socket.emit("endGame")
                break;
            default:
                socket.emit("nextTurn", () => {
                    socket.emit("getTurn", (response) => {
                        this.setState({ tour: response })
                    })
                })
        }
        this.setState({ displayConfirmDialog: false })
    }
    cancel = () => {
        this.setState({ displayConfirmDialog: false })
    }
    handleContinue = (event) => {
        console.log(event.currentTarget, event.currentTarget.name)
        this.setState({ action: event.currentTarget.name, displayConfirmDialog: true })
    }

    openTuto() {
        window.open(`${window.location.href}tutorial?tuto=2`)
    }
    /* 
    Function : render

    Syntax  : render()

    Description : display the UI of the animator : the map, and controls over the map and the game in general

    Author : Hugo KELHETTER
 
*/
    render() {
        const buttonValue = this.state.mapReady ? "Commencer la partie" : `Terminer le tour ${this.state.tour}`
        return (<>
            {this.state.displayConfirmDialog && <ConfirmDialog cancel={this.cancel} confirm={this.handleSubmit} action={this.state.action} />}

            <div className="App">
                {
                    < Menu >
                        <div id="menu">
                            <Button variant="contained" color="primary" onClick={this.openTuto}>
                                Aide
                            </Button>
                            <Typography> {this.state.mapReady && "Vous pouvez modifier la carte avant le début de la partie. "}</Typography>
                            <Typography> Cliquez sur une case pour apporter des modifications</Typography>
                            <Typography> L'identifiant de la partie est : {this.props.room}</Typography>
                            <Button variant="contained" color="primary" data-testid="submit" name={buttonValue} value={buttonValue} onClick={this.handleContinue}>
                                {buttonValue}
                            </Button>
                            <Button variant="contained" color="primary" data-testid="submit" name="Terminer la partie" onClick={this.handleContinue}>
                                Terminer la partie
                            </Button>
                        </div>
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