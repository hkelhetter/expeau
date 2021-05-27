import React from 'react'
import { Button } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

export default class AnimatorUi extends React.Component {
    constructor(props) {
        super(props)
        this.state = { selectedGifter: "", selectedTile: "", selectedReceiver: "" }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(event) {
        event.preventDefault()
        console.log("event")
        if (this.state.selectedGifter === "" || this.state.selectedTile === "" || this.state.selectedReceiver === "") return false
        if (this.state.selectedReceiver === this.state.selectedGifter) return false
    }
    handleChange(event) {
        const target = event.target.name
        const value = event.target.value
        this.setState({ [target]: value })
        if (target === "selectedGifter") this.setState({ selectedTile: "" })
    }
    endTurn() {
        console.log("end turn")
    }
    render() {
        return (
            <div id="animatorControl">
                <form onSubmit={this.handleSubmit}>
                    <FormControl>
                        <InputLabel id="selectedGifter" class="position-relative">Joueur qui donne la case</InputLabel>
                        <Select name="selectedGifter" labelId="selectedGifter" id="gifter"
                            value={this.state.selectedGifter} onChange={this.handleChange}>
                            {this.props.lstPlayer.map((player, i) =>
                                player.Role === "0" ? <MenuItem value={player.Id}>{player.Name}</MenuItem> : ""
                            )}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="selectedTile" class="position-relative">La case à échanger</InputLabel>
                        <Select name="selectedTile" labelId="selectedTile"
                            value={this.state.selectedTile} onChange={this.handleChange}>
                            {Object.values(this.props.lstTile).map((tile, i) =>
                                <MenuItem value={tile.id}>{tile.cellPlayer}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="selectedReceiver" class="position-relative">Joueur qui reçoit la case</InputLabel>
                        <Select name="selectedReceiver" labelId="selectedReceiver" id="gifter"
                            value={this.state.selectedReceiver} onChange={this.handleChange}>
                            {this.props.lstPlayer.map((player, i) =>
                                player.Role === "0" ? <MenuItem value={player.Id}>{player.Name}</MenuItem> : ""
                            )}
                        </Select>
                    </FormControl>
                    <Button class="btn btn-outline-dark" type="submit">Valider</Button>
                    <Button onClick={this.endTurn} class="btn btn-outline-dark">Finir le tour</Button>

                </form>
            </div>
        );
    }
}