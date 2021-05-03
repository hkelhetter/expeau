import React from 'react'

export default class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = { textValue: "", message: [], inConvo: false, show: true }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.lastMessage = React.createRef()
        this.handleClick = this.handleClick.bind(this)
    }
    // ne lance le render que lors d'un changement du state
    shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState
    }
    /* créé un nouveau message et vide la zone de texte */
    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.textValue) return
        this.setState({
            message: [...this.state.message, { msg: this.state.textValue, authore: this.props.authore }],
            textValue: ""
        })
    }
    /* met à jour la zone de texte */
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
        this.lastMessage?.current?.scrollIntoView({ behavior: 'smooth' })
    }
    handleClick() {
        this.setState({ show: !this.state.show })
    }
    render() {
        console.log(this.state.show)
        return (
            <div className="chat">
                <button onClick={this.handleClick} >{this.state.show ? 'afficher chat' : 'cacher chat'}</button>
                {this.state.show ? <>
                    <div className="convo">
                        {this.state.message.map((msg, i) =>
                            <>
                                <div key={i} className={`message ${msg.authore !== this.props.authore ? "" : "received"}`}>
                                    <p className="msg"> {msg.msg}</p>
                                    <p className="authore">{msg.authore === this.props.authore ? "Vous" : this.state.authore?.name}</p>
                                </div>
                            </>
                        )}
                        {/* div vide pour avoir le focus sur le dernier message */}
                        <div className="dummy" ref={this.lastMessage}></div>
                    </div>
                    <div className="submit">
                        <form onSubmit={this.handleSubmit} >
                            <fieldset disabled={this.state.inConvo}>

                                <input value={this.state.textValue} onChange={e => this.updateText(e.target.value)} />
                                <input type="submit"></input>
                            </fieldset>
                        </form>
                    </div></> : ""}


            </div>
        );
    }
}