import React from 'react'
import Recap from './Recap.js'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { Button } from '@material-ui/core';
export default class Diary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { show: false }
    }
    render() {
        return (
            <>
                <Dialog
                    scroll="paper"
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                >
                    <DialogTitle id="scroll-dialog-title">Récapitulatif</DialogTitle>
                    <DialogContent dividers="paper">
                        <img src={this.props.data} />
                    </DialogContent>
                </Dialog>
            </>
        )
    }
}