import React from 'react'
import emojis from './emojis.js'

class InfoYear extends React.Component {
    render() {
        return (
            <>
                <p>ANNEE {this.props.year}</p>
            </>
        );
    }
}