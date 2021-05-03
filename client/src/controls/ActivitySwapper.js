import React from 'react'

class ActivitySwapper extends React.Component {
    constructor(props) {
        super(props);
        /* 
            initialise la valeur du formulaire de changement d'activité
            si l'activité de la tuile vaut 1, la valeur vaut 2 sinon elle vaut 1
        */
        this.state = { selectActivity: this.props.selectedTile.activity === "1" ? "2" : "1", checkbox: false };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    /* handler mettant à jour dans le state les différents composants du formulaire */
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [target.name]: value });
    }
    /* 
        évènement enclanché lors de l'envoie du formulaire
        appel de la fonction changeTileActivity du parent avec en paramètre la nouvelle valeur de l'activité
    */
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.selectActivity != null) {
            this.props.changeTileActivity(this.state.selectActivity, this.state.checkbox)
        }
    }

    render() {
        return (
            < form onSubmit={this.handleSubmit} >
                <label>
                    <p>Choisissez votre nouvelle activité pour
                        {this.state.checkbox ? ' le sous bassin'
                            : ` la case ${this.props.selectedTile.id + 1}`}
                    </p>

                    <select name="selectActivity" onChange={this.handleChange}>
                        {/* ne propose pas l'activité déjà exercée sur la tuile */}
                        {this.props.selectedTile.activity === "1" ? "" : <option value="1">vigne</option>}
                        {this.props.selectedTile.activity === "2" ? "" : <option value="2">blé</option>}
                        {this.props.selectedTile.activity === "3" ? "" : <option value="3">bovins</option>}
                    </select>
                </label>

                <label>modifer toutes les cases
                        <input name="checkbox" type="checkbox" onChange={this.handleChange}></input>
                </label>
                <input type="submit" value="Envoyer" />
            </form >
        );
    }
}

export default ActivitySwapper
