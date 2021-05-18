import React from 'react'
class Ressources extends React.Component {
    render() {
        let ub = 0
        let ut = 0
        Object.values(this.props.cost).map((entry) => {
            ub += entry.ub
            ut += entry.ut
        })
        return (
            <>
                <p>UT : {this.props.ressources.ut}  (-{ut})</p>
                <p>UB : {this.props.ressources.ub}  (-{ub})</p>
            </>
        );
    }
}
export default Ressources