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
    createHexeFarmer(hex, i, player) {
        const bassin = getSubBassin(player)

        return <Hexagon
            mainCLC1={hex.mainCLC1.toString()}
            subId={hex.cellPlayer}
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            onClick={(e, h) => hex.player == player ? this.props.handleClick(h) : ""}
            className={hex.basin === bassin ? `${hex.modified} ${activityToString(hex.mainCLC1)} 
                ${setPlayerClass(hex.player)} ${hex.player % 3}` : "notInBassin"} >
            {hex.basin === bassin ? [
                hex.cellPlayer != null ? this.displayTileId(hex.cellPlayer) : ""] : ""}

        </Hexagon>
    }

    createHexeElected(hex, i) {
        return <Hexagon
            mainCLC1={hex.mainCLC1.toString()}
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            className={activityToString(hex.mainCLC1)} >
            {hex.cellPlayer != null ? this.displayTileId(hex.cellPlayer) : ""}
        </Hexagon >
    }
    createHexeManager(hex, i) {
        return <Hexagon
            mainCLC1={hex.mainCLC1.toString()}
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            className={`manager ${activityToString(hex.mainCLC1)}`} >
            {hex.cellPlayer != null ? this.displayTileId(hex.cellPlayer) : ""}
        </Hexagon>
    }
    /* 
        Function : displayTileId 
        
        Syntax  :  displayTileId(text)
        
        Input   : text : text to display
            
        Description : return an object <Text> containing the input text
            
    */
    displayTileId(text) {
        return <Text key="tileId" y={-2}>{text.toString()}</Text>
    }
    /* 
        don't allow the component to update if the props don't change
    */
    shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextProps
    }
    /* 
        Function : render 
        
        Description : display an hexagonal grid and rivers
            
    */
    render() {
        console.log("render")
        return (<>
            <HexGrid width={setMapSize()} height={setMapSize()} viewBox="-50 -50 100 100" >
                <Layout size={layoutProps.size} flat={layoutProps.flat}
                    spacing={layoutProps.spacing} origin={{ x: layoutProps.x, y: layoutProps.y }} >
                    {/* loops are done separetly because else the rivers may not always be visible */}
                    {Object.values(this.props.map.moreHexas).map((hex, i) =>
                        /* this.props.map.player < 10 ? this.createHexeFarmer(hex, i, this.props.map.player) :
                            this.props.map.role === "elu" ? this.createHexeElected(hex, i) :
                                this.createHexeManager(hex, i) */
                        this.createHexeFarmer(hex, i, this.props.map.player)
                    )}
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
