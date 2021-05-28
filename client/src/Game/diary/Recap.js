import React from 'react'
import { Button } from '@material-ui/core';
export default class Recap extends React.Component {
    render() {
        return (
            <>
                <Button id="btnRecap" onClick={this.props.hideRecap}>cacher le récap</Button>
            </>
        );
    }
}