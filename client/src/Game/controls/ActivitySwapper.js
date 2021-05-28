import React from 'react'
import { socket } from "../../socket.js"
import PropTypes from 'prop-types';

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
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    static propTypes = {
        changeTileActivity: PropTypes.func.isRequired,
        selectedTile: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
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
    handleChange(event) {
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
    handleSubmit(event) {
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
        return (
            < form onSubmit={this.handleSubmit} >
                <label>
                    <p>Choisissez votre nouvelle activité pour
                        {this.state.checkbox ? ' le sous bassin'
                            : ` la case ${this.props.selectedTile.subId}`}
                    </p>
                    <select name="selectActivity" onChange={this.handleChange}>
                        {/* display all possible action for selected tile */}
                        {this.props.actions.map((action, i) =>
                            <option key={i} value={i}>{action.Pratique}</option>,
                        )}
                        {/*  {this.props.selectedTile.activity === "1" ? "" : <option value="1">vigne</option>}
                        {this.props.selectedTile.activity === "2" ? "" : <option value="2">blé</option>}
                        {this.props.selectedTile.activity === "3" ? "" : <option value="3">bovins</option>} */}
                    </select>
                </label>
                <br />
                <label>modifer toutes les cases
                        <input name="checkbox" type="checkbox" onChange={this.handleChange}></input>
                </label>
                <input type="submit" value="Envoyer" />
            </form >
        );
    }
}

export default ActivitySwapper
