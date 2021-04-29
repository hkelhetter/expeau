import React from 'react'

export default class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = { textValue: "", message: [] }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.lastMessage = React.createRef()
    }
    // ne lance le render que lors d'un changement du state
    shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState
    }
    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.textValue) return
        this.setState({
            message: [...this.state.message, { msg: this.state.textValue, authore: this.props.authore }],
            textValue: ""
        })
    }
    updateText(e) {
        this.setState({ textValue: e })
    }
    componentDidMount() {
        this.scrollToBottom()
    }
    componentDidUpdate() {
        this.scrollToBottom()
    }
    /* descend jusqu'au dernier message reçu ou envoyé */
    scrollToBottom() {
        this.lastMessage.current.scrollIntoView({ behavior: 'smooth' })
    }
    render() {
        return (
            <div className="chat">
                <div className="convo">
                    {this.state.message.map((msg, i) => <>

                        <div key={i} className={`message ${msg.authore === this.props.authore ? "" : "received"}`}>
                            <p className="msg"> {msg.msg}</p>
                            <p className="authore">{msg.authore === this.props.authore ? "Vous" : this.state.authore}</p>
                        </div>
                    </>
                    )}
                    {/* div vide pour avoir le focus sur le dernier message */}
                    <div className="dummy" ref={this.lastMessage}></div>

                </div>

                <div className="submit">
                    <form onSubmit={this.handleSubmit}>
                        <input type="textarea" value={this.state.textValue} onChange={e => this.updateText(e.target.value)} />
                        <input type="submit"></input>
                    </form>
                </div>

            </div>
        );
    }
}