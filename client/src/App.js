/*import logo from './logo.svg';
import './App.css';
import Map from './mapManager.js'

import io from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";
const ENDPOINT = "http://127.0.0.1:3001";
const socket = io(ENDPOINT);

*/
import React, { Component } from 'react'
import './App.css';
import { HexUtils, HexGrid, Layout, Path, Hexagon, Text } from 'react-hexgrid';

const layout = {
    spacing: 1,
    orientation: {
        f0: Math.sqrt(3.0), f1: Math.sqrt(3.0) / 2.0, f2: 0.0, f3: 3.0 / 2.0, b0: Math.sqrt(3.0) / 3.0, b1: -1.0 / 3.0, b2: 0.0, b3: 2.0 / 3.0, startAngle: 0.5
    },
    size: {
        y: 3,
        x: 3,
    },
    origin: {
        x: 0,
        y: 0,
    },
};

/* génère la carte des hexagones en lisant les propriétés x0 et y0 du tableau data */
function generateHexes() {
    let hexas = [];
    let hex;
    for (let i = 0; i < data.length; i++) {
        hex = HexUtils.pixelToHex({ x: data[i].x0 * 4.75, y: 5 - data[i].y0 * 4.75 }, layout)
        //map ardiere
        //hex = HexUtils.pixelToHex({ x: (data[i].x0 + 164.6719013516826) * 4, y: (328 + data[i].y0) * -4 }, layout)

        hex.activity = data[i].mainCLC1
        hex.modified = false;
        hex.bassin = data[i].subBasin
        hexas.push(hex);
    }
    return hexas;
}
/* génère les cours d'eau en liant chaque hexagone à celui par le quel il est lié par la propriété downstreamCell */
function generateRivers(moreHexas) {
    let rivers = [];
    let path;

    for (let i = 0; i < data.length; i++) {

        path = <Path start={moreHexas[i]} end={moreHexas[data[i].downstreamCell - 1]} />
        rivers.push(path);
    }
    return rivers;
}
function App() {
    return (
        < div className="App" >
            <Conteneur />
        </div >
    );
}
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
class InfoTile extends React.Component {
    /*     constructor(props) {
            super(props)
        } */
    render() {
        return (
            <>
                <p>info carte </p>
            </>
        )
    }
}
class ActivitySwapper extends React.Component {
    constructor(props) {
        super(props);
        /* 
            initialise la valeur du formulaire de changement d'activité
            si l'activité de la tuile vaut 1, la valeur vaut 2 sinon elle vaut 1
        */
        this.state = { selectActivity: this.props.selectedTileActivity === "1" ? "2" : "1", checkbox: false };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    /* handler mettant à jour dans le state les différents composants du formulaire */
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [target.name]: value });
    }
    /* 
        évènement enclanché lors de l'envoie du formulaire
        appel de la fonction changeTileActivity du parent avec en paramètre la nouvelle valeur de l'activité
    */
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.selectActivity != null) {
            this.props.changeTileActivity(this.state.selectActivity, this.state.checkbox)
        }
    }

    render() {
        return (
            < form onSubmit={this.handleSubmit} >
                <label>
                    <p> Choisissez votre nouvelle activité de la tuile {this.props.selectedTile}</p>
                    <select name="selectActivity" value={this.state.clickedTile} onChange={this.handleChange}>
                        {/* ne propose pas l'activité déjà exercée sur la tuile */}
                        {this.props.selectedTileActivity === "1" ? "" : <option value="1">vigne</option>}
                        {this.props.selectedTileActivity === "2" ? "" : <option value="2">blé</option>}
                        {this.props.selectedTileActivity === "3" ? "" : <option value="3">bovins</option>}
                    </select>
                    <label>modifer toutes les cases
                        <input name="checkbox" type="checkbox" onChange={this.handleChange}></input>
                    </label>
                </label>
                <input type="submit" value="Envoyer" />
            </form >
        );
    }
}
class Bassin extends Component {
    constructor(props) {
        super(props)
        this.state = props.map
    }
    render() {
        return (
            <HexGrid width={'50%'} height={'100%'} viewBox="-50 -50 100 100" >
                <Layout size={this.state.hexagonSize} flat={false} spacing={1} origin={{ x: 0, y: 0 }} >
                    {/* boucle créant les hexagones */}
                    {this.state.moreHexas.map((hex, i) =>
                        <Hexagon
                            activity={hex.activity.toString()}
                            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
                            /* appel la fonction parent handleClick avec en paramètre l'hexagone */
                            onClick={(e, h, i) => this.props.handleClick(h)}
                            /* définie la classe de l'hexagone en fonction de son activité */
                            className={hex.bassin === 1 ? hex.modified + ' ' + activityToString(hex.activity) : ""} >
                            <Text>{i.toString()}</Text>
                        </Hexagon>
                    )}
                    {/* boucle créant les cours d'eau */}
                    {this.state.moreRivers.map((river, i) => <Path
                        key={i} start={river.props.start} end={river.props.end} layout={river.layout}
                    />)}
                </Layout>
            </HexGrid>
        );
    }
}
/*
    renvoie une chaîne de caractère correspondant à l'activité mise en paramètre
 */
