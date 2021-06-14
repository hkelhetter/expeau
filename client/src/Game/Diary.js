import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SlideField from './controls/SlideField';
import { socket } from '../socket';
export default class ScrollDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { slider: 0 }
    }
    handleChange = (event, value) => {
        this.setState({ slider: value })
    }
    handleClose = () => {
        socket.emit("satisfaction", this.state.slider);
        this.setState({ slider: 0 })
        this.props.closeDiary()
    }
    render() {
        return (
            <div>
                <Dialog
                    fullScreen
                    open={true}
                    scroll="paper"
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                >
                    <DialogTitle id="scroll-dialog-title">Que s'est-il passé ?</DialogTitle>
                    <DialogContent dividers='paper'>
                        <DialogContentText
                            id="scroll-dialog-description"
                            tabIndex={-1}
                        >
                            <img src={this.props.data} width="100%" alt="" />
                        </DialogContentText>
                    </DialogContent>
                    <DialogTitle>Quel est votre recenti ?</DialogTitle>
                    <SlideField value={this.state.slider} handleChange={this.handleChange} />
                    <DialogActions>
                        <Button onClick={this.props.closeDiary} color="primary">
                            Valider
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        );
    }
}
