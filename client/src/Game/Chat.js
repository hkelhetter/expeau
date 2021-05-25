import React from 'react'
import { socket } from './context/socket'

export default class Chat extends React.Component {
    /* 
        Function : constructor
    
        Syntax  : constructor(props)
            
        Input   : props : function and data passed by parent when calling component
    
        Description : create the component Chat and initialize its props/state 
            
    */
    constructor(props) {
        super(props)
        let messages = {}
        Object.keys(this.props.lstConvo).map((convo) =>
            messages[convo] = []
        )
        this.state = { textValue: "", convo: Object.keys(this.props.lstConvo)[0], messages, inConvo: false }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleConvoChange = this.handleConvoChange.bind(this)
        this.receiveMessage = this.receiveMessage.bind(this)
        this.lastMessage = React.createRef()
    }
    /* 
        Function : shouldComponentUpdate
    
        Description : the component only updates if the state changes
            
    */
    shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState || this.props.lstConvo !== nextProps.lstConvo
    }
    /* 
        Function : handleSubmit
    
        Syntax  : handleSubmit(e)
            
        Input   : e : event calling the function
        
        Description : 
            update this.state.messages by adding a new value to the object 
                containing conversation room's name a string and author's id
            this.state.textValue is set to ""
    */
    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.textValue) return
        const newMessage = { msg: this.state.textValue, authore: this.props.authore, convo: this.state.convo }
        let convo = this.state.convo
        this.setState({
            messages: this.addMessage(newMessage),
            textValue: ""
        })
        socket.emit("sendMessage", newMessage)

    }
    addMessage(newMessage) {
        let messages = this.state.messages
        messages[this.state.convo].push(newMessage)
        return messages
    }
    receiveMessage(newMessage) {
        let messages = this.state.messages
        const message = { msg: [newMessage.msg], authore: [newMessage.authore] }
        messages[newMessage.convo].push(message)
    }
    /* 
        Function : updateText 
    
        Syntax  : updateText(e)
            
        Input   : e : the value of the event calling the function
            
        Description : update this.state.textValue based on the pressed key
            
    */
    updateText(e) {
        this.setState({ textValue: e })
    }
    componentDidMount() {
        this.scrollToBottom()
        socket.on("receiveMessage", (data) => {
            this.setState({ message: this.addMessage(data) })
        })
    }
    componentDidUpdate(prevProps, prevState) {
        Object.keys(this.props.lstConvo).map((convo) => {
            if (this.state.messages[convo] == undefined) this.state.messages[convo] = []
        })
        if (prevState.messages[this.state.convo].length !== this.state.messages[this.state.convo].length) this.scrollToBottom()

    }
    componentWillUnmount() {
        socket.removeAllListeners()
    }
    /* 
        Function : scrollToBottom
    
        Syntax  : scrollToBottom()
        
        Description : focus on the bottom of the chat
            
    */
    scrollToBottom() {
        this.lastMessage?.current?.scrollIntoView({ behavior: 'smooth' })
    }
    /* 
        Function : handleConvoChange
            
        Description : set the active conversation
            
    */
    handleConvoChange(event) {
        this.setState({ convo: event.target.value })
    }
    /* 
        Function : render
    
        Syntax  : render()
            
        Description : display a chat + available conversations
            
    */
    render() {
        return (
            <div className="chat">
                <>
                    <div id="convoChoice">

                        <select name="convoSelect" onChange={this.handleConvoChange}>
                            {Object.keys(this.props.lstConvo).map((convo) =>
                                <option key={convo} >{convo}</option>
                            )}
                        </select>
                    </div>
                    <div className="convo">
                        {Object.values(this.state.messages[this.state.convo]).map((msg, i) =>
                            <div key={i} className={`message ${msg.authore == this.props.authore ? "" : "received"}`}>
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
                                <input id="inputChat" autoComplete="off" value={this.state.textValue} onChange={e => this.updateText(e.target.value)} />
                                <input type="submit"></input>
                            </fieldset>
                        </form>
                    </div>
                </>


            </div>
        );
    }
}
