import React, { Component } from 'react'
import { HexGrid, Layout, Path, Hexagon, Text } from 'react-hexgrid'
import layoutProps from './layoutProps.js'
import { setPlayerClass, activityToString, getSubBassin, setMapSize, setBaseClasses } from './MapUtil.js'
import PropTypes from 'prop-types';
export default class Bassin extends Component {
    constructor(props) {
        super(props)
        this.update = this.update.bind(this)
    }
    /* 
        Input : props={map:{moreHexas,moreRivers,player},handleClick,role,selectedId}
                map.moreHexas : object : contains all data to create the map
                map.Rivers : array : contains object to create river
                        They look like that {start,end,outletFlowAcc}
                        start : hexagon where the river stats
                        end : hexagon where the river ends
                        outletFlowAcc : how much water there is
                handleClick : func : set the selected tile in parent component
                selectedId : number : id of the selected tile

        Syntax : <Bassin map={moreHewas,moreRivers,player} handleClick={this.handleClick} 
            role={role} selectedId={selectedId} />
    */
    static propTypes = {
        map: PropTypes.object.isRequired,
        handleClick: PropTypes.func.isRequired,
        role: PropTypes.number.isRequired,
        selectedId: PropTypes.number
    }
    update = () => {
        this.forceUpdate()
    }
    componentDidMount() {
        /* 
            re-render when window is resized
            allows to update dimensions of Hexgrid
        */
        window.addEventListener('resize', this.update)

    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.update)
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
    
        Authore : Hugo KELHETTER
    */
    createHexeFarmer(hex, i, player) {

        const bassin = getSubBassin(player)
        let classname = "";
        const mainCLC1 = hex.mainCLC1.toString()
        classname += hex.basin === bassin ? `${hex.modified} ${setBaseClasses(hex)} 
        ${setPlayerClass(hex.player)} ${hex.player % 3} ${hex.Id}` : "notInBassin"
        if (hex.Id == this.props.selectedId) classname += " selected"
        return <Hexagon
            onClick={(e, h) => hex.player == player && this.props.handleClick(h)}
            mainCLC1={mainCLC1} irrig={hex.irrig} eco={hex.eco} market={hex.market}
            className={classname}
            /* data can be found in h.props in handleClick */
            subId={hex.cellPlayer}
            key={hex.Id} id={hex.Id} q={hex.q} r={hex.r} s={hex.s}
        >
            {(hex.basin === bassin && hex.cellPlayer != null) && this.displayTileId(hex.cellPlayer)}
            {(hex.basin === bassin && mainCLC1 == 1) && this.displayMarket(hex.market)}
        </Hexagon>
    }

    createHexeElected(hex, i) {
        let classname = setBaseClasses(hex)
        if (hex.Id == this.props.selectedId) classname += " selected"
        const mainCLC1 = hex.mainCLC1.toString()
        return <Hexagon
            onClick={(e, h) => this.props.handleClick(h)}

            className={classname}
            key={i} id={i} q={hex.q} r={hex.r} s={hex.s}
            mainCLC1={mainCLC1} irrig={hex.irrig} eco={hex.eco} market={hex.market}
        >
            {hex.cellPlayer != null && this.displayTileId(hex.cellPlayer)}
            {mainCLC1 == 1 && this.displayMarket(hex.market)}

        </Hexagon >
    }
    createHexeManager(hex, i) {
        let classname = setBaseClasses(hex)
        if (hex.Id == this.props.selectedId) classname += " selected"
        const mainCLC1 = hex.mainCLC1.toString()
        return <Hexagon
            className={classname}
            bassin={hex.basin}
            player={hex.player}
            onClick={(e, h) => this.props.handleClick(h)}
            key={hex.Id} id={hex.Id} q={hex.q} r={hex.r} s={hex.s}
            mainCLC1={mainCLC1} irrig={hex.irrig} eco={hex.eco} market={hex.market}
        >
            {hex.cellPlayer != null && this.displayTileId(hex.cellPlayer)}
            {mainCLC1 == 1 && this.displayMarket(hex.market)}
            <Text key="ileId" y={2}>{hex.Id}</Text>
        </Hexagon>
    }
    /* 
        Function : displayTileId 
        
        Syntax  :  displayTileId(text)
        
        Input   : text : text to display
            
        Description : return an object <Text> containing the input text
            
        Authore : Hugo KELHETTER
    */
    displayTileId(id) {
        return id !== "-1" && <Text key="tileId" y={-2}>{id.toString()}</Text>
    }
    displayMarket(market) {
        return market == 1 && <Text key="market" y={2}>M</Text>
    }

    /* 
        Function : render 
        
        Description : display an hexagonal grid and rivers
        
        Authore : Hugo KELHETTER
    */
    render() {
        return (<>
            <HexGrid width={setMapSize()} height={setMapSize()} viewBox="-50 -50 100 100" >
                <Layout size={layoutProps.size} flat={layoutProps.flat}
                    spacing={layoutProps.spacing} origin={{ x: layoutProps.x, y: layoutProps.y }} >
                    {/* loops are done separetly because else the rivers may not always be visible */}
                    {Object.values(this.props.map.moreHexas).map((hex, i) =>
                        this.props.role == 1 ? this.createHexeFarmer(hex, i, this.props.id) :
                            this.props.role == 2 ? this.createHexeElected(hex, i) :
                                this.createHexeManager(hex, i)
                    )}
                    {this.props.map.moreRivers.map((river, i) =>
                        <g key={i} className={river.start.outletFlowAcc == 1 && "small"} >
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
