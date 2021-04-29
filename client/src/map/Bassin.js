import React, { Component } from 'react'
import { HexGrid, Layout, Path, Hexagon, Text } from 'react-hexgrid'
import layoutProps from './layoutProps.js'

/* 
    Renvoie la classe d'un hexagone en fonction de l'identifiant du joueur
    Il y a 3 joueurs par plateau, le joueur 4 est alors le premier du sous-bassin 2
        et partage donc la même classe que le joueur 1
*/
function setPlayerClass(player) {
    if (player === 0) return "" //attributé à aucun joueur
    switch (player % 3) {
        case 0: return "troisieme" //attribué au joueur 3, 6 ou 9
        case 1: return "premier" //attribué au joueur 1, 4 ou en 7
        case 2: return "deuxieme" //attribué au joueur 2, 5 ou 8
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


    createHexeFarmer(hex, i) {
        return <Hexagon
            activity={hex.activity.toString()}
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            /* appel la fonction parent handleClick avec en paramètre l'hexagone */
            onClick={(e, h) => hex.bassin === 1 ? this.props.handleClick(h) : undefined}
            /* définie la classe de l'hexagone en fonction de son activité */
            className={hex.bassin === 1 ? `${hex.modified} ${activityToString(hex.activity)} ${setPlayerClass(hex.player)} ${hex.player % 3}` : "notInBassin"} >
            {/*             <text x="0" y="0">
                <tspan x="-0.5em" dy="-0.9em">{i + 1}</tspan>
                <tspan x="-1.5em" dy="1.7em">10&nbsp;&nbsp;10</tspan>
            </text> */}
            {hex.bassin === 1 ?
                <Text y={-2}>{(i + 1).toString()}</Text> : ""}

        </Hexagon>
    }

    createHexeElected(hex, i) {
        return <Hexagon
            activity={hex.activity.toString()}
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            className={activityToString(hex.activity)} >
            <Text>{i + 1}</Text>

        </Hexagon >
    }
    createHexeManager(hex, i) {
        return <Hexagon
            activity={hex.activity.toString()}
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            /* définie la classe de l'hexagone en fonction de son activité */
            className="manager" >
            <Text>{i + 1}</Text>

        </Hexagon>
    }
    shouldComponentUpdate(nextProps) {
        return this.props !== nextProps
    }
    render() {
        return (<>
            <HexGrid width={setMapSize()} height={setMapSize()} viewBox="-50 -50 100 100" >
                <Layout size={layoutProps.size} flat={layoutProps.flat} spacing={layoutProps.spacing} origin={{ x: layoutProps.x, y: layoutProps.y }} >
                    {/* boucle créant les hexagones */}
                    {Object.values(this.props.map.moreHexas).map((hex, i) =>
                        //
                        this.props.map.role === "agriculteur" ? this.createHexeFarmer(hex, i) :
                            this.props.map.role === "elu" ? this.createHexeElected(hex, i) : this.createHexeManager(hex, i)

                    )}

                    {/* boucle créant les cours d'eau */}
                    {this.props.map.moreRivers.map((river, i) =>
                        <g key={i} className={river.start.outletFlowAcc < 100 ? "small" : ""} >
                            <Path
                                key={i} start={river.start} end={river.end}
                            />
                        </g>)}
                </Layout>
            </HexGrid >
        </>
        );
    }
}
