import React from 'react'
import PropTypes from 'prop-types';
import Select from 'react-select'
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
        let lstPlayer = []
        for (const player in this.props.lstPlayer) {
            if (this.props.lstPlayer[player].Name != this.props.name) lstPlayer[this.props.lstPlayer[player].Name] = false
        }
        this.state = { convoName: "", lstPlayer, selectedPlayers: null }
        for (const player in this.props.lstPlayer) {
            lstPlayer.push({
                value: player, label
                    : this.props.lstPlayer[player].Name
            })


        }
        //this.handleChange = this.handleChange.bind(this)
        //this.handleSubmit = this.handleSubmit.bind(this)
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

    /* 
    Function : handleSubmit
        
    Description : call addConvo from parent with current state as parameters       
    
    Authore : Hugo KELHETTER
*/
    handleSubmit = (e) => {
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
    handleChange = (newValue, actionMeta) => {
        this.setState({ selectedPlayers: newValue })
    };
    handleInputChange = (inputValue, actionMeta) => {
        /*   console.group('Input Changed');
          console.log(inputValue);
          console.log(`action: ${actionMeta.action}`);
          console.groupEnd();
          this.setState({ selectedPlayers: inputValue }) */
    };
    render() {
        return (
            <div id="createConvo">
                <Select
                    placeholder="s??lectionnez les membres de la conversation"
                    closeMenuOnSelect={false}
                    isMulti
                    name="colors"
                    options={this.state.lstPlayer}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={this.handleChange}
                    onInputChange={this.handleInputChange}
                />
                <input className="checkboxConvo" key="submit" type="submit" onClick={this.handleSubmit}></input>

                {/*   <form >
                    Choisissez un nom, s??lectionnez des joueurs et cr??ez une salle de discussion
                    <input key="convoName" name="convoName" autoComplete="off" value={this.state.convoName} onChange={this.handleChange}></input>
                    {Object.keys(this.state.lstPlayer).map((player, i) =>
                        [<br />
                            , <label key={i}>{player}
                            <input name={player} className="checkbox" type="checkbox" checked={this.state.lstPlayer[player]} onChange={this.handleChange}></input>
                        </label>]
                    )}
                    <br />
                </form> */}
            </div>
        );
    }
}