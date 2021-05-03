/* 
    Function : createTampon

    Syntax
        {}=createTampon(moreHexas)
    
    Input
        moreHexas   :object containing all the data needed to create the hexagons

    Outputs
        {}  :object containing a subset of moreHexas 

    Description
        create an object containing from moreHexas that the player can change during the turn
        this is meant to keep a track on what was change by the player at the end of their round 
    
    see /src/map/MapUtil.js for more information about moreHexas
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
    Function : 

    Syntax
        
    
    Input
        

    Outputs

    Description
        
*/
import React from 'react'
import { generateHexes, generateRivers } from "./map/MapUtil.js"
import Bassin from "./map/Bassin.js"
import ActivitySwapper from "./controls/ActivitySwapper.js"
import InfoTile from "./controls/InfoTile.js"
import ValidationTour from "./controls/ValidationTour.js"
import AdminControls from './controls/AdminControls.js'
import handleClickTile from './controls/handleClickTileFarmer.js'
import Chat from "./Chat.js"
class Conteneur extends React.Component {
    constructor(props) {
        super(props)
        // lie les fonctions pour récupérer les states lorsqu'elles sont lancées dans <ActivitySwapper/>
        this.changeTileActivity = this.changeTileActivity.bind(this)
        this.handleClickTile = handleClickTile.bind(this)

        // initialise la carte et la stock dans le state de Conteneur
        const moreHexas = generateHexes();
        const moreRivers = generateRivers(moreHexas);

        //const HexasTampon = Object.values(moreHexas).map((x) => x.activity)
        this.state = {
            map: { moreHexas, moreRivers, player: 5 },
            selectedTile: null, HexasTampon: this.createTampon(moreHexas)
        }
    }
    /* 
        créé une copies de moreHexas en ne récupérant que le champ modifiable par le joueur
        cela permet de garder une trâce de l'état du bassin au début du tour et donc faire 
            les logs et modifications à la validation du tour
    */
    createTampon(moreHexas) {
        let HexasTampon = {}
        for (const key in moreHexas) {
            let hex = {};
            hex.activity = moreHexas[key].activity
            hex.player = moreHexas[key].player
            /*             for (const val in moreHexas[key]) {
                            a[val] = moreHexas[key][val]
                        } */
            HexasTampon[key] = hex
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
        this.setState({ moreHexas: newHexas })
        this.createTampon(this.state.map.moreHexas)
    }
    /*
        fonction déclenchée lorsque le formulaire dans <ActivitySwapper/> est envoyé
        modifie l'activité de la case sélectionnée ou toutes celle du sous-bassin par celle mise en paramètre
        met à jour le state de la carte des hexagons et modifie la couleur de la case en conséquence
        selectedTile vaut null
    */
    changeTileActivity(value, changeAll) {
        const hexagons = this.state.map.moreHexas;
        if (changeAll) {
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
        }

        this.setState({ moreHexas: hexagons })
        this.setState({ selectedTile: null })
    }
    render() {
        return (<div className="App">
            <div id="menu">
                <p>MENU</p>
                <div>
                    UB : 10
                    UT : 10
                </div>
                <ValidationTour updated={this.state.map.moreHexas} origin={this.state.HexasTampon} key="validation" />
                {/* n'affiche les composants du tableau que si une tuile est sélectionnée */}
                {this.state.selectedTile === null ? "" :
                    [
                        <InfoTile key="info" />,
                        <ActivitySwapper key="changeActivity" changeTileActivity={this.changeTileActivity}
                            selectedTile={this.state.selectedTile} />
                    ]
                }
            </div>
            <Chat />
            <Bassin handleClick={this.handleClickTile} map={this.state.map} />
        </div>
        )
    }
}
export default Conteneur