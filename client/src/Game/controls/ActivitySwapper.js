/* 
    Function : constructor

    Syntax  : constructor(props)
        
    Input   : props : function and data passed by parent when calling component

    Description : create the component ActivitySwapper and initialize its props/state 
        
*/
/* 
    Function : handleChange

    Syntax  : handleChange(event)
        
    Input   : event : the event calling the function
        
    Description : 
        function called when interacting with the form's components
        if the target is a checkBox, change its validation
        update the state value for the corresponding event target
*/
/* 
    Function : handleSubmit

    Syntax  : handleSubmit(event)
    
    Input   : event :  the event calling the function

    Description : 
        call the function changeTileActivity from parent with in parameters the values of the field set 
        
*/
/* 
    Function : 

    Syntax
        
    
    Input
        

    Outputs

    Description
        
*/
/* 
    Function : render

    Syntax  : render()
        
    Description : display the form to change tile/subBasin's activityy
        
*/
import React from 'react'
import { socket } from "../context/socket.js"
class ActivitySwapper extends React.Component {
    constructor(props) {
        super(props);
        /* 
            initialise la valeur du formulaire de changement d'activité
            si l'activité de la tuile vaut 1, la valeur vaut 2 sinon elle vaut 1
        */
        this.state = { selectActivity: 0, checkbox: false };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        const target = event.target;
        console.log(target.value)
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [target.name]: value });
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.selectActivity != null) {
            this.props.changeTileActivity(this.props.actions[this.state.selectActivity], this.state.checkbox)
        }
    }

    render() {
        console.log(this.props.selectedTile)
        return (
            < form onSubmit={this.handleSubmit} >
                <label>
                    <p>Choisissez votre nouvelle activité pour
                        {this.state.checkbox ? ' le sous bassin'
                            : ` la case ${this.props.selectedTile.id}`}
                    </p>
                    <select name="selectActivity" onChange={this.handleChange}>
                        {/* do not display the current tile's activity */}
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
