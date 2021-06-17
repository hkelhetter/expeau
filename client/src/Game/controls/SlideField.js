import Slider from '@material-ui/core/Slider';
import React from "react"
import { socket } from "../../socket.js"
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button, DialogActions, DialogContent } from '@material-ui/core';
export default class SlideField extends React.Component {
    constructor(props) {
        super(props)
        this.state = { value: 0 }
    }
    /* 
        Function : handleSubmit

        Syntax  : handleSubmit
                                
        Description : send the form data to the server

        Author : Hugo KELHETTER
        
    */
    handleSubmit = () => {
        console.log("Sat", this.state.value);
        socket.emit("satisfaction", this.state.value)
        console.log(this.state.value)
        this.props.displayDiary()
        this.setState({ slider: 0 })
    }
    componentDidMount() {
        socket.on("form", () => { this.setState({ open: true }) })
    }
    handleChange = (value, newValue) => {
        this.setState({ value: newValue });
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
    /* updates the slider's value on change */
    //handleChange = (event, value) => { this.setState({ slider: value }) }
    /* 
        Function : render

        Syntax  : render
        
        Description : display a slider in a popup

        Author : Hugo KELHETTER
        
    */
    render() {
        return (
            <div id="slider">

                <Dialog
                    open={true}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                >
                    <DialogTitle>Quel est votre recenti {this.props.name} ?</DialogTitle>
                    <DialogContent>
                        <Slider
                            //getAriaValueText={valuetext}
                            name="slider"
                            aria-labelledby="discrete-slider-custom"
                            step={1}
                            value={this.state.value}
                            marks={this.marks}
                            min={-2}
                            max={2}
                            valueLabelDisplay="off"
                            onChange={this.handleChange}

                        />
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={this.handleSubmit}>Valider</Button>

                    </DialogActions>
                </Dialog>
            </div>

        );
    }
}

