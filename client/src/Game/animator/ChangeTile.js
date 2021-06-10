import React from "react"
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { socket } from "../../socket.js"
import { getSubBassin } from "../map/MapUtil.js"
import createCheckbox from "../controls/createCheckbox.js"
import { Button } from '@material-ui/core'

export default class ChangeTile extends React.Component {
    constructor(props) {
        super(props)
        //this.handleChange = this.handleChange.bind(this)
        //this.handleSubmit = this.handleSubmit.bind(this)
        //this.modifyTile = this.modifyTile.bind(this)
        this.createCheckbox = createCheckbox.bind(this)
        this.state = {
            agriAction: "", action: "", selectedReceiver: "", feedBack: "",
            checkboxEco: !!this.props.selectedTile.eco, checkboxIrrig: !!this.props.selectedTile.irrig,
            checkboxMarket: !!this.props.selectedTile.market
        }
    }
    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? +target.checked : target.value;
        this.setState({ [target.name]: value });
    }
    checkReceiver(res) {
        res.selectedReceiver = this.state.selectedReceiver
        if (this.state.selectedReceiver === "") return "selectionnez le joueur qui reçoit la case"
        if (this.state.selectedReceiver === this.props.selectedTile.player) return "le donneur et le receveur ne peuvent pas être la même personne"

        return ""
    }

    modifyTile = () => {
        const [problem] = "quelque chose s'est mal passé"
        let res = { selectedTile: this.props.selectedTile.id }
        switch (this.props.selectedTile.mainCLC1) {
            case "1":
                res = { ...res, market: +!this.props.selectedTile.market }
                //res = { ...res, infrastructure: 0, market: 1, newActivity: 0 }
                socket.emit("setMarket", res)
                return ["", res]
            case "2":
                switch (this.state.agriAction) {
                    case "":
                        return ["selectionnez l'action à effectuer"]
                    case "changeOwner":
                        const ok = this.checkReceiver(res)
                        if (ok === "") socket.emit("changeOwner", res)
                        res.cellPlayer = res.selectedReceiver
                        res.player = res.selectedReceiver
                        delete res.selectedReceiver
                        return [ok, res]
                    case "addInfra":
                        if (this.state.checkboxEco === this.props.selectedTile.eco && this.state.checkboxIrrig === this.props.selectedTile.irrig) {
                            return ["rien n'a changé"]
                        }
                        res = { ...res, eco: this.state.checkboxEco, irrig: this.state.checkboxIrrig }
                        socket.emit("addInfra", res)
                        return ["", res]
                    case "transformToForest":
                        socket.emit("transformToForest", res.selectedTile)
                        res.mainCLC1 = 3
                        return ["", res]
                    default:
                        return [problem]
                }

            case "3":
                switch (this.state.agriAction) {

                    case "":
                        return ["selectionnez l'action à effectuer"]
                    case "transformToCity":
                        res = { ...res, market: this.state.checkboxMarket }
                        socket.emit("transformToCity", res)
                        res.mainCLC1 = 1
                        return ["", res]
                    case "transformToFarm":
                        res = {
                            ...res, selectedReceiver: this.state.selectedReceiver,
                            eco: this.state.checkboxEco, irrig: this.state.checkboxIrrig
                        }
                        const ok = this.checkReceiver(res)
                        if (ok === "") socket.emit("transformToFarm", res)
                        res.mainCLC1 = 2
                        return [ok, res]
                    default:
                        return [problem]
                }
            case "5":
                switch (this.state.agriAction) {
                    case "":
                        return ["selectionnez l'action à effectuer"]
                    case "transformToFarm":
                        res = {
                            ...res, selectedReceiver: this.state.selectedReceiver,
                            eco: this.state.checkboxEco, irrig: this.state.checkboxIrrig
                        }
                        const ok = this.checkReceiver(res)
                        if (ok === "") socket.emit("transformToFarm", res)
                        res.mainCLC1 = 2
                        return [ok, res]
                    case "transformToForest":
                        console.log("a")
                        socket.emit("transformToForest", res.selectedTile)
                        res.mainCLC1 = 3
                        return ["", res]
                    default:
                        return [problem]
                }
            default:
                return [problem]
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const [feedBack, change] = this.modifyTile()
        if (feedBack === "") this.props.updateMap(change)
        this.setState({ feedBack })
    }
    /*     createCheckbox(name) {
            return <Checkbox
                onChange={this.handleChange}
                name={name}
                color="primary"
                checked={this.state[name]}
                disabled={this.props.selectedTile[name]}
            />
        } */

    selectedPlayer() {
        const tile = this.props.selectedTile

        let playerArray = this.props.lstPlayer.filter(player => (player.Role < 9 && getSubBassin(player.Id) === tile.bassin && player.Id !== tile.player))
        return (this.state.agriAction === "changeOwner" || this.state.agriAction === "transformToFarm") && <>
            <FormLabel component="legend">Qui reçoit cette case ?</FormLabel>
            <Select name="selectedReceiver" labelId="selectedReceiver"
                value={this.state.selectedReceiver} onChange={this.handleChange}>
                {playerArray.map((player, i) =>
                    <MenuItem value={player.Id} key={player.Id}>{player.Name} </MenuItem>
                )}
            </Select>
        </>
    }
    addInfra() {
        return (this.state.agriAction === 'addInfra' || this.state.agriAction === 'transformToFarm') && <>
            < FormControlLabel
                control={
                    this.createCheckbox("checkboxEco")
                }
                label="infrastructure écologique"
            />
            <FormControlLabel
                control={
                    this.createCheckbox("checkboxIrrig")
                }
                label="infrastructure d'irrigation"
            />
        </>
    }
    transformToCity() {
        return this.state.agriAction === "transformToCity" && <FormControlLabel
            control={
                this.createCheckbox("checkboxMarket")
            }
            label="Etablir un marché local"
        />
    }
    componentDidUpdate(prevProps) {
        if (prevProps.selectedTile.id !== this.props.selectedTile.id) {
            this.setState({
                checkboxEco: this.props.selectedTile.eco,
                checkboxIrrig: this.props.selectedTile.irrig,
                checkboxMarket: this.props.selectedTile.market,
                selectedReceiver: ""
            })

        }
    }
    render() {
        return (
            <FormControl component="fieldset">
                {this.props.selectedTile.mainCLC1 === "1" /* city */ ?

                    <FormLabel component="legend">{this.props.selectedTile.market ? "Supprimer le marché" : "Etablir un marché local"}</FormLabel>
                    : this.props.selectedTile.mainCLC1 === "2" /* farm */ ?
                        <>
                            <RadioGroup name="agriAction" value={this.state.agriAction} onChange={this.handleChange} >
                                <FormControlLabel key="1" value="changeOwner" control={<Radio />} label="donner la case" id="giveTile" />
                                {this.selectedPlayer()}
                                <FormControlLabel key="2" value="addInfra" control={<Radio />} label="mettre en place des infrastructures" id="addInfra" />
                                {this.addInfra()}
                                <FormControlLabel key="3" value="transformToForest" control={<Radio />} label="transformer en forêt" id="transformToForest" />

                            </RadioGroup>
                        </>
                        : this.props.selectedTile.mainCLC1 === "3" /* forest */ ?
                            <>

                                <RadioGroup aria-label="type" name="agriAction" value={this.state.agriAction} onChange={this.handleChange}>
                                    <FormControlLabel key="1" value="transformToCity" control={<Radio />} label="transformer en ville" />
                                    {this.transformToCity()}
                                    <FormControlLabel key="2" value="transformToFarm" control={<Radio />} label="transformer en zone agricole" />
                                    {this.selectedPlayer()}
                                    {this.addInfra()}

                                </RadioGroup>

                            </> : /* water */
                            <RadioGroup aria-label="type" name="agriAction" value={this.state.agriAction} onChange={this.handleChange}>
                                <FormControlLabel key="1" value="transformToFarm" control={<Radio />} label="tranformer en zone agricole" />
                                {this.selectedPlayer()}
                                {this.addInfra()}

                                <FormControlLabel key="2" value="transformToForest" control={<Radio />} label="transformer en forêt" />
                            </RadioGroup>
                }
                <Button type="submit" variant="contained" color="primary" data-testid="submit" onClick={this.handleSubmit}>Valider</Button>
                <div id="helpSubmit" class="warning">

                    {this.state.feedBack}
                </div>
            </FormControl>

        );
    }
}