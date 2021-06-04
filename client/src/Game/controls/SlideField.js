import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import React from "react"
import { socket } from "../../socket.js"
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

export default class SlideField extends React.Component {
    constructor(props) {
        super(props)
        this.state = { slider: 0, open: false }
    }
    handleSubmit = () => {
        console.log(this.state.slider)
        socket.emit("satisfaction", this.state.value)
        this.setState({ open: false, slider: 0 })
    }
    componentDidMount() {
        socket.on("form", () => { this.setState({ open: true }) })
    }
    marks = [
        {
            value: -2,
            label: '😢',
        },
        {
            value: -1,
            label: '😟',
        },
        {
            value: 0,
            label: '😐',
        },
        {
            value: 1,
            label: '🙂',
        },
        {
            value: 2,
            label: '😊'
        }
    ];
    handleChange = (event, value) => { this.setState({ slider: value }) }
    render() {
        return (
            <Dialog open={this.state.open} disableBackdropClick
                disableEscapeKeyDown fullWidth={true}>
                <DialogTitle>Votre ressenti</DialogTitle>
                <div id="slider">
                    <Slider
                        //getAriaValueText={valuetext}
                        name="slider"
                        aria-labelledby="discrete-slider-custom"
                        step={1}
                        value={this.state.slider}
                        marks={this.marks}
                        min={-2}
                        max={2}
                        valueLabelDisplay="off"
                        onChange={this.handleChange}
                    />
                </div>
                <button type="submit" class="btn btn-primary" data-testid="submit"
                    onClick={this.handleSubmit}>Valider
                </button>

            </Dialog>
        );
    }
}