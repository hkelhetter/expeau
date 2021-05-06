/* 
    Function : setPlayerClass

    Syntax
        playerClass=setPlayerClass(PlayerId)
    
    Input
        PlayerId    :player's id

    Outputs
        playerClass :player's id on subBasin

    Description
        Compute player's id on their subBasin based on their global id
*/

/* 
    Function : activityToString

    Syntax
        tileActivity=activityToString(activity)
    
    Input
        activity    :tile's activity

    Outputs
        tileactivity:string corresponding to the activity

    Description
        returns a string based on the input
        this is meant to set className to components and apply css style
*/

/* 
    Function : setMapSize

    Syntax
        
    
    Input
        

    Outputs

    Description
        
*/

/* 
    Function : createHexeFarmer

    Syntax
        <Hexagon/>=createHexeFarmer(hex,i)        
    
    Input
        hex :object containing the data to create the hexagon
        i   :hex's id

    Outputs
        polygon :polygon of type svg with hexagon shape
        text    :text inside the polygon countaining hex's id + 1

    Description
        returns the following architecture:
            <g class='hexagon-group' plus some others such as the output of activityToString>
                <g>
                    <polygon/>
                    <text/>
                </g>
            </g>
    
    see /src/map/MapUtil.js for more information about hex'properties

        
*/


import React, { Component } from 'react'
import { HexGrid, Layout, Path, Hexagon, Text } from 'react-hexgrid'
import layoutProps from './layoutProps.js'


function setPlayerClass(player) {
    if (player === 0) return "" //attributé à aucun joueur
    switch (player % 3) {
        case 0: return "troisieme" //attribué au joueur 3, 6 ou 9
        case 1: return "premier" //attribué au joueur 1, 4 ou en 7
        case 2: return "deuxieme" //attribué au joueur 2, 5 ou 8
    }
}

function activityToString(activity) {
    switch (activity) {
        case 1: return "ville";
        case 2: return "agriculture";
        case 3: return "foret";
        default: return "notInBassin";
    }
}
function getSubBassin(id) {
    if (id < 4) return 1
    if (id < 7) return 2
    return 3
}
function setMapSize() {
    return window.matchMedia('(orientation:landscape)').matches ? '50%' : '100%'
}

export default class Bassin extends Component {


    createHexeFarmer(hex, i, player) {
        const bassin = getSubBassin(player)
        return <Hexagon
            activity={hex.activity.toString()}
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            /* appel la fonction parent handleClick avec en paramètre l'hexagone */
            onClick={(e, h) => hex.player === 0/* player  */ ? this.props.handleClick(h) : ""}
            /* définie la classe de l'hexagone en fonction de son activité */
            className={hex.subBasin === bassin ? `${hex.modified} ${activityToString(hex.activity)} 
                ${setPlayerClass(hex.player)} ${hex.player % 3}` : "notInBassin"} >

            {hex.subBasin === bassin ? [
                <Text key="tileId" y={-2}>{(i + 1).toString()}</Text>,
                <Text key="playerId" y={2}>{hex.player.toString()}</Text>] : ""}

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
    shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextProps
    }
    render() {
        return (<>
            <HexGrid width={setMapSize()} height={setMapSize()} viewBox="-50 -50 100 100" >
                <Layout size={layoutProps.size} flat={layoutProps.flat}
                    spacing={layoutProps.spacing} origin={{ x: layoutProps.x, y: layoutProps.y }} >
                    {/* boucle créant les hexagones */}
                    {Object.values(this.props.map.moreHexas).map((hex, i) =>
                        //
                        /* this.props.map.player < 10 ? this.createHexeFarmer(hex, i, this.props.map.player) :
                            this.props.map.role === "elu" ? this.createHexeElected(hex, i) :
                                this.createHexeManager(hex, i) */
                        this.createHexeFarmer(hex, i, this.props.map.player)

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
