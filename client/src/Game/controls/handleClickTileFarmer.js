/* 
    Function : handleClickTile

    Syntax  : handleClickTile(h)
        
    Input   : h : data of the selectedTile
        
    Description : 
        change the state of selectedTile based on which tile is clicked and the current state
        if the current state's id is equal to h's id, the state is set to null
        else it is updated to h's data     
        
    Author : Hugo KELHETTER
*/
function handleClickTile(h) {
    if (h.props.id === this.state.selectedTile?.id) {
        this.setState({ selectedTile: null })
    }
    else {
        this.setState({ selectedTile: h.props })
    }
}
export default handleClickTile