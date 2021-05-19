import React from 'react'
class Ressources extends React.Component {
    /* 
        Function : render
    
        Syntax  : render()
            
        Description : display the available ressources and an estimated cost of the actions
            
    */
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