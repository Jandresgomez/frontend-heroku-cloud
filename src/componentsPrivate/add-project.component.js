import { Redirect, withRouter } from "react-router-dom";
import "../components.css";
import React, { Component } from "react";
import Axios from "axios";

class AddProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {
                name: "",
                description: "",
                cost: "",
            },
            isSubmitted: false,
            errorsContent: [],
            showErrorBox: false,
        }
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        var projectData = this.state.project;
        projectData[name] = value;
        this.setState({
            project: projectData
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        Axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/enterprise/${this.props.companyId}/projects/`,
            this.state.project,
            {
                headers: {
                    'Authorization': `Token ${this.props.userToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            }
        )
        .then(res => {
            this.setState({
                isSubmitted: true
            })
        })
        .catch(err => {
            if (err.response) {
                var error_log = [];
                Object.keys(err.response.data).map((key) => {
                    err.response.data[key].forEach(val => {
                        error_log.push(val);
                    })
                })

                this.setState({
                    errorsContent: error_log,
                    showErrorBox: true,
                })
            } else {
                this.setState({
                    errorsContent: ['No se pudo crear el proyecto. Por favor intentelo mas tarde'],
                    showErrorBox: true,
                })
            }
            console.log(err)
        })
    }

    drawForm(){
        return(
            <form onSubmit={(event) => this.handleSubmit(event)}>
                    <h1 className="project-title">Añadir Proyecto</h1>

                    <div className="form-group">
                        <label>¿Cúal es el nombre del nuevo proyecto?</label>
                        <input type="text" name="name" className="form-control" placeholder="Nombre del proyecto" onChange={(event) => this.handleChange(event)}/>
                    </div>

                    <div className="form-group">
                        <label>¿De qué de trata el proyecto?</label>
                        <input type="text" name="description" className="form-control" placeholder="Descripción del proyecto" onChange={(event) => this.handleChange(event)}/>
                    </div>

                    <div className="form-group">
                        <label>¿Cual va a ser el costo del proyecto?</label>
                        <input type="number" name="cost" className="form-control" placeholder="Costo del proyecto"  onChange={(event) => this.handleChange(event)}/>
                    </div>

                    {this.renderErrors()}

                    <button type="submit" className="btn btn-primary btn-block">Crear proyecto</button>
                </form>
        )
    }

    renderErrors() {
        if (this.state.showErrorBox) {
            return (
                <div className="error-textbox">
                    {this.state.errorsContent.map((el) => <p>{el}</p>)}
                </div>
            );
        }
    }

    render() {
        if (!this.state.isSubmitted) {
            return (
                <div className="auth-inner-table">
                    {this.drawForm()}
                </div>
            );
        } else {
            return (
                <Redirect to="/projects"/>  
            );
        }
    }

} 

export default withRouter(AddProject)