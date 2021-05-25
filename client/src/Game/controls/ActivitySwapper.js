
/* 
    Function : 

    Syntax
        
    
    Input
        

    Outputs

    Description
        
*/

import React from 'react'
import { socket } from "../context/socket.js"
class ActivitySwapper extends React.Component {
    /* 
        Function : constructor
    
        Syntax  : constructor(props)
            
        Input   : props : function and data passed by parent when calling component
    
        Description : create the component ActivitySwapper and initialize its props/state 
            
    */
    constructor(props) {
        super(props);
        this.state = { selectActivity: 0, checkbox: false };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    /* 
        Function : handleChange
    
        Syntax  : handleChange(event)
            
        Input   : event : the event calling the function
            
        Description : 
            function called when interacting with the form's components
            if the target is a checkBox, change its validation
            update the state value for the corresponding event target
    */
    handleChange(event) {
        const target = event.target;
        console.log(target.value)
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [target.name]: value });
    }
    /* 
        Function : handleSubmit
    
        Syntax  : handleSubmit(event)
        
        Input   : event :  the event calling the function
    
        Description : 
            call the function changeTileActivity from parent with in parameters the values of the fieldset 
            
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
            
    */
    render() {
        console.log(this.props.selectedTile)
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
