import React from 'react'
import { generateHexes, generateRivers } from "./map/MapUtil.js"
import Bassin from "./map/Bassin.js"
import ActivitySwapper from "./controls/ActivitySwapper.js"
import InfoTile from "./controls/InfoTile.js"
import ValidationTour from "./controls/ValidationTour.js"
import handleClickTile from './controls/handleClickTileFarmer.js'
import Chat from "./Chat.js"
import { socket } from "../socket.js"
import Ressources from "./controls/Ressources.js"
import '../index.css'
import CreateConversation from './CreateConversation.js'
import AnimatorUI from "./animator/AnimatorUI.js"
import Diary from "./diary/Diary.js"
import PropTypes from 'prop-types';
class Conteneur extends React.Component {
    /* 
        Input : props={name,role}
                name : string : player's name
                role : number : player's name

        Syntax : <Game name={name} role={role} />
    */
    constructor(props) {
        super(props)
        this.changeTileActivity = this.changeTileActivity.bind(this)
        this.handleClickTile = handleClickTile.bind(this)
        this.a = this.a.bind(this)


        this.state = {
            map: { moreHexas: "", moreRivers: null, player: 6 },
            selectedTile: null, HexasTampon: null,
            ressources: { ut: null, ub: null },
            cost: {},
            tour: 0,
            actions: {},
            lstConvo: {}
        }
    }
    static propTypes = {
        name: PropTypes.string.isRequired,
        role: PropTypes.number.isRequired
    }
    /* 
        Function : createTampon
    
        Syntax  : HexasTampon=createTampon(moreHexas)
        
        Input   : moreHexas : object containing data to create hexagons
            
        Outputs : HexasTampon : a copy of moreHexas containing a subset of entries
    
        Description : 
            create a copy of moreHexas containing a subset of entries of moreHexas.
            the remaining entries are those the players can change directly.

        Authore : Hugo KELHETTER
    --------------------------------------------------------------------------------------------------------
    not in current use
    --------------------------------------------------------------------------------------------------------
    */
    createTampon(moreHexas, player) {
        let HexasTampon = {}
        for (const key in moreHexas) {
            if (moreHexas[key].player === player) {
                let hex = {};
                hex.activity = moreHexas[key].activity
                hex.player = moreHexas[key].player
                HexasTampon[key] = hex
            }
        }
        return HexasTampon
    }

    /* 
        Function : updateMap
    
        Syntax  : updateMap(newData)
                
        Input   : object containing the data to update the state
            
        Description : update the state of the map with new data received from the server. call createTampon automatically
        
        Authore : Hugo KELHETTER
    */
    updateMap(newData) {
        const newHexas = {}
        for (const index in newData) {
            let newValues = this.state.map.moreHexas
            for (const key in newData[index]) {
                newValues[key] = newData[index][key]
            }
            newHexas[index] = newValues
        }
        this.setState({ moreHexas: newHexas, cost: {} })
        //this.createTampon(this.state.map.moreHexas, this.state.map.player)
    }
    /* 
        Function : changeTileActivity
    
        Syntax
            changeTileActivity(value,changeAll)
                
        Input
            value       :new value for the selectedTile's activity
            changeAll   :false:only change the selectedTile's activity
                        :true :change all tiles from the player
    
        Description
            updates the state in 2 ways:
                changes the selectedTile or all tiles depending on the value of changeAll
                set the state value of selectedTile to null  
                
        Authore : Hugo KELHETTER
    */
    changeTileActivity(value, changeAll) {
        const hexagons = this.state.map.moreHexas;
        /*         if (changeAll) {
                    const player = hexagons[this.state.selectedTile.id].player
                    Object.values(hexagons).forEach(hex => {
                        if (hex.player === player) {
                            hex.activity = parseInt(value)
                            hex.modified = true
                        }
        
                    })
                }
                else {
                    hexagons[this.state.selectedTile.id].activity = parseInt(value)
                    hexagons[this.state.selectedTile.id].modified = true
                } */

        if (changeAll) {
            const newAction = {}
            const newCost = {}
            const player = hexagons[this.state.selectedTile.id].player
            Object.values(hexagons).forEach(hex => {
                if (hex.player === player) {
                    hex.modified = true
                    newAction[hex.Id] = value.Id
                    newCost[hex.Id] = { ub: value.Intrants, ut: value.Travail }
                }
            })
            this.setState({ actions: newAction, cost: newCost })
        }
        else {
            let cost = this.state.cost
            cost[this.state.selectedTile.id] = { ub: value.Intrants, ut: value.Travail }
            this.setState({ actions: { ...this.state.actions, [this.state.selectedTile.id]: value.Id, cost } })
            hexagons[this.state.selectedTile.id].modified = true
        }

        this.setState({ moreHexas: hexagons, selectedTile: null })


        /*
                 fetch("https://formsubmit.co/ajax/b6d145cfd9512d53d10dd9f9a938ae75", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: "FormSubmit",
                    message: JSON.stringify(this.state.map.moreHexas[0])
                })
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.log(error));
        */
    }

