import React from 'react'
import PropTypes from 'prop-types';
class Ressources extends React.Component {
    /* 
        Input : props={ressources:{ut,ub},cost:{ut,ub}}
                ressources : object : ut/ub : the player's ressources
                cost : object : ut/ub : estimation of the reduction of ressources
            
        Syntax : <Ressources ressources={ut,ub} cost={ut,ub} /> 
    */
    static propTypes = {
        cost: PropTypes.object.isRequired,
        ressources: PropTypes.object.isRequired
    }
    /* 
        Function : render
    
        Syntax  : render()
            
        Description : display the available ressources and an estimated cost of the actions
        
        Author : Hugo KELHETTER      
    */
    render() {
        let ub = 0
        let ut = 0
        Object.values(this.props.cost).forEach(entry => {
            ub += entry.ub
            ut += entry.ut
        })
        return (
            <p>UT : {this.props.ressources.ut}  (-{ut}) | UB : {this.props.ressources.ub}  (-{ub})</p>
        );
    }
}
export default Ressources