import React from 'react'
import Recap from './Recap.js'
import { Button } from '@material-ui/core';
export default class Diary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { show: false }
        this.displayRecap = this.displayRecap.bind(this)
        this.hideRecap = this.hideRecap.bind(this)
    }
    displayRecap() {
        this.setState({ show: true })
    }
    hideRecap() {
        this.setState({ show: false })
    }
    render() {

        return (
            <>
                {this.state.show ?
                    <div className="pop">
                        <Recap hideRecap={this.hideRecap} />
                    </div>
                    : ""}
                <Button onClick={this.displayRecap}>afficher le récap</Button>
            </>
        );
    }
}