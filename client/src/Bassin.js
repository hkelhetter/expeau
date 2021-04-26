import React, { Component } from 'react'
import { HexGrid, Layout, Path, Hexagon, Text } from 'react-hexgrid'

let couleur;
function setColor(activity) {
    console.log(activity)
    switch (activity) {
        case 1: return "rgb(189, 19, 19)";
        case 2: return "rgb(211, 139, 57)";
        case 3: return "rgb(32, 138, 6)";
        default: return "#3F1343";
    }
}


/*
    renvoie une chaîne de caractère correspondant à l'activité mise en paramètre
 */
function activityToString(activity) {
    switch (activity) {
        case 1: return "ville";
        case 2: return "agriculture";
        case 3: return "foret";
        default: return "notInBassin";
    }
}

/*  
    format pour les appareils mobiles 
    renvoie 50% si la fenêtre est en format paysage, 100% en format portrait 
*/
function setMapSize() {
    return window.matchMedia('(orientation:landscape)').matches ? '50%' : '100%'
}

export default class Bassin extends Component {
    constructor(props) {
        super(props)
        //this.props.map ...props.map }
        console.log(this.props.map.role == "agriculteur", props)
    }

    createHexeFarmer(hex, i) {
        return <Hexagon
            activity={hex.activity.toString()}
            fill="pattern"
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            /* appel la fonction parent handleClick avec en paramètre l'hexagone */
            onClick={(e, h, i) => hex.bassin === 1 ? this.props.handleClick(h) : undefined}
            /* définie la classe de l'hexagone en fonction de son activité */
            className={hex.bassin === 1 ? `${hex.modified} ${activityToString(hex.activity)}` : "notInBassin"} >
            <text x="0" y="0">
                <tspan x="-0.5em" dy="-0.9em">{i + 1}</tspan>
                <tspan x="-1.5em" dy="1.7em">10&nbsp;&nbsp;10</tspan>
            </text>
            {/*<line stroke="black" strokeWidth="1px" x1="-1.5px" y1="-1.5px" x2="1.5px" y2="1.5px"></line> */}
            {/* <pattern id="pattern"
                width="8" height="10"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45 50 50)">
                <line stroke={setColor(hex.activity)} strokeWidth="7px" y2="10" strokeOpacity="1" />
                </pattern> */}
        </Hexagon>
    }

    createHexeElected(hex, i) {
        return <Hexagon
            activity={hex.activity.toString()}
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            /* définie la classe de l'hexagone en fonction de son activité */
            className={`${hex.modified} ${activityToString(hex.activity)}`} >
            <Text>{i + 1}</Text>

        </Hexagon>
    }
    render() {
        return (<>
            <HexGrid width={setMapSize()} height={setMapSize()} viewBox="-50 -50 100 100" >
                <Layout size={this.props.map.hexagonSize} flat={false} spacing={1} origin={{ x: 0, y: 0 }} >
                    {/* boucle créant les hexagones */}
                    {Object.values(this.props.map.moreHexas).map((hex, i) =>
                        //
                        this.props.map.role == "agriculteur" ? this.createHexeFarmer(hex, i) : this.createHexeElected(hex, i)

                    )}

                    {/* boucle créant les cours d'eau */}
                    {this.props.map.moreRivers.map((river, i) => <Path
                        key={i} start={river.start} end={river.end}
                    />)}
                </Layout>
            </HexGrid >
        </>
        );
    }
}

