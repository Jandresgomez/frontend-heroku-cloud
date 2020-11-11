//import axios from 'axios';
import { Redirect } from "react-router-dom"
import React, { Component } from "react";
import LoadingAnimation from "../helpers/loading-animation.component";
import axios from 'axios';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLoginComplete: false,
            isLoading: false,
        }
    }

    fetchCompanyData = (token) => {
        var self = this;

        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/enterprise-users/my-company-info/`,
        {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type':  'application/json',
                'Accept': 'application/json',          
            }
        }
        )
        .then(res => {
            this.props.submitUserData(res.data.company_name, res.data.company_id);
            self.setState({
                isLoading: false,
                isLoginComplete: true
            });
        }).catch(error => {
            self.setState({
                isLoading: false,
            });
            console.log(error);
        })
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value    
        });
    }

    handleSubmit = () => {
        this.setState({
            isLoading: true
        });

        const authData = new FormData();
        authData.set('username', this.state.email);
        authData.set('password', this.state.password);

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/enterprise-users/login/`, 
        authData,
        { 
            headers: {
                'Content-Type': 'application/json', 
            }
        }
        )
        .then(res => {
            this.props.submitToken(res.data.token);
            this.fetchCompanyData(res.data.token);
        }).catch(error => {
            this.setState({
                isLoading: false,
            })
            console.log(error);
        })
    }

    drawLogin() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Sign In</h1>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" name="email" value={this.state.email} className="form-control" placeholder="Enter email" onChange={(event) => this.handleChange(event)} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={this.state.password} className="form-control" placeholder="Enter password" onChange={(event) => this.handleChange(event)} />
                </div>
                <button className="btn btn-primary btn-block" onClick={() => this.handleSubmit()}>Submit</button>
            </form>
        )
    }

    render() {
        if (this.state.isLoginComplete) {
            return(<Redirect to='/user-home'/>)
        } else {
            if (this.state.isLoading) {
                return (
                    <div className="auth-inner">
                        {LoadingAnimation()}
                    </div>
                )
            } else {
                return (
                    <div className="auth-inner">
                        {this.drawLogin()}   
                    </div>
                );   
            }
        }
    }
}