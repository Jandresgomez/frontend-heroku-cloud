import { Redirect } from "react-router-dom"
import axios from 'axios';
import React, { Component } from "react";
import LoadingAnimation from "../helpers/loading-animation.component";

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company_name: "",
            email: "",
            password: "",
            password_confirmation: "",
            isLoading: false,
            isSignUpComplete: false,
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value    
        });
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
                isSignUpComplete: true
            });
        }).catch(error => {
            self.setState({
                isLoading: false,
            });
            console.log(error);
        })
    }

    handleSubmit = () => {
        this.setState({
            isLoading: true
        });
    
        const user = {
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation,
            company_name: this.state.company_name,
        }

        const authData = new FormData();
        authData.set('username', this.state.email);
        authData.set('password', this.state.password);

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/enterprise-users/`, 
        user,
        { 
            headers: {
                'Content-Type': 'application/json', 
            }
        }
        )
        .then(res => {
            console.log(res);
            console.log(res.data);
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/enterprise-users/login/`,
            authData,
            {
                headers:{
                    'Content-Type': 'multipart/form-data',
                }
            })
            .then(res => {
                this.props.submitToken(res.data.token);
                this.fetchCompanyData(res.data.token);
            }).catch(error => {
                this.setState({
                    isLoading: false,
                })
                console.log(error);
            })
        }).catch(error => {
            this.setState({
                isLoading: false,
            })
            console.log(error);
        })
    }

    drawSignUp() {
        return(
            <form onSubmit={this.handleSubmit}>
                    <h3>Sign Up</h3>

                    <div className="form-group">
                        <label>Nombre de la empresa</label>
                        <input type="text" name="company_name" value={this.state.company_name} className="form-control" placeholder="Enter company name" onChange={(event) => this.handleChange(event)}/>
                    </div>

                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" name="email" value={this.state.email} className="form-control" placeholder="Enter email" onChange={(event) => this.handleChange(event)}/>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={this.state.password} className="form-control" placeholder="Enter password" onChange={(event) => this.handleChange(event)}/>
                    </div>

                    <div className="form-group">
                        <label>Confirm password</label>
                        <input type="password" name="password_confirmation" value={this.state.password_confirmation} className="form-control" placeholder="Enter password" onChange={(event) => this.handleChange(event)}/>
                    </div>

                    <button className="btn btn-primary btn-block" onClick={() => this.handleSubmit()}>Sign Up</button>
                </form>
        )
    }

    render() {
        if (this.state.isSignUpComplete) {
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
                        {this.drawSignUp()}   
                    </div>
                );   
            }
        }
    }
}