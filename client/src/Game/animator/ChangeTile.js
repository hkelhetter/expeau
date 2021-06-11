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
import warningText from "../controls/warningText.js"
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
    /* 
            Function : handleChange
    
            Syntax  : handleChange
    
            Input   : event : the event calling the function        
    
            Description : update the form controls's state
    
            Author : Hugo KELHETTER
        
    */
    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? +target.checked : target.value;
        this.setState({ [target.name]: value });
    }
    /* 
        Function : checkReceiver

        Syntax  : resString=checkReceiver(res)

        Input   : res : object : contains the key/value pair selectedReceiver:player's id  
        
        Output  : resString : string : string explaining what went wrong in the submission

        Description : check if res.selectedReceiver equals this.state.selectedReceiver or "" and returns a string according to it

        Author : Hugo KELHETTER
    
    */
    checkReceiver(res) {
        res.selectedReceiver = this.state.selectedReceiver
        if (this.state.selectedReceiver === "") return "selectionnez le joueur qui reçoit la case"
        if (this.state.selectedReceiver === this.props.selectedTile.player) return "le donneur et le receveur ne peuvent pas être la même personne"

        return ""
    }
    /* 
            Function : modifyTile
    
            Syntax  : [resString,res]=modifyTile()
    
            Output : resString : string : string explaining what went wrong in the submission
                     res : object : contains the modifications sent to the server
    
            Description : check the form submission and return a log of it and an object containing the modifications
                        if everything is fine, send to the server the modifications
    
            Author : Hugo KELHETTER
        
        */
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
    /* 
            Function : handleSubmit
    
            Syntax  : handleSubmit
    
            Description : call modifyTile. If it succeeded, update map, else display message to explain what went wrong
    
            Author : Hugo KELHETTER
        
    */
    handleSubmit = (event) => {
        event.preventDefault()
        const [feedBack, change] = this.modifyTile()
        if (feedBack === "") this.props.updateMap(change)
        this.setState({ feedBack })
    }
    /* 
        Function : selectedPLayer

        Syntax  : selectedBox=selectedPlayer()

        Output :  selectedBox=<>
                                <FormLabel>
                                <Select>
                                    <MenuItem/>
                                </Select>
                                </> 
                                
        Description : display a selectedBox containing the farmer present in the 
                        same sub basin as the selected tile

        Author : Hugo KELHETTER
        
    */
    selectedPlayer() {
        const tile = this.props.selectedTile

        let playerArray = this.props.lstPlayer.filter(player => (player.Role < 9 && getSubBassin(player.Id) === tile.bassin && player.Id !== tile.player))
        return (this.state.agriAction === "changeOwner" || this.state.agriAction === "transformToFarm") && <>
            <FormLabel component="legend">Qui reçoit cette case ?</FormLabel>
            <Select name="selectedReceiver" labelId="selectedReceiver"
                value={this.state.selectedReceiver} onChange={this.handleChange}>
                {playerArray.map((player, i) =>
                    <MenuItem value={player.Id} key={player.Id}>{player.Name} : joueur {i} </MenuItem>
                )}
            </Select>
        </>
    }
    /* 
        Function : addInfra

        Syntax  : selectedBoxes=addInfra()

        Output :  selectedBoxes=<>
                                <FormControlLabel>
                                    <CheckBox>
                                </FormControlLabel>
                                <FormControlLabel>
                                    <CheckBox>
                                </FormControlLabel>
                                </> 
                                
        Description : display checkBoxes to add infrastructures

        Author : Hugo KELHETTER
        
    */
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
    /* 
        Function : transformToCity

        Syntax  : transformToCity

        Output :  selectedBox=<>
                                <FormControlLabel>
                                    <CheckBox>
                                </FormControlLabel>
                                </> 
                                
        Description : display checkBox to add a market 

        Author : Hugo KELHETTER
        
    */
    transformToCity() {
        return this.state.agriAction === "transformToCity" && <FormControlLabel
            control={
                this.createCheckbox("checkboxMarket")
            }
            label="Etablir un marché local"
        />
    }
    /* 
        Function : ComponentDidUpdate

        Syntax  : ComponentDidUpdate(prevProps)
                                
        Description : if the selectedTile changes, update controls to the new tile's state

        Author : Hugo KELHETTER
        
    */
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
    /* 
        Function : render

        Syntax  : render
        
        Description : Display all controls to update the map as an animator

        Author : Hugo KELHETTER
        
    */
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
                {warningText(this.state.feedBack)}
            </FormControl>

        );
    }
}