function activityToString(activity) {
    /* return activity == 1 ? "ville"
        : activity == 2 ? "agriculture"
            : activity == 3 ? "foret"
                : "probleme" */
    switch (activity) {
        case 1: return "ville";
        case 2: return "agriculture";
        case 3: return "foret";
        default: return "notInBassin";
    }
}
export default App;
const data = [
    {
        "Id": 1,
        "areakm": 0.601875,
        "zOutlet": 265.1,
        "subBasin": 1,
        "NBH_1": 0,
        "NBH_2": 0,
        "NBH_3": 0,
        "NBH_4": 5,
        "NBH_5": 7,
        "NBH_6": 2,
        "downstreamCell": 7,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -3.57900523861765,
        "y0": 5.74839514089748
    },
    {
        "Id": 2,
        "areakm": 0.99,
        "zOutlet": 263.6,
        "subBasin": 1,
        "NBH_1": 0,
        "NBH_2": 0,
        "NBH_3": 1,
        "NBH_4": 7,
        "NBH_5": 9,
        "NBH_6": 0,
        "downstreamCell": 7,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -2.50443530679401,
        "y0": 5.74839514089748
    },
    {
        "Id": 3,
        "areakm": 0.984375,
        "zOutlet": 250.3,
        "subBasin": 1,
        "NBH_1": 5,
        "NBH_2": 0,
        "NBH_3": 0,
        "NBH_4": 12,
        "NBH_5": 14,
        "NBH_6": 4,
        "downstreamCell": 14,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -4.65357517044118,
        "y0": 3.88718542269338
    },
    {
        "Id": 4,
        "areakm": 1.040625,
        "zOutlet": 246,
        "subBasin": 1,
        "NBH_1": 7,
        "NBH_2": 5,
        "NBH_3": 3,
        "NBH_4": 14,
        "NBH_5": 16,
        "NBH_6": 6,
        "downstreamCell": 16,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -3.57900523861765,
        "y0": 3.88718542269338
    },
    {
        "Id": 5,
        "areakm": 0.77625,
        "zOutlet": 262.1,
        "subBasin": 1,
        "NBH_1": 1,
        "NBH_2": 0,
        "NBH_3": 0,
        "NBH_4": 3,
        "NBH_5": 4,
        "NBH_6": 7,
        "downstreamCell": 4,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -4.11629020452942,
        "y0": 4.8177902817959
    },
    {
        "Id": 6,
        "areakm": 0.97875,
        "zOutlet": 241.1,
        "subBasin": 1,
        "NBH_1": 9,
        "NBH_2": 7,
        "NBH_3": 4,
        "NBH_4": 16,
        "NBH_5": 18,
        "NBH_6": 8,
        "downstreamCell": 18,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -2.50443530679401,
        "y0": 3.88718542269338
    },
    {
        "Id": 7,
        "areakm": 0.984375,
        "zOutlet": 254.9,
        "subBasin": 1,
        "NBH_1": 2,
        "NBH_2": 1,
        "NBH_3": 5,
        "NBH_4": 4,
        "NBH_5": 6,
        "NBH_6": 9,
        "downstreamCell": 6,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -3.04172027270589,
        "y0": 4.8177902817959
    },
    {
        "Id": 8,
        "areakm": 0.984375,
        "zOutlet": 239.5,
        "subBasin": 1,
        "NBH_1": 0,
        "NBH_2": 9,
        "NBH_3": 6,
        "NBH_4": 18,
        "NBH_5": 20,
        "NBH_6": 0,
        "downstreamCell": 18,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -1.42986537497048,
        "y0": 3.88718542269338
    },
    {
        "Id": 9,
        "areakm": 0.984375,
        "zOutlet": 258.4,
        "subBasin": 1,
        "NBH_1": 0,
        "NBH_2": 2,
        "NBH_3": 7,
        "NBH_4": 6,
        "NBH_5": 8,
        "NBH_6": 0,
        "downstreamCell": 8,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -1.96715034088225,
        "y0": 4.8177902817959
    },
    {
        "Id": 10,
        "areakm": 0.984375,
        "zOutlet": 242.7,
        "subBasin": 1,
        "NBH_1": 12,
        "NBH_2": 0,
        "NBH_3": 0,
        "NBH_4": 25,
        "NBH_5": 27,
        "NBH_6": 11,
        "downstreamCell": 11,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -5.72814510226471,
        "y0": 2.02597570448928
    },
    {
        "Id": 11,
        "areakm": 0.97875,
        "zOutlet": 235.6,
        "subBasin": 1,
        "NBH_1": 14,
        "NBH_2": 12,
        "NBH_3": 10,
        "NBH_4": 27,
        "NBH_5": 29,
        "NBH_6": 13,
        "downstreamCell": 13,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -4.65357517044118,
        "y0": 2.02597570448928
    },
    {
        "Id": 12,
        "areakm": 0.984375,
        "zOutlet": 248.3,
        "subBasin": 1,
        "NBH_1": 3,
        "NBH_2": 0,
        "NBH_3": 0,
        "NBH_4": 10,
        "NBH_5": 11,
        "NBH_6": 14,
        "downstreamCell": 11,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -5.19086013635294,
        "y0": 2.95658056359179
    },
    {
        "Id": 13,
        "areakm": 1.035,
        "zOutlet": 231.537867965644,
        "subBasin": 1,
        "NBH_1": 16,
        "NBH_2": 14,
        "NBH_3": 11,
        "NBH_4": 29,
        "NBH_5": 31,
        "NBH_6": 15,
        "downstreamCell": 15,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -3.57900523861765,
        "y0": 2.02597570448928
    },
    {
        "Id": 14,
        "areakm": 1.029375,
        "zOutlet": 242.5,
        "subBasin": 1,
        "NBH_1": 4,
        "NBH_2": 3,
        "NBH_3": 12,
        "NBH_4": 11,
        "NBH_5": 13,
        "NBH_6": 16,
        "downstreamCell": 13,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -4.11629020452942,
        "y0": 2.95658056359179
    },
    {
        "Id": 15,
        "areakm": 0.99,
        "zOutlet": 227.425735931288,
        "subBasin": 1,
        "NBH_1": 18,
        "NBH_2": 16,
        "NBH_3": 13,
        "NBH_4": 31,
        "NBH_5": 33,
        "NBH_6": 17,
        "downstreamCell": 17,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -2.50443530679401,
        "y0": 2.02597570448928
    },
    {
        "Id": 16,
        "areakm": 0.984375,
        "zOutlet": 240.7,
        "subBasin": 1,
        "NBH_1": 6,
        "NBH_2": 4,
        "NBH_3": 14,
        "NBH_4": 13,
        "NBH_5": 15,
        "NBH_6": 18,
        "downstreamCell": 15,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -3.04172027270589,
        "y0": 2.95658056359179
    },
    {
        "Id": 17,
        "areakm": 0.97875,
        "zOutlet": 226.657537879754,
        "subBasin": 1,
        "NBH_1": 20,
        "NBH_2": 18,
        "NBH_3": 15,
        "NBH_4": 33,
        "NBH_5": 35,
        "NBH_6": 19,
        "downstreamCell": 35,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -1.42986537497048,
        "y0": 2.02597570448928
    },
    {
        "Id": 18,
        "areakm": 0.984375,
        "zOutlet": 230.625,
        "subBasin": 1,
        "NBH_1": 8,
        "NBH_2": 6,
        "NBH_3": 16,
        "NBH_4": 15,
        "NBH_5": 17,
        "NBH_6": 20,
        "downstreamCell": 17,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -1.96715034088225,
        "y0": 2.95658056359179
    },
    {
        "Id": 19,
        "areakm": 1.035,
        "zOutlet": 228.3,
        "subBasin": 1,
        "NBH_1": 0,
        "NBH_2": 20,
        "NBH_3": 17,
        "NBH_4": 35,
        "NBH_5": 37,
        "NBH_6": 21,
        "downstreamCell": 35,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -0.355295443146955,
        "y0": 2.02597570448928
    },
    {
        "Id": 20,
        "areakm": 1.029375,
        "zOutlet": 231.1,
        "subBasin": 1,
        "NBH_1": 0,
        "NBH_2": 8,
        "NBH_3": 18,
        "NBH_4": 17,
        "NBH_5": 19,
        "NBH_6": 0,
        "downstreamCell": 17,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -0.892580409058719,
        "y0": 2.95658056359179
    },
    {
        "Id": 21,
        "areakm": 0.99,
        "zOutlet": 238.493933982822,
        "subBasin": 2,
        "NBH_1": 0,
        "NBH_2": 0,
        "NBH_3": 19,
        "NBH_4": 37,
        "NBH_5": 39,
        "NBH_6": 22,
        "downstreamCell": 39,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 0.719274488676572,
        "y0": 2.02597570448928
    },
    {
        "Id": 22,
        "areakm": 0.495,
        "zOutlet": 240.5,
        "subBasin": 2,
        "NBH_1": 0,
        "NBH_2": 0,
        "NBH_3": 21,
        "NBH_4": 39,
        "NBH_5": 41,
        "NBH_6": 0,
        "downstreamCell": 39,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 1.7938444205001,
        "y0": 2.02597570448928
    },
    {
        "Id": 23,
        "areakm": 0.77625,
        "zOutlet": 251.4,
        "subBasin": 1,
        "NBH_1": 25,
        "NBH_2": 0,
        "NBH_3": 0,
        "NBH_4": 0,
        "NBH_5": 44,
        "NBH_6": 24,
        "downstreamCell": 24,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -6.80271503408824,
        "y0": 0.164765986285172
    },
    {
        "Id": 24,
        "areakm": 0.99,
        "zOutlet": 241.5,
        "subBasin": 1,
        "NBH_1": 27,
        "NBH_2": 25,
        "NBH_3": 23,
        "NBH_4": 44,
        "NBH_5": 46,
        "NBH_6": 26,
        "downstreamCell": 26,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -5.72814510226471,
        "y0": 0.164765986285172
    },
    {
        "Id": 25,
        "areakm": 0.984375,
        "zOutlet": 243.1,
        "subBasin": 1,
        "NBH_1": 10,
        "NBH_2": 0,
        "NBH_3": 0,
        "NBH_4": 23,
        "NBH_5": 24,
        "NBH_6": 27,
        "downstreamCell": 27,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -6.26543006817647,
        "y0": 1.09537084538769
    },
    {
        "Id": 26,
        "areakm": 0.97875,
        "zOutlet": 236.4,
        "subBasin": 1,
        "NBH_1": 29,
        "NBH_2": 27,
        "NBH_3": 24,
        "NBH_4": 46,
        "NBH_5": 48,
        "NBH_6": 28,
        "downstreamCell": 29,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -4.65357517044118,
        "y0": 0.164765986285172
    },
    {
        "Id": 27,
        "areakm": 0.984375,
        "zOutlet": 237.343933982822,
        "subBasin": 1,
        "NBH_1": 11,
        "NBH_2": 10,
        "NBH_3": 25,
        "NBH_4": 24,
        "NBH_5": 26,
        "NBH_6": 29,
        "downstreamCell": 29,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -5.19086013635294,
        "y0": 1.09537084538769
    },
    {
        "Id": 28,
        "areakm": 1.029375,
        "zOutlet": 234.5,
        "subBasin": 2,
        "NBH_1": 31,
        "NBH_2": 29,
        "NBH_3": 26,
        "NBH_4": 48,
        "NBH_5": 50,
        "NBH_6": 30,
        "downstreamCell": 50,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -3.57900523861765,
        "y0": 0.164765986285172
    },
    {
        "Id": 29,
        "areakm": 1.029375,
        "zOutlet": 231.993933982822,
        "subBasin": 1,
        "NBH_1": 13,
        "NBH_2": 11,
        "NBH_3": 27,
        "NBH_4": 26,
        "NBH_5": 28,
        "NBH_6": 31,
        "downstreamCell": 31,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -4.11629020452942,
        "y0": 1.09537084538769
    },
    {
        "Id": 30,
        "areakm": 0.99,
        "zOutlet": 232.2,
        "subBasin": 2,
        "NBH_1": 33,
        "NBH_2": 31,
        "NBH_3": 28,
        "NBH_4": 50,
        "NBH_5": 52,
        "NBH_6": 32,
        "downstreamCell": 52,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -2.50443530679401,
        "y0": 0.164765986285172
    },
    {
        "Id": 31,
        "areakm": 0.984375,
        "zOutlet": 231.026471862576,
        "subBasin": 1,
        "NBH_1": 15,
        "NBH_2": 13,
        "NBH_3": 29,
        "NBH_4": 28,
        "NBH_5": 30,
        "NBH_6": 33,
        "downstreamCell": 33,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -3.04172027270589,
        "y0": 1.09537084538769
    },
    {
        "Id": 32,
        "areakm": 0.97875,
        "zOutlet": 229.2,
        "subBasin": 2,
        "NBH_1": 35,
        "NBH_2": 33,
        "NBH_3": 30,
        "NBH_4": 52,
        "NBH_5": 54,
        "NBH_6": 34,
        "downstreamCell": 54,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -1.42986537497048,
        "y0": 0.164765986285172
    },
    {
        "Id": 33,
        "areakm": 0.984375,
        "zOutlet": 226.957537879754,
        "subBasin": 1,
        "NBH_1": 17,
        "NBH_2": 15,
        "NBH_3": 31,
        "NBH_4": 30,
        "NBH_5": 32,
        "NBH_6": 35,
        "downstreamCell": 35,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -1.96715034088225,
        "y0": 1.09537084538769
    },
    {
        "Id": 34,
        "areakm": 1.029375,
        "zOutlet": 223.4,
        "subBasin": 2,
        "NBH_1": 37,
        "NBH_2": 35,
        "NBH_3": 32,
        "NBH_4": 54,
        "NBH_5": 56,
        "NBH_6": 36,
        "downstreamCell": 56,
        "mainCLC1": 1,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -0.355295443146955,
        "y0": 0.164765986285172
    },
    {
        "Id": 35,
        "areakm": 1.029375,
        "zOutlet": 225.196141776686,
        "subBasin": 1,
        "NBH_1": 19,
        "NBH_2": 17,
        "NBH_3": 33,
        "NBH_4": 32,
        "NBH_5": 34,
        "NBH_6": 37,
        "downstreamCell": 34,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -0.892580409058719,
        "y0": 1.09537084538769
    },
    {
        "Id": 36,
        "areakm": 0.99,
        "zOutlet": 228.2,
        "subBasin": 2,
        "NBH_1": 39,
        "NBH_2": 37,
        "NBH_3": 34,
        "NBH_4": 56,
        "NBH_5": 58,
        "NBH_6": 38,
        "downstreamCell": 56,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 0.719274488676572,
        "y0": 0.164765986285172
    },
    {
        "Id": 37,
        "areakm": 0.984375,
        "zOutlet": 234.9,
        "subBasin": 2,
        "NBH_1": 21,
        "NBH_2": 19,
        "NBH_3": 35,
        "NBH_4": 34,
        "NBH_5": 36,
        "NBH_6": 39,
        "downstreamCell": 34,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 0.181989522764809,
        "y0": 1.09537084538769
    },
    {
        "Id": 38,
        "areakm": 0.984375,
        "zOutlet": 230.231801948466,
        "subBasin": 2,
        "NBH_1": 41,
        "NBH_2": 39,
        "NBH_3": 36,
        "NBH_4": 58,
        "NBH_5": 60,
        "NBH_6": 40,
        "downstreamCell": 58,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 1.7938444205001,
        "y0": 0.164765986285172
    },
    {
        "Id": 39,
        "areakm": 0.97875,
        "zOutlet": 230.55,
        "subBasin": 2,
        "NBH_1": 22,
        "NBH_2": 21,
        "NBH_3": 37,
        "NBH_4": 36,
        "NBH_5": 38,
        "NBH_6": 41,
        "downstreamCell": 36,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 1.25655945458834,
        "y0": 1.09537084538769
    },
    {
        "Id": 40,
        "areakm": 0.6975,
        "zOutlet": 240.6,
        "subBasin": 2,
        "NBH_1": 0,
        "NBH_2": 41,
        "NBH_3": 38,
        "NBH_4": 60,
        "NBH_5": 62,
        "NBH_6": 0,
        "downstreamCell": 38,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 2.86841435232363,
        "y0": 0.164765986285172
    },
    {
        "Id": 41,
        "areakm": 0.658125,
        "zOutlet": 244.3,
        "subBasin": 2,
        "NBH_1": 0,
        "NBH_2": 22,
        "NBH_3": 39,
        "NBH_4": 38,
        "NBH_5": 40,
        "NBH_6": 0,
        "downstreamCell": 38,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 2.33112938641186,
        "y0": 1.09537084538769
    },
    {
        "Id": 42,
        "areakm": 0.63,
        "zOutlet": 253.9,
        "subBasin": 2,
        "NBH_1": 44,
        "NBH_2": 0,
        "NBH_3": 0,
        "NBH_4": 0,
        "NBH_5": 0,
        "NBH_6": 43,
        "downstreamCell": 43,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -6.80271503408824,
        "y0": -1.69644373191893
    },
    {
        "Id": 43,
        "areakm": 0.68625,
        "zOutlet": 244.225,
        "subBasin": 2,
        "NBH_1": 46,
        "NBH_2": 44,
        "NBH_3": 42,
        "NBH_4": 0,
        "NBH_5": 0,
        "NBH_6": 45,
        "downstreamCell": 45,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -5.72814510226471,
        "y0": -1.69644373191893
    },
    {
        "Id": 44,
        "areakm": 0.99,
        "zOutlet": 246.9,
        "subBasin": 1,
        "NBH_1": 24,
        "NBH_2": 23,
        "NBH_3": 0,
        "NBH_4": 42,
        "NBH_5": 43,
        "NBH_6": 46,
        "downstreamCell": 24,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -6.26543006817647,
        "y0": -0.765838872816414
    },
    {
        "Id": 45,
        "areakm": 0.75375,
        "zOutlet": 236.9,
        "subBasin": 2,
        "NBH_1": 48,
        "NBH_2": 46,
        "NBH_3": 43,
        "NBH_4": 0,
        "NBH_5": 0,
        "NBH_6": 47,
        "downstreamCell": 48,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -4.65357517044118,
        "y0": -1.69644373191893
    },
    {
        "Id": 46,
        "areakm": 0.99,
        "zOutlet": 237.8,
        "subBasin": 2,
        "NBH_1": 26,
        "NBH_2": 24,
        "NBH_3": 44,
        "NBH_4": 43,
        "NBH_5": 45,
        "NBH_6": 48,
        "downstreamCell": 48,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -5.19086013635294,
        "y0": -0.765838872816414
    },
    {
        "Id": 47,
        "areakm": 1.035,
        "zOutlet": 235.400735931288,
        "subBasin": 2,
        "NBH_1": 50,
        "NBH_2": 48,
        "NBH_3": 45,
        "NBH_4": 0,
        "NBH_5": 0,
        "NBH_6": 49,
        "downstreamCell": 49,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -3.57900523861765,
        "y0": -1.69644373191893
    },
    {
        "Id": 48,
        "areakm": 1.04625,
        "zOutlet": 235.01966991411,
        "subBasin": 2,
        "NBH_1": 28,
        "NBH_2": 26,
        "NBH_3": 46,
        "NBH_4": 45,
        "NBH_5": 47,
        "NBH_6": 50,
        "downstreamCell": 50,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -4.11629020452942,
        "y0": -0.765838872816414
    },
    {
        "Id": 49,
        "areakm": 0.99,
        "zOutlet": 228.7,
        "subBasin": 2,
        "NBH_1": 52,
        "NBH_2": 50,
        "NBH_3": 47,
        "NBH_4": 0,
        "NBH_5": 64,
        "NBH_6": 51,
        "downstreamCell": 64,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -2.50443530679401,
        "y0": -1.69644373191893
    },
    {
        "Id": 50,
        "areakm": 0.99,
        "zOutlet": 229.5,
        "subBasin": 2,
        "NBH_1": 30,
        "NBH_2": 28,
        "NBH_3": 48,
        "NBH_4": 47,
        "NBH_5": 49,
        "NBH_6": 52,
        "downstreamCell": 52,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -3.04172027270589,
        "y0": -0.765838872816414
    },
    {
        "Id": 51,
        "areakm": 0.984375,
        "zOutlet": 231.7,
        "subBasin": 2,
        "NBH_1": 54,
        "NBH_2": 52,
        "NBH_3": 49,
        "NBH_4": 64,
        "NBH_5": 66,
        "NBH_6": 53,
        "downstreamCell": 54,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -1.42986537497048,
        "y0": -1.69644373191893
    },
    {
        "Id": 52,
        "areakm": 0.99,
        "zOutlet": 225.9,
        "subBasin": 2,
        "NBH_1": 32,
        "NBH_2": 30,
        "NBH_3": 50,
        "NBH_4": 49,
        "NBH_5": 51,
        "NBH_6": 54,
        "downstreamCell": 54,
        "mainCLC1": 1,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -1.96715034088225,
        "y0": -0.765838872816414
    },
    {
        "Id": 53,
        "areakm": 1.035,
        "zOutlet": 229.8,
        "subBasin": 2,
        "NBH_1": 56,
        "NBH_2": 54,
        "NBH_3": 51,
        "NBH_4": 66,
        "NBH_5": 68,
        "NBH_6": 55,
        "downstreamCell": 55,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -0.355295443146955,
        "y0": -1.69644373191893
    },
    {
        "Id": 54,
        "areakm": 1.04625,
        "zOutlet": 222.718933982822,
        "subBasin": 2,
        "NBH_1": 34,
        "NBH_2": 32,
        "NBH_3": 52,
        "NBH_4": 51,
        "NBH_5": 53,
        "NBH_6": 56,
        "downstreamCell": 56,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -0.892580409058719,
        "y0": -0.765838872816414
    },
    {
        "Id": 55,
        "areakm": 0.99,
        "zOutlet": 220.102207793864,
        "subBasin": 2,
        "NBH_1": 58,
        "NBH_2": 56,
        "NBH_3": 53,
        "NBH_4": 68,
        "NBH_5": 70,
        "NBH_6": 57,
        "downstreamCell": 70,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 0.719274488676572,
        "y0": -1.69644373191893
    },
    {
        "Id": 56,
        "areakm": 0.99,
        "zOutlet": 221.36966991411,
        "subBasin": 2,
        "NBH_1": 36,
        "NBH_2": 34,
        "NBH_3": 54,
        "NBH_4": 53,
        "NBH_5": 55,
        "NBH_6": 58,
        "downstreamCell": 55,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 0.181989522764809,
        "y0": -0.765838872816414
    },
    {
        "Id": 57,
        "areakm": 0.99,
        "zOutlet": 219.815075759508,
        "subBasin": 3,
        "NBH_1": 60,
        "NBH_2": 58,
        "NBH_3": 55,
        "NBH_4": 70,
        "NBH_5": 72,
        "NBH_6": 59,
        "downstreamCell": 72,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 1.7938444205001,
        "y0": -1.69644373191893
    },
    {
        "Id": 58,
        "areakm": 0.97875,
        "zOutlet": 223.1,
        "subBasin": 2,
        "NBH_1": 38,
        "NBH_2": 36,
        "NBH_3": 56,
        "NBH_4": 55,
        "NBH_5": 57,
        "NBH_6": 60,
        "downstreamCell": 55,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 1.25655945458834,
        "y0": -0.765838872816414
    },
    {
        "Id": 59,
        "areakm": 1.035,
        "zOutlet": 222.8,
        "subBasin": 3,
        "NBH_1": 62,
        "NBH_2": 60,
        "NBH_3": 57,
        "NBH_4": 72,
        "NBH_5": 74,
        "NBH_6": 61,
        "downstreamCell": 72,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 2.86841435232363,
        "y0": -1.69644373191893
    },
    {
        "Id": 60,
        "areakm": 1.04625,
        "zOutlet": 231.6,
        "subBasin": 3,
        "NBH_1": 40,
        "NBH_2": 38,
        "NBH_3": 58,
        "NBH_4": 57,
        "NBH_5": 59,
        "NBH_6": 62,
        "downstreamCell": 57,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 2.33112938641186,
        "y0": -0.765838872816414
    },
    {
        "Id": 61,
        "areakm": 0.770625,
        "zOutlet": 231.3,
        "subBasin": 3,
        "NBH_1": 0,
        "NBH_2": 62,
        "NBH_3": 59,
        "NBH_4": 74,
        "NBH_5": 0,
        "NBH_6": 0,
        "downstreamCell": 59,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 3.94298428414715,
        "y0": -1.69644373191893
    },
    {
        "Id": 62,
        "areakm": 0.984375,
        "zOutlet": 230.3,
        "subBasin": 3,
        "NBH_1": 0,
        "NBH_2": 40,
        "NBH_3": 60,
        "NBH_4": 59,
        "NBH_5": 61,
        "NBH_6": 0,
        "downstreamCell": 59,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 3.40569931823539,
        "y0": -0.765838872816414
    },
    {
        "Id": 63,
        "areakm": 0.675,
        "zOutlet": 228.4,
        "subBasin": 2,
        "NBH_1": 66,
        "NBH_2": 64,
        "NBH_3": 0,
        "NBH_4": 0,
        "NBH_5": 0,
        "NBH_6": 65,
        "downstreamCell": 66,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -1.42986537497048,
        "y0": -3.55765345012303
    },
    {
        "Id": 64,
        "areakm": 0.855,
        "zOutlet": 225.5,
        "subBasin": 2,
        "NBH_1": 51,
        "NBH_2": 49,
        "NBH_3": 0,
        "NBH_4": 0,
        "NBH_5": 63,
        "NBH_6": 66,
        "downstreamCell": 66,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -1.96715034088225,
        "y0": -2.62704859102145
    },
    {
        "Id": 65,
        "areakm": 1.035,
        "zOutlet": 225.5,
        "subBasin": 2,
        "NBH_1": 68,
        "NBH_2": 66,
        "NBH_3": 63,
        "NBH_4": 0,
        "NBH_5": 77,
        "NBH_6": 67,
        "downstreamCell": 68,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -0.355295443146955,
        "y0": -3.55765345012303
    },
    {
        "Id": 66,
        "areakm": 1.029375,
        "zOutlet": 224.281801948466,
        "subBasin": 2,
        "NBH_1": 53,
        "NBH_2": 51,
        "NBH_3": 64,
        "NBH_4": 63,
        "NBH_5": 65,
        "NBH_6": 68,
        "downstreamCell": 68,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -0.892580409058719,
        "y0": -2.62704859102145
    },
    {
        "Id": 67,
        "areakm": 0.99,
        "zOutlet": 223,
        "subBasin": 3,
        "NBH_1": 70,
        "NBH_2": 68,
        "NBH_3": 65,
        "NBH_4": 77,
        "NBH_5": 79,
        "NBH_6": 69,
        "downstreamCell": 69,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 0.719274488676572,
        "y0": -3.55765345012303
    },
    {
        "Id": 68,
        "areakm": 0.97875,
        "zOutlet": 222,
        "subBasin": 2,
        "NBH_1": 55,
        "NBH_2": 53,
        "NBH_3": 66,
        "NBH_4": 65,
        "NBH_5": 67,
        "NBH_6": 70,
        "downstreamCell": 55,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 0.181989522764809,
        "y0": -2.62704859102145
    },
    {
        "Id": 69,
        "areakm": 0.97875,
        "zOutlet": 216.937867965644,
        "subBasin": 3,
        "NBH_1": 72,
        "NBH_2": 70,
        "NBH_3": 67,
        "NBH_4": 79,
        "NBH_5": 81,
        "NBH_6": 71,
        "downstreamCell": 81,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 1.7938444205001,
        "y0": -3.55765345012303
    },
    {
        "Id": 70,
        "areakm": 0.97875,
        "zOutlet": 218.684745673618,
        "subBasin": 3,
        "NBH_1": 57,
        "NBH_2": 55,
        "NBH_3": 68,
        "NBH_4": 67,
        "NBH_5": 69,
        "NBH_6": 72,
        "downstreamCell": 69,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 1.25655945458834,
        "y0": -2.62704859102145
    },
    {
        "Id": 71,
        "areakm": 1.035,
        "zOutlet": 216.107537879754,
        "subBasin": 3,
        "NBH_1": 74,
        "NBH_2": 72,
        "NBH_3": 69,
        "NBH_4": 81,
        "NBH_5": 83,
        "NBH_6": 73,
        "downstreamCell": 81,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 2.86841435232363,
        "y0": -3.55765345012303
    },
    {
        "Id": 72,
        "areakm": 1.029375,
        "zOutlet": 218.185481604906,
        "subBasin": 3,
        "NBH_1": 59,
        "NBH_2": 57,
        "NBH_3": 70,
        "NBH_4": 69,
        "NBH_5": 71,
        "NBH_6": 74,
        "downstreamCell": 71,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 2.33112938641186,
        "y0": -2.62704859102145
    },
    {
        "Id": 73,
        "areakm": 0.77625,
        "zOutlet": 226.8,
        "subBasin": 3,
        "NBH_1": 0,
        "NBH_2": 74,
        "NBH_3": 71,
        "NBH_4": 83,
        "NBH_5": 85,
        "NBH_6": 0,
        "downstreamCell": 71,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 3.94298428414715,
        "y0": -3.55765345012303
    },
    {
        "Id": 74,
        "areakm": 0.916875,
        "zOutlet": 225.7,
        "subBasin": 3,
        "NBH_1": 61,
        "NBH_2": 59,
        "NBH_3": 72,
        "NBH_4": 71,
        "NBH_5": 73,
        "NBH_6": 0,
        "downstreamCell": 71,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 3.40569931823539,
        "y0": -2.62704859102145
    },
    {
        "Id": 75,
        "areakm": 0.5175,
        "zOutlet": 228.7,
        "subBasin": 3,
        "NBH_1": 77,
        "NBH_2": 0,
        "NBH_3": 0,
        "NBH_4": 0,
        "NBH_5": 0,
        "NBH_6": 76,
        "downstreamCell": 76,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": -0.355295443146955,
        "y0": -5.41886316832714
    },
    {
        "Id": 76,
        "areakm": 0.99,
        "zOutlet": 220.512867965644,
        "subBasin": 3,
        "NBH_1": 79,
        "NBH_2": 77,
        "NBH_3": 75,
        "NBH_4": 0,
        "NBH_5": 86,
        "NBH_6": 78,
        "downstreamCell": 78,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 0.719274488676572,
        "y0": -5.41886316832714
    },
    {
        "Id": 77,
        "areakm": 0.97875,
        "zOutlet": 222.2,
        "subBasin": 3,
        "NBH_1": 67,
        "NBH_2": 65,
        "NBH_3": 0,
        "NBH_4": 75,
        "NBH_5": 76,
        "NBH_6": 79,
        "downstreamCell": 79,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 0.181989522764809,
        "y0": -4.48825830922555
    },
    {
        "Id": 78,
        "areakm": 0.984375,
        "zOutlet": 217.15,
        "subBasin": 3,
        "NBH_1": 81,
        "NBH_2": 79,
        "NBH_3": 76,
        "NBH_4": 86,
        "NBH_5": 87,
        "NBH_6": 80,
        "downstreamCell": 80,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 1.7938444205001,
        "y0": -5.41886316832714
    },
    {
        "Id": 79,
        "areakm": 0.97875,
        "zOutlet": 219.532537879754,
        "subBasin": 3,
        "NBH_1": 69,
        "NBH_2": 67,
        "NBH_3": 77,
        "NBH_4": 76,
        "NBH_5": 78,
        "NBH_6": 81,
        "downstreamCell": 81,
        "mainCLC1": 1,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 1.25655945458834,
        "y0": -4.48825830922555
    },
    {
        "Id": 80,
        "areakm": 1.035,
        "zOutlet": 212.43933982822,
        "subBasin": 3,
        "NBH_1": 83,
        "NBH_2": 81,
        "NBH_3": 78,
        "NBH_4": 87,
        "NBH_5": 88,
        "NBH_6": 82,
        "downstreamCell": 82,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 2.86841435232363,
        "y0": -5.41886316832714
    },
    {
        "Id": 81,
        "areakm": 1.029375,
        "zOutlet": 213.781801948466,
        "subBasin": 3,
        "NBH_1": 71,
        "NBH_2": 69,
        "NBH_3": 79,
        "NBH_4": 78,
        "NBH_5": 80,
        "NBH_6": 83,
        "downstreamCell": 80,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 2.33112938641186,
        "y0": -4.48825830922555
    },
    {
        "Id": 82,
        "areakm": 0.99,
        "zOutlet": 211.671141776686,
        "subBasin": 3,
        "NBH_1": 85,
        "NBH_2": 83,
        "NBH_3": 80,
        "NBH_4": 88,
        "NBH_5": 89,
        "NBH_6": 84,
        "downstreamCell": 89,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 3.94298428414715,
        "y0": -5.41886316832714
    },
    {
        "Id": 83,
        "areakm": 0.97875,
        "zOutlet": 219.4,
        "subBasin": 3,
        "NBH_1": 73,
        "NBH_2": 71,
        "NBH_3": 81,
        "NBH_4": 80,
        "NBH_5": 82,
        "NBH_6": 85,
        "downstreamCell": 82,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 3.40569931823539,
        "y0": -4.48825830922555
    },
    {
        "Id": 84,
        "areakm": 0.765,
        "zOutlet": 226.7,
        "subBasin": 3,
        "NBH_1": 0,
        "NBH_2": 85,
        "NBH_3": 82,
        "NBH_4": 89,
        "NBH_5": 0,
        "NBH_6": 0,
        "downstreamCell": 89,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 5.01755421597068,
        "y0": -5.41886316832714
    },
    {
        "Id": 85,
        "areakm": 0.6525,
        "zOutlet": 229.2,
        "subBasin": 3,
        "NBH_1": 0,
        "NBH_2": 73,
        "NBH_3": 83,
        "NBH_4": 82,
        "NBH_5": 84,
        "NBH_6": 0,
        "downstreamCell": 82,
        "mainCLC1": 3,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 4.48026925005892,
        "y0": -4.48825830922555
    },
    {
        "Id": 86,
        "areakm": 0.590625,
        "zOutlet": 221.2,
        "subBasin": 3,
        "NBH_1": 78,
        "NBH_2": 76,
        "NBH_3": 0,
        "NBH_4": 0,
        "NBH_5": 0,
        "NBH_6": 87,
        "downstreamCell": 78,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 1.25655945458834,
        "y0": -6.34946802742965
    },
    {
        "Id": 87,
        "areakm": 0.736875,
        "zOutlet": 219.1,
        "subBasin": 3,
        "NBH_1": 80,
        "NBH_2": 78,
        "NBH_3": 86,
        "NBH_4": 0,
        "NBH_5": 0,
        "NBH_6": 88,
        "downstreamCell": 80,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 2.33112938641186,
        "y0": -6.34946802742965
    },
    {
        "Id": 88,
        "areakm": 0.905625,
        "zOutlet": 214.4,
        "subBasin": 3,
        "NBH_1": 82,
        "NBH_2": 80,
        "NBH_3": 87,
        "NBH_4": 0,
        "NBH_5": 0,
        "NBH_6": 89,
        "downstreamCell": 89,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 3.40569931823539,
        "y0": -6.34946802742965
    },
    {
        "Id": 89,
        "areakm": 0.97875,
        "zOutlet": 210.40367965644,
        "subBasin": 3,
        "NBH_1": 84,
        "NBH_2": 82,
        "NBH_3": 88,
        "NBH_4": 0,
        "NBH_5": 0,
        "NBH_6": 0,
        "downstreamCell": 0,
        "mainCLC1": 2,
        "player": 0,
        "practice": 0,
        "ifHedge": 0,
        "contamination": 0,
        "yield": 0,
        "x0": 4.48026925005892,
        "y0": -6.34946802742965
    }
]
/* const data = [
    {
        "Id": 1,
        "downstreamCell": 9,
        "mainCLC1": 3,
        "x0": -170.815888980571,
        "y0": -322.735753528478
    },
    {
        "Id": 2,
        "downstreamCell": 11,
        "mainCLC1": 3,
        "x0": -169.499814967619,
        "y0": -322.735753528478
    },
    {
        "Id": 3,
        "downstreamCell": 13,
        "mainCLC1": 2,
        "x0": -168.183740954666,
        "y0": -322.735753528478
    },
    {
        "Id": 4,
        "downstreamCell": 13,
        "mainCLC1": 3,
        "x0": -166.867666941714,
        "y0": -322.735753528478
    },
    {
        "Id": 5,
        "downstreamCell": 6,
        "mainCLC1": 2,
        "x0": -172.131962993524,
        "y0": -325.015260585432
    },
    {
        "Id": 6,
        "downstreamCell": 8,
        "mainCLC1": 2,
        "x0": -170.815888980571,
        "y0": -325.015260585432
    },
    {
        "Id": 7,
        "downstreamCell": 9,
        "mainCLC1": 3,
        "x0": -171.473925987047,
        "y0": -323.875507056954
    },
    {
        "Id": 8,
        "downstreamCell": 10,
        "mainCLC1": 2,
        "x0": -169.499814967619,
        "y0": -325.015260585432
    },
    {
        "Id": 9,
        "downstreamCell": 11,
        "mainCLC1": 2,
        "x0": -170.157851974095,
        "y0": -323.875507056954
    },
    {
        "Id": 10,
        "downstreamCell": 27,
        "mainCLC1": 2,
        "x0": -168.183740954666,
        "y0": -325.015260585432
    },
    {
        "Id": 11,
        "downstreamCell": 10,
        "mainCLC1": 2,
        "x0": -168.841777961142,
        "y0": -323.875507056954
    },
    {
        "Id": 12,
        "downstreamCell": 29,
        "mainCLC1": 2,
        "x0": -166.867666941714,
        "y0": -325.015260585432
    },
    {
        "Id": 13,
        "downstreamCell": 12,
        "mainCLC1": 2,
        "x0": -167.52570394819,
        "y0": -323.875507056954
    },
    {
        "Id": 14,
        "downstreamCell": 29,
        "mainCLC1": 3,
        "x0": -165.551592928761,
        "y0": -325.015260585432
    },
    {
        "Id": 15,
        "downstreamCell": 12,
        "mainCLC1": 3,
        "x0": -166.209629935238,
        "y0": -323.875507056954
    },
    {
        "Id": 16,
        "downstreamCell": 33,
        "mainCLC1": 3,
        "x0": -164.235518915809,
        "y0": -325.015260585432
    },
    {
        "Id": 17,
        "downstreamCell": 33,
        "mainCLC1": 3,
        "x0": -162.919444902856,
        "y0": -325.015260585432
    },
    {
        "Id": 18,
        "downstreamCell": 37,
        "mainCLC1": 3,
        "x0": -161.603370889904,
        "y0": -325.015260585432
    },
    {
        "Id": 19,
        "downstreamCell": 18,
        "mainCLC1": 2,
        "x0": -162.26140789638,
        "y0": -323.875507056954
    },
    {
        "Id": 20,
        "downstreamCell": 42,
        "mainCLC1": 3,
        "x0": -170.815888980571,
        "y0": -327.294767642387
    },
    {
        "Id": 21,
        "downstreamCell": 6,
        "mainCLC1": 3,
        "x0": -171.473925987047,
        "y0": -326.15501411391
    },
    {
        "Id": 22,
        "downstreamCell": 24,
        "mainCLC1": 3,
        "x0": -169.499814967619,
        "y0": -327.294767642387
    },
    {
        "Id": 23,
        "downstreamCell": 25,
        "mainCLC1": 3,
        "x0": -170.157851974095,
        "y0": -326.15501411391
    },
    {
        "Id": 24,
        "downstreamCell": 26,
        "mainCLC1": 2,
        "x0": -168.183740954666,
        "y0": -327.294767642387
    },
    {
        "Id": 25,
        "downstreamCell": 27,
        "mainCLC1": 2,
        "x0": -168.841777961142,
        "y0": -326.15501411391
    },
    {
        "Id": 26,
        "downstreamCell": 28,
        "mainCLC1": 2,
        "x0": -166.867666941714,
        "y0": -327.294767642387
    },
    {
        "Id": 27,
        "downstreamCell": 29,
        "mainCLC1": 2,
        "x0": -167.52570394819,
        "y0": -326.15501411391
    },
    {
        "Id": 28,
        "downstreamCell": 50,
        "mainCLC1": 2,
        "x0": -165.551592928761,
        "y0": -327.294767642387
    },
    {
        "Id": 29,
        "downstreamCell": 28,
        "mainCLC1": 2,
        "x0": -166.209629935238,
        "y0": -326.15501411391
    },
    {
        "Id": 30,
        "downstreamCell": 52,
        "mainCLC1": 2,
        "x0": -164.235518915809,
        "y0": -327.294767642387
    },
    {
        "Id": 31,
        "downstreamCell": 28,
        "mainCLC1": 3,
        "x0": -164.893555922285,
        "y0": -326.15501411391
    },
    {
        "Id": 32,
        "downstreamCell": 52,
        "mainCLC1": 2,
        "x0": -162.919444902856,
        "y0": -327.294767642387
    },
    {
        "Id": 33,
        "downstreamCell": 30,
        "mainCLC1": 2,
        "x0": -163.577481909333,
        "y0": -326.15501411391
    },
    {
        "Id": 34,
        "downstreamCell": 56,
        "mainCLC1": 2,
        "x0": -161.603370889904,
        "y0": -327.294767642387
    },
    {
        "Id": 35,
        "downstreamCell": 32,
        "mainCLC1": 3,
        "x0": -162.26140789638,
        "y0": -326.15501411391
    },
    {
        "Id": 36,
        "downstreamCell": 58,
        "mainCLC1": 2,
        "x0": -160.287296876951,
        "y0": -327.294767642387
    },
    {
        "Id": 37,
        "downstreamCell": 36,
        "mainCLC1": 2,
        "x0": -160.945333883428,
        "y0": -326.15501411391
    },
    {
        "Id": 38,
        "downstreamCell": 60,
        "mainCLC1": 2,
        "x0": -158.971222863999,
        "y0": -327.294767642387
    },
    {
        "Id": 39,
        "downstreamCell": 38,
        "mainCLC1": 2,
        "x0": -159.629259870475,
        "y0": -326.15501411391
    },
    {
        "Id": 40,
        "downstreamCell": 41,
        "mainCLC1": 2,
        "x0": -170.815888980571,
        "y0": -329.574274699342
    },
    {
        "Id": 41,
        "downstreamCell": 44,
        "mainCLC1": 3,
        "x0": -169.499814967619,
        "y0": -329.574274699342
    },
    {
        "Id": 42,
        "downstreamCell": 44,
        "mainCLC1": 2,
        "x0": -170.157851974095,
        "y0": -328.434521170864
    },
    {
        "Id": 43,
        "downstreamCell": 46,
        "mainCLC1": 3,
        "x0": -168.183740954666,
        "y0": -329.574274699342
    },
    {
        "Id": 44,
        "downstreamCell": 24,
        "mainCLC1": 2,
        "x0": -168.841777961142,
        "y0": -328.434521170864
    },
    {
        "Id": 45,
        "downstreamCell": 47,
        "mainCLC1": 3,
        "x0": -166.867666941714,
        "y0": -329.574274699342
    },
    {
        "Id": 46,
        "downstreamCell": 26,
        "mainCLC1": 3,
        "x0": -167.52570394819,
        "y0": -328.434521170864
    },
    {
        "Id": 47,
        "downstreamCell": 50,
        "mainCLC1": 2,
        "x0": -165.551592928761,
        "y0": -329.574274699342
    },
    {
        "Id": 48,
        "downstreamCell": 28,
        "mainCLC1": 3,
        "x0": -166.209629935238,
        "y0": -328.434521170864
    },
    {
        "Id": 49,
        "downstreamCell": 51,
        "mainCLC1": 2,
        "x0": -164.235518915809,
        "y0": -329.574274699342
    },
    {
        "Id": 50,
        "downstreamCell": 52,
        "mainCLC1": 2,
        "x0": -164.893555922285,
        "y0": -328.434521170864
    },
    {
        "Id": 51,
        "downstreamCell": 73,
        "mainCLC1": 2,
        "x0": -162.919444902856,
        "y0": -329.574274699342
    },
    {
        "Id": 52,
        "downstreamCell": 51,
        "mainCLC1": 2,
        "x0": -163.577481909333,
        "y0": -328.434521170864
    },
    {
        "Id": 53,
        "downstreamCell": 75,
        "mainCLC1": 2,
        "x0": -161.603370889904,
        "y0": -329.574274699342
    },
    {
        "Id": 54,
        "downstreamCell": 53,
        "mainCLC1": 2,
        "x0": -162.26140789638,
        "y0": -328.434521170864
    },
    {
        "Id": 55,
        "downstreamCell": 77,
        "mainCLC1": 2,
        "x0": -160.287296876951,
        "y0": -329.574274699342
    },
    {
        "Id": 56,
        "downstreamCell": 55,
        "mainCLC1": 2,
        "x0": -160.945333883428,
        "y0": -328.434521170864
    },
    {
        "Id": 57,
        "downstreamCell": 79,
        "mainCLC1": 2,
        "x0": -158.971222863999,
        "y0": -329.574274699342
    },
    {
        "Id": 58,
        "downstreamCell": 57,
        "mainCLC1": 2,
        "x0": -159.629259870475,
        "y0": -328.434521170864
    },
    {
        "Id": 59,
        "downstreamCell": 80,
        "mainCLC1": 2,
        "x0": -157.655148851046,
        "y0": -329.574274699342
    },
    {
        "Id": 60,
        "downstreamCell": 59,
        "mainCLC1": 2,
        "x0": -158.313185857523,
        "y0": -328.434521170864
    },
    {
        "Id": 61,
        "downstreamCell": 81,
        "mainCLC1": 2,
        "x0": -156.339074838094,
        "y0": -329.574274699342
    },
    {
        "Id": 62,
        "downstreamCell": 64,
        "mainCLC1": 3,
        "x0": -168.183740954666,
        "y0": -331.853781756297
    },
    {
        "Id": 63,
        "downstreamCell": 43,
        "mainCLC1": 3,
        "x0": -168.841777961142,
        "y0": -330.714028227819
    },
    {
        "Id": 64,
        "downstreamCell": 85,
        "mainCLC1": 2,
        "x0": -166.867666941714,
        "y0": -331.853781756297
    },
    {
        "Id": 65,
        "downstreamCell": 64,
        "mainCLC1": 3,
        "x0": -167.52570394819,
        "y0": -330.714028227819
    },
    {
        "Id": 66,
        "downstreamCell": 87,
        "mainCLC1": 2,
        "x0": -165.551592928761,
        "y0": -331.853781756297
    },
    {
        "Id": 67,
        "downstreamCell": 47,
        "mainCLC1": 3,
        "x0": -166.209629935238,
        "y0": -330.714028227819
    },
    {
        "Id": 68,
        "downstreamCell": 89,
        "mainCLC1": 2,
        "x0": -164.235518915809,
        "y0": -331.853781756297
    },
    {
        "Id": 69,
        "downstreamCell": 49,
        "mainCLC1": 3,
        "x0": -164.893555922285,
        "y0": -330.714028227819
    },
    {
        "Id": 70,
        "downstreamCell": 72,
        "mainCLC1": 2,
        "x0": -162.919444902856,
        "y0": -331.853781756297
    },
    {
        "Id": 71,
        "downstreamCell": 73,
        "mainCLC1": 3,
        "x0": -163.577481909333,
        "y0": -330.714028227819
    },
    {
        "Id": 72,
        "downstreamCell": 74,
        "mainCLC1": 2,
        "x0": -161.603370889904,
        "y0": -331.853781756297
    },
    {
        "Id": 73,
        "downstreamCell": 75,
        "mainCLC1": 2,
        "x0": -162.26140789638,
        "y0": -330.714028227819
    },
    {
        "Id": 74,
        "downstreamCell": 76,
        "mainCLC1": 2,
        "x0": -160.287296876951,
        "y0": -331.853781756297
    },
    {
        "Id": 75,
        "downstreamCell": 74,
        "mainCLC1": 2,
        "x0": -160.945333883428,
        "y0": -330.714028227819
    },
    {
        "Id": 76,
        "downstreamCell": 78,
        "mainCLC1": 2,
        "x0": -158.971222863999,
        "y0": -331.853781756297
    },
    {
        "Id": 77,
        "downstreamCell": 79,
        "mainCLC1": 2,
        "x0": -159.629259870475,
        "y0": -330.714028227819
    },
    {
        "Id": 78,
        "downstreamCell": 80,
        "mainCLC1": 2,
        "x0": -157.655148851046,
        "y0": -331.853781756297
    },
    {
        "Id": 79,
        "downstreamCell": 80,
        "mainCLC1": 2,
        "x0": -158.313185857523,
        "y0": -330.714028227819
    },
    {
        "Id": 80,
        "downstreamCell": 81,
        "mainCLC1": 2,
        "x0": -156.99711184457,
        "y0": -330.714028227819
    },
    {
        "Id": 81,
        "downstreamCell": 0,
        "mainCLC1": 2,
        "x0": -155.681037831618,
        "y0": -330.714028227819
    },
    {
        "Id": 82,
        "downstreamCell": 85,
        "mainCLC1": 3,
        "x0": -166.867666941714,
        "y0": -334.133288813251
    },
    {
        "Id": 83,
        "downstreamCell": 85,
        "mainCLC1": 3,
        "x0": -167.52570394819,
        "y0": -332.993535284773
    },
    {
        "Id": 84,
        "downstreamCell": 87,
        "mainCLC1": 3,
        "x0": -165.551592928761,
        "y0": -334.133288813251
    },
    {
        "Id": 85,
        "downstreamCell": 87,
        "mainCLC1": 2,
        "x0": -166.209629935238,
        "y0": -332.993535284773
    },
    {
        "Id": 86,
        "downstreamCell": 89,
        "mainCLC1": 3,
        "x0": -164.235518915809,
        "y0": -334.133288813251
    },
    {
        "Id": 87,
        "downstreamCell": 89,
        "mainCLC1": 2,
        "x0": -164.893555922285,
        "y0": -332.993535284773
    },
    {
        "Id": 88,
        "downstreamCell": 90,
        "mainCLC1": 3,
        "x0": -162.919444902856,
        "y0": -334.133288813251
    },
    {
        "Id": 89,
        "downstreamCell": 90,
        "mainCLC1": 2,
        "x0": -163.577481909333,
        "y0": -332.993535284773
    },
    {
        "Id": 90,
        "downstreamCell": 72,
        "mainCLC1": 2,
        "x0": -162.26140789638,
        "y0": -332.993535284773
    },
    {
        "Id": 91,
        "downstreamCell": 74,
        "mainCLC1": 2,
        "x0": -160.945333883428,
        "y0": -332.993535284773
    },
    {
        "Id": 92,
        "downstreamCell": 74,
        "mainCLC1": 2,
        "x0": -159.629259870475,
        "y0": -332.993535284773
    },
    {
        "Id": 93,
        "downstreamCell": 84,
        "mainCLC1": 3,
        "x0": -166.209629935238,
        "y0": -335.273042341729
    },
    {
        "Id": 94,
        "downstreamCell": 95,
        "mainCLC1": 3,
        "x0": -164.893555922285,
        "y0": -335.273042341729
    },
    {
        "Id": 95,
        "downstreamCell": 88,
        "mainCLC1": 3,
        "x0": -163.577481909333,
        "y0": -335.273042341729
    }
] */
