import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import React from 'react'
export default class ConfirmDialog extends React.Component {
    constructor(props) {
        super(props)
    }

    handleConfirmer
    render() {
        return (
            <Dialog
                open={true}
                disableBackdropClick
                disableEscapeKeyDown
            >
                <DialogContent>
                    <DialogContentText>
                        Etes-vous sûre de vouloire faire l'action suivante : {this.props.action}
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={this.props.cancel} color="primary">annuler</Button>
                        <Button onClick={this.props.confirm} color="primary">confirmer</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        )
    }
}