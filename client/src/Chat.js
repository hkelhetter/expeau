/* 
    Function : constructor

    Syntax  : constructor(props)
        
    Input   : props : function and data passed by parent when calling component

    Description : create the component Chat and initialize its props/state 
        
*/
/* 
    Function : shouldComponentUpdate

    Syntax  : shouldComponentUpdate(nextPros,nextState)
        
    Input   : nextPros : not used but mandatory
            : nextState : the new value of state
        
    Outputs : boolean

    Description : the component only updates if the state changes
        
*/
/* 
    Function : handleSubmit

    Syntax  : handleSubmit(e)
        
    Input   : e : event calling the function
    
    Description : 
        update this.state.message by adding a new value to the object containing a string and author's id
        this.state.textValue is set to ""
*/
/* 
    Function : updateText 

    Syntax  : updateText(e)
        
    Input   : e : the value of the event calling the function
        
    Description : update this.state.textValue based on the pressed key
        
*/
/* 
    Function : scrollToBottom

    Syntax  : scrollToBottom()
    
    Description : focus on the bottom of the chat
        
*/
/* 
    Function : handleClick

    Syntax  : handleClick()

    Description : display or next the chat
        
*/
/* 
    Function : render

    Syntax  : render()
        
    Description : display a chat + a button to make it visible or not
        
*/
import React from 'react'
import { socket } from './context/socket'

export default class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = { textValue: "", message: [], inConvo: false, show: true }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.lastMessage = React.createRef()
        this.handleClick = this.handleClick.bind(this)
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState
    }
    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.textValue) return
        const newMessage = { msg: this.state.textValue, authore: this.props.authore }
        this.setState({
            message: this.addMessage(newMessage),
            textValue: ""
        })


    }
    addMessage(newMessage) {
        return [...this.state.message, newMessage]
    }
    updateText(e) {
        this.setState({ textValue: e })
    }
    componentDidMount() {
        this.scrollToBottom()
        socket.on("receiveMessage", (data) => {
            this.setState({ message: [...this.state.message, { msg: this.state.textValue, authore: this.props.authore }] })
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.message.length != this.state.message.length ||
            prevState.show != this.state.show) this.scrollToBottom()

    }
    scrollToBottom() {
        this.lastMessage?.current?.scrollIntoView({ behavior: 'smooth' })
    }
    handleClick() {
        this.setState({ show: !this.state.show })
    }
    render() {
        return (
            <div className="chat">
                <>
                    <div className="convo">
                        {this.state.message.map((msg, i) =>
                            <div key={i} className={`message ${msg.authore !== this.props.authore ? "" : "received"}`}>
                                <p className="msg"> {msg.msg}</p>
                                <p className="authore">{msg.authore === this.props.authore ? "Vous" : this.state.authore?.name}</p>
                            </div>

                        )}
                        {/* empty div to focus on with scrollToBottom */}
                        <div className="dummy" ref={this.lastMessage}></div>
                    </div>
                    <div className="submit">
                        <form onSubmit={this.handleSubmit} >
                            <fieldset disabled={this.state.inConvo}>
                                <input id="inputChat" value={this.state.textValue} onChange={e => this.updateText(e.target.value)} />
                                <input type="submit"></input>
                            </fieldset>
                        </form>
                    </div>
                </>


            </div>
        );
    }
}
