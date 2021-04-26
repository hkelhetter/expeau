/* 
    fonction déclenchée lorsqu'on clique sur une tuile
    modifie le state pour que selectedTile corresponde à l'id de la tuile et selectedTileActivity à son activité
    si la tuile cliquée était déjà celle sélectionnée, selectedTile vaut null
*/
function handleClickTile(h) {

    /* 
        le point d'interrogation permet de vérifier que le champ "seledtedTile" existe 
        avant d'essayer de récupérer le champ id 
    */
    if (h.props.id === this.state.selectedTile?.id) {
        this.setState({ selectedTile: null })

    }
    else {
        /*             
            this.setState({ selectedTileActivity: h.props.activity })
            this.setState({ selectedTile: h.props.id }); 
        */
        this.setState({ selectedTile: h.props })
    }
}
export default handleClickTile