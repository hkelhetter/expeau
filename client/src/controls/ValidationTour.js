import React from 'react'

class ValidationTour extends React.Component {
    constructor(props) {
        super(props)
        this.state = { validated: false, props }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit() {
        this.setState({ validated: true })
    }
    render() {
        console.log(this.state.validated)

        return (
            <>
                {this.state.validated ? <p>Nombre de joueurs prêts : nb joueurs prêts/ nb joueurs totaux</p> :
                    <button onClick={this.handleSubmit}>Valider</button>}
            </>
        )
    }
}
export default ValidationTour