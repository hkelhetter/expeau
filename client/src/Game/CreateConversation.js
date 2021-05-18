import React from 'react'
export default class CreateConversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { convoName: "" }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [target.name]: value });
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.addConvo(this.state)
        /*  e.preventDefault()
         if (this.state.convoName.length == 0) return
         console.log(this.state.lstConvo)
         for (const entry in this.state.lstConvo) {
             console.log(entry, this.state.convoName)
 
             if (entry == this.state.convoName) {
                 alert("nom déjà pris")
                 return
             }
         }
         let newConvo = []
         const name = this.state.convoName
         for (const entry in this.state) {
             if (!(entry == "convoName" || entry == "lstConvo")) {
                 if (this.state[entry]) newConvo.push(entry)
             }
         }
         if (newConvo.length > 0) {
             this.setState({ lstConvo: { ...this.state.lstConvo, [name]: newConvo } })
         }
         console.log(this.state) */
    }
    render() {
        return (
            <div id="createConvo">
                <form >
                    <input key="convoName" name="convoName" value={this.state.convoName} onChange={this.handleChange}></input>
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