import Checkbox from '@material-ui/core/Checkbox';

function createCheckbox(name) {
    return <Checkbox
        onChange={this.handleChange}
        name={name}
        color="primary"
        checked={this.state[name]}
        disabled={this.props.selectedTile[name]}
    />
}
export default createCheckbox