import React from 'react'
export default class Menu extends React.Component {
    render() {
        console.log(this.props)
        return (
            <div id="controls">
                {this.props.children}
            </div>
        );
    }
}