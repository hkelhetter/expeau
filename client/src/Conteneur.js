import React from 'react'
import { generateHexes, generateRivers } from "./map/MapUtil.js"
import Bassin from "./map/Bassin.js"
import ActivitySwapper from "./controls/ActivitySwapper.js"
import InfoTile from "./controls/InfoTile.js"
import ValidationTour from "./controls/ValidationTour.js"
import AdminControls from './controls/AdminControls.js'
import handleClickTile from './controls/handleClickTileFarmer.js'

class Conteneur extends React.Component {
    constructor(props) {
        super(props)
        // lie les fonctions pour récupérer les states lorsqu'elles sont lancées dans <ActivitySwapper/>
        this.changeTileActivity = this.changeTileActivity.bind(this)
        this.handleClickTile = handleClickTile.bind(this)

        // initialise la carte et la stock dans le state de Conteneur
        const hexagonSize = { x: 5, y: 5 };
        const moreHexas = generateHexes();
        const moreRivers = generateRivers(moreHexas);
        this.state = { hexagonSize, moreHexas, moreRivers, selectedTile: null, role: "agriculteur" }
    }
    /*
        fonction déclenchée lorsque le formulaire dans <ActivitySwapper/> est envoyé
        modifie l'activité de la case sélectionnée ou toutes celle du sous-bassin par celle mise en paramètre
        met à jour le state de la carte des hexagons et modifie la couleur de la case en conséquence
        selectedTile vaut null
    */
    changeTileActivity(value, changeAll) {
        const hexagons = this.state.moreHexas;
        if (changeAll) {
            const bassin = hexagons[this.state.selectedTile.id].bassin
            Object.values(hexagons).forEach(hex => {
                if (hex.bassin === bassin) {
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
                <ValidationTour arrayToSend={this.state.moreHexas} key="validation" />
                {/* n'affiche les composants du tableau que si une tuile est sélectionnée */}
                {this.state.selectedTile === null ? "" :
                    [
                        <InfoTile key="info" />,
                        <ActivitySwapper key="changeActivity" changeTileActivity={this.changeTileActivity}
                            selectedTile={this.state.selectedTile} />
                    ]
                }
            </div>
            <Bassin handleClick={this.handleClickTile} map={this.state} />
        </div>
        )
    }
}
export default Conteneur