import React, { Component } from "react";

export default class UserHome extends Component {
    render() {
        return ( 
            <div className="auth-inner">
                <h4>{`La URL para la compañia "${this.props.companyName}" es:`}</h4>
                <a href={`${process.env.REACT_APP_FRONTEND_URL}/enterprise/${this.props.companyId}`}>{`${process.env.REACT_APP_FRONTEND_URL}/enterprise/${this.props.companyId}`}</a>
            </div>
        );
    }
}