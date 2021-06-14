import Slider from '@material-ui/core/Slider';
import React from "react"
import { socket } from "../../socket.js"
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

export default class SlideField extends React.Component {
    constructor(props) {
        super(props)
        this.state = { slider: 0 }
    }
    /* 
        Function : handleSubmit

        Syntax  : handleSubmit
                                
        Description : send the form data to the server

        Author : Hugo KELHETTER
        
    */
    /*     handleSubmit = () => {
            socket.emit("satisfaction", this.state.value)
            this.setState({ slider: 0 })
        }
        componentDidMount() {
            socket.on("form", () => { this.setState({ open: true }) })
        } */

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
    /* updates the slider's value on change */
    //handleChange = (event, value) => { this.setState({ slider: value }) }
    /* 
        Function : render

        Syntax  : render
        
        Description : display a slider in a popup

        Author : Hugo KELHETTER
        
    */
    render() {
        console.log(this.props)
        return (
            <div id="slider">
                <Slider
                    //getAriaValueText={valuetext}
                    name="slider"
                    aria-labelledby="discrete-slider-custom"
                    step={1}
                    value={this.props.value}
                    marks={this.marks}
                    min={-2}
                    max={2}
                    valueLabelDisplay="off"
                    onChange={this.props.handleChange}
                />
            </div>
        );
    }
}