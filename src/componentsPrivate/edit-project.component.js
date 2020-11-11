import { Link, Redirect, withRouter } from "react-router-dom";
import "../components.css";
import React, { Component } from "react";
import Axios from "axios";

class EditProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {
                name: "",
                description: "",
                cost: "",
            },
            projectId: this.props.match.params.projectId,
            isSubmitted: false,
        }
    }

    componentDidMount() {
        this.fetchProjectData()
    }

    fetchProjectData() {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/enterprise/${this.props.companyId}/projects/${this.state.projectId}`,
            {
                headers: {
                    'Authorization': `Token ${this.props.userToken}`,
                }
            }
        )
            .then(res => {
                this.setState({
                    project: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
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

        Axios.patch(
            `${process.env.REACT_APP_BACKEND_URL}/api/enterprise/${this.props.companyId}/projects/${this.state.projectId}`,
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
                        isLoading: false,
                    })
                } else {
                    this.setState({
                        errorsContent: ['No se pudo editar el proyecto. Por favor intentelo mas tarde'],
                        showErrorBox: true,
                        isLoading: false,
                    })
                }
                console.log(err)
            })
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

    drawForm() {
        return (
            <form onSubmit={(event) => this.handleSubmit(event)}>
                <h1 className="project-title">Editar Proyecto</h1>

                <div className="form-group">
                    <label>¿Cúal es el nombre del proyecto?</label>
                    <input type="text" name="name" value={this.state.project.name} className="form-control" placeholder="Nombre del proyecto" onChange={(event) => this.handleChange(event)} />
                </div>

                <div className="form-group">
                    <label>¿De qué de trata el proyecto?</label>
                    <input type="text" name="description" value={this.state.project.description} className="form-control" placeholder="Descripción del proyecto" onChange={(event) => this.handleChange(event)} />
                </div>

                <div className="form-group">
                    <label>¿Cual es el costo del proyecto?</label>
                    <input type="number" name="cost" value={this.state.project.cost} className="form-control" placeholder="Costo del proyecto" onChange={(event) => this.handleChange(event)} />
                </div>

                {this.renderErrors()}

                <div className="row row-design">
                    <div className="column column-design table-padding">
                        <Link to={`/project/${this.state.projectId}`} className="btn btn-primary btn-block">Volver</Link>
                    </div>
                    <div className="column column-design table-padding">
                        <button type="submit" className="btn btn-primary btn-block">Guardar cambios</button>
                    </div>
                </div>
            </form>
        )
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
                <Redirect to={`/project/${this.state.projectId}`} />
            );
        }
    }

}

export default withRouter(EditProject)