import React from 'react'
import PropTypes from 'prop-types';

export default class CreateConversation extends React.Component {
    /* 
        Input : props={lstPlayer,addConvo,name}
                lstPlayer : object : list of all the players
                addConvo : func : create a new convo from parent component
                name : name of the player

        Syntax : <CreateConversation lstPlayer={lstPlayer} addConvo={this.addConvo} name={name} />

    */
    constructor(props) {
        super(props);
        let lstPlayer = {}
        for (const player in this.props.lstPlayer) {
            if (this.props.lstPlayer[player].Name != this.props.name) lstPlayer[this.props.lstPlayer[player].Name] = false
        }
        this.state = { convoName: "", lstPlayer }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    static propTypes = {
        lstPlayer: PropTypes.object.isRequired,
        addConvo: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired
    }
    /* 
        Function : handleChange
    
        Description : update checkboxs state   
        
        Authore : Hugo KELHETTER
    */
    handleChange(event) {
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value.replace(/[\[\].,\/#!$%\^&\*\\\";:{}=\-_`~()]/g, "");
        if (target.type === 'checkbox') this.setState({ ...this.state.lstPlayer[target.name] = value });
        else this.setState({ [target.name]: value });
    }
    /* 
    Function : handleSubmit
        
    Description : call addConvo from parent with current state as parameters       
    
    Authore : Hugo KELHETTER
*/
    handleSubmit(e) {
        e.preventDefault();
        if (this.props.addConvo(this.state)) {
            this.setState({ convoName: "" })
            for (const key in this.state.lstPlayer) {
                if (key != "convoName") {
                    this.setState({ ...this.state.lstPlayer[key] = false })
                }
            }
            this.unCheck()
        }
    }
    unCheck() {
        var x = document.getElementsByClassName("checkboxConvo");
        for (let i = 0; i < x.length; i++) {
            x[i].value = false;
        }
    }
    /* 
        Function : render
            
        Description : display a form to create a conversation with other players
        
        Authore : Hugo KELHETTER
    */
    render() {
        return (
            <div id="createConvo">
                <form >
                    Choisissez un nom, sélectionnez des joueurs et créez une salle de discussion
                    <input key="convoName" name="convoName" autoComplete="off" value={this.state.convoName} onChange={this.handleChange}></input>
                    {Object.keys(this.state.lstPlayer).map((player, i) =>
                        [<br />
                            , <label key={i}>{player}
                            <input name={player} className="checkbox" type="checkbox" checked={this.state.lstPlayer[player]} onChange={this.handleChange}></input>
                        </label>]
                    )}
                    <br />
                    <input className="checkboxConvo" key="submit" type="submit" onClick={this.handleSubmit}></input>
                </form>
            </div>
        );
    }
}