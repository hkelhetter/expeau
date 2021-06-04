import React from 'react'
import { Button } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import { generateHexes, generateRivers } from "../map/MapUtil.js"
import Bassin from '../map/Bassin.js'
export default class AnimatorUi extends React.Component {
    /* 
        Input : props={lstPlayer,lstTile}
                lstPlayer : object : contains data of all players
                lstTile : object : contains data of all tiles
        
        Syntax : <AnimatorUi lstPlayer={list of players} lstTile={list of Tiles} />
    */
    constructor(props) {
        super(props)
        this.state = { selectedGifter: "", selectedTile: "", selectedReceiver: "" }
        //this.handleChange = this.handleChange.bind(this)
        //this.handleSubmit = this.handleSubmit.bind(this)
    }
    static propTypes = {
        lstPlayer: PropTypes.object.isRequired,
        lstTile: PropTypes.object.isRequired
    }
    handleSubmit = (event) => {
        event.preventDefault()
        if (this.state.selectedGifter === "" || this.state.selectedTile === "" || this.state.selectedReceiver === "") return false
        if (this.state.selectedReceiver === this.state.selectedGifter) return false
    }
    handleChange = (event) => {
        const target = event.target.name
        const value = event.target.value
        this.setState({ [target]: value })
        if (target === "selectedGifter") this.setState({ selectedTile: "" })
    }
    endTurn() {
        console.log("end turn")
    }
    getTilesOfPlayer(lstTile, player) {
        return Object.values(lstTile).filter(tile => tile.player == player)
    }
    render() {

        let subListTile = this.getTilesOfPlayer(this.props.lstTile, this.state.selectedGifter)
        return (
            <div id="animatorControl">
                <form onSubmit={this.handleSubmit}>
                    <FormControl>
                        <InputLabel id="selectedGifter" class="position-relative">Joueur qui donne la case</InputLabel>
                        <Select name="selectedGifter" labelId="selectedGifter" id="gifter"
                            value={this.state.selectedGifter} onChange={this.handleChange}>
                            {this.props.lstPlayer.map((player, i) =>
                                player.Role === "0" && <MenuItem value={player.Id}>{player.Name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="selectedTile" class="position-relative">La case à échanger</InputLabel>


                        <Select name="selectedTile" labelId="selectedTile"
                            value={this.state.selectedTile} onChange={this.handleChange}>
                            {subListTile.map((tile, i) =>
                                <MenuItem value={tile.id}>{tile.cellPlayer}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="selectedReceiver" class="position-relative">Joueur qui reçoit la case</InputLabel>
                        <Select name="selectedReceiver" labelId="selectedReceiver" id="gifter"
                            value={this.state.selectedReceiver} onChange={this.handleChange}>
                            {this.props.lstPlayer.map((player, i) =>
                                player.Role === "0" && <MenuItem value={player.Id}>{player.Name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <Button class="btn btn-outline-dark" type="submit">Valider</Button>
                    <Button onClick={this.endTurn} class="btn btn-outline-dark">Finir le tour</Button>
                </form>
            </div>
        );
        console.log(subListTile)
    }
}