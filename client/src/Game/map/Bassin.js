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
import { setPlayerClass, activityToString, getSubBassin, setMapSize } from './MapUtil.js'

export default class Bassin extends Component {

    componentDidMount() {
        /* 
            re-render when window is resized
            allows to update dimensions of Hexgrid
        */
        window.addEventListener('resize', () => {
            this.forceUpdate()
        })

    }
    createHexeFarmer(hex, i, player) {
        const bassin = getSubBassin(player)
        return <Hexagon
            activity={hex.activity.toString()}
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            onClick={(e, h) => hex.player === /* player */0 ? this.props.handleClick(h) : ""}
            className={hex.subBasin === bassin ? `${hex.modified} ${activityToString(hex.activity)} 
                ${setPlayerClass(hex.player)} ${hex.player % 3}` : "notInBassin"} >
            {hex.subBasin === bassin ? [
                this.displayTileId(i + 1),
                <Text key="playerId" y={2}>{hex.player.toString()}</Text>] : ""}

        </Hexagon>
    }

    createHexeElected(hex, i) {
        return <Hexagon
            activity={hex.activity.toString()}
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            className={activityToString(hex.activity)} >
            {this.displayTileId(i + 1)}

        </Hexagon >
    }
    createHexeManager(hex, i) {
        return <Hexagon
            activity={hex.activity.toString()}
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            className={`manager ${activityToString(hex.activity)}`} >
            {this.displayTileId(i + 1)}
        </Hexagon>
    }
    displayTileId(id) {
        return <Text key="tileId" y={-2}>{(id).toString()}</Text>
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
