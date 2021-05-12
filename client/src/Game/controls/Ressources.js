import React from 'react'
class Ressources extends React.Component {
    render() {
        return (
            <>
                <p>UT : {this.props.ressources.ut}  (-{this.props.cost.ut})</p>
                <p>UB : {this.props.ressources.ub}  (-{this.props.cost.ub})</p>
            </>
        );
    }
}
export default Ressources