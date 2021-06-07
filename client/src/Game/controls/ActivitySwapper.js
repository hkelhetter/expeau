import React from 'react'
import { socket } from "../../socket.js"
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import createCheckbox from "./createCheckbox.js"
class ActivitySwapper extends React.Component {
    /*    
        Input : props={changeTileActivity,selectedTile,actions}
                changeTileActivity : func : function declared in parent to change tile(s)'s activity
                selectedTile : object : tile selected by the player
                actions : object : list of all the available actions

        Syntax : <ActivitySwapper changeTileActivity={this.changeTileActivity} 
            selectedTile={the selected tile} actions={the list of actions} />

        Authore : Hugo KELHETTER            
    */
    constructor(props) {
        super(props);
        this.state = { selectActivity: 0, checkbox: false };
        this.createCheckbox = createCheckbox.bind(this)
        //this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }
    static propTypes = {
        changeTileActivity: PropTypes.func.isRequired,
        selectedTile: PropTypes.object.isRequired,
        actions: PropTypes.array.isRequired
    }
    /* 
        Function : handleChange
    
        Syntax  : handleChange(event)
            
        Input   : event : the event calling the function
            
        Description : 
            function called when interacting with the form's components
            if the target is a checkBox, change its validation
            update the state value for the corresponding event target
    
        Authore : Hugo KELHETTER
    */
    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [target.name]: value });
    }
    /* 
        Function : handleSubmit
    
        Syntax  : handleSubmit(event)
        
        Input   : event :  the event calling the function
    
        Description : 
            call the function changeTileActivity from parent with in parameters the values of the fieldset 
           
        Authore : Hugo KELHETTER
    */
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.selectActivity != null) {
            this.props.changeTileActivity(this.props.actions[this.state.selectActivity], this.state.checkbox)
        }
    }
    /* 
        Function : render
    
        Syntax  : render()
            
        Description : display the form to change tile/subBasin's activityy
           
        Authore : Hugo KELHETTER
    */
    render() {
        console.log(this.props)
        return (
            < form onSubmit={this.handleSubmit} >
                <FormLabel>
                    Choisissez votre nouvelle activité pour
                    {this.state.checkbox ? ' le sous bassin'
                        : ` la case ${this.props.selectedTile.subId}`}
                </FormLabel >
                <Select name="selectActivity" onChange={this.handleChange} value={this.state.selectActivity}>
                    {/* display all possible action for selected tile */}
                    {this.props.actions.map((action, i) =>
                        <option key={i} value={i}>{action.Pratique}</option>,

                    )}
                    {/*  {this.props.selectedTile.activity === "1" ? "" : <option value="1">vigne</option>}
                        {this.props.selectedTile.activity === "2" ? "" : <option value="2">blé</option>}
                        {this.props.selectedTile.activity === "3" ? "" : <option value="3">bovins</option>} */}
                </Select>


                <br />

                <FormLabel>modifer toutes les cases
                        {this.createCheckbox("checkbox")}
                </FormLabel>


                <input type="submit" value="Envoyer" class="btn btn-primary" />
            </form >
        );
    }
}

export default ActivitySwapper
