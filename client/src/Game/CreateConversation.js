import React from 'react'
export default class CreateConversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { convoName: "" }
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
        this.setState({ [target.name]: value });
    }
    /* 
    Function : handleSubmit
        
    Description : call addConvo from parent with current state as parameters        
*/
    handleSubmit(e) {
        e.preventDefault();
        if (this.props.addConvo(this.state)) {
            this.setState({ convoName: "" })
        }
    }
    /* 
        Function : render
            
        Description : display a form to create a conversation with other players
            
    */
    render() {
        console.log(this.state)
        return (
            <div id="createConvo">
                <form >
                    <input key="convoName" name="convoName" autoComplete="off" value={this.state.convoName} onChange={this.handleChange}></input>
                    {this.props.lstPlayer.map((player, i) =>
                        <label key={i}>{player.Name}
                            <input name={player.Name} type="checkbox" onChange={this.handleChange}></input>
                        </label>
                    )}
                    <input key="submit" type="submit" onClick={this.handleSubmit}></input>
                </form>
            </div>
        );
    }
}