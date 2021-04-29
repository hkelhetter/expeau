
import React from 'react'

class InfoTile extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <>
                <p>Production {this.props.production}</p>
                <p>Bien être {this.props.bienEtre}</p>
                <p>Qualité de l'eau {this.props.qualite}</p>
                <p>Quantité d'eau {this.props.quantite}</p>
            </>
        )
    }
}
export default InfoTile