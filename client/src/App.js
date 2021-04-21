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
        modifie l'activité de la case sélectionnée par celle mise en paramètre
        met à jour le state de la carte des hexagons et modifie la couleur de la case en conséquence
        selectedTile vaut null
    */
    changeTileActivity(value) {
        const hexagons = this.state.moreHexas;
        hexagons[this.state.selectedTile].activity = parseInt(value)
        // Save our new hexagon data to the state, which will cause a re-render
        this.setState({ moreHexas: hexagons })
        this.setState({ selectedTile: null })
    }
    render() {
        return (<>
            <div id="menu">
                <p>MENU</p>
                {/* n'affiche <ActivitySwapper/> que si une tuile est sélectionnée */}
                {this.state.selectedTile === null ? "" :
                    <ActivitySwapper changeTileActivity={this.changeTileActivity}
                        selectedTileActivity={this.state.selectedTileActivity} selectedTile={this.state.selectedTile} />}
            </div>
            <Bassin handleClick={this.handleClickTile} map={this.state} />
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
        const act = this.props.selectedTileActivity === "1" ? "2" : "1"
        this.state = { value: act };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    /* 
        évènement enclanché lors du changement de proposition dans le formulaire
        la valeur du formulaire est changée en accord
    */
    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    /* 
        évènement enclanché lors de l'envoie du formulaire
        appel de la fonction changeTileActivity du parent avec en paramètre la nouvelle valeur de l'activité
    */
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.value != null) {
            this.props.changeTileActivity(this.state.value)
        }
    }

    render() {
        console.log(this.props)
        return (
            < form onSubmit={this.handleSubmit} >
                <label>
                    <p> Choisissez votre nouvelle activité de la tuile {this.props.selectedTile}</p>
                    <select value={this.state.clickedTile} onChange={this.handleChange}>
                        {/* ne propose pas l'activité déjà exercée sur la tuile */}
                        {this.props.selectedTileActivity === "1" ? "" : <option value="1">vigne</option>}
                        {this.props.selectedTileActivity === "2" ? "" : <option value="2">blé</option>}
                        {this.props.selectedTileActivity === "3" ? "" : <option value="3">bovins</option>}
                    </select>
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
    /*onClick(e, h, i) {
        this.props.handleClick(h)
    }
    handleClick(e, h) {
        this.props.handleClickTile(e, h)
    }*/
    render() {

        return (

            <HexGrid width={400} height={400} viewBox="-50 -50 100 100" >
                <Layout size={this.state.hexagonSize} flat={false} spacing={1} origin={{ x: 0, y: 0 }} >
                    {/* boucle créant les hexagones */}
                    {this.state.moreHexas.map((hex, i) =>
                        <Hexagon
                            activity={hex.activity.toString()}
                            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
                            /* appel la fonction parent handleClick avec en paramètre l'hexagone */
                            onClick={(e, h, i) => this.props.handleClick(h)}
                            /* définie la classe de l'hexagone en fonction de son activité */
                            className={setActivityClass(hex.activity)} />
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
function setActivityClass(activity) {
    console.log(typeof activity)
    /* return activity == 1 ? "ville"
        : activity == 2 ? "agriculture"
            : activity == 3 ? "foret"
                : "probleme" */
    switch (activity) {
        case 1: return "ville";
        case 2: return "agriculture";
        case 3: return "foret";
    }
}

export default App;


const data = [
    {
        "Id": 1,
        "subBasin": 1,
        "downstreamCell": 7,
        "mainCLC1": 2,
        "x0": -3.57900523861765,
        "y0": 5.74839514089748
    },
    {
        "Id": 2,
        "subBasin": 1,
        "downstreamCell": 7,
        "mainCLC1": 2,
        "x0": -2.50443530679401,
        "y0": 5.74839514089748
    },
    {
        "Id": 3,
        "subBasin": 1,
        "downstreamCell": 14,
        "mainCLC1": 3,
        "x0": -4.65357517044118,
        "y0": 3.88718542269338
    },
    {
        "Id": 4,
        "subBasin": 1,
        "downstreamCell": 16,
        "mainCLC1": 2,
        "x0": -3.57900523861765,
        "y0": 3.88718542269338
    },
    {
        "Id": 5,
        "subBasin": 1,
        "downstreamCell": 4,
        "mainCLC1": 3,
        "x0": -4.11629020452942,
        "y0": 4.8177902817959
    },
    {
        "Id": 6,
        "subBasin": 1,
        "downstreamCell": 18,
        "mainCLC1": 2,
        "x0": -2.50443530679401,
        "y0": 3.88718542269338
    },
    {
        "Id": 7,
        "subBasin": 1,
        "downstreamCell": 6,
        "mainCLC1": 2,
        "x0": -3.04172027270589,
        "y0": 4.8177902817959
    },
    {
        "Id": 8,
        "subBasin": 1,
        "downstreamCell": 18,
        "mainCLC1": 2,
        "x0": -1.42986537497048,
        "y0": 3.88718542269338
    },
    {
        "Id": 9,
        "subBasin": 1,
        "downstreamCell": 8,
        "mainCLC1": 2,
        "x0": -1.96715034088225,
        "y0": 4.8177902817959
    },
    {
        "Id": 10,
        "subBasin": 1,
        "downstreamCell": 11,
        "mainCLC1": 2,
        "x0": -5.72814510226471,
        "y0": 2.02597570448928
    },
    {
        "Id": 11,
        "subBasin": 1,
        "downstreamCell": 13,
        "mainCLC1": 2,
        "x0": -4.65357517044118,
        "y0": 2.02597570448928
    },
    {
        "Id": 12,
        "subBasin": 1,
        "downstreamCell": 11,
        "mainCLC1": 3,
        "x0": -5.19086013635294,
        "y0": 2.95658056359179
    },
    {
        "Id": 13,
        "subBasin": 1,
        "downstreamCell": 15,
        "mainCLC1": 2,
        "x0": -3.57900523861765,
        "y0": 2.02597570448928
    },
    {
        "Id": 14,
        "subBasin": 1,
        "downstreamCell": 13,
        "mainCLC1": 3,
        "x0": -4.11629020452942,
        "y0": 2.95658056359179
    },
    {
        "Id": 15,
        "subBasin": 1,
        "downstreamCell": 17,
        "mainCLC1": 2,
        "x0": -2.50443530679401,
        "y0": 2.02597570448928
    },
    {
        "Id": 16,
        "subBasin": 1,
        "downstreamCell": 15,
        "mainCLC1": 3,
        "x0": -3.04172027270589,
        "y0": 2.95658056359179
    },
    {
        "Id": 17,
        "subBasin": 1,
        "downstreamCell": 35,
        "mainCLC1": 2,
        "x0": -1.42986537497048,
        "y0": 2.02597570448928
    },
    {
        "Id": 18,
        "subBasin": 1,
        "downstreamCell": 17,
        "mainCLC1": 2,
        "x0": -1.96715034088225,
        "y0": 2.95658056359179
    },
    {
        "Id": 19,
        "subBasin": 1,
        "downstreamCell": 35,
        "mainCLC1": 2,
        "x0": -0.355295443146955,
        "y0": 2.02597570448928
    },
    {
        "Id": 20,
        "subBasin": 1,
        "downstreamCell": 17,
        "mainCLC1": 2,
        "x0": -0.892580409058719,
        "y0": 2.95658056359179
    },
    {
        "Id": 21,
        "subBasin": 2,
        "downstreamCell": 39,
        "mainCLC1": 2,
        "x0": 0.719274488676572,
        "y0": 2.02597570448928
    },
    {
        "Id": 22,
        "subBasin": 2,
        "downstreamCell": 39,
        "mainCLC1": 3,
        "x0": 1.7938444205001,
        "y0": 2.02597570448928
    },
    {
        "Id": 23,
        "subBasin": 1,
        "downstreamCell": 24,
        "mainCLC1": 2,
        "x0": -6.80271503408824,
        "y0": 0.164765986285172
    },
    {
        "Id": 24,
        "subBasin": 1,
        "downstreamCell": 26,
        "mainCLC1": 2,
        "x0": -5.72814510226471,
        "y0": 0.164765986285172
    },
    {
        "Id": 25,
        "subBasin": 1,
        "downstreamCell": 27,
        "mainCLC1": 2,
        "x0": -6.26543006817647,
        "y0": 1.09537084538769
    },
    {
        "Id": 26,
        "subBasin": 1,
        "downstreamCell": 29,
        "mainCLC1": 2,
        "x0": -4.65357517044118,
        "y0": 0.164765986285172
    },
    {
        "Id": 27,
        "subBasin": 1,
        "downstreamCell": 29,
        "mainCLC1": 2,
        "x0": -5.19086013635294,
        "y0": 1.09537084538769
    },
    {
        "Id": 28,
        "subBasin": 2,
        "downstreamCell": 50,
        "mainCLC1": 3,
        "x0": -3.57900523861765,
        "y0": 0.164765986285172
    },
    {
        "Id": 29,
        "subBasin": 1,
        "downstreamCell": 31,
        "mainCLC1": 2,
        "x0": -4.11629020452942,
        "y0": 1.09537084538769
    },
    {
        "Id": 30,
        "subBasin": 2,
        "downstreamCell": 52,
        "mainCLC1": 3,
        "x0": -2.50443530679401,
        "y0": 0.164765986285172
    },
    {
        "Id": 31,
        "subBasin": 1,
        "downstreamCell": 33,
        "mainCLC1": 2,
        "x0": -3.04172027270589,
        "y0": 1.09537084538769
    },
    {
        "Id": 32,
        "subBasin": 2,
        "downstreamCell": 54,
        "mainCLC1": 2,
        "x0": -1.42986537497048,
        "y0": 0.164765986285172
    },
    {
        "Id": 33,
        "subBasin": 1,
        "downstreamCell": 35,
        "mainCLC1": 2,
        "x0": -1.96715034088225,
        "y0": 1.09537084538769
    },
    {
        "Id": 34,
        "subBasin": 2,
        "downstreamCell": 56,
        "mainCLC1": 1,
        "x0": -0.355295443146955,
        "y0": 0.164765986285172
    },
    {
        "Id": 35,
        "subBasin": 1,
        "downstreamCell": 34,
        "mainCLC1": 2,
        "x0": -0.892580409058719,
        "y0": 1.09537084538769
    },
    {
        "Id": 36,
        "subBasin": 2,
        "downstreamCell": 56,
        "mainCLC1": 2,
        "x0": 0.719274488676572,
        "y0": 0.164765986285172
    },
    {
        "Id": 37,
        "subBasin": 2,
        "downstreamCell": 34,
        "mainCLC1": 2,
        "x0": 0.181989522764809,
        "y0": 1.09537084538769
    },
    {
        "Id": 38,
        "subBasin": 2,
        "downstreamCell": 58,
        "mainCLC1": 2,
        "x0": 1.7938444205001,
        "y0": 0.164765986285172
    },
    {
        "Id": 39,
        "subBasin": 2,
        "downstreamCell": 36,
        "mainCLC1": 2,
        "x0": 1.25655945458834,
        "y0": 1.09537084538769
    },
    {
        "Id": 40,
        "subBasin": 2,
        "downstreamCell": 38,
        "mainCLC1": 3,
        "x0": 2.86841435232363,
        "y0": 0.164765986285172
    },
    {
        "Id": 41,
        "subBasin": 2,
        "downstreamCell": 38,
        "mainCLC1": 3,
        "x0": 2.33112938641186,
        "y0": 1.09537084538769
    },
    {
        "Id": 42,
        "subBasin": 2,
        "downstreamCell": 43,
        "mainCLC1": 3,
        "x0": -6.80271503408824,
        "y0": -1.69644373191893
    },
    {
        "Id": 43,
        "subBasin": 2,
        "downstreamCell": 45,
        "mainCLC1": 3,
        "x0": -5.72814510226471,
        "y0": -1.69644373191893
    },
    {
        "Id": 44,
        "subBasin": 1,
        "downstreamCell": 24,
        "mainCLC1": 2,
        "x0": -6.26543006817647,
        "y0": -0.765838872816414
    },
    {
        "Id": 45,
        "subBasin": 2,
        "downstreamCell": 48,
        "mainCLC1": 3,
        "x0": -4.65357517044118,
        "y0": -1.69644373191893
    },
    {
        "Id": 46,
        "subBasin": 2,
        "downstreamCell": 48,
        "mainCLC1": 2,
        "x0": -5.19086013635294,
        "y0": -0.765838872816414
    },
    {
        "Id": 47,
        "subBasin": 2,
        "downstreamCell": 49,
        "mainCLC1": 2,
        "x0": -3.57900523861765,
        "y0": -1.69644373191893
    },
    {
        "Id": 48,
        "subBasin": 2,
        "downstreamCell": 50,
        "mainCLC1": 3,
        "x0": -4.11629020452942,
        "y0": -0.765838872816414
    },
    {
        "Id": 49,
        "subBasin": 2,
        "downstreamCell": 64,
        "mainCLC1": 3,
        "x0": -2.50443530679401,
        "y0": -1.69644373191893
    },
    {
        "Id": 50,
        "subBasin": 2,
        "downstreamCell": 52,
        "mainCLC1": 3,
        "x0": -3.04172027270589,
        "y0": -0.765838872816414
    },
    {
        "Id": 51,
        "subBasin": 2,
        "downstreamCell": 54,
        "mainCLC1": 3,
        "x0": -1.42986537497048,
        "y0": -1.69644373191893
    },
    {
        "Id": 52,
        "subBasin": 2,
        "downstreamCell": 54,
        "mainCLC1": 1,
        "x0": -1.96715034088225,
        "y0": -0.765838872816414
    },
    {
        "Id": 53,
        "subBasin": 2,
        "downstreamCell": 55,
        "mainCLC1": 2,
        "x0": -0.355295443146955,
        "y0": -1.69644373191893
    },
    {
        "Id": 54,
        "subBasin": 2,
        "downstreamCell": 56,
        "mainCLC1": 2,
        "x0": -0.892580409058719,
        "y0": -0.765838872816414
    },
    {
        "Id": 55,
        "subBasin": 2,
        "downstreamCell": 70,
        "mainCLC1": 2,
        "x0": 0.719274488676572,
        "y0": -1.69644373191893
    },
    {
        "Id": 56,
        "subBasin": 2,
        "downstreamCell": 55,
        "mainCLC1": 2,
        "x0": 0.181989522764809,
        "y0": -0.765838872816414
    },
    {
        "Id": 57,
        "subBasin": 3,
        "downstreamCell": 72,
        "mainCLC1": 2,
        "x0": 1.7938444205001,
        "y0": -1.69644373191893
    },
    {
        "Id": 58,
        "subBasin": 2,
        "downstreamCell": 55,
        "mainCLC1": 2,
        "x0": 1.25655945458834,
        "y0": -0.765838872816414
    },
    {
        "Id": 59,
        "subBasin": 3,
        "downstreamCell": 72,
        "mainCLC1": 2,
        "x0": 2.86841435232363,
        "y0": -1.69644373191893
    },
    {
        "Id": 60,
        "subBasin": 3,
        "downstreamCell": 57,
        "mainCLC1": 2,
        "x0": 2.33112938641186,
        "y0": -0.765838872816414
    },
    {
        "Id": 61,
        "subBasin": 3,
        "downstreamCell": 59,
        "mainCLC1": 2,
        "x0": 3.94298428414715,
        "y0": -1.69644373191893
    },
    {
        "Id": 62,
        "subBasin": 3,
        "downstreamCell": 59,
        "mainCLC1": 2,
        "x0": 3.40569931823539,
        "y0": -0.765838872816414
    },
    {
        "Id": 63,
        "subBasin": 2,
        "downstreamCell": 66,
        "mainCLC1": 2,
        "x0": -1.42986537497048,
        "y0": -3.55765345012303
    },
    {
        "Id": 64,
        "subBasin": 2,
        "downstreamCell": 66,
        "mainCLC1": 2,
        "x0": -1.96715034088225,
        "y0": -2.62704859102145
    },
    {
        "Id": 65,
        "subBasin": 2,
        "downstreamCell": 68,
        "mainCLC1": 3,
        "x0": -0.355295443146955,
        "y0": -3.55765345012303
    },
    {
        "Id": 66,
        "subBasin": 2,
        "downstreamCell": 68,
        "mainCLC1": 3,
        "x0": -0.892580409058719,
        "y0": -2.62704859102145
    },
    {
        "Id": 67,
        "subBasin": 3,
        "downstreamCell": 69,
        "mainCLC1": 2,
        "x0": 0.719274488676572,
        "y0": -3.55765345012303
    },
    {
        "Id": 68,
        "subBasin": 2,
        "downstreamCell": 55,
        "mainCLC1": 2,
        "x0": 0.181989522764809,
        "y0": -2.62704859102145
    },
    {
        "Id": 69,
        "subBasin": 3,
        "downstreamCell": 81,
        "mainCLC1": 2,
        "x0": 1.7938444205001,
        "y0": -3.55765345012303
    },
    {
        "Id": 70,
        "subBasin": 3,
        "downstreamCell": 69,
        "mainCLC1": 2,
        "x0": 1.25655945458834,
        "y0": -2.62704859102145
    },
    {
        "Id": 71,
        "subBasin": 3,
        "downstreamCell": 81,
        "mainCLC1": 2,
        "x0": 2.86841435232363,
        "y0": -3.55765345012303
    },
    {
        "Id": 72,
        "subBasin": 3,
        "downstreamCell": 71,
        "mainCLC1": 2,
        "x0": 2.33112938641186,
        "y0": -2.62704859102145
    },
    {
        "Id": 73,
        "subBasin": 3,
        "downstreamCell": 71,
        "mainCLC1": 2,
        "x0": 3.94298428414715,
        "y0": -3.55765345012303
    },
    {
        "Id": 74,
        "subBasin": 3,
        "downstreamCell": 71,
        "mainCLC1": 2,
        "x0": 3.40569931823539,
        "y0": -2.62704859102145
    },
    {
        "Id": 75,
        "subBasin": 3,
        "downstreamCell": 76,
        "mainCLC1": 2,
        "x0": -0.355295443146955,
        "y0": -5.41886316832714
    },
    {
        "Id": 76,
        "subBasin": 3,
        "downstreamCell": 78,
        "mainCLC1": 2,
        "x0": 0.719274488676572,
        "y0": -5.41886316832714
    },
    {
        "Id": 77,
        "subBasin": 3,
        "downstreamCell": 79,
        "mainCLC1": 2,
        "x0": 0.181989522764809,
        "y0": -4.48825830922555
    },
    {
        "Id": 78,
        "subBasin": 3,
        "downstreamCell": 80,
        "mainCLC1": 3,
        "x0": 1.7938444205001,
        "y0": -5.41886316832714
    },
    {
        "Id": 79,
        "subBasin": 3,
        "downstreamCell": 81,
        "mainCLC1": 1,
        "x0": 1.25655945458834,
        "y0": -4.48825830922555
    },
    {
        "Id": 80,
        "subBasin": 3,
        "downstreamCell": 82,
        "mainCLC1": 2,
        "x0": 2.86841435232363,
        "y0": -5.41886316832714
    },
    {
        "Id": 81,
        "subBasin": 3,
        "downstreamCell": 80,
        "mainCLC1": 2,
        "x0": 2.33112938641186,
        "y0": -4.48825830922555
    },
    {
        "Id": 82,
        "subBasin": 3,
        "downstreamCell": 89,
        "mainCLC1": 2,
        "x0": 3.94298428414715,
        "y0": -5.41886316832714
    },
    {
        "Id": 83,
        "subBasin": 3,
        "downstreamCell": 82,
        "mainCLC1": 2,
        "x0": 3.40569931823539,
        "y0": -4.48825830922555
    },
    {
        "Id": 84,
        "subBasin": 3,
        "downstreamCell": 89,
        "mainCLC1": 2,
        "x0": 5.01755421597068,
        "y0": -5.41886316832714
    },
    {
        "Id": 85,
        "subBasin": 3,
        "downstreamCell": 82,
        "mainCLC1": 3,
        "x0": 4.48026925005892,
        "y0": -4.48825830922555
    },
    {
        "Id": 86,
        "subBasin": 3,
        "downstreamCell": 78,
        "mainCLC1": 2,
        "x0": 1.25655945458834,
        "y0": -6.34946802742965
    },
    {
        "Id": 87,
        "subBasin": 3,
        "downstreamCell": 80,
        "mainCLC1": 2,
        "x0": 2.33112938641186,
        "y0": -6.34946802742965
    },
    {
        "Id": 88,
        "subBasin": 3,
        "downstreamCell": 89,
        "mainCLC1": 2,
        "x0": 3.40569931823539,
        "y0": -6.34946802742965
    },
    {
        "Id": 89,
        "subBasin": 3,
        "downstreamCell": 0,
        "mainCLC1": 2,
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
]
*/