import Checkbox from '@material-ui/core/Checkbox';
/* 
    Function : createCheckbox

    Syntax  : createCheckbox(name)

    Input : name : the chekbox's name. it will link the checkbox to the parent's state

    Output :  checkbox=<CheckBox>
                            
    Description : return a checkbox with a set a predefined options

    Author : Hugo KELHETTER
    
*/
function createCheckbox(name) {
    return <Checkbox
        onChange={this.handleChange}
        name={name}
        color="primary"
        checked={this.state[name]}
    />
}
export default createCheckbox