import React from 'react'
export default class CreateConversation extends React.Component {
    constructor(props) {
        super(props);

        let lstPlayer = {}
        for (const player in this.props.lstPlayer) {
            lstPlayer[this.props.lstPlayer[player].Name] = false
        }
        this.state = { convoName: "", lstPlayer }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    /* 
        Function : handleChange
    
        Description : update checkboxs state        
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
            
    */
    render() {
        return (
            <div id="createConvo">
                <form >
                    <input key="convoName" name="convoName" autoComplete="off" value={this.state.convoName} onChange={this.handleChange}></input>
                    {this.props.lstPlayer.map((player, i) =>
                        <label key={i}>{player.Name}
                            <input name={player.Name} className="checkbox" type="checkbox" checked={this.state.lstPlayer[player.Name]} onChange={this.handleChange}></input>
                        </label>
                    )}
                    <input className="checkboxConvo" key="submit" type="submit" onClick={this.handleSubmit}></input>
                </form>
            </div>
        );
    }
}