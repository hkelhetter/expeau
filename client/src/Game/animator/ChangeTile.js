import React from "react"
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import "bootstrap/dist/css/bootstrap.min.css";
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button } from "reactstrap";
import { socket } from "../../socket.js"
import { getSubBassin } from "../map/MapUtil.js"
export default class ChangeTile extends React.Component {
    constructor(props) {
        super(props)
        //this.handleChange = this.handleChange.bind(this)
        //this.handleSubmit = this.handleSubmit.bind(this)
        //this.modifyTile = this.modifyTile.bind(this)
        this.state = { agriAction: "", action: "", selectedReceiver: "", feedBack: "", checkboxEco: 0, checkboxIrrig: 0, checkboxMarket: 0 }
    }
    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? +target.checked : target.value;
        this.setState({ [target.name]: value });

    }
    checkReceiver(res) {
        res.selectedReceiver = this.state.selectedReceiver
        if (this.state.selectedReceiver === "") return "selectionnez le joueur qui reçoit la case"
        if (this.state.selectedReceiver == this.props.selectedTile.player) return "le donneur et le receveur ne peuvent pas être la même personne"

        return ""
    }
    modifyTile = () => {
        const problem = "quelque chose s'est mal passé"
        if (this.props.selectedTile.className === "water") return ["case non valide"]
        let res = { selectedTile: this.props.selectedTile.id }
        switch (this.props.selectedTile.className) {
            case "agriculture":
                switch (this.state.agriAction) {
                    case "1":
                        const ok = this.checkReceiver(res)
                        if (ok === "") socket.emit("changeOwner", res)
                        return [ok, res]
                    case "2":
                        console.log(this.state.checkboxEco, this.state.checkboxIrrig)

                        if (!this.state.checkboxEco && !this.state.checkboxIrrig) {
                            return ["selectionnez au moins un infrastructure à ajouter"]
                        }
                        res = { ...res, eco: this.state.checkboxEco, irrig: this.state.checkboxIrrig }
                        socket.emit("addInfra", res)
                        return ["", res]
                    default:
                        return problem
                }
                break;
            case "foret":
                switch (this.state.action) {
                    case "":
                        return ["selectionnez l'action à effectuer"]
                    case "1":
                        res = { ...res, market: this.state.checkboxMarket, newActivity: this.state.action }
                        socket.emit("tranformToCity", res)
                        return ["", res]
                    case "2":
                        res = { ...res, newActivity: this.state.action, selectedReceiver: this.state.selectedReceiver }
                        const ok = this.checkReceiver(res)
                        if (ok === "") socket.emit("transformToFarm", res)
                        return ok
                    default:
                        return problem
                }
            case "ville":
                //res = { ...res, infrastructure: 0, market: 1, newActivity: 0 }
                socket.emit("setMarket", res)
                return ["", res]
            default:
                return problem
        }
    }
    handleSubmit = (event) => {
        event.preventDefault()
        const [feedBack, change] = this.modifyTile()
        if (feedBack === "") this.props.updateMap(change)
        console.log(feedBack)
        this.setState({ feedBack })
    }

    selectedPlayer() {
        const tile = this.props.selectedTile
        return <>
            <FormLabel component="legend">Qui reçoit cette case ?</FormLabel>
            <Select name="selectedReceiver" labelId="selectedReceiver"
                value={this.state.selectedReceiver} onChange={this.handleChange}>
                {this.props.lstPlayer.map((player, i) =>
                    (player.Role < 9 && getSubBassin(player.Id) === tile.bassin) ?
                        <MenuItem value={player.Id} key={player.Id}>{player.Name} </MenuItem> : ""
                )}
            </Select>
        </>

    }
    addInfra() {
        return <>
            <FormControlLabel
                control={
                    <Checkbox
                        disabled
                        onChange={this.handleChange}
                        name="checkboxEco"
                        color="primary"
                        checked={this.state.checkboxEco}
                    />
                }
                label="infrastructure écologique"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        onChange={this.handleChange}
                        name="checkboxIrrig"
                        color="primary"
                        checked={this.state.checkboxIrrig}
                    />
                }
                label="infrastructure d'irrigation"
            />
        </>
    }
    render() {
        return (
            <FormControl component="fieldset">
                {this.props.selectedTile.className === "ville" ?

                    <FormLabel component="legend">{this.props.selectedTile.market ? "Supprimer le marché" : "Etablir un marché local"}</FormLabel>
                    : this.props.selectedTile.className === "agriculture" ?
                        <>
                            <RadioGroup name="agriAction" value={this.state.agriAction} onChange={this.handleChange} >
                                <FormControlLabel key="1" value="1" control={<Radio />} label="donner la case" id="giveTile" />
                                {this.state.agriAction === "1" && this.selectedPlayer()}
                                <FormControlLabel key="2" value="2" control={<Radio />} label="mettre en place des infrastructures" id="addInfra" />
                                {this.state.agriAction === "2" && this.addInfra()}
                            </RadioGroup>
                        </>
                        : this.props.selectedTile.className === "foret" ?
                            <>

                                <RadioGroup aria-label="type" name="action" value={this.state.action} onChange={this.handleChange}>
                                    <FormControlLabel key="1" value="1" control={<Radio />} label="transformer en ville" />
                                    {this.state.action === "1" &&
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={this.handleChange}
                                                    name="checkboxMarket"
                                                    color="primary"
                                                    checked={this.state.checkboxMarket}
                                                />
                                            }
                                            label="Etablir un marché local"
                                        />
                                    }
                                    <FormControlLabel key="2" value="2" control={<Radio />} label="transformer en zone agricole" />
                                    {this.state.action === "2" ? this.selectedPlayer() : ""}
                                </RadioGroup>

                            </> : <FormLabel component="legend">Rien à faire ici</FormLabel>
                }
                <button type="submit" class="btn btn-primary" data-testid="submit" onClick={this.handleSubmit}>Valider</button>
                <div id="helpSubmit" class="invalid-feedback d-block">
                    {this.state.feedBack}
                </div>
            </FormControl>
        );
    }
}