/* 
    Function : createTampon

    Syntax  : HexasTampon=createTampon(moreHexas)
    
    Input   : moreHexas : object containing data to create hexagons
        
    Outputs : HexasTampon : a copy of moreHexas containing a subset of entries

    Description : 
        create a copy of moreHexas containing a subset of entries of moreHexas.
        the remaining entries are those the players can change directly.
*/
/* 
    Function : updateMap

    Syntax  : updateMap(newData)
            
    Input   : object containing the data to update the state
        
    Description : update the state of the map with new data received from the server. call createTampon automatically
        
*/
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
*/
/* 
    Function : render

    Syntax  : render()

    Description : display the different components of the app
        
*/
import React from 'react'
import { generateHexes, generateMap, generateRivers } from "./map/MapUtil.js"
import Bassin from "./map/Bassin.js"
import ActivitySwapper from "./controls/ActivitySwapper.js"
import InfoTile from "./controls/InfoTile.js"
import ValidationTour from "./controls/ValidationTour.js"
import AdminControls from './controls/AdminControls.js'
import handleClickTile from './controls/handleClickTileFarmer.js'
import Chat from "./Chat.js"
import { socket } from "./context/socket.js"
import Ressources from "./controls/Ressources.js"
import '../index.css'
import CreateConversation from './CreateConversation.js'

class Conteneur extends React.Component {
    constructor(props) {
        super(props)
        this.changeTileActivity = this.changeTileActivity.bind(this)
        this.handleClickTile = handleClickTile.bind(this)
        this.a = this.a.bind(this)
        this.addConvo = this.addConvo.bind(this)

        //=> '46.5.21.123'

        //=> 'fe80::200:f8ff:fe21:67cf'
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
    /* 
        créé une copies de moreHexas en ne récupérant que le champ modifiable par le joueur
        cela permet de garder une trâce de l'état du bassin au début du tour et donc faire 
            les logs et modifications à la validation du tour
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
        met à jour le state de moreHexas avec de nouvelles données et créé une copie en appelant createTampon
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
        fonction déclenchée lorsque le formulaire dans <ActivitySwapper/> est envoyé
        modifie l'activité de la case sélectionnée ou toutes celle du sous-bassin par celle mise en paramètre
        met à jour le state de la carte des hexagons et modifie la couleur de la case en conséquence
        selectedTile vaut null
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
    addConvo(data) {

        if (data.convoName.length == 0) return false
        for (const entry in this.state.lstConvo) {
            if (entry == data.convoName) {
                alert("nom déjà pris")
                return false
            }
        }
        let newConvo = []
        const name = data.convoName
        for (const entry in data) {
            if (!(entry == "convoName" || entry == "lstConvo")) {
                if (data[entry]) newConvo.push(entry)
            }
        }
        if (newConvo.length > 0) {
            this.setState({ lstConvo: { ...this.state.lstConvo, [name]: newConvo } })
            return true
        }
        return false
    }

    componentDidMount() {
        socket.emit("createRoom", "player1", 0, (responseCreateRoom) => {
            this.setState({ room: responseCreateRoom })
            socket.emit("startGame")
            socket.emit("updateStats", (response) => {
                this.setState({ ressources: response[0] })
            })
            socket.emit("getCurrentGrid", (response) => {
                const newHexas = generateHexes(response)
                const newRivers = generateRivers(newHexas)
                //const tampon = this.createTampon(newHexas, this.state.map.player)
                this.setState({ map: { ...this.state.map, moreHexas: newHexas, moreRivers: newRivers } })
            })
            socket.emit("getAllActions", (response) => {
                this.setState({ lstActions: response })
            })
            socket.emit("playersInRoom", (response) => {
                this.setState({ lstPlayer: response })
            })
        })
    }
    componentWillUnmount() {
        socket.removeAllListeners()
    }
    async a() {
        this.setState({ tour: this.state.tour + 1 })

    }
    render() {
        return (
            < div className="App" >

                <div id="a">
                    <div id="menu">
                        <p>MENU</p>
                        <button onClick={this.a}>{this.state.tour}</button>
                        {this.state.lstPlayer != undefined ? <CreateConversation lstPlayer={this.state.lstPlayer} addConvo={this.addConvo} /> : ""}
                        <Ressources ressources={this.state.ressources} cost={this.state.cost} />
                        <ValidationTour key="validation" updated={this.state.map.moreHexas} origin={this.state.HexasTampon} tour={this.state.tour} actions={this.state.actions} />
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
                { this.state.map.moreHexas !== "" ? <Bassin handleClick={this.handleClickTile} map={this.state.map} /> : ""}
            </div >
        )
    }
}
export default Conteneur