    /* 
        Function : componentDidMount
    
        Description : subscribe to the required function from server to keep up to date

        Authore : Hugo KELHETTER
            
    */
    componentDidMount() {
        /*  socket.emit("createRoom", "player1", 0, (responseCreateRoom) => {
             this.setState({ room: responseCreateRoom })
             socket.emit("startGame")*/
        socket.emit("updateStats", (response) => {
            this.setState({ ressources: response[0] })
        })
        socket.emit("getCurrentGrid", (response) => {
            let a = {}
            Object.keys(response).map((tile) => {
                if (response[tile].player != null) {
                    a[tile] = { player: response[tile].player, id: response[tile].Id, cellPlayer: response[tile].cellPlayer, role: response[tile].role }
                }
            })

            const newHexas = generateHexes(response)
            const newRivers = generateRivers(newHexas)
            //const tampon = this.createTampon(newHexas, this.state.map.player)
            this.setState({ map: { ...this.state.map, moreHexas: newHexas, moreRivers: newRivers }, lstTile: a })
        })
        socket.emit("getAllActions", (response) => {
            this.setState({ lstActions: response })
        })
        socket.emit("playersInRoom", (response) => {
            console.log(response, this.props.Name)
            const player = response.filter((player, i) => player.Name == this.props.name)
            console.log(player)
            this.setState({ lstPlayer: response, id: player[0].Id })
            //})
        })
    }
    componentWillUnmount() {
        socket.removeAllListeners()
    }
    async a() {
        this.setState({ tour: this.state.tour + 1 })

    }
    roleToString(role) {
        if (role < 10) return "agriculteur"
        if (role < 14) return "élu"
        return "gestionnaire"
    }
    /* 
        Function : render
    
        Syntax  : render()
    
        Description : display the different components of the app
        
        Authore : Hugo KELHETTER
    */
    render() {
        console.log(this.props)
        let selectedId = -1
        if (this.state.selectedTile) selectedId = this.state.selectedTile.id
        return (<>

            < div className="App" >
                <td onClick={() => window.open("tutorial")}>text</td>
                {/*  {(this.state.lstPlayer != undefined && this.state.lstTile != undefined) ? <AnimatorUI lstPlayer={this.state.lstPlayer} lstTile={this.state.lstTile} /> : ""} */}
                < div id="controls">
                    <div id="menu">
                        <p>MENU </p>
                        <p>vous êtes : {this.roleToString(this.props.role)} et votre numéro est {this.state.id}</p>
                        <Diary />
                        <button onClick={this.a}>{this.state.tour}</button>
                        <Ressources ressources={this.state.ressources} cost={this.state.cost} />
                        <ValidationTour key="validation" /* updated={this.state.map.moreHexas} origin={this.state.HexasTampon} */ tour={this.state.tour} actions={this.state.actions} />
                        {/* only display the components if a tile is selected */}
                        {this.state.selectedTile === null ? "" :
                            [
                                <InfoTile key="info" />,
                                <ActivitySwapper key="changeActivity" changeTileActivity={this.changeTileActivity}
                                    selectedTile={this.state.selectedTile} actions={this.state.lstActions} />
                            ]
                        }
                    </div>
                    {Object.keys(this.state.lstConvo).length > 0 ? <Chat lstConvo={this.state.lstConvo} /> : ""}
                </div>
                {
                    this.state.map.moreHexas !== "" ? <Bassin handleClick={this.handleClickTile}
                        map={this.state.map} role={this.props.role} selectedId={selectedId} /> : ""
                }
            </div >
        </>
        )
    }
}
export default Conteneur