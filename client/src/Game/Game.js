import React from 'react'
import { generateHexes, generateRivers } from "./map/MapUtil.js"
import Bassin from "./map/Bassin.js"
import ActivitySwapper from "./controls/ActivitySwapper.js"
import ValidationTour from "./controls/ValidationTour.js"
import handleClickTile from './controls/handleClickTileFarmer.js'
import Chat from "./Chat.js"
import { socket } from "../socket.js"
import Ressources from "./controls/Ressources.js"
import '../index.css'
import PropTypes from 'prop-types';
import SlideField from "./controls/SlideField.js"
import Menu from "./controls/Menu.js"
import Diary from "./Diary.js"
class Conteneur extends React.Component {
    /* 
        Input : props={name,role}
                name : string : player's name
                role : number : player's name

        Syntax : <Game name={name} role={role} />
    */
    constructor(props) {
        super(props)
        //this.changeTileActivity = this.changeTileActivity.bind(this)
        this.handleClickTile = handleClickTile.bind(this)
        //this.a = this.a.bind(this)


        this.state = {
            map: { moreHexas: "", moreRivers: null },
            selectedTile: null, HexasTampon: null,
            cost: {},
            tour: 0,
            fini: false,
            actions: {},
            lstConvo: {},
            displayDiary: false
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

        Author : Hugo KELHETTER
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
        
        Author : Hugo KELHETTER
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
                
        Author : Hugo KELHETTER
    */
    changeTileActivity = (value, changeAll) => {
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
            hexagons[this.state.selectedTile.id - 1].modified = true
        }
        this.setState({ map: { ...this.state.map, moreHexas: hexagons }, selectedTile: null })

        console.log(this.state)
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
    receiveNewMap = (response) => {
        const [newHexas, lstTile] = generateHexes(response)
        const newRivers = generateRivers(newHexas)
        this.setState({ map: { ...this.state.map, moreHexas: newHexas, moreRivers: newRivers }, lstTile })
    }
    /* 
        Function : componentDidMount
    
        Description : subscribe to the required function from server to keep up to date

        Author : Hugo KELHETTER
            
    */
    componentDidMount() {
        socket.on("nextTurn", () => {
            this.setState({ tour: this.state.tour + 1, fini: false })
            console.log("next turn")
        })

        if (this.props.role < 10) {
            socket.emit("updateStats", (response) => {
                this.setState({ ressources: response[0] })
            })
        }

        socket.on("results", (response) => {
            this.setState({ ressources: response.stats, data: response.graph, fini: false, displayDiary: true, tour: this.state.tour + 1 })
            socket.emit("getCurrentGrid", (response) => {
                console.log("getCurrentGrid")
                this.receiveNewMap(response)
            })
            //    this.setState({ ressources: response[0] })

        })
        /*  socket.emit("createRoom", "player1", 0, (responseCreateRoom) => {
             this.setState({ room: responseCreateRoom })
             socket.emit("startGame")*/

        socket.emit("getCurrentGrid", (response) => {
            this.receiveNewMap(response)
/*             const [newHexas, lstTile] = generateHexes(response)
            const newRivers = generateRivers(newHexas)
            this.setState({ map: { ...this.state.map, moreHexas: newHexas, moreRivers: newRivers }, lstTile })
 */        })
        socket.emit("getAllActions", (response) => {
            this.setState({ lstActions: response })
        })
        socket.emit("playersInRoom", (response) => {
            const player = response.filter((player, i) => player.Name === this.props.name)
            this.setState({ lstPlayer: response, id: player[0].Id })
            //})
        })
    }
    componentWillUnmount() {
        socket.removeAllListeners()
    }

    roleToString(role) {
        if (role < 10) return "agriculteur"
        if (role < 14) return "élu"
        return "gestionnaire"
    }
    endRound = () => { this.setState({ fini: true }) }

    /* 
        Function : render
    
        Syntax  : render()
    
        Description : display the different components of the app
        
        Author : Hugo KELHETTER
    */
    closeDiary = () => {
        this.setState({ displayDiary: false })
    }

    render() {
        /*  let selectedId = -1
         if (this.state.selectedTile) selectedId = this.state.selectedTile.id */
        return (<>

            < div className="App" >
                <SlideField />
                {this.state.displayDiary &&
                    <Diary data={this.state.data} closeDiary={this.closeDiary} />}
                {/*  {(this.state.lstPlayer != undefined && this.state.lstTile != undefined) ? <AnimatorUI lstPlayer={this.state.lstPlayer} lstTile={this.state.lstTile} /> : ""} */}
                <Menu >
                    <div id="menu">

                        <p>tour : {this.state.tour}</p>
                        <p>Bonjour {this.props.name}.</p>
                        Vous êtes {this.roleToString(this.props.role)}, votre identifiant est {this.state.id}
                        {/* {this.state.displayDiary && <Diary closeDiary={this.closeDiary} />} */}
                        {this.state.ressources !== undefined && <Ressources ressources={this.state.ressources} cost={this.state.cost} />}

                        {this.state.fini ? <>
                            En attente des autres joueurs...
                            {/* only display the components if a tile is selected */}

                        </> : <>
                            {this.state.selectedTile === null ? "" :
                                <ActivitySwapper key="changeActivity" changeTileActivity={this.changeTileActivity}
                                    selectedTile={this.state.selectedTile} actions={this.state.lstActions} />
                            }
                            <ValidationTour key="validation" endRound={this.endRound} tour={this.state.tour} actions={this.state.actions} />
                        </>}
                    </div>
                </Menu>
                {Object.keys(this.state.lstConvo).length > 0 ? <Chat lstConvo={this.state.lstConvo} /> : ""}

                {
                    this.state.map.moreHexas !== "" && <Bassin handleClick={this.handleClickTile}
                        map={this.state.map} role={this.props.role} selectedId={this.state.selectedTile?.id} id={this.state.id} />
                }
            </div >
        </>
        )
    }
}
export default Conteneur