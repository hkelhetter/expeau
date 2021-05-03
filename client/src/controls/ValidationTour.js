import React from 'react'

class ValidationTour extends React.Component {
    constructor(props) {
        super(props)
        this.state = { validated: false, props }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit() {
        const origin = this.props.origin
        const updated = this.props.updated
        console.log(origin[0], updated[0])

        this.setState({ validated: true })
        let log = {}
        for (const index in origin) {
            let subLog = {}
            for (const entry in origin[index]) {
                //origin[index].activity === updated[index].activity ? subLog.activity = updated[index].activity : subLog.activity = ""
                if (origin[index][entry] !== updated[index][entry]) subLog.activity = updated[index][entry]

            }
            if (Object.entries(subLog).length !== 0) log[index] = subLog

        }
    }

    render() {

        return (
            <>
                {this.state.validated ? <p>Nombre de joueurs prêts : nb joueurs prêts/ nb joueurs totaux</p> :
                    <button onClick={this.handleSubmit}>Valider</button>}
            </>
        )
    }
}
export default ValidationTour