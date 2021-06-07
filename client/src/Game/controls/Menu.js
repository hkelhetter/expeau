import React from 'react'
export default class Menu extends React.Component {
    render() {
        return (
            <div id="controls">
                {this.props.role}
                {this.props.id}
                {this.props.children}
            </div>
        );
    }
}