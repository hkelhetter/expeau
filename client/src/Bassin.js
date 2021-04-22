import React, { Component } from 'react'
import { HexGrid, Layout, Path, Hexagon, Text } from 'react-hexgrid'


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
function setGridWidth() {
    let a;
    return window.matchMedia('(orientation:landscape)').matches ? '50%' : '100%'
}

export default class Bassin extends Component {
    constructor(props) {
        super(props)
        this.state = props.map
    }
    render() {
        console.log()

        return (
            <HexGrid width={setGridWidth()} height={setGridWidth()} viewBox="-50 -50 100 100" >
                <Layout size={this.state.hexagonSize} flat={false} spacing={1} origin={{ x: 0, y: 0 }} >
                    {/* boucle créant les hexagones */}
                    {this.state.moreHexas.map((hex, i) =>
                        <Hexagon
                            activity={hex.activity.toString()}
                            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
                            /* appel la fonction parent handleClick avec en paramètre l'hexagone */
                            onClick={(e, h, i) => hex.bassin == 1 ? this.props.handleClick(h) : undefined}
                            /* définie la classe de l'hexagone en fonction de son activité */
                            className={hex.bassin === 1 ? hex.modified + ' ' + activityToString(hex.activity) : "notInBassin"} >
                            <Text>{i.toString()}</Text>
                        </Hexagon>
                    )}
                    {/* boucle créant les cours d'eau */}
                    {this.state.moreRivers.map((river, i) => <Path
                        key={i} start={river.start} end={river.end} layout={river.layout}
                    />)}
                </Layout>
            </HexGrid >
        );
    }
}
