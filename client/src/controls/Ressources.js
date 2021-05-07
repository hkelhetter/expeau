import React from 'react'
class Ressources extends React.Component {
    render() {
        return (
            <>
                <p>UT : {this.props.ressources.ut}</p>
                <p>UB : {this.props.ressources.ub}</p>
            </>
        );
    }
}
export default Ressources