import React from 'react'
import { generateHexes, generateRivers } from "./MapUtil.js"
import Bassin from "./Bassin.js"
import ActivitySwapper from "./ActivitySwapper.js"
import InfoTile from "./InfoTile.js"
class Conteneur extends React.Component {
    constructor(props) {
        super(props)
        // lie les fonctions pour récupérer les states lorsqu'elles sont lancées dans <ActivitySwapper/>
        this.changeTileActivity = this.changeTileActivity.bind(this)
        this.handleClickTile = this.handleClickTile.bind(this)

        // initialise la carte et la stock dans le state de Conteneur
        const hexagonSize = { x: 3, y: 3 };
        const moreHexas = generateHexes();
        const moreRivers = generateRivers(moreHexas);
        this.state = { hexagonSize, moreHexas, moreRivers, selectedTile: null }

    }
    /* 
        fonction déclenchée lorsqu'on clique sur une tuile
        modifie le state pour que selectedTile corresponde à l'id de la tuile et selectedTileActivity à son activité
        si la tuile cliquée était déjà celle sélectionnée, selectedTile vaut null
    */
    handleClickTile(h) {

        if (h.props.id === this.state.selectedTile) {
            this.setState({ selectedTile: null })
        }
        else {
            this.setState({ selectedTileActivity: h.props.activity })
            this.setState({ selectedTile: h.props.id });
        }
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
            const bassin = hexagons[this.state.selectedTile].bassin
            hexagons.forEach(hex => {
                if (hex.bassin == bassin) {
                    hex.activity = parseInt(value)
                    hex.modified = true
                }

            })
        }
        else {
            hexagons[this.state.selectedTile].activity = parseInt(value)
            hexagons[this.state.selectedTile].modified = true
        }

        this.setState({ moreHexas: hexagons })
        this.setState({ selectedTile: null })
    }
    render() {
        return (<>
            <div id="menu">
                <p>MENU</p>
                {/* n'affiche les objets que si une tuile est sélectionnée */}
                {this.state.selectedTile === null ? "" :
                    [
                        <InfoTile key="info" />,
                        <ActivitySwapper key="changeActivity" changeTileActivity={this.changeTileActivity}
                            selectedTileActivity={this.state.selectedTileActivity} selectedTile={this.state.selectedTile} />
                    ]
                }
            </div>
            <Bassin handleClick={this.handleClickTile} map={this.state} />
        </>
        )
    }
}
export default Conteneur